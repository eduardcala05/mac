const fs = require('fs')
const path = require('path')
const hddserial = require('hddserial');

const serialPath = path.join(__dirname,'..','serial.disk')

const serialHddInit = ()=>{
    if(!fs.existsSync(serialPath)){
        
        hddserial.first((err,serial)=>{
            if(err) {
                console.log('Error grabando el seria en el disco');
                return false
            }
        
            fs.writeFile(serialPath,serial,(err)=>{
                if(err){
                    console.log('Error grabando el seria en el disco');
                    return false
                }
                console.log('HDD serial grabado en disco');
            })
        })
    }
}

const serialHddGet = ()=>{
    return fs.readFileSync(serialPath,'utf8')
}

module.exports = {
    serialPath,
    serialHddInit,
    serialHddGet
}