<template>
    <section class="config-interfaz">
        <!-- Tema -->
        <el-row class="my-5">
            <el-col>
                <p class="f-14 f-600 w-100 mb-2">Color de la barra superior</p>
                <el-row>
                    <el-button v-for="(col, idx) in colores" :key="idx" class="position-relative" circle :style="`background:${col}`" @click="setColor(idx+1)">
                        <i v-show="color==col" class="icon-ok icono-check f-18" />
                    </el-button>
                </el-row>
            </el-col>
        </el-row>
        <el-divider></el-divider>

        <el-row class="my-5">
            <el-col :span="12">
                <p class="f-14 f-600 w-100 text-center mb-2">Logo barra lateral</p>
                <div class="div-preview" @click="cambioLogoLateral">
                    <i class="mdi mdi-close-circle cr-pointer" @click.stop="borrarLogoLateral"></i>
                    <img class="img-logo cr-pointer" :src="lateral" alt="" />
                </div>
            </el-col>
            <el-col :span="12">
                <p class="f-14 f-600 w-100 text-center mb-2">Logo modales</p>
                <div class="div-preview" @click="cambioLogoModal">
                    <i class="mdi mdi-close-circle"></i>
                    <img class="img-logo cr-pointer" :src="modal" alt="" />
                </div>
            </el-col>
        </el-row>
        <modal-galeria :titulo="tituloModalGaleria" ref="galeria" @save="guardarImagen"/>
    </section>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: "interfaz",
        components: {
            ModalGaleria: () => import('../../components/ModalGaleria')
        },
        data() {
            return {
                tituloModalGaleria:'Modal Galeria',
                options: [
                    {text: 'Claro', value: 1},
                    {text: 'Oscuro', value: 2},
                ],
                colores: [
                    '#fff', '#f5f5f5', '#5d5d5d', '#434B53', '#232e3A', '#000000', '#740012', '#ff0028', '#ec1A3b', '#ff5900', '#ffbb00', '#AAd962', '#00b41e', '#0090ff', '#002bff', '#110141', '#502bbe', '#710162'
                ]
            }
        },
        computed:{
            selected:{
                get(){
                    return this.$store.getters['configurar/tema']
                },
                set(id){
                    this.$store.dispatch('configurar/setTema',id);
                }
            },
            ...mapGetters({
                lateral:'configurar/barra',
                modal:'configurar/modal',
                color:'configurar/color',
            })
        },
        methods: {
            guardarImagen(data){
                this.$store.dispatch('configurar/getConfig')
            },
            setColor(id) {
                this.$store.dispatch('configurar/setColor',id);
            },
            cambioLogoLateral(){
                this.tituloModalGaleria = "Cambio logo barra lateral"
                this.$refs.galeria.toggle(3,'configuracion/interface/actualiza-imagen')
            },
            cambioLogoModal(){
                this.tituloModalGaleria = "Cambio logo modal"
                this.$refs.galeria.toggle(4,'configuracion/interface/actualiza-imagen')
            },
            borrarLogoLateral(){
                console.log('borrarLogoLateral')
            }

        }
    }
</script>

<style lang="scss" scoped>
.img-logo{
    max-width: 300px;
    max-height: 300px;
    object-fit: cover;
}
button span .icono-check{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #808080;
    // &:nth-child(even){
    //     color: #495057!important;
    // }
}
    .logo {
        background: transparent !important;
    }
    .config-interfaz {
        .div-preview {
            max-width: 300px;
            background: #f5f5f5;
            border: 1px solid #dbdbdb;
            border-radius: 3px;
            margin: auto;
            position: relative;

            i.mdi-close-circle {
                color: #979797;
                position: absolute;
                top: -12px;
                right: -8px;
            }
        }
    }
</style>
