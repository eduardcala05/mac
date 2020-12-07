import axios from 'axios'
export const Unidad = {
    getInfo(mac){
        return axios(`/configuracion/unidad/${mac}/informacionUnidad`)
    },
    saveUnidadPrincipal(payload = {}){
        return axios.post(`/configuracion/unidad/storeUnidadPrincipal`, payload)
    },
    saveUnidadDescarga(payload = {}){
        return axios.post(`/configuracion/unidad/storeUnidadDescarga`, payload)
    },
    getUnidadUser(userId=null){
        return axios(`/v2/usuario/${userId}/unidades/archivos`)
    },
    get(query={}){
        return axios(`/v2/unidades`,{params:query})
    }
}

export default Unidad
