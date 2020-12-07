<template>
  <section class="OpenModalRigth" v-show="modalShow">
    <div   class="modal right ">
      <div :class="`modal-dialog modal-dialog-centered ${tamano ? tamano:''}`" role="document">
        <div class="modal-content">
          <div class="modal-header custom-modal-header">
            <div class="w-100">
              <div class="row">
                <div class="col-sm-3 my-auto">
                  <!-- <img src="/img/default/logo-empresa-modal.png" alt="" width="60" height="31"> -->
                </div>
                <div class="col-sm-6 text-center my-auto text-center">
                  <p v-if="titulo" class="modal-title f-600 f-14 my-2">{{titulo}}</p>
                </div>
                <div class="col-sm-3"></div>
              </div>
              <span class="cerrar-modal" @click="modalShow = false">&times;</span>
            </div>
          </div>
          <div class="modal-body" >
            <slot name="modalbody"></slot>
          </div>
          <div class="modal-footer">
            <slot name="modalfotter"></slot>
          </div>
        </div><!-- modal-content -->
      </div><!-- modal-dialog -->
    </div><!-- modal -->
  </section>
</template>

<script type="text/javascript" >
export default {
  props:['titulo','tamano','icono'],
  data(){
    return{
      modalShow:false,
    }
  },
  methods:{
    toggle(){
      this.modalShow = !this.modalShow;
    }
  }
}
</script>

<style lang="scss" scoped>
.OpenModalRigth{
  span.cerrar-modal {
    color: #fff;
    font-size: 37px;
    position: absolute;
    top: -6px;
    right: 9px;
    cursor: pointer;
  }
  .modal{
    display: block !important;
    background: rgba(0,0,0,0.5);

  }
  .modal-title{
    color:#fff;
  }
  // .custom-modal-header {
  //   padding: 0px 10px !important;
  // }
  .modal.right .modal-dialog {
    right: 0px !important;
    position: fixed;
    margin: auto;
    width: 420px;
    height: 100%;
    -webkit-transform: translate3d(0%, 0, 0);
    -ms-transform: translate3d(0%, 0, 0);
    -o-transform: translate3d(0%, 0, 0);
    transform: translate3d(0%, 0, 0);
  }
  .modal.right .modal-content {
    height: 100%;
    // overflow-y: auto;
    // overflow-x: hidden;
  }

  /*Right*/
  .modal.right.fade .modal-dialog {
    right: 0px;
    -webkit-transition: opacity 0.3s linear, right 0.3s ease-out;
    -moz-transition: opacity 0.3s linear, right 0.3s ease-out;
    -o-transition: opacity 0.3s linear, right 0.3s ease-out;
    transition: opacity 0.3s linear, right 0.3s ease-out;
  }

  .modal.right.fade.in .modal-dialog {
    right: 0;
  }

  /* ----- MODAL STYLE ----- */
  .modal-content {
    border-radius: 0;
    border: none;
  }

  .modal-header {
    border-bottom-color: #EEEEEE;
    background-color: #434B53;
    // height: 47px;
  }


}
</style>
