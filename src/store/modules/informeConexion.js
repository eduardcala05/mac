import axios from 'axios'
import moment from 'moment'
export const state={
    ruta:'informeConexion',
    usuarios_data:[],
    titulo_fecha:''
}
export const getters={
    ruta:state=>state.ruta,
    usuarios_data:state=>state.usuarios_data,
    titulo_fecha:state=>state.titulo_fecha,
}
export const mutations={
    MutationsLoadInformeConexio(state,payload){
        var fechas=payload.fechas;
        var hoy = moment(fechas[0])
        var final = moment(fechas[1])
        let color=['#f7eeefd1','#28a745','#5d5d5d','','','#f17117']
        state.titulo_fecha=moment(hoy).format('MMMM Do YYYY');


        let data = _.map(payload.grafica,(m)=>{



            m.grafica_conexiones = _.map(m.grafica_conexiones,(elemento,index)=>{
                var porcentaje=0

                if (index==0) {
                    var dif=moment(elemento.created_at).diff(hoy,'m');
                    porcentaje=parseFloat((100*dif)/1440)
                    let tipo=0
                    if (m.ultimoRegistro!='') {
                        tipo=m.ultimoRegistro[0].conexion;
                    }
                    return {
                        width:porcentaje,
                        background:color[tipo],
                        position:index,
                        created_at:elemento.created_at,
                        conexion:elemento.conexion,
                        hora_inicio:moment(hoy).format('H:mm:ss'),
                        hora_final:moment(elemento.created_at).format('H:mm:ss')
                    }
                }else{
                    var ii = (index-1)
                    var dif=moment(elemento.created_at).diff(m.grafica_conexiones[ii].created_at,'m');
                    porcentaje=parseFloat((100*dif)/1440)
                    return {
                        width:porcentaje,
                        background:color[m.grafica_conexiones[ii].conexion],
                        position:index,
                        created_at:elemento.created_at,
                        conexion:elemento.conexion,
                        hora_inicio:moment(m.grafica_conexiones[ii].created_at).format('H:mm:ss'),
                        hora_final:moment(elemento.created_at).format('H:mm:ss')
                    }
                }




            })
            // console.log(m.grafica_conexiones.length);


            if (m.grafica_conexiones.length>0) {
                let newPosition=m.grafica_conexiones.length;
                let total = _.sumBy(m.grafica_conexiones,"width")
                let a=moment();
                let restante=0;
                let hora_final=moment(final).format('H:mm:ss');
                if (moment(a).format('YYYY-MM-DD')==moment(hoy).format('YYYY-MM-DD')) {
                    var dif=moment(a).diff(hoy,'m');
                    let porcentaje_actual=parseFloat((100*dif)/1440)
                    restante = porcentaje_actual - total
                    hora_final=moment(a).format('H:mm:ss');


                }else{
                    restante = 100 - total
                }




                if (restante <= 100) {
                    m.grafica_conexiones[newPosition]={
                        width:restante,
                        background:color[m.grafica_conexiones[parseInt(newPosition-1)].conexion],
                        position:newPosition,
                        created_at:final,
                        conexion:0,
                        hora_inicio:moment(m.grafica_conexiones[parseInt(newPosition-1)].created_at).format('H:mm:ss'),
                        hora_final:hora_final
                    }
                }
            }
            return m
        })
        // console.log(data);
        state.usuarios_data=data;




    }
}
export const actions={
    LoadInformeConexio({getters,commit},payload){
        axios.get(`${getters.ruta}/${payload}/LoadInformeConexio`).then(({data})=>{
            commit('MutationsLoadInformeConexio',data);
        }).catch((error)=>{
            console.error(error);
        })
    },

    killApp({getters,commit},payload){
        axios.get(`conexion/killApp`).then(({data})=>{
        }).catch((error)=>{
            console.error(error);
        })
    }
}
