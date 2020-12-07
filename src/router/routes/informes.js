import InformeConexion from '../../views/informes/informeConexion'
import InformeFechas from '../../views/informes/informeFechas'
import InformeLecturas from '../../views/informes/informeLecturas'

export default [
    {
        path: 'informe-lecturas',
        name: 'home.informe-lecturas',
        component: InformeLecturas
    },
    {
        path: 'informe-fechas',
        name: 'home.informe-fechas',
        component: InformeFechas
    },
    {
        path: 'informe-conexion',
        name: 'home.informe-conexion',
        component: InformeConexion
    },
]
