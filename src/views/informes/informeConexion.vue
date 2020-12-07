<template>
  <section class="section-informe-conexion">
    <!-- contenedor top -->
    <div class="row contenedor-top">
      <div class="col-lg-auto">
        <!-- <el-date-picker type="date" v-model="value1" placeholder="Seleccione el día" class="w-100" value-format="timestamp" > </el-date-picker> -->
        <el-date-picker
        v-model="value1"
        type="date"
        placeholder="Pick a Date"
        format="yyyy/MM/dd"
        value-format="timestamp"
        @change="LoadInformeConexio">
      </el-date-picker>
    </div>
    <div class="col mt-2 d-middle">
        <i class="icon-checkbox-blank text-dark f-22" />
        <p class="ml-2">Trabajando sin conexion</p>
    </div>
    <div class="col mt-2 d-middle">
        <i class="icon-checkbox-blank text-green f-22" />
        <p class="ml-2">Trabajando con Conexion</p>
    </div>
    <div class="col mt-2 d-middle">
        <i class="icon-checkbox-blank text-orange f-22" />
        <p class="ml-2">Kill App</p>
    </div>
  </div>
    <!--  -->
    <div class="container mt-5">
      <div class="row mb-3">
        <div class="col-4 text-center offset-4 my-auto">
          <p class="text-muted2 f-18 f-600">{{titulo_fecha}}</p>
        </div>
        <div class="col-4">
          <el-input placeholder="Buscar" v-model="search" prefix-icon="el-icon-search" size="small" />
        </div>
      </div>
      <div class="row">
        <div class="col-2 text-center" style="">
          <p class="f-600 text-muted f-158">Usuario</p>
        </div>
        <div class="col-10">
          <div class="row text-center content_horario_x">
            <div class="item_horario">0-2</div>
            <div class="item_horario">2-4</div>
            <div class="item_horario">4-6</div>
            <div class="item_horario">6-8</div>
            <div class="item_horario">8-10</div>
            <div class="item_horario">10-12</div>
            <div class="item_horario">12-14</div>
            <div class="item_horario">14-16</div>
            <div class="item_horario">16-18</div>
            <div class="item_horario">18-20</div>
            <div class="item_horario">20-22</div>
            <div class="item_horario">22-24</div>
          </div>
        </div>
      </div>
      <div class="h-list custom-scroll px-3 pb-3 mt-3">
          <div v-for="data in usuariosBuscar" class="row content_users">
        <div class="col-2 text-center py-3 item_user">
          <div class="row justify-content-center ">
            <div class="col-lg-12 my-auto">
              <el-avatar slot="reference" :src="data.photo_url" />
            </div>
            <div class="col-lg-12 text-muted2 my-auto">
              <p class="tres-puntos">{{data.nombre}}</p>
            </div>
          </div>
        </div>
        <div class="col-10 my-auto">
          <div class="row content_event_x" id="content_event_x_16">

            <template v-if="data.grafica_conexiones.length==0">
              <div class="evento " style="background: #f7eeefd1; width: 100%; border-radius: 10px;" />
            </template>
            <template v-else>
              <template v-for="(g,i) in data.grafica_conexiones" >
                <div v-if="_.get(g,'background')=='#f7eeefd1'" class="evento " :style="` width: ${_.get(g,'width')}%; background: ${_.get(g,'background')}; border-right: 1px solid white;`"/>
                <el-tooltip v-else class="item" effect="light" :content="`${_.get(g,'hora_inicio')} - ${_.get(g,'hora_final')}`" placement="top">
                  <div class="evento " :style="` width: ${_.get(g,'width')}%; background: ${_.get(g,'background')}; border-right: 1px solid white;`" />
                </el-tooltip>
              </template>

            </template>
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script>
import moment from 'moment'
import {mapGetters,mapActions} from 'vuex'
export default {
    data(){
        return{
          search:'',
          value1: new Date(),
        }
    },
    computed:{
      usuariosBuscar(){
        let datos =this.$store.getters['informeConexion/usuarios_data']
        return datos.filter(data => !this.search || data.nombre.toLowerCase().includes(this.search.toLowerCase()))
      },
        ...mapGetters({
            usuarios:'informeConexion/usuarios_data',
            titulo_fecha:'informeConexion/titulo_fecha'
        })
    },
    methods:{
        LoadInformeConexio(){
            let  fecha = moment(this.value1).format("YYYY-MM-DD HH:mm:ss")
            this.$store.dispatch('informeConexion/LoadInformeConexio',fecha)
            console.log(this.usuariosBuscar);
        }
    },
    mounted(){
        this.LoadInformeConexio();
    },
}
</script>

<style lang="scss" scoped>
.h-list{
    max-height: calc(100vh - 285px);
    overflow: auto;
}
.section-informe-conexion{
  .collection .collection-item.avatar p{
    margin-top: 0.5rem;
  }

  li.collection-item{
    cursor: pointer;
  }
  .content_horario_x{
    // border-top: 0.5px solid #5d5d5d;
    // border-bottom: 0.5px solid #5d5d5d;
    border: 0.5px solid #5d5d5d;
    font-size:12px;
  }
  div.content_event_x{
    background: #f7eeefd1;
    // background: #d3d3d3;
    height: 30px;
  }
  .evento{
    height: 30px;
  }
  .item_event_head{
    width: 5%;
    height: 15px;
    cursor: pointer;
  }
  .item_horario{
    color:#5d5d5d;
    border-right: 0.5px solid #5d5d5d;
    width: 8.33%;
  }
}
.text-green{
    color: #28a745;
}
.text-orange{
    color: #f17117;
}
</style>
