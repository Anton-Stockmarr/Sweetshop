import axios from 'axios'
import router from '../../router';

const loginModule = {
  state: {
    userId: '',
    adminStatus: false,
    loggedIn: false,
  },
  mutations: {
    setUser(state, { id, adminStatus }){
      state.adminStatus = adminStatus;
      state.userId = id;
    },
    setLoggedIn(state, loggedIn){
      state.loggedIn = loggedIn;
    },
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
    resolveLogin({ commit, dispatch }, {id, adminStatus}) {
      commit('setUser', {id: id, adminStatus: adminStatus});
      commit('setLoggedIn', true);
      dispatch('clearLoginErrors');
      router.push('/home');
    },
    logout({ commit, dispatch }) {
      commit('setUser', {id: '', adminStatus: false});
      commit('setLoggedIn', false);
      dispatch('clearLoginErrors');
      router.push('/login');
    },
    handleLoginError({ commit, dispatch }, { error, errorName } ) {
      if (error.response) {
        if (error.response.status === 404) {
          dispatch('setError', { name: errorName, message: 'User does not exist' });
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
  }
};


export default loginModule;