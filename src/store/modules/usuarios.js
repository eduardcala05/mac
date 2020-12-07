import axios from 'axios'
// state
export const state = {
    ruta: 'usuario',
    selectRoles: [],
    selectUser: '',
    listUsuarios: [],
    userdatos: {},
    userCarpetas: [],
    UpdatedPermisos: [],
    PermisoUnidadPrincipal: [],
    PermisoUnidadDescarga: [],
    juan: null

}

// getters
export const getters = {
    ruta: state => state.ruta,
    roles: state => state.selectRoles,
    ListarUsuarios: state => state.listUsuarios,
    datosUsuarios: state=>state.userdatos,
    carpetaPrivadas: state => _.filter(state.userCarpetas,['tipo', 1]),
    carpetaPublica: state => _.filter(state.userCarpetas,['tipo', 2]),
    // CarpetasUsuarios:state =>(val)=>_.map(_.filter(state.userCarpetas, (o)=> {return o.tipo===val; }),(m)=>{
    //   // console.log(m.usuario,'m.usuario'),
    //   m.activo = m.usuario.indexOf(state.selectUser)>-1
    //   return m
    // }),
}

// mutations
export const mutations = {
    PermisoUnidadDescarga(state, payload) {
        payload.activo = !payload.activo
        if (payload.activo) payload.usuario = [state.selectUser]
        let indice;
        if (_.some(state.PermisoUnidadDescarga, {Id_carpeta: payload.Id_carpeta, usuario: payload.usuario})) {
            indice = state.PermisoUnidadDescarga.findIndex(a => a.Id_carpeta === payload.Id_carpeta && a.usuario === payload.usuario)
            state.PermisoUnidadDescarga.splice(indice, 1);
            state.PermisoUnidadDescarga.push(payload);
        } else {
            state.PermisoUnidadDescarga.push(payload);
        }
    },
    PermisoUnidadPrincipal(state, payload) {
        payload.activo = !payload.activo
        if (payload.activo) payload.usuario = [state.selectUser]
        let indice;
        if (_.some(state.PermisoUnidadPrincipal, {Id_carpeta: payload.Id_carpeta, usuario: payload.usuario})) {
            indice = state.PermisoUnidadPrincipal.findIndex(a => a.Id_carpeta === payload.Id_carpeta && a.usuario === payload.usuario)
            state.PermisoUnidadPrincipal.splice(indice, 1);
            state.PermisoUnidadPrincipal.push(payload);
        } else {
            state.PermisoUnidadPrincipal.push(payload);
        }
    },
    errorServer(state, payload) {
        console.log(payload);
    },
    selectUser(state, payload) {
        state.PermisoUnidadPrincipal = []
        state.selectUser = payload
    },
    roles(state, payload) {
        state.selectRoles = payload;
    },
    ListarUsuarios(state, payload) {
        state.listUsuarios = payload;
    },
    datosUsuarios(state, payload) {
        state.userdatos = payload;
    },
    MutationsLoadEditarPermisoUsuario(state, payload) {
        state.userCarpetas = payload;
    },


}

// actions
export const actions = {

    roles({getters, commit}) {
        return new Promise((resolve, reject) => {
            axios(`${getters.ruta}/roles`).then((response) => {
                commit('roles', response.data)
            }).catch((response) => {
                commit('errorServer', response)
            })
        })

    },
    async updatedUsuarios({getters, commit}, payload) {
        try {
            let {data} = await payload.post(`${getters.ruta}/updatedUsuarios`, payload)
            return data
        } catch (e) {
            throw e
        }
    },
    async crearUsuario({getters, commit}, payload) {
        try {
            let {data} = await payload.post(`${getters.ruta}/CrearUsuario`, payload)
            return data
        } catch (e) {
            throw e
        }
    },
    async ListarUsuarios({getters, commit}) {
        try {
            let {data} = await axios(`${getters.ruta}/ListarUsuarios`)
            commit('ListarUsuarios', data)
        } catch (e) {
            throw e
        }
    },
    datosUsuarios({getters, commit}, payload) {
        return new Promise((resolve, reject) => {
            axios.get(`${getters.ruta}/${payload}/datosUsuarios`).then((response) => {
                // console.log('resolve',response.data);
                resolve(commit('datosUsuarios', response.data));
            }).catch((error) => {
                // console.log('errorServer',error)
                reject(error);
            })
        })
    },

    EliminarUserEquipo({getters, commit}, payload) {
        // console.log(payload);
        return new Promise((resolve, reject) => {
            axios.put(`${getters.ruta}/EliminarUserEquipo`,payload).then((response) => {
                resolve(response)
            }).catch((error) => {
                reject(error)
            })
        })
    },
    EliminarUsuario({getters, commit}, payload) {
        return new Promise((resolve, reject) => {
            axios.put(`${getters.ruta}/${payload}/EliminarUsuario`).then((response) => {
                resolve(response);
            }).catch((error) => {
                reject(error);
            })
        })
    },
    /**
     * @return {boolean}
     */
    async LoadEditarPermisoUsuario({getters, commit}, payload) {
        try {
            let {data} = await axios.post(`${getters.ruta}/LoadEditarPermisoUsuario`, payload)
            commit('MutationsLoadEditarPermisoUsuario', data)
        } catch (e) {
            console.log(e)
            return false
        }
    },
    async PermisoUnidad({getters, dispatch},payload) {
        console.log(payload)
        try {
            let {data} = await axios.post(`${getters.ruta}/UpdatedPermisos`, {
                id_user: payload.form.usuario,
                id_carpeta: payload.carpeta.id
            })
            if(data){
                dispatch('LoadEditarPermisoUsuario', payload.form)
                return data
            }
        } catch (e) {
            console.log(e)
            return false
        }
        // return new Promise((resolve, reject) => {
        //     axios.put(`${getters.ruta}/UpdatedPermisos`, state.PermisoUnidadDescarga).then((response) => {
        //         resolve(response.data);
        //     }).catch((error) => {
        //         reject(error);
        //     })
        // })
    }
}
