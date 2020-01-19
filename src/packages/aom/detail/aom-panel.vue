<template>
    <div class="aom-panel">
        <div class="aom-panel-header">
            <div class="aom-panel-header-title">
                <slot name="header"> 
                </slot><span v-if="noheaderslot">{{title}}</span>
                <div class="aom-title-button" v-if="this.$slots.titleButton">
                    <slot name="titleButton"></slot>
                </div>
            </div>
        </div>
        <div class="aom-panel-content">
            <template v-if="!contentslot">
                <aom-panel-delete v-if="allowdelete" v-for="(item, index) in items" :key="item.Name" :idx="index" :item="item" :bigsize="index === 0 && bigsize" :showname="!(index === 0 && firstshowicon)" :onDelete="onDelete">    
                </aom-panel-delete>
                <aom-panel-item v-if="!allowdelete" v-for="(item, index) in items" :key="item.Name" :item="item" :bigsize="index === 0 && bigsize" :showname="!(index === 0 && firstshowicon)">    
                </aom-panel-item>
            </template>
                
            <slot name="content" v-if="contentslot"></slot>
        </div>
        <div class="aom-panel-footer" v-if="withfooter">
        </div>
    </div>   
</template>

<script>
import AomPanelItem from './aom-panel-item'
import AomPanelDelete from './aom-panel-delete'
export default {
    components:{AomPanelItem,AomPanelDelete},
    data(){
        return {
            
        }
    },
    mounted(){
        console.log(this.$slots)
    },
    props:{
        title: String,
        items: Array,
        bigsize: Boolean,
        allowdelete: Boolean,
        withfooter: Boolean,
        firstshowicon: Boolean,
        onDelete:Function
    },
    computed:{
        noheaderslot(){
            return this.$slots.header ? false : true;
        },
        contentslot(){
            return this.$slots.content ? true : false;
        }
    },
    methods:{
    }
}
</script>

<style scoped lang="less">
    .aom-panel{
        position: relative;
    }
    .aom-panel-header{
        position: relative;
        width: 100%;
        height: 70px;
        line-height: 70px;
        text-align: left;
        font-size: 16px;
        background-color: rgba(242, 242, 242, 1);
        border-radius: 2px;
        border:1px solid #ebeef5;

        .aom-panel-header-title{
            padding-left: 25px;
        }

        .aom-title-button{
            position: absolute;
            right: 25px;
            top: 0px;
        }
    }
    .aom-panel-content{
        width: 100%;
        border-left: 1px solid #ebeef5;
        border-right: 1px solid #ebeef5;
        border-bottom: 1px solid #ebeef5;
    }
    .aom-panel-footer{
        width: 100%;
        height: 30px;
        background-color: rgba(242, 242, 242, 1);;
        border:1px solid #ebeef5;
    }
</style>