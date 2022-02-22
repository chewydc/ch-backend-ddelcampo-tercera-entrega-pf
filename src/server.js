//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import express from 'express'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config({path: path.resolve('./.env')})

import { Server as HttpServer } from 'http'
import { Server as IOServer } from 'socket.io'
import cluster from 'cluster'
import os from 'os'
import logger from './logs/logger.js';

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

import passport from 'passport'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import {default as config} from './config.js'
import {default as userModel} from './daos/usuarios/UsuariosMongoDB.js'

//-------------------------------------------------------------------
// Seteo la Session
app.use(
  session({
      //Persistencias de sesiones en MongoDB Atlas
      store: MongoStore.create({
      mongoUrl: config.mongodb.url,
      mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true }
      }),
    secret: process.env.SESSION_SECRET_KEY || 'keysecret',
    resave: false,
    saveUninitialized: true,  
    cookie: {
      maxAge: 600000
    }
  })
);
app.use(passport.initialize())
app.use(passport.session())

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

// Setting up the passport plugin
passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

//-------------------------------------------------------------------
//Declaro Routers a utilizar
import {routerProductos} from "../src/router/apiProductos.js"
import {routerCarrito} from "../src/router/apiCarrito.js"
import {routerWeb} from "../src/router/webpage.js"
import {routerUsuarios} from "../src/router/apiUsuarios.js"

app.use('/api/productos',routerProductos)
app.use('/api/carrito',routerCarrito)
app.use('/api/usuarios',routerUsuarios)
app.use('/',routerWeb)



//-------------------------------------------------------------------
//Manejo de websockets
io.on('connection', clientSocket => {
  logger.info(`#${clientSocket.id} se conectó`)
  io.emit('updateProd')
  clientSocket.on('updateProd', (msj) => {
    logger.info(`Server <-- ${msj}`)
    io.sockets.emit('updateProd')
  })
  clientSocket.on('updateCarrito', (msj) => {
    logger.info(`Server <-- ${msj}`)
    clientSocket.emit('updateCarrito')
  })
  clientSocket.on('compraCarrito', (msj) => {
    logger.info(`Server <-- ${msj}`)
    clientSocket.emit('compraCarrito')
  })
})



//----------------------------------------------------------
// Seteo configuracion ingresado por linea de comando
import parseArgs from 'minimist';
const options = {
    alias: {
        p: 'puerto',
        m: 'modo'
        },
    default: {
        puerto: process.env.SERVER_PORT || 8080,
        modo: process.env.SERVER_MODO || 'FORK'
    }
}
const commandLineArgs = process.argv.slice(2);
const { puerto, modo, _ } = parseArgs(commandLineArgs, options);
logger.info({ puerto, modo, otros: _ });

//----------------------------------------------------------
// Cargo el server
if(modo=='CLUSTER' && !cluster.isWorker) {
  const numCPUs = os.cpus().length
  
  logger.info(`Número de procesadores: ${numCPUs}`)
  logger.info(`PID MASTER ${process.pid}`)

  for(let i=0; i<numCPUs; i++) {
      cluster.fork()
  }

  cluster.on('exit', worker => {
    logger.info('Worker', worker.process.pid, 'died', new Date().toLocaleString())
      cluster.fork()
  })
}

else {
  const server = httpServer.listen(puerto, () => {
    logger.info(`Servidor HTTP escuchando en el puerto ${server.address().port} - PID WORKER ${process.pid}`)
    })
    server.on("error", error => logger.error(`Error en servidor ${error}`))
}