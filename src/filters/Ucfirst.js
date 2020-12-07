const ucfirst = {}

const convertir = texto =>{
	if (texto) {
		return texto.charAt(0).toUpperCase() + texto.slice(1);			
	}
}

ucfirst.install = function(Vue){
	Vue.filter('ucfirst', val =>{
		return convertir(val);
	})
}

export default ucfirst;