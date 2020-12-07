<template>
    <section style="max-height: calc(100vh - 100px);">
        <div v-if="mac_registrada" class="col-12 configUnidad">

            <!-- <div class="row justify-content-center listado-tipos my-5 px-3" v-if="configMac"> -->
            <!-- esto cuando el usuario no ha registro el serial -->
            <!-- <div class="row justify-content-center listado-tipos my-5 px-3">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">Equipo no registrado. Por favor comuníquese con el administrador</h5>
                        <img src="../../assets/logo.png" class="card-img-top mx-auto my-5" style="width: 100px">
                        <p class="card-text">
                            envia este codigo  ( {{ mac }} ) al administrado para tener pemisos de unidad
                        </p>
                    </div>
                </div>
            </div> -->
            <!-- esto cuando el usario si tiene serial de mac -->
            <div>
                <div class="row justify-content-start">
                    <div class="col-sm-5">
                        <div class="row">
                            <div class="col-12">
                                <p class="w-100 font-weight-bold">
                                    Información de la unidad principal
                                </p>
                            </div>
                        </div>

                        <ValidationObserver ref="form1">
                        <!-- Nombre de la unidad -->
                        <div class="row px-3 mt-3">
                            <ValidationProvider rules="required" name="nombre unidad" v-slot="{ errors }">
                            <label class="f-10 text-muted2 w-100 mb-0 ml-2" >Nombre de la unidad</label>
                              <el-input
                              type="text"
                              name="nombre"
                              v-model="unidadPrincipal.nombre"
                              size="medium"
                              class=" br-5 w-100"
                              />
                              <span class="f-10 text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                        <!-- Descripción de la unidad -->
                        <div class="row px-3 mt-3">
                                <p class="f-10 text-muted2 w-100 mb-0 ml-2" for="">Descripción de la unidad</p>
                                <ValidationProvider class="w-100" rules="required" name="descripcion" v-slot="{ errors }">
                                <textarea
                                name="descripcion"
                                rows="4"
                                v-model="unidadPrincipal.descripcion"
                                class="form-control br-5 w-100"
                                />
                              <span class="f-10 text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                        <!-- Carpeta raíz unidad -->
                        <div class="row px-3 mt-3">
                            <div class="col pl-0">
                                <ValidationProvider rules="required" name="carpeta raiz" v-slot="{ errors }">
                                    <label class="f-10 text-muted2 w-100 mb-0 ml-2">
                                        Carpeta raíz unidad
                                    </label>
                                    <el-input
                                    v-model="unidadPrincipal.carpetaRaiz"
                                    class="br-5 w-100"
                                    size="medium"
                                    name="raiz"
                                    >
                                    <el-button
                                    slot="append"
                                    icon="el-icon-search"
                                    @click="openCarpeta(1)"
                                    />
                                </el-input>
                                    <span class="f-10 text-danger">{{ errors[0] }}</span>
                                </ValidationProvider>
                            </div>
                            <el-button class="mt-auto btn-blue" icon="el-icon-check" circle @click="saveUPrincipal"></el-button>
                        </div>
                        </ValidationObserver>
                    </div>
                    <div class="col-sm-1" />
                    <div class="col-sm-5">
                        <div class="row px-3">
                            <p class="w-100 font-weight-bold">
                                Información de la unidad descargable
                            </p>
                        </div>
                        <ValidationObserver ref="form2">
                        <!-- Nombre de la unidad -->
                        <div class="row px-3 mt-3">
                            <ValidationProvider rules="required" name="nombre unidad des." v-slot="{ errors }">
                                <label class="f-10 text-muted2 w-100 mb-0 ml-2">Nombre de la unidad</label>
                                <el-input
                                type="text"
                                name="nombre"
                                v-model="unidadDescarga.nombre"
                                size="medium"
                                class=" br-5 w-100"
                                />
                              <span class="f-10 text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                        <!-- Descripción de la unidad -->
                        <div class="row px-3 mt-3">
                            <p class="f-10 text-muted2 w-100 mb-0 ml-2" for="">Descripción de la unidad</p>
                            <ValidationProvider class="w-100" rules="required" name="descripcion descargable" v-slot="{ errors }">
                                <textarea
                                name="descripcion"
                                rows="4"
                                v-model="unidadDescarga.descripcion"
                                class="form-control br-5 w-100"
                                />
                              <span class="f-10 text-danger">{{ errors[0] }}</span>
                            </ValidationProvider>
                        </div>
                        <!-- Carpeta raíz unidad -->
                        <div class="row mx-0 mt-3">
                            <div class="col pl-0">
                                <ValidationProvider rules="required" name="raiz" v-slot="{ errors }">
                                    <label class="f-10 text-muted2 w-100 mb-0 ml-2">Carpeta raíz unidad</label>
                                    <el-input
                                    v-model="unidadDescarga.carpetaRaiz"
                                    class="br-5 w-100"
                                    size="medium"
                                    name="raiz"
                                    >
                                    <el-button
                                    slot="append"
                                    icon="el-icon-search"
                                    @click="openCarpeta(2)"
                                    />
                                </el-input>
                                    <span class="f-10 text-danger">{{ errors[0] }}</span>
                                </ValidationProvider>
                            </div>
                            <el-button
                            class="mt-auto btn-blue"
                            icon="el-icon-check"
                            circle
                            @click="saveUDescarga"
                            />
                        </div>
                        </ValidationObserver>
                    </div>
                </div>
                <div class="row justify-content-start mt-5">
                    <div class="col-sm-5 ">
                        <div class="row mx-0">
                            <div class="col-12">
                                <label class="f-10 text-muted2 w-100 mb-0 ml-2">
                                    Carpeta almacenamiento de usuarios
                                </label>
                            </div>
                            <div class="col pl-0">
                                <el-input
                                v-model="descargablesComerciales.ruta_almacenar"
                                class="br-5 w-100"
                                size="medium"
                                name="raiz"
                                >
                                    <el-button
                                    slot="append"
                                    icon="el-icon-search"
                                    @click="openDescargablesComercial"
                                    />
                                </el-input>
                            </div>
                            <el-button
                            class="btn-blue"
                            icon="el-icon-check"
                            circle
                            @click="saveUDescargaComercial"
                            />
                        </div>
                        <div class="row px-3 mt-3">
                            <div class="col-12">
                                <p
                                class="f-14 w-100 mb-0 cr-pointer font-weight-bold"
                                @click="RealizarBackUp"
                                >
                                    Realizar BackUp de carpeta de usuario
                                </p>
                            </div>
                        </div>
                        <div class="row px-3 mt-3">
                            <div class="col-12">
                                <p
                                @click="EliminarCarpetaUsuario"
                                class="f-14 w-100 mb-0 cr-pointer font-weight-bold"
                                >
                                    Eliminar Carpeta del usuario
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
                <respaldo-unidad-usuario ref="RespaldoUnidadUsuario"/>
                <eliminar-unidad-usuario ref="eliminarUnidadUsuario"/>
            </div>

        </div>
        <equipo-no-registrado v-else />
    </section>
</template>

<script>
import {mapGetters} from 'vuex'
import RespaldoUnidadUsuario from "./partials/respaldoUnidadUsuario"
import EliminarUnidadUsuario from "./partials/eliminarUnidadUsuario"
import {messageBus} from '../../main'
import Unidad from '../../services/unidad'
import {notificacion} from '../../utils/helper'
export default {
        name: "unidad",
        components: {
            EliminarUnidadUsuario,
            RespaldoUnidadUsuario,
            equipoNoRegistrado: ()=>import('../unidad/partials/equipoNoRegistrado')
        },
        data() {
            return {
                carpetaTipo: null,
                //
                //old
                //
                unidadPrincipal: {
                    nombre: '',
                    descripcion: '',
                    carpetaRaiz: ''
                },
                unidadDescarga: {
                    nombre: '',
                    descripcion: '',
                    carpetaRaiz: ''
                },
                descargablesComerciales:{
                    ruta_almacenar:''
                }
            }
        },
        computed: {
            ...mapGetters({
                mac: 'app/getMac',
                user: 'auth/user',
                mac_registrada: 'app/getMacRegistrada',
                sistemaOperativo: 'app/getSistemaOperativo'
            })
        },
        created() {
            messageBus.$on('fromFolderOpen',(evt)=>{
                if(evt.canceled) return
                if(evt.filePaths.length === 0) return

                const carpeta = evt.filePaths[0]

                if(this.carpetaTipo === 1){
                    this.unidadPrincipal.carpetaRaiz = carpeta
                } else if(this.carpetaTipo === 2){
                    this.unidadDescarga.carpetaRaiz = carpeta
                }else if(this.carpetaTipo === 3){
                    this.descargablesComerciales.ruta_almacenar = carpeta
                }
            })

            if(this.mac_registrada){
                this.fetchInformacion()
            }
            /*
            * Old
            */
            //this.$store.dispatch('unidad/checkMac', this.user.id)
            //let unidad = await this.$store.dispatch('configuracionUnidad/getUnidad', this.mac)
        },
        destroyed(){
            messageBus.$off("fromFolderOpen")
        },
        methods: {
            async fetchInformacion(){
                try {
                    const {data} = await Unidad.getInfo(this.mac)
                    this.llenarFormulario(data)
                } catch (error) {
                    console.error(error);
                }
            },
            //
            // old
            //
            // ...mapActions({
            //     unidad: 'configuracionUnidad/informacionUnidad'
            // }),
            RealizarBackUp() {
                this.$refs.RespaldoUnidadUsuario.toggle();
            },
            EliminarCarpetaUsuario() {
                this.$refs.eliminarUnidadUsuario.toggle();
            },
            async saveUPrincipal(){
                console.log('guardando aqui');
                try {
                    const valid = await this.$refs.form1.validate()
                    if(valid){

                        let payload = {...this.unidadPrincipal}
                        payload.mac = this.mac

                        const {data} = await Unidad.saveUnidadPrincipal(payload)

                        notificacion('Mensaje','Actualizado con éxito','success')

                        /*
                        * Viernes 2020-10-30
                        * Inicia la sincronizacion de los archivos
                        * y carpetas de la ruta seleccionaa
                        */
                        window.api.send('toSync')
                    }

                } catch (error) {
                    console.error(error);
                }

                // old
                /*
                this.$store.dispatch('configuracionUnidad/storeUnidadPrincipal', this.unidadPrincipal).then((data) => {
                    this.notificacion('Unidad', data.mensaje, data.tipo);
                    ipcRenderer.send('start-sync')
                })
                */
            },
            async saveUDescarga(){
                try {
                    const valid = await this.$refs.form2.validate()
                    if(valid){
                        let payload = {...this.unidadDescarga}
                        payload.mac = this.mac

                        const {data} = await Unidad.saveUnidadDescarga(payload)
                        notificacion('Mensaje','Actualizado con éxito','success')
                    }
                } catch (error) {
                    console.error(error);
                }

                // old

                /*
                this.$store.dispatch('configuracionUnidad/storeUnidadDescarga', this.unidadDescarga).then((data) => {
                    this.notificacion('Unidad', data.mensaje, data.tipo);
                    ipcRenderer.send('start-sync')
                })
                */
            },
            saveUDescargaComercial() {
                if(this.descargablesComerciales.ruta_almacenar === '' || this.descargablesComerciales.ruta_almacenar === null) return
                this.descargablesComerciales.mac = this.mac
                this.$store.dispatch('configuracionUnidad/storeUnidadDescargaComercial', this.descargablesComerciales).then((data) => {
                    this.notificacion('Unidad', data.mensaje, data.tipo);
                    //ipcRenderer.send('start-sync')
                })
            },
            openCarpeta(tipo=null) {
                if(tipo===null) return
                this.carpetaTipo = tipo
                console.log('abriendo la carpeta',tipo);
                window.api.send('toFolderOpen')

            },
            openDescargablesComercial() {
                this.carpetaTipo = 3
                window.api.send('toFolderOpen')
            },
            llenarFormulario(data){ // por jamer
                if (data===undefined) {
                    this.alerta('info','No se ha Cargado la unidad Correctamente');
                }else{
                    this.unidadPrincipal.nombre = data.unidad_nombre;
                    this.unidadPrincipal.descripcion = data.unidad_descripcion;
                    this.unidadPrincipal.carpetaRaiz = data.ruta_archivos;
                    //
                    this.unidadDescarga.nombre = data.unidad_nombre_des;
                    this.unidadDescarga.descripcion = data.unidad_descripcion_des;
                    this.unidadDescarga.carpetaRaiz = data.ruta_descargables;

                    this.descargablesComerciales.ruta_almacenar = data.ruta_almacenar;
                }
            }

        },
    }

</script>

<style lang="scss" scoped>
.btn-blue{
    background: #409eff47;
    &:hover{
        background: #409effd6;
        color: white;
    }
}
.configUnidad {
    .w-10 {
        width: 10%;
    }

    .w-20 {
        width: 20%;
    }

    .w-30 {
        width: 30%;
    }
}
</style>
