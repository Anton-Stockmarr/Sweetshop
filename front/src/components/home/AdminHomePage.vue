<template>
    <div class="admin-page">
        <div class="navigation">
            <Navigation :pages="this.navPages" v-on:changePage="changePage"/>
        </div>
        <div v-show="currentPage === 0">
            <h1>
                Items in stock:
            </h1>
            <div v-show="loadItemsError">{{loadItemsError}}</div>
            <div :key="item.id" v-for="item in items">
                <Item v-bind="item" :itemType="'stockItem'"/>
            </div>
            <h2>
                Stock value: {{totalStockValue}} EUR
            </h2>
        </div>
        <div v-show="currentPage === 1">
            Add Item:
            <div v-show="addItemError">{{addItemError}}</div>
            <input v-model="newItem.name" type="text" placeholder="name">
            <input v-model="newItem.description" type="text" placeholder="description">
            <input v-model.number="newItem.price" type="number" placeholder="price">
            <input v-model="newItem.currency" type="text" placeholder="currency">
            <input v-model.number="newItem.quantity" type="number" placeholder="quantity">
            <button @click="addItem">submit</button>
        </div>
    </div>
</template>



<script>
import Item from './Item'
import Navigation from './Navigation'



export default {
    name: 'AdminHomePage',
    components: {
        Item,
        Navigation
    },
    data() {
        return {
            navPages: ['Stock', 'Add item'],
            currentPage: 0,
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
        archiveItemError(){
            return this.$store.getters.getStockError('archiveItemError');
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
        },
        changePage(index) {
            this.currentPage = index;
        }
    }
}
</script>

<style>
.admin-page {
    margin-left: 200px;
}
</style>