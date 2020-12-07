<template>
    <div :class="clase" :id="id" :style="`width:${width}; height:${height}`"> </div>

</template>

<script>
import echarts from 'echarts'
// window.echarts = echarts
  export default {
    name: 'Echarts',
    props:{
      options:[Object],
      id:{
        type:String,
        default:'ECharts'
      },
      clase:{
        type:String,
        default:''
      },
      width:{
        type:String,
        default:'auto'
      },
      height:{
        type:String,
        default:'300px'
      },
      init:{
        type:Boolean,
        default:false
      }
    },
    data(){
      return{
        instance:null
      }
    },
    watch:{
      options: {
        handler(val){
          this.instance.setOption(val);
        },
        deep: true
      }
    },
    methods: {
    handleResize() {
      this.instance.resize();
    },
    setOption(val){
      this.instance.setOption(val);

    }
  },
    mounted(){
      var dom = document.getElementById(this.id);
      this.instance = echarts.init(dom);
      if(this.init) this.instance.setOption(this.options);
      window.addEventListener('resize', this.handleResize)
    }
  }
</script>

<style scoped>

</style>
