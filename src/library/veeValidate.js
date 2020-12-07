import Vue from 'vue'
import { extend, ValidationProvider, ValidationObserver } from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import es from 'vee-validate/dist/locale/es'

for (const rule in rules){
    // eslint-disable-next-line no-unused-expressions
    extend(rule, {
        ...rules[rule], // add the rule
        message: es.messages[rule] // add its message
    })
}
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)
