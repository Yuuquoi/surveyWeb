<script>
export default{
    data(){
        return{
            index:1,      // 現在在第幾頁
            high:10,      // 一頁最多呈現
            dataComplete:[],  // 存放完整的 data
            data:[],          // 存放要顯示的 data
            showData:[],  // 儲存該頁要呈現的值
            surveyName:"",
            startDate:"",
            endDate:"",
            preview:false,
            previewClass:"",
            showItem:[],
            filterChoose:[]      // 存放選擇的東西
        }
    },
    methods:{
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
        filterEvent(target){     // 篩選功能
            console.dir(target);
            if(target.checked){
                this.filterChoose.push(target.value);
            } else {
                this.filterChoose.splice(this.filterChoose.indexOf(target.value), 1);
            }
            console.log(this.filterChoose);
            // 初始化
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
        searchVal(){
            let obj = {
                surveyName: this.surveyName,
                startDate: this.startDate,
                endDate: this.endDate,
                front: true,
                author: ""
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
                // 初始化
                this.dataComplete=[];
                this.data=[];
                this.filterChoose=[];
                this.surveyName="";
                this.startDate="";
                this.endDate="";
                this.index=1;
                // 重新塞值，且必須用 push v-for 才能偵測變化
                for(let item in data.surveyList){
                    this.dataComplete.push(data.surveyList[item]);
                    this.data.push(data.surveyList[item]);                    
                }
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
        changePreview(item){
            this.preview = !this.preview;
            this.previewClass = item.state;
            this.showItem = item;
        },
        pushData(item){
            if(item.state !== "running"){
                return;
            }
            sessionStorage.setItem(item.no, JSON.stringify(item));
            this.$router.push(`/reply/${item.no}`);
        }
    },
    beforeMount(){
        this.searchVal();
    },
}
</script>

<template>
    <div class="homePreviewBlock" v-if="preview">
        <div class="mainPreviewBlock" :class="this.previewClass">
            <i class="fa-solid fa-xmark" id="xInmainPreviewBlock" @click="changePreview('')"></i>
            <p id="titleInPreviewBlock">{{ this.showItem.name }}</p>
            <p id="timeInPreviewBlock">{{ this.showItem.startDate }} - {{ this.showItem.endDate }}</p>
            <p id="describeInPreviewBlock">{{ this.showItem.description }}</p>
            <button id="goReplyBtnInPreviewBlock" @click="pushData(this.showItem)">填寫</button>
        </div>
    </div>
    <div class="searchArea">
        <div class="searchBlock">
            <div class="keywordBlock">
                <label for="keyword" class="searchBlockText" id="keywordTitle">關鍵字</label>
                <input type="text" class="searchInput" id="keyword" v-model="this.surveyName" placeholder="（選填）">
            </div>
            <div class="timeBlock">
                <label for="startTime" class="searchBlockText">統計時間</label>
                <input type="date" class="timeInput searchInput" id="startTime" v-model="this.startDate">
                <label for="endTime" class="searchBlockText">至</label>
                <input type="date" class="timeInput searchInput" id="endTime" v-model="this.endDate">
                <button type="button" class="searcBtn" @click="this.searchVal()">搜尋</button>
            </div>
            <div class="filterBlock">
                <span>篩選</span>
                <input type="checkbox" class="filterCheckbox" name="filterCheckbox" id="filterUnKaiShi" value="unstart" @change="(e)=>{filterEvent(e.target)}"><label for="filterUnKaiShi">尚未開始</label>
                <input type="checkbox" class="filterCheckbox" name="filterCheckbox" id="filterGoing" value="running" @change="(e)=>{filterEvent(e.target)}"><label for="filterGoing">進行中</label>
                <input type="checkbox" class="filterCheckbox" name="filterCheckbox" id="filterEnd" value="done" @change="(e)=>{filterEvent(e.target)}"><label for="filterEnd">已結束</label>
            </div>
        </div>
    </div>
    <div class="searchResultArea">
        <div class="oneResultTopBar">
            <p class="oneResultName">名稱</p>
            <p class="oneResultStatus">狀態</p>
            <p  class="oneResultTime">開始時間 - 結束時間</p>
        </div>
        <div class="oneResultArea" v-for="item in this.showData" :class="item.state"  @click="changePreview(item)">
        <p class="oneResultName" :key="item.no">{{ item.name }}</p>
        <p class="oneResultStatus" :key="item.no" style="font-weight: 500">{{ this.changeStatus(item.state) }}</p>
        <p class="oneResultTime" :key="item.no">{{ item.startDate }} - {{ item.endDate }}</p>
    </div>
    <p class="errorMsg" v-if="!this.data.length">查無資料</p>
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

.searchResultArea{
    .unstart{
    border-color: rgb(239, 168, 56);
    .oneResultStatus{
        color: rgb(239, 168, 56);        
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
}

.homePreviewBlock{
    .unstart{
        border-color: rgb(239, 168, 56);
        #xInmainPreviewBlock{
            color: rgb(239, 168, 56);
        }
        #goReplyBtnInPreviewBlock{
            cursor: default;
        }
    }
    .running{
        border-color: rgb(211, 69, 95);
        #xInmainPreviewBlock{
            color: rgb(211, 69, 95);
        }
        #goReplyBtnInPreviewBlock{
            background-color: rgb(211, 69, 95);
            cursor: pointer;
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
    }
}
</style>