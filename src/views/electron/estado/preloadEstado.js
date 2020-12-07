import {ipcRenderer,contextBridge} from 'electron'

contextBridge.exposeInMainWorld(
    "apiEstado",{
        send: (channel, data) => {
            ipcRenderer.send(channel,data)
        },
        receive: (channel, func) => {
            // Deliberately strip event as it includes `sender`
            ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
    }
)