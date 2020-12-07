const {ipcRenderer} = require('electron')
const fs = require('fs')
const path = require('path')
const {axios} = require('../../../../main-process/axios')
const {serialHddGet} = require('../../../../main-process/disco')
const {
    copyFileToLocal,
    getHash,
    carpetaInsert,
    archivosInsert2,
    getFoldersByunidad,
    folderByPath,
    getFolderName,
    getFolderFromFile
} = require('../../../../main-process/archivos')

const {
    unidadesSyncToLocal,
    unidadesByMac
} = require('../../../../main-process/unidades')

const unidadesPath = path.join(__dirname,'..','unidades')

if(!fs.existsSync(unidadesPath)){
    console.log('Creando el directorio para las unidades');
    fs.mkdir(unidadesPath,{recursive:true},(err,result)=>{
        console.log('result',result);
    })
}

const getUnidades = async ()=>{
    const mac = serialHddGet()
    const unidadesData = await unidadesSyncToLocal()
    
    let index = unidadesData.findIndex(a=>a.mac === mac)
    if(index>=0) unidadesData.splice(index,1)
    
    unidadesSync(unidadesData)
}


/*
/**
 *
 * @param {string} filePath
 */
const carpetaCrear2 = (unidadPath,filePath)=>{
    const pathTmp = path.join(unidadPath,filePath)
    //console.log(pathTmp);
    if(!fs.existsSync(pathTmp)){
        return fs.mkdirSync(pathTmp,{recursive:true})
    }
}

const carpetasSync = (carpetas,unidad)=>{
    for (let row of carpetas) {
        carpetaSync(row,unidad)
    }
}

const folderContruir = async (folderPath='',carpetas=[])=>{
    
    const record = await folderByPath(folderPath)
    let padre_id = record.id_hash
    let carpetaTmp = ''
    let contador = 0
    //let carpetaPadre = path.join(folderPath ,carpetas[0] )
    
    //const carpetaPadre2 = await folderByPath(carpetaPadre)
    
    //console.log('carpeta padre',carpetaPadre2);

    for (const carpeta of carpetas) {
        //console.log('carpetaTmp',carpetaPadre);
        carpetaTmp = path.join(carpetaTmp,carpeta)
        const obj = {}

        obj.unidad_id = null
        obj.id_hash = getHash()
        obj.padre_id = padre_id
        
        
        obj.ruta = path.join(folderPath,carpetaTmp)
        obj.nombre = carpeta
        
        //console.log('carpeta insert ==>',obj);
        
        const eee = await carpetaInsert(obj)
        console.log(eee);
        padre_id = eee.id_hash
        contador++
    }
}

const folderContruir2 = (unidadId=null,unidadPath='',folderpath='')=>{
    return new Promise(async(resolve,reject)=>{
        const obj = {}
        obj.id_hash = getHash()
        obj.unidad_id = unidadId
        obj.nombre = folderpath
        obj.ruta = path.join(unidadPath,folderpath)
        //console.log(obj);
        try {
            await carpetaInsert(obj)
        } catch (error) {
            console.log(err);
            return reject(err)
        }
        return resolve(obj)
    })
}

const carpetaSync = async (carpeta,unidad)=>{
    let unidadFolderPath = path.join(unidadesPath,unidad.mac)
    const dataUnidades = await unidadesByMac(unidad.mac)
    
    
    if(dataUnidades.length){
        //inicio
        let ruta2 = carpeta.ruta.replace(unidad.ruta_archivos.concat(path.sep),'')
        let rutaExplode = ruta2.split(path.sep)
        
        
        if(rutaExplode.length >= 2){
            console.log(111);
            let unidadFolderPath2 = path.join(unidadFolderPath,rutaExplode[0])
            rutaExplode.splice(0,1)
            //console.log('revisar recursividad',unidadFolderPath2,rutaExplode);
            folderContruir(unidadFolderPath2,rutaExplode)
        }else{
            console.log(rutaExplode);
            unidad.carpeta_id = await folderContruir2(unidad.id,unidadFolderPath,rutaExplode[0])
        }
        //fin
    }


    //console.log(carpeta,unidad);
    const rutaOriginal = unidad.ruta_archivos
    //const rutaNueva = path.join(__dirname,unidad.mac)


    for (let archivo of carpeta.archivos) {
        const rutaArchivo = archivo.ruta.replace(rutaOriginal,'')
        archivoSync(archivo,unidad,rutaArchivo,unidadFolderPath)
    }
}

const archivoSync = async (archivo,unidad,ruta,folderPath)=>{
    let archivoRuta = path.join(folderPath,ruta)
    let result = path.dirname(archivoRuta)
    archivo.ruta = archivoRuta
    archivo.carpeta_id = unidad.id_hash
    
    let carpetaTmp = await folderByPath(result)
    archivo.carpeta_id = carpetaTmp.id_hash
    
    await archivosInsert2(archivo)


    //const rutaAbsoluta = path.join(__dirname,unidad.mac)
    const rutaAbsoluta = path.join(unidadesPath,unidad.mac)

    const rutaAbsoluta2 = path.join(rutaAbsoluta,path.dirname(ruta))

    carpetaCrear2(rutaAbsoluta,path.dirname(ruta))
    
    ipcRenderer.send('toUnidadesSincronizandoAccion',1)
    
    console.log({archivo,rutaAbsoluta2});

    copyFileToLocal(archivo,rutaAbsoluta2,'mega-gbp').then(m=>{
        //console.log('copiado',archivo.ruta_aws);
        //ipcRenderer.send('toMain',`copiado el archivo: ${path.join(rutaAbsoluta2,archivo.ruta_aws)}`)
        //ipcRenderer.send('toUnidadesSincronizandoAccion',0)
    })
}

const unidadSync = async (unidad)=>{
    //console.log(unidad.mac);
    
    /*
    * 2020-10-23 12:00
    * Creando las carpetas para sincronizar las 
    * unidades por mac
    */
    const carpetaPath = path.join(unidadesPath,unidad.mac)
    if(!fs.existsSync(carpetaPath)){
        fs.mkdirSync(carpetaPath,{recursive:true})
    }
    /*
    * Fin
    */
    try {

        const { data:carpetasData } = await axios(`/v2/unidades/${unidad.id}/archivos`)
        
        carpetasSync(carpetasData,unidad)
    } catch (error) {
        console.log(`fallo axios v2/unidades/${unidad.id}/archivos`,error);
    }
}

const unidadesSync = (unidades=[])=>{
    for (let unidad of unidades){
        unidadSync(unidad)
    }
}


window.addEventListener('DOMContentLoaded',evt=>{
    
    console.log('DOMContentLoaded');

    ipcRenderer.on('fromUnidadesSync',(evt)=>{
        console.log('escucho en el preload el canal fromUnidadesSync ');
        getUnidades()
    })

    //ipcRenderer.send('toUnidadesSync',1)
})
