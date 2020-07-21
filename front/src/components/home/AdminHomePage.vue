<template>
    <div>
        Items in stock:
        <div v-show="loadItemsError">{{loadItemsError}}</div>
        <div :key="item.id" v-for="item in items">
            <Item v-bind="item"/>
        </div>
        Stock value: {{totalStockValue}}
        Add Item:
        <div v-show="addItemError">{{addItemError}}</div>
        <input v-model="newItem.name" type="text" placeholder="name">
        <input v-model="newItem.description" type="text" placeholder="description">
        <input v-model.number="newItem.price" type="number" placeholder="price">
        <input v-model="newItem.currency" type="text" placeholder="currency">
        <input v-model.number="newItem.quantity" type="number" placeholder="quantity">
        <button @click="addItem">submit</button>
    </div>
</template>



<script>
import Item from './Item'



export default {
    name: 'AdminHomePage',
    components: {
        Item
    },
    data() {
        return {
            newItem: {
                name: '',
                description: '',
                price: null,
                currency: '',
                quantity: null
            }
        }
    },
    mounted() {
        this.loadItems();
    },
    computed: {
        items(){
            return this.$store.getters.getItems;
        },
        totalStockValue() {
            return this.items.reduce( (prev, cur) => prev + cur.quantity*cur.price, 0);
        },
        loadItemsError(){
            return this.$store.getters.getStockError('loadItemsError');
        },
        addItemError(){
            return this.$store.getters.getStockError('addItemError');
        },
        removeItemError(){
            return this.$store.getters.getStockError('removeItemError');
        },
        changeQuantityError(){
            return this.$store.getters.getStockError('changeQuantityError');
        },
    },
    methods: {
        loadItems() {
            return this.$store.dispatch('loadItems'); 
        },
        addItem() {
            return this.$store.dispatch('addItem', this.newItem)
                .then(() => {
                    this.newItem.name = '';
                    this.newItem.description = '';
                    this.newItem.price = null;
                    this.newItem.currency = '';
                    this.newItem.quantity = null;
                });
        }
    }
}
</script>

<style>

</style>