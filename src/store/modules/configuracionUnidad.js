import axios from 'axios'
import UnidadService from '../../services/unidad_service'

const unidadService = new UnidadService();
export const state = {
  ruta: 'configuracion',
  informacionUnidad: []
}
export const getters = {
  ruta: state => state.ruta,
  informacionUnidad: state => state.informacionUnidad,

}
export const mutations = {
  MutationsInformacionUnidad(state, payload) {
    state.informacionUnidad = payload
  },

}
export const actions = {
  async getUnidad(state, payload) {
    return  await unidadService.where({mac: payload})
  },
  storeUnidadPrincipal({getters}, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${getters.ruta}/unidad/storeUnidadPrincipal`, payload).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        console.error(error);
      })
    })
  },
  storeUnidadDescarga({getters}, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${getters.ruta}/unidad/storeUnidadDescarga`, payload).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        console.error(error);
      })
    })
  },

  storeUnidadDescargaComercial({getters}, payload) {
    return new Promise((resolve, reject) => {
      axios.post(`${getters.ruta}/unidad/storeUnidadDescargaComercial`, payload).then((response) => {
        resolve(response.data);
      }).catch((error) => {
        console.error(error);
      })
    })
  },
  informacionUnidad({getters, commit}, payload) {
    return new Promise((resolve, reject) => {
      console.log(payload);
      axios.get(`${getters.ruta}/unidad/${payload}/informacionUnidad`).then((response) => {
        resolve(response.data);
        commit('MutationsInformacionUnidad', response.data);
      }).catch((error) => {
        console.error(error);
      })
    })
  }
}
