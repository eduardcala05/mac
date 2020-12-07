'use strict'

import {
    app,
    protocol,
    BrowserWindow,
    ipcMain,
    dialog,
    Tray,
    Menu,
    clipboard
} from 'electron'

import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { serialHddGet } from '../main-process/disco'


const fs = require('fs')
const path = require('path')
const db = require('electron-db')

const {
    credencialesInsert,
    credencialesTokenInsert,
    credencialesTokenGet,
    credencialesTokenRemove,
    credencialesClienteInsert,
    credencialesClienteGet,
} = require('../main-process/credenciales')

const  {
    unidadesGet,
    unidadesMacExists
} = require('../main-process/unidades')

require('../main-process/disco').serialHddInit()


const isDevelopment = process.env.NODE_ENV !== 'production'

const {getTrayPosition} = require('./utils/trayWindow')
const locationDb = path.join(__dirname,'../database')

const {channelLog, logError} = require('../main-process/utils')

const {
    archivosGet,
    carpetasGetByUnidad,
    archivosGetFolderId
} = require('../main-process/archivos')

if(!fs.existsSync(locationDb)){ // creando la carpeta de la base de datos
    fs.mkdirSync(locationDb)
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.

let win,tray,winSync,winEstado,winUnidades,winCola
let createdAppProtocol = false

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
])

const createTray = () =>{
    tray = new Tray(path.join(__static, '/img/init.png'))
    const contextMenu = Menu.buildFromTemplate([
        {
            label: 'Estado',
            click(){
                winCreateEstado()
            }
        },
        {
            label: "Abrir",
            click() {
                createWindow()
            }
        },
        {
            label: 'Sincronizar manual',
            click(){
                winSync.webContents.send('fromArchivosSyncInit',true)
                winCreateEstado()
            }
        },
        {
            label: 'Sincronizar unidades',
            click(){
                winUnidades.webContents.send('fromUnidadesSync')
            }
        },
        {
            label: 'Sincronizar cola',
            click(){
                winCola.webContents.send('fromSyncQueue')
            }
        },
        { type: 'separator' },
        {
            label: "Salir",
            accelerator: "CmdOrCtrl+Q",
            click() {
                app.quit()
            }
        },
    ])
    tray.setToolTip('Mega Archivo.')
    tray.setContextMenu(contextMenu)

    tray.on('click', ()=>{
        //win.setAlwaysOnTop(true)
        win.show()
    })
}

function createWindow() {
    if(win){
        win.show()
        return false
    }

    // Create the browser window.
    win = new BrowserWindow({
        width: 1366,
        height: 780,
        minWidth: 1024,
        minHeight: 768,
        show: false,
        //maximizable: true,
        icon: path.join(__static, 'icon.png'),
        title: 'Mega Archivo | Grupo bien pensado',
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {

        if (!createdAppProtocol) {
            createProtocol('app')
            createdAppProtocol = true
        }

        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
    win.once('ready-to-show',()=>{
        win.maximize()
        win.show()
        console.log('win ready-to-show');
    })
    win.on('close',evt=>{
        //evt.preventDefault()
        //win.hide()
    })

    win.on('closed', () => {
        win = null
        //winSync = null
    })

    win.on('minimize',(event)=>{
        //event.preventDefault();
        //win.hide();
        console.log('minimzo el main');
    });
}

const winCreateEstado = ()=>{
    if(winEstado){
        let {x,y} = getTrayPosition(winEstado)
        winEstado.setPosition(x,y,true)
        winEstado.show()
        return false
    }
    winEstado = new BrowserWindow({
        title: 'winEstado',
        height:250,
        width:350,
        hasShadow: true,
        titleBarStyle: 'hidden',
        maximizable:false,
        frame: false,
        movable: true,
        //skipTaskbar: true,
        resizable:true,
        center:false,
        show: false,
        transparent: true,
        webPreferences:{
            nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            contextIsolation: true,
            preload: path.join(__dirname,'preloadEstado.js')
        }
    })

    //inicio
    if (process.env.WEBPACK_DEV_SERVER_URL) {

        // Load the url of the dev server if in development mode
        winEstado.loadURL(process.env.WEBPACK_DEV_SERVER_URL+'estado')
            if (!process.env.IS_TEST) winEstado.webContents.openDevTools()
        } else {

        if (!createdAppProtocol) {
            createProtocol('app')
            createdAppProtocol = true
        }

        // Load the index.html when not in development
        winEstado.loadURL('app://./estado.html')
    }
    //fin

    //winEstado.loadFile(path.join(__dirname,'../main-process/views/estado/estado.html'))
    winEstado.once('ready-to-show',()=>{
        console.log('winEstado ready-to-show');
        //let {x,y} = getTrayPosition(winEstado)
        //winEstado.setPosition(x,y,true)
        //winEstado.show()
    })
    winEstado.once('close',evt=>{
        winEstado = null
    })
    win.once('blur',evt=>{
        //console.log('winestado blur');
        winEstado.hide()
    })
}

const winCreateUnidades = ()=>{
    if(winUnidades){
        winUnidades.show()
        return
    }
    winUnidades = new BrowserWindow({
        width: 800,
        height: 500,
        title: 'winUnidades',
        show: false,
        webPreferences:{
            nodeIntegration: true,
            preload: path.join(__dirname,'preloadUnidades.js')
        }
    })

    //inicio
    if (process.env.WEBPACK_DEV_SERVER_URL) {

        // Load the url of the dev server if in development mode
        winUnidades.loadURL(process.env.WEBPACK_DEV_SERVER_URL+'unidades')
        if (!process.env.IS_TEST) winUnidades.webContents.openDevTools()
      } else {

        if (!createdAppProtocol) {
            createProtocol('app')
            createdAppProtocol = true
        }

        // Load the index.html when not in development
        winUnidades.loadURL('app://./unidades.html')
    }
    //fin

    //winUnidades.loadFile(path.join(__dirname,'../src/views/electron/unidades/index.html'))
    winUnidades.on('ready-to-show',(evt)=>{
        // winUnidades.show()
        console.log('winUnidades ready-to-show');
    })
    winUnidades.on('close',(evt)=>{
        console.log('winUnidades cerro');
        winUnidades = null
    })
}

const winCreateSync = ()=>{
    if(winSync){
        winSync.show()
        return
    }
    winSync = new BrowserWindow({
        title: 'winSync',
        height: 700,
        width: 700,
        show: false,
        webPreferences:{
            nodeIntegration: true,
            preload: path.join(__dirname,'preloadSync.js')
        }
    })

    if (process.env.WEBPACK_DEV_SERVER_URL) {

        // Load the url of the dev server if in development mode
        winSync.loadURL(process.env.WEBPACK_DEV_SERVER_URL+'sync')
        if (!process.env.IS_TEST) winSync.webContents.openDevTools()
      } else {

        if (!createdAppProtocol) {
            createProtocol('app')
            createdAppProtocol = true
        }

        // Load the index.html when not in development
        winSync.loadURL('app://./sync.html')
    }

    //winSync.loadFile(path.join(__dirname,'../main-process/views/sync/sync.html'))

    winSync.once('ready-to-show',()=>{
         winSync.show()
        console.log('winsync ready-to-show');
    })

    winSync.once('close',(evt)=>{
        winSync = null
        console.log('winSync: closed');
    })
}

const winCreateCola = ()=>{
    winCola = new BrowserWindow({
        title: 'winCola',
        height: 700,
        width: 700,
        show: false,
        webPreferences:{
            nodeIntegration: true,
            preload: path.join(__dirname,'preloadCola.js')
        }
    })


    if (process.env.WEBPACK_DEV_SERVER_URL) {

        // Load the url of the dev server if in development mode
        winCola.loadURL(process.env.WEBPACK_DEV_SERVER_URL+'cola')
        if (!process.env.IS_TEST) winCola.webContents.openDevTools()
      } else {

        if (!createdAppProtocol) {
            createProtocol('app')
            createdAppProtocol = true
        }

        // Load the index.html when not in development
        winCola.loadURL('app://./cola.html')
    }

    //winCola.loadFile(path.join(__dirname,'../main-process/views/sync/sync.html'))

    winCola.once('ready-to-show',()=>{
        winCola.show()
        console.log('winCola ready-to-show');
    })

    winCola.once('close',(evt)=>{
        winCola = null
        console.log('winCola: closed');
    })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})


app.whenReady().then(()=>{
    createTray()
    createWindow()
    winCreateEstado()
    winCreateSync()
    winCreateUnidades()
    winCreateCola()
})






// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//     console.log(`Not the first instance - quit`);
//     app.quit();
// }


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.

app.on('ready', async () => {

    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString())
        }
    }


    ipcMain.on('toMain', (event, args) => {
        channelLog('toMain: '+args)
        // Send result back to renderer process
        win.webContents.send("fromMain", args);
    })

    ipcMain.on('toTokenGet',(event,args)=>{
        channelLog('toTokenGet')
        const token = credencialesTokenGet()
        win.webContents.send('fromTokenGet',token)

    })

    ipcMain.on('toClienteGet',(event,args)=>{
        channelLog('toClienteGet')
        const identificador = credencialesClienteGet()
        win.webContents.send('fromClienteGet',identificador)
    })

    /**
    * Listar los archivos de una unidad
    */
    ipcMain.on('toArchivosGet',(event,args)=>{
        channelLog('toArchivosGet')
        archivosGet(args).then(res=>{
            win.webContents.send('fromArchivosGet',res)
        })
    })

    /*
    * Listar los archivos que hay dentro de una
    * carpeta pasandole una ruta absoluta
    */
    ipcMain.on('toArchivosListar',(event,args)=>{
        channelLog('toArchivosListar')
        fs.readdir(args,(err,files)=>{
            if(err) return
            win.webContents.send('fromArchivosListar',files)
        })
    })

    ipcMain.on('toCarpetasByUnidadGet',(event,args)=>{
        channelLog(`toCarpetasByUnidadGet ${args}`)
        carpetasGetByUnidad(args).then(res=>{
            win.webContents.send('fromCarpetasByUnidadGet',res)
        })
    })
    ipcMain.on('toArchivosGetFolderId',(event,args)=>{
        channelLog(`toArchivosGetFolderId ${args}`,args)
        archivosGetFolderId(args).then(res=>{
            //console.log(888,res);
            win.webContents.send('fromArchivosGetFolderId',res)
        })
    })

    ipcMain.on('toConfiguracionGet',(event,args)=>{
        db.getAll('configuracion',locationDb,(succ,data)=>{
            let obj = {}
            if(data.length) obj = data[0]
            win.webContents.send('fromConfiguracionGet',obj)
        })
    })

    ipcMain.on('toConfiguracionInsert',(event,args)=>{
        db.clearTable('configuracion',locationDb,(succ,data)=>{
            if(succ){
                console.log('tabla configuracion limpiada');
                db.insertTableContent('configuracion',locationDb,args,(succ,data)=>{
                    if(succ){
                        console.log('tabla configuracion insertado con exito');
                    }
                })
            }
        })
    })

    ipcMain.on('toHddSerialGet',async (event,args)=>{
        channelLog('toHddSerialGet')
        const serial = serialHddGet()
        win.webContents.send('fromHddSerialGet',serial)
    })

    ipcMain.on('toFolderOpen', (event,args)=>{
        dialog.showOpenDialog(win,{
            properties: ['openDirectory']
        }).then((directory)=>{
            win.webContents.send('fromFolderOpen',directory)
        })
    })

    ipcMain.on('toCredencialesInsert',async (event,args)=>{
        channelLog('toCredencialesInsert')
        credencialesInsert(args)
    })

    ipcMain.on('toTokenInsert',(event,args)=>{
        channelLog('toTokenInsert')

        credencialesTokenInsert(args.token)
        win.webContents.send('fromCredencialesInsert',args)
    })

    ipcMain.on('toClienteInsert',(event,args)=>{
        channelLog('toClienteInsert')


        credencialesClienteInsert(args)
        // win.webContents.send('fromCredencialesInsert',args)
    })

    ipcMain.on('toUnidadesGet',(evt,args)=>{
        channelLog('toUnidadesGet')
        unidadesGet().then(response=>{
            win.webContents.send('fromUnidadesGet',response)
        })
    })

    /*
    * Sabado 2020-10-10
    */
    ipcMain.on('toArchivoProcesando',(evt,args)=>{
        channelLog('toArchivoProcesando')
        winEstado.webContents.send('fromArchivoProcesando',args)
    })
    ipcMain.on('toArchivoProcesandoProgreso',(evt,args)=>{
        winEstado.webContents.send('fromArchivoProcesandoProgreso',args)
    })

    /*
    * domingo 2020-10-11
    */
    ipcMain.on('toArchivosSyncCloud',(evt,args)=>{
        channelLog('toArchivosSyncCloud')
        winEstado.webContents.send('fromArchivosSyncCloud',args)
        winEstado.hide()
    })

    /*
    * martes 2020-10-13
    */
    ipcMain.on('toMacExiste',(evt,args)=>{
        channelLog('toMacExiste')
        unidadesMacExists(serialHddGet()).then(({data})=>{
            console.log('mac existe===>>>>',data);
            win.webContents.send('fromMacExiste',data)
        }).catch(err=>{
            console.log('fallo mac exists axios111');
            logError(err)
        })
    })

    /*
    * viernes 2020-10-16
    */
    ipcMain.on('toUnidadesSync',(evt,args)=>{
        channelLog('toUnidadesSync')
        winUnidades.webContents.send('fromUnidadesSync',2)
    })

    /*
    * lunes 2020-10-19
    */
    ipcMain.on('toSistemaOperativoGet',(evt,args)=>{
        channelLog('toSistemaOperativoGet')
        win.webContents.send('fromSistemaOperativoGet',process.platform)
    })

    /*
    * martes 2020-10-20
    */
    ipcMain.on('toTokenRefresh',(evt,args)=>{
        channelLog('toTokenRefresh')
        console.log(args);
        const tabla = 'credenciales_token'
        db.clearTable(tabla,locationDb,(succ,result)=>{
            if(!succ) return
            db.insertTableContent(tabla,locationDb,args,(succ2,result2)=>{
                if(!succ2) return
                global.token = args.token
            })
        })
    })

    /*
    * miercoles 2020-10-21
    */
    ipcMain.on('toSyncUnidades',(evt,args)=>{
        channelLog('toSyncUnidades')
        winUnidades.webContents.send('fromUnidadesSync')
   })

    /*
    * jueves 2020-10-22
    */
    ipcMain.on('toGlobalToken',(evt,args)=>{
        console.log('var global token: '+global.token);
    })

    ipcMain.on('toSync',(evt,args)=>{
        winSync.webContents.send('fromArchivosSyncInit',true)
        winCreateEstado()
    })

    /*
    * Viernes 2020-10-23
    */
    ipcMain.on('toCopy',(evt,args)=>{
        clipboard.writeText(args)
        clipboard.readText()
    })
    /*
    * Viernes 2020-10-30
    */
    ipcMain.on('toUnidadesSincronizandoArchivo',(evt,args)=>{
        channelLog('toUnidadesSincronizandoArchivo')
        winEstado.webContents.send('fromUnidadesSincronizandoArchivo',args)
    })
    ipcMain.on('toUnidadesSincronizandoArchivoProgreso',(evt,args)=>{
        channelLog('toUnidadesSincronizandoArchivoProgreso')
        winEstado.webContents.send('fromUnidadesSincronizandoArchivoProgreso',args)
    })

    /*
    * Sabado 2020-10-31
    */
    ipcMain.on('toUnidadesSincronizandoAccion',(evt,args)=>{
        channelLog('toUnidadesSincronizandoAccion')
        winEstado.webContents.send('fromUnidadesSincronizandoAccion',args)
    })

    /*
    * Miercoles 2020-11-04
    */
    ipcMain.on('toCredencialesTokenRemove',(evt,args)=>{
        channelLog('toCredencialesTokenRemove')
        credencialesTokenRemove()
        win.webContents.send('fromCredencialesTokenRemove',true)
    })

    ipcMain.on('toWatchInit',(evt,args)=>{
        channelLog('tomWatchInit')
        winSync.webContents.send('fromWatchInit',true)
    })

    /*
    * Jueves 2020-11-05 16:48
    */
    ipcMain.on('toSyncQueue',(evt,args)=>{
        channelLog('toSyncQueue')
        winCola.webContents.send('fromSyncQueue')
    })
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
