<template>
  <div class="login">
    <SignIn/>
    <SignUp/>
    <AdminSignIn/>
  </div>
</template>


<script>
import SignIn from '../components/login/SignIn'
import SignUp from '../components/login/SignUp'
import AdminSignIn from '../components/login/AdminSignIn'

export default {
  name: 'Login',
  components: {
    SignIn,
    SignUp,
    AdminSignIn
  },
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