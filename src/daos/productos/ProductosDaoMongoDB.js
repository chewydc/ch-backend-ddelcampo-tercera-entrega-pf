//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import ContenedorMongoDB from '../../contenedores/ContenedorMongoDB.js'

class ProductosDaoMongoDB extends ContenedorMongoDB {
    constructor(){
        super("productos", {
            nombre: {type: String, required: true},
            precio: {type: Number, required: false},
            descripcion: {type: String, required: false},
            codigo: {type: Number, required: false},
            Stock: {type: Number, required: false},
            foto: {type: String, required: false},
            timestamp: {type: String, required: false},
            id: {type: Number, required: true, unique: true}
        })
    }
}

export default ProductosDaoMongoDB