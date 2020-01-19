<template>
    <transition name="fade" mode="out-in">
        <div :class='[typeClass,"aom-message-box"]' v-if='isBoxShow' @click="close">
            <span v-if='!showList'>{{messagOptions.message}}</span>
            <div v-else-if="showList">
                <div v-for="(item ,index) in messagOptions.message" :key="index">{{item}}</div>
            </div>
        </div>
    </transition>
</template>
<script>
import Vue from 'vue'
const typeMap={
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
};
export default {
    name:'aom-messagebox',
    data(){
        return{
            closed:false,
            timer:null,
            isBoxShow:false,
            messagOptions:{
                message:'',
                type:'info',
                duration:3000,
            },
            showList:false,
            eventBus:new Vue({}),
        }
    },
    created(){
        this.$root.$on('showBox',(val)=>{
            this.showGolbelMsgBox(val);
        })
        this.$root.$on('hideMessageBox',this.hideMsssageBox)
    },
    mounted(){
    },
    computed:{
        typeClass(){
            return `aom-message-box-${typeMap[this.messagOptions.type?this.messagOptions.type:'info']}`
        },
        message(){
            if(!!messagOptions && !!messagOptions.message){
                if(typeof messagOptions.message=='string'){
                    this.showList = false;
                }else{
                    this.showList = true;
                }
                return messagOptions.message
            }else{
                return ''
            }
        },
    },
    methods:{
        startClearTimer(){
            if(this.messagOptions.duration===0||this.messagOptions.duration&&this.messagOptions.duration > 0) {
                if(this.messagOptions.duration===0){
                   if (this.isBoxShow) {
                        this.close();
                        return
                    }
                }
                this.timer = setTimeout(() => {
                    if (this.isBoxShow) {
                        this.close();
                    }
                }, this.messagOptions.duration);
            }else{
                this.timer = setTimeout(() => {
                    if (this.isBoxShow) {
                        this.close();
                    }
                }, 4000);
            }
        },
        close(){
            this.isBoxShow = false;
            if(!!this.messagOptions.callBack){
                this.messagOptions.callBack();
            }
        },
        showGolbelMsgBox(val){
            this.messagOptions = val;
             this.isBoxShow = true;
            if(this.messagOptions.type==='success'||this.messagOptions.type==='info'){
                // this.isBoxShow = true;
                this.startClearTimer()
            }
            
        },
        hideMsssageBox() {   
            this.close()
           
        },
        scrollToTop(){}
    },
    watch:{
        isBoxShow:{
            handler(newval){
                if(newval){
                    this.$nextTick(()=>{
                        this.scrollToTop();
                    });
                    if(this.messagOptions.type==='success'){
                        this.startClearTimer();
                    }
                    
                }else{
                    if(!!this.timer){
                        clearTimeout(this.timer);
                    }
                }
            }
        }
    },
    beforeDestroy(){
        
        
    },
    
}
</script>
<style lang="less">
    @boxMinHeight:50px;
    .aom-message-box{
        min-height: @boxMinHeight;
        line-height: @boxMinHeight;
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        text-align: center;
        &-info{
            background-color: #f7faff;
        }
        &-success{
            background-color: #1aaa55;
        }
        &-error{
            background-color: #db3b21;
            
        }
        &-warning{
            background-color: #fdca85;
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
        }
        .fade-enter, .fade-leave-to{
            opacity: 0;
        }
</style>

