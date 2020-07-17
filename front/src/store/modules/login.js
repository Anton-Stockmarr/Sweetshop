import Router from '../../router'
import axios from 'axios'

const loginModule = {
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
    setUser(state, { id, adminStatus }){
      state.adminStatus = adminStatus;
      state.userId = id;
    },
    setError(state, { name, message }) {
        state.errors[name] = message;
    },
    setLoggedIn(state, loggedIn){
      state.loggedIn = loggedIn;
    },
    clearErrors(state) {
      state.errors.signInError = '';
      state.errors.signUpError = '';
      state.errors.adminSignInError = '';
    }
  },
  actions: {
    login({ dispatch, commit }, email) {
      axios.get(`http://localhost:3000/api/users?email=${email}`)
        .then(response => {
          dispatch('resolveLogin', { id: response.data.id, adminStatus: false});
        })
        .catch(error => {
          if (error.response) {
            commit('setError',{ name: 'signInError', message: error.response.data});
          }
      });
    },
    signUp({ dispatch, commit }, { email, name }){
      axios.post(`http://localhost:3000/api/users?email=${email}&name=${name}`)
        .then(response => {
          dispatch('resolveLogin', { id: response.data.id, adminStatus: false});
        })
        .catch(error => {
          if (error.response) {
            commit('setError',{ name: 'signUpError', message: error.response.data});
          }
        });
    },
    adminLogin({ dispatch }) {
      dispatch('resolveLogin', { id: '', adminStatus: true});
    },
    resolveLogin({ commit }, {id, adminStatus}) {
      commit('setUser', {id: id, adminStatus: adminStatus});
      commit('setLoggedIn', true);
      commit('clearErrors');
      Router.push({ path: `/home` });
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
};


export default loginModule;