<template>
    <div :class="[preCls,'small-container']">
         <aom-header parentTitle="用户管理" mainTitle="用户信息" @aom-go-back="backPath" @link-to-main-page="linkToMainPage" :parentTitleCanLink="true"></aom-header>
        <div :class="[preCls + '-content','detail-content-globel']" v-loading="isLoading">
                <div class="advcabs-main-content" v-if="noerroroccured" >
                    <div class="detail-content content-left">
                        <aom-panel :items="userproperties">
                            <div slot="header">
                                <div>用户信息</div>
                            </div>
                            <div slot="titleButton">
                                <el-button @click="editSelf" class="button-edit">编辑</el-button>
                            </div>
                            <div slot="content">
                                <aom-panel-item v-for="(item, index)  in userproperties" :idx="index" @clickContent="clickContent" :item="item" :bigsize="index === 0" :showname="index !== 0" :key="item.name"></aom-panel-item>
                            </div>
                        </aom-panel>
                    </div>
                    <div class="detail-content content-right">
                        <aom-panel>
                            <div slot="header">
                                <div>删除用户</div>
                            </div>
                            <div slot="content">
                                <div class="description-title">
                                    删除用户具有以下效果：
                                </div>
                                <ul class="description-item-container">
                                    <li class="description-item" title="用户将从系统移除">用户将从系统移除</li>
                                    <li class="description-item" title="用户在系统中的工作将被保留">用户在系统中的工作将被保留</li>
                                </ul>
                                <div class="description-delete-container">
                                    <a class="description-btn-class" :class="diabledDelete" @click="deleteUser" v-if="!isSuperUser">删除用户</a>
                                    <span class="description-title" style="color: #da8100;" v-if="isSuperUser">此用户为超级用户，不允许删除！</span>
                                </div>
                            </div>
                        </aom-panel>
                    </div>
                </div>
                <div class="advcabs-main-content" v-else>
                    获得当前用户信息出错，请联系技术管理员
                </div>
        </div>
    </div>
</template>

<script>
    import mixin from '$mixin/mixin.js'
    import AomPanel from '$packages/aom/detail/aom-panel'
    import AomPanelItem from '$packages/aom/detail/aom-panel-item'
    import AomHeader from '$packages/frame/aom-header'
    const preCls = 'userDetail'
    export default {
        name: 'editUser',
        mixins: [mixin],
        components:{AomPanel, AomPanelItem,AomHeader},
        data(){
            return {
                getUser:'',
                preCls,
                noerroroccured: true,
                userproperties:[],
                diabledDelete:'',
                isLoading: false,
                isSuperUser: false
            }
        },
        created(){
            let getId = this.$route.query.account,//用户名
                userName  = this.$route.query.name;
            if(!!getId){
                this.getUser = getId;
                this.isLoading = true;
                this.http.get(`${this.preApiName}/financial/platform/users?Account=`+this.getUser).then((res) => {
                    let getdata = res.data.data;
                    if(getdata.length > 0){
                        let data = getdata[0];
                        this.addItemToItems(data, 'Name', '名称','');
                        this.addItemToItems(data, 'Account', '用户名','');
                        this.addItemToItems(data, 'DeparentName', '所属部门','DepartmentId',true);
                        this.addItemToItems(data, 'UserRoles', '所属角色','');
                        this.addItemToItems(data, 'Sex', '性别','');
                        this.addItemToItems(data, 'OfficePhone', '电话号码','');
                        this.addItemToItems(data, 'Email', '电子邮箱','');
                        this.addItemToItems(data, 'CreateUser', '创建人','');
                        this.addItemToItems(data, 'CreateTime', '创建时间','');

                        this.isSuperUser = data.Level === 0;
                    }else{
                        this.noerroroccured = false;
                    }
                    this.isLoading = false;
                }).catch((err)=>{
                    this.showMessage(
                        err.response.data.statusCode === 207 ? "查询用户信息失败，请联系管理员！" : "查询用户信息失败，"+err.response.data.error,
                        'error'
                    );
                    this.isLoading = false;
                });
            }else if(!!userName){
                this.isLoading = true;
                this.http.get(`${this.preApiName}/financial/platform/users?Name=`+userName).then((res) => {
                    let getdata = res.data.data;
                    if(getdata.length > 0){
                        let data = getdata[0];
                        this.getUser = data.Account;
                        this.addItemToItems(data, 'Name', '名称','');
                        this.addItemToItems(data, 'Account', '用户名','');
                        this.addItemToItems(data, 'DeparentName', '所属部门','DepartmentId',true);
                        this.addItemToItems(data, 'UserRoles', '所属角色','');
                        this.addItemToItems(data, 'Sex', '性别','');
                        this.addItemToItems(data, 'OfficePhone', '电话号码','');
                        this.addItemToItems(data, 'Email', '电子邮箱','');
                        this.addItemToItems(data, 'CreateUser', '创建人','');
                        this.addItemToItems(data, 'CreateTime', '创建时间','');

                        this.isSuperUser = data.Level === 0;
                    }else{
                        this.noerroroccured = false;
                    }
                    this.isLoading = false;
                }).catch((err)=>{
                    this.showMessage(
                        err.response.data.statusCode === 207 ? "查询用户信息失败，请联系管理员！" : "查询用户信息失败，"+err.response.data.error,
                        'error'
                    );
                    this.isLoading = false;
                });
            }
           
        },
        methods:{
            backPath() {
                this.$router.go(-1)
            },
            linkToMainPage(){
                this.$router.push(`${this.preName}/user`)
            },
            editSelf() {
                this.$router.push(`${this.preName}/user/userEdit?account=${this.getUser}`)
            },
            addItemToItems(item, key, name, idKey= null, link=false){
                let pushitem = {};
                pushitem.Name = name;
                if(key == 'Sex'){
                    pushitem.Content = item[key] == 0 ? '男' : '女';
                }else if(key === 'UserRoles'){
                    pushitem.Content = ''
                    if(item.Level === 0) {
                        pushitem.Content = '此用户为超级用户，拥有所有权限'
                    }else{
                        item[key].forEach(item => {
                            pushitem.Content += item.Name + ', '
                        });
                    }
                }else{
                    pushitem.Content = item[key];
                }
                if(idKey){
                    pushitem.Key = item[idKey]
                }
                pushitem.EnableToLink = link
                this.userproperties.push(pushitem);
            },
            deleteUser(){
                if(this.diabledDelete !== '')
                    return;
                this.http.delete(`${this.preApiName}/financial/platform/users?Account=`+this.getUser).then((res) => {
                    this.showMessage(
                         '删除用户成功！',
                         'success'
                    );
                    this.diabledDelete = 'diabled-to-delete';
                    this.$router.push(`${this.preName}/user`)
                }).catch((err) => {
                    this.showMessage(
                         '删除用户失败，原因：' + err.response.data.error,
                         'error'
                    );
                });
            },
            clickContent({Name, Key}){
                this.$router.push(`${this.preName}/organization/organizationDetail?id=${Key}`)
            }
        }
    }
</script>

<style lang="less">
    @preCls: ~'userDetail';

    .fontBlodStyle(){
        font-family: ~'微软雅黑 Bold', ~'微软雅黑 Regular', ~'微软雅黑';
        font-weight: 700;
        font-style: normal;
        // font-size: 20px;
        color: #515151;
    }

    .@{preCls} {
        padding:20px 30px;

        &-header{
            border-bottom: 1px solid #ebeef5;
            // margin-bottom: 20px;
            &-title{
                .fontBlodStyle();
                // font-size: 20px;
                font-weight: 700;
                padding-bottom: 15px;

                &-left{
                    color:#AEAEAE;
                }
                &-right{
                    color:#545454;
                }
            }
        }
        &-content{
            &-main{
                margin-top: 30px;
                border-top: 1px solid #dbdbdb;
            }
            &-title{
                width: max-content;
                .fontBlodStyle();
                font-size: 18px;
                border-bottom: 3px solid rgb(147, 147, 147);
            }
        }
        .userDetail-content{
            width: 100%;
            // margin-top: 20px;
            // height: calc(~'100% - 170px - 20px');
            // height: calc(~'100vh - 170px - 20px');
        }
        
    }
    .advcabs-main-content{
        display: flex;
        flex-direction: row;
        // padding: 20px 0 0 0;
        box-sizing: border-box;
        .detail-content{
            width:49%;
            flex-grow: 1;
            .input-content{
                & .el-select{
                    width: 100%;
                }
            }
        }

        .content-left{
            margin-right: 1%;
        }

        .content-right{
            margin-left: 1%;
        }
    }
    .description-title{
        height: 40px;
        line-height: 40px;
        text-align: left;
        padding-left: 20px;
    }
    .description-item{
        position: relative;
        height: 30px;
        line-height: 30px;
        list-style: none;
        text-align: left;
        padding-left: 15px;
        overflow: hidden;
        word-wrap:break-word;
        white-space:nowrap;
        text-overflow: ellipsis; 
    }
    .description-item::before{
        content:"";
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: #333;
        top: 10px;
        left: 0px;
        font-size: 14px;
    }
    .description-delete-container{
        padding: 8px;
    }
    .description-btn-class{
        position: relative;
        display: block;
        margin-left: 10px;
        width : 90px;
        height: 30px;
        color: #fff;
        line-height: 30px;
        text-align: center;
        background-color: rgba(204, 0, 0, 1);
        border-radius: 5px;
        cursor: pointer;
    }

    .description-btn-class:hover{
        background-color: #e80505;
    }

    .diabled-to-delete{
        color: #333;
        cursor:not-allowed;
        background-color: #ccc;

        :hover{
            background-color: #ccc;
        }
    }
</style>
