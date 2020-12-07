<template>
    <section class="container-fluid section-listar-usuarios">
        <div class="row contenedor-top">
            <div class="col-12  d-flex my-auto">
                <input type="search" v-model="buscar" :placeholder="`${$t('label_search')}`" class="form-control br-4" style="max-width:345px">
                <div class="col-auto d-middle ml-auto">
                    <el-tooltip class="item" effect="light" content="Comparar usuarios" placement="top">
                        <div class="btn-hover d-middle-center mx-2" @click="$router.push({name:'usuarios.comparar'})">
                            <i class="icon-compare cr-pointer f-19 mx-1" />
                        </div>
                    </el-tooltip>
                    <el-tooltip class="item" effect="light" content="Crear usuario" placement="top">
                        <div class="btn-hover d-middle-center mx-2" @click="CrearUsuario">
                            <i class="icon-account-plus cr-pointer f-19 mx-1" />
                        </div>
                    </el-tooltip>
                </div>
            </div>
        </div>
        <!-- indicadores -->
        <div class="d-flex flex-row justify-content-center mt-3">
            <div class="p-2 mx-2">
                <p class="d-flex align-items-center text-muted2 f-14">
                <i class="icon-login-variant mr-2 f-19 color-img"></i> Último ingreso </p>
            </div>
            <div class="p-2 mx-2">
                <p class="d-flex align-items-center text-muted2 f-14">
                <i class="icon-arrow-collapse-down mr-2 f-19 color-pw"></i> Última sincronización de bajada </p>
            </div>
            <div class="p-2 mx-2">
                <p class="d-flex align-items-center text-muted2 f-14">
                <i class="icon-arrow-collapse-up mr-2 f-19 color-video"></i> Última sincronización de subida </p>
            </div>
            <div class="p-2 mx-2">
                <p class="d-flex align-items-center text-muted2 f-14">
                <i class="icon-account-off text-danger mr-2 f-19"></i> Usuario inactivo </p>
            </div>
        </div>
        <!-- listado -->
        <div class="row listado justify-content-center h-list custom-scroll">
            <div
            v-for="(data,i) in usuarios_lista"
            :key="i"
            class="card-usuario border mx-2 my-3 px-0"
            @click.stop="VerUsuario(data.id)"
            >
                <div class="d-flex">
                    <div class="pr-2 color-left"></div>
                    <div class="p-2 my-auto position-relative">
                        <div class="div-bg d-middle-center" :class="{'d-none':data.estado==1}">
                            <i class="icon-account-off text-white"></i>
                        </div>
                        <el-dropdown>
                            <div >
                                <el-avatar  :src="`${data.photo_url}?timestamp=${+new Date()}`" :size="90" />
                                <i class="icon-dot-3 d-flex justify-content-center" style="line-height: 0; font-size: 30px;"/>
                            </div>
                            <el-dropdown-menu slot="dropdown" >
                                <el-dropdown-item @click.native="EditarUsuario(data.id)" >Editar Usuario</el-dropdown-item>
                                <el-dropdown-item @click.native="ModalCambioContrasena(data.id)" >Cambiar Contraseña</el-dropdown-item>
                                <el-dropdown-item @click.native="EliminarUsuario(data.nombre,data.id)">Eliminar</el-dropdown-item>
                                <el-dropdown-item v-if="_.isLength([2,4].indexOf(data.id_rol))" @click.native="EditarPermisoUsuario(data.id)"> Editar permisos</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="col-8 p-2 f-12 text-muted2 my-auto">
                        <div class="d-flex align-items-center text-muted2 f-14">
                            <i :class="data.estado==1? 'el-icon-user-solid mr-2 f-19 text-muted mx-1':'icon-account-off mr-2 f-19 text-danger' " />
                            <p class="tres-puntos">{{_.get(data,'nombre')}}</p>
                        </div>
                        <p class="d-flex align-items-center text-muted2 f-14">
                            <i class="icon-login-variant mr-2 f-19 color-img" />
                            {{_.get(data,'Conexion.UltimaConexion.created_at',null) | helper-fecha('dd , DD MMM YYYY,  h:mm a')}}
                        </p>
                        <p class="d-flex align-items-center text-muted2 f-14">
                            <i class="icon-arrow-collapse-up mr-2 f-19 color-video" />
                            {{_.get(data,'Conexion.UltimaCarga.created_at',null) | helper-fecha('dd , DD MMM YYYY,  h:mm a')}}
                        </p>
                        <p class="d-flex align-items-center text-muted2 f-14">
                            <i class="icon-arrow-collapse-down mr-2 f-19 color-pw" />
                            {{_.get(data,'Conexion.UltimaDescarga.created_at',null) | helper-fecha('dd , DD MMM YYYY,  h:mm a')}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <modal-crear-usuario ref="CrearUsuario" @listar_usuarios="listar" />
        <modal-editar-usuario
        ref="EditarUsuario"
        @listar_usuarios="listar"
        @usuario:actualizado="listar"
        />
        <modal-eliminar-usuario ref="EliminarUsuario" @listar_usuarios="listar" />
        <modal-editar-permisos-usuario ref="EditarPermisosUsuarios" />
        <modal-cambio-contrasena ref="ModalCambioContrasena"/>
    </section>
</template>

<script>
import modalCrearUsuario from'./partials/modalCrearUsuario'
import modalEditarUsuario from'./partials/modalEditarUsuario'
import modalEliminarUsuario from'./partials/modalEliminarUsuario'
import modalEditarPermisosUsuario from'./partials/modalEditarPermisosUsuario'
import {mapActions,mapGetters} from 'vuex';
import ModalCambioContrasena from "./partials/modalCambioContrasena";
export default {
    name: "listar",
    middleware: 'auth',
    data(){
        return{
            buscar:'',
        }
    },
    components:{
        ModalCambioContrasena,
        // contenedorTopUsuarios:import('./partials/contenedorTopUsuarios'),
        modalCrearUsuario,
        modalEditarUsuario,
        modalEliminarUsuario,
        modalEditarPermisosUsuario,
    },
    mounted(){
        this.listar();
    },
    computed:{
        ...mapGetters({
            usuarios:'usuarios/ListarUsuarios'
        }),
        usuarios_lista(){
            return this.usuarios.filter(a => a.nombre.toLowerCase().match(this.buscar.toLowerCase()))
        }
    },
    methods:{
        ...mapActions({
            listar:'usuarios/ListarUsuarios'
        }),
        CrearUsuario(){
            this.$refs.CrearUsuario.toggle();
        },
        EditarUsuario(id){
            this.$refs.EditarUsuario.toggle(id);
        },
        EliminarUsuario(nombre,id){
            this.$refs.EliminarUsuario.toggle(nombre,id);
        },
        EditarPermisoUsuario(id){
            this.$refs.EditarPermisosUsuarios.toggle(id);
        },
        ModalCambioContrasena(id){
            this.$refs.ModalCambioContrasena.toggle(id);
        },
        VerUsuario(id){
            this.$router.push({name:'usuarios.ver',params:{id:id}});
        },
    },
}
</script>

<style lang="scss" scoped>
.h-list{
    max-height: calc(100vh - 240px);
    overflow: auto;
}
.section-listar-usuarios{
    //  width: 100%;
    // background: red;
    .contenedor-top{
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        padding: 13px 0px;
        button{
            color: #dbdbdb;
            &.active{
                color:#5d5d5d !important;
            }
        }
    }
    i.mdi-login-variant{ color:#00b41e; }
    i.mdi-arrow-collapse-down{ color: #ff5900 }
    i.mdi-arrow-collapse-up{ color:#67beff }
    i.mdi-account{ color:#dbdbdb }

    .listado{
        .card-usuario{
            width: 370px;
            height: 146px;
            border-radius: 5px;
            .color-left{
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
                background: #5d5d5d;
            }
            .img-usuario{
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }
            .div-bg {
                width: 90px;
                height: 90px;
                border-radius: 50%;
                background: rgba(93, 93, 93, 0.7);
                opacity: 0.5;
                position: absolute;
                z-index: 1;
                i.mdi-account-off{
                    position: relative;
                    top: 17px;
                    left: 24px;
                    font-size: 30px;
                }
            }
            i.mdi-dots-horizontal{
                position: absolute;
                right: 39px;
                font-size: 20px;
            }
            &:hover{
                cursor: pointer;
                box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
            }
        }
    }
    }
.btn-hover{
    width: 30px;
    height: 30px;
    border-radius: 50%;
    color: #5d5d5d;
    &:hover{
        background: #F5F5F5;
    }
}
</style>
