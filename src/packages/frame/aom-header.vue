<template>
    <div class="aom-header-container">
        <div class="aom-header-content">
            <span v-if="!!parentTitle" :class="['header-title-left',parentTitleCanLink?'link-title':'']" @click="linkToMian">{{parentTitle}}</span><span v-if="!!parentTitle" class="header-title-left">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
            <span :class="['header-title-right']">{{mainTitle}}</span>
        </div>
        <div class="back-button" v-if='showBack'>
            <el-button type="info"  class="header-back-button"  @click="back"><i class="iconfont icon-fanhui" ></i>返回</el-button>
        </div>
    </div>
</template>
<script>
export default {
    name:'aom-header',
    props:{
        parentTitle:{
            type:String,
        },
        mainTitle:{
            type:String,
        },
        showBack:{
            type:Boolean,
            default(){
                return true
            }
        },
        parentTitleCanLink:{
            type:Boolean,
            default(){
                return false
            }
        }
    },
    data(){
        return{

        }
    },
    computed:{

    },
    methods:{
        back(){
            this.$emit('aom-go-back')
        },
        linkToMian(){
            this.$emit('link-to-main-page')
        }
    }
}
</script>


