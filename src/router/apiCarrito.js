//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import { Router } from 'express'
const routerCarrito = new Router()

let devuelvoError = (error,metodo,path) => {
    if (metodo) return ({error:error, descripcion: `La ruta http://${path} con el metodo ${metodo} no esta autorizada`})
    else return 'Carrito no encontrado'
}

import {ProductosDao as a} from '../daos/index.js'
import {CarritoDao as b} from '../daos/index.js'
import {default as config} from '../config.js'
import { createTransport } from "nodemailer";
const email= config.adminAccount.mail
const transporter = createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: email,
        pass: config.adminAccount.pass
    }
});

let administrador = false

let loadUser = (req,res,next) => {
    const {user} = req.query
    if(user == 'admin') {
        administrador= true
        next();
    }
    else {
        administrador= false
        next();
    }
}

// Configuracion para el envio de SMS
import twilio from 'twilio'
import logger from '../logs/logger.js'
const client = twilio(config.adminAccount.accountSid, config.adminAccount.authToken)



//Me permite listar todos los productos guardados en el carrito
routerCarrito.get('/:id/productos',loadUser, async (req,res)=> {
    if (!administrador)  res.status(401).json(devuelvoError(-1,req.method,req.headers.host+req.originalUrl))
    else {
        const {id}= req.params
        let carrrito=await b.getById(id)
        if(carrrito.length == 0) res.status(404).json(devuelvoError())
        else res.json(carrrito[0].producto)
    }
})

//Crea un carrito y devuelve su id.
routerCarrito.post('/',loadUser, async (req,res)=> {
    if (!administrador)  res.status(401).json(devuelvoError(-1,req.method,req.headers.host+req.originalUrl))
    else {
        const time = new Date()
        const nuevoCarrito = { producto: [], timestamp: time.toLocaleString() }
        res.json(await b.save(nuevoCarrito))
    }
})

//Para incorporar productos al carrito por su id, solo se envia el id de producto a agregar.
routerCarrito.post('/:id/productos',loadUser, async (req,res)=> {
    if (!administrador)  res.status(401).json(devuelvoError(-1,req.method,req.headers.host+req.originalUrl))
    else {
        const {id}= req.params
        let newProd = req.body.producto
        let carrito=await b.getById(id)
        const productos= await a.getAll()
        if(carrito.length == 0) res.status(404).json(devuelvoError())
        else {
            const productoIndex = productos.findIndex(p => p.id == newProd.id)
            if (productoIndex === -1) {
                res.json(`Error al actualizar carrito. Producto ID: ${newProd.id} no existe`)
            }
            newProd =  {
                    "nombre": productos[productoIndex].nombre,
                    "precio": productos[productoIndex].precio,
                    "descripcion": productos[productoIndex].descripcion,
                    "codigo": productos[productoIndex].codigo,
                    "Stock": productos[productoIndex].Stock,
                    "foto": productos[productoIndex].foto,
                    "timestamp": productos[productoIndex].timestamp,
                    "id": productos[productoIndex].id
                } 
            carrito[0].producto.push(newProd)   
            await b.update(id,carrito[0])
            res.json(await b.getById(id))
        }
    }
})

//Para confirmar el carrito.
//Me permite listar todos los productos guardados en el carrito
routerCarrito.post('/:id/confirmar/:user/:name/:tel',loadUser, async (req,res)=> {
    if (!administrador)  res.status(401).json(devuelvoError(-1,req.method,req.headers.host+req.originalUrl))
    else {
        const {id,user,name,tel}= req.params
        let carrrito=await b.getById(id)
        if(carrrito.length == 0) res.status(404).json(devuelvoError())
        else{ 
            // Envio correo al admin con la confirmacion de compra del carrito// 
            try{
                transporter.sendMail({
                from: 'Servidor@deNode.js',
                to: email,
                subject: `Nuevo pedido de ${name} (${user})` ,
                html: `DATOS:
                    ID Carrito: ${id},
                    Productos: ${JSON.stringify(carrrito[0].producto)}
                `})
            } catch(error){
            logger.error(error)
            }
            // Envio WhatsApp al admin con la confirmacion del carrito// 
            const optionsWP = {
            body: `Nuevo pedido de ${name} (${user}) 
DATOS:
    ID Carrito: ${id},
    Productos: ${JSON.stringify(carrrito[0].producto)}`,
            from: `whatsapp:${config.adminAccount.wpPhone}`,
            to: `whatsapp:${config.adminAccount.phone}`,
            }
            try {
                await client.messages.create(optionsWP)
                logger.info("WP Enviado al admin ok!")
            } catch (error) {
                logger.error(error)
            }
            // Envio SMS al cliente confirmando la compra del carrito// 
            const optionsSMS = {
                body: `Hola ${name}! Tu pedido id: ${id} fue recibido y se encuentra en proceso!`,
                from: config.adminAccount.smsPhone,
                to: `+549${tel}`
              }
            try {
                await client.messages.create(optionsSMS)
                logger.info("SMS Enviado al cliente ok!")
                } catch (error) {
                logger.error(error)
                }
            ///////////////////////////
            res.json(carrrito[0].producto)
        }
}})

//Vacía un carrito y lo elimina por su id
routerCarrito.delete('/:id',loadUser, async (req,res)=> {
    if (!administrador)  res.status(401).json(devuelvoError(-1,req.method,req.headers.host+req.originalUrl))
    else {
        const { id } = req.params
        let carrito=await b.getById(id)
        if(carrito.length == 0) {res.status(404).json(devuelvoError())}
        else  {
            await b.deleteById(id)
            res.json(`Producto ID: ${id} eliminado OK!`)
        }
    }
})

//Eliminar un producto del carrito por su id de carrito y de producto
routerCarrito.delete('/:id/productos/:id_prod',loadUser, async (req,res)=> {
    if (!administrador)  res.status(401).json(devuelvoError(-1,req.method,req.headers.host+req.originalUrl))
    else {
        const { id,id_prod } = req.params
        let carrito=await b.getById(id)
        if(carrito.length == 0) res.status(404).json(devuelvoError())
        else {
            const newCarrito = {producto: carrito[0].producto.filter(p => p.id != id_prod), timestamp: carrito[0].timestamp,id: id}
            await b.update(id,newCarrito)
            res.json(await b.getById(id))
        }
    }
})

export {routerCarrito}