<template>
    <modal ref="modalListarIconos" titulo="Seleccioanr iconos" tamano="md">
        <div class="row mx-0">
            <div v-for="(data, key) in iconos" :key="key" class="cr-pointer m-2" @click="$emit('select', data.css)">
                <i :class="`f-25 m-2 icon-${data.css}`" />
            </div>
        </div>
    </modal>
</template>

<script>
import Icons from '../../../services/iconos'
export default {
    data(){
        return {
            iconos: []
        }
    },
    methods: {
        async toggle(){
            if (this.iconos.length === 0){
                const { data } = await Icons.getAll()
                this.iconos = data.glyphs
            }
            this.$refs.modalListarIconos.toggle()
        },
        close(){
            this.$refs.modalListarIconos.toggle()
        }
    }
}
</script>
