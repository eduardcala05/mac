<template>
    <section class="section-informe-fechas">
        <!-- calendario -->
        <div class="row mt-3 px-3">
            <div class="col-12 text-center">
                <p class="f-18 f-600 text-muted2">Informe de lecturas y descargas por semana del año
                </p>
            </div>
            <div class="col-12">
                <semanas class="mb-4" v-model="semanActual" @change="load"/>
            </div>
        </div>
        <!-- tabs 12 meses -->
        <div class="row mb-2 align-items-center">
            <div class="col-6 text-center">
                <p class="text-muted2 f-600 f-18">
                    Semana {{_.get(semana,'numero')}}:
                    <span class="f-400">{{_.get(semana,'inicio')}} - {{_.get(semana,'fin')}}</span>
                </p>
            </div>
            <div class="col-4">
                <el-input placeholder="Buscar por archivo" prefix-icon="el-icon-search" v-model="search" size="small" />
            </div>
            <div class="col-12 my-3">
                <el-table border :data="datos_semanas" style="width: 100%;margin-right:auto; margin-left:auto;">
                    <el-table-column sortable prop="dia" label="Día" />
                    <el-table-column sortable prop="actividad" label="Actividad">
                        <template slot-scope="data">
                            <p class="d-flex" v-if="_.get(data,'row.actividad')==2">
                                <i class="icon-download-alt f-18 mr-1" style="color:purple"></i> Descarga
                            </p>
                            <p class="d-flex" v-if="_.get(data,'row.actividad')==1">
                                <i class="icon-eye text-info2  f-18 mr-1" style="color:#409eff"></i> Lectura
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column sortable prop="archivo" label="Archivo" sortable sort-by="archivo.nombre">
                        <template slot-scope="data">
                            <p class="d-flex">
                                <i :class="`${icon_extension(data.row.archivo.ext)} f-18 mr-1`"/>
                                {{_.get(data,'row.archivo.nombre')}}
                            </p>
                        </template>
                    </el-table-column>
                    <el-table-column sortable prop="usuario" label="Usuario" sortable sort-by="usuario.nombre">
                        <template slot-scope="data">
                            <div class="d-flex">
                                <div class="px-2 my-auto">
                                    <img :src="data.row.usuario.photo_url" alt=""  style="height: 56px;" class="rounded-circle">
                                </div>
                                <div class="px-2 my-auto">
                                    <p class="f-12 text-muted2 tres-puntos">{{_.get(data,'row.usuario.nombre')}}</p>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column sortable prop="hora" label="Hora" />
                    <el-table-column sortable prop="tiempo_lectura" label="Tiempo lectura"/>
                </el-table>
            </div>
        </div>
    </section>
</template>

<script>
import semanas from './partials/semanas'
import {mapActions,mapGetters} from 'vuex'
import moment from 'moment'
export default {
    components:{
        semanas,
    },
    data(){
        return{
            semanActual:{
                year:moment().year(),
                week:moment().week()
            },
            search:''
        }
    },
    computed:{
        datos_semanas(){
            let datos =this.$store.getters['informeFecha/datos_semanas']
            return datos.filter(data => !this.search || data.archivo.nombre.toLowerCase().includes(this.search.toLowerCase()))
        },
        ...mapGetters({
            semana:'informeFecha/semana',
        })

    },
    mounted(){
        this.load();
    },
    methods:{
        icon_extension(fileExt){
            let fileTypes = {
                image: {
                    extension: ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'svg','webp'],
                    icon: 'icon-image color-img'
                },
                pdf: {
                    extension: ['pdf'],
                    icon: 'icon-file-pdf-box color-pdf'
                },
                video: {
                    extension: ['avi', 'mp4', 'mpg', 'mpeg', 'wmv', 'div'],
                    icon: 'icon-youtube-play color-video'
                },
                doc: {
                    extension: ['doc','docx','txt'],
                    icon: 'icon-doc-inv text-dark'
                },
                ppt: {
                    extension: ['ppt','pptx'],
                    icon: 'icon-file-presentation-box text-warning'
                },
                other: {
                    icon: 'icon-doc-inv text-dark'
                }
            }
            let fileType = fileExt.split('.').pop()
            let isImage = fileTypes.image.extension.includes(fileType.toLowerCase())
            let isPdf = fileTypes.pdf.extension.includes(fileType.toLowerCase())
            let isVideo = fileTypes.video.extension.includes(fileType.toLowerCase())
            let isDoc = fileTypes.doc.extension.includes(fileType.toLowerCase())
            let isPPT = fileTypes.ppt.extension.includes(fileType.toLowerCase())
            if (isImage){
                return fileTypes.image.icon
            } else if (isPdf){
                return fileTypes.pdf.icon
            } else if (isVideo){
                return fileTypes.video.icon
            } else if (isDoc){
                return fileTypes.doc.icon
            } else if (isPPT){
                return fileTypes.ppt.icon
            } else {
                return fileTypes.other.icon
            }
        },
        load(){
            this.$store.dispatch('informeFecha/dataSemana',this.semanActual);
        }
    }

}
</script>

<style lang="scss" scoped>
.section-informe-fechas{

}
</style>
