import axios from 'axios'
import moment from 'moment'

export const state={
    ruta:'informeLecturas',
    array_fechas:[],
    calendario:{
        max:10000,
        rango:[]
    },
    selectedArchivos:[],
    TabMeses:[],
    datosMes:[]
}
export const getters={
    ruta:state=>state.ruta,
    array_fechas:state=>state.array_fechas,
    calendario:state=>state.calendario,
    selectedArchivos:state=>state.selectedArchivos,
    TabMeses:state=>state.TabMeses.reverse(),
    datosMes:state=>state.datosMes,
}
export const mutations={
    MutationsloadCharCalendario(state,payload){
        let data_f=payload.grafica;
        state.calendario.rango=payload.rango;
        var count=[]
        data_f.forEach(function(elemento,index){
            count[index]={total:0};
            data_f.forEach(function(e,i){
                if (moment(elemento.created_at).format('l')==moment(e.created_at).format('l')) {
                    count[index].created_at=moment(elemento.created_at).format('l');
                    count[index].total++;
                }
            })
        })
        // console.log('construllendo el array de fechas',count);
        state.array_fechas=_.uniqBy(count,'created_at');
        // console.log('array de fechas solo fecha unica',  state.array_fechas);
        var max=0;
        max=_.maxBy(count, o=>{ return o.total; });
        if (max==undefined) {
            state.calendario.max=0;
        }
        else{
            state.calendario.max=max.total;
        }
    },
    MutationsSelectedArchivos(state,payload){
        state.selectedArchivos=payload;
        let mes_actual= new Date();
        mes_actual=moment(mes_actual).format('YYYY-MM-DD');
        let mes_inicio= moment(mes_actual).subtract(11, 'months').format('YYYY-MM-DD');
        var diasEntreFechas = function(desde, hasta) {
            var dia_actual = desde;
            var fechas = [];
            while (dia_actual.isSameOrBefore(hasta)) {
                fechas.push(dia_actual.format('YYYY-MM'));
                dia_actual.add(1, 'months');
            }
            return fechas;
        };
        var desde = moment(mes_inicio);
        var hasta = moment(mes_actual);
        var results = diasEntreFechas(desde, hasta);
        state.TabMeses=results
        // console.log('results',results);
    },
    MutationsTablaLecturas(state,payload){
        var d=[]
        _.forEach(payload.datos,(e,i)=>{
            d[i]={nombre_usuario:e.usuario,fecha_lectura:moment(e.created_at).format('dddd DD'),hora_lectura:moment(e.created_at).format('hh:mm a'),tiempo_lectura:e.tiempo+' Min'};
        })
        state.datosMes=d;
    }
}
export const actions={
    loadCharCalendario({getters,commit}){
        return new Promise((resolve,reject)=>{
            axios.get(`${getters.ruta}/loadCharCalendario`).then(({data})=>{
                resolve(commit('MutationsloadCharCalendario',data));
            }).catch((error)=>{
                console.error(error);
            })
        })
    },
    selectedArchivos({getters,commit}){
        return new Promise((resolve,reject)=>{
            axios.get(`${getters.ruta}/selectedArchivos`).then(({data})=>{
                resolve(commit('MutationsSelectedArchivos',data));
            }).catch((error)=>{
                console.error(error);
            })
        })
    },
    TablaLecturas({getters,commit},payload){
        axios.get(`${getters.ruta}/${payload.mes}/${payload.anio}/${payload.id}/TablaLecturas`).then(({data})=>{
            commit('MutationsTablaLecturas',data);
        }).catch((error)=>{
            console.error(error);
        })
    }
}
