<template>
<vue-scroll :ops="ops" ref='globel-scroll'>
    <div class="small-container">
        <aom-tab :defaultQueryString="queryString" @on-search="searchQueryString" @on-add="newItem" placeholderText="请输入用户账号或名称进行搜索" :showButton="$root.rights.includes('user_1_1')"></aom-tab>
        <div :class="[preCls + '-tabs']" v-loading="isLoading">
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="全部" name="all">
                    <span slot="label">全部<span class="total-count-tipe">{{this.allCount}}</span></span>
                    <div :class="[preCls + '-tabs-content']">
                        <line-list :listData="userList" @on-edit="editItem" @on-delete="deleteItem" @on-todetail="clickName" :enableToLink="false" @toUserRole="toUserRole"  :showDeleteButton="$root.rights.includes('user_1_3')" :showEditButton="$root.rights.includes('user_1_2')"></line-list>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</vue-scroll>
</template>
<script>
import mixin from '$mixin/mixin';
import aomHeader from '$packages/frame/aom-header'
import aomTab from '$packages/aom/tab/aom-tab.vue'
import lineList from '$packages/aom/advcab/lineList'
import treelist from '$packages/treelist.vue'
const preCls = 'user'
export default {
    mixins: [ mixin ],
    components:{
        aomHeader,
        aomTab,
        lineList,
        treelist
    },
    data(){
        return{
            preCls,
            activeName: 'all',
            userList: [],
            queryString: '',
            allCount: 0,
            pageToken:this.$root.token,
            onlineCount:0,
            isTabLoading: false,
            isLoading:false
        }
    },
    created() {
        this.isLoading = true;
        this.http.get(`${this.preApiName}/financial/platform/users`).then( res => {
            this.userList = res.data.data
            this.allCount = this.userList.length
            this.onlineCount = res.data.loginUserCount ? res.data.loginUserCount : 0
            this.isLoading = false;
        })
        let token = this.getToken('Token');
    },
    methods:{
        searchQueryString(...args) {
            this.isLoading = true;
            let qString = decodeURIComponent(args[1])
            this.http.get(`${this.preApiName}/financial/platform/users?FuzzyQuery=${qString}`).then( (res) => {
                this.userList = res.data.data
                this.isLoading = false;
            })
        },
        stringSearch(qString, cb) {
            qString = decodeURIComponent(qString)

            this.http.get(`${this.preApiName}/financial/platform/users?FuzzyQuery=${qString}`).then( (res) => {
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
            this.http.get(`${this.preApiName}/financial/platform/users?Name=${item.name}`).then( (res) => {
                this.userList = res.data.data
                //阅读element源码得知suggestions
                this.$refs.autoInput.suggestions = []
            })
        },
        tabClick() {
            // this.queryString = ''
            // this.searchQueryString()
        },
        clickName(item) {
            this.$router.push(`${this.preName}/user/userDetail?account=${item.Account}`)
        },
        editItem(item) {
            this.$router.push(`${this.preName}/user/userEdit?account=${item.Account}`)
        },
        newItem() {
            this.$router.push(`${this.preName}/user/userEdit?`)
        },
        toUserRole(item){
            this.$router.push(`${this.preName}/role/roleDetail?id=${item}`)
        },
        deleteItem(item) {
            if(item.Level === 0)
                return;
            this.http.delete(`${this.preApiName}/financial/platform/users?Account=${item.Account}`).then(res => {
                if(res.status == 204){
                    let userList = this.userList
                    userList.splice(userList.findIndex( o=>{
                        return item.Account == o.Account
                    }), 1)
                    this.allCount--
                    this.showMessage(
                            `删除用户‘${item.Name}'’成功！`,
                            'success'
                    );
                }else{
                    this.showMessage(
                            `删除用户‘${item.Name}'’失败！`,
                            'error'
                    );
                }
            }).catch( ({response}) => {
                this.showMessage(
                        `删除用户‘${item.Name}'’失败，原因：${response.data.error}！`,
                        'error'
                );
            })

        },
        async getDeleteDecide(item) {
            let prompted = null
            prompted = await this.$confirm(`您确定要删除用户‘${item.Name}’?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            return prompted
        },
    },
    mounted(){
    } 
}
</script>
<style lang="less" scoped>
    .slot-label{
        cursor: pointer;
    }
</style>
  