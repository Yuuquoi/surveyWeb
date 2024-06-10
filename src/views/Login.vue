<script>

</script>

<template>
<div class="loginArea">
    <p class="loginTitle  loginComponent">Welcome</p>
    <button class="loginBtn loginComponent" >Sign in with Google</button>
    <button class="loginBtn loginComponent">Sign in with Facebook</button>
    <button class="loginBtn loginComponent">Sign in with Apple</button>
    <button class="loginBtn loginComponent" @click="() => {this.$router.push(`/login/signin`)}">Sign in with account</button>
    <p class="loginText loginComponent">No account?
        <RouterLink class="signupRouter" to="/login/signup">Create one</RouterLink>
    </p>
</div>
</template>

<style lang="scss" scoped>
</style>