<template>
    <li class="aom-panel-item" :style="{height:bigsize ? '70px':'60px'}">
        <slot></slot>
        <div class="aom-panel-item" v-if="noslot" :style="{height:bigsize ? '70px':'60px'}">
            <span class="aom-panel-item-name" v-if="showname" :style="contentsize">{{item.Name}}  :  </span>
            <div v-else class="aom-panel-item-icon-container" :style="containersize">
                <div class="aom-panel-item-icon" :style="iconsize">
                    {{item.Content && item.Content.substring(0,1)}}
                </div>
            </div>
            <span class='aom-panel-item-content' :style="contentsize" >
                <span :title="item.Content" :class="[item.EnableToLink ? 'aom-panel-item-content-link' : '', 'aom-panel-item-content-name']" @click="item.EnableToLink && clickContent()">{{item.Content}}</span>
            </span>
        </div>  
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
    data(){
        return {
        }
    },
    mounted(){
        console.log(this.$slots)
    },
    props:{
        item: Object,
        bigsize: Boolean,
        showname: Boolean,
        idx: Number
    },
    computed:{
        iconsize(){
            return {
                height:this.bigsize? '56px' : '42px',
                width:this.bigsize? '56px' : '42px',
               'border-radius':this.bigsize? '28px' : '21px',
               'line-height':this.bigsize? '56px' : '42px',
               'background-color': circleBcgArr[this.idx > 6 ? this.idx-7 : this.idx]
            }
        },
        contentsize(){
            return {
                'line-height': this.bigsize? '70px' : '60px'
            }  
        },
        containersize(){
            return {
                width: this.bigsize ? '95px' : '80px'
            }
        },
        noslot(){
            return this.$slots.default ? false : true;
        }
    },
    methods:{
        clickContent() {
            this.$emit('clickContent', this.item)
        }
    }
}
</script>

<style scoped lang="less">
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
        border-bottom:1px solid #ebeef5;

        .aom-panel-item-name{
            display:inline-block;
            width: 90px;
            text-align: right;
            padding-right: 9px;
        }
        .aom-panel-item-content{
            display: inline-block;
            line-height: 60px;
            font-size: 18px;
            font-weight: 700;
            color:#333;
            flex-grow: 1;
            max-width: calc(100% - 20px);
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
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
    .aom-panel-item-content-link{
        cursor: pointer;
    }    
    .aom-panel-item-content-link:hover{
        border-bottom: 1px solid black;
    }
</style>