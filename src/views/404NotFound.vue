<script>
export default{
    data(){
        return{
            
        }
    }
}
</script>

<template>
    <p>Oops! 頁面不存在</p>
    <button class="cancelBtn" type="button" v-if="!this.isChecked" @click="()=>{$router.push('/')}">取消</button>
</template>

<style lang="scss" scoped>
    button{
        margin-top: 5vw;
        width: 10vw;
        height: 4vw;
        cursor: pointer;
    }
    .cancelBtn{
        display: block;
        position: relative;
        color: rgb(167, 166, 166);
        background-color: white;
        border: 0.2vw solid rgb(167, 166, 166);
        border-radius: 20px;
        padding-left: 1.5vw;
        &::before{
            content: "";
            width: 0vw;
            height: 0vw;
            border: 0.8vw solid;
            border-color: transparent rgb(167, 166, 166) transparent transparent ;
            position: absolute;
            left: 0.8vw;
            top: 1.1vw;
        }
        &:hover{
            background-color: rgb(167, 166, 166);
            color: white;
            &::before{
                border-color: transparent white transparent transparent ;
            }
        }
    }
</style>