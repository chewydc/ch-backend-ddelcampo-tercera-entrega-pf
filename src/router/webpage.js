//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import express from 'express'
import Router from 'express'
import connectEnsureLogin from 'connect-ensure-login'
import passport from 'passport'
import logger from '../logs/logger.js';

const routerWeb = new Router()

routerWeb.use(express.json())
routerWeb.use(express.urlencoded({ extended: true }))

/******************  ROUTES  ******************/
//Estrategia Home Page
routerWeb.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile('index.html', { root: './public/home' })}
)

routerWeb.get('/info', (req, res) => {
    res.sendFile('info.html', { root: './public/login' })
})

// Estrategia de Login
routerWeb.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './public/login' })
})

routerWeb.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login-error', successRedirect: '/' })
)


// Estrategia de Register
routerWeb.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './public/login' })
})

// Estrategia de Register Error
routerWeb.get('/register-error', (req, res) => {
  res.sendFile('register-error.html', { root: './public/login' })
})

// Estrategia de LOGOUT
routerWeb.get('/logout-despedida', (req, res) => {
  res.sendFile('logout.html', { root: './public/login' })
})
routerWeb.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

// Estrategia de Login Error
routerWeb.get('/login-error', (req, res) => {
  res.sendFile('login-error.html', { root: './public/login' })
})

// Estrategia de Logueo ruta desconocida
routerWeb.get('*', (req, res) => {
  const { url, method } = req
  logger.warn(`Ruta ${method} ${url} no implementada`)
  res.status(404).send(`Ruta ${method} ${url} no está implementada`)
})

export {routerWeb}