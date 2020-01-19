<template>
    <div class="edit-tips-container">
        <div class="edit-tips-content">
            <span class="edit-tips-name">{{editTipsName}}</span><span  v-if="!!editItemName" class="edit-item-name">:&nbsp;{{editItemName}}</span>
        </div>
        
    </div>
</template>
<script>
export default {
    name:'aom-edit-tips',
    props:{
        editTipsName:{
            type:String
        },
        editItemName:{
            type:String
        }
    },
    data(){
        return{
        }
    }
}
</script>
<style lang="less">
.edit-tips-container{
    position: relative;
    & .edit-tips-content{
        font-size: 17px;
        color:rgb(46, 46, 46);
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }
}
</style>

