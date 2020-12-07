import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from '@/library/i18n'

import './style'
import './library'
import './components'
import './filters'
import './mixins'

import MIX from "./mixins/index";
Vue.mixin(MIX);

import VueCutter from 'vue-cutter'
Vue.use(VueCutter)

Vue.config.productionTip = false

/*
* comunicacion de eventos
* con el hilo principal
*/
export const messageBus = new Vue()

window.api.send('toClienteGet')
window.api.send('toTokenGet')

// metodo agregado por yesid ortiz para obtener en identificador del cliente
window.api.receive('fromClienteGet',async(evt)=>{
    if(!evt.identificador) return
    store.commit('auth/SAVE_CLIENTE',evt.identificador)
})
window.api.receive('fromTokenGet',async(evt)=>{

    new Vue({
        i18n,
        router,
        store,
        render: h => h(App),
        created(){
            window.api.send('toHddSerialGet')
            window.api.send('toSistemaOperativoGet')
            window.api.send('toMacExiste')
        }
    }).$mount('#app')

    if(!evt.token) return

    store.dispatch('auth/saveToken',{
        token: evt.token,
        remember: evt.expires_in
    })

    store.dispatch('auth/fetchUser').then(()=>{
        router.push({ name: 'home.mi-unidad' })
    })
})

// window.api.send('toArchivosSync')
window.api.receive('fromInternetStatus',(evt)=>{
    messageBus.$emit('fromInternetStatus',evt)
})

window.api.receive('fromFolderOpen',(evt)=>{
    messageBus.$emit('fromFolderOpen',evt)
})

window.api.receive('fromHddSerialGet',(evt)=>{
    console.log('de fromHddSerialGet',evt);
    store.commit('app/setMac',evt)
    messageBus.$emit('fromHddSerialGet',evt)
})

window.api.receive('fromArchivosListar',(evt)=>{
    messageBus.$emit('fromArchivosListar',evt)
})
window.api.receive('fromArchivosProcesar',(evt)=>{
    console.log(`avance: ${evt}%`);
    messageBus.$emit('fromArchivosProcesar',evt)
})

window.api.receive('fromUnidadesGet',(evt)=>{
    messageBus.$emit('fromUnidadesGet',evt)
})

window.api.receive('fromArchivosGet',(evt)=>{
    messageBus.$emit('fromArchivosGet',evt)
})

window.api.receive('fromArchivosGetFolderId',(evt)=>{
    messageBus.$emit('fromArchivosGetFolderId',evt)
})

window.api.receive('fromCarpetasByUnidadGet',(evt)=>{
    messageBus.$emit('fromCarpetasByUnidadGet',evt)
})

window.api.receive('fromMacExiste',(evt)=>{
    store.commit('app/setMacRegistrada',evt)
    messageBus.$emit('fromMacExiste',evt)
})

window.api.receive('fromSistemaOperativoGet',evt=>{
    console.log('en la vista so:',evt);
    store.commit('app/setSistemaOperativo',evt)
    messageBus.$emit('fromSistemaOperativoGet',evt)
})
