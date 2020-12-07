<template>
  <section class="modalCalificacionUsuario">
    <modal-right ref="calificacionUsuario" titulo="Calificaciones" tamano="modal-xl" icono="mdi mdi-folder">
      <template v-slot:modalbody>
        <div class="row">
          <div class="col-12 text-center">
            <p class="d-flex align-items-center justify-content-center text-muted2 f-13"> Calificación promedio
              <span class="ml-2 f-600" style="color:#f7ba2a">{{CalificacionPromedio}}</span>
              <i class="mdi mdi-star f-19 cr-pointer"></i>
            </p>
          </div>
        </div>
        <div class="row listado-comentarios mt-2">
          <div v-for="(data,index) in Comentarios" :key="index" class="col-12 my-2">
            <div class="d-flex flex-row bg-whitesmoke br-3">
              <div class="p-2">
                <i v-if="_.get(data,'archivos.extension')==1" class="mdi mdi-file-pdf-box f-20"></i>
                <i v-if="_.get(data,'archivos.extension')==2" class="mdi mdi-image-outline f-18 mr-1" style="color:green"/>
                <i v-if="_.get(data,'archivos.extension')==3" class="mdi mdi-youtube f-18 mr-1 " style="color: blue;"/>
                <i v-if="_.get(data,'archivos.extension')==4" class="mdi mdi-file-powerpoint f-18 mr-1" style="color: darkorange;"/>
              </div>
              <div class="p-2 flex-fill">
                <p class="f-600 f-12 text-muted2 mb-1">{{_.get(data,'archivos.nombre')}}</p>
                <p class="align-items-center d-flex f-12 justify-content-between text-muted"> {{_.get(data,'created_at') | helper-fecha('LLLL')}}
                  <span class="text-info2 float-right cr-pointer">
                    <el-rate disabled v-model="_.get(data,'calificacion')"></el-rate>
                  </span>
                </p>
                <p>
                  {{_.get(data,'comentario')}}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </modal-right>
  </section>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    data(){
        return{
            calificacion: 5,
            id_usuario:this.$route.params.id,
        }
    },
    computed:{
        ...mapGetters({
            Comentarios:'VerUsuario/CalificacionesComentarios',
            CalificacionPromedio:'VerUsuario/CalificacionPromedio',
        })
    },
    methods:{
        toggle(){
            this.$refs.calificacionUsuario.toggle();
        },
        calificacionesUsuario(){
            this.$store.dispatch('VerUsuario/calificacionesUsuario',this.id_usuario);
        }
    },
    mounted(){
      this.calificacionesUsuario();
    },
}
</script>

<style lang="scss" >
.modalCalificacionUsuario{
  @media  screen and (max-width: 1366px) {
    .listado-comentarios{
      height: 55vh !important;
    }
  }
  .listado-comentarios{
    height: 81vh;
    overflow: scroll;
    overflow-x: hidden;
    i.mdi.mdi-close-circle {
      position: absolute;
      right: 21px;
      top: 2px;
    }
    p.descripcion-contenido{
      max-height: 54px;
      overflow: hidden;
    }
  }
}
</style>
