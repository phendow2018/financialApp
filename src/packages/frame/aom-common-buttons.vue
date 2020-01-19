<template>
    <div class="aom-common-button-container">
        <div class="aom-common-button-content">
            <div class="aom-btn save-button" @click="save">保&nbsp;存</div>
            <el-button v-show="showAuditBtn" type="primary" @click="sendAudit" class="Audit-button">提交审核</el-button>
            <el-button v-show="showChangeVersionBtn" type="primary" @click="changedOrder" class="Audit-button">换版</el-button>
            <el-button v-show="showRescissoryOrder" type="primary" @click="rescissoryOrder" class="Audit-button">停播</el-button>
            <el-button v-show="showAuditOrder" type="primary" @click="AuditOrder" class="Audit-button">提交</el-button>
            <div class="aom-btn cancel-button" @click="cancel">取&nbsp;消</div>
        </div>
    </div>
</template>
<script>
export default {
    name:'aom-common-buttons',
    props:{
        showAuditBtn:{
            type:Boolean,
            default(){
                return false
            }
        },
        showChangeVersionBtn:{
            type:Boolean,
            default(){
                return false
            }
        },
        showRescissoryOrder:{
            type:Boolean,
            default(){
                return false
            }
        },
        showAuditOrder:{
            type:Boolean,
            default(){
                return false
            }
        }
    },
    methods:{
        save(){
            this.$emit('parentSave')
        },
        cancel(){
            this.$emit('parentCancel')
        },
        sendAudit(){
            this.$emit('sendAudit')
        },
        changedOrder(){
            this.$emit('changedOrder')
        },
        rescissoryOrder(){
            this.$emit('rescissoryOrder')
        },
        AuditOrder(){
            this.$emit('AuditOrder')
        }
    }
}
</script>
<style lang="less">
.aom-common-button-container{
    background-color: #fafafa;
    margin: 30px 0  60px 0;
    & .aom-common-button-content{
        padding: 16px;
        display: flex;
        flex-direction: row;
        justify-content:space-between;
        & .aom-btn{
            border-radius: 3px;
            font-size: 16px;
            font-weight: 400;
            padding: 9px 26px;
            cursor: pointer;
            display: inline-block;
            transition: background-color 100ms linear, border-color 100ms linear, color 100ms linear, box-shadow 100ms linear;
        }
        & .save-button{
            background-color: #1aaa55;
            border-color: #168f48;
            color: #fff;
            // float: left;
            &:hover{
                background-color: #168f48;
                border-color: #12753a;
                color: #fff;
                
            }
        }
        & .cancel-button{
            background-color: #fff;
            border-color: #e5e5e5;
            
            &:hover{
                background-color: #f0f0f0;
                border-color: #e3e3e3;
                color: #2e2e2e;
            }
        }
    }
}
</style>

