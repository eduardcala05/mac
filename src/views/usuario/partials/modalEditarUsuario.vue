<template>
    <section class="modalEditarUsuario">
        <modal ref="editarUsuario" v-loading="loading" titulo="Editar usuario" tamano="modal-lg" :footer="true" >
            <el-form label-position="top" :model="form" ref="formUser">
                <div class="row justify-content-center m-1">
                    <div class="col-12 text-center">
                        <el-form-item prop="foto">
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
                            <div class="row justify-content-center mt-3">
                                <button type="button" class="btn btn-outline-primary btn-sm" @click="loadImg">Seleccionar Imagen</button>
                            </div>
                        </el-form-item>
                    </div>
                    <div class="col">
                        <el-form-item
                        label="Nombre del usuario"
                        prop="nombre"
                        :error="form.errors.get('nombre')"
                        :rules="{ required: true, message: 'El campo nombre es obligatorio.', trigger: 'blur' }"
                        >
                            <el-input v-model="form.nombre" />
                        </el-form-item>
                    </div>
                    <div class="col">
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
                                />
                            </el-select>
                        </el-form-item>
                    </div>
                    <el-form-item
                    label="Estado"
                    prop="estado"
                    class="mx-1"
                    :error="form.errors.get('estado')"
                    :rules="{ required: true, message: 'El campo usuario es obligatorio.', trigger: 'blur' }">
                        <el-switch
                        v-model="form.estado"
                        :active-value="1"
                        :inactive-value="0"
                        />
                    </el-form-item>
                </div>
                <div class="row justify-content-center m-1">
                    <div class="col-12" v-if="form.id_rol === 2">
                        <el-form label-position="top" :model="formComercial" ref="formComercial" class="w-100">
                            <div class="row mr-3 position-relative">
                                <div class="col">
                                    <el-form-item label="Carpeta raíz" prop="ruta_archivos"
                                                  :rules="{ required: true, message: 'El campo raiz es obligatorio.', trigger: 'blur' }">
                                        <el-input v-model="formComercial.ruta_archivos"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="col">
                                    <el-form-item
                                    label="Mac"
                                    prop="mac"
                                    :rules="{ required: true, message: 'El campo mac es obligatorio.', trigger: 'blur' }"
                                    >
                                        <el-input v-model="formComercial.mac"></el-input>
                                    </el-form-item>
                                </div>
                                <i
                                class="icon-plus-circle text-dark f-20 cr-pointer mt-auto ml-2 mb-4"
                                @click="Normal"
                                />
                            </div>
                        </el-form>
                        <el-divider/>
                        <div
                        class="row mx-2"
                        v-for="(data,index) in form.user_equipo"
                        :key="index"
                        >
                            <div class="col-6">
                                <el-form-item label="Carpeta raíz"
                                              :rules="{ required: true, message: 'El campo raiz es obligatorio.', trigger: 'blur' }">
                                    <el-input v-model="data.ruta_archivos"></el-input>
                                </el-form-item>
                            </div>
                            <div class="col-5">
                                <el-form-item label="Mac"
                                              :rules="{ required: true,
                                              message: 'El campo mac es obligatorio.',
                                               trigger: 'blur' }"
                                              :error="_.head(validator[`user_equipo.${index}.mac`])">
                                    <el-input v-model="data.mac" :disabled="_.isNumber(data.id)"></el-input>
                                </el-form-item>
                            </div>
                            <div class="col-1 my-auto">
                                <i class="icon-minus-circle text-muted2 f-20 text-danger cr-pointer"
                                   @click="quitar(index,data)"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-12" v-if="[1,3].indexOf(form.id_rol) > -1">
                        <el-form label-position="top" :model="formAdministrador" ref="formAdministrador" class="w-100">
                            <div class="row mx-2 align-items-center">
                                <div class="col-6">
                                    <el-form-item
                                    label="Mac"
                                    prop="mac"
                                    :rules="{ required: true, message: 'El campo mac es obligatorio.',trigger: 'blur' }"
                                    >
                                        <el-input v-model="formAdministrador.mac" />
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
                                    <i
                                    class="icon-plus-circle text-muted2 f-20 cr-pointer"
                                    @click="administrador"
                                    />
                                </div>

                            </div>
                        </el-form>
                        <el-divider/>
                        <div
                        class="row mx-2 align-items-center"
                        v-for="(data,index) in form.user_equipo"
                        :key="index"
                        >
                            <div class="col-6">
                                <el-form-item label="Mac"
                                              :rules="{ required: true,
                                              message: 'El campo mac es obligatorio.',
                                               trigger: 'blur' }"
                                              :error="_.head(validator[`user_equipo.${index}.mac`])">
                                    <el-input v-model="data.mac" :disabled="_.isNumber(data.id)"></el-input>
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
                                <i
                                class="icon-minus-circle text-muted2 f-20 text-danger cr-pointer"
                                @click="quitar(index,data)"
                                />
                            </div>

                        </div>

                    </div>
                </div>

            </el-form>
            <template slot="footer">
                <el-button type="info" @click="EditarUsuario">Aceptar</el-button>
            </template>
        </modal>
    </section>
</template>

<script>
import {mapGetters} from "vuex"
import {Form} from "vform"
import {notificacion} from '../../../utils/helper'
export default {
    data() {
        return {
            options: {
              bounding: '150px 150px',
              src: '',
            },
            openCrop:false,
            form: new Form({
                foto: null,
                nombre: "",
                username: "",
                password: "",
                id_rol: null,
                user_equipo: [],

            }),
            formComercial: {
                mac: "",
                ruta_archivos: "",
            },
            formAdministrador: {
                mac: "",
                permiso_descarga: "",
                sistema_operativo: '',
            },
            id_eliminar: null,
            position_eliminar: null,
            validator : {},
            loading:false
        };
    },
    computed: {
        ...mapGetters({
            getUsuarioData: "usuarios/datosUsuarios",
            getRoles: "usuarios/roles",
            mac: 'app/getMac',
            sistema_operativo: 'app/getSistemaOperativo'
        })
    },
    methods: {
        toggle(id) {
            this.openCrop = true
            this.validator = {}
            this.$refs.editarUsuario.toggle();
            this.$store.dispatch("usuarios/datosUsuarios", id).then(() => {
                this.options.src = this.getUsuarioData.photo_url
                this.form.id = this.getUsuarioData.id;
                this.form.nombre = this.getUsuarioData.nombre;
                this.form.username = this.getUsuarioData.username;
                this.form.estado = this.getUsuarioData.estado;
                this.form.id_rol = this.getUsuarioData.id_rol;
                this.form.user_equipo = this.getUsuarioData.user_equipos;
            });
        },
        loadImg(){
            this.$refs.cutter.addLocalImage()
        },
        close(){
            this.openCrop = false
        },
        async EditarUsuario() {
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

                let data = await this.$store.dispatch("usuarios/updatedUsuarios", this.form)

                if (data) {
                    notificacion("Usuario", data.mensaje, data.tipo);
                    this.$emit("listar_usuarios");
                    this.$refs.editarUsuario.toggle();
                    await this.$store.dispatch('auth/fetchUser')
                    console.log('refrescando la informacion de la mac',this.mac );
                    window.api.send('toMacExiste',this.mac)
                    this.$emit("usuario:actualizado")
                }
            }catch (e) {
                console.error('error',e);
            }finally{
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
            // console.log(0,this.sistema_operativo);
            this.$refs.formAdministrador.validate((valid) => {
                if (valid) {
                    this.formAdministrador.sistema_operativo = this.sistema_operativo
                    this.form.user_equipo.unshift({...this.formAdministrador});
                    this.$refs.formAdministrador.resetFields();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        async quitar(i, user_equipo) {
            let $this = this;
            this.$confirm(
                "Se eliminarán todos los datos asociados a esta Mac en el sistema, por lo tanto serán inaccesibles para todos los usuarios, quienes verán este cambio al próximo cierre sesión",
                "¿Esta seguro de Eliminar?",
                {confirmButtonText: 'Si', cancelButtonText: 'No', type: 'warning', center: true,})
                .then(async () => {
                    try {
                        let {data} = await this.$store.dispatch("usuarios/EliminarUserEquipo", user_equipo)
                        $this.form.user_equipo.splice(i, 1);
                        $this.notificacion("Datos de usuario", data.mensaje, data.tipo);
                    } catch (e) {console.error(e)}
                })
        },
        limpiador() {
            this.mac = "";
            this.raiz = "";
            this.mad_admin = "";
        }
    }
}
</script>

<style lang="scss" scoped>
.modalEditarUsuario {
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

    .modal-body {
        padding: 10px 0px 0px 0px;
        overflow-x: hidden;
    }
}
</style>
