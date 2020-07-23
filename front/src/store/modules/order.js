import axios from 'axios'


const orderModule = {
    state: {
        currentOrder: [],
        orders: [],
        orderPlaced: false
    },
    mutations: {
        setOrders(state, orders) {
            state.orders = orders;
        },
        addToOrder(state, { newItem, amount }){
            let duplicate = state.currentOrder.find(item => item.id === newItem.id);
            if (duplicate){
                duplicate.quantity += amount;
            } else {
                newItem.quantity = amount;
                state.currentOrder = [...state.currentOrder, newItem];
            }
        },
        removeFromOrder(state, { changedItem, amount }){
            let removedItem = state.currentOrder.find(orderItem => orderItem.id === changedItem.id);
            if (removedItem){
                if (removedItem.quantity > amount)
                {
                    removedItem.quantity -= amount;
                } else {
                    state.currentOrder = state.currentOrder.filter( orderItem => orderItem.id !== changedItem.id);
                }
            }
        },
        clearCurrentOrder(state) {
            state.currentOrder = [];
        },
        setOrderPlaced(state, status) {
            state.orderPlaced = status;
        },
    },
    actions: {
        loadOrders({ commit, dispatch, rootGetters }){
            const user = rootGetters.getUserId;
            return axios.get(`http://localhost:3000/api/orders?user=${user}`)
            .then(response => {
                commit('setOrders', response.data);
                commit('clearError', 'loadOrdersError');
            })
            .catch(error => {
                dispatch('handleOrderError', { error: error, errorName: 'loadOrdersError'});
            });
        },
        changeCurrentOrder({ commit, getters }, { changedItem, amount }){
            commit('setOrderPlaced', false);
            if (amount > 0) {
                // From item module
                commit('decreaseItemQuantity', { id: changedItem.id, amount: amount});
                
                commit('addToOrder', { newItem: changedItem, amount: amount });
                commit('clearError', 'changeOrderError');
            }
            else if (amount < 0) {
                if (!getters.getCurrentOrder.some(item => item.id === changedItem.id)){
                    commit('setError', { name: 'changeOrderError', message: 'Tried to item that was not in the order'});
                } else {
                    // From item module
                    commit('increaseItemQuantity', { id: changedItem.id, amount: -amount});

                    commit('removeFromOrder', { changedItem: changedItem, amount: -amount });
                    commit('clearError', 'changeOrderError');
                }
            } else {
                commit('setError', { name: 'changeOrderError', message: `cannot change order by ${amount}`});
            }
        },
        placeOrder({ commit, dispatch, getters, rootGetters }){
            let body = {
                user: rootGetters.getUserId,
                items: []
            };
            const order = getters.getCurrentOrder;
            body.items = order.map(item => {
                return {itemId: item.id, amount: item.quantity};
            });
            return axios.post('http://localhost:3000/api/orders', { data: body} )
                .then( () => {
                    commit('clearCurrentOrder');
                    commit('clearError', 'placeOrderError');
                    commit('clearError', 'changeOrderError');
                    commit('setOrderPlaced',true);
                })
                .catch(error => {
                    dispatch('handleOrderError', { error: error, errorName: 'placeOrderError'});
                });
        },
        handleOrderError({ commit }, { error, errorName }) {
            if (error.response) {
                if (error.response.status === 404) {
                    commit('setError', { name: errorName, message: 'Unable to receive data from server' });
                } else {
                    commit('setError',{ name: errorName, message: error.response.data});
                }
            } else {
                commit('setError',{ name: errorName, message: 'Server not responding' });
            }
        }
    },
    getters: {
        getCurrentOrder(state){
            return state.currentOrder;
        },
        getOrders(state){
            return state.orders;
        },
        getOrderPlaced(state) {
            return state.orderPlaced;
        }
    }
};

export default orderModule;