//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import Router from 'express'
import {ProductosDao as a} from '../daos/index.js'

const routerProductos = new Router()

let devuelvoError = (error,metodo,path) => {
    if (metodo) return ({error:error, descripcion: `La ruta http://${path} con el metodo ${metodo} no esta autorizada`})
    else return 'Producto no encontrado'
}

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

//Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
routerProductos.get('/',async (req,res)=> res.json(await a.getAll()))
routerProductos.get('/:id',loadUser, async (req,res)=> {
    if (!administrador)  res.status(401).json(devuelvoError(-1,req.method,req.headers.host+req.originalUrl))
    else {
        const {id}= req.params
        let b=await a.getById(id)
        if(b.length == 0) {res.status(404).json(devuelvoError())}
        else{res.json(b)}
    }
})

//Para incorporar productos al listado (disponible para administradores)
routerProductos.post('/',loadUser, async (req,res)=> {
    if (!administrador)  res.status(401).json(devuelvoError(-1,req.method,req.headers.host+req.originalUrl))
    else {
        const time = new Date()
        const nuevoProducto = { ...req.body, timestamp: time.toLocaleString() }
        res.json(`Nuevo producto ID: ${await a.save(nuevoProducto)} cargado OK!`)
    }
})

//Actualiza un producto por su id (disponible para administradores)
routerProductos.put('/:id',loadUser, async (req,res)=> {
    if (!administrador)  res.status(401).json(devuelvoError(-1,req.method,req.headers.host+req.originalUrl))
    else {
        const { id } = req.params
        const time = new Date()
        const nuevoProducto = { ...req.body, timestamp: time.toLocaleString() }
        let producto=await a.getById(id)
        if(producto.length == 0) res.status(404).json(devuelvoError())
        else {
            await a.update(id,nuevoProducto)
            res.json(await a.getById(id))
            } 
        }
})

//Borra un producto por su id (disponible para administradores)
routerProductos.delete('/:id',loadUser, async (req,res)=> {
    if (!administrador)  res.status(401).json(devuelvoError(-1,req.method,req.headers.host+req.originalUrl))
    else {
        const { id } = req.params
        let b=await a.getById(id)
        if(b.length == 0) {res.status(404).json(devuelvoError())}
        else  {
            await a.deleteById(id)
            res.json(`Producto ID: ${id} eliminado OK!`)
        }
    }
})

export {routerProductos}