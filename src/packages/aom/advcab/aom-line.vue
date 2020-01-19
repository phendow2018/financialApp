<template>
    <div class="aom-line-wrapper">
        <div class="wrapper-left">
            <div class="left-img">
                <span class="circle" :style="{backgroundColor: circleColor}">
                    <slot>{{funSubstring(item.Name)}}</slot>
                </span>
            </div>
            <div class="content">
                <span class="top-name">
                    <slot name="name">
                        <span @click="skipitemsDetail()" :class="allowToLink" :title="item.Name">{{item.Name}}</span>
                        <span class="adv-cab-duration" v-show="!!item.ValidDateOfWeek"><span>{{secondsChangeTime(item.Duration) }}</span></span>
                        <span class="isAdmin" v-show="item.Level == 0"><span>管理员</span></span>
                        <!-- <span class="isSuperAdmin" v-show="!!item.Account && item.Level == 0"><span>超级管理员</span></span> -->
                    </slot>
                </span>
                <span class="bottom-desc" >
                    <slot name="desc">
                        <span class="bottom-desc-name" v-show="!!item.PlayTime || !!item.Description || !!item.Memo || !!item.AreaName" :title="item.PlayTime || item.Description || item.Memo || item.AreaName">{{item.PlayTime || item.Description || item.Memo || item.AreaName ||item.DeparentName}}</span>
                        <span class="adv-cab-week" v-show="!!item.ValidDateOfWeek" :key='j' v-for="j in 7" >{{item.ValidDateOfWeek ? numChangeChinese(item.ValidDateOfWeek[j-1]):''}}</span>
                        <span class="userRole" v-show="item.UserRoles.length>0" v-for="roleItem in item.UserRoles" :key="roleItem.Id"><i class="icon iconfont iconfont icon-quanxianguanli"></i> <a href="javascript:void(0)" @click="linkToUserRole(roleItem.Id)" class="relation-operater">{{roleItem.Name}}</a></span>
                    </slot>
                </span>
            </div>
        </div>
        <div class="wrapper-right">
            <slot name="function">
                <el-button @click="funEdit(item.Id)" class="button-edit" v-show="showEditButton">编辑</el-button>
                <el-button type="danger" @click="funDelete(item.Id)" class="button-delete" v-show="showDelete(item)">{{deleteButtonText || '删除'}}</el-button>
            </slot>
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
        },
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
        },
        deleteButtonText:{
            type:String,
            default(){
                return ''
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
        async funDelete(){
            let isDelete = await this.getDeleteDecide(this.item)
            if(isDelete) {
                this.$emit('on-delete', this.item);
            }
        },
        async getDeleteDecide(item) {
            let prompted = null
            let operaterText =  this.deleteButtonText?'解除关联':'删除'
            prompted = await this.$confirm(`您确定要${operaterText}‘${item.Name}’吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            return prompted
        },
        skipitemsDetail(){
            if(!this.enableToLink)
                return;
            this.$emit('on-todetail', this.item);
        },
        eidtRight(){
            this.$emit('edit-right', this.item);
        },
        linkToUserRole(item){
            this.$emit('toUserRole',item)
        },
        secondsChangeTime(seconds){      
            let time = seconds;
            if (null != time && "" != time) {
                if (time > 60 && time < 60 * 60) {
                    time = parseInt(time / 60.0) + "' " + parseInt((parseFloat(time / 60.0) -
                    parseInt(time / 60.0)) * 60) + "''";
                }else if (time >= 60 * 60 && time < 60 * 60 * 24) {
                    time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60) + "' " +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                    parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "''";
                } else if (time >= 60 * 60 * 24) {
                    time = parseInt(time / 3600.0/24) + "天" +parseInt((parseFloat(time / 3600.0/24)-
                    parseInt(time / 3600.0/24))*24) + "小时" + parseInt((parseFloat(time / 3600.0) -
                    parseInt(time / 3600.0)) * 60) + "' " +
                    parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                    parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "''";
                }
                else {
                    time = parseInt(time) + "''";
                }
            }
            return time;
        },
        numChangeChinese(num){
            if(num === '1'){
                return '一';
            }else if (num === '2'){
                return '二';
            }else if (num === '3'){
                return '三';
            }else if (num === '4'){
                return '四';
            }else if (num === '5'){
                return '五';
            }else if (num === '6'){
                return '六';
            }else if (num === '7'){
                return '日';
            }else{
                return '';
            }
        },
        showDelete(item){
            if(item.Level == 0){
                return false
            }else{
                return true
            }
        }
    }
}
</script>