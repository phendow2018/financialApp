<template>
    <div :class="['small-container']">
        <div :class="[preCls + '-header']">
            <aom-header parentTitle="用户管理" mainTitle="用户编辑" @aom-go-back="backPath"></aom-header>
            <div class="main-header-nav">
                 <aom-edit-tips editTipsName='用户编辑' :editItemName="editUserName"></aom-edit-tips>
            </div>
        </div>
        <div :class="[preCls + '-content']" v-loading="isLoading">
            <el-form :model="userForm" label-width="100px" class="demo-ruleForm" :rules="rules" ref="ruleForm" @submit.prevent="updown">
            <div class="edit-object-title">用户信息</div>
            <div class="time-msg-form">             
                    <el-form-item label="用户名" prop="UserName">
                        <el-input type="text" autocomplete="off" v-model="userForm.UserName" placeholder="请输入用户名，用于登陆" :disabled="isEdit"></el-input>      
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="Name">
                        <el-input type="text" autocomplete="off" v-model="userForm.Name" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="用户角色" prop="Role" v-show="userForm.Level !== 0">
                        <el-select v-model="userForm.Role" multiple placeholder="请选择角色" value-key="Id" class="user-select" style="width: 100%;">
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
                    <!-- <el-form-item label="管理员" prop="IsAdmin">
                        <el-radio v-model="userForm.IsAdmin" label="0">否</el-radio>
                        <el-radio v-model="userForm.IsAdmin" label="1">是</el-radio>
                    </el-form-item> -->
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
            </div>
            <div class="time-msg-title">联系方式</div>
            <div class="time-msg-form">
                <!-- <el-form-item label="电话号码" prop="OfficePhone">
                    <el-input type="text" v-model="userForm.OfficePhone" placeholder="请输入电话号码"></el-input>
                </el-form-item> -->
                <el-form-item label="邮箱" prop="Email">
                    <el-input type="text" v-model="userForm.Email" placeholder="请输入邮箱号"></el-input>                       
                </el-form-item>
                <el-form-item label="描述" prop="Description">
                    <el-input type="textarea" v-model="userForm.Description" placeholder="请输入描述信息"></el-input>
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
                isLoading: false,
                roleOptions: [],//角色选项
                userForm:{
                    Name:'',//姓名
                    UserName:'',//用户名
                    Role:[],//角色
                    Sex:'1',//性别
                    Visible:true,//新密码是否可见
                    ConfirmVisible:true,//确认密码是否可见
                    NewPassword:'',//新密码
                    ConfirmPassword:'',//确认密码
                    OfficePhone:'',//手机号
                    Telephone:"",
                    Email:'',//邮箱
                    NewPasswordEdit:'',
                    ConfirmPasswordEdit:'',
                    Level: 1,
                    IsAdmin: '0',
                    Description: '',
                },
                rules:{
                    Name: [
                        { required: true,validator:validName,trigger: 'blur' },
                    ],
                    UserName: [
                        { required: true,validator:validName,trigger: 'blur' },
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
                },
                editUserName:''
            }
        },
        created() {
            let _ = this;
            let getId = this.$root._route.query.account;//用户名
            //查部门和角色信息
            if(getId){
                //查询用户信息
                this.getUser = getId;
                this.isEdit = true;
                _.http.get(`${this.preApiName}/financial/platform/users/roles?UserAccount=${getId}`).then( res => {
                    let data = res.data.data
                    if(data){
                        _.userForm.Name = data.Name;
                        _.userForm.UserName = data.Account;
                        _.userForm.Role = data.Roles;
                        _.userForm.Sex = "" + data.Sex;
                        _.userForm.Visible = true;
                        _.userForm.ConfirmVisible = true;
                        _.userForm.NewPassword = '';
                        _.userForm.ConfirmPassword = '';
                        _.userForm.OfficePhone = data.OfficePhone;
                        _.userForm.Email = data.Email;
                        _.userForm.Level = data.Level;
                        _.userForm.Description = data.Description
                        _.userForm.IsAdmin = ''+data.IsAdmin;
                    }
                })
            }  

            this.http.get(`${this.preApiName}/financial/platform/roles`).then( res => {
                this.roleOptions = res.data.data
            })
        },
        methods: {
            backPath() {
                this.$router.go(-1)
            },
            async saveUser() {
                //检验
                let checkResult = await this.getValidateResult();
                if(!checkResult)return
                let _ = this;
                let sendData = {
                    Account: this.myTrim(this.userForm.UserName),
                    Name: this.myTrim(this.userForm.Name),
                    Password:this.getUser ? this.myTrim(this.userForm.ConfirmPasswordEdit) : this.myTrim(this.userForm.ConfirmPassword),
                    Sex: this.userForm.Sex,
                    Telephone: this.myTrim(this.userForm.Telephone),
                    OfficePhone: this.myTrim(this.userForm.OfficePhone),
                    Email: this.myTrim(this.userForm.Email),
                    Role:this.userForm.Role,
                    IsAdmin:parseInt(this.userForm.IsAdmin),
                    Description: this.userForm.Description,
                };
                if(this.getUser){//更新
                    this.http.put(`${this.preApiName}/financial/platform/users?Account=${this.getUser}`,sendData).then( res => {
                        if(res.status === 201){
                            this.updateRole()
                        }
                    }).catch(res =>{
                        let err = res.response.data.error ? res.response.data.error : '修改用户失败！';
                        this.showMessage(err,'error');
                    })
                } else {//保存
                    sendData.CreateUser = this.$root.account
                    this.http.post(`${this.preApiName}/financial/platform/users`,sendData).then( res => {
                        if(res.status === 201){
                            this.updateRole()
                        }
                    }).catch(res =>{
                        let err = res.response.data.error ? res.response.data.error : '新建用户失败！';
                        this.showMessage(err,'error');
                    })
                }
            },
            updateRole() {
                let roleList = this.userForm.Role.map(v => {
                    return {RoleId: v.Id}
                })
                console.log(roleList)
                this.http.put(`${this.preApiName}/financial/platform/users/roles?UserAccount=${this.getUser}`,roleList).then( res => {
                    if(res.status === 201){
                        this.showMessage(this.getUser ? '修改用户成功！' : '新建用户成功！','success');
                        this.backToMain();
                    }
                }).catch(res =>{
                    let err = res.response.data.error ? res.response.data.error : '新建（修改）用户失败！';
                    this.showMessage(err,'error');
                })
            },
            addUser(){
                this.userForm = {
                    Name:'',//姓名
                    UserName:'',//用户名
                    Role:[],//角色
                    Sex:'0',//性别
                    Visible:true,//新密码是否可见
                    ConfirmVisible:true,//确认密码是否可见
                    NewPassword:'',//新密码
                    OldPassword:'',//旧密码
                    Telephone:'',//手机号
                    Email:'',//邮箱
                    IsAdmin:'0',
                    Level: 1
                };
                this.getUser = "";
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
                this.userForm.Visible =  !this.userForm.Visible
            }, 
            changePassCon(){
                this.userForm.ConfirmVisible = !this.userForm.ConfirmVisible
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