<template>
  <div class="big-container">
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
        <div class="statistic-item summary" isLoading="summaryLoading">
          <div class="summary-item" :class="{'active': curMode == 'all'}" @click="curMode = 'all'">
            <div class="summary-title">总订单数</div>
            <div class="summary-value">
              <ICountUp :delay="delay" :endVal="TotalOrderCount" :options="options" @ready="onReady"/>
            </div>
          </div>
          <div class="summary-item" :class="{'active': curMode == 'send'}" @click="curMode = 'send'">
            <div class="summary-title">已发送订单数</div>
            <div class="summary-value">
              <ICountUp :delay="delay" :endVal="SendOrderCount" :options="options" @ready="onReady"/>
            </div>
          </div>
          <div class="summary-item" :class="{'active': curMode == 'unSend'}" @click="curMode = 'unSend'">
            <div class="summary-title">未发送订单数</div>
            <div class="summary-value">
              <ICountUp :delay="delay" :endVal="UnSendOrderCount" :options="options" @ready="onReady"/>
            </div>
          </div>
          <div class="summary-item" :class="{'active': curMode == 'cancel'}" @click="curMode = 'cancel'">
            <div class="summary-title">已取消订单数</div>
            <div class="summary-value">
              <ICountUp :delay="delay" :endVal="CanceledOrderCount"  :options="options" @ready="onReady"/>
            </div>
          </div>
        </div>
        <div class="statistic-item">
          <div class="title">订单量</div>
          <el-radio-group v-model="rangeType" size="small" class="range-tools">
            <el-radio-button label="day">日</el-radio-button>
            <el-radio-button label="month">月</el-radio-button>
            <el-radio-button label="quarter">季</el-radio-button>
            <el-radio-button label="year">年</el-radio-button>
          </el-radio-group>
          <div class="other-tools">
            <div class="day-tools" v-show="rangeType == 'day'">
              <div>
                <el-radio-group v-model="dayRange" size="small" class="">
                  <el-radio-button label="curMonth">本月</el-radio-button>
                  <el-radio-button label="lastMonth">上一月</el-radio-button>
                  <el-radio-button label="custom">自定义</el-radio-button>
                </el-radio-group>
              </div>
                
              <div class="month-select" v-show="dayRange == 'custom'">
                <el-date-picker
                  v-model="curMonth"
                  style="width:'100px'"
                  :clearable="false"
                  @change="onChangeMonth"
                  type="month"
                  placeholder="选择月">
                </el-date-picker>
              </div>
            </div>
            <div class="month-tools" v-show="rangeType == 'month'">
              <el-radio-group v-model="monthRange" size="small" class="">
                <el-radio-button label="curYear">本年度</el-radio-button>
                <el-radio-button label="lastYear">上一年度</el-radio-button>
                <el-radio-button label="custom">{{monthRange !== 'custom' ? '自定义' : curYear}}</el-radio-button>
              </el-radio-group>
              <div class="year-select" v-show="monthRange == 'custom' && yearShow">
                <div class="year-item" v-for="year in yearList" :key="year" @click="changeYear(year)">{{year}}</div>
              </div>
            </div>
          </div>
          <div id="chart" style="width: 100%;height: 600px;margin-top: 70px;"></div>
        </div>
        <!-- <div class="statistic-item">
          <div class="title">其他统计</div>
        </div> -->
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
      curMode: "all",
      rangeType: 'day',
      dayRange: 'curMonth',
      monthRange: '',
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
      yearShow: false,
      yearList: [],
      curYear: '',
      curMonth: '',
    };
  },
  mounted() {
    this.getSummay()
    this.initEcharts()
    this.getInitData()

    let year = (new Date()).getFullYear()
    let idx = 0
    while(idx < 10) {
      this.yearList.push(`${year}`)
      year--
      idx++
    }

    window.addEventListener('click', this.onClickWindow)
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
    getOrdersByMonth(year) {
      let _ = this
      _.chart.showLoading()
      _.http.get(`${this.preApiName}/financial/statistics/order-count/groupby-month?Year=${year}`).then(res => {
        if(res.status == 200) {
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

      this.updateChartOption(orderxAixs, allOrder, sendOrder, unSendOrder, cancelOrder)
    },
    updateChartOption(orderxAixs, allOrder, sendOrder, unSendOrder, cancelOrder) {
      let option = {
        title: {
          text: "订单统计情况",
          subtext: "",
          show: true,
          top: 10,
          left: 20,
        },
        grid: {
          top: 40,
          left: 60,
          right: 40,
          bottom: 30,
        },
        legend: {
          data: ['订单总量', '已发送','未发送', '已取消']
        },
        tooltip: {
          trigger: "axis"
        },
        xAxis: {
          type: "category",
          
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
          {
            name: "未发送",
            type: "bar",
            barWidth: 20,
            itemStyle: {
              color: '#ad40ff'
            },
            label: {
              show: true,
              position: 'top',
            },
            data: unSendOrder
          },
          {
            name: "已取消",
            type: "bar",
            barWidth: 20,
            label: {
              show: true,
              position: 'top',
            },
            data: cancelOrder
          }
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
      let curMonth = isCurMonth ? curDate.getMonth() + 1 : curDate.getMonth()
      curMonth = curMonth > 9 ? curMonth : `0${curMonth}`

      this.getOrdersByDate(`${curDate.getFullYear()}-${curMonth}`)
    },
    onClickWindow(event) {
      this.yearShow = event.target.defaultValue == 'custom'
    },
    changeYear(year) {
      this.curYear = year
      this.getOrdersByMonth(year)
    },
    onChangeMonth(date) {
      let month = date.getMonth() + 1
      month = month > 9 ? curMonth : `0${month}`
      this.getOrdersByDate(`${date.getFullYear()}-${month}`)
    }
  },
  watch: {
    rangeType(n, o) {
      switch(n) {
        case 'month':
          this.monthRange = 'curYear'
          this.getOrdersByMonth((new Date()).getFullYear())
        break;
        case 'quarter':
          this.getOrdersByQuarter()
        break;
        case 'year':
          this.getOrdersByYear()
        break;
        case 'day':
        default:
          this.dayRange = 'curMonth'

          this.getInitData()
        break;
      }
    },
    dayRange(n, o) {
      this.curMonth = ''
      switch(n) {
        case 'curMonth': 
          this.getInitData(true)
        break
        case 'lastMonth':
          this.getInitData(false)
        break
      }
    },
    monthRange(n, o) {
      this.curYear = '自定义'
      switch(n) {
        case 'curYear': 
          this.getOrdersByMonth((new Date()).getFullYear())
        break
        case 'lastYear':
          this.getOrdersByMonth((new Date()).getFullYear() - 1)
        break
        default: 
          this.yearShow = true
        break;
      }
    },
    
  },
  destroyed() {
    window.removeEventListener('click', this.onClickWindow)
  },
};
</script>

<style lang="less" scoped>
.statistic-main {
  .statistic-item {
    position: relative;
    padding-top: 20px;

    .title {
      width: 100px;
      height: 35px;
      line-height: 35px;

      &:before {
        content: "";
        position: absolute;
        top: 55px;
        left: 0;
        height: 6px;
        width: 50px;
        background-color: #409eff;
      }
    }

    .range-tools {
      position: absolute;
      left: 60px;
      top: 120px;
      z-index: 9999;
    }

    .other-tools {
      position: absolute;
      right: 40px;
      top: 120px;
      z-index: 9999;

      .day-tools{
        display: grid;
        grid-template-columns: auto auto;

        .el-date-editor.el-input, .el-date-editor.el-input__inner{
          width: 130px;
        }

        .month-select{
          margin-left: 5px;
          margin-top: -5px;
        }
      }

      .month-tools{
        position: relative;

        .year-select{
          position: absolute;
          right: -1px;
          width: 68px;
          top: 30px;
          height: 330px;
          border: 1px solid #eee;
          border-top: 0;
          border-radius: 0 0 4px 4px;
          background-color: #fff;

          .year-item {
            height: 32px;
            line-height: 32px;
            text-align: center;

            &:hover {
              background-color: #409EFF;
              cursor: pointer;
              color: white;
            }
          }
        }
      }
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