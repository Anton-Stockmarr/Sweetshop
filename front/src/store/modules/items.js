import axios from 'axios'


const itemModule = {
    state: {
        items: [],
        currentOrder: [],
        orders: [],
        errors: {
            loadItemsError: '',
            loadOrdersError: '',
            changeOrderError: '',
            placeOrderError: ''
        }
    },
    mutations: {
        setItems(state, items){
            state.items = items;
        },
        setOrders(state, orders) {
            state.orders = orders;
        },
        addItem(state, item) {
            state.items = [...state.items,item];
        },
        removeItem(state,id){
            state.items = state.items.filter( item => item.id !== id);
        },
        addToOrder(state, { newItem, amount }){
            state.items.find(item => item.id === newItem.id).quantity -= amount;
            let duplicate = state.currentOrder.find(item => item.id === newItem.id);
            if (duplicate){
                duplicate.quantity += amount;
            } else {
                newItem.quantity = amount;
                state.currentOrder = [...state.currentOrder, newItem];
            }
        },
        removeFromOrder(state, { changedItem, amount }){
            state.items.find(item => item.id === changedItem.id).quantity += amount;
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
        moveCurrentOrderToOrderList(state, id) {
            const newOrder = {id: id, order: state.currentOrder};
            state.orders = [...state.orders,newOrder];
            state.currentOrder = [];
        },
        setError(state, { name, message }) {
            state.errors[name] = message;
        },
        clearError(state, { name }) {
            state.errors[name] = '';
        },
    },
    actions: {
        loadItems({ commit }){
            axios.get(`http://localhost:3000/api/items`)
            .then(response => {
                commit('setItems', response.data);
                commit('clearError', 'loadItemsError');
            })
            .catch(error => {
              if (error.response) {
                commit('setError',{ name: 'loadItemsError', message: error.response.data});
              }
          });    
        },
        loadOrders({ commit, rootGetters }){
            const user = rootGetters.getUserId;
            axios.get(`http://localhost:3000/api/orders?user=${user}`)
            .then(response => {
                commit('setOrders', response.data);
                commit('clearError', 'loadOrdersError');
            })
            .catch(error => {
              if (error.response) {
                commit('setError',{ name: 'loadOrdersError', message: error.response.data});
              }
          });    
        },
        changeCurrentOrder({ commit, getters }, { changedItem, amount }){
            if (amount > 0) {
                commit('addToOrder', { newItem: changedItem, amount: amount });
                commit('clearError', 'changeOrderError');
            }
            else if (amount < 0) {
                if (!getters.getCurrentOrder.some(item => item.id === changedItem.id)){
                    commit('setError', { name: 'changeOrderError', message: 'Tried to remove more than was in the order'});
                } else {
                    commit('removeFromOrder', { changedItem: changedItem, amount: -amount });
                    commit('clearError', 'changeOrderError');
                }
            } else {
                commit('setError', { name: 'changeOrderError', message: `cannot change order by ${amount}`});
            }
        },
        placeOrder({ commit, getters, rootGetters }){
            let body = {
                user: rootGetters.getUserId,
                items: []
            };
            const order = getters.getCurrentOrder;
            body.items = order.map(item => {
                return {itemId: item.id, amount: item.quantity};
            });
            axios.post('http://localhost:3000/api/orders', {
                data: body
                })
                .then(response => {
                    console.log(response.data);
                    commit('moveCurrentOrderToOrderList',response.data);
                    commit('clearError', 'placeOrderError');
                })
                .catch(error => {
                    commit('setError', { name: 'placeOrderError', message: error.response.data });
                });
        }
    },
    getters: {
        getItems(state){
            return state.items;
        },
        getCurrentOrder(state){
            return state.currentOrder;
        },
        getOrders(state){
            return state.orders;
        },
        getItemError(state) {
            return name => state.errors[name];
          },      
    }
};

export default itemModule;