import { mapGetters } from 'vuex'
import { notificacion } from '../utils/helper'

export default {
    computed: {
        ...mapGetters({
            $usuario: 'auth/user',
        })
    },
    methods: {
        error_catch(e,referenciaValidador = null){
            error_catch(e)

            this.notificacion(
                _.get(e.response,'data.titulo','Error'),
                _.get(e.response,'data.mensaje','Ha ocurrido un error al realizar la consulta'),
                'error'
            )

            if(this.existenValidaciones(e) && referenciaValidador){
                this.$refs[referenciaValidador].setErrors(e.response.data.validaciones)
            }
        },
        notificacion(titulo, mensaje, tipo = 'info'){
            notificacion(titulo, mensaje, tipo)
        },
        existenValidaciones: excepcion => !_.isEmpty(excepcion?.response?.data?.validaciones),
    }
}
