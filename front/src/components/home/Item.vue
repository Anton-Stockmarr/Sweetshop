<template>
  <div class="item">
    {{name}}: {{description}}, {{quantity}}
    <button>Add</button>
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
    admin: String
  }
}
</script>

