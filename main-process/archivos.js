const uuid = require('uuid')
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const moment = require('moment')
const chokidar = require('chokidar');
const db = require('electron-db')
const locationDb = path.join(__dirname,'../database')
const {ipcRenderer} = require('electron')
const { logError } = require('./utils')
const { queueAdd } = require('./queues')
const { archivosFind } = require('../models/archivosModel')

const ttl_watch = 4 * 1000 // 4 segundos

/*
| Amazon web services
| ajustes
*/
AWS.config.apiVersions = {
    s3: '2006-03-01',
}
AWS.config.update({
    accessKeyId: process.env.VUE_AWS_ACCESSKEYID,
    secretAccessKey: process.env.VUE_AWS_SECRETACCESSKEY,
    region: process.env.VUE_AWS_REGION
})

/*
* Extensiones permitidas al sincronizar archivos
*/
let fileExtensions = [
    '.mp3',
    '.zip',
    '.rar',
    '.pdf',
    '.txt'
]

const imagesExtensions = [
    '.svg',
    '.png',
    '.jpg',
    '.jpeg',
    '.webp'
]

const videoExtensions = [
    '.mp4',
    '.mkv',
    '.webm'
]

const officeExtensions = [
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.odt'
]

const htmlExtensions = [
    '.vue',
    '.js',
    '.css',
    '.json',
    '.xml'
]

const potreExtensions = [
    '.bin',
    '.hrc',
    '.lax',
    '.las'
]

fileExtensions = fileExtensions
.concat(imagesExtensions)
.concat(videoExtensions)
.concat(officeExtensions)
.concat(potreExtensions)
.concat(htmlExtensions)


const getAwsS3 = ()=>{
    return new AWS.S3({
        apiVersion: '2006-03-01',
        //httpOptions :{timeout:604800000}
    })
}

const getHash = ()=>{
    return uuid.v4()
}

const getFileExt = (filePath='')=>{
    return path.extname(filePath)
}
const getFileName = (filePath='')=>{
    return path.basename(filePath)
}
/**
 * Subir archivo al amazon
 * @param {string} filePath ruta absoluta del archivo
 * @param {string} Key Nombre del archivo en el amazon
 * @returns {promise}
 */
const fileSyncAws = (filePath,Key)=>{
    const extension = getFileExt(filePath)
    if(!fileExtensions.includes(extension)){
        console.log(`Error archivo: ${filePath} no permitido`);
        return
    }

    let readStream = fs.createReadStream(filePath);

    readStream.on('data',(chunk)=>{
        //console.log(chunk.length);
    })

    readStream.on('error', (err)=>{
        console.error(err)
    });

    const params = { Bucket: 'mega-gbp', Key, Body: readStream}
    const options = { partSize: 5 * 1024 * 1024, queueSize: 1 }

    return getAwsS3().upload(params,options)
    .on('httpUploadProgress', (evt) => {
        const porcentaje =  (evt.loaded * 100 / evt.total).toFixed()
        //console.log('Completed ' + (evt.loaded * 100 / evt.total).toFixed() + '% of upload');
        //ipcRenderer.send('toMain',porcentaje)
        ipcRenderer.send('toArchivoProcesandoProgreso',{
            filePath,
            porcentaje,
            Key,
            loaded: evt.loaded
        })
    })
    .promise()
}

const errorPath = path.join(__dirname,'logs')

const writeLog = (err)=>{
    if(!fs.existsSync(errorPath)){
        fs.mkdirSync(errorPath)
    }
    const fileName = errorPath + '/' + moment().format('Y-MM-DD-HH-mm-ss') + getHash() + '.log'
    fs.writeFile(fileName,JSON.stringify(err),()=>{
        console.log('error monitoreado ')
    })
}
/**
 *
 * @param {string} filePath
 */
const localFileExists = (filePath)=>{
    //const stat = fs.fstatSync(filePath)
    if(fs.existsSync(filePath)) return true
    return false
}

/**
 *
 * @param {string} pathFile
 * @param {string} destination
 * @param {string} bucket
 */
//const copyFileToLocal = async(pathFile,destination,bucket='',fileSize=0)=>{
const copyFileToLocal = async(archivo,destination,bucket='')=>{
    const pathFile = archivo.ruta_aws
    const fileSize = archivo.peso * 1024
    let fileLoaded = 0

    destination = path.join(destination,pathFile)

    if(localFileExists(destination)) {
        return
    }
    ipcRenderer.send('toUnidadesSincronizandoArchivo',archivo)


    let obj = {}
    obj.Key = pathFile
    obj.Bucket = bucket



    let readStreamAws = await getAwsS3().getObject(obj).createReadStream()
    let writeStreamAws = fs.createWriteStream(destination)

    writeStreamAws.on('error',(err)=>{
        console.log('error sincronizando: ',pathFile,err);
    })

    writeStreamAws.on('finish',()=>{
        console.log('termino',destination);
    })


    readStreamAws.on('data',(chunk)=>{

        //fileLoaded += parseInt(chunk.length)
        fileLoaded += chunk.length
        const porcentaje = ((fileLoaded / fileSize ) * 100).toFixed(2)
        console.log(`${pathFile} porcentaje ${porcentaje}`);
        ipcRenderer.send('toMain',`${pathFile} porcentaje de descarga: ${porcentaje}`)

        ipcRenderer.send('toUnidadesSincronizandoArchivoProgreso',{
            loaded: fileLoaded,
            path: pathFile,
            progreso: porcentaje
        })

    })

    readStreamAws.pipe(writeStreamAws)
}

/**
 * Valida si la extension del archivo es permitido
 * @param {string} filePath Ruta absoluta del archivo
 * @return {boolean} verdadero o falso
 */
const fileIsAuthorize = (filePath)=>{
    let extension = getFileExt(filePath)
    if(fileExtensions.includes(extension)) return true
    return false
}
/**
 * Recuperar en un arreglo todas las rutas de los archivos
 * existentes
 * @param {string} pathFile ruta absoluta de una carpeta
 * @param {array} arreglo acumulado de rutas
 * @returns {array} arreglo con todas las rutas absolutas de los archivos
 */
const getFilesRecursive = (pathFile,arreglo=[])=>{
    const files = fs.readdirSync(pathFile)
    for (const file of files) {
        let pathAbsolute = path.join(pathFile,file)
        let isDirectory = fs.lstatSync(pathAbsolute).isDirectory()
        if(isDirectory) getFilesRecursive(pathAbsolute,arreglo)
        else arreglo.push(pathAbsolute)
    }
    return arreglo
}

/**
 * Recupera el INO de un archivo
 * @param  {string} pathFile ruta del archivo
 * @return {number} Identificador unico del archivo en el disco duro
 */
const getInoFolder = (pathFile)=>{
    let folder = getFolderFromFile(pathFile='')
    const stat = fs.statSync(folder)
    if(stat.ino) return stat.ino
    return null
}


/**
 * Recupera la ruta absoluta de la carpeta
 * en donde se localiza el archivo
 *
 * @param {string} pathFile ruta del archivo
 * @return {string} ruta absoluta de la carpeta
 */
const getFolderFromFile = (pathFile)=>{
    return path.dirname(pathFile)
}

/**
 *
 * @param {string} pathFile ruta absoluta del archivo
 * @return {string} carpeta en donde se encuentra el archivo
 */
const getFolderFromFile2 = (pathFile)=>{
    let ruta = path.dirname(pathFile)
    ruta = ruta.split(path.sep).pop()
    /*
    if(process.platform === 'win32'){ // cuando es en windos
        ruta = ruta.split('\\').pop()
    }else{ // cuando es en linux o mac
        ruta = ruta.split('/').pop()
    }
    */

    return ruta
}
/**
 *
 * @param {object} payload
 */
const archivosInsert = (payload)=>{

    //console.log(payload.ruta);

    return new Promise((resolve,reject)=>{
        let stat = fs.statSync(payload.ruta)

        db.getRows('archivos',locationDb,{ruta:payload.ruta},(succ,result)=>{
            //console.log('estado====>',succ,result,payload.ruta);
            if(!succ) return reject(result)
            if(result.length === 0){
                payload.id_hash = getHash()
                db.insertTableContent('archivos',locationDb,payload,(succ2,result2)=>{
                    if(!succ2){
                        return reject(result2)
                    }
                    return resolve(result2)
                })
            }else{
                resolve('ya se encuentra registrado')
            }

        })
    })
}

/*
* NO se verifica la existencia del archivo
*/
const archivosInsert2 = (payload)=>{
    return new Promise((resolve,reject)=>{
        const tabla = 'archivos'
        const where = {
            carpeta_id:payload.carpeta_id,
            ruta: payload.ruta
        }
        db.getRows(tabla,locationDb,where,(succ,result)=>{
            if(!succ) return reject(result)
            if(result.length === 0){
                payload.id = getHash()
                db.insertTableContent(tabla,locationDb,payload,(succ2,result2)=>{
                    if(!result2) return reject(result2)
                })
            }
            return resolve(true)
        })

    })

}

/**
 * Listar los archivos por id de la unidad
 * @param {number} unidad_id
 * @returns {promise} Arreglo con archivos
 */
const archivosGet = async (unidad_id)=>{
    const tabla = 'archivos'
    return new Promise((resolve,reject)=>{
        const where = {unidad_id}
        db.getRows(tabla,locationDb,where,(succ,result)=>{
            if(!succ) return reject(result)
            return resolve(result)
        })
    })
}

/**
 *
 * @param {String} route ruta absoluta para listar solo carpetas
 * @returns {Array<String>} listado de carpetas
 */
const getFoldersByRoute = (route,arreglo=[])=>{
    const rutas = fs.readdirSync(route)

    for (const ruta of rutas) {
        const routeAbsolute = path.join(route,ruta)
        const stat = fs.lstatSync(routeAbsolute)
        if(stat.isDirectory()){
            arreglo.push(routeAbsolute)
            getFoldersByRoute(routeAbsolute,arreglo)
        }
    }
    return arreglo
}

/**
 * Guardar una registro en la tabla de carpetas
 * @param {String} ruta
 * @param {Number} unidad_id
 * @returns {Promise}
 */
const foldersave = (unidad_id,padre_id,ruta)=>{
    return new Promise((resolve,reject)=>{

        const tabla = 'carpetas'

        let data = {
            id_hash: getHash(),
            unidad_id,
            ruta,
            nombre: getFolderName(ruta,2),
            es_carpeta:true,
            padre_id
        }

        const where = {
            ruta,
            unidad_id
        }

        db.getRows(tabla,locationDb,where,(succ,result)=>{
            if(!succ) reject(result)

            if(result.length === 0){
                // no existe la ruta co la unidad se procede a insertar
                db.insertTableContent(tabla,locationDb,data,(succ2,result2)=>{
                    if(!result2) return reject(result2)
                    resolve(data)
                })
            }else{
                resolve(data)
            }
        })
    })
}

/**
 * @param {Number} unidad_id
 * @param {Array<string>} folders
 * @returns {Promise<Array>}
 */
const foldersSave = async(unidad_id,folders)=>{
    const tabla = 'carpetas'
    let arreglo = []

    for (const folder of folders) {
        let registro = await foldersave(unidad_id,folder)
        arreglo.push(registro)
    }
    return arreglo;
}

const carpetasGetByUnidad = (unidad_id)=>{
    return new Promise((resolve,reject)=>{

        db.getRows('carpetas',locationDb,{unidad_id},(succ,result)=>{
            if(!succ) return reject(result)
            return resolve(result)
        })
    })
}

const archivosGetFolderId = (id_hash)=>{
    return new Promise((resolve,reject)=>{
        let response = []
        db.getRows('carpetas',locationDb,{padre_id:id_hash},(succ,result)=>{
            if(!succ) return reject(result)
            response = response.concat(...result)

            db.getRows('archivos',locationDb,{carpeta_id:id_hash},(succ2,result2)=>{
                //console.log(888888,succ);
                if(!succ2) return reject(result2)
                response = response.concat(...result2)
                //console.log(2222,response);
                return resolve(response)
            })
        })
    })
}
/**
 * retorna el nombre de la carpeta
 * @param {String} route
 * @param {Number} tipo 1=si es archivo 2=si es carpeta
 * @returns {String} retorna la carpeta
 */
const getFolderName = (filename,tipo=1)=>{
    let name = ''
    if(tipo === 1){
        name = path.dirname(filename).split(path.sep).pop()
    } else if(tipo === 2){
        name = path.basename(filename).split(path.sep).pop()
    }
    return name
}
/**
 *
 * @param {string} routePath
 */
const carpetasProcesar = (unidad_id,routePath)=>{
    return new Promise(async(resolve,reject)=>{

        let carpetas = fs.readdirSync(routePath)

        console.log('las carpetas',carpetas);

        let carpetas_items = []

        /*
        * volcar nivel padre
        */
        for (let carpeta of carpetas) {
            let routePathAbsolute = path.join(routePath,carpeta)
            let carpetaStat = fs.lstatSync(routePathAbsolute)

            if(carpetaStat.isDirectory()){
                let res = await foldersave(unidad_id,null,routePathAbsolute)
                carpetas_items.push(res)
            }
        }

        /*
        * volcar hijos
        */
        for (const item of carpetas_items) {
            try {
                //console.log(777,item);
                await kkk(item.ruta,item.id_hash)
            } catch (err) {
                console.log(`carpetasProcesar err linea 500 `);
                logError(err)
            }
        }
        resolve(true)
    })
}

const kkk = (ruta,id_hash)=>{
    return new Promise(async (resolve,reject)=>{

        let registros = fs.readdirSync(ruta)
        for (let row of registros) {
            let rutaAbsoluta = path.join(ruta,row)
            let rowStat = fs.lstatSync(rutaAbsoluta)
            if(rowStat.isDirectory()){ // volcar carpetas
                const eee = await folderByPath(ruta)
                //console.log(88888,rutaAbsoluta,eee.id_hash,'<--->',id_hash);
                let res = await foldersave(null,eee.id_hash,rutaAbsoluta)
                await kkk(rutaAbsoluta,res.id_hash)
            }else{ // volcar archivos
                // console.log(fileIsAuthorize(rutaAbsoluta),rutaAbsoluta);
                if(fileIsAuthorize(rutaAbsoluta)){
                    await archivosInsert({
                        ruta: rutaAbsoluta,
                        carpeta_id: id_hash,
                        nombre: getFileName(rutaAbsoluta),
                        ultima_modificacion: rowStat.mtime,
                        tamano: rowStat.size,
                        ino: (rowStat.ino).toString()
                    })
                }
            }
        }
        resolve(true)
    })
}

const folderByPath = (ruta)=>{
    return new Promise((resolve)=>{
        const tabla = 'carpetas'
        db.getRows(tabla,locationDb,{ruta},(succ,result)=>{
            if(!succ) return reject(result)
            if(result.length){
                return resolve(result[0])
            }
            return resolve({})
        })
    })
}

/**
 *
 * @param {number} unidad_id
 */
const getFoldersByunidad = (unidad_id)=>{
    return new Promise((resolve,reject)=>{
        const tabla = 'carpetas'
        db.getRows(tabla,locationDb,{unidad_id},(succ,result)=>{
            if(!succ) return reject(result)
            resolve(result)
        })
    })
}

/**
 *
 * @param {string} tabla
 * @returns {Promise<string>}
 */
const tablaLimpiar = async (tabla) => {
    return new Promise((resolve,reject)=>{
        db.clearTable(tabla,locationDb,(succ,result)=>{
            if(!succ) return reject(result)
            return resolve(result)
        })
    })
}

/**
 *
 * @param {string} mac del equipo
 * @returns {Promise.<Object>} objeto de unidad
 */
const getUnidadByMac = (mac)=>{
    return new Promise((resolve,reject)=>{
        db.getRows('unidades',locationDb,{mac},(succ,result)=>{
            if(!succ) return reject(result)
            if(result.length){
                return resolve(result[0])
            }
            return resolve({})
        })
    })
}
/**
 *
 * @param {*} routePath
 * @param {*} tipo 1=archivo 2=carpeta
 */
const inoGet = (routePath,tipo=1)=>{
    let ino = ''
    if(tipo === 1){// es archivo
        ino = fs.statSync(routePath).ino
    }else if (tipo === 2){ // es directorio
        let folderRoute = path.dirname(routePath)
        ino = fs.statSync(folderRoute).ino
    }
    return ino
}
/**
 *
 * @param {string} id_hash
 * @param {object} payload
 */
const archivoHistorialInsert = (ruta,payload)=>{
    return new Promise((resolve,reject)=>{
        db.updateRow('archivos',locationDb,{ruta},payload,(succ,result)=>{
            if(!succ) return reject(result)
            resolve(result)
        })
    })
}

/*
* Lunes 2020-10-19
*/
const carpetaInsert = (payload)=>{
    return new Promise((resolve,reject)=>{
        const tabla = 'carpetas'
        const where = {
            unidad_id: payload.unidad_id,
            ruta: payload.ruta
            //padre_id: payload.padre_id
        }
        db.getRows(tabla,locationDb,where,(succ,result)=>{
            if(!succ) return reject(result)
            if(result.length === 0){
                db.insertTableContent(tabla,locationDb,payload,(succ2,result2)=>{
                    if(!succ2) return reject(result2)
                    return resolve(payload)
                })
            }else{
                //console.log('carpeta no se inserto',payload);
            }
            return resolve(result[0])
        })

    })
}




// OJO no usar el numero de la bestia
let watcher = null

/**
 * Escuchar cambios en una carpeta
 * @param {string} pathFolder ruta absoluta de la carpeta a escuchar
 */
const watchFolder = (pathFolder)=>{
    if(watcher){
        watcher.close().then(() => console.log('closed'));
    }

    watcher = chokidar.watch(pathFolder, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true,
        ignoreInitial: true
    })

    watcher.on('add',(filePath,stats)=>{
        console.log('add',path,stats);

        archivosFind({ruta: filePath}).then(response=>{
            console.log(` busquerdaaaa`,response);
            if(respoose.length){
                const payload = {
                    id_hash: getHash(),
                    ruta: filePath,
                    evento: 'add',
                    created_at: +new Date(),
                    ...stats
                }

                queueAdd(payload).then((res)=>{
                    console.log('agregado al queue_archivos',res);
                    //ipcRenderer.send('toSyncQueue')
                })
            }else{
                console.log(`no existe el archivo debo agregarlo al archivos.json`);
            }
        }).catch(err=>{
            console.log(err);
        })




        // setTimeout(()=>{
        //     ipcRenderer.send('toSync')
        // },ttl_watch)
    })
    watcher.on('change',(path,stats)=>{
        const payload = {
            id_hash: getHash(),
            ruta: path,
            evento: 'change',
            created_at: +new Date(),
            ...stats
        }
        queueAdd(payload).then((res)=>{
            //console.log('agregado al queue_archivos',res);
            ipcRenderer.send('toSyncQueue')
        })
        console.log('change',path,payload);

    })
    watcher.on('unlink',(path)=>{
        console.log('unlink',path);
        const payload = {
            id_hash: getHash(),
            ruta: path,
            evento: 'unlink',
            created_at: +new Date()
        }
        queueAdd(payload).then((res)=>{
            console.log('agregado al queue_archivos',res);
        })
    })
    watcher.on('addDir',(path,stats)=>{
        console.log('addDir',path,stats);

        const payload = {
            id_hash: getHash(),
            ruta: path,
            evento: 'addDir',
            created_at: +new Date(),
            ...stats
        }
        queueAdd(payload).then((res)=>{
            console.log('agregado al queue_archivos',res);
        })

        // setTimeout(()=>{
        //     ipcRenderer.send('toSync')
        // },ttl_watch)
    })
    watcher.on('unlinkDir',(path)=>{
        console.log('unlinkDir',path);
        const payload = {
            id_hash: getHash(),
            ruta: path,
            evento: 'unlinkDir',
            created_at: +new Date(),
        }
        queueAdd(payload).then((res)=>{
            console.log('agregado al queue_archivos',res);
        })
    })
    watcher.on('ready',()=>{
        console.log('preparado escuchando cambios de los archivos');
    })
}

/**
 * Busca un archivo en la base de datos local
 * @param {string} ino Numero inode del archivo
 * @returns {promise}
 */
const archivoByIno = (ino)=>{
    return new Promise((resolve,reject)=>{
        const tabla = 'archivos'
        const where = {ino: (ino).toString()}
        db.getRows(tabla,locationDb,where,(succ,result)=>{
            if(!succ) return reject(result)
            if(result.length) return resolve(result[0])
            return resolve({})
        })
    })
}
/**
 *
 * @param {*} ino
 * @param {object} payload
 */
const archivoUpdateByIno = (ino,payload)=>{
    return new Promise((resolve,reject)=>{
        const tabla = 'archivos'
        let llave = ino
        if(typeof(llave) === 'number'){
            llave = (llave).toString()
        }
        const where = {ino: llave}
        db.updateRow(tabla,locationDb,where,payload,(succ,result)=>{
            if(!succ) return reject(result)
            return resolve(result)
        })
    })
}
/**
 *
 * @param {string} folderPath ruta absoluta de la carpeta
 */
const carpetaByPath = (folderPath)=>{
    return new Promise((resolve,reject)=>{
        db.getRows('carpetas',locationDb,{ruta: folderPath},(succ,result)=>{
            if(!succ) return reject(result)
            return resolve(result)
        })
    })
}

module.exports = {
    fileSyncAws,
    getHash,
    getFileName,
    getFileExt,
    getAwsS3,
    getFilesRecursive,
    getInoFolder,
    getFolderFromFile,
    getFolderFromFile2,
    getFolderName,
    getFoldersByunidad,
    getFoldersByRoute,
    getUnidadByMac,
    archivosInsert,
    archivosInsert2,
    archivosGet,
    archivoByIno,
    archivoHistorialInsert,
    archivosGetFolderId,
    archivoUpdateByIno,
    writeLog,
    copyFileToLocal,
    fileIsAuthorize,
    foldersSave,
    carpetasGetByUnidad,
    carpetasProcesar,
    carpetaInsert,
    carpetaByPath,
    tablaLimpiar,
    inoGet,
    imagesExtensions,
    videoExtensions,
    localFileExists,
    folderByPath,
    watchFolder,
}
