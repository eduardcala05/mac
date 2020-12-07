<template>
    <section class="section-informe-lectura">
        <!-- contenedor top -->
        <div class="row mx-0 contenedor-top pr-3">
            <div class="col-auto">
                <el-select v-model="selected_archivo" filterable placeholder="Buscar archivo"  @change="TablaLecturas">
                    <el-option v-for="item in listado_archivos" :key="item.id" :label="item.nombre" :value="item.id" style="max-width:500px;">
                    </el-option>
                </el-select>
            </div>
            <div class="col my-auto d-middle" v-show="selected_archivo!=null">
                <i class="f-22 mr-1" :class="icon_extension()"></i>
                <el-tooltip v-if="DatosArchivos" class="item" effect="light" :disabled="DatosArchivos.nombre.length < 35" placement="bottom-start">
                    <div slot="content" class="" style="max-width:300px;">
                        <p class="f-14 text-muted2" style="word-break:break-all;">
                            {{_.get(DatosArchivos,'nombre')}}
                        </p>
                    </div>
                    <p class="nombre f-14 text-muted2" style="word-break:break-all;">
                        {{_.get(DatosArchivos,'nombre')}}
                    </p>
                </el-tooltip>
            </div>
            <div class="col-lg-auto my-auto ml-auto"  v-show="selected_archivo!=null">
                <p class="d-flex tres-puntos align-items-center f-14 text-muted2">
                    <svg style="width:23px;height:23px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="hdd" class="svg-inline--fa mr-2 fa-hdd fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                        <path fill="currentColor" d="M576 304v96c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48v-96c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48zm-48-80a79.557 79.557 0 0 1 30.777 6.165L462.25 85.374A48.003 48.003 0 0 0 422.311 64H153.689a48 48 0 0 0-39.938 21.374L17.223 230.165A79.557 79.557 0 0 1 48 224h480zm-48 96c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm-96 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z"> </path>
                    </svg>
                    {{_.get(DatosArchivos,'peso')}} MB
                </p>
            </div>
            <div class="col-lg-auto my-auto"  v-show="selected_archivo!=null">
                <p class="d-flex tres-puntos align-items-center f-14 text-muted2">
                    <el-tooltip class="item" effect="light" :content="_.get(DatosArchivos,'carpertas.ruta')" placement="bottom-start">
                        <i class="icon-folder-network f-22 mr-1"></i>
                    </el-tooltip>
                    Ubicación carpeta
                </p>
            </div>
            <el-tooltip class="item" effect="light" content="Creador" placement="bottom-start">
                <div class="col-lg-auto d-middle my-auto"  v-show="selected_archivo!=null">
                    <i class="el-icon-user-solid f-20 mr-1"></i> {{_.get(DatosArchivos,'usuario.nombre')}}
                    <p class="tres-puntos align-items-center f-14 text-muted2" style="max-width:130px;">
                    </p>
                </div>
            </el-tooltip>
            <div class="col-lg-auto my-auto" v-show="selected_archivo!=null">
                <el-badge :value="_.get(DatosArchivos,'cantidad_comentarios')" class="item">
                    <i class="icon-comment f-22 mr-1 cr-pointer" @click="openModalComentario" />
                </el-badge>
            </div>
        </div>
        <!-- calendario -->
        <div class="row mx-0 mt-3 px-3">
            <div class="col-12 border pt-3 text-center">
                <p class="f-18 f-600 text-muted2">Lecturas de archivos en los últimos 12 meses</p>
                <echarts class="ml-4 " ref="chartCalendario" style="width:100%; height:275px;" id="chartCalendario" />
            </div>
        </div>
        <!-- tabs 12 meses -->
        <div class="row mx-0 my-4" v-show="selected_archivo!=null">
            <div class="col-12">
                <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
                    <template v-for="(data,index) in TabMeses" >
                        <el-tab-pane >
                            <span slot="label">
                                <i class="el-icon-date"></i>
                                {{data}}
                            </span>
                            <el-table :data="datos_meses" border style="width: 75%;margin-right:auto; margin-left:auto;">
                                <el-table-column sortable prop="nombre_usuario" label="Usuario" width="350">
                                    <template slot-scope="data">
                                        <p>
                                            <img :src="data.row.nombre_usuario.photo_url" alt=""  style="height: 50px;" class="rounded-circle mr-2">
                                            {{data.row.nombre_usuario.nombre}}
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column  prop="fecha_lectura" label="Fecha de lectura"/>
                                <el-table-column  prop="hora_lectura" label="Hora lectura"/>
                                <el-table-column  prop="tiempo_lectura" label="Tiempo lectura">
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </template>
                </el-tabs>
            </div>
        </div>
        <modal-comentarios-archivos ref="modalComentariosArchivos" />
    </section>
</template>

<script>
import echarts from 'echarts'
import {mapGetters,mapActions} from 'vuex'
import modalComentariosArchivos from './partials/modalComentariosArchivos';

export default {
    components:{
        modalComentariosArchivos,
    },
    data(){
        return{
            activeName:0,
            selected_archivo:null,

        }
    },
    computed:{
        ...mapGetters({
            array_fechas:'informeLecturas/array_fechas',
            calendario:'informeLecturas/calendario',
            listado_archivos:'informeLecturas/selectedArchivos',
            TabMeses:'informeLecturas/TabMeses',
            datos_meses:'informeLecturas/datosMes',
        }),
        DatosArchivos(){
            return _.find(this.listado_archivos, (o)=> { return o.id == this.selected_archivo; });
        }
    },
    methods:{
        ...mapActions({
            selectedArchivos:'informeLecturas/selectedArchivos',
        }),
        icon_extension(){
            let fileExt = this.DatosArchivos?this.DatosArchivos.ext:'';
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
        handleClick() {
            var mes= _.last(_.split(this.TabMeses[this.activeName],'-'))
            var anio= _.head(_.split(this.TabMeses[this.activeName],'-'))
            let payload={mes,anio,'id':this.selected_archivo};
            this.$store.dispatch('informeLecturas/TablaLecturas',payload);
        },
        TablaLecturas(){
            var mes= _.last(_.split(this.TabMeses[this.activeName],'-'))
            var anio= _.head(_.split(this.TabMeses[this.activeName],'-'))
            let payload={mes,anio,'id':this.selected_archivo};
            this.$store.dispatch('informeLecturas/TablaLecturas',payload);
        },
        loadCharCalendario(){
            this.$store.dispatch('informeLecturas/loadCharCalendario').then(()=>{
                this.chartCalendario();
            })
        },
        chartCalendario(){
            let me = this
            var option = null;
            var ini=this.calendario.rango[0];
            var fin=this.calendario.rango[1];
            var rango=[ini,fin]
            // console.log('rango de meses',rango);
            // console.log('intentadno recorrer el array_fechas',this.array_fechas);
            var recorrer_fechas=this.array_fechas;
            // console.log('var recorrer_fechas',recorrer_fechas);
            function getVirtulData() {
                var date = +echarts.number.parseDate(ini);
                var end = +echarts.number.parseDate(fin);
                var dayTime = 3600 * 24 * 1000;
                var data = [];
                for (var time = date; time <= end; time += dayTime) {
                    // console.log('recorrinedo el año',echarts.format.formatTime('yyyy/MM/dd', time));
                    recorrer_fechas.forEach(function(e,i){
                        // console.log('mis fechas',e.created_at);
                        if (echarts.format.formatTime('d/M/yyyy',time)==e.created_at) { // se recorre cada dia y se compara contra la fecha de nuetra consulta.
                            // console.log('orginial',e.created_at,' vs',echarts.format.formatTime('dd/MM/yyyy', time));
                            data.push([
                                echarts.format.formatTime('yyyy-MM-dd', time),
                                e.total
                            ]);
                        }
                    })
                }
                return data;
            }

            option = {
                tooltip : {
                    position: 'top',
                    formatter: function (p) {
                        var format = me.moment(echarts.format.formatTime('MM-dd', p.value[0])).format('MMMM-DD');
                        return format+'<br/>'+p.value[1]+' Lecturas'
                    }
                },
                visualMap: {
                    min: 0,
                    max: this.calendario.max,
                    calculable: true,
                    orient: 'horizontal',
                    left: 'center',
                    top: 25,
                    textStyle: {
                        color: '#000'
                    }
                },

                calendar: {
                    top: 100,
                    left: 60,
                    right: 60,
                    cellSize: ['auto', 13],
                    dayLabel:{
                        color:'#6c757d',
                        nameMap:[ 'D','L','M','Mi','J','V','S']
                    },
                    monthLabel:{
                        nameMap:[ 'Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic' ],
                        color:'#6c757d',
                    },
                    range: rango,
                    itemStyle: {
                        normal: {borderWidth: 0.5}
                    },
                    yearLabel: {fontSize: '30'}
                },
                series: {
                    type: 'heatmap',
                    coordinateSystem: 'calendar',
                    data: getVirtulData()
                }
            };

            this.$refs.chartCalendario.setOption(option);
            // instance.setOption(option);

        },
        openModalComentario(){
          this.$refs.modalComentariosArchivos.toggle(this.selected_archivo);
        },
    },
    mounted(){
        this.selectedArchivos();
        this.loadCharCalendario();
    },
}
</script>

<style lang="scss" scoped>
.nombre{
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: pre-line;
}
.section-informe-lectura{

}
</style>
