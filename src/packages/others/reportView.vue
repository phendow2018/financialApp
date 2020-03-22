<template>
    <div class="view-container">
        <div class="view-item-header view-items-container " :class="`view-items-container${headList.length}`" :style="{width: `${headList.length * 180 + 149}px`}" style="background: #fff;text-align:right;">
            <div v-for="header in headList" :key="header.Desc">{{header.Desc}}</div>
        </div>
        <vue-scroll :ops="ops">
            <template v-for="item in reportList">
                <div class="view-item view-item-header" :style="{width: `${headList.length * 180 + 144}px`}">
                    {{item.title}}
                </div>
                <div :style="{width: `${headList.length * 180 + 149}px`}"> 
                    <div v-for="sub in item.items" class="view-items-container" :class="`view-items-container${headList.length}`">
                        <div class="view-item" v-for="(vv, idx) in sub" :class="[idx == 0 ? '' : 'right-text']">{{vv}}</div>
                    </div>
                </div>
            </template>
            <div class="rate-of-container">
                
            </div>
        </vue-scroll>
    </div>
</template>

<script>
import mixin from "$mixin/mixin";
export default {
    mixins: [mixin],
    props: {
        reportList: {
            type: Array,
            default() {
                return []
            }
        },
        headList: {
            type: Array,
            default() {
                return []
            }
        },
    },
    data() {
        return {
            ratioList: [],
            ratioChangeList: [],
        }
    },
    created() {
        
    },
    methods: {
        
    },
    watch: {
        headList: {
            deep: true,
            handler(value) {
                let _ = this
                let param = {}

                param.Statements = _.headList.map(item => {
                    return {
                        CompanyNumber:item.CompanyNumber,
                        Year: item.Year,
                        Type: item.Type
                    }
                }).splice(1)
                _.http.post(`${_.preApiName}/financial/statistics/financial-ratio`, param).then(res => {
                    
                }).catch(err => {

                })

                _.http.post(`${_.preApiName}/financial/statistics/financial-ratios-of-change`, param).then(res => {
                    let changes = res.status == 201 ? res.data.data : []

                    _.ratioChangeList = changes.filter(item => {
                        return !!item.BaseData
                    })
                }).catch(err => {

                })
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .view-container {
        height: calc(100vh - 250px);
        .header {
            height: 40px;
            line-height: 40px;
            font-size: 20px;
            padding-left: 10px;
            background-color: #dae8f7;
        }

        .header-desc {
            height: 40px;
            line-height: 40px;
            font-size: 16px;
        }

        .view-item-header {
            height: 55px;
            line-height: 55px;
            font-size: 18px;
            // font-weight: 700;
            border-top: 1px solid #f1f1f1;
            background-color: #dae8f7;
        }

        .view-item{
            border-right: 1px solid #f1f1f1;
            border-bottom: 1px solid #f1f1f1;
            padding-right: 5px;
            height: 40px;
            line-height: 40px;
            font-size: 16px;
        }

        .view-items-container {
            display: grid;
            // height: 40px;
            // line-height: 40px;

            .sub-title{
                font-size: 17px;
                padding-left: 10px;
            }
            
            .view-item.right-text{
                text-align: right;
            }

            &:hover {
                background-color: #e8eff7;
            }
        }

        .view-items-container:nth-child(even) {
            background-color: #f1f1f1;
        }

        .view-items-container1 {
            grid-template-columns: 330px;
        }

        .view-items-container2 {
            grid-template-columns: 330px 180px;
        }

        .view-items-container3 {
            grid-template-columns: 330px 180px 180px;
        }

        .view-items-container4 {
            grid-template-columns: 330px 180px 180px 180px;
        }

        .view-items-container5 {
            grid-template-columns: 330px 180px 180px 180px 180px;
        }

        .view-items-container6 {
            grid-template-columns: 330px 180px 180px 180px 180px 180px;
        }

        .view-items-container7 {
            grid-template-columns: 330px 180px 180px 180px 180px 180px 180px;
        }

        .view-items-container8 {
            grid-template-columns: 330px 180px 180px 180px 180px 180px 180px;
        }

        .header-item-container {
            background-color: #f1f1f1;
            text-align: center;
        }
    }
</style>