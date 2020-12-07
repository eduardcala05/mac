<template>
    <div class="d-flex justify-content-center align-items-center flex-column h-100">
        <div style="height:200px; width: 200px;">
            <svg id="Capa_1" enable-background="new 0 0 419.886 419.886"  viewBox="0 0 419.886 419.886" xmlns="http://www.w3.org/2000/svg"><g><path d="m40.261 382.498h339.375v18.827h-339.375z" fill="#eeefee"/><path d="m200.535 272.439h18.827v125.992h-18.827z" fill="#eeefee"/><path d="m373.344 40.927h-191.621c-6.383.004-12.484-2.633-16.855-7.285l-24.696-26.357c-4.371-4.652-10.472-7.289-16.855-7.285h-80.47c-12.763 0-23.11 10.347-23.11 23.11v266.382c0 12.777 10.358 23.136 23.136 23.136h330.471c12.777 0 23.136-10.358 23.136-23.136v-225.455c0-12.763-10.347-23.11-23.11-23.11-.008 0-.017 0-.026 0z" fill="#eaa14e"/><path d="m391.037 86.688h-209.34c-6.373.004-12.46 2.641-16.824 7.285l-24.707 26.232c-4.364 4.644-10.451 7.28-16.824 7.285h-94.482c-12.763.002-23.108 10.35-23.106 23.113 0 .699.032 1.398.095 2.094l11.968 138.939c1.087 11.912 11.075 21.032 23.037 21.033h334.478c11.962-.002 21.95-9.121 23.037-21.033l15.668-179.756c1.15-12.711-8.223-23.948-20.934-25.097-.687-.063-1.376-.094-2.066-.095z" fill="#f6b863"/><path d="m192.381 363.936h35.135c5.748 0 10.407 4.66 10.407 10.407v35.135c0 5.748-4.66 10.407-10.407 10.407h-35.135c-5.748 0-10.407-4.66-10.407-10.407v-35.135c-.001-5.747 4.659-10.407 10.407-10.407z" fill="#2cbfae"/></g></svg>
        </div>
        <div>
            <h1 class="font-weight-bold">
                Este equipo no está registrado
            </h1>
            <div class="d-flex w-100 justify-content-center mt-2 mb-3">
                <button 
                type="button" 
                class="btn btn-primary" 
                @click="refrescar"
                >
                    Refrescar
                </button>
            </div>

        </div>
        <div>
            Informa sobre este código a tu supervisor
        </div>
        <div class="mt-3">
            <h4 class="border p-2 rounded-pill">
                <span>
                {{mac}}
                </span>
                <span 
                style="cursor:pointer;"
                @click="copiar"
                title="Copiar al portapeles"
                >
                    <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                    </svg>
                </span>
            </h4>
            
        </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
    computed:{
        ...mapGetters({
            mac: 'app/getMac'
        })
    },
    created(){
        window.api.send('toHddSerialGet')
    },
    methods:{
        refrescar(){
            console.log('refrescando...');
            window.api.send('toMacExiste')
        },
        copiar(){
            console.log('copiando...');
            window.api.send('toCopy',this.mac)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
