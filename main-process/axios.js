const { credencialesTokenGet } = require('./credenciales');
const { credencialesClienteGet } = require('./credenciales');

const axios = require('axios').default

axios.defaults.baseURL = process.env.VUE_APP_URL
// axios.defaults.headers['Cliente'] = 'eyJpdiI6IjJmNEN0d1hOdU9BZ3pSTWMxcWVrbEE9PSIsInZhbHVlIjoiYXd2VXVQQ0VrMHdweG9lV2Z1NW4zQT09IiwibWFjIjoiZDRlZjU3NGExZGEyN2Y2MDIyYTQxMzc2MjE2YWJiNTk2NTRhZjRjZjJhYTY4YWI3MDZlMjZkYmYzNWQ2NTQ3NCJ9'
// axios.defaults.headers['Cliente'] = 'clientePrueba'

axios.interceptors.request.use(request => {
    let {token} = credencialesTokenGet()
    //console.log('interceptor axios',token);
    request.headers.common['Authorization'] = `Bearer ${token}`

    let {identificador} = credencialesClienteGet()
    console.log(identificador,'clienteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
    //console.log('interceptor axios',token);
    request.headers.common['Cliente'] = identificador

    return request
})

module.exports = {
    axios
}
