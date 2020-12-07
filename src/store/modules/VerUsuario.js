import axios from 'axios'
import moment from 'moment'

export const state={
    ruta:'usuario',
    InformacionPersonal:{
        nombre:'',
        foto:'',
        Conexion:{
            UltimaCarga:{
                created_at:''
            },
            UltimaConexion:{
                created_at:''
            },
            UltimaDescarga:{
                created_at:''
            }
        }
    },
    //
    TablaVisto:[],
    TablaTop:[],
    TablaRecientes:[],
    //
    dataLecturas:[],
    //
    SincronizacionLineas:[],
    SincronizacionBarras:[],
    //
    semanaHoras:'',
    mesHoras:'',
    mesBimestre:'',
    //
    CalificacionPromedio:0,
    CalificacionesComentarios:[],
    //
    ComportamientoCreados:[],
    ComportamientoActualizados:[],
    ComportamientoElimados:[]



}
export const getters={
    ruta: state=>state.ruta,
    InformacionPersonal:state=>state.InformacionPersonal,
    TablaVisto:state=>state.TablaVisto,
    TablaTop:state=>state.TablaTop,
    TablaRecientes:state=>state.TablaRecientes,
    dataLecturas:state=>state.dataLecturas,
    SincronizacionLineas:state=>state.SincronizacionLineas,
    SincronizacionBarras:state=>state.SincronizacionBarras,
    semanaHoras:state=>state.semanaHoras,
    mesHoras:state=>state.mesHoras,
    mesBimestre:state=>state.mesBimestre,
    CalificacionPromedio:state=>state.CalificacionPromedio,
    CalificacionesComentarios:state=>state.CalificacionesComentarios,
    ComportamientoCreados:state=>state.ComportamientoCreados,
    ComportamientoActualizados:state=>state.ComportamientoActualizados,
    ComportamientoElimados:state=>state.ComportamientoElimados,
}
export const mutations={
    MutationsInformacionVerUsuario(state,payload){
        state.InformacionPersonal=payload;
    },
    MutationsSincronizacionArchivos(state,payload){
        var data_fechas=payload.datos;
        var lineas=[];
        var barras=[];
        var diasEntreFechas = function(desde, hasta) {
            var dia_actual = desde;
            var fechas = [];
            while (dia_actual.isSameOrBefore(hasta)) {
                 // console.log(dia_actual,' - ',hasta);
                fechas.push(dia_actual.format('YYYY-MM-DD'));
                dia_actual.add(1, 'days');
            }
            return fechas;
        };
        var desde = moment(payload.rango[0]);
        var hasta = moment(payload.rango[1]);
        var results = diasEntreFechas(desde, hasta);
        results.forEach((e)=>{
            var j =_.find(data_fechas, (o)=> { return o.fecha == e; });
            if (j==undefined) {
                    lineas.push(0);
                    barras.push(0)
            }else {
                lineas.push(_.round(parseFloat(j.peso/1000),2)   );
                barras.push(parseInt(j.archivos));
            }
        })
        state.SincronizacionLineas=lineas;
        state.SincronizacionBarras=barras;
    },
    MutationTablasVerUsuarios(state,payload){
        state.TablaVisto=payload.vistos;
        state.TablaTop=payload.top;
        state.TablaRecientes=payload.recientes;
    },
    MutationgraficaLecturas(state,payload){
        var data_fechas=payload.array;
        var popote=[];
        var diasEntreFechas = function(desde, hasta) {
            var dia_actual = desde;
            var fechas = [];
            while (dia_actual.isSameOrBefore(hasta)) {
                fechas.push(dia_actual.format('YYYY-MM-DD'));
                dia_actual.add(1, 'days');
            }
            return fechas;
        };
        var desde = moment(payload.rango[0]);
        var hasta = moment(payload.rango[1]);
        var results = diasEntreFechas(desde, hasta);
        results.forEach((e)=>{
            var j =_.find(data_fechas, (o)=> { return o.fecha == e; });
            if (j==undefined) {
                    popote.push(0);
            }else {
                popote.push(parseInt(j.minutos));
            }
        })
        state.dataLecturas=popote;
    },
    MutationCardLecturas(state,payload){
        // card horas mesana
        var string = (payload.semana[0].minutos/60).toString();
        var j_1 = string.split(".");
        var Horas_1 = j_1[0]; // 123
        var minutos_1 = '0.'+j_1[1]; // 654321
        minutos_1= _.round(parseFloat(minutos_1*60)).toString();
        if ('NaN'==minutos_1) {
            minutos_1=0;
        }
        state.semanaHoras= j_1[0]+' hrs '+minutos_1+' min';
        // card horas mes
        var string_2 = (payload.mes[0].minutos/60).toString();
        var j_2 = string_2.split(".");
        var Horas_2 = j_2[0];
        var minutos_2 = '0.'+j_2[1];
        minutos_2= _.round(parseFloat(minutos_2*60)).toString();
        if ('NaN'==minutos_2) {
            minutos_2=0;
        }
        state.mesHoras= j_2[0]+' hrs '+minutos_2+' min';
        //
        var string_3 = (payload.mes[0].minutos/60).toString();
        var j_3 = string_3.split(".");
        var Horas_3 = j_3[0];
        var minutos_3 = '0.'+j_3[1];
        minutos_3= _.round(parseFloat(minutos_3*60)).toString();
        if ('NaN'==minutos_3) {
            minutos_3=0;
        }
        state.mesBimestre= j_3[0]+' hrs '+minutos_3+' min';
    },
    MutationCalificacionesUsuario(state,payload){
        state.CalificacionPromedio=parseFloat(payload.calificacion);
        state.CalificacionesComentarios=payload.comentarios;
    },
    MutationGraficaComportamiento(state,payload){
        var desde = moment(payload.rango[0]);
        var hasta = moment(payload.rango[1]);
        var diasEntreFechas = function(desde, hasta) {
            var dia_actual = desde;
            var fechas = [];
            while (dia_actual.isSameOrBefore(hasta)) {
                fechas.push(dia_actual.format('YYYY-MM-DD'));
                dia_actual.add(1, 'days');
            }
            return fechas;
        };
        //
        let creados=[];
        let actualizados=[];
        let eleminados=[];
        let p_creados=payload.creados;
        let p_actualizados=payload.actualizados;
        let p_eliminar=payload.eliminados;
        //
        var results = diasEntreFechas(desde, hasta);
        results.forEach((e)=>{
            var temp =_.find(p_creados, (o)=> { return o.fecha == e; });
            var temp2 =_.find(p_actualizados, (o)=> { return o.fecha == e; });
            var temp3 =_.find(p_eliminar, (o)=> { return o.fecha == e; });
            if (temp==undefined) {
                    creados.push(0);
            }
            else {
                creados.push(parseInt(temp.total));
            }
            if (temp2==undefined) {
                    actualizados.push(0);
            }
            else {
                actualizados.push(parseInt(temp2.total));
            }
            if (temp3==undefined) {
                    eleminados.push(0);
            }
            else {
                eleminados.push(parseInt(temp3.total));
            }
        })
        state.ComportamientoCreados=creados,
        state.ComportamientoActualizados=actualizados,
        state.ComportamientoElimados=eleminados
    }
}
export const actions={
    InformacionVerUsuario({getters,commit},payload){
            axios.get(`${getters.ruta}/VerUsuario/${payload}/InformacionVerUsuario`).then((response)=>{
                commit('MutationsInformacionVerUsuario',response.data);
            }).catch((error)=>{
                console.log(error);
            })
    },
    SincronizacionArchivos({getters,commit},payload){
        return new Promise((resolve,reject)=>{
            axios.get(`${getters.ruta}/VerUsuario/${payload}/SincronizacionArchivos`).then((response)=>{
                resolve(commit('MutationsSincronizacionArchivos',response.data));
            }).catch((error)=>{
                console.log(error);
            })

        })
    },
    graficaCalendario({getters,commit},payload){
        return new Promise((resolve,reject)=>{
            axios.get(`${getters.ruta}/VerUsuario/${payload}/graficaCalendario`).then((response)=>{
                resolve(response.data);
                console.log();
            }).catch((error)=>{
                console.log(error);
            })
        })
    },
    TablasVerUsuarios({getters,commit},payload){
        axios.get(`${getters.ruta}/VerUsuario/${payload}/TablasVerUsuarios`).then((response)=>{
            commit('MutationTablasVerUsuarios',response.data);
        }).catch((error)=>{
            console.log(error);
        })
    },
    graficaLecturas({getters,commit},payload){
        return new Promise((resolve,reject)=>{
            axios.get(`${getters.ruta}/VerUsuario/${payload}/graficaLecturas`).then((response)=>{
                resolve(commit('MutationgraficaLecturas',response.data));
            }).catch((error)=>{
                console.log(error);
            })
        })
    },
    CardLecturas({getters,commit},payload){
        axios.get(`${getters.ruta}/VerUsuario/${payload}/CardLecturas`).then((response)=>{
            commit('MutationCardLecturas',response.data);
        }).catch((error)=>{
            console.log(error);
        })
    },
    calificacionesUsuario({getters,commit},payload){
        axios.get(`${getters.ruta}/VerUsuario/${payload}/calificacionesUsuario`).then((response)=>{
            commit('MutationCalificacionesUsuario',response.data);
        }).catch((error)=>{
            console.log(error);
        })
    },
    graficaComportamiento({getters,commit},payload){
        return new Promise((resolve,reject)=>{
            axios.get(`${getters.ruta}/VerUsuario/${payload}/graficaComportamiento`).then((response)=>{
                resolve(commit('MutationGraficaComportamiento',response.data));
            }).catch((error)=>{
                console.log(error);
            })
        })
    }
}
