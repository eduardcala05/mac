<template>
    <section v-loading="loading" class="caja" :style="`background-image:url(${configuracion.fondo}); background-size: cover;background-position:center;`">
        <div class="d-flex justify-content-center align-items-center">
            <div class="col-sm-10 col-md-8 col-lg-8 col-xl-7">
                <validation-observer ref="form-login">
                    <form @submit.prevent="ingresar">
                        <div class="row" style="border-radius:8px; box-shadow: 0 0 30px rgba(0,0,0,0.425); ">
                            <div class="col p-0">
                                <div style="width:100%; height:100%; overflow:hidden; border-top-left-radius:8px; border-bottom-left-radius:8px;">
                                    <img
                                    :src="configuracion.lateral"
                                    class="w-100"
                                    style="object-fit:cover; height:100%;"
                                    alt=""
                                    >
                                </div>
                            </div>
                            <div class="col-sm-12 col-md-6 col-lg-7 caja-2">
                                <div class="row px-4">
                                    <div class="col-12 mt-4">
                                        <div class="d-flex justify-content-center align-items-center" style="height:160px; width:100%;">
                                            <img :src="configuracion.barra" style="object-fit:contain;max-height:160px;max-width:160px;" alt="">
                                        </div>
                                    </div>
                                    <div class="col-12 text-center mb-3">
                                        <h5 class="font-weight-bold mb-0 mt-3">
                                            Bienvenido, inicie sesión
                                        </h5>
                                    </div>
                                    <div class="col-12 form-group">
                                        <label for="identificador" class="mb-0">Identificador</label>
                                        <input id="identificador"
                                        v-model="identificador"
                                        type="text"
                                        class="form-control"
                                        @change="set_configuracion"
                                        />
                                        <vee-error :texto="error_identificador" />
                                    </div>
                                    <div class="col-12 form-group">
                                        <label for="usuario" class="mb-0">Email o usuario</label>
                                        <validation-provider
                                        name="usuario"
                                        :rules="{required:true}"
                                        v-slot="{errors,classes}"
                                        >
                                            <input
                                            id="usuario"
                                            v-model="form.username"
                                            type="text"
                                            class="form-control"
                                            :class="classes"
                                            maxlength="255"
                                            >
                                            <vee-error :texto="errors[0]" />
                                        </validation-provider>
                                    </div>
                                    <div class="col-12 form-group">
                                        <label for="contrasena" class="mb-0">Contraseña</label>
                                        <validation-provider
                                        name="contraseña"
                                        :rules="{required:true}"
                                        v-slot="{errors,classes}"
                                        >
                                            <el-input
                                            id="contrasena"
                                            show-password
                                            v-model="form.password"
                                            :class="classes"
                                            maxlength="255"
                                            />
                                            <vee-error :texto="errors[0]" />
                                        </validation-provider>
                                    </div>
                                    <div class="col-12 form-group">
                                        <button
                                        type="submit"
                                        class="btn btn-block btn-ingresar border"
                                        :style="`background: ${this.configuracion.color}; color: ${textColor(this.configuracion.color)}; `"
                                        >
                                            Ingresar
                                        </button>
                                    </div>
                                    <div class="col-12 mb-3">
                                        <div style="height:50px; width:100%; display:flex;">
                                            <img src="/img/azul.png" alt="" class="w-100" style="object-fit: contain;">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </validation-observer>
            </div>
        </div>
    </section>
</template>

<script>
import Param from '../../services/param'
import Auth from '../../services/auth'
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
    middleware: 'guest',
    data(){
        return {
            configuracion: {
                fondo:'/img/login/fondo.png',
                lateral:'/img/login/lateral.png',
                barra:'/img/azul.png',
                color:'#fb0404'
            },
            form:{
                username: '',
                password: ''
            },
            identificador:'',
            error_identificador:'',
            color: '',
            loading:false
        }
    },
    computed:{

    },
    created(){
        // this.fetchConfiguracion()
    },
    mounted() {
        // Param.getParam().then( ({data}) => {
        //     // console.log(data);
        //     this.configuracion = data
        //
        // })
    },
    methods:{
        textColor(c){
            if (c=='#fff' || c=='#f5f5f5') {
                return '#5d5d5d'
            }else{
                return '#ffffff'
            }
        },
        async fetchConfiguracion(){
            try {
                window.api.send('toConfiguracionGet')
                window.api.receive('fromConfiguracionGet',async(response)=>{
                    console.log(`response: `,response);
                    // if(!response.id){
                        console.log('no hay data');
                        const {data} = await Param.getParam()
                        window.api.send('toConfiguracionInsert',data)
                        console.log(data);
                        this.configuracion = data
                    // }
                    this.configuracion = response
                })
                /*
                console.log(777,data);
                const imagenes = []
                imagenes.push(data.barra)
                imagenes.push(data.fondo)
                imagenes.push(data.lateral)
                imagenes.push(data.modal)
                //console.log(888,imagenes);

                //window.api.imagenesDescargar(imagenes)
                */
            } catch (error) {
                console.error(error.response)
            }
        },
        set_configuracion(){
            // console.log(nit,'escrito');
            this.$store.commit('auth/SAVE_CLIENTE',this.identificador)
            this.$nextTick(() => {
                Param.getParam(this.identificador).then( ({data}) => {
                    // console.log(data);
                    // console.log(data,'parameros');
                    if(data.error){
                        this.error_identificador = "Identificacion Incorrecta"
                        return
                    }else{
                        axios.defaults.headers['Cliente'] = this.identificador
                        this.error_identificador = ""
                    }
                    this.configuracion = data

                })
            })
        },
        async ingresar(){
            try {
                // if(this.error_identificador !== '' || this.identificador === ''){
                //     this.error_identificador = "Identificacion Incorrecta"
                //     return
                // }
                const esValido = await this.$refs['form-login'].validate()
                console.log(esValido);
                if(!esValido) return
                this.loading = true
                window.api.send('toCredencialesInsert',this.form)



                const {data} = await Auth.login(this.form)
                // console.log(777,data);
                window.api.send('toTokenRefresh',data)

                // Save the token.
                this.$store.dispatch('auth/saveToken', {
                    token: data.token,
                    remember: this.remember
                })
                window.api.send('toClienteInsert',this.identificador)

                window.api.send('toTokenInsert',data)

                // Fetch the user.
                await this.$store.dispatch('auth/fetchUser')

                window.api.send('toMacExiste')

                // Redirect home.
                this.$router.push({ name: 'home.mi-unidad' })
            } catch (e) {
                console.error(e);
            } finally {
                this.loading = false
            }

        }
    }
}
</script>

<style lang="scss" scoped>
.btn-ingresar:hover{
    box-shadow: 0 1px 3px 0 #00000030;
}
.caja{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-image: url(/img/login/fondo.png);
}
.caja-2{
    background: white;
    // background-image: url(/img/login/fondo.png);
    background-position:center;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
}
</style>
