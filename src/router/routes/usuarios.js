import UsuarioIndex from '../../views/usuario'
import UsuarioVer from '../../views/usuario/ver'
import UsuarioComparar from '../../views/usuario/compararUsuarios'

export default [
    {
        path: '/usuarios',
        name: 'usuarios.listar.principal',
        component: UsuarioIndex,
        meta: {
            icono:'mdi-account-circle',
        }
    },
    {
        path: '/usuarios/ver/:id',
        name: 'usuarios.ver',
        component: UsuarioVer,
        meta: {
            icono:'mdi-account-circle'
        }
    },
    {
        path: '/usuarios/comparacion',
        name: 'usuarios.comparar',
        component: UsuarioComparar,
        meta: {
            icono:'mdi-account-circle'
        }
    }
]
