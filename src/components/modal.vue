<template>
    <el-dialog :visible.sync="modalShow" :width="tamano" @close="close">
        <!-- header -->
        <template slot="title">
            <div class="d-flex">
                <div class="col-sm-3 my-auto">
                    <!-- <el-avatar
                    shape="square"
                    :size="60"
                    :src="logo"
                    fit="contain"
                    class="logo-empresa"
                    /> -->
                    <img class="logo-empresa" :src="logo" alt="" />
                </div>
                <div class="col-sm-6 text-center my-auto text-center">
                    <p class="modal-title f-600 f-14 my-2">{{titulo}}</p>
                </div>
            </div>
            <el-divider class="my-0"/>
        </template>

        <!-- body -->
            <slot style="height: 90vh"></slot>
        <!-- footer -->
        <template slot="footer">
            <el-divider class="my-0"/>
            <div class="dialog-footer mt-2">
                <slot name="footer"></slot>
            </div>
        </template>


    </el-dialog>

</template>

<script type="text/javascript">
    import {mapGetters} from 'vuex'

    export default {
        name: "modalGbp",
        // props:['titulo','tamano'],
        props: {
            titulo: {
                type: String,
                required: true
            },
            tamano: {
                type: String,
                required: true,
                default: "50%"
            },
            footerHide: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                modalShow: false
            };
        },
        computed: {
            ...mapGetters({
                logo: 'configurar/modal'
            })
        },
        methods: {
            toggle() {
                this.modalShow = !this.modalShow;
            },
            close(){
                this.$emit('closeModal')
            }
        }

    };
</script>

<style lang="scss" scoped>
    .logo-empresa{
        max-height: 50px;
        max-width: 200px;
    }
    .el-dialog__body{
        max-height: 50vh !important;
        min-height: 10vh !important;
        overflow-y: auto;
    }
    span.cerrar-modal {
        z-index: 1;
        color: #000;
        font-size: 33px;
        position: absolute;
        top: 3px;
        right: 9px;
        cursor: pointer;
    }

    .custom-modal-header {
        padding: 0px 10px !important;
    }

    .modal-footer {
        background: #f5f5f5;
        padding: 10px;
    }

    .btn-modal-cerrar {
        background: #dddddd;
        color: #5d5d5d;
        border-radius: 4px;
        font-size: 12px;
    }

    .btn-modal-oscuro {
        background: #000000;
        color: #fff;
        border-radius: 4px;
        font-size: 12px;
    }

    .modal-dialog-scrollable .modal-body {
        padding: 10px 0px 0px 0px;
        overflow-x: hidden;
    }
</style>
