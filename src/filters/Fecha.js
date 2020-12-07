import moment from 'moment';
const fecha = {};

fecha.install = Vue =>{
    Vue.filter('helper-fecha',(valor,formato=false)=>{
        if (moment(valor).isValid() && formato) {
            return moment(valor).format(formato);
        }
        if(moment(valor).isValid()){
            return moment(valor).format('MMM Y');
        }
        return 'No Registra';
    })
}

export default fecha;
