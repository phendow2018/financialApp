<template>
    <div class="aom-info-wrapper">
        <div class="wrapper-left">
            <div class="left-img">
                <span class="circle" :style="{backgroundColor: circleColor}">{{funSubstring(item.Name)}}</span>
            </div>
            <div class="content">
                <span class="top-name">
                    <span @click="skipitemsDetail()" :class="allowToLink" >{{item.Name}}</span>
                </span>
                <span class="bottom-desc" >
                    <span class="bottom-desc-name" >{{item.PlayTime || item.Description || item.Memo}}</span>
                </span>
            </div>
        </div>
        <div class="wrapper-right">
            <el-button @click="funEdit(item.Id)" class="button-edit">编辑</el-button>
            <el-button type="danger" @click="funDelete(item.Id)" class="button-delete">删除</el-button>
        </div> 
    </div>
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
import mixin from '$mixin/mixin'
export default {
    name:'aom-line',
    mixins: [mixin],
    props:{
        item:{
            type: Object,
            default(){
                return null
            }
        },
        enableToLink:{
            type:Boolean,
            default(){
                return true
            }
        }
    },
    created(){
  
    },
    computed:{
        circleColor() {
            return circleBcgArr[this.createColorRandomNumber()];
        },
        allowToLink(){
            return this.enableToLink ? "allow-skip" : "";
        }
    },
    methods:{
        funSubstring(name){
            let newName;
            if(!!name){
                name = $.trim(name);
                newName = name.substring(1,0);
            }
            return newName;
        },
        funEdit(){
            this.$emit('on-edit', this.item);
        },
        funDelete(){
            this.$emit('on-delete', this.item);
        },
        skipitemsDetail(){
            if(!this.enableToLink)
                return;
            this.$emit('on-todetail', this.item);
        },
    }
}
</script>