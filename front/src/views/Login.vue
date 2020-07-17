<template>
  <div class="login">
    <SignIn v-on:login="login"/>
    <SignUp v-on:signUp="signUp"/>
    <AdminSignIn v-on:adminLogin="adminLogin"/>
  </div>
</template>


<script>
import SignIn from '../components/login/SignIn'
import SignUp from '../components/login/SignUp'
import AdminSignIn from '../components/login/AdminSignIn'
import store from '../store'

export default {
  name: 'Login',
  store: store,
  components: {
    SignIn,
    SignUp,
    AdminSignIn
  },
  methods: {
    login(email) {
      this.$store.dispatch('login',email);
    },
    signUp(email, name) {
      this.$store.dispatch('signUp',{ email: email, name: name});
    },
    adminLogin(){
      this.$store.dispatch('adminLogin');
    }
  }
}
</script>


<style scoped>
.login {
  margin: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-auto-rows: 1fr;
  grid-gap: 20px;
  height: 300px;
}


</style>