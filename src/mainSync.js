import Vue from 'vue'
import Sync from './views/electron/sync/index.vue'

Vue.component('Sync',Sync)

Vue.config.productionTip = false

new Vue({
    render: h=>h('Sync')
}).$mount('#app')