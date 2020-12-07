import Vue from 'vue'

import Ucfirst from './Ucfirst'
import HelperStorage from './Storage'
import HelperFecha from './Fecha'
import Humanizar from './Humanizar'

[
  Ucfirst,
  HelperStorage,
  HelperFecha,
  Humanizar
].forEach(Filter=>{
  Vue.use(Filter)
})
