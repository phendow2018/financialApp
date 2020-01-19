<template>
    <div :class="['small-container']">
        <div :class="[preCls + '-header']">
            <aom-header parentTitle="用户管理" :mainTitle="isEdit ? '角色编辑' : '新建角色'"  @aom-go-back="backPath"></aom-header>
            <div class="main-header-nav">
                <aom-edit-tips editTipsName='角色编辑' :editItemName="currentItemName"></aom-edit-tips>
            </div>
        </div>
        
        <div :class="[preCls + '-content']">
            <div :class="['edit-object-title']">
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
            <div :class="['edit-object-title']">
                角色权限
            </div>
            <div :class="[preCls + '-content-main']">
                <div class="treelist-item" v-for="(item, key) in copyRight">
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
                        <div class="treelist-item-right">
                            <el-switch
                                class="module-switch"
                                v-model="item.isEnabled"
                                active-color="#1296db"
                                inactive-color="#8a8a8a"
                                @change="moduleRightChange(item)"
                                :width="60">
                            </el-switch>
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
                                        <el-switch 
                                            v-model="Resources.right[node]"
                                            active-color="#1296db"
                                            inactive-color="#8a8a8a"
                                            :width="40"
                                            :disabled="!item.isEnabled"
                                            >
                                        </el-switch>
                                        <div class="right-name">{{getRightName(node)}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
    const circleBcgArr = [
        '#E8EAF6',
        '#E3F2FD',
        '#E0F2F1',
        '#F3E5F5',
        '#FBE9E7',
        '#FFEBEE',
        '#EEEEEE',
    ]
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
                currentItemName:'',
                currentInfo: {
                    Name: '',
                    IsAdmin:0,
                    Description:''
                },
                rules:{
                    Name: [
                        { required: true, validator:validName, trigger: 'blur'},
                    ],
                },
                isAdmin: true,
                circleBcgArr,
                roleId: '',
                rightList: [],
                copyRight: [],
                roleInfo: {},
                editContentName:''
            }
        },
        watch: {
            '$root.rights': {
                deep: true,
                handler(val) {
                    if(!val) return
                    this.rightList = val
                    this.compareRight()
                },
                immediate: true
            },
            roleInfo() {
                this.compareRight()
            }
        },
        created() {
            let id
            let roleId = id = this.roleId = this.$route.query.id
            if(id) {
                this.http.get(`${this.preApiName}/Platform/Roles?Id=${id}`).then( res => {
                    let item = res.data.data.length > 0 ? res.data.data[0] : this.currentInfo;
                    this.currentItemName = this.currentInfo.Name = item.Name
                    this.currentInfo.Description = item.Description;
                    this.currentInfo.IsAdmin = item.IsAdmin; 
                    this.isEdit = true

                    //权限处理
                    let data = res.data.data
                    data.length > 0 ? this.roleInfo = res.data.data[0] : this.showMessage( `该角色不存在，请重新查询`,'error')
                    this.editContentName = this.roleInfo.Name
                }).catch( ({response}) => {
                    this.showMessage( `获取角色信息失败，原因：${response.data.error}！`,'error')
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

                    this.saveRight(result.data.Id)
                    this.backToMain();
                    this.showMessage(
                        `角色${isEdit ? '修改' : '新建'}成功！`,
                        'success',
                        0
                    );
                }catch(e) {
                    this.showMessage(e.response.data.error,'error')
                }
            },
            backPath() {
                // this.$router.push(`${this.preName}/role`)
                this.$router.go(-1)
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
            },
            //两个异步请求完成时，同时都要调这个函数
            compareRight() {
                if(this.rightList){
                    let roleRight = []
                    if(this.roleInfo.Id){
                        roleRight = this.roleInfo.Rights ? JSON.parse(this.roleInfo.Rights) : []
                    }       
                   

                    this.copyRight = this.deepCopy(this.rightList)
                    this.copyRight.forEach( item => { 
                        let roleNode = roleRight.find(rr => {
                            return rr.UrlPrefix == item.UrlPrefix
                        })

                        roleNode ? roleNode : roleNode = {Resources:[]}

                        this.$set(item, 'isEnabled', roleNode.Resources.length ? true : false)
                        this.$set(item, 'isOpen', roleNode.Resources.length ? true : false)

                        item.Resources.forEach( o => {
                            let roleSecNode = roleNode.Resources.find( sr => {
                                return sr.Url == o.Url
                            })

                            roleSecNode ? roleSecNode : roleSecNode = {Method: ''}
                            let obj = {}
                            o.Method.split(',').forEach( r => {
                                if(r != ''){
                                    obj[r] = roleSecNode.Method.indexOf(r) == -1 ? false : true
                                }
                            })
                            this.$set(o, 'right', obj)
                        })
                    })
                }
            },
            backPath() {
                this.$router.go(-1)
            },
            saveRight(id) {
                let formatRight = this.getFormatRights()
                let roleInfo = this.roleInfo
                if(!roleInfo.Id) roleInfo.Id = id
                this.http.put(`${this.preApiName}/Platform/Roles?Id=${roleInfo.Id}`, {
                    Name: roleInfo.Name,
                    isAdmin: roleInfo.isAdmin,
                    Description: roleInfo.Description,
                    Rights: formatRight
                }).then( res=> {
                    this.showMessage(`更新角色权限成功！`,'success',0);
                }).catch( ({response}) => {
                    this.showMessage( `更新权限失败，原因：${response.data.error}！`,'error')
                })
            },
            clickIcon(item) {
                item.isOpen = !item.isOpen
            },
            getFormatRights() {
                let rightArr = []
                this.copyRight.map( (item) => {
                    if(!item.isEnabled) return
                    let node = {}
                    node.Type = item.Type
                    node.UrlPrefix = item.UrlPrefix
                    node.Sort = item.Sort
                    let nodeRight = []
                    item.Resources.map( res => {
                        let rightStringArr = []
                        let rights = res.right
                        Object.keys(rights).map( sr => {
                            rights[sr] ? rightStringArr.push(sr) : null
                        })
                        let rightString = rightStringArr.toString()
                        if(rightString){
                            nodeRight.push({
                                Method: rightString,
                                Name: res.Name,
                                Url: res.Url
                            })
                        }
                    })
                    node.Resources = nodeRight
                    rightArr.push(node)
                })

                return rightArr
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
                item.Resources.forEach( r => {
                    let right = r.right
                    for(let o in right){
                        right[o] = item.isEnabled
                    }
                })
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
        &-content{
            &-main{
                padding: 0 100px;
            }
        }
    }
    .aom-common-footer{
        margin: 30px 0 60px 0;
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
</style>
