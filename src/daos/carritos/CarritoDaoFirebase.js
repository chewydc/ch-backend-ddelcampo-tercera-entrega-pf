//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import ContenedorFirebase from '../../contenedores/ContenedorFirebase.js'

class CarritoDaoFirebase extends ContenedorFirebase {
    constructor(){
        super('carritos')
    }
}

export default CarritoDaoFirebase