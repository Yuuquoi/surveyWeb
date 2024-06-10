<script>
export default{
    data(){
        return{
            isPw:false,
            enterAc:"",
            enterPW:""
        }
    },
    methods:{
        nextStep(){
            this.isPw = !this.isPw
        },
        login(){
            let obj = {
                account: this.enterAc,
                pw: this.enterPW
            }
            fetch("http://localhost:8080/survey/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                if(data.rtnCode === "SUCCESS"){
                    sessionStorage.setItem("ac", this.enterAc);
                    this.$router.push(`/member`);
                }
            });
        }
    }
}
</script>

<template>
    <div class="signInArea">
        <div class="signInWithEmalTitle loginComponent">
            <p>Sign in with account</p>
        </div>
        <div v-if="!this.isPw">
            <label class="signInWithEmailAcBlock loginComponent" for="">Your account</label>
            <input type="account" v-model="this.enterAc">
        </div>
        <div v-if="this.isPw">
            <label class="signInWithEmailAcBlock loginComponent" for="">Your password</label>
            <input type="password" v-model="this.enterPW">
        </div>
        <button class="loginBtn" v-if="!this.isPw" @click="this.nextStep()">Continue</button>
        <button class="loginBtn" v-if="this.isPw" @click="this.login()">Login</button>
    </div>
</template>

<style lang="scss" scoped>
</style>