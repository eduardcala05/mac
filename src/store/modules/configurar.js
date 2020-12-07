import axios from 'axios'
import {get} from 'lodash'
//state
export const state = {
    ruta: 'configuracion',
    config: {}
}

//getters
export const getters = {
    tema: state => get(state, 'config.tema', 1),
    color: state => get(state, 'config.color', '#fff'),
    fondo: state => get(state, 'config.fondo', '/img/cargando-imagen.gif'),
    lateral: state => get(state, 'config.lateral', '/img/cargando-imagen.gif'),
    barra: state => get(state, 'config.barra', '/img/cargando-imagen.gif'),
    modal: state => get(state, 'config.modal', '/img/cargando-imagen.gif'),
}

//mutations
export const mutations = {
    setConfig(state, payload) {
        state.config = payload;
    },
    setTema(state, payload) {
        state.config.tema = payload;
    },
    setColor(state, payload) {
        state.config.color = payload;
    }

}

//actions
export const actions = {
    async getConfig({commit}) {
        try {
            let {data} = await axios(`configuracion`)
            commit('setConfig', data)
            window.api.send('toConfiguracionInsert',data)
        } catch (e) {
            console.log(e)
        }
    },
    async setTema({commit}, payload) {
        try {
            let {data} = await axios.post(`configuracion/interface/tema`, {'tema': payload})
            commit('setTema', data)
        } catch (e) {
            console.log(e)
        }
    },
    async setColor({commit}, payload) {
        try {
            let {data} = await axios.post(`configuracion/interface/color`, {'id_color': payload})
            commit('setConfig', data)
        } catch (e) {
            console.log(e)
        }
    },
    GuardarImagenPersonalizados({getters}, payload) {
        return new Promise((resolve) => {
            axios.post(`configuracion`, payload).then((response) => {
                resolve(response.data);
            }).catch((error) => {
                console.error(error);
            })
        })
    },
    LoadImagenPersonalizados({getters, commit}) {
        return new Promise((resolve) => {
            axios.get(`${getters.ruta}/configuracionLogin/LoadImagenPersonalizados`).then((response) => {
                resolve(commit('MutationsImagenPersonalizados', response.data));
            }).catch((error) => {
                console.error(error);
            })
        })
    },
    LoadImagenLoging({commit}) {
        return new Promise((resolve) => {
            axios.get(`LoadImagenLoging`).then((response) => {
                resolve(commit('MutationsImagenPersonalizados', response.data));
            }).catch((error) => {
                console.error(error);
            })
        })
    },
    LoadGaleriaImagenModal({getters, commit}) {
        return new Promise((resolve) => {
            axios.get(`${getters.ruta}/configuracionLogin/GaleriaImagenModal`).then((response) => {
                resolve(commit('MutationsGaleriaImagenModal', response.data))
            }).catch((error) => {
                console.error(error);
            })
        })
    },
    GuardarSelectTema({getters, commit}, payload) {
        return new Promise((resolve) => {
            axios.post(`${getters.ruta}/interface/GuardarSelectTema`, {'tema': payload}).then((response) => {
                resolve(commit('MutationsImagenPersonalizados', response.data));
            }).catch((error) => {
                console.error(error);
            });
        })
    },
    GuardarColorBoton({getters, commit}, payload) {
        return new Promise((resolve) => {
            axios.post(`${getters.ruta}/interface/GuardarColorBoton`, {'id_color': payload}).then((response) => {
                resolve(commit('MutationsImagenPersonalizados', response.data));
            }).catch((error) => {
                console.error(error);
            })
        })
    }
}
