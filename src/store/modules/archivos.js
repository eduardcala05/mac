export const state = {
    archivos: []
}
export const getters = {
    getArchivos: state=>state.archivos
}
export const mutations = {
    setArchivos(state,payload){
        state.archivos = payload
    }
}
export const actions = {
    async fetchArchivos(){

    }
}
