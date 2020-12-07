const db = require('electron-db')
const path = require('path')
const locationDb = path.join(__dirname,'..','database')

const queueTabla = 'archivos_cola'

/**
 * agregar archivo a la cola
 * @param {object} payload 
 * @returns {promise}
 */
const queueAdd = (payload)=>{
    return new Promise((resolve,reject)=>{
        db.insertTableContent(queueTabla,locationDb,payload,(succ,result)=>{
            if(!succ) return reject(result)
            return resolve(result)
        })
    })
}


/**
 * Listar de local los archivos 
 * de la cola
 */
const queueList = ()=>{
    return new Promise((resolve,reject)=>{
        db.getAll(queueTabla,locationDb,(succ,result)=>{
            if(!succ) return reject(result)
            return resolve(result)
        })
    })
}
/**
 * Borrar un item de la cola de archivos a sincronizar
 * 
 * @param {object} condicion para borrar el item
 * @returns {promise}
 */
const queueRemove = (where)=>{
    return new Promise((resolve,reject)=>{
        db.deleteRow(queueTabla,locationDb,where,(succ,result)=>{
            if(!succ) return reject(result)
            return resolve(result)
        })
    })
}
module.exports = {
    queueAdd,
    queueList,
    queueRemove
}