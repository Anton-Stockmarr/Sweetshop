<template>
  <div class="admin-sign-in">
    <h1>Login as shop owner</h1>
    <h2>No authentication needed, the internet is build on trust</h2>
    <h3 v-show="errorStatus">{{errorMessage}}</h3>
    <button @click="login()">login</button>
  </div>
</template>


<script>


export default {
  name: 'AdminSignIn',
  props: {
    errorStatus : Boolean,
    errorMessage : String
  },
  data() {
    return {
    }
  },
  methods: {
    login() {
      this.$emit('adminLogin');
    }
  }
}
</script>

<style scoped>
.admin-sign-in {
  border: black 1px solid;
  background-color: #6C648B;
}
</style>