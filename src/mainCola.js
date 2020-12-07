import Vue from 'vue'
import Cola from './views/electron/cola/index.vue'

Vue.component('Cola',Cola)

Vue.config.productionTip = false

new Vue({
    render: h=>h('Cola')
}).$mount('#app')