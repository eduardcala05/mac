<template>
    <section class="w-100">
        <div class="row mx-0">
            <div class="col-12 mb-3">
                <ul class="nav nav-tabs">
                    <li class="nav-item">
                        <router-link :to="{name: 'home.configurar.interfaz'}" class="nav-link" active-class="active" exact>
                            Interfaz
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{name: 'home.configurar.inicio-sesion'}" class="nav-link" active-class="active" exact>
                            Inicio sesión
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{name: 'home.configurar.unidad'}" class="nav-link" active-class="active" exact>
                            Mi unidad
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{name:'home.configurar.admin-admin'}" class="nav-link" active-class="active" exact>
                            Admin / admin
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{name:'home.configurar.admin-usuario'}" class="nav-link" active-class="active" exact>
                            Admin / usuario
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link :to="{name:'home.configurar.usuario-admin'}" class="nav-link" active-class="active" exact>
                            Usuario / admin
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>

        <router-view :key="$route.path" class="container-fluid" />
    </section>
</template>
<script>
export default {
    middleware: ['auth','configurarNavegacion'],
    created(){
        window.localStorage.setItem('configurar-ultima-ruta',this.$route.name)
    }
}
</script>
<style lang="scss" scoped>
.nav-item{
    margin-bottom: 5px;
    .nav-link{
        color: #5D5D5D;
    }
}
.active{
    font-weight: bold;
}
</style>
