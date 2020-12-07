<template>
    <section class="section-ver-usuario">
        <!-- top -->
        <div class="row contenedor-top">
            <div class="d-flex align-items-center pl-2">
                <button
                type="button"
                class="btn btn-general btn-sm br-20 py-0 px-1 pr-3"
                @click="$router.back()"
                >
                    <i class="icon-left-circled f-20 mr-1" />
                    Atrás
                </button>
            </div>
            <div class="col d-flex my-auto justify-content-between options">
                <el-select v-model="user_selected" placeholder="Seleccionar usuario" @change="InformacionVerUsuario">
                    <el-option v-for="item in array_usuarios" :key="item.id" :label="item.nombre" :value="item.id"/>
                </el-select>
                <div>
                    <button @click="EditarPermisos" type="button" name="button"
                    class="btn br-4 btn-sm py-0 border px-1 mx-1 ml-2  position-relative active"
                    data-toggle="tooltip" data-placement="left" title="Editar permisos">
                    <i class="icon-folder-key cr-pointer f-19 mx-1"></i>
                </button>
                <button @click="EliminarUsuario" type="button"
                name="button" class="btn br-4 btn-sm py-0 border px-1 mx-1 ml-2 position-relative active"
                data-toggle="tooltip" data-placement="left" title="Eliminar">
                <i class="icon-trash cr-pointer f-19 mx-1"></i>
            </button>
            <button @click="EditarUsuario" type="button" name="button"
            class="btn br-4 btn-sm py-0 border px-1 mx-1 active" data-toggle="tooltip" data-placement="left"
            title="Editar usuario">
            <i class="icon-account-edit cr-pointer f-19 mx-1 "></i>
        </button>
    </div>

</div>
</div>
<!-- info usuario -->
<div class="container-fluid">
    <div class="row justify-content-center  my-4">
        <div class="col-lg-auto col-md-12  my-auto info-personal-usuario">
            <div class="row justify-content-center py-1">
                <div class="px-3">
                    <el-avatar slot="reference" :src="InformacionPersonal.photo_url" />
                </div>
                <div class="col-lg-auto my-auto">
                    <p class="tres-puntos text-muted2 f-12 f-600">{{_.get(InformacionPersonal,'nombre')}}</p>
                </div>
                <div class="col-lg-auto my-auto">
                    <p class="d-flex align-items-center text-muted2 f-14">
                        <i class="f-19 icon-login-variant mr-2" data-toggle="tooltip" data-placement="bottom"
                        title="Ultimo ingreso "></i>
                        {{_.get(InformacionPersonal,'Conexion.UltimaConexion.created_at') | helper-fecha('dddd , DD MMM YYYY, h:mm a')}}
                    </p>
                </div>
                <div class="col-lg-auto my-auto">
                    <p class="d-flex align-items-center text-muted2 f-14">
                        <i class="f-19 icon-arrow-collapse-down mr-2" data-toggle="tooltip"
                        data-placement="bottom" title="Última sincronización de bajada "></i>
                        {{_.get(InformacionPersonal,'Conexion.UltimaDescarga.created_at') | helper-fecha('dddd , DD MMM YYYY, h:mm a')}}
                    </p>
                </div>
                <div class="col-lg-auto my-auto">
                    <p class="d-flex align-items-center text-muted2 f-14">
                        <i class="f-19 icon-arrow-collapse-up mr-2" data-toggle="tooltip"
                        data-placement="bottom" title="Última sincronización de subida"></i>
                        {{_.get(InformacionPersonal,'Conexion.UltimaCarga.created_at') | helper-fecha('dddd , DD MMM YYYY, h:mm a')}}
                    </p>
                </div>
                <div class="col-lg-auto my-auto">
                    <p class="d-flex align-items-center text-muted2 f-14">
                        <i class="icon-doc-inv text-muted f-19 mr-1"></i>
                        {{_.get(InformacionPersonal,'valores_carpeta[0].Archivos')}} Archivos
                    </p>
                </div>
                <div class="col-lg-auto my-auto">
                    <p class="d-flex align-items-center text-muted2 f-14">
                        <i class="icon-file-multiple text-info2 f-19 mr-1" data-toggle="tooltip"
                        data-placement="bottom" title="Peso total"></i>
                        {{_.get(InformacionPersonal,'valores_carpeta[0].Peso')}} MB
                    </p>
                </div>
                <div class="col-lg-auto my-auto">
                    <p @click="VerCalificacionUsuario" class="d-flex align-items-center f-15 cr-pointer"
                    style="color:#f7ba2a;" data-toggle="tooltip" data-placement="bottom"
                    title="Calificación">
                    {{CalificacionPromedio}}
                    <i class="icon-star text-info2 f-19 mr-1 cr-pointer"></i>
                </p>
            </div>
        </div>
    </div>
</div>
</div>
<!-- grafica ultimos 60 dias -->
<div class="row">
    <div class="col-12 text-center mb-2">
        <p class="f-18 f-600 text-muted">Sincronización de archivos de los últimos 60 días</p>
    </div>
    <div class="col-12">
        <echarts ref="chartSincronizacion60" id="chartSincronizacion60" class=""
        style="width:100%; height:400px;"/>
    </div>
</div>
<!-- grafica ultimos 12 meses -->
<div class="row">
    <div class="col-12 text-center mb-2">
        <p class="f-18 f-600 text-muted">Lecturas de archivos en los últimos 12 meses</p>
        <echarts class="ml-4 " style="width:100%; height:300px;" id="chartCalendario" ref="chartCalendario"/>
    </div>
</div>
<!-- tablas (2) -->
<div class="row">
    <div class="col-12 col-lg-5 col-md-12">
        <p class="w-100 text-center f-600 f-16 text-muted2 mb-3">Archivos más vistos</p>
        <el-table :data="TablaTop" border style="width: 100%">
            <el-table-column prop="archivos" label="Nombre" width="300">
                <template slot-scope="data">
                    <p class="d-flex"><i class="icon-file-pdf-box f-18 mr-1"></i>{{data.row.archivos.nombre}}
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="top" label="Vistas">
            </el-table-column>
        </el-table>
    </div>
    <div class="col-12 col-lg-7 col-md-12">
        <p class="w-100 text-center f-600 f-16 text-muted2 mb-3">Últimos archivos vistos</p>
        <el-table :data="tabla_recientes" border style="width: 100%">
            <el-table-column prop="archivos" label="Nombre" width="350">
                <template slot-scope="data">
                    <p class="d-flex"><i class="icon-file-pdf-box f-18 mr-1"></i>{{data.row.archivos.nombre}}
                    </p>
                </template>
            </el-table-column>
            <el-table-column prop="created_at" label="Fecha y Hora">
            </el-table-column>
        </el-table>
    </div>
</div>
<!-- infor tiempo de lectura 60 dias -->
<div class="row my-5">
    <div class="col-2 my-auto">
        <div class="border text-muted2 minicard-lectura my-2">
            <p class="f-600 bg-whitesmoke py-1 br-t-5">Última semana</p>
            <p class="py-1">{{semanaHoras}}</p>
        </div>
        <div class="border text-muted2 minicard-lectura my-2">
            <p class="f-600 bg-whitesmoke py-1 br-t-5">Último mes</p>
            <p class="py-1">{{mesHoras}}</p>
        </div>
        <div class="border text-muted2 minicard-lectura my-2">
            <p class="f-600 bg-whitesmoke py-1 br-t-5">Última bimestre</p>
            <p class="py-1">{{mesBimestre}}</p>
        </div>
    </div>
    <div class="col-10">
        <p class="text-center text-muted2 f-600">Tiempo de lectura diaria en los últimos 60 días</p>
        <echarts class="" style="width:100%; height:250px;" id="chartLecturaDiaria" ref="chartLecturaDiaria"/>
    </div>
</div>
<!-- archivos con mas vistas -->
<div class="row mt-5 mb-4">
    <div class="col-4 my-auto"></div>
    <div class="col-4 my-auto text-center f-16 f-600 text-muted2"> Listado de archivos vistos</div>
    <div class="col-4 my-auto d-flex justify-content-end">
        <input type="search" v-model="buscar" placeholder="Buscar" class="form-control br-4 w-50"
        style="max-width:345px">
        <el-popover placement="bottom" width="160" v-model="visible" class="cr-pointer">
            <el-checkbox v-model="checked_pdf">PDF</el-checkbox>
            <el-checkbox v-model="checked_imagen">Imagen</el-checkbox>
            <el-checkbox v-model="checked_video">Video</el-checkbox>
            <el-checkbox v-model="checked_presentacion">Presentación</el-checkbox>
            <button slot="reference" type="button" name="button"
            class="btn br-4 btn-sm py-1 border active px-1 mx-1 cr-pointer">
            <i class="icon-filter cr-pointer f-19 mx-1"></i> <span
            class="f-12 position-relative text-muted2" style="top: -4px; right: 4px;">(4)</span>
        </button>
    </el-popover>
</div>
</div>
<!-- tabla -->
<div class="row my-3">
    <div class="col-12">
        <el-table :data="SuperFiltro" border height="600" style="width: 100%">
            <el-table-column sortable prop="nombre" label="Nombre">
                <template slot-scope="data">
                    <p class="d-flex">
                        <i v-if="data.row.extension==1" class="icon-file-pdf-box f-18 mr-1"/>
                        <i v-if="data.row.extension==2" class="icon-image f-18 mr-1"
                        style="color:green"/>
                        <i v-if="data.row.extension==3" class="icon-youtube f-18 mr-1 "
                        style="color: blue;"/>
                        <i v-if="data.row.extension==4" class="icon-file-presentation-box f-18 mr-1"
                        style="color: darkorange;"/>

                        {{data.row.nombre}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="updated_at" label="Última modificación">
                </el-table-column>
                <el-table-column sortable prop="peso" label="Tamaño del archivo">
                </el-table-column>
                <el-table-column sortable prop="total" label="Vistas totales">
                </el-table-column>
                <el-table-column sortable prop="mes" label="Vistas últ. mes">
                </el-table-column>
            </el-table>
        </div>
    </div>
    <modal-editar-usuario ref="EditarUsuario" @listar_usuarios="InformacionVerUsuario"/>
    <modal-eliminar-usuario ref="EliminarUsuario"/>
    <modal-editar-permisos-usuario ref="EditarPermisosUsuarios"/>
    <modal-calificacion-usuario ref="VerCalificacionUsuario"/>
</section>
</template>

<script>
import echarts from 'echarts'
import modalEditarUsuario from './partials/modalEditarUsuario';
import modalEliminarUsuario from './partials/modalEliminarUsuario';
import modalEditarPermisosUsuario from './partials/modalEditarPermisosUsuario';
import modalCalificacionUsuario from './partials/modalCalificacionUsuario';
import {mapGetters, mapActions} from 'vuex'

export default {
    middleware: 'auth',
    data() {
        return {
            /*Select usuarios*/
            user_selected: this.$route.params.id,
            visible: false,
            checked_pdf: false,
            checked_imagen: false,
            checked_video: false,
            checked_presentacion: false,
            id_user: this.$route.params.id,
            //
            array_fechas: [],
            calendario: {
                max: 10000,
                rango: []
            },
            buscar: '',
        }
    },
    async mounted() {
        if (this.array_usuarios.length === 0) {
            await this.$store.dispatch('usuarios/ListarUsuarios')
        }

        this.InformacionVerUsuario()

    },
    components: {
        modalEditarUsuario,
        modalEliminarUsuario,
        modalEditarPermisosUsuario,
        modalCalificacionUsuario,
    },
    computed: {
        ...mapGetters({
            InformacionPersonal: 'VerUsuario/InformacionPersonal',
            TablaVisto: 'VerUsuario/TablaVisto',
            TablaTop: 'VerUsuario/TablaTop',
            TablaRecientes: 'VerUsuario/TablaRecientes',
            //
            SincronizacionLineas: 'VerUsuario/SincronizacionLineas',
            SincronizacionBarras: 'VerUsuario/SincronizacionBarras',
            //
            dataLecturas: 'VerUsuario/dataLecturas',
            //
            semanaHoras: 'VerUsuario/semanaHoras',
            mesHoras: 'VerUsuario/mesHoras',
            mesBimestre: 'VerUsuario/mesBimestre',
            //
            CalificacionPromedio: 'VerUsuario/CalificacionPromedio',
            //
            array_usuarios: 'usuarios/ListarUsuarios',

        }),
        tabla_vista() {
            return _.forEach(this.TablaVisto, (value) => {
                value.updated_at = this.moment(value.updated_at).format('LLLL');
            });
        },
        tabla_recientes() {
            return _.forEach(this.TablaRecientes, (value) => {
                value.created_at = this.moment(value.created_at).format('LLLL');
            });
        },
        filtrodata() {
            return _.filter(this.tabla_vista, (f) => f.nombre.toLowerCase().includes(this.buscar.toLowerCase()));
        },
        SuperFiltro() {
            let table = this.filtrodata;
            if (this.checked_pdf === true && this.checked_imagen === false && this.checked_video === false && this.checked_presentacion === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 1;
                });
                // console.log('1');
            }
            if (this.checked_pdf === true && this.checked_imagen === true && this.checked_video === false && this.checked_presentacion === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 1 || o.extension == 2;
                });
                // console.log('2');
            }
            if (this.checked_pdf === true && this.checked_imagen === true && this.checked_video === true && this.checked_presentacion === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 1 || o.extension == 2 || o.extension == 3;
                });
                // console.log('3');
            }
            if (this.checked_pdf === true && this.checked_imagen === true && this.checked_video === true && this.checked_presentacion === true) {
                table = this.filtrodata;
                // console.log('4');
            }
            if (this.checked_pdf === true && this.checked_imagen === false && this.checked_video === true && this.checked_presentacion === true) {
                table = _.filter(table, (o) => {
                    return o.extension == 1 || o.extension == 3 || o.extension == 4;
                });
                // console.log('5');
            }
            if (this.checked_pdf === true && this.checked_imagen === false && this.checked_video === true && this.checked_presentacion === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 1 || o.extension == 3;
                });
                // console.log('6');
            }
            if (this.checked_pdf === true && this.checked_imagen === false && this.checked_video === false && this.checked_presentacion === true) {
                table = _.filter(table, (o) => {
                    return o.extension == 1 || o.extension == 4;
                });
                // console.log('7');
            }
            // imagen
            if (this.checked_imagen === true && this.checked_video === false && this.checked_presentacion === false && this.checked_pdf === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 2;
                });
                // console.log('8');
            }
            if (this.checked_imagen === true && this.checked_video === true && this.checked_presentacion === false && this.checked_pdf === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 2 || o.extension == 3;
                });
                // console.log('9');
            }
            if (this.checked_imagen === true && this.checked_video === true && this.checked_presentacion === true && this.checked_pdf === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 2 || o.extension == 3 || o.extension == 4;
                });
                // console.log('10');
            }
            if (this.checked_imagen === true && this.checked_presentacion === true && this.checked_pdf === true && this.checked_video === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 2 || o.extension == 4 || o.extension == 1;
                });
                // console.log('11');
            }
            if (this.checked_imagen === true && this.checked_presentacion === true && this.checked_pdf === false && this.checked_video === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 2 || o.extension == 4;
                });
                // console.log('12');
            }
            // video
            if (this.checked_video === true && this.checked_presentacion === false && this.checked_pdf === false && this.checked_imagen === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 3;
                });
                // console.log('13');
            }
            if (this.checked_video === true && this.checked_presentacion === true && this.checked_pdf === false && this.checked_imagen === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 3 || o.extension == 4;
                });
                // console.log('14');
            }
            //presentacion
            if (this.checked_presentacion === true && this.checked_pdf === false && this.checked_imagen === false && this.checked_video === false) {
                table = _.filter(table, (o) => {
                    return o.extension == 4;
                });
                // console.log('15');
            }
            return table;
        }

    },
    methods: {
        EditarPermisos() {
            this.$refs.EditarPermisosUsuarios.toggle(this.InformacionPersonal.id);
        },
        EliminarUsuario() {
            let nombre = this.InformacionPersonal.nombre
            let id = this.InformacionPersonal.id
            this.$refs.EliminarUsuario.toggle(nombre, id);
        },
        EditarUsuario() {
            this.$refs.EditarUsuario.toggle(this.InformacionPersonal.id);
        },
        EliminarCarpeta() {
            // this.$refs.EliminarCarpeta.toggle();
        },
        RealizarBackUp() {
            // this.$refs.RealizarBackUp.toggle();
        },
        VerCalificacionUsuario() {
            this.$refs.VerCalificacionUsuario.toggle();
        },
        ChartSincronizacion60() {

            var option = {
                tooltip: {},
                grid: {
                    top: '8%',
                    left: '1%',
                    right: '1%',
                    bottom: '8%',
                    containLabel: true,
                },
                legend: {
                    itemGap: 50,
                    data: ['MB', 'Archivos'],
                    textStyle: {color: '#6D6B6B',},
                },
                xAxis: [{
                    type: 'category',
                    boundaryGap: true,
                    axisLine: {
                        show: true,
                        lineStyle: {color: '#DADCE0'},
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#6D6B6B',
                            margin: 15,
                        },
                    },
                    axisTick: {show: false,},
                    data: [],
                }],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        // max: 140,
                        splitNumber: 7,
                        splitLine: {
                            show: true,
                            lineStyle: {color: '#DADCE0'}
                        },
                        axisLine: {
                            show: true,
                            lineStyle: {color: '#DADCE0'},
                        },
                        axisLabel: {
                            textStyle: {color: '#6D6B6B',},
                        },
                        axisTick: {
                            show: false,
                        },
                    }
                ],
                series: [
                    // linea
                    {
                        name: 'MB',
                        type: 'line',
                        showAllSymbol: true,
                        symbol: 'emptyCircle',
                        symbolSize: 6,
                        lineStyle: {
                            normal: {color: "#0090FF"}
                        },
                        label: {show: false,},
                        itemStyle: {
                            normal: {color: "#0090FF",}
                        },
                        tooltip: {show: true},
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(0, 144, 255, 1)'
                                }, {offset: 1, color: '#fff'}], false),
                                shadowColor: '#fff',
                                shadowBlur: 20
                            }
                        },
                        data: this.SincronizacionLineas

                    },
                    // barras
                    {
                        name: 'Archivos',
                        type: 'bar',
                        barWidth: 20,
                        tooltip: {show: true},
                        label: {show: false,},
                        itemStyle: {
                            normal: {color: '#0090FF'}
                        },
                        data: this.SincronizacionBarras
                    }
                ]
            };
            this.$refs.chartSincronizacion60.setOption(option);
        },
        chartCalendario() {
            let me = this
            var option = null;
            var ini = this.calendario.rango[0];
            var fin = this.calendario.rango[1];
            var rango = [ini, fin]
            // console.log('rango de meses',rango);
            // console.log('intentadno recorrer el array_fechas',this.array_fechas);
            var recorrer_fechas = this.array_fechas;

            // console.log('var recorrer_fechas',recorrer_fechas);
            function getVirtulData() {
                var date = +echarts.number.parseDate(ini);
                var end = +echarts.number.parseDate(fin);
                var dayTime = 3600 * 24 * 1000;
                var data = [];
                for (var time = date; time <= end; time += dayTime) {
                    // console.log('recorrinedo el año',echarts.format.formatTime('yyyy/MM/dd', time));
                    recorrer_fechas.forEach(function (e, i) {
                        // console.log('mis fechas',e.created_at);
                        if (echarts.format.formatTime('d/M/yyyy', time) == e.created_at) { // se recorre cada dia y se compara contra la fecha de nuetra consulta.
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
                tooltip: {
                    position: 'top',
                    formatter: function (p) {
                        var format = me.moment(echarts.format.formatTime('MM-dd', p.value[0])).format('MMMM-DD');
                        return format + '<br/>' + p.value[1] + ' Lecturas'
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
                    dayLabel: {
                        color: '#6c757d',
                        nameMap: ['D', 'L', 'M', 'Mi', 'J', 'V', 'S']
                    },
                    monthLabel: {
                        nameMap: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                        color: '#6c757d',
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

        },
        chartLecturaDiaria() {
            let that = this
            var option = null;
            option = {
                color: ['#3398DB'],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',

                        axisTick: {
                            alignWithLabel: true
                        },
                        data:
                        function () {
                            var list = [];
                            for (var i = 1; i <= 60; i++) {
                                list.push(i);
                            }
                            return list;
                        }()
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: 'total',
                        type: 'bar',
                        barWidth: '60%',
                        data: this.dataLecturas
                    }
                ]
            };
            this.$refs.chartLecturaDiaria.setOption(option);
        },
        InformacionVerUsuario() {
            let id = this.user_selected
            let $this = this
            this.$store.dispatch('VerUsuario/InformacionVerUsuario', id);
            this.$store.dispatch('VerUsuario/graficaCalendario', id).then((data) => {
                let data_f = data.grafica;
                this.calendario.rango = data.rango;
                var count = []
                data_f.forEach(function (elemento, index) {
                    count[index] = {total: 0};
                    data_f.forEach(function (e, i) {
                        // console.log($this.moment(elemento.created_at).format('l'))
                        if ($this.moment(elemento.created_at).format('l') == $this.moment(e.created_at).format('l')) {
                            count[index].created_at = $this.moment(elemento.created_at).format('l');
                            count[index].total++;
                        }
                    })
                })
                // console.log('construllendo el array de fechas',count);
                this.array_fechas = _.uniqBy(count, 'created_at');

                // console.log('array de fechas solo fecha unica',  this.array_fechas);
                // this.dias_actividad=this.array_fechas.length;
                var max = 0;
                max = _.maxBy(count, o => {
                    return o.total;
                });
                if (max == undefined) {
                    this.calendario.max = 0;
                } else {
                    this.calendario.max = max.total;
                }
                this.chartCalendario();
            })
            this.$store.dispatch('VerUsuario/graficaLecturas', id).then(() => {
                this.chartLecturaDiaria();
            });
            this.$store.dispatch('VerUsuario/TablasVerUsuarios', id);
            this.$store.dispatch('VerUsuario/SincronizacionArchivos', id).then(() => {
                this.ChartSincronizacion60();
            });
            this.$store.dispatch('VerUsuario/CardLecturas', id);
        },

    },
}
</script>

<style lang="scss" scoped>
.section-ver-usuario {

    .contenedor-top {
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        padding: 13px 0px;
        .options{
            button {
                color: #dbdbdb;

                &.active {
                    color: #5d5d5d !important;
                }
            }
        }
    }

    .info-personal-usuario {
        background: #F5F5F5;
        border: 1px solid #DBDBDB;
        border-radius: 5px;
    }

    .minicard-lectura {
        border-radius: 5px;
        max-width: 150px;
        min-width: 150px;
        margin-left: auto;
        margin-right: auto;
        text-align: center;
    }

    ::-webkit-scrollbar-track {
        height: 6px;
        width: 6px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        background-color: #F5F5F5;
        border-radius: 5px;
    }

    ::-webkit-scrollbar {
        background-color: #F5F5F5;
        width: 6px;
        height: 6px;
        border-radius: 5px;
    }

    ::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        background-color: #878787;
        border-radius: 5px;
    }
}
</style>
