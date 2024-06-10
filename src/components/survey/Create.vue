<script>
export default{
    data(){
        return{
            number: 1,   // n 代表總題數
            author: sessionStorage.getItem("ac"),
            surveyTitle:"",        // 問卷的名稱
            surveyStart:"",
            surveyEnd:"",
            surveyDescription:"",  // 問卷的描述
            qType:["s"],   // 每題的題型，(題號-1) 為該題的 index
            qOption:[["", ""], ["", ""] , ],      // 每題的選項內容，(題號-1) 為該題的 index
            qRequired:[],     // 每題是否為必填，必須把它和 div 做綁定，因為 div 的 n 才是正確的題號
            editNow: 1,       // 現在正在編輯的號碼
            isChecked: false, // 用來 disabled
            surveyCreateObj:{},
            quesList:[]
        }
    },
    methods:{
        /****** 操作頁面和資料的相關方法 ***** */
        changeCheck(){
            window.scrollTo(0, 0);
            this.isChecked = !this.isChecked;
            this.editNow = 0;
            this.$emit('changeColor','mode2');
        },
        createEnd(isPublished){
            // 將資料塞進 OBJ 中
            this.packageSurvey(isPublished);
            // 將資料送入 DB
            this.saveSurveyToDb();
            this.$emit('createEnd', 2)  // 改變畫面
        },
        saveSurveyToDb(){
            let obj = this.surveyCreateObj;
            console.log(obj);
            fetch("http://localhost:8080/survey/create", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
            });
        },
        packageSurvey(isPublished){
            // 塞基本資料
            this.surveyCreateObj.author =  sessionStorage.getItem("ac");
            this.surveyCreateObj.name = this.surveyTitle;
            this.surveyCreateObj.description = this.surveyDescription;
            this.surveyCreateObj.published = isPublished;
            this.surveyCreateObj.startDate = this.surveyStart;
            this.surveyCreateObj.endDate = this.surveyEnd;
            // 塞問題
            console.dir(document.getElementById(`no_1`));
            for(let i = 0; i < this.number; i++){
                let ques = {}; 
                ques.question = document.getElementById(`no_${i+1}`).childNodes[3].value;
                ques.type = this.qType[i];
                ques.required = !this.qRequired[i]? false: true;
                if(ques.type !== "text"){
                    ques.option = this.qOption[i].join(';');
                } else {
                    ques.option = "";
                }
                this.quesList.push(ques);
            }
            this.surveyCreateObj.questionListForCreate = this.quesList;
        },
        /****** 使用者操作題目的相關方法 ***** */
        // 修改填寫對象
        changeEdit(n){
            if(this.editNow === n){
                return;
            }
            this.editNow = n;
        },
        // 設為必填
        setRequired(no){   // 傳入要新增的題號
            console.log(no);
            this.qRequired[no-1] = !this.qRequired[no-1];
        },
        // 添加選項
        addOption(no){   // 傳入要新增選項的題號
            this.qOption[no-1].push("");
        },
        // 刪除選項
        removeOption(no, index){   // 傳入題號和要被刪除的選項
            this.qOption[no-1].splice(index, 1);
        },
        // 添加問題
        addQuestion(){
            // 增加題數，設定新題目的題型，設定新題目的預設選項
            this.number ++;
            this.qType[this.number-1] = "s";
            this.qOption[this.number-1]=["",""];
            this.changeEdit(this.number);
        },
        // 刪除問題
        removeQuestion(index){   // 傳入要被刪除的題號
            if(this.number === 1){     // 當只有一個問題時，不可刪除 
                return;
            }
            if(this.number === index){   // 當刪除的是最後一筆問題時，直接刪除即可，前面的問題不受影響
                this.number--;
                return;
            }
            for(let i = index; i < this.number; i++){              // 當刪除的不是最後一筆問題時，需要搬移該筆問題之後的資料 ( i+1 移到 i 的位置 )
                let replaced = document.getElementById("no_"+i);
                let replaceObj = document.getElementById("no_"+(i+1));
                replaced.childNodes[3].value = replaceObj.childNodes[3].value;   // 題目名稱
            }
            this.qType.splice(index-1, 1);
            this.qOption.splice(index-1, 1);
            this.number--;
        }
    },
    created(){
        this.surveyStart = new Date;
        this.surveyStart = this.surveyStart.toISOString().split('T')[0];
        // this.surveyStart.setDate(this.surveyStart.getDate() + 2);
        this.surveyEnd = new Date;
        this.surveyEnd = this.surveyEnd.toISOString().split('T')[0];
        // this.surveyEnd.setDate(this.surveyEnd.getDate()+9);
    }
}
</script>

<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <div class="createBody">
        <!-- 問卷的名稱和描述 -->
        <div class="inputBasicInfo" @click="this.changeEdit(0)">
            <input id="surveyTitle" type="text" placeholder="未命名的問卷" v-model.lazy="this.surveyTitle" :disabled="isChecked">
            <label>起訖時間：　<input id="surveyTime" v-model.lazy="this.surveyStart" type="date" :disabled="isChecked">
                　至　
                <input id="surveyTime" v-model.lazy="this.surveyEnd" type="date" :disabled="isChecked"></label>
            <input id="surveyDescription" type="text" placeholder="問卷描述" v-model.lazy="this.surveyDescription" :disabled="isChecked">
        </div>
        <!-- 問題 -->
        <div class="inputEachQuestion">
            <div class="oneQuesBg"  :class="{editQues: this.editNow === n}" v-for="n in this.number" >
                <div class="oneQues" :id="'no_'+n":key="'no'+n" :class="{requiredStyle:this.qRequired[n-1]}" @click="this.changeEdit(n)"> <!-- n for no. -->
                <!-- 題目 -->
                <span style="color:rgb(211, 69, 95); font-size:2vw" v-if="this.qRequired[n-1]">*</span>
                <input class="questionName" type="text" placeholder="未命名的問題" :disabled="isChecked">
                <!-- 題型 -->
                <select class="questionType" :name="'type_'+n" v-model.lazy="this.qType[n-1]" :disabled="isChecked">
                    <option value="s">◉ 單選題</option>
                    <option value="m">☑ 多選題</option>
                    <option value="text">☰ 簡答題</option>
                </select>
                <!-- 選擇題 -->
                <div class="option" v-if="this.qType[n-1] !=='text' && this.qType[n-1]">
                    <div class="oneOption" v-for="(item, index) in this.qOption[n-1]"  :key="'option'+index">
                        <span class="OinLeft" v-if="this.qType[n-1]==='s'">○</span>
                        <span class="OinLeft" v-if="this.qType[n-1]==='m'">□</span>
                        <input class="optionInmiddle" type="text" :placeholder="'選項 '+(index+1)" v-model.lazy="this.qOption[n-1][index]" :disabled="isChecked">
                        <!-- 刪除選項 -->
                        <span class="XinRight" @click="this.removeOption(n, index)" v-if="this.editNow === n">⨉</span>
                    </div>
                    <!-- 新增選項 -->
                    <div class="addOption" @click="this.addOption(n)" v-if="this.editNow === n">
                        <span class="OinLeft" v-if="this.qType[n-1]==='s'">○</span>
                        <span class="OinLeft" v-if="this.qType[n-1]==='m'">□</span>
                        <span v-if="this.editNow === n">　新增選項</span>
                    </div>
                </div>
                <!-- 簡答題 -->
                <div class="text" v-if="this.qType[n-1] ==='text'">
                    <input type="text" value="簡答文字" disabled>
                </div>
                <!-- 編輯時的工具列 -->
                <div class="editTool" v-if="this.editNow === n">
                    <p>
                        <!-- 刪除題目 -->
                        <i class="fa-solid fa-trash" @click="this.removeQuestion(n)"></i>
                        <!-- 必填 -->
                        <span :class="{red: this.qRequired[n-1]}">　必填 </span>
                        <i class="fa-solid fa-toggle-off fa-flip-vertical" v-if="!this.qRequired[n-1]" @click="this.setRequired(n)"></i><i class="fa-solid fa-toggle-on fa-flip-vertical" style="color: rgb(211, 69, 95)" v-if="this.qRequired[n-1]" @click="this.setRequired(n)"></i>
                    </p>
                </div>
            </div>
            </div>
        </div>
        <!-- 功能區塊 -->
        <div class="footerLink">
            <!-- 返回會員頁 -->
            <button class="cancelBtn" type="button" v-if="!this.isChecked" @click="()=>{$router.push('/member')}">取消</button>
            <!-- 增加問題 -->
            <div class="addQFunction" @click="this.addQuestion()" v-if="!this.isChecked">
                <i class="fa-solid fa-plus"></i>
            </div>
            <!-- 前往確認頁 -->
            <button class="checkBtn" type="button" v-if="!this.isChecked"  @click="this.changeCheck()">下一步</button>
            <!-- 返回確認頁 -->
            <button class="backEditBtn" type="button"  v-if="this.isChecked"  @click="this.changeCheck()">修改</button>
            <!-- 送出 -->
            <button class="sendBtn" type="button" v-if="this.isChecked" @click="this.createEnd(false)">僅儲存</button>
            <button class="sendBtn" type="button" v-if="this.isChecked" @click="this.createEnd(true)">發布</button>
        </div>
    </div>
</template>
<style lang="scss" scoped>
</style>