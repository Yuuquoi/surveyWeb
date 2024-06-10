<script>
import Create from '../components/survey/Create.vue';
import Done from '../components/survey/Done.vue';

export default{
    data(){
        return{
            mode:1,
        }
    },
    methods:{
        modeChange(mode){
            // 根據傳入的模式，進行切換
            this.mode = mode;
            this.classChange("mode3");
        },
        classChange(className){
            let createHeader = document.querySelector(".createHeader");
            console.dir(createHeader.classList);
            if(className === "mode3"){
                createHeader.classList.add(className);
                return;
            }
            if(!createHeader.classList.contains("mode2")){
                createHeader.classList.add(className);
                return;
            }
            createHeader.classList.remove(className);
        }
    },
    beforeCreate(){
        if(!sessionStorage.getItem("ac")){
            this.$router.push(`/login`)
        }
    },
    components:{
        Create,
        Done
    },
}
</script>

<template>
    <div class="createHeader">
        <div class="block one">新增</div>
        <div class="block two">確認</div>
        <div class="block three">完成</div>
    </div>
    <Create v-if="this.mode===1" @createEnd="modeChange" @changeColor="classChange" />
    <Done v-if="this.mode===2">
        <template v-slot:text>
            <p>新增成功</p>
        </template>
        <template v-slot:button>
            <button type="button" @click="()=>{this.$router.push(`/member`)}">返回後臺</button>
        </template>
    </Done>
</template>

<style lang="scss" scoped>
</style>