import axios from 'axios'


const stockModule = {
    state: {
        items: [],
    },
    mutations: {
        setItems(state, items){
            state.items = items;
        },
        addItem(state, item) {
            state.items = [...state.items,item];
        },
        archiveItem(state, id){
            state.items = state.items.filter( item => item.id !== id);
        },
        setItemQuantity(state, { id, quantity }) {
            let item = state.items.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
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
    },
    actions: {
        loadItems({ commit, dispatch }){
            return axios.get(`http://localhost:3000/api/items`)
            .then(response => {
                commit('setItems', response.data);
                commit('clearError', 'loadItemsError');
            })
            .catch(error => {
                dispatch('handleStockError', {error: error, errorName: 'loadItemsError' });
            });
    },
        changeItemQuantity({ commit, dispatch }, { id, quantity }){
            return axios.put(`http://localhost:3000/api/items/quantity?item=${id}&quantity=${quantity}`)
                .then( () => {
                        commit('setItemQuantity', { id: id, quantity: quantity });
                        commit('clearError', 'changeQuantityError');
                })
                .catch(error => {
                    dispatch('handleStockError', {error: error, errorName: 'changeQuantityError' });
                });
        },
        addItem({ commit, dispatch }, item) {
            return axios.post(`http://localhost:3000/api/items`, { data: item })
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
        archiveItem({ commit, dispatch }, id) {
            return axios.put(`http://localhost:3000/api/items/archive?item=${id}`,)
                .then( () => {
                    commit('archiveItem', id);
                    commit('clearError', 'archiveItemError');
                })
                .catch(error => {
                    dispatch('handleStockError', {error: error, errorName: 'archiveItemError' });
                });
        },
        handleStockError({ commit }, { error, errorName } ) {
            if (error.response) {
                if (error.response.status === 404) {
                    commit('setError', { name: errorName, message: 'Unable to receive data from server' });
                } else {
                    commit('setError', { name: errorName, message: error.response.data });
                }
            } else {
                commit('setError', { name: errorName, message: 'Server not responding' });
            }
        }
    },
    getters: {
        getItems(state){
            return state.items;
        },
    }
};

export default stockModule;