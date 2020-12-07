import Vue from 'vue'
import Estado from './views/electron/estado/index.vue'

Vue.component('Estado',Estado)

Vue.config.productionTip = false

new Vue({
    render: h=>h('Estado')
}).$mount('#app')