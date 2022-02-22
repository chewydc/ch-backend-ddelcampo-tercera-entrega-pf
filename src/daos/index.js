//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import config from '../config.js'
import logger from '../logs/logger.js';

let CarritoDao
switch (process.env.CARRITO) {
    case 'file':
        const { default: CarritoDaoArchivo } = await import('./carritos/CarritoDaoArchivo.js')
        logger.info("Carrito persistirá en archivo local")
        CarritoDao = new CarritoDaoArchivo(config.fileSystem.path)
        break
    case 'firebase':
        const { default: CarritoDaoFirebase } = await import('./carritos/CarritoDaoFirebase.js')
        logger.info("Carrito persistirá en firebase")
        CarritoDao = new CarritoDaoFirebase()
        break
    case 'mongodb':
        const { default: CarritoDaoMongoDb } = await import('./carritos/CarritoDaoMongoDb.js')
        logger.info("Carrito persistirá en mongodb")
        CarritoDao = new CarritoDaoMongoDb()
        break
    default:
        const { default: CarritoDaoMemoria } = await import('./carritos/CarritoDaoMemoria.js')
        logger.info("Carrito persistirá en memoria")
        CarritoDao = new CarritoDaoMemoria()
        break
        
}

let ProductosDao

switch (process.env.PRODUCTOS) {
    case 'file':
        const { default: ProductosDaoArchivo } = await import('./productos/ProductosDaoArchivo.js')
        logger.info("Productos persistirá en arhivo local")
        ProductosDao = new ProductosDaoArchivo(config.fileSystem.path)
        break
    case 'firebase':
        const { default: ProductosDaoFirebase } = await import('./productos/ProductosDaoFirebase.js')
        logger.info("Productos persistirá en firebase")
        ProductosDao = new ProductosDaoFirebase()
        break
    case 'mongodb':
        const { default: ProductosDaoMongoDB } = await import('./productos/ProductosDaoMongoDb.js')
        logger.info("Productos persistirá en mongoDB")
        ProductosDao = new ProductosDaoMongoDB()
        break
    default:
        const { default: ProductosDaoMemoria } = await import('./productos/ProductosDaoMemoria.js')
        logger.info("Productos persistirá en memoria")
        ProductosDao = new ProductosDaoMemoria()
        break
}

let UsuariosDao
const { default: UsuariosDaoMongoDB } = await import('./usuarios/UsuariosDaoMongoDB.js')
logger.info("Usuarios persistirá en MongoDB")
UsuariosDao = new UsuariosDaoMongoDB()

export { ProductosDao,CarritoDao,UsuariosDao }