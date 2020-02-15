<template>
  <div class="statistic-container">
    <div class="module-add" style="margin-top: 10px;" v-if="moduleAddShow">
      <el-button @click="onAdd('order')">添加订单模块</el-button>
      <el-button @click="onAdd('company')">添加企业模块</el-button>
      <el-button @click="onAdd('user')">添加用户模块</el-button>
      <el-button @click="onAdd('role')">添加角色模块</el-button>
      <el-button @click="onAdd('statistic')">添加统计模块</el-button>
    </div>
    <div class="module-add" style="margin-top: 10px;" v-if="moduleAddShow">
      <el-button @click="onEdit('order')">修改订单模块</el-button>
      <el-button @click="onEdit('company')">修改企业模块</el-button>
      <el-button @click="onEdit('user')">修改用户模块</el-button>
      <el-button @click="onEdit('role')">修改角色模块</el-button>
      <el-button @click="onEdit('statistic')">修改统计模块</el-button>
    </div>
    <vue-scroll :ops="ops">
      <div class="statistic-main">
        <div>
          <div style="padding-top: 10px;">
            <el-collapse style="padding-left: 10px;border-left: 6px solid #409eff;">
              <el-collapse-item title="简略信息" name="1">
                <div class="statistic-item summary" isLoading="summaryLoading">
                  <div class="summary-item">
                    <div class="summary-title">总订单数</div>
                    <div class="summary-value">
                      <ICountUp :delay="delay" :endVal="TotalOrderCount" :options="options" @ready="onReady"/>
                    </div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-title">已发送订单数</div>
                    <div class="summary-value">
                      <ICountUp :delay="delay" :endVal="SendOrderCount" :options="options" @ready="onReady"/>
                    </div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-title">未发送订单数</div>
                    <div class="summary-value">
                      <ICountUp :delay="delay" :endVal="UnSendOrderCount" :options="options" @ready="onReady"/>
                    </div>
                  </div>
                  <div class="summary-item">
                    <div class="summary-title">已取消订单数</div>
                    <div class="summary-value">
                      <ICountUp :delay="delay" :endVal="CanceledOrderCount"  :options="options" @ready="onReady"/>
                    </div>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
          
        <div class="statistic-item">
          <div class="title">
            <span>详细统计</span>
            <div class="mode-change">
              <el-radio-group v-model="modeType" size="small">
                <el-radio-button label="chart">图形</el-radio-button>
                <el-radio-button label="table">表格</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div id="chart" class="chart" v-show="modeType == 'chart'"></div>
          <div class="chart" v-show="modeType == 'table'">
            <el-table
              :data="monthDatas"
              stripe
              show-summary
              style="width: 100%">
              <el-table-column
                type="index"
                width="80">
              </el-table-column>
              <el-table-column
                prop="Month"
                label="时间"
                width="180">
              </el-table-column>
              <el-table-column
                prop="Count"
                label="总订单数"
                width="280">
              </el-table-column>
              <el-table-column
                prop="SendCount"
                label="已发送订单数"
                width="280">
              </el-table-column>
              <el-table-column
                prop="UnsendCount"
                label="未发送订单数">
              </el-table-column>
              <el-table-column
                prop="CancelCount"
                label="已取消订单数">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </vue-scroll>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts")
require("echarts/lib/chart/bar")
require("echarts/lib/component/legend")
require("echarts/lib/component/toolbox")
require("echarts/lib/component/tooltip")
require("echarts/lib/component/dataZoom")
require('echarts/lib/component/grid')

import modules from "@/common/modules";
import ICountUp from "vue-countup-v2";
import mixin from "$mixin/mixin.js";
export default {
  components: { ICountUp },
  mixins: [mixin],
  data() {
    return {
      moduleAddShow: false,
      delay: 10,
      TotalOrderCount: 0,
      SendOrderCount: 0,
      UnSendOrderCount: 0,
      CanceledOrderCount: 0,
      modeType: 'chart',
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: ".",
        prefix: "",
        suffix: "",
        duration: 1
      },
      chart: null,
      summaryLoading: false,
      monthDatas: [],
    };
  },
  mounted() {
    this.getSummay()
    this.initEcharts()
    this.getInitData()
  },
  methods: {
    getSummay() {
      this.http.get(`${this.preApiName}/financial/statistics/order-count`).then(res => {
        if(res.status == 200) {
          this.TotalOrderCount = res.data.Count
          this.SendOrderCount = res.data.SendCount
          this.UnSendOrderCount = res.data.UnsendCount
          this.CanceledOrderCount = res.data.CancelCount
        } else {
          this.TotalOrderCount = -1
          this.SendOrderCount = -1
          this.UnSendOrderCount = -1
          this.CanceledOrderCount = -1

          this.showMessage(`获取信息失败，请联系管理员`)
        }
      })
    },
    getOrdersByDate(month) {
      let _ = this
      _.chart.showLoading()
      _.http.get(`${this.preApiName}/financial/statistics/order-count/groupby-date?Month=${month}`).then(res => {
        if(res.status == 200) {
          _.updateDateStatistic('Date', res.data.data)
        }
      }).catch(err => {

      }) 
    },
    getOrdersByMonth(StartMonth, EndMonth) {
      let _ = this
      _.chart.showLoading()
      _.http.get(`${this.preApiName}/financial/statistics/order-count/groupby-month?StartMonth=${StartMonth}&EndMonth=${EndMonth}`).then(res => {
        if(res.status == 200) {
          _.monthDatas = res.data.data
          _.updateDateStatistic('Month', res.data.data)
        }
      }).catch(err => {

      })
    },
    getOrdersByQuarter() {
      let _ = this
      _.chart.showLoading()
      _.http.get(`${this.preApiName}/financial/statistics/order-count/groupby-quarter`).then(res => {
        if(res.status == 200) {
          _.updateDateStatistic('Quarter', res.data.data)
        }
      }).catch(err => {

      })
    },
    getOrdersByYear() {
      let _ = this
      _.chart.showLoading()
      _.http.get(`${this.preApiName}/financial/statistics/order-count/groupby-year`).then(res => {
        if(res.status == 200) {
          _.updateDateStatistic('Year', res.data.data)
        }
      }).catch(err => {

      })
    },
    updateDateStatistic(key, dateArray) {
      let allOrder = [],
          sendOrder = [],
          unSendOrder = [],
          cancelOrder = []
      
      let orderxAixs = []
      
      dateArray.forEach(item => {
        orderxAixs.push(item[key])

        allOrder.push(item.Count)
        sendOrder.push(item.SendCount) 
        unSendOrder.push(item.UnsendCount)
        cancelOrder.push(item.CancelCount)
      })

      // for(let i = 0; i < 120; ++i) {
      //   orderxAixs.push(`2010-02-0${i+1}`)
      //   allOrder.push(i* 100)
      //   sendOrder.push(i * 29) 

      //   this.monthDatas.push({
      //     Month: `2010-0${i+1}`,
      //     Count: i * 100,
      //     SendCount: i * 90,
      //     CancelCount: i * 8,
      //     UnsendCount: i * 2
      //   })
      // }

      this.updateChartOption(orderxAixs, allOrder, sendOrder, unSendOrder, cancelOrder)
    },
    updateChartOption(orderxAixs, allOrder, sendOrder, unSendOrder, cancelOrder) {
      let dataZoomStart =  orderxAixs.length  > 0 ? 100 - 12 * 100.0 / orderxAixs.length : 0
      dataZoomStart = dataZoomStart < 0 ? 0 : dataZoomStart
      let option = {
        title: {
          text: "订单统计情况",
          subtext: "",
          show: true,
          top: 10,
          left: 20,
        },
        dataZoom: [
        {
          type: 'slider',
          start: dataZoomStart,
          end: 100,
          height: 20,
        }],
        grid: {
          top: 40,
          left: 60,
          right: 40,
          bottom: 70,
        },
        legend: {
          data: ['订单总量', '已发送','未发送', '已取消']
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          nameRotate: 90,
          data: orderxAixs
        },
        yAxis: {
          type: "value",
          // interval: 1000,
        },
        series: [
          {
            name: "订单总量",
            type: "bar",
            barWidth: 20,
            itemStyle: {
              color: '#409eff'
            },
            label: {
              show: true,
              position: 'top',
            },
            data: allOrder
          },
          {
            name: "已发送",
            type: "bar",
            barWidth: 20,
            itemStyle: {
              color: '#39c53d'
            },
            label: {
              show: true,
              position: 'top',
            },
            data: sendOrder
          },
        ]
      };
      this.chart.hideLoading()
      this.chart.setOption(option)
    },
    initEcharts() {
      let chartDom = document.getElementById("chart");
      this.chart = echarts.init(chartDom);

      this.updateChartOption([], [], [], [])

      this.chart.on("click", params => {
        console.log(params);
      });
    },
    onReady: function(instance, CountUp) {
      //   const that = this;
      //   instance.update(that.endVal + 100);
    },
    onAdd(mod) {
      let _this = this;
      _this.endVal = 10000;
      _this.http
        .post(`${_this.preApiName}/financial/platform/modules`, modules[mod])
        .then(res => {
          _this.showMessage(`添加模块成功！`, "success");
        })
        .catch(({ response }) => {
          _this.showMessage(
            `添加模块失败，原因：${response.data.Message}！`,
            "error"
          );
        });
    },
    onEdit(mod) {
      let _this = this;
      _this.endVal = 10000;
      let modd = modules[mod];
      _this.http
        .put(
          `${_this.preApiName}/financial/platform/modules?Flag=${modd.Flag}`,
          modd
        )
        .then(res => {
          _this.showMessage(`修改模块成功！`, "success");
        })
        .catch(({ response }) => {
          _this.showMessage(
            `修改模块失败，原因：${response.data.Message}！`,
            "error"
          );
        });
    },
    getInitData(isCurMonth = true) {
      let curDate = new Date()
      let curMonth = curDate.getMonth() + 2
      curMonth = curMonth > 9 ? curMonth : `0${curMonth}`

      this.getOrdersByMonth(`2020-01`, `${curDate.getFullYear()}-${curMonth}`)
    },
  },
  watch: {
    modeType(n, o) {

    }
  },
};
</script>

<style lang="less" scoped>
.statistic-container{
  height: 100%;
}
.statistic-main {
  height: calc(100vh - 60px);
  width: 94%;
  margin-left: 3%;
  .statistic-item {
    position: relative;
    padding-top: 10px;

    .title {
      position: relative;
      height: 50px;
      line-height: 50px;
      font-size: 18px;

      span{
        padding-left: 10px;
      }

      border-left: 6px solid #409eff;
      .mode-change{
        position: absolute;
        right: 10px;
        top: 0;
      }
    }

    .chart{
      height: calc(100vh - 60px - 100px - 40px);
    }
  }
  .summary {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;

    .active {
      background-color: #fff;
    }

    .summary-item {
      &:hover {
        background-color: #e0e0e0;
        // cursor: pointer;
      }
      .summary-title {
        font-size: 18px;
        height: 35px;
        line-height: 40px;
        font-weight: 400;
        text-align: center;
      }

      .summary-value {
        font-size: 23px;
        font-weight: 200;
        height: 50px;
        line-height: 50px;
        color: #409eff;
        text-align: center;
      }
    }
  }
}
</style>