<template>
    <div :class="[preCls,'globel-warpper-class']">
        <div :class="[preCls + '-header']">
            <!-- <div :class="[preCls + '-header-title']">
                <span :class="[preCls + '-header-title-left','globel-title-class']">用户管理 / </span>
                <span :class="[preCls + '-header-title-right','globel-title-class']">用户编辑</span>
            </div> -->
            <aom-header parentTitle="用户管理" mainTitle="用户编辑"></aom-header>
            <div class="main-header-nav">
                 <aom-edit-tips editTipsName='用户编辑' :editItemName="userForm.Name"></aom-edit-tips>
                <!-- <div class="main-header-nav-content">
                    <div class="buttons-items">
                        <div class="function-buttons">
                            <el-button type="info" class="function-buttons-item contract-first-btn" size="medium" @click="addUser"><i class="iconfont icon-xinjian"></i> 新建</el-button>
                            <el-button type="info" class="function-buttons-item " size="medium" @click="saveUser"><i class="iconfont icon-baocun"></i> 保存</el-button>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        
        <div :class="[preCls + '-content']">
            <el-form :model="userForm" label-width="100px" class="demo-ruleForm" :rules="rules" ref="ruleForm" @submit.prevent="updown">
            <div class="time-msg-title">用户信息</div>
            <div class="time-msg-form">             
                    <el-form-item label="用户名" prop="UserName">
                        <el-input type="text" autocomplete="off" v-model="userForm.UserName" placeholder="请输入用户名" :disabled="isEdit"></el-input>      
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="Name">
                        <el-input type="text" autocomplete="off" v-model="userForm.Name" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="所属部门" prop="Department">
                        <el-select v-model="userForm.Department" placeholder="请选择一个部门">
                            <el-option
                            v-for="item in departmentOptions"
                            :key="item.Id"
                            :label="item.Name"
                            :value="item.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户角色" prop="Role">
                        <el-select v-model="userForm.Role" multiple placeholder="请选择角色" value-key="Id">
                            <el-option
                            v-for="item in roleOptions"
                            :key="item.Id"
                            :label="item.Name"
                            :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="性别" prop="Sex">
                        <el-radio v-model="userForm.Sex" label="0">男</el-radio>
                        <el-radio v-model="userForm.Sex" label="1">女</el-radio>
                    </el-form-item>
                    <el-form-item label="头像" prop="Icon">
                        <div class='headIcon'><span>默认</span><button onClick="return false">上传图片</button></div>
                    </el-form-item>
                
            </div>
            <div class="time-msg-title" v-if="!isEdit">用户密码</div>
            <div class="time-msg-form">
                <div  v-if="!isEdit">
                    <el-form-item  label="新密码" prop="NewPassword">
                        <el-input :type="userForm.Visible?'password':''" v-model="userForm.NewPassword" placeholder="请输入密码">
                            <i slot="suffix" title="显示密码" @click="changePass('show','Visible')" style="cursor:pointer;"
                            class="el-input__icon iconfont " :class="{'icon-kejian':userForm.Visible,'icon-bukejian':!userForm.Visible}"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item  label="确认密码"  prop="ConfirmPassword">
                        <el-input :type="userForm.ConfirmVisible?'password':''" v-model="userForm.ConfirmPassword" placeholder="请输入密码">
                            <i slot="suffix" title="显示密码" @click="changePassCon('show','ConfirmVisible')" style="cursor:pointer;"
                            class="el-input__icon iconfont " :class="{'icon-kejian':userForm.ConfirmVisible,'icon-bukejian':!userForm.ConfirmVisible}"></i>
                        </el-input>
                    </el-form-item>
                </div>
                <!-- <div v-else>
                    <el-form-item  label="新密码" prop="NewPasswordEdit">
                        <el-input :type="userForm.Visible?'password':''" v-model="userForm.NewPasswordEdit" placeholder="请输入密码">
                            <i slot="suffix" title="显示密码" @click="changePass('show','Visible')" style="cursor:pointer;"
                            class="el-input__icon iconfont " :class="{'icon-kejian':userForm.Visible,'icon-bukejian':!userForm.Visible}"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item  label="确认密码"  prop="ConfirmPasswordEdit">
                        <el-input :type="userForm.ConfirmVisible?'password':''" v-model="userForm.ConfirmPasswordEdit" placeholder="请输入密码">
                            <i slot="suffix" title="显示密码" @click="changePassCon('show','ConfirmVisible')" style="cursor:pointer;"
                            class="el-input__icon iconfont " :class="{'icon-kejian':userForm.ConfirmVisible,'icon-bukejian':!userForm.ConfirmVisible}"></i>
                        </el-input>
                    </el-form-item>
                </div> -->
            </div>
            <div class="time-msg-title">联系方式</div>
            <div class="time-msg-form">
                <el-form-item label="电话号码" prop="Telephone">
                    <el-input type="text" v-model="userForm.Telephone" placeholder="请输入电话号码"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="Email">
                    <el-input type="text" v-model="userForm.Email" placeholder="请输入邮箱号"></el-input>                       
                </el-form-item>
                
            </div>
        
        </el-form>
        </div>
        <div class="aom-common-footer">
            <aom-common-buttons @parentSave="saveUser" @parentCancel="backPath"></aom-common-buttons>
        </div>
    </div>
</template>

<script>
import mixin from '$mixin/mixin'
import AomHeader from '$packages/frame/aom-header'
import AomEditTips from '$packages/frame/aom-edit-tips'
import AomCommonButtons from '$packages/frame/aom-common-buttons'
    const circleBcgArr = [
        '#E8EAF6',
        '#E3F2FD',
        '#E0F2F1',
        '#F3E5F5',
        '#FBE9E7',
        '#FFEBEE',
        '#EEEEEE',
    ]
    const preCls = 'editUser'
    export default {
        name: 'editUser',
        mixins:[mixin],
        components:{AomHeader,AomEditTips,AomCommonButtons},
        data() {
            let __ = this;
            var validName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入名称！'));
                } else {
                    if(value.length>20) {
                        callback(new Error('长度在1-20个字符'))
                    }
                    callback();
                }
            };
            var validDuration= (rule, value, callback) => {
                if (!value || $.isNumeric(value) == false) {
                    callback(new Error('请输入有效数据'));
                } else {
                    if(value.length>20) {
                        callback(new Error('长度在1-20个字符'))
                    }
                    callback();
                }
            };
            var validatePass = (rule, value, callback) => {
                    if (value === '') {
                    callback(new Error('请输入密码'));
                    } else {
                    if (__.userForm.ConfirmPassword !== '') {
                        __.$refs.ruleForm.validateField("ConfirmPassword");
                    }
                    callback();
                    }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                callback(new Error('请再次输入密码'));
                } else if (value !== __.userForm.NewPassword) {
                callback(new Error('两次输入密码不一致!'));
                } else {
                callback();
                }
            };
            var validateEditPass = (rule, value, callback) => {
                if (value === '') {
                    callback();
                } else {
                if (__.userForm.ConfirmPasswordEdit !== '') {
                    __.$refs.ruleForm.validateField("ConfirmPasswordEdit");
                }
                    callback();
                }
            };
            var validateEditPass2 = (rule, value, callback) => {
                if (value !== __.userForm.NewPasswordEdit) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                getUser:'',
                circleBcgArr,
                preCls,
                isEdit:false,
                role: '',
                departmentOptions:[],//部门选项
                roleOptions: [],//角色选项
                userForm:{
                    Name:'',//姓名
                    UserName:'',//用户名
                    Department:'',//部门
                    Role:[],//角色
                    Sex:'0',//性别
                    Icon:'',//头像
                    Visible:true,//新密码是否可见
                    ConfirmVisible:true,//确认密码是否可见
                    NewPassword:'',//新密码
                    ConfirmPassword:'',//确认密码
                    OfficePhone:'',//手机号
                    Telephone:"",
                    Email:'',//邮箱
                    NewPasswordEdit:'',
                    ConfirmPasswordEdit:'',
                },
                rules:{
                    Name: [
                        { required: true,validator:validName,trigger: 'blur' },
                        // { required: true,validator:validName,trigger: 'change' }
                    ],
                    UserName: [
                        { required: true,validator:validName,trigger: 'blur' },
                        // { required: true,validator:validName,trigger: 'change' }
                    ],
                    NewPassword: [
                         { required: true,validator:validatePass,trigger: 'blur' },
                    ],
                    ConfirmPassword: [
                         { required: true,validator:validatePass2,trigger: 'blur' },
                    ],
                    NewPasswordEdit:[
                         { validator:validateEditPass,trigger: 'blur' },
                    ],
                    ConfirmPasswordEdit:[
                        { validator:validateEditPass2,trigger: 'blur' },
                    ]
                }
            }
        },
        created() {
            let _ = this;
            let getId = this.$root._route.query.account;//用户名
            console.log(getId);
            //查部门和角色信息
            this.http.get(`${this.preApiName}/Platform/Departments`).then( res => {
                this.departmentOptions = res.data.data;
            })
            this.http.get(`${this.preApiName}/Platform/Roles`).then( res => {
                this.roleOptions = res.data.data;
            })
            if(getId){
                //查询用户信息
                this.getUser = getId;
                this.isEdit = true;
                _.http.get(`${this.preApiName}/Platform/Users?Account=`+getId).then( res => {
                    console.log(res);
                    let data = res.data.data.length ? res.data.data[0] : '';
                    if(data){
                        _.userForm.Name = data.Name;
                        _.userForm.UserName = data.Account;
                        _.userForm.Department = data.DepartmentId;
                        _.userForm.Role = data.UserRoles;
                        _.userForm.Sex = ""+data.Sex;
                        _.userForm.Icon = '';
                        _.userForm.Visible = true;
                        _.userForm.ConfirmVisible = true;
                        _.userForm.NewPassword = '';
                        _.userForm.ConfirmPassword = '';
                        _.userForm.Telephone = data.Telephone;
                        _.userForm.Email = data.Email;
                    }
                    
                })
            }
            
        },
        methods: {
            backPath() {
                this.$router.push(`${this.preName}/user/main/user`)
            },
            async saveUser() {
                //检验
                let checkResult = await this.getValidateResult();
                if(!checkResult)return
                let _ = this;
                let sendData = {
                    Account: this.myTrim(this.userForm.UserName),
                    Name: this.myTrim(this.userForm.Name),
                    Password:this.getUser?this.myTrim(this.userForm.ConfirmPasswordEdit):this.myTrim(this.userForm.ConfirmPassword),
                    Sex: this.userForm.Sex,
                    Telephone: this.myTrim(this.userForm.Telephone),
                    OfficePhone: this.myTrim(this.userForm.OfficePhone),
                    Email: this.myTrim(this.userForm.Email),
                    Wechat: "",
                    DepartmentId: this.userForm.Department,
                    Description: "",
                    Role:this.userForm.Role
                };
                if(this.getUser){//更新
                    this.http.put(`${this.preApiName}/Platform/Users?Account=${this.getUser}`,sendData).then( res => {
                        //成功
                        if(res.status===201){
                            this.BindRolesToUser(sendData.Role,this.getUser);   
                            this.showMessage('修改用户成功！','success');
                            this.backToMain();

                        }
                    }).catch(res =>{
                        let err = res.response.data.error ? res.response.data.error : '修改用户失败！';
                        this.showMessage(err,'error');
                    })
                }else{//保存
                    this.http.post(`${this.preApiName}/Platform/Users`,sendData).then( res => {
                        //成功
                        if(res.status===201){
                            this.BindRolesToUser(sendData.Role,sendData.Account);   
                            this.showMessage('新建用户成功！','success');
                            // this.isEdit = true;
                            // this.getUser = res.data.Id;
                            this.backToMain();
                        }
                    }).catch(res =>{
                        let err = res.response.data.error ? res.response.data.error : '新建用户失败！';
                        this.showMessage(err,'error');
                    })
                }
                
            },
            addUser(){
                this.userForm = {
                    Name:'',//姓名
                    UserName:'',//用户名
                    Department:[],//部门
                    Role:[],//角色
                    Sex:'0',//性别
                    Icon:'',//头像
                    Visible:true,//新密码是否可见
                    ConfirmVisible:true,//确认密码是否可见
                    NewPassword:'',//新密码
                    OldPassword:'',//旧密码
                    Telephone:'',//手机号
                    Email:''//邮箱
                };
                this.getUser="";
                this.isEdit = false;
                this.$router.push(`${this.preName}/user/main/user/userEdit`)
            },
            
            clickIcon(item) {
                item.isOpen = !item.isOpen
              
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
            moduleRightChange(item) {
                if(!item.isEnabled){  
                    item.Resources.forEach( r => {
                        let right = r.right
                        for(let o in right){
                            right[o] = false
                        }
                    })
                }
            },
            changePass(value,type) {
                // if(type=='ConfirmVisible'){
                //     this.userForm.ConfirmVisible = !(value === 'show');
                // }else{
                //     this.userForm.Visible = !(value === 'show');
                // }
                 this.userForm.Visible =  !this.userForm.Visible
                
            }, 
            changePassCon(){
                this.userForm.ConfirmVisible = !this.userForm.ConfirmVisible
            }
            ,   //判断渲染，true:暗文显示，false:明文显示
            // showMessage(message, type) {
            //     this.$message({
            //         type: type,
            //         message: message
            //     });
            // },
            BindRolesToUser(Roles,userName){
                let RoleData = [];
                Roles.map(item=>{
                    RoleData.push({RoleId:item.Id});
                });
                this.http.put(`${this.preApiName}/Platform/UserRoles?UserAccount=${userName}`,RoleData).then(res=>{
                    if(res.status===201){

                    }
                });
            },
            getValidateResult(){
                let _ = this;
                return  new Promise((resolve, reject) =>{
                    _.$refs.ruleForm.validate((valid)=>{
                        resolve(valid) 
                    })
                })
                
            },
            updown(){
                return false;
            }
        }
    }
</script>

<style lang="less">
    @preCls: ~'editUser';

    .fontBlodStyle(){
        font-family: ~'微软雅黑 Bold', ~'微软雅黑 Regular', ~'微软雅黑';
        font-weight: 700;
        font-style: normal;
        font-size: 20px;
        color: #515151;
    }

    .@{preCls} {
        padding:20px 30px;
        &-header{
            border-bottom: 1px solid #ebeef5;
            margin-bottom: 20px;
            &-title{
                .fontBlodStyle();
                font-size: 20px;
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

        .treelist-item{
            width: 100%;
            padding-top: 10px;
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
            justify-content: space-between;
            height: 100%;
            line-height: 60px;
        }
        .treelist-item-right{
            display: flex;
            align-items: center;
            align-content: center;
            justify-content: space-between;
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
        }
        .right-name{
            text-align: center;
        }
        .time-msg-title{
            .fontBlodStyle();
            width: max-content;
            font-size: 18px;
            border-bottom: 3px solid #409EFF;
            margin-bottom: 20px;
            line-height: 30px;
        }
        .time-msg-form{
            // width: calc(~'100% - 50px');
            // margin-left: 50px;
            padding: 0 100px;
            & .el-form--label-left .el-form-item__label{
                text-align: right;
            }
        }
        .el-select {
            width: 100%;
        }
        .mustInfo{
            line-height: 20px;
            font-size: 10px;
            display: block;
        }
        .mustInfo i{
            font-size: 12px;
        }
        .headIcon span{
            width: 35px;
            height: 35px;
            border: 2px solid #797979;
            text-align: center;
            line-height: 35px;
            font-weight: bold;
            font-size: 12px;
            border-radius: 50%;
            display: inline-block;
        }
        .headIcon button{
                margin-left: 20px;
        }
    }
</style>
