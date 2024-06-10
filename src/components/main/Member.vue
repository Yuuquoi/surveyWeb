<script>
import { Logger } from 'sass'

export default{
    data(){
        return{
            ac:"",
            surveyName:"",
            startDate:"",
            endDate:"",
            dataComplete:[],  // 存放完整的 data
            data:[],          // 存放要顯示的 data
            showData:[],
            index:1,      // 現在在第幾頁
            high:10,      // 一頁最多呈現
            preview:false,
            previewClass:"",
            showItem:[],
            trash: false,
            delArr:[],
            searchShow: false,
            filterShow: false,
            filterChoose:[]      // 存放選擇的東西
        }
    },
    methods:{
        /****** 編輯功能 ******/
        // 傳送問卷內容到 sessionStorage
        pushData(item, mode){
            sessionStorage.setItem(item.no, JSON.stringify(item));
            switch (mode) {
                case 1:      // 編輯
                    this.$router.push(`/edit/${item.no}`);                
                    break;
                case 2:      // 結果
                    this.$router.push(`/result/${item.no}`);                
                    break;
                case 3:      // 統計 
                    if(item.state === "running"){
                        return;
                    }
                    this.$router.push(`/statistics/${item.no}`);                
                    break;   
            }
        },
        /****** 刪除功能 ******/
        goTrashCan(no, isOnlyThis){   // 判斷要刪除的是陣列的，還是只有傳入的這個
            if(isOnlyThis){
                let noList = [no];
                let obj = {
                    noList: noList
                }
                fetch("http://localhost:8080/survey/delete", {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(obj)
                })
                .then(res => res.json())
                .then((data) => {
                window.location.reload();
                this.delArr = [];
                return;
                });
            }
            if(this.delArr.length === 0){
                return;
            }
            let obj = {
                noList: this.delArr,
            }
            fetch("http://localhost:8080/survey/delete", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
            })
            .then(res => res.json())
            .then((data) => {
                window.location.reload();
                this.delArr = [];
            });
        },
        delEvent(e, item){     // 將勾選的物品丟入待刪除的陣列中
            e.stopPropagation();
            if( e.target.tagName === "INPUT" ){
                return;
            }
            let parent = document.getElementById(`${e.target.parentNode.parentNode.id}`);
            if ( item.state === "unstart" ) {
                if( parent.classList.contains("checked2") ) {
                    e.target.parentNode.parentNode.classList.remove("checked2");
                    this.delArr.splice(this.delArr.indexOf(item.no), 1);
                } else {
                    parent.classList.add("checked2");
                    this.delArr.push(item.no);           
                }
                return;
            }
            if ( item.state === "unpublish" ) {
                if( parent.classList.contains("checked1") ) {
                    e.target.parentNode.parentNode.classList.remove("checked1");
                    this.delArr.splice(this.delArr.indexOf(item.no), 1);
                } else {
                    parent.classList.add("checked1");
                    this.delArr.push(item.no);             
                }
            }
        },
        /******* 版面 ******/
        changeStatus(status){
            switch (status) {
                case 'unstart':
                    return '尚未開始'
                case 'unpublish':
                    return '尚未發布';
                case 'running':
                    return '進行中';
                case 'done':
                    return '已結束';
            }
        },
        changePreview(item){
            this.preview = !this.preview;
            this.previewClass = item.state;
            this.showItem = item;
        },
        btnEvent(n){
            if( this.index === n ){
                return;
            }
            this.index = n;
            this.changeShow();        // 修改 showItem 的內容
            window.scrollTo(0, 0);    // 跳到頁面最上
        },
        changeShow(){  // 修正該頁顯示的內容
            this.showData = [];   // 清空
            let i = 0 + (this.index-1)*10;   // 每頁的陣列起始 index
            let j = 10 + (this.index-1)*10;  // 每頁能塞的最大 index
            let h = j > this.data.length? this.data.length : j;   // 如果最大 index 超過陣列長度，那就用陣列長度作為該頁的上限
            for(i; i < h; i++){
                this.showData.push(this.data[i]);   // 根據剛剛設定好的 index 將資料放入要呈現的陣列中
            }  // 以上，接著再用 v-for 對此陣列做生成，每頁就可以生成剛好的物件

        },
        filterEvent(target){     // 篩選功能
            console.dir(target);
            if(target.checked){
                this.filterChoose.push(target.value);
            } else {
                this.filterChoose.splice(this.filterChoose.indexOf(target.value), 1);
            }
            console.log(this.filterChoose);
            // 初始化
            let delCheckbox = document.getElementsByName("delCheckbox");
                for(let item in delCheckbox){
                    if(delCheckbox[item].nodeName === "INPUT"){
                        console.log(delCheckbox[item].checked);
                        delCheckbox[item].checked = false;
                    }
                }
            this.delArr = [];
            this.data = [];
            this.index = 1;
            if(!this.filterChoose.length){   // 如果沒有任何篩選條件
                this.data = this.dataComplete;
                this.changeShow();
                return;
            }
            for(let item in this.dataComplete){
                if(this.filterChoose.includes(this.dataComplete[item].state)){
                    this.data.push(this.dataComplete[item]);
                }
            }
            this.changeShow();
        },
        searchVal(){
            let obj = {
                surveyName: this.surveyName,
                startDate: this.startDate,
                endDate: this.endDate,
                front: false,
                author: this.ac
            }
            fetch("http://localhost:8080/survey/search", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
            })
            .then(res => res.json())
            .then((data) => {
                // 清空 checkbox
                let checkbox = document.getElementsByName("filterCheckbox");
                console.dir(checkbox);
                for(let item in checkbox){
                    if(checkbox[item].nodeName === "INPUT"){
                        checkbox[item].checked = false;
                    }
                }
                // 清空 del-checkbox
                let delCheckbox = document.getElementsByName("delCheckbox");
                for(let item in delCheckbox){
                    if(delCheckbox[item].nodeName === "INPUT"){
                        console.dir(delCheckbox[item]);
                        delCheckbox[item].checked = false;
                    }
                }
                // 初始化
                this.dataComplete=[];
                this.delArr=[];
                this.data=[];
                this.filterChoose=[];
                this.surveyName="";
                this.startDate="";
                this.endDate="";
                this.index=1;
                this.filterShow=false;
                // 重新塞值，且必須用 push v-for 才能偵測變化
                for(let item in data.surveyList){
                    this.dataComplete.push(data.surveyList[item]);
                    this.data.push(data.surveyList[item]);                    
                }
                this.changeShow();
                console.log(data);
            });
        },
    },
    beforeCreate(){
        if(!sessionStorage.getItem("ac")){
            this.$router.push(`/login`)
        }
    },
    created(){
        this.ac = sessionStorage.getItem("ac");
    },
    beforeMount(){
        this.searchVal();
    },
}
</script>

<template>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
    <div class="memberPageTitle">
        <p>Hi</p>
        <p class="memberPageTitleAc">{{ this.ac }}</p>
        <p class="memberPageTitleIcon" :class="{functionShowOpen:this.searchShow}" @click="()=>{this.searchShow = !this.searchShow}"><i class="fa-solid fa-glasses"></i></p>
        <p class="memberPageTitleIcon" :class="{functionShowOpen:this.filterShow}" @click="()=>{this.filterShow = !this.filterShow}"><i class="fa-solid fa-filter"></i></p>
        <div class="filterBlock" v-show="this.filterShow">
            <label for="filterUnFaBu"><input type="checkbox" class="filterCheckbox" name="filterCheckbox" id="filterUnFaBu" value="unpublish" @change="(e)=>{filterEvent(e.target)}">尚未發布</label>
            <label for="filterUnKaiShi"><input type="checkbox" class="filterCheckbox" name="filterCheckbox" id="filterUnKaiShi" value="unstart" @change="(e)=>{filterEvent(e.target)}">尚未開始</label>
            <label for="filterGoing"><input type="checkbox" class="filterCheckbox" name="filterCheckbox" id="filterGoing" value="running" @change="(e)=>{filterEvent(e.target)}">進行中</label>
            <label for="filterEnd"><input type="checkbox" class="filterCheckbox" name="filterCheckbox" id="filterEnd" value="done" @change="(e)=>{filterEvent(e.target)}">已結束</label>
        </div>
        <p class="memberPageTitleIcon" @click="()=>{this.$router.push(`/create/${this.ac}`)}"><i class="fa-solid fa-pen-to-square"></i></p>
    </div>
    <div class="memberPreviewBlock" v-show="this.preview">
        <div class="mainPreviewBlock" :class="this.previewClass">
            <i class="fa-solid fa-xmark" id="xInmainPreviewBlock" @click="changePreview('')"></i>
            <p id="titleInPreviewBlock">{{ this.showItem.name }}</p>
            <p id="timeInPreviewBlock">{{ this.showItem.startDate }} - {{ this.showItem.endDate }}</p>
            <p id="describeInPreviewBlock">{{ this.showItem.description }}</p>
            <button id="goEditBtnInPreview" @click="this.pushData(this.showItem, 1)" v-show="this.showItem.state==='unpublish'||this.showItem.state==='unstart'">編輯</button>
            <button id="goTrashBtnInPreview" @click="this.goTrashCan(this.showItem.no, true)" v-if="this.showItem.state==='unpublish'||this.showItem.state==='unstart'">刪除</button>
            <button id="goReplyListBtnInPreview" @click="this.pushData(this.showItem, 2)" v-show="this.showItem.state==='running'||this.showItem.state==='done'">查看回覆</button>
            <button id="goReplyAnalysisBtnInPreview" @click="this.pushData(this.showItem, 3)" v-show="this.showItem.state==='running'||this.showItem.state==='done'">統計結果</button>
        </div>
    </div>
    <div class="searchAreaMember">
        <div class="searchBlock" v-if="this.searchShow">
            <div class="keywordBlock">
                <label for="keyword" class="searchBlockTextMember" id="keywordTitle">關鍵字</label>
                <input type="text" class="searchInput" id="keyword" v-model="this.surveyName" placeholder="（選填）">
            </div>
            <div class="timeBlock">
                <label for="startTime" class="searchBlockTextMember">統計時間</label>
                <input type="date" class="timeInput searchInput" id="startTime" v-model="this.startDate">
                <label for="endTime" class="searchBlockTextMember">至</label>
                <input type="date" class="timeInput searchInput" id="endTime" v-model="this.endDate">
                <button type="button" class="searcBtn" @click="this.searchVal()">搜尋</button>
            </div>
        </div>
    </div>
    <div class="searchResultAreaMember">
        <div class="oneResultTopBarMember">
            <p class="trash-can">
                <i class="fa-regular fa-trash-can" v-if="!this.trash" @mouseover="()=>{this.trash = !this.trash}"></i>
                <i class="fa-solid fa-trash-can" v-if="this.trash" @mouseout="()=>{this.trash = !this.trash}" @click="this.goTrashCan(0, false)"></i>
            </p>
            <p class="oneResultName">名稱</p>
            <p class="oneResultStatus">狀態</p>
            <p class="oneResultTime">開始時間 - 結束時間</p>
        </div>
        <div class="oneResultAreaMember" name="clickedArea" v-for="item in this.showData" :id="'div_'+item.no" :class="item.state"  @click="changePreview(item)">
            <label class="OneResultDel" v-if="item.state === 'unstart' || item.state === 'unpublish'" @click="(e)=>{this.delEvent(e, item)}">
                <input type="checkbox" name="delCheckbox">
                <span class="checkmark"></span>
            </label>
            <p class="oneResultName" :key="item.no">{{ item.name }}</p>
            <p class="oneResultStatus" :key="item.no" style="font-weight: 500">{{ this.changeStatus(item.state) }}</p>
            <p class="oneResultTime" :key="item.no">{{ item.startDate }} - {{ item.endDate }}</p>
        </div>
    <p class="errorMsgMember" v-if="!this.data.length">查無資料</p>
    <div class="searchBtnArea">
        <button v-for="n in Math.ceil(this.data.length/this.high)" @click="this.btnEvent(n)" :class="{searchIndexBtnClick:this.index===n}" >{{ n }}</button>
    </div>
    </div>
</template>

<style lang="scss" scoped>
.searchIndexBtnClick{
    background-color: rgb(94, 94, 94);
    color:white;
    border-radius: 50%;
    
}
.searchIndexBtnClick:hover{
        cursor: default;
}

.functionShowOpen{
    background-color: rgb(94, 94, 94);
    i{
        color: white;
    }
}
/* The OneResultDel */
.oneResultAreaMember{
    position: relative;
    .OneResultDel {
        position: absolute;
        left: 2.7vw;
        display: block;
        cursor: pointer;
        font-size: 22px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        top: 0vw;
    }
    /* Hide the browser's default checkbox */
    .OneResultDel input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
    }
    /* Create a custom checkbox */
    .checkmark {
    position: absolute;
    top: 0.8vw;
    left: 0;
    height: 3vw;
    width: 3vw;
    background-color: white;
    border-radius: 50%;
    border: 0.2vw solid;
    }
    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    }
    /* Show the checkmark when checked */
    .OneResultDel input:checked ~ .checkmark:after {
    display: block;
    }
    /* Style the checkmark/indicator */
    .OneResultDel .checkmark:after {
    left: 35%;
    top: 10%;
    width: 20%;
    height: 50%;
    border: solid white;
    border-width: 0 4px 4px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    }
}

.searchResultAreaMember{
    .unstart{
        border-color: rgb(239, 168, 56);
        position: relative;
        .oneResultStatus{
            color: rgb(239, 168, 56);        
        }
        /* When the checkbox is checked, add a blue background */
        .OneResultDel input:checked ~ .checkmark {
        background-color: rgb(239, 168, 56);
        border: 0.2vw solid rgb(239, 168, 56);
        }
        .checkmark {
            border-color: rgb(239, 168, 56);
        }
    }
    .unstart:hover{
        background-color: rgb(239, 168, 56);
        cursor: pointer;
        p{
            color: white;
        }
    }
    .running{
        border-color: rgb(211, 69, 95);
        .oneResultStatus{
            color: rgb(211, 69, 95);        
        }
    }
    .running:hover{
        background-color: rgb(211, 69, 95);
        cursor: pointer;
        p{
            color: white;
        }
    }
    .done{
        border-color: rgb(82, 169, 105);
        .oneResultStatus{
            color: rgb(82, 169, 105);
        }
    }
    .done:hover{
        background-color: rgb(82, 169, 105);
        cursor: pointer;
        p{
            color: white;
        }
    }
    .unpublish{
        border-color: rgb(55,135,235);
        .oneResultStatus{
            color: rgb(55,135,235);
        }
        /* When the checkbox is checked, add a blue background */
        .OneResultDel input:checked ~ .checkmark {
            background-color: rgb(55,135,235);
            border: 0.2vw solid rgb(55,135,235);
        }
        .checkmark {
            border-color: rgb(55,135,235);
        }
    }
    .unpublish:hover{
        background-color: rgb(55,135,235);
        cursor: pointer;
        p{
            color: white;
        }
    }
    .checked1{
        background-color: rgb(55,135,235);
        cursor: pointer;
        p{
            color: white;
        }
        .oneResultStatus{
            color: white;
        }
    }
    .checked2{
        background-color: rgb(239, 168, 56);
        cursor: pointer;
        p{
            color: white;
        }
        .oneResultStatus{
            color: white;
        }
    }
}

.memberPreviewBlock{
    z-index: 1;
    .unpublish{
        border-color: rgb(55,135,235);
        #xInmainPreviewBlock{
            color: rgb(55,135,235);
        }
        #goEditBtnInPreview{
            left: 18vw;
            background-color: rgb(55,135,235);
            cursor: pointer;
        }
        #goTrashBtnInPreview{
            right: 18vw;
            background-color: rgb(55,135,235);
            cursor: pointer;
        }
    }   
    .unstart{
        border-color: rgb(239, 168, 56);
        #xInmainPreviewBlock{
            color: rgb(239, 168, 56);
        }
        #goEditBtnInPreview{
            left: 18vw;
            background-color: rgb(239, 168, 56);
            cursor: pointer;
        }
        #goTrashBtnInPreview{
            right: 18vw;
            background-color: rgb(239, 168, 56);
            cursor: pointer;
        }
    }
    .running{
        border-color: rgb(211, 69, 95);
        #xInmainPreviewBlock{
            color: rgb(211, 69, 95);
        }
        #goReplyListBtnInPreview{
            left: 14vw;
            width: 13vw;
            background-color: rgb(211, 69, 95);
            cursor: pointer;
        }
        #goReplyAnalysisBtnInPreview{
            width: 13vw;
            right: 14vw;
            cursor: default;
        }
    }
    .done{
        border-color: rgb(82, 169, 105);
        #xInmainPreviewBlock{
            color: rgb(82, 169, 105);
        }
        #goReplyBtnInPreviewBlock{
            cursor: default;
        }
        #goReplyListBtnInPreview{
            left: 14vw;
            width: 13vw;
            background-color: rgb(82, 169, 105);
            cursor: pointer;
        }
        #goReplyAnalysisBtnInPreview{
            right: 14vw;
            width: 13vw;
            background-color: rgb(82, 169, 105);
            cursor: pointer;
        }
    }   
}
</style>