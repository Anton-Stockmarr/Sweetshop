import axios from 'axios'


const itemModule = {
    state: {
        items: [],
        currentOrder: [],
        orders: [],
        errors: {
            loadItemsError: ''
        }
    },
    mutations: {
        setItems(state, items){
            state.items = items;
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
        setError(state, { name, message }) {
            state.errors[name] = message;
        },    
    },
    actions: {
        loadItems({ commit }){
            axios.get(`http://localhost:3000/api/items`)
            .then(response => commit('setItems', response.data))
            .catch(error => {
              if (error.response) {
                commit('setError',{ name: 'loadItemsError', message: error.response.data});
              }
          });    
        },
        loadOrders(){
            return;
        },
        changeCurrentOrder({ commit, getters }, { changedItem, amount }){
            if (amount > 0) {
                commit('addToOrder', { newItem: changedItem, amount: amount });
            }
            else if (amount < 0) {
                if (!getters.currentOrder.some(item => item.id === changedItem.id)){
                    commit('setError', { name: 'changeOrderError', message: 'Tried to remove more than was in the order'});
                } else {
                    commit('removeFromOrder', { changedItem: changedItem, amount: -amount });
                }
            } else {
                commit('setError', { name: 'changeOrderError', message: `cannot change order by ${amount}`});
            }
        },
/*        placeOrder({ commit, getters }){
            axios.post({ url: `http://localhost:3000/api/orders`,
                data: getters.currentOrder
                })
                .then(response => {
                    commit('clearOrder')
                });
        }*/
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
        }
    }
};

export default itemModule;