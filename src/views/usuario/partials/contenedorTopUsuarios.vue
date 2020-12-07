<template>
  <div class="row contenedor-top">
    <div class="col-12  d-flex my-auto">
      <input type="search" name="" value="" :placeholder="`${$t('label_search')}`" class="form-control br-4" style="max-width:345px">
      <button @click="" type="button" name="button" class="btn br-4 btn-sm py-0 border px-1 ml-auto position-relative active" data-toggle="tooltip" data-placement="left" title="Comparar usuarios">
        <i class="mdi mdi-account-switch cr-pointer f-19 mx-1"></i>
      </button>
      <button @click="CrearUsuario" type="button" name="button" class="btn br-4 btn-sm py-0 border px-1 mx-1 active">
        <i class="mdi mdi-account-plus cr-pointer f-19 mx-1 "></i>
      </button>
    </div>
    <modal-crear-usuario ref="CrearUsuario" />
  </div>
</template>

<script>
import modalCrearUsuario from './modalCrearUsuario';
export default {
  data(){
    return{

    }
  },
  components:{
    modalCrearUsuario,
  },
  mounted(){
    
  },
  methods:{
    CrearUsuario(){
      this.$refs.CrearUsuario.toggle();
    },
  }
}
</script>

<style lang="scss" scoped>
.contenedor-top{
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  padding: 13px 0px;
  button{
    color: #dbdbdb;
    &.active{
      color:#5d5d5d !important;
    }
  }
}
</style>
