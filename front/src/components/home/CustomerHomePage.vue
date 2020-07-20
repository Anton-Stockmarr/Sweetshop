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
        <div v-show="placeOrderError">{{placeOrderError}}</div>
        <button @click="placeOrder">Place Order</button>
        <button >View orders</button>
        <div v-show="loadOrdersError">{{loadOrdersError}}</div>
    </div>
</template>



<script>
import Item from './Item'

export default {
    name: 'CustomerHomePage',
    components: {
        Item
    },
    computed: {
        items(){
            return this.$store.getters.getItems;
        },
        currentOrder(){
            return this.$store.getters.getCurrentOrder;
        },
        loadItemsError(){
            return this.$store.getters.getItemError('loadItemsError');
        },
        loadOrdersError(){
            return this.$store.getters.getItemError('loadOrdersError');
        },
        changeOrderError(){
            return this.$store.getters.getItemError('changeOrderError');
        },
        placeOrderError(){
            return this.$store.getters.getItemError('placeOrderError');
        }
    },
    mounted() {
        this.$store.dispatch('loadItems');
        this.$store.dispatch('loadOrders'); 
    },
    methods: {
        placeOrder() {
            this.$store.dispatch('placeOrder');
        }
    }

}
</script>

<style>

</style>