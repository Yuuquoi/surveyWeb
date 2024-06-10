<script>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from 'echarts/components';
import VChart, { THEME_KEY } from 'vue-echarts';

use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
]);

export default {
    data() {
        return {
            list: [],
            list2: [],
            list3: [],
            selectList: [],
            shortAnswerList:[],
            index: "1",
            indexx:0,
            quId:"1",
            answers:[],
            questionNameList: [],
            questionNameList2: [],
            questionNameList3: [],
            title:"",
            // pushTest:[],
            // listTest:[this.list[0].result[1]],
            dataList: [],
            // listTest:[  { value: 1048, name: 'Search Engine' },
            //             { value: 735, name: 'Direct' },
            //             { value: 580, name: 'Email' },
            //             { value: 484, name: 'Union Ads' },
            //             { value: 300, name: 'Video Ads' }],
            quizId: this.$route.params.quizId,
            listKey: [],
            listValue: [],
            value: 0,
            option: {
                title: {
                    text: 'Traffic Sources',
                    left: 'center',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)',
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: [],
                },
                series: [
                    {
                        name: '',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                            },
                        },
                    },
                ],
            },

        }

    },
    components: {
        VChart,
    },
    provide: {
        [THEME_KEY]: 'dark',
    },
    computed: {

    },
    methods: {
        getInfo() {
            let obj = {
                quizId: this.quizId
            }
            fetch(`http://localhost:8080/quiz/find_info?quiz_id=${this.quizId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },

            })
                .then(res => res.json())
                .then((data) => {
                    this.list2.push(data);
                    this.list2[0].quizList.forEach((item, index) => {
                        if(this.list2[0].quizList[index].question_type !== "3"){
                            this.selectList.push(item)
                        }else{
                            this.shortAnswerList.push(item)
                        }
                        
                    });

                    for (let i = 0; i < this.selectList.length; i++) {
                        this.questionNameList.push(this.selectList[i].question_name)
                        
                    }

                    for (let i = 0; i < this.shortAnswerList.length; i++) {
                        this.questionNameList2.push(this.shortAnswerList[i].question_name)
                        
                    }
                    
                    // console.log(this.questionNameList2)
                    // console.log(this.selectList[this.index-1].question_name)
                    // console.log(this.shortAnswerList[1].question_id);

                })
        },
        change() {
            let obj = {
                quizId: this.quizId
            }
            fetch(`http://localhost:8080/quiz/statistics?quiz_id=${this.quizId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },

            })
                .then(res => res.json())
                .then((data) => {
                    this.list.push(data);
                    this.dataList.length = 0;
                    this.option.series[0].data.length = 0;
                    this.option.legend.data.length = 0;
                    this.listKey.length = 0;
                    this.listValue.length = 0;

                    Object.keys(this.list[0].result[this.index]).forEach((item, index) => {
                        this.listKey.push(item)
                    });

                    Object.values(this.list[0].result[this.index]).forEach((item, index) => {
                        this.listValue.push(item)
                    });

                    for (let i = 0; i < this.listKey.length; i++) {
                        this.dataList.push({ value: this.listValue[i], name: this.listKey[i] })
                    }

                    this.dataList.forEach((item, index) => {
                        this.option.series[0].data.push(item)
                    });

                    this.listKey.forEach((item, index) => {
                        this.option.legend.data.push(item)
                    });

                    // this.option.series[0].name = this.selectList[this.index].question_name
                    this.option.title.text = this.questionNameList[this.index-1]

                    console.log(this.option)
                    // console.log(this.option.title.text)
                    // console.log(Object.keys(this.list[0].result[1]));
                    // console.log(this.option.legend.data)
                    // console.log(this.dataList)
                    // console.log(this.selectList[this.index - 1].question_name);
                    // console.log(this.key)
                    // console.log(this.dataList)
                    // console.log(this.option.series[0].data)
                    // this.pushTest.push({name:'jjj', value: 111})
                    // console.log(this.pushTest)
                    // console.log(this.listKey)
                    // console.log(this.listValue)
                })
        },
        getAnswer(){
            let obj = {
                quizId: this.quizId,
                quId: this.quId
            }
            fetch(`http://localhost:8080/quiz/find_answer?quiz_id=${this.quizId}&qu_id=${this.quId}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },

            })
                .then(res => res.json())
                .then((data) => {
                    this.list3.length = 0;
                    this.answers.length = 0;
                    this.questionNameList3.length = 0;
                    this.list3.push(data);
                    // console.log(this.list3[0].answerList[0].answer)
                    this.questionNameList2.forEach((item, index) => {
                        this.questionNameList3.push(item)
                    });

                    
                    for(let i= 0; i<this.list3[0].answerList.length; i++){
                        this.answers.push(this.list3[0].answerList[i].answer)
                        
                    }

                    // this.title = e.target.options[e.target.options.selectedIndex].text
                    // console.log(this.list3)
                    // console.log(this.answers)
                })
        },
        goRou() {
            this.$router.push(`/test/${quizId}`)
        }

    },
    mounted() {
        this.getInfo()
        this.change()
        // this.getAnswer()
        // this.option.series[0].data = this.datalist
    }
}
</script>

<template>
    <select name="" id="" v-model="this.index" @change="this.change()">
        <option :value="index + 1" v-for="(item, index) in this.selectList">{{ item.question_name }}</option>
    </select>
    <select name="" id="" v-model="this.quId" @change="this.getAnswer()">
        <option :value="this.shortAnswerList[index].question_id" v-for="(item, index) in this.shortAnswerList" >{{ item.question_name }}</option>
    </select>
    <div class="shortAnswer" >
        <h1>{{ this.questionNameList3[this.quId-this.questionNameList.length-1] }}</h1>
        <h1 v-for="item in this.answers">{{ item }}</h1>
    </div>
    
    <button type="button"><RouterLink class="routeItem" to="/">返回</RouterLink></button>
    <v-chart class="chart" :option="this.option" autoresize />
    <!-- <h1>{{this.$route.params.quizId}}</h1> -->
    <!-- <button @click="this.change()">btn</button> -->
    <!-- <button @click="this.getInfo()">BTN</button> -->
</template>

<style scoped lang="scss">
.chart {
    width: 100%;
    height: 100vh;
    position: relative;

}
</style>