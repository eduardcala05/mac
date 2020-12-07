import {idbCon} from "./idb_service";
import {head, isNull, isObject, last, isUndefined} from 'lodash'
// import {ipcRenderer} from 'electron'

export default class BaseService {

    constructor(item) {
        if(isObject(item)){
            for(let key of Object.keys(item)){
                this[key] = item[key]
            }
        }
    }
    get connection() {
        return idbCon;
    }

    async find( ...arg ){
        let where = {}
        let from = ''
        switch (arg.length) {
            case 3:{
                from = arg[0]
                where[arg[1]] = arg[2]
                break
            }
            case 2:{
                from = this.tableName
                where[head(arg)] = last(arg)
                break
            }
            default:{
                from = this.tableName
                where.id = head(arg)
            }
        }
        let data =  await idbCon.select({
            from,
            where
        })
        return head(data) || null
    }

    async all(){
        return await idbCon.select({
            from: this.tableName
        })
    }

    async where(...arg){
        let where = {}
        let from = this.tableName
        if(arg.length === 1){
            where = arg[0]
        }else{
            from = arg[0]
            where = arg[1]
        }
        return await idbCon.select({
            from:from,
            where:where
        })
    }

    async whereJoin(join,where){
        return await idbCon.select({
            from: this.tableName,
            where,
            join
        })
    }

    insert(){
        let insert = {...this}
        delete insert.tableName
        return idbCon.insert({
            into: this.tableName,
            values: [insert]
        })
    }

    update( ...arg ){
        let update = {...this}
        delete update.id
        delete update.tableName

        let where = {}
        if(arg.length === 2){
            where[head(arg)] = last(arg)
        }else {
            where.id = head(arg)
        }

        return  idbCon.update({
            in: this.tableName,
            set: update,
            where: where
        });
    }

    async save(){
        let value = null
        if(isUndefined(this.id)) value = await this.insert();
        let item = await this.find(this.id)
        if(isNull(item)){
            value = await this.insert();
        } else {
            value = await this.update(this.id)
        }
        // ipcRenderer.send('list-unidad')
        return value
    }

    async remove(tableName, id){
        if(isUndefined(this.id)) return null
        let item = await this.find(this.id)
        console.log(tableName)
        if(!isNull(item)){
            return idbCon.remove({
                into: tableName,
                where: {
                    id: id
                }
            })
        }
    }



}
