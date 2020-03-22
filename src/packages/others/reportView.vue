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
                <div class="rate-header">
                    主要财务数据比率
                </div>
                <div class="view-items-container view-item-header " :class="`view-items-container${headList.length}`" :style="{width: `${headList.length * 180 + 149}px`}" style="background: #fff;text-align: right;">
                    <div v-for="header in headList" :key="header.Desc">{{header.Desc}}</div>
                </div>
                <div class="view-items-container" :class="`view-items-container${headList.length}`" :style="{width: `${headList.length * 180 + 149}px`}" style="background: #fff;"
                    v-for="(item, index) in ratioList" :key="index">
                    <div class="view-item" v-for="(v, idx) in item.List" :style="{'text-align': idx == 0 ? 'left' : 'right', 'background-color': index % 2 == 0 ? '#f1f1f1' : ''}" :key="idx">{{v}}</div>
                </div>
            </div>

            <div class="rate-of-container">
                <div class="rate-header">
                    主要财务数据变化率
                </div>
                <vue-scroll :ops="ops">
                    <div class="view-ratio-container view-item-header " :class="`view-ratio-container${ratioChangeHeaderList.length}`" :style="{width: `${headList.length * 180 + 149}px`}" style="background: #fff;text-align: right;">
                        <div v-for="(header, idx) in ratioChangeHeaderList" :key="idx">{{header.Desc}}</div>
                    </div>
                    <div class="view-ratio-container" :class="`view-ratio-container${ratioChangeHeaderList.length}`" :style="{width: `${headList.length * 180 + 149}px`}" style="background: #fff;"
                        v-for="(item, index) in ratioChangeList" :key="index">
                        <div class="view-item" v-for="(v, idx) in item.List" :style="{'text-align': idx == 0 ? 'left' : 'right', 'background-color': index % 2 == 0 ? '#f1f1f1' : ''}" :key="idx">{{v}}</div>
                    </div>
                </vue-scroll>
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
            ratioChangeHeaderList: [],
        }
    },
    created() {
        this.getRadios()
    },
    methods: {
        getRadios() {
            let _ = this
            let param = {}
            _.ratioChangeList = []
            _.ratioList = []
            _.ratioChangeHeaderList = []
            _.ratioChangeHeaderList.push('')

            param.Statements = _.headList.map(item => {
                return {
                    CompanyNumber:item.CompanyNumber,
                    Year: item.Year,
                    Type: item.Type
                }
            }).splice(1)

            _.http.post(`${_.preApiName}/financial/statistics/financial-ratio`, param).then(res => {
                let ratios = res.status == 201 ? res.data.data : []

                _.pushRatioToList(ratios, '净资产收益率(%)', 'ReturnOnEquity', '%')
                _.pushRatioToList(ratios, '资产回报率(%)', 'ReturnOnAssets', '%')
                _.pushRatioToList(ratios, '毛利率(%)', 'GrossProfitRate', '%')
                _.pushRatioToList(ratios, '净利润率(%)', 'NetSalesRate', '%')
                _.pushRatioToList(ratios, '总资产周转次数', 'TotalAssetsTurnover', '')
                _.pushRatioToList(ratios, '流动资产周转次数', 'CurrentAssetsTurnover', '')
                _.pushRatioToList(ratios, '应收账款周转天数', 'AccountsReceivableTurnover', '')
                _.pushRatioToList(ratios, '资产负债率(%)', 'AssetLiabilityRatio', '%')
                _.pushRatioToList(ratios, '流动比率', 'CurrentRatio', '%')
                _.pushRatioToList(ratios, '速动比率', 'QuickRatio', '%')
                _.pushRatioToList(ratios, '营业收入增长率(%)', 'RevenueGrowthRate', '%')
                _.pushRatioToList(ratios, '毛利增长率(%)', 'GrossProfitGrowthRate', '%')
                _.pushRatioToList(ratios, '总资产增长率(%)', 'GrowthRateOfTotalAssets', '%')
            }).catch(err => {

            })

            _.http.post(`${_.preApiName}/financial/statistics/financial-ratios-of-change`, param).then(res => {
                let changes = res.status == 201 ? res.data.data : []

                let validChanges = changes.filter(item => {
                    return item.BaseData != undefined
                })

                let tempChange = []

                //合并不需要的重复数据，当年份有连续时，可能会存在
                validChanges.forEach(item => {
                    let year = Number(item.Year),
                        type = item.Type,
                        lastYear = year - 1

                    
                    let idx = _.ratioChangeHeaderList.findIndex(v => { //当前报表
                        return v.Year == year && v.Type == type 
                    })

                    
                    if(idx < 0) {
                        _.ratioChangeHeaderList.push({
                            Year: year,
                            Type: type,
                            Desc: `${year}${this.getLabel(type)}`
                        })

                        _.ratioChangeHeaderList.push({
                            Desc: '变化率'
                        })
                        tempChange.push({...item.CurrentData, label: ''})
                        tempChange.push({...item.FinancialRatiosOfChange, label: '%'})
                        tempChange.push({...item.BaseData, label: ''})
                    } else {
                        tempChange.push({...item.FinancialRatiosOfChange, label: '%'})
                        tempChange.push({...item.BaseData, label: ''})
                    }

                    let idx1 = _.ratioChangeHeaderList.findIndex(v => { //去年同期
                        return v.Year == lastYear && v.Type == type 
                    })

                    if(idx1 < 0) {
                        _.ratioChangeHeaderList.push({
                            Year: lastYear,
                            Type: type,
                            Desc: `${lastYear}${this.getLabel(type)}`
                        })
                        _.ratioChangeHeaderList.push({
                            Desc: '变化率'
                        })
                    }
                })
                
                _.pushChangeToList(tempChange, '营业收入', 'OperationRevenue')
                _.pushChangeToList(tempChange, '净利润', 'NetProfit')
                _.pushChangeToList(tempChange, '资产总计', 'TotalAssets')
                _.pushChangeToList(tempChange, '负债合计', 'TotalLiabilities')
                _.pushChangeToList(tempChange, '股东权益合计', 'TotalOwnersEquity')
                _.pushChangeToList(tempChange, '流动资产合计', 'TotalCurrentAssets')
                _.pushChangeToList(tempChange, '营运资本', 'WorkingCapital')
                _.pushChangeToList(tempChange, '固定资产', 'FixedAssets')

                _.ratioChangeHeaderList.pop()
                console.log(_.ratioChangeList)
            }).catch(err => {

            })
        },
        pushRatioToList(ratios, title, prop, label) {
            let len = ratios.length
            let _ = this

            let arr = []
            arr.push(title)
            for(let i = 0; i < len; ++i) {
                if(ratios[i].FinancialRatio[prop] != undefined) {
                    arr.push(`${ratios[i].FinancialRatio[prop]}${label}`)
                } else {
                    arr.push('')
                }   
            }

            _.ratioList.push({
                List: arr
            })
        },
        pushChangeToList(ratioChange, title, prop) {
            let len = ratioChange.length
            let _ = this

            let arr = []
            arr.push(title)
            for(let i = 0; i < len; ++i) {
                if(ratioChange[i][prop] != undefined) {
                    arr.push(`${ratioChange[i][prop]}${ratioChange[i]['label']}`)
                } else {
                    arr.push('')
                }   
            }

            _.ratioChangeList.push({
                List: arr
            })
        },
    },
    watch: {
        headList: {
            deep: true,
            handler(value) {
                this.getRadios()
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
            grid-template-columns: 330px 140px 140px 180px 180px 180px;
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

        .rate-of-container {
            margin-top: 40px;
            padding-bottom: 20px;
            .rate-header {
                height: 30px;
                line-height: 30px;
                font-size: 18px;
                font-weight: 700;
            }   
        }

        .view-ratio-container {
            display: grid;

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
        .view-ratio-container1 {
            grid-template-columns: 180px;
        }
        .view-ratio-container2 {
            grid-template-columns: 180px 160px;
        }
        .view-ratio-container3 {
            grid-template-columns: 180px 160px 160px;
        }
        .view-ratio-container4 {
            grid-template-columns: 180px 160px 160px 160px;
        }
        .view-ratio-container5 {
            grid-template-columns: 180px 160px 160px 160px 160px;
        }
        .view-ratio-container6 {
            grid-template-columns: 180px 160px 160px 160px 160px 160px;
        }
        .view-ratio-container7 {
            grid-template-columns: 180px 160px 160px 160px 160px 160px 160px;
        }
        .view-ratio-container8 {
            grid-template-columns: 180px 160px 160px 160px 160px 160px 160px 160px;
        }
    }
</style>