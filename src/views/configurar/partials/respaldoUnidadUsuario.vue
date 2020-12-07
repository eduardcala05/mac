<template>
    <section class="modal-cambiar-logo">
        <modal ref="respaldoUsuario" titulo="Realizar BackUp de usuario" tamano="modal-md" footer>
            <div class="row justify-content-center">
                <div class="col-6">
                    <p class="w-100 text-muted f-10"> Seleccione el usuario </p>
                    <el-select
                    v-model="unidad"
                    placeholder="Seleccionar"
                    >
                        <el-option
                        v-for="item in unidades"
                        :key="item.nombre"
                        :label="item.nombre_usuario"
                        :value="item.id"
                        />
                    </el-select>
                </div>
            </div>
            <div class="row justify-content-center mt-2">
                <div class="col-6">
                    <div class="d-flex flex-row">
                        <div class="p-2">
                            <p class="d-flex align-items-center">
                                <i class="mdi mdi-file text-muted2"></i> <span class="text-muted2 f-12 ml-2">{{getUnidad.unidad_archivos}} Archivos</span>
                            </p>
                        </div>
                        <div class="p-2">
                            <p class="d-flex align-items-center">
                                <i class="mdi mdi-file-multiple text-info2"></i>
                                <span class="text-muted2 f-12 ml-2">{{Math.round(getUnidad.unidad_peso || 0/1024)}} MB</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <template slot="footer">
                <el-button type="info" @click="crearCopia">Aceptar</el-button>
            </template>
        </modal>
    </section>
</template>

<script>
export default {
    name: 'respaldoUnidadUsuario',
    data() {
        return {
            unidad: null,
            rutaBackup: null,
            miUnidad: {}
        }
    },
    computed: {
        getUnidad() {
            return ''
            //return _.find(this.unidades, ['id', this.unidad])
        },
        unidades() {
            return []
            // return this.$store.getters['unidad/unidades_usuarios']
        },
        mac() {
            return this.$store.getters['app/mac']
        }
    },
    mounted() {
        //this.$store.dispatch('unidad/getUnidades')
        // this.$store.getters['unidad/mi_unidad'].then(res => {
        //     this.miUnidad = res
        //     if (res.ruta_almacenar !== null) {
        //         this.rutaBackup = path.join(res.ruta_almacenar, 'backup')
        //     }
        // })
    },
    methods: {
        toggle() {
            this.unidad = null
            this.$refs.respaldoUsuario.toggle();
        },
        async crearCopia() {
            const loading = this.$loading({
                lock: true,
                text: 'Creando BackUp de usuario',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            try {
                let tiempo = this.moment().format('YYYY-MM-DD hh-mm-ss')
                if (!fs.existsSync(this.rutaBackup)) fs.mkdirSync(this.rutaBackup);
                await zip.compressDir(
                    path.join(this.miUnidad.ruta_almacenar, `${this.getUnidad.nombre_usuario}-${this.getUnidad.mac}`),
                    path.join(this.rutaBackup, `${this.getUnidad.nombre_usuario} - ${this.getUnidad.mac} - ${tiempo}.zip`))
                this.notificacion('BackUp creado con exito', '', 'success');
            } catch (e) {
                this.notificacion('Error al crear BackUp', '', 'error');
            } finally {
                loading.close()
                this.toggle()

            }

        }
    },
}
</script>

<style lang="scss" scoped>
    .modal-cambiar-logo {
        .logo-galeria {
            position: relative;
            vertical-align: middle;
            display: table-cell;
            text-align: center;
            max-width: 180px;
            min-width: 180px;
            height: 120px;
            // background: #f5f5f5;
            border: 1px solid #dbdbdb;
            border-radius: 3px;

            i.mdi-check-circle {
                position: absolute;
                top: -1px;
                right: 2px;
                color: #00B41E;
                font-size: 20px;
                visibility: hidden;
            }

            &.selected {
                border: 3px solid #5D5D5D;

                i.mdi-check-circle {
                    visibility: visible;
                }

                i.mdi-close-circle {
                    visibility: hidden !important;
                }
            }

            i.mdi-close-circle {
                color: #979797;
                position: absolute;
                top: -12px;
                right: -8px;
                visibility: hidden;
            }

            &:hover {
                i.mdi-close-circle {
                    cursor: pointer;
                    visibility: visible;
                }
            }
        }
    }
</style>
