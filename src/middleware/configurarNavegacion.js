/*
* esto es para navegar a la
* ultima ruta de la tab
*/
export default (to,from,next)=>{
    if(to.params.bandera === 1){
        const ultimaRuta = window.localStorage.getItem('configurar-ultima-ruta')
        return next({name: ultimaRuta})
    }
    next()
}
