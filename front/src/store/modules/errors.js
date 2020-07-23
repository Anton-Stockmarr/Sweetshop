
const errorModule = {
  state: {
    signInError: '',
    signUpError: '',
    adminSignInError: '',
    loadOrdersError: '',
    changeOrderError: '',
    placeOrderError: '',
    loadItemsError: '',
    addItemError: '',
    archiveItemError: '',
    changeQuantityError: '',
  },
  mutations: {
    setError(state, { name, message }) {
      if (state[name] || state[name].length === 0){
        state[name] = message;
      } else {
        console.log(`trying to set error ${name}, error does not exist`);
      }
    },
    clearError(state, name) {
      if (state[name] || state[name].length === 0){
        state[name] = '';
      } else {
        console.log(`trying to set error ${name}, error does not exist`);
      }
    }
  },
  actions: {
    setError({commit}, {name, message}) {
      commit('setError', {name: name, message: message});
    },
    clearLoginErrors({ commit }) {
      commit('clearError', 'signInError');
      commit('clearError', 'signUpError');
      commit('clearError', 'adminSignInError');
    }
  },
  getters: {
    getError(state) {
      return name => state[name];
    },
  }
};


export default errorModule;