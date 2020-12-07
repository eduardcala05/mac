const fs = require('fs')
const path = require('path')
const db = require('electron-db')

const locationDb = path.join(__dirname,'..','database')
const buscar = 'C:\\Users\\gbp\\Documents\\mega-electron-vue\\unidades\\WD-WCC6Y4PVZSFT\\carros'

const tabla = 'archivos'
const inode = "844424930322825";

db.getRows(tabla,locationDb,{ino: inode},(succ,result)=>{
    console.log(succ,result,result.length);
})

