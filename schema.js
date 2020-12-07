const db = require('electron-db')
const path = require('path')
const locationDb = path.join(__dirname, '../database')

const tablas = [
    'configuracion',
    'credenciales',
    'archivos',
    'unidades',
    'archivos',
    'carpetas',
    'user_equipos',
    'conexiones',
    'request_fails',
    'archivos_cola'
    //'prueba'
    //'unidades_cache',
]

/*
* Creando el esquema de tablas
* de forma dinamica
*/
for (const tabla of tablas) {
    db.createTable(tabla, locationDb, (succ,result) => {
        if (!succ) {
            console.log(result)
        }
    })
}
