import Vue from 'vue'
import Vuex from 'vuex'
import loginModule from './modules/login'
//import itemModule from './itemModule.js'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    loginModule,
//    itemModule
  }
})
