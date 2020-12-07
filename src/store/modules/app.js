export const state = {
    mac: '',
    mac_registrada: false,
    sistema_operativo: ''
}

export const getters = {
    getMac: state=>state.mac,
    getMacRegistrada: state=>state.mac_registrada,
    getSistemaOperativo: state => state.sistema_operativo
}

export const mutations = {
    setMac(state,payload){
        state.mac = payload
    },
    setMacRegistrada(state,payload){
        state.mac_registrada = payload ? true : false
    },
    setSistemaOperativo(state,payload){
        state.sistema_operativo = payload
    }
}

