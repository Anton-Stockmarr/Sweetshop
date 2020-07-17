import Vue from 'vue'
import Vuex from 'vuex'
import loginModule from './modules/login'
import itemModule from './modules/items'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    loginModule,
    itemModule
  }
})
