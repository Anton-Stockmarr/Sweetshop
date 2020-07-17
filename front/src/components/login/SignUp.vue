<template>
  <div class="sign-up">
    <h1>Sign up</h1>
    <h3 v-show="error">{{error}}</h3>
    <input type="text" v-model="email" placeholder="Email">
    <input type="text" v-model="name" placeholder="Name">
    <button @click="signUp()">Sign Up</button>
  </div>
</template>


<script>


export default {
  name: 'SignUp',
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
  },
  computed: {
    error() {
      return this.$store.getters.getError('signUpError');
    }
  }

}
</script>


<style scoped>
.sign-up {
  border: black 1px solid;
  background-color: #F8A100;
}

.sign-up input {
  margin: 5px;
}
</style>