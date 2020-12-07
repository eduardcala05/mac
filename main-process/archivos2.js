const fs = require('fs')
const {ipcRenderer} = require('electron')
const {axios} = require('./axios')
const {logError} = require('./utils')
const {unidadesInsert,unidadesUpdate}  = require('./unidades')
const moment = require('moment')
const {
    carpetasProcesar,
    getUnidadByMac,
    getFoldersByunidad,
    getFilesRecursive,
    fileIsAuthorize,
    inoGet,
    getFolderFromFile2,
    getFolderFromFile,
    getFileName,
    getFileExt,
    fileSyncAws,
    archivoHistorialInsert
} = require('./archivos')

const { serialHddGet } = require('./disco')

const archivosSyncLocal = (event,args)=>{
    return new Promise(async(resolve,reject)=>{
            
        const mac = serialHddGet()

        axios(`/v2/unidades`).then(async({data:dataUnidades})=>{
            let unidadUsuario = {}
            for (const unidad of dataUnidades) {
                if(!unidad.ruta_archivos) continue

                try {

                    if(unidad.mac === mac){
                        unidadUsuario = unidad
                        await unidadesUpdate(mac,unidad)
                    }else{
                        await unidadesInsert(unidad)
                    }

                } catch (err) {
                    logError(err)
                    console.log('archivosSyncLocal error linea 51');
                }
            }

            if(unidadUsuario.id){

                try {
                    await carpetasProcesar(unidadUsuario.id,unidadUsuario.ruta_archivos)
                } catch (err) {
                    logError(err)
                    console.log('archivosSyncLocal err linea 60');
                    return reject(err)
                }
            }

            resolve(true)

        }).catch(err=>{
            console.log('archivosSyncLocal err linea 67 axios ');
            return reject(err)
        })


    })
}


const archivosSyncCloud = (event='',args='')=>{
    return new Promise(async(resolve,reject)=>{
        const mac = serialHddGet()
        const miUnidad = await getUnidadByMac(mac)
        //console.log(777,miUnidad);

        const carpetasUnidad = await getFoldersByunidad(miUnidad.id).catch(err=>{
            console.log('err archivosSyncCloud linea 90 ');
        })

        //console.log('las carpetas de la unidad',carpetasUnidad);
        for (const row of carpetasUnidad) {
            //console.log(888,row.ruta);
            let archivos = await getFilesRecursive(row.ruta)

            //console.log('los archivos de la carpeta',archivos);
            console.log('total de archivos',archivos.length);


            //inicio
            let payload = {}
            for (let filePath of archivos) {
                //console.log('autorizado?',fileIsAuthorize(filePath));
                if(!fileIsAuthorize(filePath)) continue
                let fileStat = fs.statSync(filePath)
                //console.log(fileStat);


                //continue
                payload.id_equipo = miUnidad.id
                payload.archivo_ino = inoGet(filePath)
                payload.carpeta_nombre = getFolderFromFile2(filePath)
                payload.carpeta_ruta = getFolderFromFile(filePath)
                payload.carpeta_ino = inoGet(filePath,2)
                payload.estado = 1
                payload.nombre = getFileName(filePath)
                payload.ruta = filePath
                payload.extension = 1
                payload.ext = getFileExt(filePath)
                payload.peso = (fileStat.size / 1024).toFixed(4)
                payload.creacion = moment(fileStat.birthtime).format('Y-MM-DD HH:mm:ss'),
                payload.edicion = moment(fileStat.mtime).format('Y-MM-DD HH:mm:ss')
                payload.stat = fileStat
                //console.log(payload);

                try {
                    //console.log(222,payload);
                    const {data:dataAws} = await axios.post(`/v2/archivos`,payload)
                    //console.log(7777,dataAws.archivo_sincronizar?'necesita ' : 'no necesita');
                    if(dataAws.archivo_sincronizar){
                        
                        ipcRenderer.send('toArchivoProcesando',dataAws)
                        
                        let responseAws = await fileSyncAws(filePath,dataAws.archivo.ruta_aws)
                        payload.ruta_aws = responseAws.Key
                        
                        //await archivoHistorialInsert(payload.ruta,{ sync_at: +new Date() })
                    }

                } catch (error) {
                    //console.log('error en axios post ',error.response.data.message)
                    console.log('error en axios post ',error)
                }
            }
            //fin
        }

        resolve(true)
    })
}

module.exports = {
    archivosSyncLocal,
    archivosSyncCloud
}
