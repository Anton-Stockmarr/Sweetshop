<template>
  <div class="login">
    <SignIn v-on:login="login"/>
    <SignUp v-on:signUp="signUp"/>
    <AdminSignIn v-on:adminLogin="adminLogin"/>
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
  methods: {
    login(email) {
      axios.get(`http://localhost:3000/api/users?email=${email}`)
        .then(response => {
          let adminStatus = false;
          if (this.setUser(response.data, adminStatus)){
            this.$router.push({ path: `/home` });
          }
        })
        .catch(error => {
          if (error.response) {
            this.$store.dispatch('setError',{ name: 'signInError', message: error.response.data});
          }
        });
    },
    signUp(email, name) {
      axios.post(`http://localhost:3000/api/users?email=${email}&name=${name}`)
        .then(response => {
          let adminStatus = false;
          if (this.setUser(response.data, adminStatus)){
            this.$router.push({ path: `/home` });
          }
        })
        .catch(error => {
          if (error.response) {
            this.$store.dispatch('setError',{ name: 'signUpError', message: error.response.data});
          }
        });
    },
    adminLogin(){
      let adminStatus = true;
      if (this.setUser('',adminStatus)){
        this.$router.push({ path: `/home` });
      }
    },
    setUser(userData, adminStatus) {
      this.$store.dispatch('setAdminStatus',  adminStatus);
      if (!adminStatus) {
        this.$store.dispatch('setUserId', userData.id );
      }
      this.$store.dispatch('setLoggedIn', true );
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