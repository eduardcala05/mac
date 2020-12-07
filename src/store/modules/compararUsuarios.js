import axios from 'axios'
import moment from 'moment'

export const state={
    ruta:'compararUsuarios',
    Usuario1:null,
    Usuario2:null,
    Usuario3:null,
    Usuario4:null,
}
export const getters={
    ruta: state=>state.ruta,
    Usuario1: state=>state.Usuario1,
    Usuario2: state=>state.Usuario2,
    Usuario3: state=>state.Usuario3,
    Usuario4: state=>state.Usuario4,
}
export const mutations={
    MutationsComparar(state,payload){
        switch (payload.accion) {
            case 1:
            state.Usuario1=payload.data;
            break;
            case 2:
            state.Usuario2=payload.data;
            break;
            case 3:
            state.Usuario3=payload.data;
            break;
            case 4:
            state.Usuario4=payload.data;
            break;
        }
    },
    MutationsLimpiarComparador(state,payload){
        switch (payload) {
            case 1:
            state.Usuario1=null;
            break;
            case 2:
            state.Usuario2=null;
            break;
            case 3:
            state.Usuario3=null;
            break;
            case 4:
            state.Usuario4=null;
            break;
        }
    }
}
export const actions={
    Comparar({getters,commit},payload){
        return new Promise ((resolve,reject)=>{
            axios.get(`${getters.ruta}/${payload.id}/Comparar`).then(({data})=>{
                let res={'data':data,'accion':payload.accion}
                resolve(commit('MutationsComparar',res))
            }).catch((error)=>{
                console.error(error);
            })
        })
    },
    LimpiarComparador({commit},payload){
        commit('MutationsLimpiarComparador',payload);
    }
}
