<template>
    <div class="customer-page">
        <div class="navigation">
            <Navigation :pages="this.navPages" v-on:changePage="changePage"/>
        </div>
        <div class="items" v-show="currentPage===0">
            <h1>Items in stock</h1>
            <div v-show="loadItemsError">{{loadItemsError}}</div>
            <div v-show="changeOrderError">{{changeOrderError}}</div>
            <div :key="item.id" v-for="item in items">
                <Item v-bind="item" :itemType="'stockItem'"/>
            </div>
        </div>
        <div class="basket" v-show="currentPage===1">
            <h1>In basket</h1>
            <div :key="`orderItem${item.id}`" v-for="item in currentOrder">
                <Item v-bind="item" :itemType="'orderItem'"/>
            </div>
            <h2>Total price: {{currentOrderPrice}}</h2>
            <div v-show="placeOrderError">{{placeOrderError}}</div>
            <button v-if="this.currentOrder.length!==0" @click="placeOrder">Place Order</button>
        </div>
        <div class="orders" v-show="currentPage===2">
            <h1>My orders</h1>
            <div v-show="loadOrdersError">
                {{loadOrdersError}}
            </div>
            <div :key="order.orderid" v-for="order in this.orders">
                <Order v-bind="order" /> 
            </div>
        </div>
    </div>
</template>



<script>
import Item from './Item'
import Order from './Order'
import Navigation from './Navigation'

export default {
    name: 'CustomerHomePage',
    components: {
        Item,
        Order,
        Navigation
    },
    data() {
        return {
            currentPage: 0
        }
    },
    computed: {
        items(){
            return this.$store.getters.getItems;
        },
        orders(){
            return this.$store.getters.getOrders;
        },
        currentOrder(){
            return this.$store.getters.getCurrentOrder;
        },
        currentOrderPrice() {
            return this.currentOrder.reduce( (prev, cur) => prev + cur.quantity*cur.price, 0) + " EUR";
        },
        loadItemsError(){
            return this.$store.getters.getStockError('loadItemsError');
        },
        loadOrdersError(){
            return this.$store.getters.getOrderError('loadOrdersError');
        },
        changeOrderError(){
            return this.$store.getters.getOrderError('changeOrderError');
        },
        placeOrderError(){
            return this.$store.getters.getOrderError('placeOrderError');
        },
        navPages() {
            return ['Items',`Basket [${this.currentOrderPrice}]`,'My orders'];
        }
    },
    mounted() {
        this.loadItems()
        .then( () => this.loadOrders() ); 
    },
    methods: {
        placeOrder() {
            this.$store.dispatch('placeOrder')
            .then( () => this.loadOrders() );
        },
        loadOrders() {
            return this.$store.dispatch('loadOrders'); 
        },
        loadItems() {
            return this.$store.dispatch('loadItems'); 
        },
        changePage(index) {
            this.currentPage = index;
        }
    }

}
</script>

<style>

.customer-page {
    margin-left: 200px;
}

.error {
    color: red;
}

.basket button {
    width: 300px;
    height: 75px;
    font-size: 24px;
}

</style>