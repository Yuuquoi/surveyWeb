<script>
// https://juejin.cn/post/7144869033538486280 彩虹效果
export default{
    data(){
        return{
            
        }
    }
}
</script>

<template>
<div class="doneBody">
    <div class="rainbow">
        <ul>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    </div>
    <div class="functionBody">
        <slot name="text"></slot>
        <slot name="button"></slot>
    </div>
</div>
</template>

<style lang="scss" scoped>
</style>