<template>
  <div class="cuerpo">
      <div class="sidebar">
          <div class="sidebar-ajuste">
            <div class="sidebar-empresa">
                <div class="sidebar-empresa-logo">
                    <img :src="barra" alt="" class="w-100">
                </div>
            </div>
            <div  class="sidebar-menu">
                <div class="sidebar-menu-item">
                    <router-link :to="{name: 'home.mi-unidad'}" class="sidebar-menu-item-link" active-class="sidebar-menu-item-link-active">
                        <svg style="width:24px;height:24px" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="hdd" class="svg-inline--fa fa-hdd fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                            <path fill="currentColor" d="M576 304v96c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48v-96c0-26.51 21.49-48 48-48h480c26.51 0 48 21.49 48 48zm-48-80a79.557 79.557 0 0 1 30.777 6.165L462.25 85.374A48.003 48.003 0 0 0 422.311 64H153.689a48 48 0 0 0-39.938 21.374L17.223 230.165A79.557 79.557 0 0 1 48 224h480zm-48 96c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32zm-96 0c-17.673 0-32 14.327-32 32s14.327 32 32 32 32-14.327 32-32-14.327-32-32-32z"> </path>
                        </svg>
                        <span>
                            Mi unidad
                        </span>
                    </router-link>
                </div>
                <div class="sidebar-menu-item ">
                    <router-link :to="{name: 'home.descargables'}" class="sidebar-menu-item-link" active-class="sidebar-menu-item-link-active">
                        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M17,13L12,18L7,13H10V9H14V13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />
                        </svg>
                        <span> Descargables </span>
                    </router-link>
                </div>
                <div v-if="user.id_rol === 1 || user.id_rol === 3" class="sidebar-menu-item">
                    <router-link :to="{name: 'home.informe-lecturas'}" class="sidebar-menu-item-link" active-class="sidebar-menu-item-link-active">
                        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M15,7H20.5L15,1.5V7M8,0H16L22,6V18A2,2 0 0,1 20,20H8C6.89,20 6,19.1 6,18V2A2,2 0 0,1 8,0M4,4V22H20V24H4A2,2 0 0,1 2,22V4H4Z" />
                        </svg>
                        <span> Informe lecturas </span>
                    </router-link>
                </div>
                <div v-if="user.id_rol === 1 || user.id_rol === 3" class="sidebar-menu-item">
                    <router-link :to="{name: 'home.informe-fechas'}" class="sidebar-menu-item-link" active-class="sidebar-menu-item-link-active">
                        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M14,14H7V16H14M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M17,10H7V12H17V10Z" />
                        </svg>
                        <span> Informe por fecha </span>
                    </router-link>
                </div>
                <div v-if="user.id_rol === 1 || user.id_rol === 3" class="sidebar-menu-item">
                    <router-link :to="{name: 'home.informe-conexion'}" class="sidebar-menu-item-link" active-class="sidebar-menu-item-link-active">
                        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />
                        </svg>
                        <span> Informe conexión </span>
                    </router-link>
                </div>
                <div v-if="user.id_rol === 1 || user.id_rol === 3" class="sidebar-menu-item">
                    <router-link :to="{name:'usuarios.listar.principal'}" class="sidebar-menu-item-link" active-class="sidebar-menu-item-link-active">
                        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,19.2C9.5,19.2 7.29,17.92 6,16C6.03,14 10,12.9 12,12.9C14,12.9 17.97,14 18,16C16.71,17.92 14.5,19.2 12,19.2M12,5A3,3 0 0,1 15,8A3,3 0 0,1 12,11A3,3 0 0,1 9,8A3,3 0 0,1 12,5M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2Z" />
                        </svg>
                        <span>Usuarios</span>
                    </router-link>
                </div>
                <div v-if="user.id_rol === 3" class="sidebar-menu-item" >
                    <router-link :to="{name:'home.configurar.interfaz',params: {bandera: 1}}" class="sidebar-menu-item-link" active-class="sidebar-menu-item-link-active">
                        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
                        </svg>
                        <span>Configuraciones</span>
                    </router-link>
                </div>
                <!-- <div class="sidebar-menu-item">
                    <router-link :to="{name: 'auth.login'}">
                        ir a login
                    </router-link>
                </div> -->
            </div>
          </div>
          <div class="sidebar-footer">
              <div class="sidebar-footer-imagen">
                  <img src="/img/azul.png" alt="" class="w-100">
              </div>
          </div>
      </div>
      <div class="">
        <div class="row mx-0" style="height:70px;">
          <navbar />
        </div>
        <div class="contenido p-3 custom-scroll">
          <router-view :key="$route.path" />
        </div>
      </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name: 'Home',
    middleware: ['auth'],
    components: {
        navbar: () => import('@/components/navbar')
    },
    computed:{
      ...mapGetters({
        user:'auth/user',
        barra:'configurar/barra'
      })
    },
    mounted(){
        this.$store.dispatch('configurar/getConfig');
    }
}
</script>

<style lang="scss" scoped>
.cuerpo{
    height: 100vh;
    width: 100%;
    display: flex;
}
.sidebar{
    background:#e8e8e8;
    // width: 250px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .sidebar-empresa{
        width: 100%;
        display: flex;
        justify-content: center;
        border-bottom: 1px solid #616161;
        padding-top: 5px;
        padding-bottom: 5px;


        .sidebar-empresa-logo{
          height: 122px;
          display: flex;
          justify-content: center;
          align-items: center;
            img{
                max-width: 120px;
                max-height: 120px;
                object-fit: cover;
            }
        }
    }
    .sidebar-footer{
        display: flex;
        justify-content: center;
        width: 100%;
        .sidebar-footer-imagen{
            height: 90px;
            width: 90px;
        }
    }

    .sidebar-menu{
        .sidebar-menu-item{
            width: 188px;
            padding-top: 2px;
            padding-bottom: 2px;
            margin-top: 5px;
            margin-left: 10px;
            margin-right: 10px;
            margin-bottom: 5px;

            svg{
                margin-right: 5px;
            }
            a{
                color: var(--color-general);
                font-size: 14px;
                text-decoration: none;
            }
        }
        .sidebar-menu-item-link{
            padding: 7px;
            display: flex;
            align-items: center;
            overflow: hidden;
        }
        .sidebar-menu-item-link-active{
            border-radius: 6px;
            background: var(--color-general);
            color: white !important;
            svg{
                animation-name: anima1;
                animation-duration: 300ms;
            }
        }
    }
}
.contenido{
    width: calc(100vw - 208px);
    height: calc(100vh - 75px);
    overflow: auto;
    // background: yellow;
}

@keyframes anima1 {
    0%{
        transform: scale(1.2) translateX(-100px) ;
    }
    70%{
        transform: scale(1.4);
    }
    100%{
    }
}
</style>
