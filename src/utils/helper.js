import {Notification} from 'element-ui'

export const notificacion = (title,message,type='info')=>{
    Notification({
        title,
        message,
        type,
        position: 'bottom-right'
    })
}
