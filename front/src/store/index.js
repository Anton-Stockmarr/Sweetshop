import Vue from 'vue'
import Vuex from 'vuex'
import loginModule from './modules/login'
import orderModule from './modules/order'
import stockModule from './modules/stock'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    loginModule,
    orderModule,
    stockModule
  }
})
