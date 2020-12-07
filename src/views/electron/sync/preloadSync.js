const {ipcRenderer} = require('electron');
const { watchFolder } = require('../../../../main-process/archivos');

const {
    archivosSyncLocal,
    archivosSyncCloud
} = require('../../../../main-process/archivos2');
const { serialHddGet } = require('../../../../main-process/disco');

const { unidadesSyncToLocal, unidadesByMac } = require('../../../../main-process/unidades');
const { notificar, logError } = require('../../../../main-process/utils');

const watchFiles = ()=>{
    /*
    * Escuchando cambios en la carpeta de archivos
    */    
    
    unidadesByMac(serialHddGet()).then((result)=>{
        let unidad = {}
        if(result.length) unidad = result[0]
        if(unidad.ruta_archivos){
            ipcRenderer.send('toMain','8888Esucuchando: ' + unidad.ruta_archivos)
            watchFolder(unidad.ruta_archivos)
        }
    })
}

window.addEventListener('DOMContentLoaded',(evt)=>{
    console.log('DOMContentLoaded');

    watchFiles()
    
    ipcRenderer.on('fromWatchInit',()=>{
        watchFiles()
    })

    ipcRenderer.on('fromArchivosSyncInit',()=>{
        
        notificar('Mega Archivo','El equipo ha iniciado la sincronización. No cierres este programa.')
        console.log('preload fromArchivosSyncInit');

        ipcRenderer.send('toMain','paso 1: Inicia sincronizar unidades nube a local')

        unidadesSyncToLocal().then(m=>{
            
            watchFiles()

            ipcRenderer.send('toMain','paso 2: Inicia sincronizar archivos local')
            archivosSyncLocal().then(res=>{

                ipcRenderer.send('toMain','paso 3: Inicia sincronizar archivos local a nube')
                archivosSyncCloud().then(res=>{

                    ipcRenderer.send('toMain','paso: 4 finalizo sincronizar archivos nube a local')

                    ipcRenderer.send('toArchivosSyncCloud',false)
                    
                    setTimeout(()=>{
                        notificar('Mega Archivo','Tu equipo se encuentra sincronizado.')
                        ipcRenderer.send('toSyncUnidades')
                    },4000)

                }).catch(err=>{
                    console.log(`unidadesSyncToLocal err linea 46`);
                    ipcRenderer.send('toMain','sssssssse rrororrr 39')    
                })

            }).catch(err=>{
                console.log('unidadesSyncToLocal err linea 50');
                ipcRenderer.send('toMain',err)
            })

        }).catch(err=>{
            logError(err)
            console.log(`unidadesSyncToLocal err linea 51`);
        })


    })

})

