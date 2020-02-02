<template>
<vue-scroll :ops="ops" ref='globel-scroll'>
    <div class="small-container">
        <!--  -->
        <aom-header :showBack="false" mainTitle="角色管理"></aom-header>
        <aom-tab :defaultQueryString="queryString"  @on-search="searchQueryString" @on-add="newItem" placeholderText="请输入角色名称进行搜索" :showButton="$root.rights.includes('role_1_1')"></aom-tab>
        <div :class="[preCls + '-tabs']" v-loading="isLoading">
            <el-tabs v-model="activeName">
                <el-tab-pane label="全部" name="all">
                    <span slot="label">全部<span class="total-count-tipe">{{this.allCount}}</span></span>
                    <div :class="[preCls + '-tabs-content']">
                        <line-list :listData="roleList" @on-edit="editItem" @on-delete="deleteItem" @on-todetail="clickName" @edit-right="skipRight" :showRightEditButton="true" :enableToLink="false" :showDeleteButton="$root.rights.includes('role_1_3')" :showEditButton="$root.rights.includes('role_1_2')"></line-list>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- -->
    </div>
 </vue-scroll>
</template>
<script>
import mixin from '$mixin/mixin';
import aomHeader from '$packages/frame/aom-header'
import aomTab from '$packages/aom/tab/aom-tab.vue'
import lineList from '$packages/aom/advcab/lineList'
const preCls = 'role'
export default {
    name: 'role',
    components: {
        aomTab,
        aomHeader,
        lineList
    },
    mixins: [mixin],
    data() {
        return {
            preCls,
            activeName: 'all',
            roleList: [],
            queryString: '',
            allCount: 0,
            isLoading:false
        }
    },
    created() {
        this.isLoading = true;
        this.http.get(`${this.preApiName}/financial/platform/roles?SortBy=Name`).then( res => {
            this.roleList = res.data.data
            this.allCount = this.roleList.length
            this.isLoading = false;
        })
    },
    methods: {
        searchQueryString(...args) {
            this.isLoading = true;
            let qString = decodeURIComponent(args[1])
            this.http.get(`${this.preApiName}/financial/platform/roles?FuzzyQuery=${qString}`).then( (res) => {
                this.roleList = res.data.data
                this.isLoading = false;
                // this.$refs.autoInput.suggestions = []
            })
        },
        stringSearch(qString, cb) {
            qString = decodeURIComponent(qString)

            this.http.get(`${this.preApiName}/financial/platform/roles?FuzzyQuery=${qString}`).then( (res) => {
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
            this.http.get(`${this.preApiName}/financial/platform/roles?Id=${item.id}`).then( (res) => {
                this.roleList = res.data.data
                //阅读element源码得知suggestions
                this.$refs.autoInput.suggestions = []
            })
        },
        skipRight(item) {
            this.$router.push(`${this.preName}/role/editRight?id=${item.Id}`)
        },
        clickName(item) {
            this.$router.push(`${this.preName}/role/roleDetail?id=${item.Id}`)
        },
        editItem(item) {
            this.$router.push(`${this.preName}/role/roleEdit?id=${item.Id}`)
        },
        newItem() {
            this.$router.push(`${this.preName}/role/roleEdit`)
        },
        async deleteItem(item) {
            this.http.delete(`${this.preApiName}/financial/platform/roles?Id=${item.Id}`).then(res => {
                if(res.status == 204){
                    let roleList = this.roleList
                    roleList.splice(roleList.findIndex( o=>{
                        return item.Id == o.Id
                    }), 1)
                    this.allCount--
                    this.showMessage(`删除角色‘${item.Name}'’成功！`,'success');
                }else{
                    this.showMessage(`删除角色‘${item.Name}'’失败！`,'error');
                }
            }).catch( ({response}) => {
                this.showMessage(`删除角色‘${item.Name}'’失败，原因：${response.data.error}！`,'error');
            })
        },
    }
}
</script>