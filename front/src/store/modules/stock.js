import axios from 'axios'


const stockModule = {
    state: {
        items: [],
        errors: {
            loadItemsError: '',
            addItemError: '',
            removeItemError: '',
            changeQuantityError: ''
        }
    },
    mutations: {
        setItems(state, items){
            state.items = items;
        },
        addItem(state, item) {
            state.items = [...state.items,item];
        },
        removeItem(state, id){
            state.items = state.items.filter( item => item.id !== id);
        },
        setItemQuantity(state, { id, quantity }) {
            let item = state.items.find(item => item.id === id);
            if (item) {
                item.quantity += quantity;
            }
        },
        increaseItemQuantity(state, { id, amount }) {
            let item = state.items.find(item => item.id === id);
            if (item) {
                item.quantity += amount;
            }
        },
        decreaseItemQuantity(state, { id, amount }) {
            let item = state.items.find(item => item.id === id);
            if (item) {
                item.quantity = (item.quantity >= amount) ? item.quantity - amount : 0;
            }
        },
        setError(state, { name, message }) {
            state.errors[name] = message;
        },
        clearError(state, { name }) {
            state.errors[name] = '';
        },
    },
    actions: {
        loadItems({ commit, dispatch }){
            return axios.get(`http://localhost:3000/api/items`)
            .then(response => {
                commit('setItems', response.data);
                commit('clearError', 'loadItemsError');
            })
            .catch(error => {
                dispatch('handleStockError', {error: error, errorName: 'removeItemError' });
            });
    },
        changeItemQuantity({ commit, dispatch }, { id, quantity }){
            return axios.post(`http://localhost:3000/api/items/quantity?item=${id}&quantity=${quantity}`)
                .then( () => {
                        commit('SetItemQuantity', { id: id, quantity: quantity });
                        commit('clearError', 'changeQuantityError');
                })
                .catch(error => {
                    dispatch('handleStockError', {error: error, errorName: 'changeQuantityError' });
                });
        },
        addItem({ commit, dispatch }, item) {
            return axios.post(`http://localhost:3000/api/items/add`, { data: item })
                .then(response => {
                    // deep copy of item
                    let addedItem = JSON.parse(JSON.stringify(item));
                    addedItem.id = response.data;
                    commit('addItem', addedItem);
                    commit('clearError', 'addItemError');
                })
                .catch(error => {
                    dispatch('handleStockError', {error: error, errorName: 'addItemError' });
                });
        },
        removeItem({ commit, dispatch }, id) {
            return axios.post(`http://localhost:3000/api/items/remove?item=${id}`,)
                .then( () => {
                    commit('removeItem', id);
                    commit('clearError', 'removeItemError');
                })
                .catch(error => {
                    dispatch('handleStockError', {error: error, errorName: 'removeItemError' });
                });
        },
        handleStockError({ commit }, { error, errorName } ) {
            if (error.response) {
                commit('setError', { name: errorName, message: error.response.data });
            } else {
                commit('setError', { name: errorName, message: 'Server not responding' });
            }
        }
    },
    getters: {
        getItems(state){
            return state.items;
        },
        getStockError(state) {
            return name => state.errors[name];
          },    
    }
};

export default stockModule;