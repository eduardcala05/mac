const db = require('electron-db')
const path = require('path')
const dbLocation = path.join('..','database')

const tableName = 'archivos'

/**
 * Buscar archivos 
 * @param {object} where 
 */
const archivosFind = (where={})=>{
    return new Promise((resolve,reject)=>{
        db.getRows(tableName,dbLocation,where,(succ,result)=>{
            if(!succ) return reject(value)
            return resolve(result)
        })
    })
}

module.exports = {
    archivosFind
}