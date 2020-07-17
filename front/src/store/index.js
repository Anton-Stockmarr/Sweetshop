import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userId: '',
    adminStatus: false,
    loggedIn: false,
    errors: {
      signInError: '',
      signUpError: '',
      adminSignInError: ''
    }
  },
  mutations: {
    setUserId(state,id){
      state.userId = id;
    },
    setAdminStatus(state,adminStatus) {
      state.adminStatus = adminStatus;
    },
    setError(state, { name, message }) {
      state.errors[name] = message;
    },
    setLoggedIn(state, loggedIn){
      state.loggedIn = loggedIn;
      state.errors.signInError = '';
      state.errors.signUpError = '';
      state.errors.adminSignInError = '';
    }
  },
  actions: {
    setUserId({ commit }, userId){
      commit('setUserId', userId);
    },
    setAdminStatus({ commit }, adminStatus){
      commit('setAdminStatus',adminStatus);
    },
    setError({ commit }, { name, message }){
      commit('setError', { name, message });
    },
    setLoggedIn({ commit }, loggedIn) {
      commit('setLoggedIn', loggedIn);
    }
  },
  getters: {
    getUserId(state) {
      return state.userId;
    },
    getAdminStatus(state){
      return state.adminStatus;
    },
    getLoggedIn(state){
      return state.loggedIn;
    },
    getError(state) {
      return name => state.errors[name];
    },
  }
})
