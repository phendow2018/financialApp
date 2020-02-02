<template>
    <div class="small-container">
        <aom-header parentTitle="角色管理" mainTitle="角色信息" @aom-go-back="back" @link-to-main-page="linkToMianPage" :parentTitleCanLink="true"></aom-header>
        <div class="channel-main-container detail-content-globel">
            <div class="channel-main-content" v-if="noerroroccured">
                <div class="detail-content content-left">
                    <aom-panel>
                        <div slot="header">
                            <div>角色信息</div>
                        </div>
                        <div slot="content">
                            <aom-panel-item v-for="(item, index) in roleInfo" :item="item" :idx="index" :bigsize="index === 0" :showname="index !== 0" :key="item.name"></aom-panel-item>
                        </div>
                         <div slot="titleButton">
                            <el-button @click="editSelf" class="button-edit">编辑</el-button>
                        </div>
                    </aom-panel>
                    <aom-panel style="margin-top: 20px;">
                        <div slot="header">
                            <div>角色权限</div>
                        </div>
                        <div slot="content">
                           <div class="content-treelist-main">
                                <div class="treelist-item" v-for="(item, key) in roleRight">
                                    <div class="treelist-self">
                                        <div class="treelist-item-left">
                                            <div class="treelist-item-left-icon" @click="clickIcon(item)">
                                                <i :class="['iconfont', item.isOpen ? 'icon-down' : 'icon-right']"></i>
                                            </div>
                                            <div class="treelist-item-left-circle" :style="{backgroundColor: circleBcgArr[key > 6 ? key - 7 : key]}">
                                                {{item.Type[0]}}
                                            </div>
                                            <div class="treelist-item-left-info">
                                                {{item.Type}}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="treelist-child" v-if="item.Resources.length > 0 && item.isOpen">
                                        <div class="treelist-item" v-for="(Resources, index) in item.Resources">
                                            <div class="treelist-self">
                                                <div class="treelist-item-left">
                                                    <div class="treelist-item-left-circle" :style="{backgroundColor: circleBcgArr[index > 6 ? index % 7 : index]}">
                                                        {{Resources.Name[0]}}
                                                    </div>
                                                    <div class="treelist-item-left-info">
                                                        {{Resources.Name}}
                                                    </div>
                                                </div>
                                                <div class="treelist-item-right">
                                                    <div class="right-switch" v-for="node in Resources.Method.split(',')" v-if="node !== ''">
                                                        <div class="right-name">{{getRightName(node)}}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aom-panel>
                </div>
                <div class="detail-content content-right">
                    <aom-panel >
                        <div slot="header">
                        <div>关联用户</div>
                    </div>
                    <div slot="content">
                        <el-form :model="program" label-width="100px" ref="form" :rules="rule" style="width: 80%;margin-left: 10%;padding-top: 20px;">
                            <el-form-item label="用户:" prop="Name">
                                <div class="input-content">
                                    <el-select v-model="program.Name"  @focus="userSelectFocus"
                                        filterable
                                        placeholder="请输入用户关键词"
                                        :remote-method="searchUserList"
                                        :loading="loading"
                                         remote
                                        :clearable="true">
                                        <el-option
                                        v-for="item in userList"
                                        :key="item.Id"
                                        :label="item.Name"
                                        :value="item.Name">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-form-item>  
                            <el-form-item>
                                <el-button type="primary" @click="addProgram">关联</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    </aom-panel>
                    <aom-panel  class="panel-right" style="margin-top: 20px;" :withfooter="true" :items="childInfo">
                        <div slot="header">
                            <div>关联的用户<i class="total-count-big-tipe">{{childInfo.length}}</i></div>
                        </div>
                        <div slot="content">
                             <ul class="detail-item">
                                <li v-for="(item, index) in childInfo"  :key="index">
                                    <aom-line  :item="item" @on-todetail="onToDetail" @on-edit="onEdit" :showEditButton="false" deleteButtonText='解除关联' @on-delete="onDeleteProgram">
                                        <template slot="desc">
                                            <span class="bottom-desc-name"  :title="item.Content">{{item.Content}}</span>
                                        </template>
                                    </aom-line>
                                </li>
                            </ul>
                            <div v-show="childInfo.length === 0" class="no-program">当前角色暂时没有关联用户</div>
                        </div>
                    </aom-panel>
                </div>
            </div>
            <div class="channel-main-content" v-else>
                获得当前角色信息出错，请联系技术管理员
            </div>
        </div>
    </div>
</template>

<script>
import mixin from '$mixin/mixin.js';
import AomPanel from '$packages/aom/detail/aom-panel'
import AomPanelItem from '$packages/aom/detail/aom-panel-item'
import AomPanelDelete from '$packages/aom/detail/aom-panel-delete'
import AomHeader from '$packages/frame/aom-header'
import AomLine from '$packages/aom/advcab/aom-line'
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
    mixins: [ mixin ],
    components:{AomPanel, AomPanelItem, AomPanelDelete,AomHeader,AomLine},
    data(){
        return {
            noerroroccured: true,
            loading:false,
            roleInfo:[],
            curChannel:'',
            program:{
                Name:'',
            },
            rule:{
                Name:[
                    { required: true, message: '请输入用户名称', trigger: 'blur' }
                ]
            },
            childInfo:[],
            id: '',
            userList:[],
            userAccount:'',
            userName:'',
            roleRight: [],
            circleBcgArr
        }
    },
    created(){
        this.initData();
    },
    methods:{
        initData(){
            let id = this.id = this.$route.query.id
            this.roleInfo = [];
            this.http.get(`${this.preApiName}/financial/platform/roles?Id=${id}`).then((res) => {
                let data = res.data.data.length ? res.data.data[0] : {};
                this.roleRight = data.Rights = JSON.parse(data.Rights)
                data.RightDescription = data.Rights ?  `共${data.Rights.length}项`: `共0项`
                this.addItemToItems(data, 'Name', '名称','');
                this.addItemToItems(data, 'RightDescription', '角色权限','');
                this.addItemToItems(data, 'CreateUser', '创建人');
                this.addItemToItems(data, 'CreateTime', '创建时间','');
                this.addItemToItems(data, 'Description', '描述','');
                
            }).catch((err)=>{
                console.log(err);
                this.noerroroccured = false;
            });
            this.childInfo=[];
            this.http.get(`${this.preApiName}/Platform/RoleUsers?RoleId=${id}`).then((res) => {
                res.data.data.forEach((value) => {
                    this.childInfo.push({
                        Name:value.Name,
                        Key: value.Account,
                        Content: value.Name,
                        Desc:value.Description
                    });
                });
                this.searchUserList('');
            }).catch((err) => {
            });
        },
        back(){
            // this.$router.push(`${this.preName}/user/main/role`)
            this.$router.go(-1)
        },
        addItemToItems(item, key, name, idKey=null, link=false){
            
            let pushitem = {};
            pushitem.Name = name;
            pushitem.Content = '';
            pushitem.Content = item[key];
              if(idKey){
                pushitem.Key = item[idKey]
            }
            pushitem.EnableToLink = link
            this.roleInfo.push(pushitem);
        },
        addProgram(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    let putData = [{UserAccount:this.userAccount}];
                    this.childInfo.map(item=>{
                        putData.push({UserAccount:item.Key})
                    })
                    this.http.put(`${this.preApiName}/Platform/RoleUsers?RoleId=${this.id}`,putData).then((res) => {
                        //关联用户成功后初始化新的用户信息
                        // this.childInfo = [];
                        // res.data.data.forEach((value) => {
                        //     this.childInfo.push({
                        //         Name:value.Name,
                        //         Key: value.Account,
                        //         Content: value.Name,
                        //         Desc:value.Description
                        //     });
                        // });
                        this.childInfo=[];
                        this.http.get(`${this.preApiName}/Platform/RoleUsers?RoleId=${this.id}`).then((res) => {
                            res.data.data.forEach((value) => {
                                this.childInfo.push({
                                    Name:value.Name,
                                    Key: value.Account,
                                    Content: value.Name,
                                    Desc:value.Description
                                });
                            });
                            this.searchUserList('');
                            this.$refs['form'].resetFields();
                            this.program.Name = '';
                            // this.initData();
                            this.showMessage(
                                '关联用户成功！',
                                'success'
                            );
                        }).catch((err) => {
                        });
                       
                       
                    }).catch((err) => {
                        this.showMessage(
                             err.response.data.error,
                             'error'
                        );
                    }); 
                }
            });
        },
        onDeleteProgram(programId){
            let deleteData = [];
            let index = -1;
            for(let k = 0; k < this.childInfo.length; ++k) {
                if(this.childInfo[k].Key === programId.Key) {
                    index = k;
                    continue;
                }
                deleteData.push({UserAccount:this.childInfo[k].Key })
            }
            this.http.put(`${this.preApiName}/Platform/RoleUsers?RoleId=${this.id}`,deleteData).then((res) => {
                if(res.status===201){
                    this.showMessage(
                         '解除关联用户成功！',
                         'success'
                    );
                    this.childInfo.splice(index, 1);
                }
                
            }).catch((err) => { 
                this.showMessage(
                    '解除关联用户失败' + ', 原因：' + err.response.data.error,
                    'error'
                );
            });
        },
        onToDetail(item){
            this.$router.push(`${this.preName}/user/userDetail?account=${item.Key}`)
        },
        onEdit(item){
            this.$router.push(`${this.preName}/user/userEdit?account=${item.Key}`)
        },
        searchUserList(query){
            let _ =this;
            _.loading = true;
            _.http.get(`${this.preApiName}/Platform/Users?FuzzyQuery=${query}`).then(res=>{
                if(res.status===200){
                    // _.userList = res.data.data
                    let userListData = res.data.data,
                        userListDataLen = userListData.length;
                    if(userListDataLen>0){
                        if(this.childInfo.length>0){
                            _.userList = this.filterUserData(userListData,this.childInfo)
                        }else{
                            _.userList = userListData;
                        }
                        
                    }else{
                        _.userList = [];
                    }
                }else{
                     _.userList = [];
                }
                _.loading = false;
            }).catch(res=>{
                this.userList = [];
            });
        },
        userSelectFocus(){
            this.searchUserList('')
        },
        filterUserData(a,b){
            //去除两个用户数组中相同的部分
            for(var i=0;i<b.length;i++){
              for(var j=0;j<a.length;j++){
                if(a[j].Name==b[i].Name){
                  a.splice(j,1);
                  j=j-1;
                }
              }
            } 
          return a;

        },
        clickContent({Name, Key}){
            this.$router.push(`${this.preName}/user/userDetail?account=${Key}`)
        },
        editSelf(){
            this.$router.push(`${this.preName}/role/roleEdit?id=${this.id}`)
        },
        clickIcon(item) {
            if(item.isOpen == undefined){
                this.$set(item, 'isOpen', true)
            }else{
                item.isOpen = !item.isOpen
            }
        },
        getRightName(node) {
            const name = {
                POST: '新建',
                DELETE: '删除',
                PUT: '更新',
                GET: '查询'
            } 
            return name[node]
        },
        linkToMianPage(){
            this.$router.push(`${this.preName}/role`)
        }
    },
    watch:{
        program:{
            handler(newval){
                this.userName = newval.Name
                // console.log(newval.Name)
            },
            deep:true
        },
        userName:{
            handler(newval){
                if(!!newval){
                    this.http.get(`${this.preApiName}/Platform/Users?Name=${newval}`).then(res=>{
                        if(res.status===200){
                            this.userAccount = res.data.data[0].Account;
                            console.log(this.userAccount)
                        }
                    }).catch(res=>{
                         this.userAccount = ''
                    });
                }else{
                    this.userAccount=''
                }
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .fontBlodStyle(){
        font-family: ~'微软雅黑 Bold', ~'微软雅黑 Regular', ~'微软雅黑';
        font-weight: 700;
        font-style: normal;
        // font-size: 20px;
        color: #515151;
    }
    .main-class{
        // width: 80vw;
    }
    .channel-detail{ 
        width: 100%;     
        padding: 20px 30px;
        box-sizing: border-box;
    }
    .main-title{
        .main-class;
        padding-top:0px;
        font-weight: 700;

        .fontBlodStyle();
        // font-size: 20px;
        & span:first-child{
            color: #AEAEAE;
        }
        
        & span:last-child{
            color: #545454;
        }
    }
    .main-header-nav{
        .main-class;
        border-bottom: 1px solid #ebeef5;
        // margin-bottom: 20px;
    }
    // .channel-main-container{
    //     width: 100%;
    //     margin-top: 20px;
    //     height: calc(100vh - 147px - 20px);
    // }
    .channel-main-content{
        .main-class;
        display: flex;
        flex-direction: row;
        // padding: 20px 30px 0 30px;
        box-sizing: border-box;
        .detail-content{
            width:49%;
            flex-grow: 1;
            & .programForm{
                & .el-form-item__label{
                    text-align: center;
                }
            }
            & .el-select{
                width: 100%;
            }
        }

        .content-left{
            margin-right: 1%;
        }

        .content-right{
            margin-left: 1%;
        }
    }


    .no-program{
        padding: 20px;
    }

    .content-treelist-main{
        padding: 0 20px;
    }
    .treelist-item{
            width: 100%;
            // padding-top: 10px;
        }
        .treelist-self{
            height: 60px;
            display: flex;
            align-items: center;
            align-content: center;
            justify-content: space-between;
            border-bottom: 1px solid #dbdbdb;
        }
        .treelist-child{
            padding-left: 110px;
        }
        .treelist-item-left{
            display: flex;
            align-items: center;
            align-content: center;
            justify-content: start;
            height: 100%;
            line-height: 60px;
            width: 100%;
        }
        .treelist-item-right{
            display: flex;
            align-items: center;
            align-content: center;
            justify-content: space-between;
            white-space: nowrap;
            width: max-content;
        }
        .module-switch{
            margin-right: 10px;
            .el-switch__core{ 
                height: 30px;
                border-radius: 15px;
            }
            .el-switch__core::after{
                width: 25px;
                height: 26px;
            }
            &.is-checked .el-switch__core::after{
                margin-left: -25px;
            }
        }
        .right-switch{
            margin-right: 15px;
            .el-switch__core{ 
                border-radius: 5px;
            }
        }
        .treelist-item-left-icon{
            height: 100%;
            line-height: 60px;
            text-align: center;
            cursor: pointer;
            margin-right: 10px;

            .iconfont{
                font-size: 28px;
            }   
        }
        .treelist-item-left-circle{
            width: 44px;
            height: 44px;
            line-height: 44px;
            border-radius: 22px;
            color: #000000;
            margin-right: 10px;
            text-align: center;
        }
        .treelist-item-left-info{
            text-align: left;
            line-height: 60px;
            .fontBlodStyle();
            font-size: 16px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
        .right-name{
            text-align: center;
        }

</style>
