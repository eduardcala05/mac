<template>
    <section>
        <migas />
        <div class="row mx-0">
            <div class="col-12 px-0" style="height: calc(100vh - 67px); overflow-y:hidden; ">
                <el-table
                :data="listado"
                style="width: 100%;"
                height="100%"
                >
                    <el-table-column
                    prop="nombre"
                    label="Nombre"
                    min-width="700"
                    sortable
                    >
                        <template slot-scope="{row}">
                            <router-link :to="{name:'home.mi-unidad.privada.carpeta', params:{id_hash:row.id_hash}}">
                                <template v-if="row.es_carpeta">
                                    <!-- <svg  style="width:24px;height:24px" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M20 18H4V8H20V18M12 6L10 4H4C2.9 4 2 4.89 2 6V18C2 19.11 2.9 20 4 20H20C21.11 20 22 19.11 22 18V8C22 6.9 21.11 6 20 6H12M11 14V12H15V9L19 13L15 17V14H11Z" />
                                    </svg> -->
                                    <i class="icon-pencil"></i>
                                </template>
                                <span style="position:relative; top: 2px;"> {{row.nombre}} </span>
                            </router-link>
                        </template>
                    </el-table-column>

                    <el-table-column
                    prop="ultima_modificacion"
                    label="Última modificación"
                    width="180"
                    :formatter="formatterUltimaModificacion"
                    />

                    <el-table-column
                    prop="tamano"
                    label="Tamaño del archivo"
                    width="165"
                    :formatter="formatterTamano"
                    class="rompe-palabra"
                    />

                    <el-table-column
                    label=" - "
                    width="90"
                    align="right"
                    class-name=""
                    >
                        <template slot-scope="{row}">
                            <span class="mr-1" title="Editar permisos del usuario">
                                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M4,4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8A2,2 0 0,0 20,6H12L10,4M11,10C12.31,10 13.42,10.84 13.83,12H19V14H18V16H16V14H13.83C13.42,15.17 12.31,16 11,16A3,3 0 0,1 8,13A3,3 0 0,1 11,10M11,12A1,1 0 0,0 10,13C10,13.56 10.45,14 11,14A1,1 0 0,0 12,13A1,1 0 0,0 11,12Z" />
                                </svg>
                            </span>
                            <span class="ml-1" title="Editar aspecto de la carpeta" @click="openModalAspecto(row)">
                                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                                </svg>
                            </span>
                        </template>
                    </el-table-column>

                </el-table>
            </div>
        </div>
        <modalAspecto ref="modalEditarAspectoCarpeta" />
    </section>
</template>
<script>
import Unidad from '../../services/unidad'
import {messageBus} from '../../main.js'
import {mapGetters} from 'vuex'
import moment from 'moment'
import axios from 'axios'
export default {
    components:{
        migas: ()=>import('./partials/migas'),
        modalAspecto: ()=>import('./partials/modalEditarAspectoCarpeta')
    },
    data(){
        return {
            listado: []
        }
    },
    computed:{
        ...mapGetters({
            usuario: 'auth/user',
        })
    },
    mounted(){
        let id = +this.$route.params.id
        let canal_send = 'toCarpetasByUnidadGet'

        if(this.$route.name === 'home.mi-unidad.privada.carpeta'){
            id = this.$route.params.id_hash
            canal_send='toArchivosGetFolderId'
        }

        console.log(`===>==>`,id);

        window.api.send(canal_send,id)

        messageBus.$on('fromCarpetasByUnidadGet',(data)=>{
            this.listado = data
        })

        messageBus.$on('fromArchivosGetFolderId',(data)=>{
            this.listado = data
        })

        this.listar_caprtetas()

    },
    destroyed(){
        messageBus.$off('fromCarpetasByUnidadGet')
        messageBus.$off('fromArchivosGetFolderId')
    },
    methods:{
        async listar_caprtetas(){
            let id_unidad = +this.$route.params.id
            const {data} = await axios(`carpetas/${id_unidad}/lista`)
            console.log(data);
        },
        handleCarpetas(data){
            this.carpetas = data
        },
        formatterUltimaModificacion(row,col){
            return moment(row.ultima_modificacion).format('DD MMM Y HH:mm')
        },
        formatterTamano(row,col){
            return (+(row.tamano || 0) / 1024 / 1024).toFixed(2) + ' Mb'
        },
        openModalAspecto(item){
            console.log(item);
            this.$refs.modalEditarAspectoCarpeta.toggle()
        }

    }
}
</script>
<style lang="scss" scoped>
.rompe-palabra{
    word-wrap: break-word;
}
</style>
