//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const socket = io.connect();

////////////////////////////////////////////////////////
// Genero un nuevo carrito para la sesion en curso
let idCarrito= 0
generaCarrito().then( (r) => idCarrito=r)
////////////////////////////////////////////////////////
// Genero Banner con Menu
bannerUsuario()

//---------------------------------------
// Manejo de eventos entrantes al cliente
//---------------------------------------
socket.on('updateProd', () => {
    console.log(socket.id + " <-- Nuevo evento updateProd")
    listarProductos() 
});
socket.on('updateProd', () => {
    console.log(socket.id + " <-- Nuevo evento updateProd")
    listarProductos() 
});
socket.on('compraCarrito', () => {
    console.log(socket.id  + " <-- Nuevo evento compraCarrito")
    generaCarrito().then( (r) => idCarrito=r)
    cargaCarritoConfirmado() 
});
socket.on('updateCarrito', () => {
    console.log(socket.id  + " <-- Nuevo evento updateCarrito")
    cargaCarrito() 
});
socket.on('updateUser', () => {
    console.log(socket.id + " <-- Nuevo evento updateUser")
    cargaPerfil() 
});
////////////////////////////////////////////////////////
// Productos
async function buscarProductos() {
    return fetch('/api/productos')
        .then(prod => prod.json())
}
async function buscarProducto(id) {
    return fetch(`/api/productos/${id}?user=admin`) //FIJO EL USUARIO ADMIN
        .then(prod => prod.json())
}
async function cargaProd() {
    const form = document.querySelector('form');
    const data = { 
        nombre:form[0].value,
        precio: form[1].value,
        descripcion: form[2].value,
        codigo: form[3].value,
        Stock: form[4].value,
        foto: form[5].value
    };
    fetch('/api/productos?user=admin', {     //FIJO EL USUARIO ADMIN
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(socket.emit('updateProd', 'Se cargo nuevo Producto!')
        )
        .catch(error => console.error(error))
}
async function actualizarProd(id) {
    const form = document.querySelector('form');
    const data = { 
        nombre:form[0].value,
        precio: form[1].value,
        descripcion: form[2].value,
        codigo: form[3].value,
        Stock: form[4].value,
        foto: form[5].value
    };
    fetch(`/api/productos/${id}?user=admin`, {     //FIJO EL USUARIO ADMIN
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(data)
        })
        .then(socket.emit('updateProd', `Se actualizo el producto id: ${id}`))
        .catch(error => console.error(error))
}
async function eliminarProd(id){
    fetch(`/api/productos/${id}?user=admin`, {     //FIJO EL USUARIO ADMIN
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        })
        .then(socket.emit('updateProd', `Se elimino el producto id: ${id}`))
        .catch(error => console.error(error))
}
async function listarProductos() {
    const plantillaProd = await buscarPlantillaProducto()
    const productos = await buscarProductos()
    const html = armarHTMLproductos(plantillaProd, productos)
    document.getElementById('productos').innerHTML = html
}
async function cargaPaginaProd(mostrarFormCarga) {
    const plantillaCarga = await buscarPlantillaCargaProd()
    const html = armarHTMLcarga(plantillaCarga,mostrarFormCarga)
    document.getElementById('carga').innerHTML = html
}
async function cargaActualizaProd(id) {
    const plantillaAct = await buscarPlantillaActProd()
    const prod = await buscarProducto(id)
    const html = armarHTMLactualizaProd(plantillaAct,prod)
    document.getElementById('carga').innerHTML = html
}
function buscarPlantillaProducto() {
    return fetch('/plantillas/productos.hbs')
        .then(respuesta => respuesta.text())
}
function buscarPlantillaCargaProd() {
    return fetch('/plantillas/carga.hbs')
        .then(respuesta => respuesta.text())
}
function buscarPlantillaActProd() {
    return fetch('/plantillas/actualizaProd.hbs')
        .then(respuesta => respuesta.text())
}
function armarHTMLproductos(plantillaProd, productos) {
     const render = Handlebars.compile(plantillaProd);
     const html = render({ productos })
    return html
}
function armarHTMLcarga(plantillaCarga,mostrarFormCarga) {
    const render = Handlebars.compile(plantillaCarga);
    const html = render({ mostrarFormCarga })
   return html
}
function armarHTMLactualizaProd(plantillaAct,prod) {
    const render = Handlebars.compile(plantillaAct);
    const html = render({ prod })
   return html
}


////////////////////////////////////////////////////////
// Carrito
async function buscarProdCarrito(idCarrito) {
    return fetch(`/api/carrito/${idCarrito}/productos?user=admin`) //FIJO EL USUARIO ADMIN
        .then(prod => prod.json())
}

async function generaCarrito(){
    return fetch(`/api/carrito?user=admin`, {     //FIJO EL USUARIO ADMIN
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
        })
        .then( response => response.json())
        .catch(error => console.error(error))
}

async function agregarProdCarrito(id_prod){
    console.log("idCarrito en agrega: "+ idCarrito)
    const data = { producto: {id: id_prod}}
    fetch(`/api/carrito/${idCarrito}/productos?user=admin`, {     //FIJO EL USUARIO ADMIN
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
        })
    .then(socket.emit('updateCarrito', `Se agrego Producto id ${id_prod} al Carrito id ${idCarrito}!`))
    .catch(error => console.error(error))
}
async function eliminarProdCarrito(id_prod){
    fetch(`/api/carrito/${idCarrito}/productos/${id_prod}?user=admin`, {     //FIJO EL USUARIO ADMIN
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'DELETE',
        })
    .then(socket.emit('updateCarrito', `Se elimino Producto id ${id_prod} del Carrito id ${idCarrito}!`))
    .catch(error => console.error(error))
}
async function cargaCarrito() {
    console.log("id carrito: " + idCarrito)
    const prods_carrito = await buscarProdCarrito(idCarrito)
    const plantillaCarrito = await buscarPlantillaCarrito()
    const html = armarHTMLcarrito(plantillaCarrito,prods_carrito,idCarrito)
    document.getElementById('carrito').innerHTML = html
}
async function cargaCarritoConfirmado() {
    console.log("id carrito: " + idCarrito)
    const prods_carrito_conf = await buscarProdCarrito(idCarrito)
    const plantillaCarrito_conf = await buscarPlantillaCarritoConfirmado()
    const html = armarHTMLcarrito(plantillaCarrito_conf,prods_carrito_conf,idCarrito)
    document.getElementById('carrito').innerHTML = html
}
function buscarPlantillaCarrito() {
    return fetch('/plantillas/carrito.hbs')
        .then(respuesta => respuesta.text())
}
function buscarPlantillaCarritoConfirmado() {
    return fetch('/plantillas/carrito_confirmado.hbs')
        .then(respuesta => respuesta.text())
}
function armarHTMLcarrito(plantillaCarrito,prods_carrito,idCarrito) {
    const render = Handlebars.compile(plantillaCarrito);
    const html = render({ prods_carrito, idCarrito })
   return html
}
async function confirmarCarrito(idCarrito){
    const username = await buscarUsuario()
    const user_Info = await buscarInfoUsuario(username)
    fetch(`/api/carrito/${idCarrito}/confirmar/${username}/${user_Info[0].nombre}/${user_Info[0].telefono}?user=admin`, {     //FIJO EL USUARIO ADMIN
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        })
    .then(socket.emit('compraCarrito', `Se confirmo la compra del Carrito id ${idCarrito}!`))
    .catch(error => console.error(error))
}
////////////////////////////////////////////////////////
// Banner Usuario
function buscarUsuario() {
    return fetch('/api/usuarios/user')
        .then(msjs => msjs.json())
}
async function bannerUsuario() {
    const plantillaUser = await buscarPlantillaUsuario()
    const user = await buscarUsuario()
    const htmluser = armarHTMLuser(plantillaUser,user)
    document.getElementById('banner').innerHTML = htmluser
}
function buscarPlantillaUsuario() {
    return fetch('/plantillas/banner.hbs')
        .then(respuesta3 => respuesta3.text())
}
function armarHTMLuser(plantillaUser,user) {
    const render = Handlebars.compile(plantillaUser,user);
    const html = render({ user })
   return html
}
////////////////////////////////////////////////////////
// Perfil usuario
function buscarInfoUsuario(userPerfil) {
    return fetch(`/api/usuarios/${userPerfil}`)
        .then(respInfoUser => respInfoUser.json())
}
async function cargaPerfil() {
    const plantillaPerfilUser = await buscarPlantillaInfoUsuario()
    const userPerfil = await buscarUsuario()
    const user_Info = await buscarInfoUsuario(userPerfil)
    const html = armarHTMLPerfilUser(plantillaPerfilUser,user_Info)
    document.getElementById('perfil').innerHTML = html
}
function buscarPlantillaInfoUsuario() {
    return fetch('/plantillas/perfil.hbs')
    .then(respuesta => respuesta.text())
}
function armarHTMLPerfilUser(plantillaPerfilUser,user_Info) {
    const render = Handlebars.compile(plantillaPerfilUser,user_Info);
    const html = render({ user_Info })
   return html
}
function actualizaPerfilUsuario(userPerfil) {
    const form = document.querySelector('form');
    const data = { 
        nombre:form[0].value,
        edad: form[1].value,
        direccion: form[2].value,
        telefono: form[3].value
    };
    fetch(`/api/usuarios/${userPerfil}`, { 
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(data)
        })
        .then(socket.emit('updateUser', `Se actualizo el Usuario: ${userPerfil}`))
        .catch(error => console.error(error))
}
////////////////////////////////////////////////////////