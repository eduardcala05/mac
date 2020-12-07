import axios from 'axios'
import Cookies from 'js-cookie'
import Auth from '../../services/auth'
// state
export const state = {
  user: null,
  token: Cookies.get('token'),
  cliente: Cookies.get('cliente'),

}

// getters
export const getters = {
  user: state => state.user,
  token: state => state.token,
  cliente: state => state.cliente,
  check: state => state.user !== null
}

// mutations
export const mutations = {
  SAVE_TOKEN(state, { token, remember }) {
    state.token = token
    Cookies.set('token', token, { expires: remember ? 365 : null })
  },
  SAVE_CLIENTE(state, payload) {
    state.cliente = payload
    // Cookies.remove('cliente')
    Cookies.set('cliente', payload)
  },

  FETCH_USER_SUCCESS(state, { user }) {
    state.user = user
  },

  FETCH_USER_FAILURE(state) {
    console.log('paila');
    state.token = null
    Cookies.remove('token')
  },

  LOGOUT(state) {
    state.user = null
    state.token = null
    state.cliente = null

    Cookies.remove('token')
    Cookies.remove('cliente')
  },

  UPDATE_USER(state, { user }) {
    state.user = user
  }
}

// actions
export const actions = {
  saveToken ({ commit, dispatch }, payload) {
    commit('SAVE_TOKEN', payload)
  },

  async fetchUser ({ commit }) {
    try {
      //const { data } = await axios.get('/api/user')
      const { data } = await Auth.getUser()

      commit('FETCH_USER_SUCCESS', { user: data })
    } catch (e) {
      commit('FETCH_USER_FAILURE')
    }
  },

  updateUser ({ commit }, payload) {
    commit('UPDATE_USER', payload)
  },

  async logout ({ commit }) {
    try {
      await axios.post('/api/logout')
    } catch (e) { }

    commit('LOGOUT')
  },

  async fetchOauthUrl (ctx, { provider }) {
    const { data } = await axios.post(`/api/oauth/${provider}`)

    return data.url
  }
}
