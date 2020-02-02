<template>
    <div class="aom-tabs">
        <div class="tabs-panel" v-if="listData.length > 0">
            <el-tabs v-model="copyActiveName"  @tab-click="handleTabClick">
                <el-tab-pane v-for="item in listData"
                    :key="item.Name"
                    :label="item.Name"
                    :name="item.Name"
                >
                </el-tab-pane>
            </el-tabs>
        </div>  
        <div class="search-panel">
            <div class="search-input" @keyup.enter="search">
                <el-input type="text" v-model="queryString" :placeholder="placeholderText"></el-input>
            </div>
            <div class="search-add">
            <el-button type="primary" @click="actionAdd()" v-show="showButton">新建</el-button>
            </div>  
        </div>
    </div>
    
</template>
<script>
export default {
    name:'aom-tab',
    props:{
        listData:{
            type:Array,
            default(){
                return []
            }
        },
        activeName:{
            type:String,
            default(){
                return ''
            }
        },//当前tab的值
        defaultQueryString:{
            type:String,
            default() {
                return ''
            }
        },//默认查询的内容
        placeholderText:{
            type:String,
            default() {
                return ''
            }
        },
        showButton: {
            type: Boolean,
            default() {
                return true
            }
        }
    },
    data(){
        return {
            copyActiveName:'',
            queryString:''
        }
    },
    methods:{
        handleTabClick(tab, evt){
            this.$emit('on-tab-change', tab.name, this.queryString);
        },
        search(){
            this.$emit('on-search', this.copyActiveName, this.queryString);
        },
        actionAdd(){
            this.$emit('on-add', this.copyActiveName);
        }
    },
    watch:{
        'activeName' : function(v) {
            this.copyActiveName = v;
        },
        'defaultQueryString': function(v) {
            this.queryString = v;
        }
    }
}
</script>
