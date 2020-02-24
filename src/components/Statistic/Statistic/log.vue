<template>
    <div class="big-container">
        <div class="search-container">

        </div>
        <div class="content-container">
            <vue-scroll :ops="ops">
                <el-table
                    :data="logData"
                    style="width: 100%"
                    :default-sort = "{prop: 'Time', order: 'descending'}"
                    >
                    <el-table-column
                    type="index"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="Time"
                    label="时间"
                    sortable
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="Content"
                    label="内容"
                    sortable
                    >
                    </el-table-column>
                    <el-table-column
                    prop="UserName"
                    label="操作用户"
                    width="180"
                    sortable
                    >
                    </el-table-column>
                </el-table>
            </vue-scroll>
        </div>
    </div>
</template>

<script>
import mixin from "$mixin/mixin";
export default {
    mixins: [mixin],
    data() {
        return {
            logData: []
        }
    },
    mounted() {
        this.getLogDatas()
    },
    methods: {
        getLogDatas() {
            
            this.http.get(`${this.preApiName}/financial/platform/logs?`).then(res => {
                if(res.status === 200) {
                    this.logData = res.data.data
                }
            })
        }
    },
}
</script>

<style lang="less" scoped>
    .search-container {
        height: 0px;
    }

    .content-container {
        height: calc(100vh - 60px - 20px);
    }
</style>