import axios from 'axios'
import router from '../../router';

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
    login({ dispatch }, email) {
      axios.get(`http://localhost:3000/api/users?email=${email}`)
        .then(response => {
          dispatch('resolveLogin', { id: response.data.id, adminStatus: false});
        })
        .catch(error => {
          dispatch('handleLoginError', {error: error, errorName: 'signInError' });
      });
    },
    signUp({ dispatch }, { email, name }){
      axios.post(`http://localhost:3000/api/users?email=${email}&name=${name}`)
        .then(response => {
          dispatch('resolveLogin', { id: response.data.id, adminStatus: false});
        })
        .catch(error => {
          dispatch('handleLoginError', {error: error, errorName: 'signUpError' });
      });
    },
    adminLogin({ dispatch }) {
      dispatch('resolveLogin', { id: '', adminStatus: true});
    },
    resolveLogin({ commit }, {id, adminStatus}) {
      commit('setUser', {id: id, adminStatus: adminStatus});
      commit('setLoggedIn', true);
      commit('clearErrors');
      router.push('/home');
    },
    logout({ commit }) {
      commit('setUser', {id: '', adminStatus: false});
      commit('setLoggedIn', false);
      commit('clearErrors');
      router.push('/login');
    },
    handleLoginError({ commit }, { error, errorName } ) {
      if (error.response) {
        if (error.response.status === 404) {
          commit('setError', { name: errorName, message: 'Unable to receive data from server' });
        } else if (error.response.status === 409) {
          commit('setError', { name: errorName, message: 'User already exists' });
        } else {
          commit('setError', { name: errorName, message: error.response.data });
        }
      } else {
        commit('setError', { name: errorName, message: 'Server not responding' });
      }
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
    getLoginError(state) {
      return name => state.errors[name];
    },
  }
};


export default loginModule;