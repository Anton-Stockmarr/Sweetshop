<template>
  <div class="item">
    {{name}}: {{description}}, {{quantity}}
    <button v-if="itemType==='stockItem'" @click="changeOrder(1)">Add</button>
    <button v-if="itemType==='orderItem'" @click="changeOrder(-1)">Remove</button>
    <button v-if="admin" @click="removeItem">Remove Item</button>
    <div v-if="removeItemError">{{removeItemError}}</div>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    itemType: String,
    id: Number,
    currency: String,
    description: String,
    name: String,
    price: Number,
    quantity: Number,
  },
  computed: {
    admin() {
      return this.$store.getters.getAdminStatus;
    },
    removeItemError() {
      return this.$store.getters.getStockError('removeItemError');
    }
  },
  methods: {
    changeOrder(amount) {
      this.$store.dispatch('changeCurrentOrder', 
        {changedItem:
          {id: this.id,
          currency: this.currency,
          description: this.description,
          name: this.name,
          price: this.price,
          quantity: this.quantity
          }, 
        amount: amount
      });
    },
    removeItem() {
      this.$store.dispatch('removeItem', this.id);
    }
  }
}
</script>

