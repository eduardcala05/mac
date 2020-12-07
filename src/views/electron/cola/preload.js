const {ipcRenderer} = require('electron')
const { queueList, queueRemove } = require('../../../../main-process/queues')
const {axios} = require('../../../../main-process/axios')
const { fileSyncAws, archivoByIno, archivoUpdateByIno, getFileName, getFolderName, getHash, getFolderFromFile, getFoldersByRoute, carpetaByPath } = require('../../../../main-process/archivos')
const moment = require('moment')
const path = require('path')

/*
* 2020-11-05 17:04
* Esto se lanza  cuando un archivo 
* cambia su contenido 
* Ej: el usuario esta editando un archivo de word
*/
const archivoProcesarChange = (archivo)=>{
    //console.log(archivo);
    archivo.edicion = moment(archivo.mtime).format('Y-MM-DD HH:mm:ss')
    axios.post(`/v2/archivos/${archivo.ino}/sync-check`,archivo).then(({data,status})=>{
        console.log('respuesta del axios',status,data);
        if(data.sincronizar){
            const Key = data.archivo.ruta_aws
            const filePath = archivo.ruta
            console.log({Key,filePath});
            fileSyncAws(filePath,Key).then((res)=>{
                console.log('desupes de filesync promise',res);
                //archivo.edicion = moment(archivo.mtime).format('Y-MM-DD HH:mm:ss')
                axios.put(`/v2/archivos/${archivo.ino}/sync-update`,archivo).then(({status})=>{
                    if(status === 202){
                        queueRemove(archivo.ino,archivo.id_hash).then(()=>{
                            console.log('se borro de la cola?');
                        })
                    }
                }).catch(err=>{
                    console.log('error axios sync update');
                })
            })
        }
    }).catch(err=>{
        console.log('axios error preload de cola linea 16');
    })
}

const archivoProcesarAdd  = (archivo)=>{
    console.log('archivoProcesarAdd',archivo);
    archivoByIno(archivo.ino).then(res=>{
        console.log('respuesta de archivoByIno',res);
        if(res.ino){
            /*
            * el archivo existe y se esta renombrando
            */
            console.log('existe el archivo');
            const payload = {}
            payload.ruta = archivo.ruta
            payload.nombre = getFileName(archivo.ruta)

            archivoUpdateByIno(archivo.ino,payload).then((response)=>{
                /*
                * Borrando el evento add de la tabla archivos cola
                */
                queueRemove({id_hash: archivo.id_hash}).then((responseRemove)=>{
                    /*
                    * Borrando el evento unlink de la tabla archivos_cola
                    */
                    console.log('responseRemove',responseRemove);
                    const where = {
                        evento: 'unlink', 
                        ruta: res.ruta
                    }
                    setTimeout(() => {
                        queueRemove(where).then((responseUnlinkFile) =>{
                            console.log('ok ',responseUnlinkFile);
                        }).catch(err=>{
                            console.log('err queueRemove event unlik file',err);
                        })
                    }, 100);
                }).catch(err=>{
                    console.log('err queueRemove',err);
                })
            }).catch(err=>{
                console.log('err archivoUpdateByIno',err);
            })
        }else{
            console.log('no existe el archivo');
            const folderPath = getFolderFromFile(archivo.ruta)
            carpetaByPath(folderPath).then(m=>{
                console.log(m);
            }).catch(err=>{
                console.log(err);
            })
            const obj = {
                id: getHash(),
                nombre: getFileName(archivo.ruta),
                ruta: archivo.ruta
            }
            console.log('nuevo archivo: ', obj,rrr);
        }
    }).catch(err=>{
        console.log('totio en archivoByIno');
    })
}

const queueInit = ()=>{
    queueList().then((archivos)=>{
        for (const archivo of archivos) {
            const evento = archivo.evento
            if(evento === 'change'){
                console.log('paso change')
                archivoProcesarChange(archivo)
            } else if(evento === 'add'){
                console.log('paso add')
                archivoProcesarAdd(archivo)
            }
            console.log('paso final')
        }
    })
}
window.addEventListener('DOMContentLoaded',()=>{
    console.log('DOMContentLoaded estado');
    
    queueInit()

    ipcRenderer.on('fromSyncQueue',(value)=>{
        console.log('fromSyncQueue');
        queueInit()
    })
})