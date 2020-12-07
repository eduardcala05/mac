import axios from 'axios'
import moment from 'moment'
export const state={
    ruta:'informeFechas',
    datos_semanas:[],
    semana:{
        numero:'',
        inicio:'',
        fin:''
    }
}
export const getters={
    ruta:state=>state.ruta,
    datos_semanas:state=>state.datos_semanas,
    semana:state=>state.semana,
}
export const mutations={
    mutationsDataSemana(state,payload){
        let tabla=[]
        _.forEach(payload.data ,(e,i)=>{
            if (e.tiempo==null) {
                e.tiempo='N/A'
            }else{
                e.tiempo=e.tiempo +' Min'
            }
            tabla[i]={
                dia:moment(e.created_at).format('dddd DD MMM'),
                actividad:e.tipo,
                archivo:e.archivos,
                usuario:e.usuario,
                hora:moment(e.created_at).format('hh:mm a'),
                tiempo_lectura: e.tiempo
            };
        })
        state.datos_semanas=tabla;
        state.semana.numero=payload.actual;
        state.semana.inicio=moment(payload.semana[0]).format('DD MMMM');
        state.semana.fin=moment(payload.semana[1]).format('DD MMMM');
    }
}
export const actions={
    dataSemana({getters,commit},payload){
        axios.get(`${getters.ruta}/dataSemana`,{params:payload} ).then(({data})=>{
            commit('mutationsDataSemana',data)
        }).catch((error)=>{
            console.error(error);
        })
    }
}
