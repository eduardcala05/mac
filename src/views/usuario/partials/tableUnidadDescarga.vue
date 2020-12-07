
<template>
    <section>
            <div class="row my-4">
                <div class="col-6 my-auto text-center">
                    <p class="f-600 f-14">Carpetas de la unidad descargable</p>
                </div>
                <div class="col-6 my-auto">
                    <input v-model="buscar" class="form-control w-100" placeholder="Buscar carpeta">
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <el-table border ref="multipleTable" :data="filtrodata"  style="width: 100%">
                        <el-table-column label="activo" prop="activo" >
                            <template slot-scope="data">
                                <el-checkbox
                                        :value="data.row.activo"
                                        :false-label="0"
                                        :true-label="1"
                                        @change="set_check(data.row)"/>
                            </template>
                         </el-table-column>
                        <el-table-column label="Carpeta" property="nombre">
                        </el-table-column>
                        <el-table-column label="Peso" property="peso_archivos" >
                            <template slot-scope="data">
                                {{ _.round(data.row.peso_archivos/1024 , 2)}} MB
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
    </section>
</template>
<script>
import {mapGetters,mapActions} from 'vuex'
    export default{
    props:['form'],
        data(){
            return{
                buscar:'',
            }
        },
        computed:{
            filtrodata(){
                // console.log(this.tableDate(2))
                return _.filter(this.tableDate,(f)=> f.nombre.toLowerCase().includes(this.buscar.toLowerCase()))
            },
            ...mapGetters({
              tableDate:'usuarios/carpetaPublica'
            }),
        },
        methods:{
            async set_check(carpeta){
                let data = await this.$store.dispatch('usuarios/PermisoUnidad',{carpeta:carpeta,form:this.form});
                this.notificacion('Permiso', data.mensaje, data.tipo);
            },
        },

    }
</script>
