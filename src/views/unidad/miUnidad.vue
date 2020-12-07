<template>
    <section class="section-unidades-tipos">
        <div
        v-if="mac_registrada"
        class="row justify-content-center listado-tipos my-5 px-3"
        >
            <div v-if="unidades.length === 0" class="card text-center">
                <div class="card-body">
                    <h5 class="card-title">No hay unidades disponibles</h5>
                </div>
            </div>
            <div
            v-for="(unidad,k) in unidades"
            :key="k"
            class="col-lg-4 card-tipo d-flex flex-column mx-1 my-2 pt-2"
            @click="verUnidad(unidad)"
            >
                <div class="row my-2">
                    <div class="col d-flex">
                        <div style="width:30px; heigh:30px;" class="mr-2">
                            <img src="/img/hdd-solid.svg" class="w-100" alt="">
                        </div>
                        <p class="tres-puntos mb-0">
                            {{(unidad.unidad_nombre !== null) ? unidad.unidad_nombre : 'Unidad Nombre' }}
                        </p>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col">
                        <p class="text-muted2 f-12 lh-13 descripcion" style="">
                            {{(unidad.unidad_descripcion !== null) ? unidad.unidad_descripcion : 'Unidad Descripcion' }}
                        </p>
                    </div>
                </div>
                <div class="row my-2 f-13">
                    <div class="col">
                        <p class="text-muted2 f-600">
                            {{unidad.nombre_usuario}}
                        </p>
                    </div>
                </div>
                <div class="row mt-auto otras footer" :class="{'actual':unidad.esMipc}">
                    <div class="col-12">
                        <p class="d-flex align-items-center mb-0 py-2">
                            <i class="mdi mdi-file text-muted mr-2"></i>
                            {{ unidad.unidad_archivos || 0}} Archivos -
                            {{ (unidad.unidad_peso || 0 /1024).toFixed(2) }} MB
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <equipo-no-registrado v-else style="height:100vh;" />
    </section>
</template>
<script>
import {mapGetters} from 'vuex'
import Unidad from '../../services/unidad'
import {messageBus} from '../../main'

export default {
    middleware: ['auth'],
    components:{
        equipoNoRegistrado: ()=>import('./partials/equipoNoRegistrado')
    },
    data(){
        return {
            unidades: [],
            info: {
                ruta_archivos: ''
            }
        }
    },
    computed:{
        ...mapGetters({
            mac: 'app/getMac',
            mac_registrada: 'app/getMacRegistrada'
        })
    },
    created(){
        window.api.send('toUnidadesGet')
        messageBus.$on('fromUnidadesGet',this.setUnidades)
        messageBus.$on('fromMacExiste',()=>{

        })
    },
    destroyed(){
        messageBus.$off('fromUnidadesGet')
    },
    methods:{
        setUnidades(data){
            console.log('mi mac',this.mac);
            data.map(a=>{
                if(a.mac === this.mac){
                    a.esMipc = true
                }else{
                    a.esMipc = false
                }
            })
            this.unidades = data
        },
        verUnidad(unidad){
            this.$router.push({
                name:'home.mi-unidad.privada',
                params:{ id: unidad.id }
            });
        },
    }
}
</script>
<style lang="scss" scoped>
.section-unidades-tipos {
    height: 100vh;
        .listado-tipos {

            .actual {
                background: #B9DE8E !important;
            }

            .otras {
                background: #8AC6F3;
            }

            .default {
                background: #E5E5E5;
            }

            .card-tipo {
                max-width: 340px;
                border: 1px solid #E5E5E5;
                border-radius: 5px;
                transition: .45s;
                // position: relative;
                cursor: pointer;

                .descripcion {
                    max-height: 81px;
                    overflow: hidden;
                }

                &:hover {
                    transition: .2s;
                    // box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.26);
                }
            }
        }
    }
.ajuste-27{
    height: 100vh;
}
</style>
