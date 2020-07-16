<template>
  <div class="sign-in">
    <h1>Login with email</h1>
    <h3 v-show="errorStatus">{{errorMessage}}</h3>
    <input type="text" v-model="email">
    <button @click="login()">login</button>
  </div>
</template>


<script>


export default {
  name: 'SignIn',
  props: {
    errorStatus : Boolean,
    errorMessage : String
  },
  data() {
    return {
      email: ''
    }
  },
  methods: {
    login() {
      this.$emit('login',this.email);
    }
  }
}
</script>

<style scoped>
.sign-in {
  border: black 1px solid;
  background-color: #6BBAA7;
}


</style>