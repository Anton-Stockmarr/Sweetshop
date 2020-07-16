<template>
  <div class="sign-up">
    <h1>Sign up</h1>
    <h3 v-show="errorStatus">{{errorMessage}}</h3>
    <input type="text" v-model="email">
    <input type="text" v-model="name">
    <button @click="signUp()">Sign Up</button>
  </div>
</template>


<script>


export default {
  name: 'SignUp',
  props: {
    errorStatus : Boolean,
    errorMessage : String
  },
  data() {
    return {
      email: '',
      name: ''
    }
  },
  methods: {
    signUp() {
      this.$emit('signUp',this.email,this.name);
    }
  }
}
</script>


<style scoped>
.sign-up {
  border: black 1px solid;
  background-color: #F8A100;
}
</style>