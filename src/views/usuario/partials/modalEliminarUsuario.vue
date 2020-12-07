<template>
  <section class="modalEliminarUsuario">
    <modal ref="eliminarUsuario" titulo="Eliminar usuario" tamano="md"  >
      <div class="container">
        <p class="f-12 text-muted2 w-100 text-center py-3">¿Está seguro que quiere eliminar el usuario " {{nombre}} "?</p>
      </div>

       <template slot="footer">
        <el-button type="info" @click="eliminar">Aceptar</el-button>
      </template>
  </modal>
</section>
</template>

<script>
export default {
  data(){
    return{
        id:null,
        nombre:null
    }
  },
  mounted(){

  },
  methods:{
    toggle(nombre,id){
        this.nombre=nombre;
        this.id=id;
        this.$refs.eliminarUsuario.toggle();
    },
    eliminar(){
        this.$store.dispatch('usuarios/EliminarUsuario',this.id).then(({data})=>{
          this.notificacion('Usuario',data.mensaje,data.tipo);
          this.$emit('listar_usuarios');
          this.$refs.eliminarUsuario.toggle();
          this.$router.push({name:"usuarios.listar.principal"});
        }).catch((error)=>{
            console.log('EliminarUsuario error:',error);
        })
    }
  }
}
</script>

<style lang="scss" >
.modalEliminarUsuario{

}
</style>
