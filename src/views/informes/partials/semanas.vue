<template>
    <div class="row mx-0">
        <div class="col-2 offset-5 text-center my-3">
<!--            {{ year }}-->
            <el-select v-model="select.year" @change="change" size="small">
                <el-option v-for="item in optionsYear" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>
        </div>
        <div class="col-12 d-flex justify-content-center">
            <div v-for="i in 26" :class="`${(value.week === i)?'active':'bg-light'} border cr-pointer text-center p-1`"
                 @click="select.week = i"
                 style="height: 34px; width: 34px;">
                <p class="my-auto"> {{ i }}</p>
            </div>
        </div>
        <div class="col-12 d-flex justify-content-center">
          <template v-for="i in moment().set('year', select.year).weeksInYear()">
            <div
                 v-if="i>26"
                 :class="`${(value.week === i)?'active':'bg-light'} border cr-pointer text-center p-1`"
                 @click="select.week = i"
                 style="height: 34px; width: 34px;">
                <p class="my-auto"> {{ i }}</p>
            </div>
          </template>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import {mapGetters} from "vuex";
  export default {
    props: {
      value: [Object],
    },
    data () {
      return {
        select: {
            year:moment().year(),
            week:moment().week()
        },
      }
    },
    watch: {
      value (val) {
        if (val !== this.select) {
          this.select = val
        }
      },
        ['select.week'](){
          this.change()
        }
    },
      computed:{
          optionsYear(){
              return [
                  2019,
                  2020
              ]
          },
      },
    mounted () {
      this.select = this.value
    },
    methods:{
        change(){
            this.$emit('change')
            this.$emit('input', this.select)
        }
    }
  }
</script>
<style scoped >
    .active{
        background-color:  #5D5D5D !important;
        color: #ffffff;
    }
</style>
