<template>
  <div class="login">
    <SignIn :errorStatus="signInError.status" :errorMessage="signInError.message" v-on:login="login(email)"/>
    <SignUp :errorStatus="signUpError.status" :errorMessage="signUpError.message" v-on:signUp="login(email,name)"/>
    <AdminSignIn :errorStatus="adminError.status" :errorMessage="adminError.message" v-on:signUp="login()"/>
  </div>
</template>


<script>
import axios from 'axios'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'
import AdminSignIn from '../components/AdminSignIn'

export default {
  name: 'Login',
  components: {
    SignIn,
    SignUp,
    AdminSignIn
  },
  data() {
    return {
      email: '',
      userId: '123',
      admin: 'false',
      signInError: {
        status: false,
        message: ''
      },
      signUpError: {
        status: false,
        message: ''
      },
      adminError: {
        status: false,
        message: ''
      }
    }
  },
  methods: {
    login() {
      return axios.get(`http://localhost:3000/api/users?email=${this.email}`)
      .then(response => {
        if (this.setUserId(response.data)){
          this.$router.push({ path: `/home/${this.userId}/${this.admin ? 't' : 'f'}` });
        }
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status == 404) {
            this.error.status = true;
            this.error.message = "User not found";
          }
        }
      });
    },
    setUserId(userData) {
      this.userId = userData.id;
      this.admin = userData.admin;
      return true;      
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