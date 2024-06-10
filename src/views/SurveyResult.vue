<script>
export default{
    data(){
        return{
            no: this.$route.params.surveyNo,
            data:[],
            survey:{},
            errorShow:false,
            showData:[],
            index:1,
            high:10,
        }
    },
    methods: {
        searchVal(){
            let no = this.no;
            fetch(`http://localhost:8080/survey/result_list?no=${no}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data);
                if(!data.replyList.length){
                    this.errorShow = true;
                    return;
                }
                this.index=1;
                this.data = data.replyList;
                console.log(this.data);
                this.changeShow();
            });
        },
        btnEvent(n){
            if( this.index === n ){
                return;
            }
            this.index = n;
            console.log(this.index);
            this.changeShow();        // 修改 showItem 的內容
            window.scrollTo(0, 0);    // 跳到頁面最上
        },
        changeShow(){  // 修正該頁顯示的內容
            this.showData = [];   // 清空
            let i = 0 + (this.index-1)*this.high;   // 每頁的陣列起始 index
            let j = 10 + (this.index-1)*this.high;  // 每頁能塞的最大 index
            let h = j > this.data.length? this.data.length : j;   // 如果最大 index 超過陣列長度，那就用陣列長度作為該頁的上限
            for(i; i < h; i++){
                this.showData.push(this.data[i]);   // 根據剛剛設定好的 index 將資料放入要呈現的陣列中
            }  // 以上，接著再用 v-for 對此陣列做生成，每頁就可以生成剛好的物件
            console.log(this.showData);
        },
    },
    // 抓取問卷
    created(){
        this.searchVal();
        this.survey = JSON.parse(sessionStorage.getItem(this.$route.params.surveyNo));
        console.log(this.survey);
    },
    // 銷毀問卷
    beforeUnmount() {
        sessionStorage.removeItem(this.no);
    },
}
</script>

<template>
    <div class="resultDiv">
        <!-- 問卷標題 -->
        <div class="inputBasicInfo">
            <p id="surveyTitle">{{ this.survey.name }}</p>
            <span><p id="surveyTime">{{ this.survey.startDate }}　至　{{ this.survey.endDate }}</p></span>
            <p id="surveyDescription">{{ this.survey.description }}</p>
        </div>
        <!-- 查無回覆的錯誤訊息 -->
        <p class="errorMsg" v-if="this.errorShow">查無回覆</p>
        <!-- 顯示每個回覆 -->
        <div class="replyEach" >
            <div class="oneResultArea" v-for="item in this.showData" :class="item.state"  @click="changePreview(item)">
                <p class="oneResultName" :key="item.no">{{ item.name }}</p>
                <p class="oneResultName" :key="item.no">{{ item.phone }}</p>
                <p class="oneResultName" :key="item.no">{{ item.email }}</p>
            </div>
        </div>
        <div class="searchBtnArea">
            <button v-for="n in Math.ceil(this.data.length/this.high)" @click="this.btnEvent(n)" :class="{searchIndexBtnClick:this.index===n}" >{{ n }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
</style>