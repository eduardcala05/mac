<template>
    <section class="config-login">
        <div class="container-fluid full-screen w-100 px-0 login-mega d-middle-center"  :style="`background-image:url(${fondo})`">
            <!-- <img :src="fondo" alt="" class="img-full full-screen"> -->
            <button  @click="EditarBgFull" type="button" class="slim-btn slim-btn-edit editar-bg" name="button"></button>
            <div class="row justify-content-center align-items-center w-100 mx-0" style="height:375px;">
                <div class="col-md-8 col-xl-7 px-0 col-sm-10 col-11 h-100 m-auto" style="border-radius:8px; box-shadow: 0 0 30px rgba(0,0,0,0.425);">
                    <div class="bg-card-login position-relative h-100">
                        <img src="/img/login/Logos pie.svg" alt="" class="created-gbp">
                        <div class="align-items-center h-100 row mx-0 bg-white br-10">
                            <div class="col d-sm-none d-md-block h-100 px-0 contenedor-imgLeft" style="position:relative; object-fit:cover;">
                                <img :src="lateral" alt="" class="bg-img-left">
                                <button  @click="EditarBgLeft" type="button" class="slim-btn slim-btn-edit editar-bg-left" name="button"></button>
                            </div>
                            <div class="col-lg-7 col-md-7 col-sm-12 formulario bg-white h-100 pl-0 position-relative">
                                <div class="align-items-center h-100 row w-100 justify-content-around">
                                    <div class="col-lg-12 col-md-12 col-sm-10 col-10">
                                        <div class="row justify-content-center mb-3">
                                            <div class="col-lg-9 col-md-12 text-center">
                                                <img :src="barra" style="object-fit:contain;height:100px;" alt="">
                                                <!-- <p class="mb-3 f-600 f-17" style="color:#5D5D5D">{{ $t('bienvenido_login') }}</p> -->
                                            </div>
                                        </div>
                                        <form class="full-screen2">
                                            <!-- NIT -->
                                            <div class="row justify-content-center my-2">
                                                <div class="col-lg-9 col-md-12 col-sm-12">
                                                    <!-- <img src="/img/login/nit.svg" alt="" width="21" class="mr-3"> -->
                                                    <label for="" class="f-10 ml-2">NIT.</label>
                                                    <input class="form-control br-5" type="text" disabled name="Nit">
                                                </div>
                                            </div>
                                            <!-- Email -->
                                            <div class="row justify-content-center my-2">
                                                <div class="col-lg-9 col-md-12 col-sm-12">
                                                    <!-- <img src="/img/login/login.svg" alt="" class="mr-3">
                                                    <i class="icon-login f-22" /> -->
                                                    <label for="" class="f-10 ml-2">Email o usuario</label>
                                                    <input class="form-control br-5" type="text" disabled name="email" autocomplete="off">
                                                </div>
                                            </div>
                                            <!-- Password -->
                                            <div class="row justify-content-center my-2">
                                                <div class="col-lg-9 col-md-12 col-sm-12">
                                                    <!-- <img src="/img/login/password.svg" alt="" class="mr-3">
                                                    <i class="icon-password f-22" /> -->
                                                    <label for="" class="f-10 ml-2">Contraseña</label>
                                                    <input class="form-control br-5" type="text" disabled name="password" autocomplete="off">
                                                </div>
                                            </div>
                                            <div class="row justify-content-center my-2 mt-3">
                                                <div class="d-flex">
                                                    <button
                                                    disabled
                                                    class="btn-ingresar border br-5 py-1 px-5" 
                                                    :style="`background: ${color};color: ${textColor(color)};`">
                                                        Ingresar
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <modal-galeria :titulo="tituloModalGaleria" ref="galeria" @save="guardarImagen"/>

    </section>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "estiloInicio",
        data(){
            return{
                tituloModalGaleria:'',
                sizeBar: [68, 118],
                sizeBack: [266, 123],
            }
        },
        computed:{
            ...mapGetters({
                lateral:'configurar/lateral',
                fondo:'configurar/fondo',
                barra:'configurar/barra',
                color:'configurar/color'
            })
        },
        methods:{
            textColor(c){
                if (c=='#fff' || c=='#f5f5f5') {
                    return '#5d5d5d'
                }else{
                    return '#ffffff'
                }
            },
            guardarImagen(data){
                this.$store.dispatch('configurar/getConfig')
            },
            EditarBgLeft(){
                this.tituloModalGaleria = "Cambio lateral  login"
                this.$refs.galeria.toggle(2,'configuracion/interface/actualiza-imagen',this.sizeBar)
            },
            EditarBgFull(){
                this.tituloModalGaleria = "Cambio Fondo login"
                this.$refs.galeria.toggle(1,'configuracion/interface/actualiza-imagen',this.sizeBack)
            },
        },
    }
</script>
<style lang="scss">
    .config-login{
        .editar-bg{
            position: absolute;
            left: 10px;
            top: 15px;
        }
        .editar-bg-left{
            position: absolute;
            bottom: 12px;
            right: 47%;
            padding: 0;
            margin: 0 7.2px;
            font-size: 0;
            outline: none;
            width: 36px;
            height: 36px;
            border: none;
            color: #fff;
            background-color: rgba(0,0,0,.7);
            background-repeat: no-repeat;
            background-size: 50% 50%;
            background-position: 50%;
            border-radius: 50%;
            background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 269 269' xmlns='http://www.w3.org/2000/svg' fill-rule='evenodd' clip-rule='evenodd' stroke-linejoin='round' stroke-miterlimit='1.414'%3E%3Cpath d='M161.36 56.337c-7.042-7.05-18.46-7.05-25.5 0l-6.373 6.38-89.243 89.338.023.023-2.812 2.82s-8.968 9.032-29.216 74.4c-.143.456-.284.91-.427 1.373-.36 1.172-.726 2.362-1.094 3.568-.327 1.066-.657 2.154-.988 3.25-.28.922-.556 1.835-.84 2.778-.64 2.14-1.29 4.318-1.954 6.567-1.455 4.937-5.01 16.07-.99 20.1 3.87 3.882 15.12.467 20.043-.993 2.233-.662 4.396-1.31 6.52-1.952.98-.296 1.932-.586 2.89-.878 1.032-.314 2.058-.626 3.063-.935 1.27-.39 2.52-.775 3.75-1.157l1.09-.34c62.193-19.365 73.358-28.453 74.286-29.284l.01-.01.067-.06 2.88-2.886.192.193 89.244-89.336 6.373-6.382c7.04-7.048 7.04-18.476 0-25.525l-50.998-51.05zM103.4 219.782c-.08.053-.185.122-.297.193l-.21.133c-.076.047-.158.098-.245.15l-.243.148c-2.97 1.777-11.682 6.362-32.828 14.017-2.47.894-5.162 1.842-7.98 2.82l-30.06-30.092c.98-2.84 1.928-5.55 2.825-8.04 7.638-21.235 12.22-29.974 13.986-32.94l.12-.2c.063-.1.12-.196.175-.283l.126-.2c.07-.11.14-.217.192-.296l2.2-2.205 54.485 54.542-2.248 2.255zM263.35 56.337l-50.996-51.05c-7.04-7.048-18.456-7.048-25.498 0L174.108 18.05c-7.04 7.048-7.04 18.476 0 25.524l50.996 51.05c7.04 7.048 18.457 7.048 25.498 0l12.75-12.762c7.04-7.05 7.04-18.477 0-25.525z' fill='%23fff'/%3E%3C/svg%3E")
        }

        @media only screen  and (max-width: 576px) {
            .contenedor-imgLeft{
                display: none;
            }
        }
        .login-mega{
            background-size: cover;
            position: relative;
            // background-image: url(/img/login/fondo.png);
            &.container-fluid.full-screen {
                background-position: center;
                background-size: cover;
                background-repeat: no-repeat;
                // background-image: url('/img/login/bg-full.png') !important;
            }
            &.full-screen {
                width: 100vw;
                height: calc(100vh - 180px);
            }
            .img-full{
                position: absolute;
                width: 100%;
                // left: 0;
            }
            img.bg-img-left {
                object-fit: cover;
                width: 100%;
                height: 100%;
                border-bottom-left-radius: 10px;
                border-top-left-radius: 10px;
            }
            .bg-card-login{
                height: 500px;
                max-width: 990px;
                border-radius: 10px;
                margin-left: auto;
                margin-right: auto;
                box-shadow: 1px 0px 10px rgba(0, 0, 0, 0.50);
                .btn-ingresar{
                    background: #1C1C1C;
                    color:#fff;
                    font-size: 13px;
                }
            }
            .formulario{
                label.lbl-input-login {
                    font-size: 10px;
                    margin-bottom: 0px;
                    position: absolute;
                    top: -18px;
                    left: 65px;
                }
                img.bg-top {
                    position: absolute;
                    width: 100%;
                    height: 50%;
                    top: 0px;
                }
                img.bg-bottom {
                    position: absolute;
                    width: 97%;
                    height: 50%;
                    bottom: 0px;
                    border-bottom-right-radius: 10px;
                }
            }
        }
        .card-body {
            padding: 0px !important;
        }

        .justify-content-center {
            justify-content: center !important;
        }
        .align-items-center {
            align-items: center !important;
        }

        .created-gbp{
            position: absolute;
            right: 46px;
            bottom: 16px;
        }

    }
</style>
