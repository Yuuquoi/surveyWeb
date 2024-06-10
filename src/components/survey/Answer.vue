<script>
export default{
    data(){
        return{
            name:"",
            phone:"",
            email:"",
            age:"",
            ans:{},
            reply:{},
            disabled: true,
        }
    }
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
                <div class="oneQues replyStaticBlock">
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
                <div class="oneQues" :id="'no_'+n":key="'no'+n" :class="{requiredStyle:item.required}"> <!-- n for no. -->
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
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>