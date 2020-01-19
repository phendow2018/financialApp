<template>
    <div :class="[preCls,'globel-warpper-class']">
        <!-- <div :class="[preCls + '-header','globel-title-class']">
            <div :class="[preCls + '-header-title']">
                <span :class="[preCls + '-header-title-left']">用户管理 / </span>
                <span :class="[preCls + '-header-title-right']">用户信息</span>
            </div>
            <div class="main-header-nav">
                <div class="main-header-nav-content">
                    <div class="buttons-items">
                        <div class="function-buttons">
                        </div>
                        <div class="back-item">
                            <el-button type="info" class="back-item-button"  @click="backPath" ><i class="iconfont icon-fanhui" ></i>返回</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
         <aom-header parentTitle="用户管理" mainTitle="用户信息"></aom-header>
        <div :class="[preCls + '-content','detail-content-globel']">
                <div class="advcabs-main-content" v-if="noerroroccured" >
                    <div class="detail-content content-left">
                        <aom-panel :items="userproperties">
                            <div slot="header">
                            <div>用户信息</div>
                        </div>
                        <div slot="content">
                            <aom-panel-item v-for="(item, index)  in userproperties" :idx="index" :item="item" :bigsize="index === 0" :showname="index !== 0" :key="item.name"></aom-panel-item>
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
                                    <a class="description-btn-class" :class="diabledDelete" @click="deleteUser">删除用户</a>
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
                userproperties:[
                    // {name:'名称','content':"张三"},
                    // {name:'用户名','content':"star"},
                    // {name:'所属部门','content':"软件部"},
                    // {name:'用户角色','content':"开发"},
                    // {name:'性别','content':"男"},
                    // {name:'电话号码','content':"13012341234"},
                    // {name:'电子邮箱','content':"23456@qq.com"},
                    // {name:'创建人','content':"admin"},
                    // {name:'创建时间','content':"2018-11-22"},

                ],
                curAdvCabId:'',
                diabledDelete:''
            }
        },
        created(){
            let getId = this.$root._route.query.account;//用户名
            console.log(getId);
            this.getUser = getId;
            this.http.get(`${this.preApiName}/Platform/Users?Account=`+this.getUser).then((res) => {
                let getdata = res.data.data;
                if(getdata.length>0){
                    let data = getdata[0];
                    this.addItemToItems(data, 'Name', '名称');
                    this.addItemToItems(data, 'Account', '用户名');
                    this.addItemToItems(data, 'DeparentName', '所属部门');
                    this.addItemToItems(data, 'Role', '用户角色');
                    this.addItemToItems(data, 'Sex', '性别');
                    this.addItemToItems(data, 'Telephone', '电话号码');
                    this.addItemToItems(data, 'Email', '电子邮箱');
                    this.addItemToItems(data, 'CreatUser', '创建人');
                    this.addItemToItems(data, 'CreatTime', '创建时间');
                }else{
                    this.noerroroccured = false;
                }
            }).catch((err)=>{
                console.log(err);
                //this.noerroroccured = false;
            });
        },
        methods:{
            backPath() {
                this.$router.push(`${this.preName}/user/main/user`)
            },
            addItemToItems(item, key, name){
                let pushitem = {};
                pushitem.name = name;
                if(key=='Sex'){
                    pushitem.content = item[key]==0 ? '男' : '女';
                }else{
                    pushitem.content = item[key];
                }
                this.userproperties.push(pushitem);
            },
            deleteUser(){
                if(this.diabledDelete !== '')
                return;
                this.http.delete(`${this.preApiName}/Platform/Users?Account=`+this.getUser).then((res) => {
                    this.showMessage(
                         '删除用户成功！',
                         'success'
                    );
                    this.diabledDelete = 'diabled-to-delete';
                }).catch((err) => {
                    this.showMessage(
                         '删除用户失败，原因：' + err.response.data.error,
                         'error'
                    );
                });
            },
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
