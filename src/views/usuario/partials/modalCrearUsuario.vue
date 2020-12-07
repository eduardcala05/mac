<template>
    <section class="modalCrearUsuario">
        <modal ref="crearUsuario" v-loading="loading" titulo="Crear usuario" tamano="lg" @closeModal="close">
            <el-form label-position="top" :model="form" ref="formUser">
                <div class="row justify-content-center m-1">
                    <div class="col-12 text-center">
                        <el-form-item prop="foto">
                            <div class="" @click="loadImg">
                                <vue-cutter
                                v-if="openCrop"
                                ref="cutter"
                                class="mx-auto"
                                mode="contain"
                                :fixed="[1,1]"
                                outputType="png"
                                :container-bounding="options.bounding"
                                cropBoxBounding="150px 150px"
                                :src="options.src"
                                ></vue-cutter>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="col-6 ">
                        <el-form-item label="Nombre del usuario" prop="nombre" :error="form.errors.get('nombre')"
                                      :rules="{ required: true, message: 'El campo nombre es obligatorio.', trigger: 'blur' }">
                            <el-input v-model="form.nombre"></el-input>
                        </el-form-item>
                    </div>
                    <div class="col-6 ">
                        <el-form-item label="Rol" prop="id_rol">
                            <el-select
                                    v-model="form.id_rol"
                                    name="rol"
                                    class="w-100"
                                    @change="limpiador"
                            >
                                <el-option
                                        v-for="item in getRoles"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <div class="col-6 ">
                        <el-form-item label="Usuario" prop="username" :error="form.errors.get('username')"
                                      :rules="{ required: true, message: 'El campo usuario es obligatorio.', trigger: 'blur' }">
                            <el-input v-model="form.username"></el-input>
                        </el-form-item>
                    </div>

                    <div class="col-6 ">
                        <el-form-item label="Contraseña" prop="password" :error="form.errors.get('password')"
                                      :rules="{ required: true, message: 'El campo contraseña es obligatorio.', trigger: 'blur' }">
                            <el-input v-model="form.password" show-password></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="row mx-2" v-if="form.id_rol === 2">
                    <el-form label-position="top" :model="formComercial" ref="formComercial" class="w-100">
                        <div class="row mx-2 position-relative align-items-center">
                            <div class="col-6">
                                <el-form-item label="Carpeta raíz" prop="ruta_archivos"
                                              :rules="{ required: true, message: 'El campo raiz es obligatorio.', trigger: 'blur' }">
                                    <el-input v-model="formComercial.ruta_archivos"></el-input>
                                </el-form-item>
                            </div>
                            <div class="col-6">
                                <el-form-item label="Mac" prop="mac"
                                              :rules="{ required: true, message: 'El campo mac es obligatorio.', trigger: 'blur' }">
                                    <el-input v-model="formComercial.mac"></el-input>
                                </el-form-item>
                            </div>
                            <i class="icon-plus-circle text-dark f-20 cr-pointer" style="position: absolute; right: -15px; top: 55px; z-index:1" @click="Normal"/>
                        </div>
                    </el-form>
                    <el-divider/>
                    <div class="row justify-content-center position-relative  mx-2 w-100"
                         v-for="(data,index) in form.user_equipo">
                        <div class="col-6">
                            <el-form-item label="Carpeta raíz"
                                          :rules="{ required: true, message: 'El campo raiz es obligatorio.',
                                           trigger: 'blur' }">
                                <el-input v-model="data.ruta_archivos"></el-input>
                            </el-form-item>
                        </div>
                        <div class="col-6">
                            <el-form-item label="Mac"
                                          :rules="{ required: true, message: 'El campo mac es obligatorio.',
                                           trigger: 'blur' }"
                                          :error="_.head(validator[`user_equipo.${index}.mac`])">
                                <el-input v-model="data.mac"></el-input>
                            </el-form-item>
                        </div>
                        <i
                                class="icon-minus-circle text-muted2 f-20 text-danger cr-pointer"
                                style="position: absolute; right: -8px; top: 33px; z-index:1"
                                @click="quitar(index)"/>
                    </div>
                </div>

                <div class="col-12" v-if="[1,3].indexOf(form.id_rol) > -1">
                    <div class="row justify-content-center position-relative my-5">
                        <el-form label-position="top" :model="formAdministrador" ref="formAdministrador" class="w-100">
                            <div class="row mx-2 align-items-center">
                                <div class="col-6">
                                    <el-form-item label="Mac" prop="mac"
                                                  :rules="{ required: true, message: 'El campo mac es obligatorio.', trigger: 'blur' }">
                                        <el-input v-model="formAdministrador.mac"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="col-5">
                                    <p class="f-11 text-muted2 ml-3">
                                        Nota: Permiso de descarga en este dispositivo de los archivos de los usuarios
                                        asignados
                                        <el-checkbox v-model="formAdministrador.permiso_descarga"></el-checkbox>
                                    </p>
                                </div>
                                <div class="col-1">
                                    <i class="mdi mdi-plus-circle text-muted2 f-20 cr-pointer"
                                       @click="administrador" />
                                </div>

                            </div>
                        </el-form>
                        <el-divider/>
                        <div class="row mx-2 align-items-center"
                             v-for="(data,index) in form.user_equipo">
                            <div class="col-6">
                                <el-form-item label="Mac"
                                              :rules="{ required: true, message: 'El campo mac es obligatorio.',
                                              trigger: 'blur' }"
                                              :error="_.head(validator[`user_equipo.${index}.mac`])">
                                    <el-input v-model="data.mac"></el-input>
                                </el-form-item>
                            </div>
                            <div class="col-5">
                                <p class="f-11 text-muted2 ml-3">
                                    Nota: Permiso de descarga en este dispositivo de los archivos de los usuarios
                                    asignados
                                    <el-checkbox v-model="data.permiso_descarga"></el-checkbox>
                                </p>
                            </div>
                            <div class="col-1">
                                <i class="mdi mdi-minus-circle text-muted2 f-20 text-danger cr-pointer"
                                        @click="quitar(index)"/>
                            </div>

                        </div>
                    </div>
                </div>
            </el-form>
            <template slot="footer">
                <el-button type="info" @click="GuardarPermisos">Aceptar</el-button>
            </template>
        </modal>
    </section>
</template>

<script>
    import { VueCutter } from 'vue-cutter'
    import {Form} from "vform";
    import {mapGetters} from "vuex";

    export default {
        name: 'modalCrearUsuario',
        components: { VueCutter },
        data() {
            return {
                add: true,
                checked: true,
                value_select: "Seleccionar",
                options: {
                  bounding: '150px 150px',
                  src: '',
                },
                form: new Form({
                    foto: null,
                    nombre: "",
                    username: "",
                    password: "",
                    id_rol: null,
                    user_equipo: []
                }),
                formComercial: {
                    mac: "",
                    ruta_archivos: "",
                },
                formAdministrador: {
                    mac: "",
                    permiso_descarga: "",
                },
                mad_admin: "",
                usuario: [],
                error: "",
                validator : {},
                openCrop:false,
                loading:false
            };
        },
        computed: {
            ...mapGetters({
                getRoles: "usuarios/roles",
                sistema_operativo: 'app/getSistemaOperativo'
            })
        },
        mounted() {
            this.roles();
        },
        methods: {
            toggle() {
                this.openCrop = true
                this.validator = {};
                this.form.reset();
                this.form.clear();
                this.$refs.crearUsuario.toggle();
            },
            roles() {
                this.$store.dispatch("usuarios/roles");
            },
            loadImg(){
                if (this.add){
                    this.$refs.cutter.addLocalImage()
                    this.add = false
                }
            },
            close(){
                this.openCrop = false
            },
            async GuardarPermisos() {
                try {
                    this.loading = true
                    let img = null
                    let that = this
                    await new Promise(function(resolve, reject) {
                        that.$refs.cutter.getBase64Data(data => {
                            img = data ? data : null
                        })
                        setTimeout(() => resolve(), 500);
                    });
                    this.form.foto = img
                    let data = await this.$store.dispatch("usuarios/crearUsuario", this.form)

                    this.notificacion("Usuario", data.mensaje, data.tipo);
                    this.$emit("listar_usuarios");
                    await this.$store.dispatch('auth/fetchUser')
                    this.$refs.crearUsuario.toggle();
                }catch (e) {
                    console.log(e);
                } finally{
                  this.loading = false
                }
            },
            Normal() {
                this.$refs.formComercial.validate((valid) => {
                    if (valid) {
                        this.formComercial.sistema_operativo = this.sistema_operativo
                        this.form.user_equipo.unshift({...this.formComercial});
                        this.$refs.formComercial.resetFields();
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });
            },
            administrador() {
                this.$refs.formAdministrador.validate((valid) => {
                    if (valid) {
                        this.formAdministrador.sistema_operativo = this.sistema_operativo
                        this.form.user_equipo.unshift({...this.formAdministrador});
                        this.$refs.formAdministrador.resetFields();
                    } else {
                        console.error('error submit!!');
                        return false;
                    }
                });
            },
            quitar(i) {
                this.form.user_equipo.splice(i, 1);
            },
            limpiador() {
                this.mac = "";
                this.ruta_archivos = "";
                this.mad_admin = "";
                this.usuario = [];
            }
        }
    };
</script>

<style lang="scss" scoped>
    .modalCrearUsuario {
        .modal-body {
            padding: 10px 0px 0px 0px;
            overflow-x: hidden;
        }

        .img-usuario {
            width: 30px;
            height: 30px;
            border-radius: 50%;
        }

        .lbl-carpeta-raiz {
            font-size: 10px;
            margin-bottom: 0px;
            position: absolute;
            top: -18px;
        }

        .mini-boton {
            position: absolute;
            right: 44px;
            top: 4px;
        }
    }
</style>
