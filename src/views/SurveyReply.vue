<script>
import Reply from '../components/survey/Reply.vue';
import Done from '../components/survey/Done.vue';

export default{
    data(){
        return{
            no: this.$route.params.surveyNo,
            mode:1,
            survey:{},
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
    // 抓取問卷
    created(){
        this.survey = JSON.parse(sessionStorage.getItem(this.$route.params.surveyNo));
        console.log(this.survey);
    },
    // 銷毀問卷
    beforeUnmount() {
        sessionStorage.removeItem(this.no);
    },
    components:{
        Reply,
        Done
    }
}
</script>

<template>
    <div class="createHeader">
        <div class="block one">填寫</div>
        <div class="block two">確認</div>
        <div class="block three">完成</div>
    </div>
    <Reply v-if="this.mode===1" :survey="this.survey" @replyEnd="modeChange"  @changeColor="classChange" />
    <Done v-if="this.mode===2">
        <template v-slot:text>
            <p>感謝填寫</p>
        </template>
        <template v-slot:button>
            <button type="button" @click="()=>{this.$router.push(`/`)}">回主頁</button>
        </template>
    </Done>
</template>

<style lang="scss" scoped>
</style>