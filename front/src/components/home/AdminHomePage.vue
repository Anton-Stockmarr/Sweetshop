<template>
    <div>
        Total stock:
        <div :key="item.id" v-for="item in items">
        <Item v-bind="item" :admin="this.admin"/>
        </div>
        Stock value:
        Add Item:
    </div>
</template>



<script>
import Item from './Item'



export default {
    name: 'AdminHomePage',
    components: {
        Item
    }
}
</script>

<style>

</style>