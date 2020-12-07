<template>
    <section class="config-admin-admin">
        <p class="px-3 text-muted2 f-15 f-600 mb-5">Permiso de acceso entre Administradores</p>
        <div class="row permisos-listado px-5">
            <table class="tablapermisos tablapermisos-highlight-all w-100 mx-auto">
                <thead>
                <tr>
                    <th>Admin / Admin</th>
                    <th v-for="(data,i) in array_admin_x" scope="col" :key="i">
                        <!-- id_user_info -->
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
                <tr v-for="(data,j) in array_admin_x" style="height: 60px" :key="j">
                    <!-- id_user_admin -->
                    <th scope="row">
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
                    <td v-for="(data2,k) in array_admin_x" :key="k" class="text-center">
                        <el-checkbox :disabled="disabled_check(data.id,data2.id)"
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
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "permisoAdminAdmin",
        mounted(){
            this.listar();
        },
        computed:{
            ...mapGetters({
                array_admin_x:'configuracionPermisos/permisosAdmin_Admin',
            })
        },
        methods:{
            ...mapActions({
                listar:'configuracionPermisos/listarPermisosAdmin_Admin'
            }),
            set_check(admin,info,esActivo){
                var payload={admin:admin,info:info,esActivo:esActivo}
                this.$store.dispatch('configuracionPermisos/updatedPermisosAdmin_Admin',payload).then((data)=>{
                    this.notificacion('Permiso',data.mensaje,data.tipo);
                    this.listar()
                }).catch((error)=>{
                    console.log(error);
                })
            },
            get_check(admin,info){
                let array_temp = this.array_admin_x.find(a=>a.id === admin)
                if (admin===info) return 'true';
                else if(array_temp.permisos_administradores.some(a => a.id_user_info === info )) return 'true';
                else 'false';
            },
            disabled_check(admin,info){
                if (admin===info) return true;
                else false;
            },

        },
    }
</script>
<style lang="scss" scoped>
    .config-admin-admin{
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
