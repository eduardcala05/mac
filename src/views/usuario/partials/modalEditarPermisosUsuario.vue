<template>
    <section class="modalEditarPermisosUsuarios">
        <modal ref="cambiarPermisosUsuario" titulo="Editar permisos de usuario" tamano="modal-lg">
            <div class="container mt-2">
                <div class="row justify-content-center">
                    <div class="col-4">
                        <label>Usuario</label>
                        <el-select v-model="form.usuario" placeholder="Selecionar" @change="load_carpetas">
                            <el-option v-for="item in array_usuarios" v-if="item.id!=form.admin" :key="item.id"
                                       :label="item.nombre" :value="item.id"/>
                        </el-select>
                    </div>
                    <div class="col-4">
                        <label>Administrador</label>
                        <el-select v-model="form.admin" placeholder="Selecionar" disabled>
                            <el-option v-for="item in array_usuarios" :key="item.id" :label="item.nombre"
                                       :value="item.id"/>
                        </el-select>
                    </div>
                    <div class="col-4">
                        <label>Unidades</label>
                        <el-select v-model="form.unidad" placeholder="Selecionar" @change="load_carpetas">
                            <el-option v-for="item in _.get(selected_admin, 'user_equipos',[])" :key="item.id"
                                       :label="item.mac"
                                       :value="item.id"/>
                        </el-select>
                    </div>
                </div>
                <div class="row mt-4 mb-2">
                    <el-tabs v-model="activeName" type="card" class="w-100">
                        <!-- first -->
                        <el-tab-pane label="Unid. principal" name="first">
                            <table-unidad-principal ref="unidadPrincipal" :form="form"/>
                        </el-tab-pane>
                        <!-- unidad descargable -->
                        <el-tab-pane label="Unid. Descargable" name="second">
                            <table-unidad-descarga ref="unidadDescarga" :form="form"/>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
            <template slot="footer">
                <el-button type="info" @click="$refs.cambiarPermisosUsuario.toggle()">Aceptar</el-button>
            </template>
        </modal>
    </section>
</template>

<script>
    import tableUnidadPrincipal from './tableUnidadPrincipal';
    import tableUnidadDescarga from './tableUnidadDescarga';
    import {mapGetters, mapActions} from 'vuex'

    export default {
        components: {
            tableUnidadPrincipal,
            tableUnidadDescarga
        },
        data() {
            return {
                activeName: 'first',
                form: {
                    usuario: null,
                    admin: null,
                    unidad: null,
                },
                selected_usuario: null,
                selected_admin: null,
                selected_admin_unidad: null,
                multipleSelection: [],
            }
        },
        computed: {
            ...mapGetters({
                array_usuarios: 'usuarios/ListarUsuarios',
            }),


        },
        methods: {
            toggle(id) {
                this.form.admin = id
                this.selected_admin = _.find(this.array_usuarios, ['id', id]);
                this.$refs.cambiarPermisosUsuario.toggle();
            },
            EditarPermisos() {
                if (this.activeName == 'first') {
                    this.$store.dispatch('usuarios/UpdatedPermisosPrincipal').then((data) => {
                        this.notificacion('Permiso', data.mensaje, data.tipo);
                        this.$store.dispatch('usuarios/LoadEditarPermisoUsuario', this.selected_admin);
                    })
                } else {
                    this.$store.dispatch('usuarios/UpdatedPermisosDescarga').then((data) => {
                        this.notificacion('Permiso', data.mensaje, data.tipo);
                        this.$store.dispatch('usuarios/LoadEditarPermisoUsuario', this.selected_admin);
                    })
                }
            },
            SelecionarTabla() {
                this.$store.commit('usuarios/selectUser', this.selected_usuario);
            },
            load_carpetas() {
              console.log('aca1');
                if (this.form.unidad && this.form.usuario) {
                  console.log('aca2');

                    this.$store.dispatch('usuarios/LoadEditarPermisoUsuario', this.form);
                }
            }

        },
    }
</script>

<style lang="scss">
    .modalEditarPermisosUsuarios {
        .img-usuario {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }

        .modal-body {
            padding: 10px 0px 0px 0px;
            overflow-x: hidden;
        }
    }
</style>
