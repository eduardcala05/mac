import moment from 'moment';

const fecha = {};

fecha.install = Vue =>{
    Vue.filter('humanizar',(fecha)=>{
        if(moment(fecha).isValid()){
            let fecha_fin = moment(fecha);
            let fecha_hoy = moment();
            let segundos  = fecha_hoy.diff(fecha_fin,'s');
            return moment.duration(segundos,'s').humanize();
        }else{
            return ''
        }
    })
}

export default fecha;
