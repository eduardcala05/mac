const {axios} = require('./axios')
const db = require('electron-db')
const path = require('path')
const {getHash} = require('../main-process/archivos')
const locationDb = path.join(__dirname,'../database')

/**
 * @returns {Promise} arreglo con las unidades
 */
const unidadesGet = async()=>{
    return new Promise((resolve,reject)=>{
        const tabla = 'unidades'
        db.getAll(tabla,locationDb,(succ,result)=>{
            if(!succ) return reject(result)
            return resolve(result)
        })
    })
}

/**
 * buscar una unidad por mac
 * @param {string} mac de la unidad
 * @returns
 */
const unidadesByMac = async(mac)=>{
    return new Promise((resolve,reject)=>{
        db.getRows('unidades',locationDb,{ mac },(succ,result)=>{
            if(!succ){
                console.log('error consultadno');
                return reject(result)
            }
            resolve(result)
        })
    })
}

const unidadesInsert = async(payload)=>{
    return new Promise((resolve,reject)=>{

        const tabla = 'unidades'

        const where = {mac: payload.mac}

        db.getRows('unidades',locationDb,where,(succ,result)=>{

            if(!succ) return reject(result)


            if(result.length === 0){ // no existe
                payload.id_hash = getHash()
                payload.timestamp = +new Date()

                db.insertTableContent(tabla,locationDb,payload,(succ2,result2)=>{
                    if(!succ2) return reject(result2)

                    return resolve('Unidad creada.')
                })
            }else{



                db.updateRow(tabla,locationDb,where,payload,(succ2,result2)=>{
                    if(!succ2) return reject(result2)
                })

                return resolve('ya existe no inserto')
            }
        })

    })
}
const unidadesUpdate = (mac,payload)=>{
    return new Promise((resolve,reject)=>{
        db.updateRow('unidades',locationDb,{mac},payload,(succ,result)=>{
            if(!succ) return reject(result)
            resolve(result)
        })
    })
}
const unidadesMacExists = (mac)=>{
    try {
        return axios(`/v2/unidades/mac/${mac}/existe`)
    } catch (error) {
        console.log('axios error unidadesToMacExists unidades.js linea 111');
    }
}

const unidadesSyncToLocal = ()=>{
    return new Promise((resolve,reject)=>{
        axios(`/v2/unidades`).then(async({data:unidadesData})=>{

            for (const unidad of unidadesData) {
                unidad.id_db = unidad.id
                try {
                    await unidadesInsert(unidad)
                } catch (error) {
                    console.log(`unidadesInsert err linea 167`);
                }
            }

            resolve(unidadesData)
        }).catch(err=>{
            console.log(`unidadesSyncToLocal. err linea 166`);
            reject(err)
        })
    })
}

module.exports = {
    unidadesGet,
    unidadesInsert,
    unidadesByMac,
    unidadesUpdate,
    unidadesMacExists,
    unidadesSyncToLocal
}
