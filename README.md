# 動態問卷(前端)
## 使用工具
前端：Vue、JavaScript、HTML、SCSS

[後端](https://github.com/Yuuquoi/survey)：Java、Spring Boot、MySQL

## 畫面呈現
### 首頁
![image](./readme/home.png)
### 搜尋
![image](./readme/search.png)
### 會員
![image](./readme/member.png)
### 結果統計
![image](./readme/statistics.png)
![image](./readme/statistics-pieChart.png)
![image](./readme/statistics-count.png)

## 功能呈現
### 新增、編輯問卷
![image](./readme/add.png)
### 搜尋和篩選功能
![image](./readme/member-function.png)
### 根據會員和問卷狀態顯示功能
#### 非會員 && 問卷狀態為開放中
![image](./readme/survey-function4.png)
#### 非會員 && 問卷狀態為已結束或尚未開放
![image](./readme/survey-function5.png)
#### 會員 && 問卷狀態為尚未發布或尚未開始
![image](./readme/survey-function3.png)
#### 會員 && 問卷狀態為進行中
![image](./readme/survey-function1.png)
#### 會員 && 問卷狀態為已結束
![image](./readme/survey-function2.png)

## 設置 ( Setup )
```sh
npm install
```
### Compile and Hot-Reload for Development
```sh
npm run dev
```
### Compile and Minify for Production
```sh
npm run build
```
