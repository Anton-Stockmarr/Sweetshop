<template>
    <div class="order">
        <div class="info">
            <div class="time">
                {{order_time}}
            </div>
            <div :key="index" v-for="(item, index) in this.items">
                {{item.amount}}x {{item.name}}
            </div>
        </div>
        <div class="price">
            Total cost: {{total_price}} EUR
        </div>
        <br>
    </div>
</template>

<script>
export default {
  name: 'Order',
  props: {
    items: Array,
    total_price: Number,
    order_time: String,
  },
  data() {
    return {
      newQuantity: 0
    }
  },
  computed: {
    admin() {
      return this.$store.getters.getAdminStatus;
    }
  },
  methods: {
  }
}
</script>


<style scoped>
.order {
  background-color: #6C648B;
  padding: 5px 10px;
  margin: 5px 0;
}


.time {
    font-size: 24px;
  line-height: 40px;
}

.info {
    float: left;
    text-align: left;
}

.price {
    float: right;
    font-size: 24px;
}

br {
    clear: both;
}
</style>
