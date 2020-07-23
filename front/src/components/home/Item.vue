<template>
  <div class="item">
    <div class="info">
      <div class="name">
        {{name}}: {{`${price} ${currency}`}}
      </div>
      <div class="description">
        {{description}}
      </div>
    </div>
    <div class="options">
      <input v-if="admin" v-model.number="newQuantity" placeholder="new quantity">
      <button v-if="admin" @click="changeQuantity">Update quantity</button>
      <button v-if="admin" @click="removeItem">Remove item</button>
      <div class="quantity">
        {{(itemType==='stockItem' ? 'In stock:' : 'amount: ') + quantity}}
      </div>
      <button v-show="itemType==='stockItem' && this.quantity>0 && !admin" @click="changeOrder(1)">Add</button>
      <button v-show="itemType==='orderItem'" @click="changeOrder(-1)">Remove</button>
    </div>
    <br>
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
  data() {
    return {
      newQuantity: null
    }
  },
  computed: {
    admin() {
      return this.$store.getters.getAdminStatus;
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
      this.$store.dispatch('archiveItem', this.id);
    },
    changeQuantity() {
      this.$store.dispatch('changeItemQuantity', { id: this.id, quantity: this.newQuantity });
      this.newQuantity = null;
    }
  }
}
</script>


<style scoped>
.item {
  background-color: #6BBAA7;
  padding: 5px 10px;
  margin: 5px 0;
}

.info {
  float: left;
  max-width: 300px;
}

.options {
  float: right;
  height: 100%;
}

.name {
  font-size: 24px;
  text-align: left;
  line-height: 40px;
}

.description {
  font-size: 16px;
  line-height: 35px;
  text-align: left;
}

.quantity {
  font-size: 24px;
}

.options div, .options button {
  font-size: 18px;
  display: inline-block;
  line-height: 50px;
  margin: 12.5px 10px 12.5px;
  width: 150px;
}

.options input {
  margin: 12.5px 10px 12.5px;
  width: 150px;
  height: 45px;
  font-size: 18px;
}

button {
  cursor: pointer;
  border: none;
  background-color: #B6A19E;
}

button:hover {
  background-color: #6C648B;
}

br {
    clear: both;
}

</style>
