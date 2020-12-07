const {ipcRenderer,contextBridge} = require('electron')
const path = require('path')
const watch = require('node-watch')
const {channelLog} = require('../main-process/utils')

const fs = require('fs')
const uuid = require('uuid')
const AWS = require('aws-sdk')
const myapp = require('../schema')
const db = require('electron-db')
const location = path.join(__dirname,'../database')

/*
| Amazon web services
| ajustes
*/
/*
AWS.config.apiVersions = {
    s3: '2006-03-01',
}
AWS.config.update({
    accessKeyId: 'AKIAY3JRKBTMZ6FK5CXW',
    secretAccessKey: '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',
    region: 'us-east-1'
})
*/


const esuchar = ()=>{
    const ruta = __dirname+'/adjuntos'

    const watcher = watch(ruta, { recursive: true, delay: (2 * 1000) }, async function(evt, name) {
        console.log('%s changed.', name, evt);
        if(evt === 'update'){
            console.log('creo que es un nuevo archivo: ',name);
            await fileSyncAws(name)
            console.log('archivo sincronizado:',name);
        }
    })
    watcher.on('error', function(err) {
        console.log('Hilo principal. Error en el watcher ',error);
    });
}



contextBridge.exposeInMainWorld(
    "api",{
        send: (channel, data) => {
            // whitelist channels
            let validChannels = [
                'toMain',
                'toArchivosSyncCloud',
                'toArchivosGet',
                'toArchivosListar',
                'toArchivosSync',
                'toCarpetasGet',
                'toCarpetasByUnidadGet',
                'toArchivosGetFolderId',
                'toConfiguracionGet',
                'toConfiguracionInsert',
                'toHddSerialGet',
                'toFolderOpen',
                'toUnidadInformacion',
                'toCredencialesInsert',
                'toClienteGet',
                'toClienteInsert',
                'toTokenGet',
                'toTokenInsert',
                'toUnidadesGet',
                'toMacExiste',
                'toSistemaOperativoGet',
                'toTokenRefresh',
                'toSyncUnidades',
                'toSync',
                'toCopy',
                'toCredencialesTokenRemove'
            ];
            if (validChannels.includes(channel)) {
                channelLog(channel)
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = [
                'fromMain',
                'fromTokenGet',
                'fromClienteGet',
                'fromArchivosGet',
                'fromCarpetasByUnidadGet',
                'fromArchivosGetFolderId',
                'fromInternetStatus',
                'fromArchivosListar',
                'fromCarpetasGet',
                'fromConfiguracionGet',
                'fromHddSerialGet',
                'fromFolderOpen',
                'fromUnidadInformacion',
                'fromUnidadesGet',
                'fromMacExiste',
                'fromSistemaOperativoGet',
                'fromCredencialesTokenRemove'
            ];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
)

window.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded');
})
