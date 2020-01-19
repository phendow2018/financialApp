<template>
    <div :class="[preCls,'globel-warpper-class']">
        <div :class="[preCls + '-header']">
            <!-- <div :class="[preCls + '-header-title']">
                <span :class="[preCls + '-header-title-left','globel-title-class']">用户管理 /</span>
                <span :class="[preCls + '-header-title-right','globel-title-class']">{{isEdit ? '角色编辑' : '新建角色'}}</span>
            </div> -->
            <aom-header parentTitle="用户管理" :mainTitle="isEdit ? '角色编辑' : '新建角色'"></aom-header>
            <div class="main-header-nav">
                <aom-edit-tips editTipsName='用户编辑' :editItemName="currentInfo.Name"></aom-edit-tips>
                <!-- <div class="main-header-nav-content">
                    <div class="buttons-items">
                        <div class="function-buttons">
                            <el-button type="info" class="function-buttons-item contract-first-btn" size="medium" @click="refresh"><i class="iconfont icon-xinjian"></i> 新建</el-button>
                            <el-button type="info" class="function-buttons-item" size="medium" @click="save"><i class="iconfont icon-baocun"></i> 保存</el-button>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
        
        <div :class="[preCls + '-content']">
            <div :class="[preCls + '-content-title']">
                角色信息
            </div>
            <div :class="[preCls + '-content-form']">
                <el-form :model="currentInfo" label-width="100px" :rules="rules" ref="ruleForm">
                    <el-form-item label="角色名称" prop="Name">
                        <el-input type="text" autocomplete="off" placeholder="请输入角色名称" v-model="currentInfo.Name"></el-input>
                    </el-form-item>
                    <el-form-item label="管理员" prop='ParentId'>
                        <el-radio-group v-model="currentInfo.IsAdmin">
                            <el-radio :label="1">是</el-radio>
                            <el-radio :label="0">否</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="描述" prop="Description">
                        <el-input type="textarea" v-model="currentInfo.Description" placeholder="请输入描述信息"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <div class="aom-common-footer">
            <aom-common-buttons @parentSave="save" @parentCancel="backPath"></aom-common-buttons>
        </div>
    </div>
</template>

<script>
import mixin from '$mixin/mixin'
import AomHeader from '$packages/frame/aom-header'
import AomEditTips from '$packages/frame/aom-edit-tips'
import AomCommonButtons from '$packages/frame/aom-common-buttons'
    const preCls = "roleEdit"
    export default {
        name: 'roleEdit',
        mixins:[mixin],
        components:{AomHeader,AomEditTips,AomCommonButtons},
        data() {
            var validName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入角色名称！'));
                } else {
                    callback();
                }
            };
            return {
                preCls,
                isEdit: true,
                currentInfo: {
                    Name: '',
                    IsAdmin:0,
                    Description:''
                },
                rules:{
                    Name: [
                        { required: true, validator:validName, trigger: 'blur'},
                        // { required: true, validator:validName, trigger: 'change'}
                    ],
                    // ParentId: [
                    //     {
                    //         required:true,message:'请选择上级部门。',trigger: 'change'
                    //     }
                    // ],
                },
                isAdmin: true
            }
        },
        created() {
            let id = this.$route.query.id
            if(id) {
                this.http.get(`${this.preApiName}/Platform/Roles?Id=${id}`).then( res => {
                    let item = res.data.data.length > 0 ? res.data.data[0] : this.currentInfo;
                    this.currentInfo.Name = item.Name
                    this.currentInfo.Description = item.Description;
                    this.currentInfo.IsAdmin = item.IsAdmin; 
                    this.isEdit = true
                })
            }else{
                this.isEdit = false
            }
        },
        methods: {
            refresh() {
                this.isEdit = false;
                this.currentInfo.Name = '';
                this.currentInfo.Description = '';
                this.currentInfo.IsAdmin = 0;
            },
            save() {
                if(this.getValidateStatus()){
                    this.editInfo()
                }
            },
            async editInfo() {
                let isEdit = this.isEdit
                let currentInfo = this.currentInfo
                let item = {
                    Name: this.myTrim(currentInfo.Name),
                    Description: this.myTrim(currentInfo.Description),
                    Rights: '',
                    IsAdmin:currentInfo.IsAdmin,
                    CreateUser:this.$root.account
                }
                try{
                    let result = await this.http[isEdit ? 'put' : 'post'](`${this.preApiName}/Platform/Roles${isEdit ? `?Id=${this.$route.query.id}` : ''}`, item)
                    this.isEdit = result.status === 201;
                    this.backToMain();
                    this.showMessage(
                         `角色${isEdit ? '修改' : '新建'}成功！`,
                         'success'
                    );
                }catch(e) {
                    this.showMessage(e.response.data.error,'error')
                }
            },
            backPath() {
                this.$router.push(`${this.preName}/user/main/role`)
            },
            getInfo() {
                this.getValidateStatus()
            },
            getValidateStatus() {
                let validStatus = false
                this.$refs['ruleForm'].validate((valid) => {
                    validStatus = valid
                })
                return validStatus
            }
        },
    }
</script>

<style lang="less" scoped>
    @preCls: ~'roleEdit';
    
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
            &-title{
                width: max-content;
                .fontBlodStyle();
                font-size: 18px;
                border-bottom: 3px solid #409EFF;
                line-height: 30px;
                margin-bottom: 20px;
            }

            &-form{
                padding: 0 100px;

                &-container{
                    height: 100px;
                    width: 100%;
                    padding: 10px 20px;
                    border: 1px solid #e4e4e4;
                    font-size: 18px;
                }

                .container-right{
                    font-weight: 800;
                }

                .el-select{
                    width: 100%;
                }
            }
        }
    }    
</style>
