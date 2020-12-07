const fs = require('fs')
const path = require('path')
const moment = require('moment')

const channelLog = (channel='')=>{
    let now = moment().format('Y-MM-DD HH:mm:ss')
    console.log(`${now} - Canal: ${channel}`);
}

/**
 *
 * @param {string} title
 * @param {string} body
 */
const notificar = (title='',body='')=>{
    let options = {body}
    options.icon = 'icon.png'
    new Notification(title,options)
}

const logError = (err)=>{


    const logsPath = path.join(__dirname,'logs')

    if(!fs.existsSync(logsPath)){
        fs.mkdirSync(logsPath)
    }

    const fileName = moment().format('Y-MM-DD-HH:mm:ss') + +new Date() + '.txt'

    console.log('err monitoreado',fileName);

    const data = JSON.stringify(err)

    fs.writeFile(path.join(logsPath,fileName),data,(err,result)=>{
        if(err){
            console.log('error grabando el error');
            return
        }
        console.log('grabado en log',moment().format('Y-MM-DD HH:mm:ss'));
    })
}
module.exports = {
    channelLog,
    notificar,
    logError
}
