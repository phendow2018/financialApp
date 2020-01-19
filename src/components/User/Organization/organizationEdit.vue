<template>
    <div :class="['small-container']">
        <div :class="[preCls + '-header']">
            <!-- <div :class="[preCls + '-header-title']">
                <span :class="[preCls + '-header-title-left','globel-title-class']">用户管理 / </span>
                <span :class="[preCls + '-header-title-right']">{{isEdit ? '组织结构编辑' : '新建组织结构'}}</span>
            </div> -->
             <aom-header parentTitle="用户管理" :mainTitle="isEdit ? '组织结构编辑' : '新建组织结构'" @aom-go-back="backPath"></aom-header>
            <div class="main-header-nav">
                <aom-edit-tips editTipsName='组织结构编辑' :editItemName="currentItemName"></aom-edit-tips>
            </div>
        </div>
        <div :class="[preCls + '-content']">
            <div :class="['edit-object-title']">
                组织结构
            </div>
            <div :class="[preCls + '-content-form']">
                <el-form :model="currentInfo" label-width="100px" :rules="rules" ref="ruleForm">
                    <el-form-item label="部门名称" prop="Name">
                        <el-input type="text" autocomplete="off" placeholder="请输入部门名称" v-model="currentInfo.Name"></el-input>
                    </el-form-item>
                    <el-form-item label="上级部门" prop='ParentId' v-show="showParentDepartment">
                        <el-select v-model="currentInfo.ParentId" placeholder="请选择上级部门" size="medium" >
                            <!-- <el-option
                            label="*"
                            :value="null"></el-option> -->
                            <el-option
                                v-for="program in departmentList"
                                :key="program.Id"
                                :label="program.Name"
                                :value="program.Id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述" prop="Description">
                        <el-input type="textarea" v-model="currentInfo.Description" placeholder="请输入描述"></el-input>
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
    const preCls = "organizationEdit"
    export default {
        name: 'organizationEdit',
        mixins:[mixin],
        components:{AomHeader,AomEditTips,AomCommonButtons},
        data() {
            var validName = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入部门名称！'));
                } else {
                    callback();
                }
            };
            return {
                preCls,
                isEdit: true,
                departmentList: [],
                editDepartmentId:'',
                currentItemName:'',
                currentInfo: {
                    Name: '',
                    ParentId: '',
                    Description:''
                },
                showParentDepartment:true,
                rules:{
                    Name: [
                        { required: true, validator:validName, trigger: 'blur'},
                        // { required: true, validator:validName, trigger: 'change'}
                    ],
                    // ParentId: [
                    //     {
                    //         required:true, message:'请选择上级部门。',trigger: 'change'
                    //     }
                    // ],
                }    
            }
        },
        created() {
            let id = this.$route.query.id;
            let type = this.$route.query.type;
            this.http.get(`${this.preApiName}/Platform/Departments`).then( o => {
                this.departmentList = o.data.data
                if(this.departmentList.length==0){
                    this.showParentDepartment = false;
                    this.currentInfo.ParentId = null
                }
                if(id&&!type) {
                    this.http.get(`${this.preApiName}/Platform/Departments?Id=${id}`).then( res => {
                        let item = res.data.data[0]
                        if(item.ParentId==null){
                            this.showParentDepartment = false;
                        }else{
                            this.showParentDepartment = true;
                        }
                        this.currentItemName = item.Name
                        this.currentInfo.Name = item.Name
                        this.currentInfo.ParentId = item.ParentId
                        this.currentInfo.Description = item.Description
                        this.isEdit = true
                    })
                }else if(id&&!!type){
                    this.currentInfo.ParentId = id;
                }else{
                    this.isEdit = false;
                    this.currentInfo.ParentId = '0';
                }
            })
        },
        methods: {
            refresh() {
                this.isEdit = false;
                this.currentInfo.Name = ''
                this.currentInfo.ParentId = null
                this.currentInfo.Description = ''
            },
            save() {
                if(this.getValidateStatus()){
                    this.editDepartment()
                }
            },
            async editDepartment() {
                let isEdit = this.isEdit
                let currentInfo = this.currentInfo
                let item = {
                    Name: this.myTrim(currentInfo.Name),
                    ManagerAccount: this.$root.account,
                    Order: 1,
                    Description: this.myTrim(currentInfo.Description)
                }
                // !isEdit ? item.ParentId = 0 :item.ParentId = currentInfo.ParentId 
                item.ParentId =  currentInfo.ParentId 
                try{
                    let result = await this.http[isEdit ? 'put' : 'post'](`${this.preApiName}/Platform/Departments${isEdit ? `?Id=${this.$route.query.id?this.$route.query.id:this.editDepartmentId}` : ''}`, item)
                    this.isEdit = result.status === 201;
                    this.editDepartmentId =result.data.Id;
                    this.backPath();
                    this.showMessage(
                        `部门${isEdit ? '修改' : '新建'}成功！`,
                        'success',
                        0//关闭提示消息的延时（0为立即关闭）
                    );
                }catch(e) {
                    this.showMessage(e.response.data.error,'error')
                }
            },
            backPath() {
                // this.$router.push(`${this.preName}/organization`)
                this.$router.go(-1)
            },
            getInfo(){
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
    @preCls: ~'organizationEdit';
    
    .fontBlodStyle(){
        font-family: ~'微软雅黑 Bold', ~'微软雅黑 Regular', ~'微软雅黑';
        font-weight: 700;
        font-style: normal;
        font-size: 20px;
        color: #545454;
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
            }
        }

        &-content{
            &-title{
                width: max-content;
                .fontBlodStyle();
                font-size: 18px;
                border-bottom: 3px solid #409EFF;
                margin-bottom: 20px;
                line-height: 30px;
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
