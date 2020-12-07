<template>
    <section class="modalComentarios">
        <modal-right ref="ComentariosArchivos" titulo="Comentarios" tamano="modal-xl" icono="mdi mdi-folder">
            <template v-slot:modalbody>
                <div class="row justify-content-center mx-0">
                    <div class="col-12">
                        <el-input v-model="text" type="textarea" :rows="4" show-word-limit maxlength="350" />
                    </div>
                    <div class="col-11 text-right mt-2">
                        <button class="btn btn-sm  bg-secondary text-white br-4" @click="agregar">
                            Comentar
                        </button>
                    </div>
                </div>
                <div class="row listado-comentarios mt-2 custom-scroll">
                    <div class="h-100 w-100">
                        <div v-for="(data,index) in comentarios" :key="index" class="col-12 my-2">
                            <div class="d-flex flex-row bg-whitesmoke br-3">
                                <div class="p-2">
                                    <img :src="data.usuario.photo_url" class="rounder-circle" style="width:46px; height:46px">
                                </div>
                                <div class="p-2 flex-fill">
                                    <p class="f-600 f-12 text-muted2 mb-1">{{_.get(data,'usuario.nombre')}}</p>
                                    <p class="f-12" v-html="formatoHtml(_.get(data,'comentario'))">
                                        <!-- {{_.get(data,'comentario')}} -->
                                    </p>
                                    <p class="align-items-center d-flex f-12 justify-content-between text-muted">
                                        {{_.get(data,'created_at') | helper-fecha('DD MMM YYYY hh:mm a')}}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </modal-right>
    </section>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return{
            id:null,
            text:'',
            comentarios:[]
        }
    },
    methods:{
        toggle(id){
            this.id  = id
            this.$refs.ComentariosArchivos.toggle();
            this.loadComentarios()
        },
        async loadComentarios(){
            try {
                const {data} = await axios(`/comentarios/${this.id}/listar`)
                this.comentarios = data

            } catch (e){
                console.error(e)
            }
        },
        async agregar(){
            try {
                if(this.text === '') return

                const {data} = await axios.post(`comentarios/${this.id}/agregar`,{text:this.text})
                this.text = ''
                this.loadComentarios()

            } catch (e) {
                console.error(e)
            }
        },
        formatoHtml(texto){
            if (texto) return texto.replace(/\n/gi, '<br/>')
            return ''

        }
    },

}
</script>

<style lang="scss" scope>
.modalComentarios{
    .listado-comentarios{
        height: calc(100vh - 268px);
        overflow: auto;
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
