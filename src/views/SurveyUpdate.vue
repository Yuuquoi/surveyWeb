<script>
import Update from '../components/survey/Update.vue'
import Done from '../components/survey/Done.vue';

export default{
    data(){
        return{
            mode:1,
            no: this.$route.params.surveyNo
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
    beforeCreate(){    // 確認登入
        if(!sessionStorage.getItem("ac")){
            this.$router.push(`/login`)
        }
    },
    created(){   // 抓取資料
        this.survey = JSON.parse(sessionStorage.getItem(this.$route.params.surveyNo));
        console.log(this.survey);
    },
    beforeUnmount() {  // 銷毀資料
        console.log(this.no);
        sessionStorage.removeItem(this.no);
    },
    components:{
        Update,
        Done
    }

}
</script>

<template>
    <div class="createHeader">
        <div class="block one">編輯</div>
        <div class="block two">確認</div>
        <div class="block three">完成</div>
    </div>
    <Update v-if="this.mode===1"  :survey="this.survey" @editEnd="modeChange" @changeColor="classChange" />
    <Done v-if="this.mode===2">
        <template v-slot:text>
            <p>編輯成功</p>
        </template>
        <template v-slot:button>
            <button type="button" @click="()=>{this.$router.push(`/member`)}">返回後臺</button>
        </template>
    </Done>
</template>

<style lang="scss" scoped>
</style>