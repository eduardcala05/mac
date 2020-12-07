import Vue from 'vue'
import Unidades from './views/electron/unidades/index.vue'

Vue.component('Unidades',Unidades)

Vue.config.productionTip = false

new Vue({
    render: h => h('Unidades')
}).$mount('#app')