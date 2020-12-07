import axios from 'axios'
// state
export const state = {
  ruta:'configuracion',
  array_permisosAdmin_User:[],
  array_permisosAdmin_Admin:[],
  array_PermisosUsuario_Admin:[]
}
// getters
export const getters = {
  ruta: state => state.ruta,
  permisosAdmin_User:state => state.array_permisosAdmin_User,
  permisosAdmin_Admin:state => state.array_permisosAdmin_Admin,
  permisosUsuario_Admin:state=>state.array_PermisosUsuario_Admin,
}
// mutations
export const mutations = {
  mutations_permisosAdmin_User(state,payload){
    state.array_permisosAdmin_User=payload;
  },
  mutations_permisosAdmin_Admin(state,payload){
    state.array_permisosAdmin_Admin=payload;
  },
  Mutations_permisosUserAdmin(state,payload){
    state.array_PermisosUsuario_Admin=payload;
  }

}
// actions
export const actions = {
    listarPermisosAdmin_User({getters,commit}){
        return new Promise((resolve,reject)=>{
            axios.get(`${getters.ruta}/permisosAdminUser/permisosAdmin_User`).then((response)=>{
                resolve(commit('mutations_permisosAdmin_User',response.data))
            }).catch((error)=>{
                console.error(error);
            })
        })
    },
    updatedPermisosAdmin_User({getters,commit},payload){
        return new Promise ((resolve,reject)=>{
          axios.put(`${getters.ruta}/permisosAdminUser/updatedPermisosAdmin_User`,payload).then((response)=>{
            resolve(response.data);
        }).catch((error)=>{
            console.error(error);
          })
        })
    },
    listarPermisosAdmin_Admin({getters,commit}){
        return new Promise((resolve,reject)=>{
            axios.get(`${getters.ruta}/permisosAdminUser/listarPermisosAdmin_Admin`).then((response)=>{
                resolve(commit('mutations_permisosAdmin_Admin',response.data))
            }).catch((error)=>{
                console.error(error);
            })
        })
    },
    updatedPermisosAdmin_Admin({getters,commit},payload){
        return new Promise ((resolve,reject)=>{
            axios.put(`${getters.ruta}/permisosAdminUser/updatedPermisosAdmin_Admin`,payload).then((response)=>{
                resolve(response.data);
            }).catch((error)=>{
                console.error(error);
            })
        })
    },
    listarPermisosUser_Admin({getters,commit}){
        return new Promise((resolve,reject)=>{
            axios.get(`${getters.ruta}/permisosAdminUser/listarPermisosUser_Admin`).then((response)=>{
                resolve(commit('Mutations_permisosUserAdmin',response.data));
            }).catch((error)=>{
                console.error(error);
            })
        })
    },
    updatedPermisosUsuario_Admin({getters,commit},payload){
      return new Promise ((resolve,reject)=>{
        axios.put(`${getters.ruta}/permisosAdminUser/updatedPermisosUsuario_Admin`,payload).then((response)=>{
          resolve(response.data);
        }).catch((error)=>{
          console.error(error);
        })
      })
    }

}
