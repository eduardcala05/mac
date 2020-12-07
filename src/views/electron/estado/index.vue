<template>
    <section class="montserrat">
        <div class="p-2 text-titulo">
            <img class="logo-mega" src="/img/init.png" alt="" />
            <p>Ventana de estado de la sincronización </p>
            <div class="" style="width:20px;height:20px;position:relative">
                <div :class="`cloud ${sincronizado?'end':''}`"></div>
                <div v-if="sincronizando" class="arrow-container">
                    <!-- <i class="icono-arrow1-up"></i> -->
                    <img class="cloud-play" src="/img/sincro/arrow-up-thick.svg" alt="" />
                </div>
                <img v-if="sincronizado" class="check-bold" width="15" src="/img/sincro/check-bold.svg" alt="" />
            </div>
        </div>
        <template v-for="(file,k) in files">
            <div :key="k" style="padding: 3px 15px;border-bottom:1px solid #a4a4a4;">
                <div
                v-if="visible"
                style="width:100%; display:flex; justify-content: flex-start; align-items: center;margin-top:6px;"
                >
                    <div class="cont-carga">
                        <!-- <img
                        src="img/gif/carga_puntos.gif"
                        alt=""
                        style="margin-right: 5px; border-right: 1px solid #eee;"
                        > -->
                        <img width="30" :src="`/img/sincro/${typeFile(file.ext)}.svg`" alt="" />
                    </div>
                    <div style="padding-left: 0px;width:100%;color: #424242;">
                        <div>{{file.nombre}}</div>
                        <div class="cont-datos">
                            {{(file.loaded / 1024 /1024 || 0).toFixed(2) }} Mb / {{((file.peso / 1024) || 0).toFixed(2)}}Mb
                            <span v-if="file.progreso<100">{{file.progreso || 0}}%</span>
                            <img v-else width="20" src="/img/sincro/cloud-check.svg" alt="" />
                        </div>
                    </div>
                </div>
                <div v-if="visible" class="br-20 bg-bar" style="width:100%;">
                    <!-- <div class="bar-progress" :style="{width: `${file.progreso}%`}" /> -->
                    <div class="bar-progress" :style="`-webkit-mask-image: radial-gradient(circle at 0 0, transparent 0, transparent ${file.progreso}vw, black 21px);`" />
                </div>
            </div>
        </template>
        <div style="padding: 15px;">
            <h4 style="font-weight: bold;">
                Sincronizando unidades total de  archivos: {{unidades.length}}
            </h4>

        </div>
        <template v-for="(file,k) in unidades">
            <span :key="k" >
                <div
                v-if="unidadesVisible"
                style="width:100%; display:flex; justify-content: flex-start; align-items: center;"
                >
                    <div >
                        <img
                        src="img/gira.gif"
                        alt=""
                        style="wdith:100%; margin-right: 5px; border-right: 1px solid #eee;"
                        >
                    </div>
                    <div style="padding-left: 0px;">
                        <div>{{file.nombre}}</div>
                        <div>
                            <span>{{file.progreso || 0}}%</span>
                            {{(file.loaded / 1024 /1024 || 0).toFixed(2) }} Mb / {{((file.peso / 1024) || 0).toFixed(2)}}Mb</div>
                    </div>
                </div>
                <div v-if="unidadesVisible" style="width:100%;">
                    <div
                    style="height:8px; background: blue; border-top-right-radius:0px; border-bottom-right-radius: 0px; margin-bottom: 5px;"
                    :style="{width: `${file.progreso}%`}"
                    />
                </div>
            </span>
        </template>

    </section>
</template>

<script>

export default {
    data(){
        return {
            sincronizando: false,
            sincronizado: false,
            visible: true,
            files: [],
            unidades: [],
            unidadesVisible: false,
            /*
            * Old
            */
            progreso: 0,
            archivo: {
                id:null
            }
        }
    },
    mounted(){
        console.log('ventana de estado');

        /*
        * cuando llega un archivo
        * que va iniciar a procesar
        */
        apiEstado.receive('fromArchivoProcesando',(payload)=>{
            console.log(payload);

            this.files.unshift(payload.archivo)

            /*
            * Old 2020-10-27
            */
            this.visible = true
        })

        apiEstado.receive('fromArchivoProcesandoProgreso',(payload)=>{
            this.visible = true
            console.log('fromArchivoProcesandoProgreso',payload);
            const indice = this.files.findIndex(a=>a.ruta_aws === payload.Key)
            if(indice>=0){
                console.log('cambio el pprogreso con el indice',indice);
                this.$set(this.files[indice],'progreso',+payload.porcentaje)
                this.$set(this.files[indice],'loaded',+payload.loaded)
            }
        })

        apiEstado.receive('fromArchivosSyncCloud',estado=>{
            console.log('fromArchivosSyncCloud',estado);
            if(!estado){
                this.files = []
                this.visible = false
            }
        })

        /*
        * administrar las unidades
        */
        apiEstado.receive('fromUnidadesSincronizandoArchivo',(value)=>{
            console.log('archivo',value);
            this.unidades.unshift(value)
        })

        apiEstado.receive('fromUnidadesSincronizandoArchivoProgreso',(value)=>{
            console.log('progresooo',value);
            const indice = this.unidades.findIndex(a=>a.ruta_aws === value.path)
            if(indice > -1){
                console.log('ingreooooooooosooo');
                this.$set(this.unidades[indice],'loaded',value.loaded)
                this.$set(this.unidades[indice],'progreso',value.progreso)
            }
        })

        apiEstado.receive('fromUnidadesSincronizandoAccion',(value)=>{
            this.unidadesVisible = Boolean(value)
        })

    },
    methods: {
        typeFile(ext){
            switch (ext) {
                case '.pdf':
                    return 'file-pdf'
                case '.mp4':
                    return 'youtube'
                case '.mp3':
                    return 'music-circle'
                case '.png':
                case '.jpeg':
                case '.jpg':
                    return 'image'
                default:
                    return 'file-document'
            }
        }
    }
}
</script>

<style>
body{
    font-family: Arial, Helvetica, sans-serif;
    font-size: 14px;
    background: #eee;
    margin: 0px;
    padding: 0px;
}
.text-titulo .cloud{
    width: 20px;
}
.check-bold{
    z-index: 2;
    position: absolute;
    right: 7px;
    top: 2px;
}
.cloud {
  position: absolute;
  right: 5px;
  z-index: 1;
  width: 18px;
  height: 18px;
  background: currentColor;
  border-radius: 50%;
  box-shadow:
    -13px 3px 0 -4px,
    13px 5px 0 -6px,
    0 0 0 2.0px #fff,
    -13px 3px 0 -2px #fff,
    12px 5px 0 -3.3px #fff;
}
.cloud:after {
  content: '';
  position: absolute;
  bottom: 1px;
  left: -5px;
  display: block;
  width: 26px;
  height: 6px;
  background: currentColor;
  box-shadow: 0 2.9px 0 -0.7px #fff;
}
.cloud.end{
  position: absolute;
  right: 5px;
  z-index: 1;
  width: 18px;
  height: 18px;
  background: currentColor;
  border-radius: 50%;
  box-shadow:
    -13px 3px 0 -4px,
    13px 5px 0 -6px,
    0 0 0 2.0px #02c668,
    -13px 3px 0 -2px #02c668,
    12px 5px 0 -3.3px #02c668;
}
.end.cloud:after{
  content: '';
  position: absolute;
  bottom: 1px;
  left: -5px;
  display: block;
  width: 26px;
  height: 6px;
  background: currentColor;
  box-shadow: 0 2.9px 0 -0.7px #02c668;
}
.arrow-container {
    z-index: 1;
    position: absolute;
    top: 1px;
    left: -5px;
    width: 20px;
    height: 17px;
    overflow: hidden;
}
.cloud-play {
    width: 15px;
    animation: cloudAnim 1s linear infinite forwards;
}
@keyframes cloudAnim {
    0% {
        transform: translateY(90%) scale(1, 1);
    }
    50% {
        transform: scale(1.2, 1.2);
    }
    100% {
        transform: translateY(-40%) scale(1, 1);
    }
}
.text-titulo .logo-mega{
    width: 20px;
    height: 20px;
}
.text-titulo p{
    color: #ffffff
}
.text-titulo{
    height: 25px;
    display: flex;
    justify-content: space-between;
    text-align: center;
    align-items: center;
    font-size: 16px;
    color: #616161;
    background-color: currentColor;
    /* background: #616161;
    color: #ffffff; */
}
.p-2{
    padding: 10px;
}
.cont-carga{
    margin: 0 10px 0 10px;
    width: 23px;
    height: 23px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 2px;
}
.cont-carga img{
    width: 48px;
    height: 48px;
}
.cont-datos{
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
}
.bg-bar{
    margin-top: 4px;
    background: linear-gradient(to right, rgb(0, 44, 177), rgb(34, 142, 212), rgb(2, 198, 104));
}
.bar-progress{
    height:8px;
    border-radius: 20px;
    background: #cecece;
    margin-bottom: 5px;
}
.br-20{
    border-radius: 20px;
}
p{
    margin: 0!important;
}
h4{
    margin: 0!important;
}
.montserrat{
    font-family: 'Montserrat', sans-serif;
}
</style>
