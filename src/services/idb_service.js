import * as JsStore from "jsstore";
import {
    DATA_TYPE
} from "jsstore";
import * as workerPath from 'file-loader?name=scripts/[name].[hash].js!jsstore/dist/jsstore.worker.min.js';

// This will ensure that we are using only one instance.
// Otherwise due to multiple instance multiple worker will be created.
export const idbCon = new JsStore.Instance(new Worker(workerPath));
export const dbName = "megadb";

export const initJsStore = async () => {
    try {
        const isDbCreated = await idbCon.isDbExist(dbName);
        if (isDbCreated) {
            await idbCon.openDb(dbName);
        } else {
            await idbCon.initDb(getDbSchema());
        }

    } catch (ex) {
        console.error(ex);
    }
}

const getDbSchema = () => {
    var unidadesTable = {
        name: 'Unidades',
        columns: {
            id: {primaryKey: true, autoIncrement: true},
            id_server: {dataType: DATA_TYPE.Number},
            user_id: {notNull: true, dataType: DATA_TYPE.Number},
            peso: {dataType: DATA_TYPE.Number},
            archivos: {dataType: DATA_TYPE.Number},
            mac: {notNull: true, dataType: DATA_TYPE.String},
            nombre: {dataType: DATA_TYPE.String},
            ruta_archivos: {dataType: DATA_TYPE.String},
            descripcion: {dataType: DATA_TYPE.String},
            nombre_des: {dataType: DATA_TYPE.String},
            descripcion_des: {dataType: DATA_TYPE.String},
            ruta_descargables: {dataType: DATA_TYPE.String},
            permiso_descarga: {dataType: DATA_TYPE.Number},
            rol: {notNull: true, dataType: DATA_TYPE.String},
            nombre_usuario: {notNull: true, dataType: DATA_TYPE.String},
        }
    }
    var carpetasTable = {
        name: 'Carpetas',
        columns: {
            id: {primaryKey: true, autoIncrement: true},
            id_server: {dataType: DATA_TYPE.Number},
            principal: {dataType: DATA_TYPE.Number},
            tipo: {dataType: DATA_TYPE.Number},
            nombre: {notNull: true, dataType: DATA_TYPE.String},
            ruta: {notNull: true, dataType: DATA_TYPE.String},
            icono: {dataType: DATA_TYPE.String},
            color: {dataType: DATA_TYPE.String},
            id_unidad: {dataType: DATA_TYPE.Number},
            //estados del sistema offline
            sync: {notNull: true, dataType: DATA_TYPE.Number},
            delete: {dataType: DATA_TYPE.Boolean, default: false},
            deleteAt: {dataType: DATA_TYPE.String}
        }
    }
    var archivosTable = {
        name: 'Archivos',
        columns: {
            id: {primaryKey: true, autoIncrement: true},
            id_server: {dataType: DATA_TYPE.Number},
            estado: {dataType: DATA_TYPE.Number},
            id_carpeta: {dataType: DATA_TYPE.Number},
            nombre: {notNull: true, dataType: DATA_TYPE.String},
            extension: {dataType: DATA_TYPE.Number},
            ext: {dataType: DATA_TYPE.String},
            peso: {dataType: DATA_TYPE.Number},
            calificacion: {dataType: DATA_TYPE.Number},
            creacion: {dataType: DATA_TYPE.String},
            edicion: {dataType: DATA_TYPE.String},
            path: {dataType: DATA_TYPE.String},
            ruta: {dataType: DATA_TYPE.String},
            blob: {dataType: DATA_TYPE.Object},
            //estados del sistema offline
            sync: {notNull: true, dataType: DATA_TYPE.Number},
            delete: {dataType: DATA_TYPE.Boolean, default: false},
            deleteAt: {dataType: DATA_TYPE.String}
        }
    };
    var calificacionesTable = {
        name: 'Calificacion',
        columns: {
            id: {primaryKey: true, autoIncrement: true},
            id_server: {dataType: DATA_TYPE.Number},
            calificacion: {dataType: DATA_TYPE.Number},
            promedio: {dataType: DATA_TYPE.Number},
            comentario: {dataType: DATA_TYPE.String},
            id_archivo: {dataType: DATA_TYPE.Number},
            nombre: {dataType: DATA_TYPE.String},
            extension: {dataType: DATA_TYPE.Number},
            id_usuario: {dataType: DATA_TYPE.Number},
            usuario_nombre: {dataType: DATA_TYPE.String},
            usuario_foto: {dataType: DATA_TYPE.String},
            creacion: {dataType: DATA_TYPE.String},
        }
    };
    var comentariosTable = {
        name: 'Comentarios',
        columns: {
            id: {primaryKey: true, autoIncrement: true},
            id_server: {dataType: DATA_TYPE.Number},
            comentario: {dataType: DATA_TYPE.String},
            id_archivo: {dataType: DATA_TYPE.Number},
            created_by: {dataType: DATA_TYPE.Number},
            nombre: {dataType: DATA_TYPE.String},
            foto: {dataType: DATA_TYPE.String},
            created_at: {dataType: DATA_TYPE.String},
            sync: {notNull: true, dataType: DATA_TYPE.Number},
        }
    };

    return {
        name: dbName,
        tables: [unidadesTable, carpetasTable, archivosTable, calificacionesTable, comentariosTable]
    }
}
initJsStore()
