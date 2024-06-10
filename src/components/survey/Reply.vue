<script>
export default{
    data(){
        return{
            isChecked:false,
            editNow: 0,
            name:"",
            phone:"",
            email:"",
            age:"",
            ans:{},
            reply:{},
        }
    },
    methods:{
        /****** 操作頁面和資料的相關方法 ***** */
        changeCheck(){
            window.scrollTo(0, 0);
            this.isChecked = !this.isChecked;
            this.editNow = -1;
            this.$emit('changeColor','mode2');
        },
        replyEnd(){
            this.packageReply();       // 將資料塞進 OBJ 中
            this.saveAnsToDb();        // 將資料送入 DB
            this.$emit('replyEnd', 2)  // 改變畫面
        },
        packageReply(){
            // 塞基本資料
            this.reply.name = this.name;
            this.reply.phone = this.phone;
            this.reply.email = this.email;
            this.reply.age = this.age;
            // 塞答案
            for(let i = 0; i<this.survey.questionList.length; i++){  // i 代表題號
                let quiz = document.getElementsByName(`ans_${i}`);
                for(let j = 0; j < quiz.length; j++){    // j 代表每個選項
                    if(quiz[j].type === "text"){
                        this.ans[i] = quiz[j].value;
                    }
                    if(quiz[j].type === "radio"){
                        if(!quiz[j].checked){
                            continue;
                        }
                        this.ans[i] = quiz[j].value;
                    }
                    if(quiz[j].type === "checkbox"){
                        if(!quiz[j].checked){      // 沒選的選項直接跳走
                            continue;
                        }
                        if(!this.ans[i]){    // 如果 ans[i] 尚無值 (not definded)
                            this.ans[i] = quiz[j].value;
                            continue;
                        }
                        this.ans[i] += quiz[j].value;
                    }
                }
            }
            this.reply.answers = this.ans;
            console.log(this.reply);
        },
        // 把答案存入資料庫的方法
        saveAnsToDb(){
            console.log(JSON.stringify(this.reply.answers));
            let obj = {
                surveyNo: this.survey.no,
                name: this.reply.name,
                phone: this.reply.phone,
                email: this.reply.email,
                age: this.reply.age,
                answers: JSON.stringify(this.reply.answers)
            }
            fetch("http://localhost:8080/survey/reply", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
            })
            .then(res => res.json())
            .then((data) => {
                console.log(obj);
                console.log(data);
            });
        },
        /****** 使用者操作題目的相關方法 ***** */
        // 修改填寫對象
        changeEdit(n){
            if(this.isChecked){
                return;
            }
            if(this.editNow === n){
                return;
            }
            this.editNow = n;
        },

    },
    props:[
        "survey",
    ]
}
</script>

<template>
    <div class="replyBody">
        <!-- 問卷的名稱和描述 -->
        <div class="inputBasicInfo">
            <p id="surveyTitle">{{ this.survey.name }}</p>
            <span><p id="surveyTime">{{ this.survey.startDate }}　至　{{ this.survey.endDate }}</p></span>
            <p id="surveyDescription">{{ this.survey.description }}</p>
        </div>
        <div class="inputEachQuestion">
            <!-- 填寫基本資料 -->
            <div class="oneQuesBg" :class="{editQues: this.editNow === 0}">
                <div class="oneQues replyStaticBlock" @click="this.changeEdit(0)">
                        <div class="replyStatic">
                            <label for="name">姓名　<input type="text" name="name" id="name" v-model="this.name" :disabled="this.isChecked"></label>
                            <label for="phone">手機　<input type="text" name="phone" id="phone" v-model="this.phone" :disabled="this.isChecked"></label>
                            <label for="email">電郵　<input type="text" name="email" id="email" v-model="this.email" :disabled="this.isChecked"></label>
                            <label for="age">年齡　<input type="number" name="age" id="age" v-model="this.age" :disabled="this.isChecked"></label>
                        </div>
                </div>
            </div>
            <!-- 問題 -->
            <div class="oneQuesBg"  :class="{editQues: this.editNow === index+1}" v-for="(item, index) in this.survey.questionList" >
                <div class="oneQues" :id="'no_'+n":key="'no'+n" :class="{requiredStyle:item.required}" @click="this.changeEdit(index+1)"> <!-- n for no. -->
                <!-- 題目 -->
                <p class="questionName"><span style="color:rgb(211, 69, 95); font-size:2vw" v-if="item.required">*</span>{{ item.question }}</p>
                <!-- 簡答題 -->
                <div class="text" v-if="item.type === 'text'">
                    <input type="text" :name="'ans_'+index" :disabled="isChecked">
                </div>
                <!-- 選擇題 -->
                <div class="option" v-if="item.type !=='text'" v-for="op in item.option" :key="'option'+index">
                    <div class="oneOption">
                        <label v-if="item.type === 'm'"><input type="checkbox" :name="'ans_'+index" :value="op" :disabled="isChecked">　{{ op }}</label>
                        <label v-if="item.type === 's'"><input type="radio" :name="'ans_'+index" :value="op" :disabled="isChecked">　{{ op }}</label>
                    </div>
                </div>
            </div>
            </div>
        </div>
        <!-- 功能區塊 -->
        <div class="footerLink">
            <!-- 返回會員頁 -->
            <button class="cancelBtn" type="button" v-if="!this.isChecked" @click="()=>{$router.push('/')}">取消</button>
            <!-- 前往確認頁 -->
            <button class="checkBtn" type="button" v-if="!this.isChecked"  @click="this.changeCheck()">下一步</button>
            <!-- 返回確認頁 -->
            <button class="backEditBtn" type="button"  v-if="this.isChecked"  @click="this.changeCheck()">修改</button>
            <!-- 送出 -->
            <button class="sendBtn" type="button" v-if="this.isChecked" @click="this.replyEnd()">送出</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
label{
    display: block;
}
h1{
    color: black;
}
</style>