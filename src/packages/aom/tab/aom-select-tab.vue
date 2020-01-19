<template>
    <div class="aom-tabs">
        <div class="search-panel">
            <div class="search-input" @keyup.enter="search">
                <el-input placeholder="请输入名称进行搜索" type="text" v-model="queryString" class="input-with-select">
                    <el-select v-model="copyActiveName" slot="prepend" placeholder="请选择频道" style="width:120px;" @change="currentSel">
                        <el-option v-for="item in copyListData" 
                            :key="item.Name"
                            :label="item.Name"
                            :value="item.Name"
                        ></el-option>
                    </el-select>
                </el-input>
            </div>
            <div class="search-add">
                <el-button type="primary" @click="actionAdd()">新建</el-button>
            </div>  
        </div>
    </div>
    
</template>
<script>
import mixin from '$mixin/mixin';
export default {
    mixins: [ mixin ],
    name:'aom-tab',
    props:{
        listData:{
            type:Array,
            default(){
                return []
            }
        },
        defaultQueryString:{
            type:String,
            default() {
                return ''
            }
        },//默认查询的内容
        
    },
    data(){
        return {
            copyActiveName:'',
            queryString:'',
            copyListData:[],
        }
    },
    methods:{
        handleTabClick(tab, evt){
            this.$emit('on-tab-change', tab.name, this.queryString);
        },
        search(){
             this.copyActiveName = this.copyActiveName=='<所有频道>'?'':this.copyActiveName;
            this.$emit('on-search', this.copyActiveName, this.queryString);
        },
        actionAdd(){
            this.$emit('on-add', this.copyActiveName);
        },
        currentSel(){
            this.copyActiveName = this.copyActiveName=='<所有频道>'?'':this.copyActiveName;
            this.$emit('on-search', this.copyActiveName, this.queryString);
        }
    },
    watch:{
        'defaultQueryString': function(v) {
            this.queryString = v;
        },
        listData:{
            handler(val){
                if(val && val.length>0){  
                    this.count = val.length;
                    this.copyListData = this.deepCopy(val);                  
                    this.copyListData.unshift({Abbr:'<所有频道>',Description:'<所有频道>',Enabled:1,Name:'<所有频道>'});
                    console.log(this.copyListData);
                }else{
                    this.count = 0;
                }
            },
            immediate: true,
            deep:true
      },
    }
}
</script>

