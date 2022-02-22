//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------

import mongoose from 'mongoose';
import config from '../../config.js';
import passportLocalMongoose from 'passport-local-mongoose';

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

// Connecting Mongoose
mongoose.connect(config.mongodb.url, advancedOptions)

// Setting up the schema
const User = new mongoose.Schema({
    nombre: String,
    edad: Number,
    direccion: String,
    telefono: Number,
    username: String,
    password: String,
    foto: String,
    timestamp: String
});


// Setting up the passport plugin
User.plugin(passportLocalMongoose);
let userModel =  mongoose.model('User', User);

export default userModel;