<script>
import { RouterLink, RouterView } from 'vue-router'
export default{
    data(){
        return{
        }
    },
    methods:{
        checkLogin(){
            if(!sessionStorage.getItem("ac")){
                this.$router.push(`/login`)
            } else {
                this.$router.push(`/member`)
            }
        }
    }

}
</script>

<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <div class="area">
        <div class="logo" @click="() => {$router.push(`/`)}"></div>
        <div class="icon">
            <!-- <i class="fa-solid fa-moon"></i> -->
        </div>
            <!-- <i class="fa-solid fa-sun"></i> -->
            <RouterLink class="routeItem" to="/search"><i class="fa-solid fa-magnifying-glass"></i></RouterLink>
            <RouterLink class="routeItem" @click="this.checkLogin()" to="/login"><i class="fa-solid fa-user"></i></RouterLink>
        </div>
    <RouterView />
</template>

<style scoped>
</style>
