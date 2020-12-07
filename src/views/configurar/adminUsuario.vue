<template>
    <section class="config-admin-usuario">
        <p class="px-3 text-muted2 f-15 f-600 mb-5">Permiso de acceso entre Administradores - Usuarios</p>
        <div class="row permisos-listado px-5">
            <table class="tablapermisos tablapermisos-highlight-all w-100 mx-auto">
                <thead>
                <tr>
                    <th>Admin / User</th>
                    <th v-for="data in array_usuarios" scope="col" v-if="data.id_rol===3">
                        <!-- usuarios  -->
                        <div class="d-flex align-items-center justify-content-center px-2">
                            <!-- <el-avatar :src="data.photo_url" class="mr-2"/> -->
                            <img
                            class="rounded-circle obj-cover mr-2 border bg-whitesmoke"
                            height="40" width="40"
                            :src="data.photo_url" alt=""
                            />
                            <div class="text-muted2 col px-1 f-12">{{data.nombre}}</div>
                        </div>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(data,i) in array_usuarios" v-if="[2,4].indexOf(data.id_rol)>-1">
                    <th scope="row">
                        <!-- Administradores -->
                        <div class="d-flex align-items-center px-2" style="overflow:hidden">
                            <!-- <el-avatar :src="data.photo_url" class="mr-2"/> -->
                            <img
                            class="rounded-circle obj-cover mr-2 border bg-whitesmoke"
                            height="40" width="40"
                            :src="data.photo_url" alt=""
                            />
                            <div class="text-muted2 col px-1 f-12">{{data.nombre}}</div>
                        </div>
                    </th>
                    <td v-for="(data2,k) in array_usuarios"
                        style="height: 50px"
                        v-if="data2.id_rol==3"
                        scope="col"  class="text-center">
                        <el-checkbox
                                     :value="get_check(data.id,data2.id)"
                                     false-label="false"
                                     true-label="true"
                                     @change="set_check(data.id,data2.id,$event)"/>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex'
    export default {
        name: "permisoAdminUsuario",
        data(){
            return{
                status:"",
                array_u:[]

            }
        },
        mounted(){
            this.listar();

        },
        computed:{
            ...mapGetters({
                array_usuarios:'configuracionPermisos/permisosAdmin_User',
            }),
            admin(){
                return this.array_usuarios.filter(o => o.id_rol==2  || o.id_rol==4)
            },

        },
        methods:{
            ...mapActions({
                listar:'configuracionPermisos/listarPermisosAdmin_User',

            }),
            set_check(admin_id,user_id,esActivo){
                let payload={admin:admin_id,user:user_id,esActivo:esActivo}
                this.$store.dispatch('configuracionPermisos/updatedPermisosAdmin_User',payload).then((data)=>{
                    this.notificacion('Permiso',data.mensaje,data.tipo);
                    this.listar()
                }).catch((error)=>{
                    console.log(error);
                })

            },
            get_check(admin_id,user_id){
                let admin = this.admin.find(a=>a.id === admin_id)
                if(admin.permisos_administradores.some(a => a.id_user_info === user_id )) return true;
                else false;
            }
        }
    }
</script>

<style lang="scss" scoped>
    .config-admin-usuario{
        .permisos-listado{
            /* tabla efecto con hover */
            .tablapermisos{
                font-size: 13px;
                thead{
                    th{
                        color: #5D5D5D; padding: 10px;
                    }
                }
                tbody{
                    td{
                        border: solid 1px #DDEEEE;
                        color: #333;
                        padding: 10px;
                        text-shadow: 1px 1px 1px #fff;
                    }
                }
                &.tablapermisos-highlight-all{
                    overflow: hidden;
                    z-index: 1;
                    tbody td:hover::before { background-color: #f5f5f5; content:'\00a0'; height: 100%; left: -5000px; position: absolute; top: 0; width: 10000px; z-index: -1; }
                    tbody td:hover::after { background-color: #f5f5f5; content:'\00a0'; height: 10000px; left: 0; position: absolute; top: -5000px; width: 100%; z-index: -1; }
                    tbody{
                        td{
                            position: relative;
                        }
                    }
                    thead{
                        th{
                            position: relative;
                        }
                    }
                }
            }
        }
        .img-admin{
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border:1px solid #dbdbdb;
        }
        table{
            thead{
                tr{
                    th{
                        max-width: 74px !important;
                        text-align: center;
                        justify-content: center;
                        border-top: 1px solid #dbdbdb;
                        border-bottom: 1px solid #dbdbdb;
                        border-right: 1px solid #dbdbdb;
                        &:first-child{
                            border-top: none;
                            max-width: 46px !important;
                            min-width: 46px !important;
                            border-right: 1px solid #DBDBDB;
                        }
                        &:last-child{
                            border-right: 1px solid #DBDBDB;
                        }
                    }
                }
            }
            tbody{
                tr{
                    th{
                        max-width: 74px !important;
                        text-align: center;
                        justify-content: center;
                        border-top: 1px solid #dbdbdb;
                        &:first-child{
                            max-width: 60px !important;
                            border-right: 1px solid #DBDBDB;
                            border-left: 1px solid #DBDBDB;
                        }
                    }
                    td{
                        text-align: center;
                    }
                    &:last-child{
                        th{
                            border: 1px solid #dbdbdb;
                        }
                    }
                }
            }
        }
    }
</style>
