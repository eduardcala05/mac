const db = require('electron-db')
const fs = require('fs')
const path = require('path')

const locationDb = path.join(__dirname,'../database')

const credencialesInsert = (payload)=>{
    return new Promise((resolve,reject)=>{
        const tableName = 'credenciales'
        db.clearTable(tableName,locationDb,(succ,result)=>{
            if(!succ) return reject(result)
            db.insertTableContent(tableName,locationDb,payload,(succ,msj)=>{
                if(!succ) return reject(result)
                let response = { mensaje: 'Credenciales almacenadas con éxito' }
                resolve(response)
            })
        })
    })
}

const credencialesTokenInsert = (token)=>{
    const filePath = path.join(__dirname,'../','auth.token')
    fs.writeFile(filePath,token,(err,result)=>{
        if(err) {
            fs.writeFile(path.join(__dirname,'errrror.txt'),err,(err,result)=>{
                console.log(err,result);
            })
        }
    })
}
const credencialesTokenGet = ()=>{
    const filePath = path.join(__dirname,'../','auth.token')
    if(fs.existsSync(filePath)){
        const token = fs.readFileSync(filePath,'utf8')
        return {
            expires_in: 86400,
            token_type: 'Bearer',
            token
        }
    }
    return {}
}
const credencialesClienteInsert = (identificador)=>{
    const filePath = path.join(__dirname,'../','auth.cliente')
    fs.writeFile(filePath,identificador,(err,result)=>{
        if(err) {
            fs.writeFile(path.join(__dirname,'errrror.txt'),err,(err,result)=>{
                console.log(err,result);
            })
        }
    })
}


const credencialesClienteGet = ()=>{
    const filePath = path.join(__dirname,'../','auth.cliente')
    if(fs.existsSync(filePath)){
        const identificador = fs.readFileSync(filePath,'utf8')
        return {
            identificador
        }
    }
    return {}
}

const credencialesTokenRemove = ()=>{
    const filePath = path.join(__dirname,'../','auth.token')
    if(fs.existsSync(filePath)) fs.unlinkSync(filePath)
}
module.exports = {
    credencialesInsert,
    credencialesTokenInsert,
    credencialesTokenGet,
    credencialesTokenRemove,
    credencialesClienteInsert,
    credencialesClienteGet,
}
