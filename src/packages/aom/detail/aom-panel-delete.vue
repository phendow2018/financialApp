<template>
    <li :item="item"  class="aom-panel-item" :style="{height:bigsize ? '70px':'60px'}">
        <div class="aom-panel-item" :style="{height:bigsize ? '70px':'60px'}">
            <span class="aom-panel-item-name" v-if="showname" :style="namesize">{{item.Name}}:  </span>
            <div v-else class="aom-panel-item-icon-container" :style="containersize">
                <div class="aom-panel-item-icon" :style="iconsize">
                {{item.Content && item.Content.substring(0,1)}}
                </div>
            </div>
            <div class="aom-panel-item-content" >
                <div class="aom-panel-item-content-item aom-panel-item-subtitle" :style="subtitlesize">
                    {{item.Content}}
                </div>
                <div class="aom-panel-item-content-item aom-panel-item-desc" :style="descize">
                    {{item.Desc}}
                </div>
            </div>
        </div>  
        <el-button size="medium" type="danger" class="delete-btn-class" @click="onDelete(item.Key,item.Name)">删除</el-button>
    </li>
</template>

<script>
const circleBcgArr = [
        '#E8EAF6',
        '#E3F2FD',
        '#E0F2F1',
        '#F3E5F5',
        '#FBE9E7',
        '#FFEBEE',
        '#EEEEEE',
    ]
export default {
    props:{
        item: Object,
        bigsize: Boolean,
        showname: Boolean,
        onDelete:{
            type: Function
        },
        idx:{
            type:Number,
            default(){
                return 0
            }
        }
    },
    computed:{
        iconsize(){
            return {
                height:this.bigsize? '56px' : '42px',
                width:this.bigsize? '56px' : '42px',
               'border-radius':this.bigsize? '28px' : '21px',
               'line-height':this.bigsize? '56px' : '42px',
               'background-color': circleBcgArr[this.idx > 6 ? this.idx-7: this.idx]
            }
        },
        subtitlesize(){
            return {
                'line-height': this.bigsize? '50px' : '40px',
                'font-size': '16px',
                height: this.bigsize ? '50px' : '40px'
            }  
        },
        containersize(){
            return {
                width: this.bigsize ? '95px' : '80px'
            }
        },
        descize(){
            return {
                'line-height': this.bigsize? '0px' : '7px',
                'font-size': '14px',
                height: this.bigsize ? '20px' : '20px'
            }  
        },
        namesize(){
            return {
                'line-height':this.bigsize? '70px' : '60px'
            }
            
        },
        noslot(){
            return this.$slots.default ? false : true;
        }
    },
    methods:{
    }
}
</script>

<style lang="less" scoped>
    .aom-panel-item{
        position: relative;
        display:flex;
        display: -webkit-flex;
        flex-wrap: nowrap;
        flex-direction: row;
        width: 100%;
        height: 60px;
        line-height: 60px;
        font-size: 16px;
        list-style-type: none;
        text-align: left;
        border: 0;
        border-bottom:1px solid #ebeef5;

        .aom-panel-item-name{
            display:inline-block;
            width: 120px;
            text-align: center;
        }
        .aom-panel-item-content{
            display: inline-block;
            line-height: 60px;
            font-size: 18px;
            font-weight: 700;
            color:#333;
            flex-grow: 1;
        }      
    }
    .aom-panel-item-icon-container{
        width: 80px;
    }
    .aom-panel-item-icon{
        width: 42px;
        height: 42px;
        line-height: 42px;
        font-size: 18px;
        text-align: center;
        border-radius: 21px;
        background-color: #ccc;
        margin: 9px 30px;
    }
    .aom-panel-item-subtitle{
        font-size: 16px;
    }
    .aom-panel-item-desc{
        color:#797979
    }
    .delete-btn-class {
        position: absolute;
        height: 42px;
        text-align: center;
        right: 10px;
        top: 12px;
        background-color: rgba(204, 0, 0, 1);
    }
</style>


