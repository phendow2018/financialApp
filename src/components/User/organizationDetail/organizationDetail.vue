<template>
    <div class="channel-detail globel-warpper-class">
        <!-- <div class="main-title globel-title-class">
            <span >用户管理 / </span>    
            <span >组织架构信息</span>
        </div>
        <div class="main-header-nav">
            <div class="main-header-nav-content">
                <div class="buttons-items">
                    <div class="function-buttons">
                    </div>
                    <div class="back-item">
                        <el-button type="info"  class="back-item-button"  @click="back" ><i class="iconfont icon-fanhui" ></i>返回</el-button>
                    </div>
                </div>
            </div>
        </div> -->
        <aom-header parentTitle="用户管理" mainTitle="组织架构信息"></aom-header>
        <div class="channel-main-container detail-content-globel">
            <div class="channel-main-content" v-if="noerroroccured">
                <div class="detail-content content-left">
                    <aom-panel >
                        <div slot="header">
                        <div>部门信息</div>
                    </div>
                    <div slot="content">
                        <aom-panel-item v-for="(item, index) in departmentInfo" :item="item"  :idx="index" :bigsize="index === 0" :showname="index !== 0" :key="item.Name"></aom-panel-item>
                    </div>
                    </aom-panel>
                    <aom-panel style="margin-top: 20px;">
                        <div slot="header">
                            <div>新建子部门</div>
                        </div>
                        <div slot="content">
                            <el-form ref="form" :model="program" :rules="rule" label-width="100px" style="width: 80%;margin-left: 10%;padding-top: 20px;">
                                <el-form-item label="部门名称:" prop="Name">
                                    <el-input v-model="program.Name"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click="addProgram">添加至当前部门</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </aom-panel>
                </div>
                <div class="detail-content content-right">
                    <aom-panel  class="panel-right" :withfooter="true" :items="departmentInfo">
                        <div slot="header">
                            <div>子部门信息<i class="total-count-big-tipe">{{childInfo.length}}</i></div>
                        </div>
                        <div slot="content">
                            <!-- <aom-panel-delete v-show="childInfo.length > 0" v-for="(item,index) in childInfo" :idx="index" :item="item" :key="item.Id" :onDelete="onDeleteProgram"></aom-panel-delete> -->
                            <ul>
                                <li v-for="(item, index) in childInfo"  :key="index">
                                <aom-line  :item="item" @on-todetail="onToDetail" @on-edit="onEdit" @on-delete="onDeleteProgram">
                                    <template slot="desc">
                                        <span class="bottom-desc-name" >{{item.Content}}</span>
                                    </template>
                                </aom-line>
                                </li>
                            </ul>
                            <div v-show="childInfo.length === 0" class="no-program">当前部门暂时没有子部门</div>
                        </div>
                    </aom-panel>
                </div>
            </div>
            <div class="channel-main-content" v-else>
                获得当前部门信息出错，请联系技术管理员
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
export default {
    mixins: [ mixin ],
    components:{AomPanel, AomPanelItem, AomPanelDelete,AomHeader,AomLine},
    data(){
        return {
            noerroroccured: true,
            departmentInfo:[],
            curChannel:'',
            program:{
                Name:'',
            },
            rule:{
                Name:[
                    { required: true, message: '请输入部门名称', trigger: 'blur' }
                ]
            },
            childInfo:[],
            id: ''
        }
    },
    created(){
        let id = this.id = this.$route.query.id
        this.http.get(`${this.preApiName}/Platform/Departments?Id=${id}`).then((res) => {
            let data = res.data.data.length ? res.data.data[0] : {};
            if(data.ParentId){
                this.http.get(`${this.preApiName}/Platform/Departments?Id=${data.ParentId}`).then( o => {
                    let parent = o.data.data.length ? o.data.data[0] : {};
                    this.addItemToItems(data, 'Name', '名称');
                    this.addItemToItems(parent, 'Name', '上级部门');
                    this.addItemToItems(data, 'Description', '描述');
                })
            }else{
                data.ParentName = '无'
                this.addItemToItems(data, 'Name', '名称');
                this.addItemToItems(data, 'ParentName', '上级部门');
                this.addItemToItems(data, 'Description', '描述');
            }
            
        }).catch((err)=>{
            console.log(err);
            this.noerroroccured = false;
        });

        this.http.get(`${this.preApiName}/Platform/Departments?ParentId=${id}`).then((res) => {
            res.data.data.forEach((value) => {
                this.childInfo.push({
                    Name:value.Name,
                    Key: value.Id,
                    Content: value.Name,
                    Desc:value.Description
                });
            });
        }).catch((err) => {
        });
    },
    methods:{
        back(){
            this.$router.push(`${this.preName}/user/main/organization`)
        },
        addItemToItems(item, key, name){
            let pushitem = {};
            pushitem.Name = name;
            pushitem.Content = '';
            pushitem.Content = item[key];
            
            this.departmentInfo.push(pushitem);
        },
        addProgram(){
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    this.http.post(`${this.preApiName}/Platform/Departments`,{
                        Name: this.program.Name,
                        ParentId: this.id,
                        ManagerAccount: 'admin',
                        Order: 1,
                        Description: ''
                    }).then((res) => {
                        this.childInfo.push({
                            Name:this.program.Name,
                            Key: res.data.Id,
                            Content: this.program.Name,
                            Desc:this.program.Description
                        });
                        this.showMessage(
                             '添加子部门成功！',
                             'success'
                        );
                        this.$refs['form'].resetFields();
                        this.program.Name = '';
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
            this.http.delete(`${this.preApiName}/Platform/Departments?Id=${programId.Key}`).then((res) => {
                let index = -1;
                for(let k = 0; k < this.childInfo.length; ++k) {
                    if(this.childInfo[k].Key === programId.Key) {
                        index = k;
                        break;
                    }
                }
                if(index > -1){
                    this.showMessage({
                        message: '删除部门成功！',
                        type: 'success'
                    });
                    this.childInfo.splice(index, 1);
                }     
            }).catch((err) => { 
                this.showMessage({
                    message: '删除部门失败' + ', 原因：' + err.response.data.error,
                    type: 'error'
                });
            });
        },
        onToDetail(){

        },
        onEdit(){

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
        // padding: 20px 30px 0 30px;
        box-sizing: border-box;
    }
    .main-class{
        // width: 80vw;
    }
    .channel-detail{ 
        width: 100%;     
        padding: 20px 0;
        box-sizing: border-box;
    }
    .main-title{
        .main-class;
        padding-top:0px;
        font-weight: 700;

        .fontBlodStyle();
        padding: 0;
        // font-size: 20px;
        & span:first-child{
            color: #AEAEAE;
        }
        
        & span:last-child{
            color:#545454;
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
        }
        .el-button--primary{
            width: 140px;
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

</style>
