<template>
    <section class="modalCrearUsuario">
        <modal ref="crearEditarUduario" titulo="Cambio contraseña" tamano="lg" footer >
            <el-form label-position="top" :model="form" ref="formUser">
                <div class="row justify-content-center m-1">
                      <div class="col-12">
                       <el-form-item label="Usuario" prop="username"
                                     :rules="{ required: true, message: 'El campo usuario es obligatorio.', trigger: 'blur' }"
                                     :error="_.head(validator[`username`])">
                         <el-input v-model="form.username"></el-input>
                       </el-form-item>
                     </div>

                    <div class="col-12">
                      <el-form-item label="Contraseña" prop="password"
                                    :rules="{ required: true, message: 'El campo contraseña es obligatorio.', trigger: 'blur' }"
                                    :error="_.head(validator[`password`])">
                        <el-input v-model="form.password" show-password></el-input>
                      </el-form-item>
                    </div>
                </div>
            </el-form>
            <template slot="footer">
                <el-button type="info" @click="editarUsuario">Aceptar</el-button>
            </template>
        </modal>
    </section>
</template>

<script>
    import {mapGetters} from "vuex";
    import axios from 'axios'
    export default {
        name: "modalCambioContrasena",
        data(){
            return{
                validator:{},
                form:{
                    username:'',
                    password:''
                }
            }
        },
        computed: {
            ...mapGetters({
                getUsuarioData: "usuarios/datosUsuarios"
            })
        },
        methods:{
            toggle(id) {
                this.validator = {}
                this.$refs.crearEditarUduario.toggle();
                this.$store.dispatch("usuarios/datosUsuarios", id).then(() => {
                    this.form.id = this.getUsuarioData.id;
                    this.form.username = this.getUsuarioData.username;
                });
            },
            async editarUsuario(){
                try {
                    let { data } =await  axios.post('usuario/updateUserPassword',this.form)
                    if (data) {
                        this.notificacion("Usuario", data.mensaje, data.tipo);
                        this.$refs.crearEditarUduario.toggle();
                    }
                }catch (e) {
                    console.log(e);
                }

            }
        }
    }
</script>

<style scoped>

</style>
