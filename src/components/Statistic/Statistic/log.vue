<template>
    <div class="big-container">
        <div class="search-container">
            <div></div>
            <div>
                <span>时间范围：</span>
                <el-date-picker
                    v-model="range"
                    type="daterange"
                    :clearable="false"
                    :default-time="['00:00:00', '23:59:59']"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </div>
                
            <div>
                <type-select :menuList="menuList" @on-type-changed="onTypeChanged" class="search"></type-select>
                <el-input v-model="queryString" :placeholder="searchPlaceholder" class="input" style="border-radius: 0 4px 4px 0;" v-if="curSearchType == 'FuzzyContent'"></el-input>
                <el-select v-model="queryString" placeholder="请选择" style="width: 60%;border-radius: 0 4px 4px 0;" v-else>
                    <el-option
                    v-for="item in userList"
                    :key="item.Name"
                    :label="item.Name"
                    :value="item.Name">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="onSearch">查询</el-button>
            </div>
                
            <div></div>
        </div>
        <div class="content-container">
            <vue-scroll :ops="ops">
                <el-table
                    :data="logData"
                    style="width: 100%"
                    :default-sort = "{prop: 'Time', order: 'descending'}"
                    >
                    <el-table-column
                    width="80"
                    >
                    <template slot-scope="scope">
                        <span style="margin-left: 10px">{{ ((currentPage - 1) * perPageCount + scope.$index + 1) }}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="Time"
                    label="时间"
                    
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="Content"
                    label="内容"
                    >
                    </el-table-column>
                    <el-table-column
                    prop="UserName"
                    label="操作人员"
                    width="180"
                    >
                    </el-table-column>
                </el-table>
                <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="perPageCount"
                    layout="total, prev, pager, next"
                    :total="curSearchCount">
                </el-pagination>
            </vue-scroll>
        </div>
    </div>
</template>

<script>
import mixin from "$mixin/mixin";
import TypeSelect from '$packages/others/searchType.vue'
export default {
    mixins: [mixin],
    components: { TypeSelect },
    data() {
        return {
            range: [],
            logData: [],
            perPageCount: 100,
            queryString: '',
            curSearchType: 'FuzzyContent',
            currentPage: 1,
            curSearchCount: 0,
            searchPlaceholder: '请输入内容',
            menuList: [{
                Id: 'FuzzyContent',
                Name: '内容'
            },{
                Id: 'UserName',
                Name: '操作人员'
            }],
            userList: [{
                Name: 'zyx',
            }, {
                Name: 'zd'
            }]
        }
    },
    mounted() {
        this.getUserList()
    },
    methods: {
        getLogDatas(page) {
            if(this.range.length < 2) {
                this.showMessage('请选择时间范围', 'warning')
                return
            }
            this.http.get(`${this.preApiName}/financial/platform/logs?StartTime=${this.range[0]}&EndTime=${this.range[1]}&${this.curSearchType}=${this.queryString}&Page=${this.currentPage}&PerPage=${this.perPageCount}`).then(res => {
                if(res.status === 200) {
                    this.logData = res.data.data
                    this.curSearchCount = res.data.totalCount
                }
            })
        },
        getUserList() {
            this.http.get(`${this.preApiName}/financial/platform/users`).then(res => {
                if(res.status === 200) {
                    this.userList = res.data.data
                }
            })
        },
        onTypeChanged(searchType) {
            this.queryString = ''
            this.curSearchType = searchType
        },
        handleCurrentChange() {
            this.getLogDatas(this.currentPage)
        },
        onSearch() {
            this.getLogDatas(1)
        },
    },
}
</script>

<style lang="less" scoped>
    .search-container {
        height: 60px;
        line-height: 60px;
        display: grid;
        grid-template-columns: 1fr 494px 600px 1fr;

        .search{
            margin-top: 11px;
            margin-right: 0px;
            width: 84px;
        }

        .input{
            width: 60%;
             
        }
    }

    .content-container {
        height: calc(100vh - 60px - 80px);
    }
</style>