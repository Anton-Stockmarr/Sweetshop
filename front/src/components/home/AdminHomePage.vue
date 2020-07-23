<template>
    <div class="admin-page">
        <div class="navigation">
            <Navigation :pages="this.navPages" v-on:changePage="changePage"/>
        </div>
        <div v-show="currentPage === 0">
            <h1>
                Items in stock
            </h1>
            <div v-show="loadItemsError">
                {{loadItemsError}}
            </div>
            <div v-show="archiveItemError">
                {{archiveItemError}}
            </div>
            <div v-show="changeQuantityError">
                {{changeQuantityError}}
            </div>
            <div :key="item.id" v-for="item in items">
                <Item v-bind="item" :itemType="'stockItem'"/>
            </div>
            <h2>
                Stock value: {{totalStockValue}} EUR
            </h2>
        </div>
        <div v-show="currentPage === 1">
            <h1>
                Add item
            </h1>
            <div v-show="addItemError">
                {{addItemError}}
            </div>
            <div class="form">
                <input v-model="newItem.name" type="text" placeholder="name" maxlength="50">
                <input v-model="newItem.description" type="text" placeholder="description" maxlength="200">
                <input v-model.number="newItem.price" type="number" placeholder="price">
                <select v-model="newItem.currency">
                    <option value="EUR">EUR</option>
                </select>
                <input v-model.number="newItem.quantity" type="number" placeholder="quantity">
                <button @click="addItem">submit</button>
            </div>
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
                currency: 'EUR',
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
            return this.$store.getters.getError('loadItemsError');
        },
        addItemError(){
            return this.$store.getters.getError('addItemError');
        },
        archiveItemError(){
            return this.$store.getters.getError('archiveItemError');
        },
        changeQuantityError(){
            return this.$store.getters.getError('changeQuantityError');
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
                    this.newItem.currency = 'EUR';
                    this.newItem.quantity = null;
                });
        },
        changePage(index) {
            this.currentPage = index;
        }
    }
}
</script>

<style scoped>
.admin-page {
    margin-left: 200px;
}

.form {
    margin: 0 10%;
    background-color: #6C648B;
    display: grid;
    padding: 20px;
}

.form input, .form button, .form select {
    margin: 10px 0;
    font-size: 20px;
    height: 40px;
}

.form button {
    background-color: #6BBAA7;
}

</style>