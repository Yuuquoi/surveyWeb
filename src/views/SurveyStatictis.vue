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


export default{
    data(){
        return{
            no: this.$route.params.surveyNo,
            survey:{},
            result:{},
            errorShow: false,
            echartPackage:[],
            color:['#d3455f', '#efa838','#52a969', '#3787eb','#948979'], //自定義圓餅圖顏色
        }
    },
    methods: {
        // 抓取答案
        searchVal(){
            let no = this.no;
            fetch(`http://localhost:8080/survey/statistics?no=${no}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                if(data.rtnCode === "NO_REPLY"){
                    this.errorShow = true;
                    return;
                }
                
                // 塞入 echart packge
                this.result = data.result;
                for(let index in this.survey.questionList){   // 對每一題
                                    // 以下為 e-chart 變數
                let option = {
                tooltip: {   // 滑動效果
                    trigger: 'item',
                    formatter: '{b} : {c} ({d}%)',
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                data: [],
                },
                series: [{
                    type: 'pie',
                    radius: '80%',
                    center: ['54%', '50%'],
                    label: {            //調整標籤文字大小、樣式等等
                            textStyle: {
                                fontSize: '1.5vw',
                                fontFamily: '"Quicksand", "Noto Sans TC", sans-serif',
                                fontWeight: 600,
                                fontStyle: 'normal',
                            },
                        },
                    data: [],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                },],
            }
                    if(this.survey.questionList[index].type === "text"){
                        continue;
                    }
                    let ansCount = [];
                    for(let op in this.survey.questionList[index].option){   // 對每一個選項
                        let temp = {   // 儲存 每一個選項的 value 和 name
                            value: data.result[index][this.survey.questionList[index].option[op]], // 取得每一個選項的值 
                            name: this.survey.questionList[index].option[op]
                        }
                        console.log(temp);
                        ansCount.push(temp); 
                    }
                    console.log(ansCount);
                    this.echartPackage[index] = option;
                    this.echartPackage[index].data = this.survey.questionList[index].option;
                    this.echartPackage[index].series[0].data = ansCount;
                }
                console.log(this.result);
                console.log(this.echartPackage);
            });
        },
    },
    /****** E-chart 相關元件 ******/
    components: {
        VChart,
    },
    provide: {
        [THEME_KEY]: 'light',  // light
    },
    // 抓取問卷
    created(){
        this.survey = JSON.parse(sessionStorage.getItem(this.$route.params.surveyNo));
        this.searchVal();
        console.log(this.survey);
    },
    // 銷毀問卷
    beforeUnmount() {
        sessionStorage.removeItem(this.no);
    },
}
</script>

<template>
    <div class="statictisBody">
        <!-- 問卷標題 -->
        <div class="inputBasicInfo">
            <p id="surveyTitle">{{ this.survey.name }}</p>
            <span><p id="surveyTime">{{ this.survey.startDate }}　至　{{ this.survey.endDate }}</p></span>
            <p id="surveyDescription">{{ this.survey.description }}</p>
        </div>
        <!-- 查無回覆的錯誤訊息 -->
        <p class="errorMsg" v-if="this.errorShow">查無回覆</p>
        <!-- 每題的統計結果 -->
        <div class="allQuesArea" v-if="!this.errorShow">
            <div class="oneQues" v-for="(item, index) in this.survey.questionList">
                <!-- 題目 -->
                <p class="questionName"><span style="color:rgb(211, 69, 95); font-size:2vw" v-if="item.required">*</span>題目：{{ item.question }}</p>
                <!-- 選擇題 -->
                <p v-if="item.type!=='text'" class="showEachQues" v-for="(op, no) in item.option"><span>({{ no+1 }})　</span>{{ op }}</p>
                <v-chart v-if="item.type!=='text'" class="chart" :option="this.echartPackage[index]" />
                <!-- 簡答題 -->
                <div v-if="item.type==='text'" v-for="(v, k) in this.result[index]"><p class="ansText">{{ k }}</p><span class="ansTextNote">共 {{ v }} 筆</span></div>
            </div>
        </div>
        <!-- 返回會員頁 -->
        <button class="cancelBtn" type="button" v-if="!this.isChecked" @click="()=>{$router.push('/member')}">返回</button>
    </div>
</template>

<style lang="scss" scoped>
.chart {
    width: 60vw;
    height: 30vw;
}
</style>