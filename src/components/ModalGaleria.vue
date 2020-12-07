<template>
    <modal :ref="id" v-loading="loading" :titulo="titulo" tamano="xl" @closeModal="close">
        <div class="container modal-cambiar-logo">
            <el-tabs type="" >
                <!-- subir imagen -->
                <el-tab-pane label="Subir imagen" >
                    <div class="row mx-0 justify-content-center mb-1">
                        <small>{{mensaje}}</small>
                    </div>
                    <div @click="loadImg">
                        <vue-cutter
                        v-if="open"
                        ref="cutter"
                        class="mx-auto no-imagen border bg-whitesmoke br-5 cr-pointer"
                        mode="contain"
                        :fixed="size[0]>0?size:null"
                        outputType="png"
                        :container-bounding="options.bounding"
                        :cropBoxBounding="size[0]>0?size[0]+'px '+ size[1]+'px':'200px 200px'"
                        :src="options.src"
                        >
                            <p slot="content">Subir imagen</p>
                        </vue-cutter>
                    </div>
                </el-tab-pane>
                <!-- galeria -->
                <el-tab-pane label="Galería" style="height: 250px; overflow-y: auto; overflow-x: hidden;">
                    <div class="row justify-content-center">
                        <div v-for="(data,index) in Galeria" :key="index"
                        class="logo-galeria mx-3 my-3">
                        <i class="mdi mdi-close-circle" />
                        <i class="mdi mdi-check-circle" />
                        <div class="cont-logo" @click="seleccionar(data)" :class="{'active':data.id === select.id}">
                            <!-- <el-avatar shape="square" :size="100" :src="data.imagen_url" fit="contain" class="logo-empresa"/> -->
                            <img class="obj-cover" style="width:100px; height:100px" :src="data.imagen_url" alt="" />
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="slim" ref="my-cropper">
            <input type="file"/>
        </div>
    </div>
    <template slot="footer">
        <el-button type="info" @click="accion_guardar">Aceptar</el-button>
    </template>
</modal>
</template>
<script>
import axios from 'axios'
import { VueCutter } from 'vue-cutter'
export default {
    components: { VueCutter },
    name: "ModalGaleria",
    props: {
        id: {
            type: String,
            default: 'ModalGaleria'
        },
        titulo: {
            type: String,
            default: 'Modal'
        },
        value: {
            type: ['String', 'Number']
        }
    },
    data() {
        return {
            tipo:null,
            mensaje: '',
            size:[],
            add: true,
            Galeria: [],
            select: {
                id:null
            },
            api:false,
            slimOptions: {},
            ImageEditor: null,
            options: {
                bounding: '',
                src: '',
            },
            loaded: null,
            open:false,
            loading:false
        }
    },
    methods: {
        loadImg(){
            if (this.add){
                this.$refs.cutter.addLocalImage()
                this.add = false
            }
        },
        async agregar_nueva(){
            try {
                let img = null
                this.loading = true
                let that = this
                let promise = await new Promise(function(resolve, reject) {
                    that.$refs.cutter.getBase64Data(data => {
                        img = data ? data : null
                    })
                    setTimeout(() => resolve(), 1000);
                });
                // console.log(img, 'salio');
                if(img === null) return

                let model = {
                    id:null,
                    imagen: img
                }

                const {data} = await axios.post(`configuracion/galeria-guardar/${this.tipo}`,model)
                this.notificacion('Imagen','Actualizada','success')
                this.$emit('save',data)
                this.open = false
                this.$refs[this.id].toggle();

            } catch (e) {
                console.error(e)
            } finally{
              this.loading = false
            }
        },
        async toggle(tipo = false, api = false, size = []) {
            this.api = api
            this.tipo = tipo
            this.size = size
            this.add = true
            this.options = {
                bounding: '400px 250px',
                src: '',
            }
            this.open = true
            this.getGaleria()
            this.$refs[this.id].toggle();
            if (tipo==2){
                this.mensaje= 'Imagen lateral (340px * 600px) '
            }else if(tipo==1){
                this.mensaje= 'Imagen fondo (1330px * 615px) '
            }
        },
        close(){
            this.open = false
        },
        async getGaleria() {
            try {
                if (this.tipo){
                    this.Galeria = []
                    const {data} = await axios(`configuracion/galeria-lista/${this.tipo}`)
                    this.Galeria = data
                }

            } catch (e) {
                console.error(e)
            }
        },
        accion_guardar(){
            if(this.select.id === null){
                this.agregar_nueva()
            }else{
                this.actualizar()
            }
        },
        async actualizar() {
            try {
                if (this.tipo){
                    this.loading = true
                    let {data} = await axios.post(`${this.api}/${this.tipo}` ,this.select)
                    if(data){
                        this.$emit('save',data)
                        this.notificacion('Imagen','Actualizada','success')
                        this.select = {id:null}
                        this.tipo = null
                        this.open = false
                        this.$refs[this.id].toggle();

                    }
                }
            } catch (e) {
                console.error(e)
            } finally{
              this.loading = false
            }
        },
        seleccionar(item) {
            this.select = item
        }
    }

}
</script>

<style lang="scss" scoped>
.logo-galeria{
    position:relative;
    vertical-align: middle;
    display: table-cell;
    text-align: center;
    cursor: pointer;
    /*max-width: 180px;*/
    /*min-width: 180px;*/
    /*height: 120px;*/
    // background: #f5f5f5;
    border:1px solid #dbdbdb;
    border-radius: 3px;
    i.mdi-check-circle{
        position: absolute;
        top: -1px;
        right: 2px;
        color: #00B41E;
        font-size: 20px;
        visibility: hidden;
    }
    .active{
        /*border: 3px solid #5D5D5D;*/
        border: 3px solid #22e62b !important;
        i.mdi-check-circle{
            visibility: visible;
        }
        i.mdi-close-circle{
            visibility: hidden !important;
        }
    }
    i.mdi-close-circle{
        color:#979797;
        position: absolute;
        top: -12px;
        right: -8px;
        visibility: hidden;
    }
    &:hover{
        i.mdi-close-circle{
            cursor: pointer;
            visibility: visible;
        }
    }
}

/*.active {*/
/*    border: 1px solid #22e62b !important*/
/*}*/
</style>
