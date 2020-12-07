<template>
  <div id="app" style="height:100vh; overflow:hidden;">
    <router-view/>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {messageBus} from './main.js'
export default {
    metaInfo:()=>({title: 'Mega Archivo | Grupo Bien Pensado'}),
    mounted(){
        console.log('-> mounted app vue');
        this.$nextTick(()=>{
            messageBus.$on('fromInternetStatus',(evt)=>{
                console.log('estado del internet: ',evt)
            })
        })
    },
    methods:{
        hanldleSincronizar(){
            window.api.send('toArchivosSyncCloud')
        }
    },
    destroyed(){
        messageBus.$off('fromInternetStatus')
    }
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

#app {
  font-family: 'Montserrat', sans-serif;
}
.sincronizar{
    position: fixed;
    top: 10px;
    right: 10px;
    cursor: pointer;
}
p{
    margin-bottom: 0px!important;
}
</style>
