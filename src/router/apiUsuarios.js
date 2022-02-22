//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import { Router } from 'express'
import {default as userModel} from '../daos/usuarios/UsuariosMongoDB.js'
import multer from 'multer'
import * as mime from 'mime-types'
import logger from '../logs/logger.js';
import { createTransport } from "nodemailer";
import {default as config} from '../config.js'


const routerUsuarios = new Router()

// Configuracion Subida de archivos local

let fileName=null
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    let ext = mime.extension(file.mimetype);
    let randomfileid = Date.now();
    fileName=`${randomfileid}.${ext}`
    cb(null, fileName)
  }
})
const upload = multer({ storage })

// Configuracion envio de mail

const email= config.adminAccount.mail
const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: email,
        pass: config.adminAccount.pass
    }
});


let devuelvoError = (error,metodo,path) => {
    if (metodo) return ({error:error, descripcion: `La ruta http://${path} con el metodo ${metodo} no esta autorizada`})
    else return 'Usuario no encontrado'
}
//Estrategia API Get User (para mostrar el nombre de usuario en plantillas login/logout)
routerUsuarios.get('/user', (req, res) => {
    if (!req.user) {res.status(404).json(devuelvoError())}
    else res.json(req.user.username)
})

//Me permite listar todos los usuarios disponibles ó un usuario por su id
routerUsuarios.get('/:username',async (req,res)=> {
        const {username}= req.params
        let b=await userModel.find({username: username})
        if(b.length == 0) {res.status(404).json(devuelvoError())}
        else{res.json(b)}
})


//Actualiza un usuario por su username
routerUsuarios.put('/:username', async (req,res)=> {
    const { username } = req.params
    const { nombre,edad,direccion,telefono } = req.body
    logger.info(req.body)
    let userUpdate = await userModel.findOneAndUpdate({username: username},{nombre: nombre,edad: edad,direccion: direccion,telefono: telefono})
    if(!userUpdate) res.status(404).json(devuelvoError())
    else {
        res.json(await userModel.find({username: username}))}
})

routerUsuarios.post('/register',upload.single('myFile'), (req,res,next)=> {
    const { nombre,edad,direccion,telefono, username, password } = req.body
    const time = new Date()
    userModel.register({ nombre: nombre,edad: edad,direccion: direccion,telefono: telefono,username: username, foto: fileName,timestamp: time.toLocaleString(), active: false }, password, function (err, user) {
        if (err) {
          logger.error(err)
          logger.error(`Error al registrar el usuario #${username}`)
          res.redirect('/register-error')
        } else {
          logger.info(`Alta nuevo usuario: ${username}` )
        // Envio correo al admin alta de usuario// 
          try{
            transporter.sendMail({
                from: 'Servidor@deNode.js',
                to: email,
                subject: `Alta nuevo usuario ${username}`,
                html: `DATOS:
                  nombre: ${nombre},
                  edad: ${edad},
                  direccion: ${direccion},
                  telefono: ${telefono},
                  username: ${username},
                  foto: ${fileName}
                `})
          } catch(error){
            console.log(error)
          }
        ///////////////////////////
          res.redirect('/login')
        }
      })
})

export {routerUsuarios}