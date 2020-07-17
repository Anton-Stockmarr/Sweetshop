export default itemModule = {
    state: {
        items: []
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
        }      
    },
    actions: {
    },
    getters: {
    }
}