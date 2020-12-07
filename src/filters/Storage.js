import store from '../store'
const helper_storage = {}

let fotos={
	cliente:'/img/default/sin_user.png',
	fondoLogin:'/img/default/fondo.png',
	logoLogin:'/img/default/lateral.png',
	barra_lateral:'/img/default/logo-empresa-modal.png',
	logo_modal:'/img/default/logo-empresa-modal.png'
};

const convertir = (texto,tipo) =>{
	if (store.getters["auth/cliente"]) {
		try {
			if (texto) {
				return `${store.getters['app/serverApi']}storage/${texto}?cliente=${store.getters["auth/cliente"]}`;
			}
		} catch (e) {
			console.error(e)
		}
	}
	return  fotos[tipo]

}

helper_storage.install = function(Vue){
	Vue.filter('helper-storage', (val,tipo) =>{
		return convertir(val,tipo);
	})
}

export default helper_storage;
