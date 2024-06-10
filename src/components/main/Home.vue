<script>
import 'https://unpkg.com/mitt/dist/mitt.umd.js';

const emitter = mitt();

export default{
    data(){
        return{
            one:[],
            two:[],
            three:[],
            preview:false,
            theme: "",
            red: "#d44760",
            yellow: "rgb(239, 168, 56)",
            green: "rgb(82, 169, 105",
            showItem:{}
        }
    },
    methods:{
        changePreview(color, item){
            this.preview = !this.preview;
            this.theme = `${color}`;
            this.showItem = item;
        },
        pushData(item){
            sessionStorage.setItem(item.no, JSON.stringify(item));
            this.$router.push(`/reply/${item.no}`);
        }
    },
    beforeCreate(){
        fetch("http://localhost:8080/survey/search_for_home?type=1",{
            method: 'GET',
            headers:{
                "Content-Type":"application/json"
            },
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            this.one = data.surveyList;
            // console.log(this.one);
        });
        fetch("http://localhost:8080/survey/search_for_home?type=2",{
            method: 'GET',
            headers:{
                "Content-Type":"application/json"
            },
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            this.two = data.surveyList;
            // console.log(this.two);
        });
        fetch("http://localhost:8080/survey/search_for_home?type=3",{
            method: 'GET',
            headers:{
                "Content-Type":"application/json"
            },
        })
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            this.three = data.surveyList;
            // console.log(this.three);
        });
    },
}
</script>

<template>
    <div class="areaHome">
        <div class="homePreviewBlock" v-if="preview">
            <div class="mainPreviewBlock" :style="{borderColor:this.theme}">
                <i class="fa-solid fa-xmark" id="xInmainPreviewBlock" @click="changePreview('')" :style="{color:this.theme}"></i>
                <p id="titleInPreviewBlock">{{ this.showItem.name }}</p>
                <p id="timeInPreviewBlock">{{ this.showItem.startDate }} - {{ this.showItem.endDate }}</p>
                <p id="describeInPreviewBlock">{{ this.showItem.description }}</p>
                <button id="goReplyBtnInPreviewBlock" :style="{backgroundColor:this.theme}" @click="pushData(this.showItem)">填寫</button>
            </div>
        </div>
        <div class="block" id="one">
            <div class="textBlock">
                <h1 class="title">即將結束</h1>
            </div>
            <div class="showBlock">
                <div class="showOneBlock" v-for="item in this.one" @click="changePreview(this.red, item)" >
                    <p class="homeShowTitle">{{ item.name }}
                        <p class="homeShowNote">{{ item.startDate }} - {{ item.endDate }}</p>
                    </p>
                </div>
            </div>
        </div>
        <div class="block" id="two">
            <div class="textBlock">
                <h1 class="title">最近開始</h1>
            </div>
            <div class="showBlock">
                <div class="showOneBlock" v-for="item in this.two" @click="changePreview(this.yellow, item)">
                    <p class="homeShowTitle">{{ item.name }}
                        <p class="homeShowNote">{{ item.startDate }} - {{ item.endDate }}</p>
                    </p>
                </div>
            </div>
        </div>
        <div class="block" id="three">
            <div class="textBlock">
                <h1 class="title">即將開始</h1>
            </div>
            <div class="showBlock">
                <div class="showOneBlock" v-for="item in this.three"  @click="changePreview(this.green, item)">
                    <p class="homeShowTitle">{{ item.name }}
                        <p class="homeShowNote">{{ item.startDate }} - {{ item.endDate }}</p>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

</style>