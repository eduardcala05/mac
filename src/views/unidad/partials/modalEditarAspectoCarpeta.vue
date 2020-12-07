<template>
    <section>
        <modal ref="modalAspectoCarpeta" titulo="Editar Aspecto Carpeta" tamano="md">
            <div class="row mx-0">
                <button type="button" name="button" @click="openModalIconos">Seleccionar icono</button>
            </div>
            <div class="row mx-0">
                <i class="f-30" :class="`icon-${icon}`" :style="`color:${color}`" ></i>
                <el-color-picker v-model="color"></el-color-picker>
            </div>
            <template slot="footer">
                <el-button type="info" @click="guardar_aspecto">Aceptar</el-button>
            </template>
        </modal>

        <modalIconos ref="modalIconos" @select="setIcono"/>
    </section>
</template>

<script>
import axios from 'axios'
export default {
    components:{
        modalIconos: ()=>import('./modalIconos')
    },
    data() {
        return {
            color: '#409EFF',
            icon:null
        }
    },
    methods:{
        toggle(){
            this.$refs.modalAspectoCarpeta.toggle()
        },
        async guardar_aspecto(){
            try {
                let model = {
                    icono: this.icon,
                    color:this.color,

                }
                const {data} = await axios(`/carpetas/aspecto`)
            } catch (e) {

            } finally {

            }
        },
        openModalIconos(){
            this.$refs.modalIconos.toggle()
        },
        setIcono(icon){
            this.$refs.modalIconos.close()
            this.icon = icon
        }
    }
}
</script>

<style lang="css" scoped>
</style>
