//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//-------------------------------------------------------------------
import fs from "fs"
import logger from '../logs/logger.js'

class ContenedorArchivo {
  constructor(path) {
    this.path = path;
  }

  async save(producto) {
    try {
      let productos = await this.getAll();
      const array = productos.map((x) => x.id);
      if (array.length == 0) {
        producto.id = 1;
      } else {
        producto.id = Math.max(...array) + 1;
      }
      productos.push(producto);
      productos = JSON.stringify(productos, null, 2);
      await fs.promises.writeFile(this.path, productos);
      return producto.id;
    } catch (error) {
      this.MuestroError(error, "save");
    }
  }

  async update(number, elem) {
    try {
      const elementos = await this.getAll()
      const index = elementos.findIndex(o => o.id == number)
      if (index == -1) throw new Error(`Error al actualizar id ${number}: elemento no encontrado`)
      else {
        elementos[index] = {...elem, id: Number(number)}
        await fs.promises.writeFile(this.path, JSON.stringify(elementos, null, 2));
        return await this.getById(number)
      }
    } catch (error) {
      this.MuestroError(error, "update");
    }
  }

  async getAll() {
    try {
      let contenido = await fs.readFileSync(this.path, this.encoding);
      if (contenido == "") {
        return [];
      }
      const array = JSON.parse(contenido);
      return array;
    } catch (error) {
      this.MuestroError(error, "getAll");
      return [];
    }
  }

  async getById(number) {
    try {
      const a = await this.getAll();
      let filtrado = a.filter((a) => a.id == number);
      if (!filtrado) filtrado = null;
      return filtrado;
    } catch (error) {
      this.MuestroError(error, "getById");
      return "Error en conseguir el id: " + number;
    }
  }


  async deleteById(number) {
    try {
      const a = await this.getAll();
      let b = a.filter((a) => a.id != number);
      if (b.length == 0) await fs.promises.writeFile(this.path, "");
      else {
        b = JSON.stringify(b, null, 2);
        await fs.promises.writeFile(this.path, b);
      }
      logger.info(`Borrado id: ${number} ok!`);
    } catch (error) {
      this.MuestroError(error, "deleteById");
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.path, "");
      logger.info("Borrado Completo ok!");
    } catch (error) {
      this.MuestroError(error, "deleteAll");
    }
  }

  MuestroError(error, fnName) {
    logger.error(`#!% --> Error en funcion ${fnName}:\n#!% --> ${error}`);
  }
}

export default ContenedorArchivo