//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------

import ContenedorMongoDB from '../../contenedores/ContenedorMongoDB.js'

class UsuariosDaoMongoDB extends ContenedorMongoDB {
    constructor(){
        super("users", {
            nombre: {type: String, required: true},
            edad: {type: Number, required: false},
            direccion: {type: String, required: false},
            telefono: {type: String, required: false},
            username: {type: String, required: true},
            password: {type: String, required: true},
            foto: {type: String, required: false},
            timestamp: {type: String, required: false}
        })
    }
}

export default UsuariosDaoMongoDB