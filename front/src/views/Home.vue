<template>
  <div class="home">
    <div v-if="!admin">
      <CustomerHomePage />
    </div>
    <div v-if="admin">
      <AdminHomePage />
    </div>
  </div>
</template>

<script>
import CustomerHomePage from '../components/home/CustomerHomePage'
import AdminHomePage from '../components/home/AdminHomePage'

export default {
  name: 'Home',
  components: {
    CustomerHomePage,
    AdminHomePage,
  },
  computed: {
    admin() {
      return this.$store.getters.getAdminStatus;
    }
  }
}
</script>
