<template>
    <div>
        Place order
        <div :key="item.id" v-for="item in items">
        <Item v-bind="item"/>
        </div>
        In basket:
        <button>Order</button>
        <button>View orders</button>
    </div>
</template>



<script>
import Item from './Item'
import axios from 'axios'

export default {
    name: 'CustomerHomePage',
    components: {
        Item
    },
    computed: {
        items(){
            return this.$store.getters.getItems;
        }
    },
    mounted() {
        this.$store.dispatch('loadItems');    
    },
    methods: {
        getStock() {
            axios.get(`http://localhost:3000/api/items`)
                .then(response => this.items = response.data)
                .catch(err => console.log(err));

        }
    }

}
</script>

<style>

</style>