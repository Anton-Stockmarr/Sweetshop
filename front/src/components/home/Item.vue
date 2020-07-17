<template>
  <div class="item">
    {{name}}: {{description}}, {{quantity}}
    <button @click="addToOrder">Add</button>
  </div>
</template>

<script>
export default {
  name: 'Item',
  props: {
    id: Number,
    currency: String,
    description: String,
    name: String,
    price: Number,
    quantity: Number,
  },
  methods: {
    addToOrder() {
      this.$store.dispatch('changeCurrentOrder', 
        {changedItem:
          {id: this.id,
          currency: this.currency,
          description: this.description,
          name: this.name,
          price: this.price,
          quantity: this.quantity
          }, 
        amount: 1
      });
    }
  }
}
</script>

