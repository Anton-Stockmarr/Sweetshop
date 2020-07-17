<template>
  <div class="sign-in">
    <h1>Login</h1>
    <h3 v-show="error">{{error}}</h3>
    <input type="text" v-model="email" placeholder="mail">
    <button @click="login">login</button>
  </div>
</template>


<script>


export default {
  name: 'SignIn',
  data() {
    return {
      email: ''
    }
  },
  methods: {
    login() {
      this.$store.dispatch('login',this.email);
    }
  },
  computed: {
    error() {
      return this.$store.getters.getError('signInError');
    }
  }
}
</script>

<style scoped>
.sign-in {
  border: black 1px solid;
  background-color: #6BBAA7;
}

.sign-in input {
  margin: 5px;
}


</style>