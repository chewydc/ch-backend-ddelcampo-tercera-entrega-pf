//-------------------------------------------------------------------
// PROYECTO FINAL
// Fecha de Tercera Entrega: 15-02-22
// Alumno: Damian del Campo
//------------------------------------------------------------------- 
import mongoose from 'mongoose'
import {default as config} from '../config.js'
import logger from '../logs/logger.js'

await mongoose.connect(config.mongodb.url, config.mongodb.options)

class ContenedorMongoDB {

  constructor(nombreColeccion, esquema) {
    this.coleccion = mongoose.model(nombreColeccion, esquema)
  }

  async save(elem) {
    try {
      let elementos = await this.coleccion.find()
      let newId
      if (elementos.length == 0) {
        newId = 1
      } else {
        newId = elementos[elementos.length - 1].id + 1
      }
      const newElem = { ...elem, id: newId }
      const prodm = new this.coleccion(newElem)
      await prodm.save()
      return newElem.id;
    } catch (error) {
      this.MuestroError(error, "save");
    }
  }

  async getAll() {
    try {
      let contenido = await this.coleccion.find()
      return contenido;
    } catch (error) {
      this.MuestroError(error, "getAll");
      return [];
    }
  }

  async getById(number) {
    try {
      let producto = await this.coleccion.find({ id: number })
      if (!producto) producto = null
      return producto
    } catch (error) {
      this.MuestroError(error, "getById");
      return "Error en conseguir el id: " + number;
    }
  }

  async deleteById(number) {
    try {
      await this.coleccion.deleteOne({ id: number })
      logger.info(`Borrado id: ${number} ok!`);
    } catch (error) {
      this.MuestroError(error, "deleteById");
    }
  }

  async update(number,elem) {
    try {
      await this.coleccion.findOneAndUpdate({id: number}, elem,{new: true})
      logger.info(`Update id: ${number} ok!`);
    } catch (error) {
      this.MuestroError(error, "update");
      return "Error en conseguir el id: " + number;
    }
  }

  async deleteAll() {
    try {
      await this.coleccion.deleteMany()
      logger.info("Borrado Completo ok!");
    } catch (error) {
      this.MuestroError(error, "deleteAll");
    }
  }

  MuestroError(error, fnName) {
    logger.error(`#!% --> Error en funcion ${fnName}:\n#!% --> ${error}`);
  }
}

export default ContenedorMongoDB