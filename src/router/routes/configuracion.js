import HomeConfigurar from '../../views/configurar'
import HomeConfigurarInterfaz from '../../views/configurar/interfaz.vue'
import HomeConfigurarInicioSesion from '../../views/configurar/inicioSesion.vue'
import HomeConfigurarUnidad from '../../views/configurar/unidad.vue'
import HomeConfigurarAdminAdmin from '../../views/configurar/adminAdmin.vue'
import HomeConfigurarAdminUsuario from '../../views/configurar/adminUsuario.vue'
import HomeConfigurarUsuarioAdmin from '../../views/configurar/usuarioAdmin.vue'

export default [
    {
        path: 'configuracion',
        component: HomeConfigurar,
        children:[
            {
                path: '/',
                name: 'home.configurar.interfaz',
                component: HomeConfigurarInterfaz,
            },
            {
                path: 'inicio-sesion',
                name: 'home.configurar.inicio-sesion',
                component: HomeConfigurarInicioSesion,
            },
            {
                path: 'mi-unidad',
                name: 'home.configurar.unidad',
                component: HomeConfigurarUnidad,
            },
            {
                path: 'admin-admin',
                name: 'home.configurar.admin-admin',
                component: HomeConfigurarAdminAdmin,
            },
            {
                path: 'admin-usuario',
                name: 'home.configurar.admin-usuario',
                component: HomeConfigurarAdminUsuario,
            },
            {
                path: 'usuario-admin',
                name: 'home.configurar.usuario-admin',
                component: HomeConfigurarUsuarioAdmin
            }
        ]
    }
]