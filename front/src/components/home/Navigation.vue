<template>
    <div class="navigation-box">
        <div :key="index" v-for="(page, index) in pages" @click="changePage(index)">
              {{page}}
        </div>
        <div @click="logout">
            Log out
        </div>
    </div>
</template>

<script>
export default {
    name: 'Navigation',
    props: ["pages"],
    methods: {
        changePage(index){
            this.$emit('changePage',index);
        },
        logout(){
            this.$store.dispatch('logout');            
        }
    }
}
</script>

<style>
.navigation-box {
    width: 200px;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    float: left;
    background-color: #F8A100;
    padding-top: 10px;
}

.navigation-box div {
    cursor: pointer;
    transition: 0.3s;
    padding: 5px;
}

.navigation-box div:hover {
    background-color: #6C648B;
}


</style>