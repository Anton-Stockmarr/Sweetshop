<template>
  <div class="admin-sign-in">
    <h1>Login as shop owner</h1>
    <h2>No authentication needed, the internet is build on trust</h2>
    <h3 v-show="error">{{error}}</h3>
    <button @click="login">login</button>
  </div>
</template>


<script>


export default {
  name: 'AdminSignIn',
  methods: {
    login(){
      this.$store.dispatch('adminLogin');
    }
  },
  computed: {
    error() {
      return this.$store.getters.getError('adminSignInError');
    }
  }

}
</script>

<style scoped>
.admin-sign-in {
  border: black 1px solid;
  background-color: #6C648B;
}

.admin-sign-in button {
  width: 100px;
  
}
</style>