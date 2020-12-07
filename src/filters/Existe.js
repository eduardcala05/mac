const existe = {};

existe.install = Vue =>{
    Vue.filter('helper-existe',(valor,sino=false)=>{

        if(valor && sino){
            return valor
        }


    })
}

export default fecha;
