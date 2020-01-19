<template>
    <ul>
        <li :key='advCab.Id' v-for="advCab in copyData" v-show="copyData.length !== 0 ">
            <aom-line :item="advCab" @on-edit="onEdit" @on-delete="onDelete" @on-todetail="onTodetail" @edit-right="eidtRight" :enableToLink="enableToLink" @toUserRole="toUserRole" :showRightEditButton="showRightEditButton" :showEditButton="showEditButton">
            </aom-line>
        </li>
        <div class="no-relation-data" v-show="(listData && listData.length === 0)">没有相关数据!</div>
    </ul> 
</template>

<script>
import aomLine from './aom-line'
export default {
    components:{
        aomLine
    },
    props:{
        listData:{
            type:Array,
            default(){
                return []
            }
        },
        enableToLink: true,
        showRightEditButton:{
            type:Boolean,
            default(){
                return false
            }
        },
        showEditButton: {
            type:Boolean,
            default(){
                return true
            }
        }
    },
    data(){
        return {
            copyData:[]
        }
    },
    methods:{
        onEdit(item){
            this.$emit('on-edit', item);
        },
        onDelete(item){
            this.$emit('on-delete', item);
        },
        onTodetail(item){
            this.$emit('on-todetail', item);
        },
        eidtRight(item){
            this.$emit('edit-right', item);
        },
        toUserRole(item){
            this.$emit('toUserRole', item);
        }
    },
    watch:{
        listData:{
            handler: function(v){
                this.copyData = v
            },
            deep: true
        }
    }
}
</script>

<style lang="less" scoped>
ul li{
    list-style-type:none;
    height:70px;
    line-height: 70px;
    border-bottom:1px solid rgba(228, 228, 228, 1);
}
ul{
    padding: 0px;
    margin: 0px;
}

.no-relation-data{
    padding: 10px;
    color: #999999;
}
</style>


