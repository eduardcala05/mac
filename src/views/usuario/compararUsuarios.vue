<template>
  <section class="section-comparar-usuarios mb-2">
    <div class="row mx-0">
        <button
        type="button"
        class="btn btn-general btn-sm br-20 py-0 px-1 pr-3"
        @click="$router.push({name:'usuarios.listar.principal'})"
        >
            <i class="icon-left-circled f-20 mr-1" />
            Atrás
        </button>
      <!-- <i class="icon-left-circle f-20 ml-2" @click="$router.push({name:'usuarios.listar.principal'})"></i> -->
      <hr/>
    </div>
    <!-- seleccion de usuarios -->
    <div class="row">
      <div class="col-3"></div>
      <div class="col-9">
        <div class="row listado-buscar-usuarios">
          <div class="col-3">
            <el-select v-model="selected_usuario1" placeholder="Selecciona" filterable @change="Comparar(1,selected_usuario1)">
              <el-option v-for="item in listado_usuarios"  :key="item.id" :label="item.nombre" :value="item.id" v-if="item.id != selected_usuario2 && item.id != selected_usuario3 && item.id != selected_usuario4 "/>
            </el-select>
            <div class="box-usuario text-center mt-3 py-3">
              <i class="mdi mdi-close-circle text-muted2" @click="Limpiar(1)"></i>
              <el-avatar slot="reference" :src="_.get(Usuario1,'photo_url')" />
              <p class="w-100 text-muted2 text-center mt-3 f-15">{{_.get(Usuario1,'nombre')}}</p>
            </div>
          </div>
          <div class="col-3">
            <el-select v-model="selected_usuario2" placeholder="Selecciona" filterable @change="Comparar(2,selected_usuario2)">
              <el-option v-for="item in listado_usuarios"  :key="item.id" :label="item.nombre" :value="item.id" v-if="item.id != selected_usuario1 && item.id != selected_usuario3 && item.id != selected_usuario4 "/>
            </el-select>
            <div class="box-usuario text-center mt-3 py-3">
              <i class="mdi mdi-close-circle text-muted2" @click="Limpiar(2)"></i>
              <el-avatar slot="reference" :src="_.get(Usuario2,'photo_url')" />
              <p class="w-100 text-muted2 text-center mt-3 f-15">{{_.get(Usuario2,'nombre')}}</p>
            </div>
          </div>
          <div class="col-3">
            <el-select v-model="selected_usuario3" placeholder="Selecciona" filterable @change="Comparar(3,selected_usuario3)">
              <el-option v-for="item in listado_usuarios"  :key="item.id" :label="item.nombre" :value="item.id" v-if="item.id != selected_usuario2 && item.id != selected_usuario1 && item.id != selected_usuario4 " />
            </el-select>
            <div class="box-usuario text-center mt-3 py-3">
              <i class="mdi mdi-close-circle text-muted2" @click="Limpiar(3)"></i>
              <el-avatar slot="reference" :src="_.get(Usuario3,'photo_url')" />
              <p class="w-100 text-muted2 text-center mt-3 f-15">{{_.get(Usuario3,'nombre')}}</p>
            </div>
          </div>
          <div class="col-3">
            <el-select v-model="selected_usuario4" placeholder="Selecciona" filterable @change="Comparar(4,selected_usuario4)">
              <el-option v-for="item in listado_usuarios"  :key="item.id" :label="item.nombre" :value="item.id" v-if="item.id != selected_usuario2 && item.id != selected_usuario3 && item.id != selected_usuario1 "/>
            </el-select>
            <div class="box-usuario text-center mt-3 py-3">
              <i class="mdi mdi-close-circle text-muted2" @click="Limpiar(4)"></i>
              <el-avatar slot="reference" :src="_.get(Usuario4,'photo_url')" />
              <p class="w-100 text-muted2 text-center mt-3 f-15">{{_.get(Usuario4,'nombre')}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- info -->
    <div class="row listado-items mt-3">
      <div class="col-3">
        <div class="item-comparacion px-3 py-2">
          <el-tooltip class="item" effect="dark" content="Último ingreso" placement="right">
            <p class="d-flex align-items-center tres-puntos text-muted2 f-600">
              <i class="mdi mdi-login-variant mr-2"></i> Último ingreso
            </p>
          </el-tooltip>

        </div>
        <div class="item-comparacion px-3 py-2">
          <el-tooltip class="item" effect="dark" content="Última sincronización de bajada" placement="right">
            <p class="d-flex align-items-center tres-puntos text-muted2 f-600">
              <i class="mdi mdi-arrow-collapse-down mr-2 mr-2"></i> Última sync de bajada
            </p>
          </el-tooltip>

        </div>
        <div class="item-comparacion px-3 py-2">
          <el-tooltip class="item" effect="dark" content="Última sincronización de subida" placement="right">
            <p class="d-flex align-items-center tres-puntos text-muted2 f-600">
              <i class="mdi   mdi-arrow-collapse-up mr-2 mr-2"></i> Última sync de subida
            </p>
          </el-tooltip>

        </div>
        <div class="item-comparacion px-3 py-2">
          <el-tooltip class="item" effect="dark" content="Archivos actuales" placement="right">
            <p class="d-flex align-items-center tres-puntos text-muted2 f-600">
              <i class="mdi mdi-file mr-2"></i> Archivos actuales
            </p>
          </el-tooltip>

        </div>
        <div class="item-comparacion px-3 py-2">
          <el-tooltip class="item" effect="dark" content="Peso de archivos actuales" placement="right">
            <p class="d-flex align-items-center tres-puntos text-muted2 f-600">
              <i class="mdi mdi-file-multiple text-info2 mr-2"></i> Peso de archivos actuales
            </p>
          </el-tooltip>

        </div>
        <div class="item-comparacion px-3 py-2">
          <el-tooltip class="item" effect="dark" content="Archivos en el último mes" placement="right">
            <p class="d-flex align-items-center tres-puntos text-muted2 f-600">
              <i class="mdi mdi-file mr-2"></i> Archivos en el último mes
            </p>
          </el-tooltip>

        </div>
        <div class="item-comparacion px-3 py-2">
          <el-tooltip class="item" effect="dark" content="Peso de archivos último mes" placement="right">
            <p class="d-flex align-items-center tres-puntos text-muted2 f-600">
              <i class="mdi mdi-file-multiple text-info2 mr-2"></i> Peso de archivos último mes
            </p>
          </el-tooltip>

        </div>
        <div class="item-comparacion px-3 py-2">
          <el-tooltip class="item" effect="dark" content="Visualizaciones totales" placement="right">
            <p class="d-flex align-items-center tres-puntos text-muted2 f-600">
              <i class="mdi mdi-eye mr-2"></i> Visualizaciones totales
            </p>
          </el-tooltip>

        </div>
        <div class="item-comparacion px-3 py-2">
          <el-tooltip class="item" effect="dark" content="Visualizaciones último mes" placement="right">
            <p class="d-flex align-items-center tres-puntos text-muted2 f-600">
              <i class="mdi mdi-eye mr-2"></i> Visualizaciones último mes
            </p>
          </el-tooltip>

        </div>
      </div>
      <div class="col-9">
        <div class="row listado-buscar-usuarios">
          <div class="col-3">
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario1,'Conexion.UltimaConexion.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario1,'Conexion.UltimaCarga.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario1,'Conexion.UltimaDescarga.created_at','N/A')}}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario1,'actual.archivos','N/A')}}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario1,'actual.peso','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario1,'mes.archivos','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario1,'mes.peso','N/A')}}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario1,'visualizacion_total','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario1,'visualizacion_mes','N/A')}}</p>
            </div>
          </div>
          <div class="col-3">
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario2,'Conexion.UltimaConexion.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario2,'Conexion.UltimaCarga.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario2,'Conexion.UltimaDescarga.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario2,'actual.archivos','N/A')}}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario2,'actual.peso','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario2,'mes.archivos','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario2,'mes.peso','N/A')}}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario2,'visualizacion_total','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario2,'visualizacion_mes','N/A')}}</p>
            </div>
          </div>
          <div class="col-3">
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario3,'Conexion.UltimaConexion.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario3,'Conexion.UltimaCarga.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario3,'Conexion.UltimaDescarga.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario3,'actual.archivos','N/A')}}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario3,'actual.peso','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario3,'mes.archivos','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario3,'mes.peso','N/A')}}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario3,'visualizacion_total','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario3,'visualizacion_mes','N/A')}}</p>
            </div>
          </div>
          <div class="col-3">
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario4,'Conexion.UltimaConexion.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario4,'Conexion.UltimaCarga.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario4,'Conexion.UltimaDescarga.created_at','N/A') }}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario4,'actual.archivos','N/A')}}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario4,'actual.peso','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario4,'mes.archivos','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario4,'mes.peso','N/A')}}</p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2"> {{_.get(Usuario4,'visualizacion_total','N/A')}} </p>
            </div>
            <div class="item-comparacion px-3 py-2 text-center">
              <p class="tres-puntos text-muted2">{{_.get(Usuario4,'visualizacion_mes','N/A')}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {mapActions,mapGetters} from 'vuex';
export default {
    data(){
        return{
            selected_usuario1: null,
            selected_usuario2: null,
            selected_usuario3: null,
            selected_usuario4: null,
        }
    },
  mounted(){
    this.ListarUsuarios();
  },
    computed:{
        ...mapGetters({
            listado_usuarios:'usuarios/ListarUsuarios',
            Usuario1:'compararUsuarios/Usuario1',
            Usuario2:'compararUsuarios/Usuario2',
            Usuario3:'compararUsuarios/Usuario3',
            Usuario4:'compararUsuarios/Usuario4',
        })
    },
    methods:{
      ...mapActions({
        ListarUsuarios:'usuarios/ListarUsuarios'
      }),
      Comparar(accion,id){
        let payload={'id':id,'accion':accion}
        this.$store.dispatch('compararUsuarios/Comparar',payload)
      },
      Limpiar(accion){
        this.$store.dispatch('compararUsuarios/LimpiarComparador',accion)
        switch (accion) {
          case 1:
          this.selected_usuario1=null;
          break;
          case 2:
          this.selected_usuario2=null;
          break;
          case 3:
          this.selected_usuario3=null;
          break;
          case 4:
          this.selected_usuario4=null;
          break;
        }
      }
    },

}
</script>

<style lang="scss" scoped>
.section-comparar-usuarios{
  .listado-buscar-usuarios{
    .box-usuario{
      background: #f5f5f5;
      border-radius: 3px;
      position: relative;
      i.mdi-close-circle{
        cursor: pointer;
        font-size: 14px;
        position: absolute;
        top: 2px;
        right: 5px;
        visibility: hidden;
      }
      &:hover{
        i.mdi-close-circle{
          visibility: visible;
        }
      }
    }
  }
  .listado-items{
    .item-comparacion{
      width: 100%;
      i.mdi-login-variant{ color:#00b41e; }
      i.mdi-arrow-collapse-down{ color: #ff5900 }
      i.mdi-arrow-collapse-up{ color:#67beff }
      i.mdi-account{ color:#dbdbdb }
      i.mdi-eye{ color:purple }
      &:nth-child(odd){
        background: #f5f5f5;
      }
      &:nth-child(even){
        background: #fff;
      }
    }
  }
}
</style>
