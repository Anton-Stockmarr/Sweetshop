<template>
    <div>
        Items in stock
        <div v-show="loadItemsError">{{loadItemsError}}</div>
        <div v-show="changeOrderError">{{changeOrderError}}</div>
        <div :key="item.id" v-for="item in items">
            <Item v-bind="item" :itemType="'stockItem'"/>
        </div>
        In basket:
        <div :key="`orderItem${item.id}`" v-for="item in currentOrder">
            <Item v-bind="item" :itemType="'orderItem'"/>
        </div>
        Total price: {{currentOrderPrice}}
        <div v-show="placeOrderError">{{placeOrderError}}</div>
        <button @click="placeOrder">Place Order</button>
        <button @click="toggleShowOrders">View orders</button>
        <div v-show="loadOrdersError">
            {{loadOrdersError}}
        </div>
        <div v-show="showOrders" :key="order.orderid" v-for="order in this.orders">
            order {{order.orderid}}, cost: {{order.total_price}} 
        </div>
    </div>
</template>



<script>
import Item from './Item'

export default {
    name: 'CustomerHomePage',
    components: {
        Item
    },
    data() {
        return {
            showOrders: false
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
            return this.currentOrder.reduce( (prev, cur) => prev + cur.quantity*cur.price, 0);
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
        toggleShowOrders() {
            this.showOrders = !this.showOrders;
        }
    }

}
</script>

<style>

</style>