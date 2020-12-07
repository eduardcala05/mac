import Home from '../views/home.vue'
import AuthLogin from '../views/auth/login.vue'
import HomeMiUnidad from '../views/unidad/miUnidad.vue'

import HomeMiUnidadPadre from '../views/unidad/index.vue'
import HomeMiUnidadPrivadaCarpetas from '../views/unidad/privadaCarpetas.vue'
import HomeDescargables from '../views/descargables.vue'

import Informes from './routes/informes'
import Usuarios from './routes/usuarios'
import Configuracion from './routes/configuracion'

export default [
    {
        path: '/',
        component: Home,
        children:[
            {
                path: 'mi-unidad',
                name: 'home.mi-unidad',
                component: HomeMiUnidad
            },
            {
                path: 'mi-unidad',
                component: HomeMiUnidadPadre,
                children: [
                    {
                        path: 'privada/:id',
                        name: 'home.mi-unidad.privada',
                        component: HomeMiUnidadPrivadaCarpetas
                    },
                    {
                        path: 'privada/ver/:id_hash',
                        name: 'home.mi-unidad.privada.carpeta',
                        component: HomeMiUnidadPrivadaCarpetas
                    }
                ]
            },
            {
                path: 'descargables',
                name: 'home.descargables',
                component: HomeDescargables
            },
            ...Informes,
            ...Usuarios,
            ...Configuracion
        ]
    },
    {
        path:'/auth/login',
        name:'auth.login',
        component: AuthLogin
    }
]
