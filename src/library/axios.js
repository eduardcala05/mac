import axios from 'axios'
import store from '../store'
import router from '../router'

axios.defaults.baseURL = process.env.VUE_APP_URL
// axios.defaults.headers['Cliente'] = 'eyJpdiI6IjJmNEN0d1hOdU9BZ3pSTWMxcWVrbEE9PSIsInZhbHVlIjoiYXd2VXVQQ0VrMHdweG9lV2Z1NW4zQT09IiwibWFjIjoiZDRlZjU3NGExZGEyN2Y2MDIyYTQxMzc2MjE2YWJiNTk2NTRhZjRjZjJhYTY4YWI3MDZlMjZkYmYzNWQ2NTQ3NCJ9'

//import Swal from 'sweetalert2'
//import i18n from '~/plugins/i18n'

// Request interceptor
axios.interceptors.request.use(request => {
  const token = store.getters['auth/token']
  if (token) {
    request.headers.common['Authorization'] = `Bearer ${token}`
  }

  const cliente = store.getters['auth/cliente']
  if(cliente){
      request.headers.common['Cliente'] = cliente
  }

  return request
})

// Response interceptor
axios.interceptors.response.use(response => response, error => {
  const { status } = error.response

  if (status >= 500) {
    // Swal.fire({
    //   type: 'error',
    //   title: i18n.t('error_alert_title'),
    //   text: i18n.t('error_alert_text'),
    //   reverseButtons: true,
    //   confirmButtonText: i18n.t('ok'),
    //   cancelButtonText: i18n.t('cancel')
    // })
  }

  if (status === 401 && store.getters['auth/check']) {
    // Swal.fire({
    //   type: 'warning',
    //   title: i18n.t('token_expired_alert_title'),
    //   text: i18n.t('token_expired_alert_text'),
    //   reverseButtons: true,
    //   confirmButtonText: i18n.t('ok'),
    //   cancelButtonText: i18n.t('cancel')
    // }).then(() => {
    //   store.commit('auth/LOGOUT')
    //   router.push({ name: 'login' })
    // })

    store.commit('auth/LOGOUT')
    router.push({ name: 'login' })

  }

  return Promise.reject(error)
})
