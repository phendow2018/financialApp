<template>
    <div class="small-container">
        <aom-header :showBack="false" mainTitle="组织结构管理"></aom-header>
        <aom-tab   :defaultQueryString="queryString"  @on-search="searchQueryString" @on-add="newItem" placeholderText="请输入部门名称或缩写进行搜索"></aom-tab>
        <div :class="[preCls + '-tabs']"  v-loading="isLoading">
            <div :class="[preCls + '-tabs-content']">
                <treelist :showIcon="false" @clickName="clickName" :treeListData="organizationList" childTreeName="ChildDeparnets" :showDelete="showDeleteButton" :open="true" @editItem="editItem" @deleteItem="deleteItem">
                    <template slot="beforeButton" slot-scope="{ item }" v-if="isTreeMode">
                        <i class="iconfont icon-people"></i>   
                        <span  :class="[preCls + '-user-count']">{{item.ChildCount}}</span>
                    </template>
                </treelist>
                
            </div>
        </div>
    </div>
     
</template>
<script>
import mixin from '$mixin/mixin';
import aomHeader from '$packages/frame/aom-header'
import aomTab from '$packages/aom/tab/aom-tab.vue'
import lineList from '$packages/aom/advcab/lineList'
import treelist from '$packages/treelist.vue'
const preCls = 'organization'
export default {
    name: 'organization',
    components: {
        treelist,
        aomTab,
        aomHeader,
        lineList
    },
    mixins: [mixin],
    data() {
        return {
            preCls,
            activeName: 'all',
            organizationList: [],
            queryString: '',
            allCount: 0,
            isTreeMode:true,
            isLoading:false,
        }
    },
     created() {
           this.initData();
        },
        methods: {
            showDeleteButton(item){
                if(item.Id==0){
                    return false
                }else{
                    return true
                }
               
            },
            async initData(){
                let treeRes = await  this.http.get(`${this.preApiName}/Platform/DepartmentTree`),
                    treeData =[];
                    treeRes.data.data.map(item=>{
                        if(item.Id ==0){
                            treeData =  item.ChildDeparnets;
                        }
                    });

                this.isLoading = true
                this.isTreeMode = true
                this.http.get(`${this.preApiName}/Platform/Departments?Id=0`).then( res => {
                    let list = res.data.data;
                    // this.allCount = this.organizationList.length
                    // this.isLoading = false
                    this.http.get(`${this.preApiName}/Platform/Departments?ParentId=0`).then(res =>{
                        // list[0].ChildDeparnets = res.data.data
                        let secondLevelData = res.data.data,
                            dataLen = secondLevelData.length;
                        
                            for(let j = 0 ;j<treeData.length;j++){
                                for(let i=0;i<dataLen;i++){
                                    if(treeData[j].Id === secondLevelData[i].Id){
                                        secondLevelData[i].ChildDeparnets=[];
                                        secondLevelData[i].ChildCount=treeData[j].ChildDeparnets.length;
                                    }
                                }
                            }
                            
                        list[0].ChildCount = treeData.length;
                        list[0].ChildDeparnets=secondLevelData;
                        this.isLoading = false
                        this.organizationList = list;
                    })
                })
            },
            searchQueryString(...args) {
                this.isLoading = true;
                let qString = decodeURIComponent(args[1])
                if(!qString){
                    //  this.http.get(`${this.preApiName}/Platform/DepartmentTree`).then(res=>{
                    //     this.organizationList = res.data.data
                    //     // this.$refs.autoInput.suggestions = []
                    //     this.isTreeMode=true;
                    //     this.isLoading = false;
                    //  })
                    this.initData();
                }else{
                    this.http.get(`${this.preApiName}/Platform/Departments?FuzzyQuery=${qString}`).then( (res) => {
                        this.organizationList = res.data.data
                        // this.$refs.autoInput.suggestions = []
                        this.isTreeMode = false
                        this.isLoading = false;
                    })
                }
               
            },
            stringSearch(qString, cb) {
                qString = decodeURIComponent(qString)

                this.http.get(`/Platform/Departments?FuzzyQuery=${qString}`).then( (res) => {
                    let list = []
                    for(let item of res.data.data)
                    {
                        list.push({
                            name: item.Name,
                            id: item.Id
                        })
                    }
                    cb(list)
                })
            },
            handleSelect(item) {
                this.http.get(`/Platform/Departments?Id=${item.id}`).then( (res) => {
                    this.organizationList = res.data.data
                    this.isTreeMode = false
                    //阅读element源码得知suggestions
                    this.$refs.autoInput.suggestions = []
                })
            },
            tabClick() {
                // this.queryString = ''
                // this.searchQueryString()
            },
            clickName(item) {
                this.$router.push(`${this.preName}/organization/organizationDetail?id=${item.Id}`)
            },
            editItem(item) {
                this.$router.push(`${this.preName}/organization/organizationEdit?id=${item.Id}`)
            },
            newItem() {
                this.$router.push(`${this.preName}/organization/organizationEdit`)
            },
            async deleteItem(item) {
                let isDelete = await this.getDeleteDecide(item);
                let _ = this;
                if(isDelete) {
                    this.http.delete(`${this.preApiName}/Platform/Departments?Id=${item.Id}`).then(res => {
                        if(res.status == 204){
                            // this.http.get(`${this.preApiName}/Platform/DepartmentTree`).then(o => {
                            //     this.organizationList = o.data.data
                            //     this.allCount = this.organizationList.length
                            // })
                             let idx = _.organizationList[0].ChildDeparnets.findIndex((v ,index,arr)=>{
                                return v.Id == item.Id;
                            })
                            if(idx!=-1){
                                _.organizationList[0].ChildDeparnets.splice(idx,1);
                                _.organizationList[0].ChildCount-=1;
                            }
                            this.showMessage(
                                 `删除部门‘${item.Name}'’成功！`,
                                 'success'
                            );
                        }else{
                            this.showMessage(
                                 `删除部门‘${item.Name}'’失败！`,
                                 'error'
                            );
                        }
                    }).catch( ({response}) => {
                        this.showMessage(
                             `删除部门‘${item.Name}'’失败，原因：${response.data.error}！`,
                             'error'
                        );
                    })
                }
            },
            async getDeleteDecide(item) {
                let prompted = null
                prompted = await this.$confirm(`您确定要删除部门名称为‘${item.Name}’的部门?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                return prompted
            },
        }
}
</script>
<style lang="less">
 
</style>

