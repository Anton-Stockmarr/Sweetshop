<template>
  <div class="home">
    <div v-if="this.admin==='f'">
      Place order
      <div :key="item.id" v-for="item in items">
        <Item v-bind="item"/>
      </div>
      In basket:
      <button>Order</button>
      <button>View orders</button>
    </div>
    <div v-if="this.admin==='t'">
      Total stock:
      <div :key="item.id" v-for="item in items">
        <Item v-bind="item" :admin="this.admin"/>
      </div>
      Stock value:
      Add Item:
    </div>
  </div>
</template>

<script>
import Item from '../components/Item'
import axios from 'axios'

export default {
  name: 'Home',
  components: {
    Item
  },
  data() {
    return {
      items: []
    }
  },
  props: {
    userId: String,
    admin: String
  },
  mounted() {
    this.getStock();    
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
