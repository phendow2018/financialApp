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
              <ICountUp
                :delay="delay"
                :endVal="TotalOrderCount"
                :options="options"
                @ready="onReady"
              />
            </div>
          </div>
          <div
            class="summary-item"
            :class="{'active': curMode == 'send'}"
            @click="curMode = 'send'"
          >
            <div class="summary-title">已发送订单数</div>
            <div class="summary-value">
              <ICountUp
                :delay="delay"
                :endVal="SendOrderCount"
                :options="options"
                @ready="onReady"
              />
            </div>
          </div>
          <div
            class="summary-item"
            :class="{'active': curMode == 'unSend'}"
            @click="curMode = 'unSend'"
          >
            <div class="summary-title">未发送订单数</div>
            <div class="summary-value">
              <ICountUp
                :delay="delay"
                :endVal="UnSendOrderCount"
                :options="options"
                @ready="onReady"
              />
            </div>
          </div>
          <div
            class="summary-item"
            :class="{'active': curMode == 'cancel'}"
            @click="curMode = 'cancel'"
          >
            <div class="summary-title">已取消订单数</div>
            <div class="summary-value">
              <ICountUp
                :delay="delay"
                :endVal="CanceledOrderCount"
                :options="options"
                @ready="onReady"
              />
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
            <!-- <el-button @click="addOption">增加一项</el-button> -->
            <div class="day-tools" v-show="rangeType == 'day'">
              <el-radio-group v-model="dayRange" size="small" class="">
                
                <el-radio-button label="curMonth">本月</el-radio-button>
                <el-radio-button label="lastMonth">上一月</el-radio-button>
                <el-radio-button label="custom">选择月份</el-radio-button>
              </el-radio-group>
            </div>
            <div class="month-tools" v-show="rangeType == 'month'">
              <el-radio-group v-model="monthRange" size="small" class="">
                <el-radio-button label="custom">选择年份</el-radio-button>
              </el-radio-group>
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
      monthRange: 'custom',
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
    };
  },
  mounted() {
    this.getSummay()
    this.initEcharts()
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
    initEcharts() {
      let chartDom = document.getElementById("chart");
      this.chart = echarts.init(chartDom);

      let option = {
        title: {
          text: "某楼盘销售情况",
          subtext: "纯属虚构"
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
        // dataZoom: [
        //   {
        //     type: "slider",
        //     start: 0,
        //     end: 100
        //   },
        //   {
        //     type: "inside",
        //     start: 0,
        //     end: 100
        //   }
        // ],
        xAxis: {
          type: "category",
          // boundaryGap: false,
          data: ["2020-01-24","2020-01-25","2020-01-26","2020-01-27", "2020-01-28", "2020-01-29", "2020-01-30", "2020-01-31", "2020-02-01", "2020-02-02"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          // {
          //   name: "订单总量",
          //   type: "line",
          //   smooth: false,
          //   data: [3050, 3068, 3090, 3029, 3001, 3234, 3120, 3090, 3020, 3030]
          // },
          {
            name: "已发送",
            type: "bar",
            smooth: false,
            barWidth: 20,
            label: {
              show: true,
              position: 'top',
            },
            data: [3000, 3007, 3016, 3029, 3001, 3234, 3120, 3090, 3020, 3030]
          },
          {
            name: "未发送",
            type: "bar",
            smooth: false,
            barWidth: 20,
            label: {
              show: true,
              position: 'top',
            },
            data: [0, 11, 4, 1110, 1, 0, 31, 0, 1, 10]
          },
          {
            name: "已取消",
            type: "bar",
            smooth: false,
            barWidth: 20,
            label: {
              show: true,
              position: 'top',
            },
            data: [0, 1, 4, 0, 1, 0, 1, 0, 1, 0]
          }
        ]
      };

      this.chart.setOption(option);

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
    addOption() {
      this.chart.setOption({
        legend: {
          data: ['订单总量', '已发送','未发送', '已取消']
        },
        series: [
        {
          name: "订单总量",
          type: "line",
          smooth: false,
          data: [3050, 3068, 3090, 3029, 3001, 3234, 3120, 3090, 3020, 3030]
        },
        {
          name: "已发送",
          type: "line",
          smooth: false,
          data: [3000, 3007, 3016, 3029, 3001, 3234, 3120, 3090, 3020, 3030]
        },
        {
          name: "未发送",
          type: "line",
          smooth: false,
          data: [0, 11, 4, 1110, 1, 0, 31, 0, 1, 10]
        },
        {
          name: "已取消",
          type: "line",
          smooth: false,
          data: [0, 1, 4, 0, 1, 0, 1, 0, 1, 0]
        }]
      })
    },
  }
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
        cursor: pointer;
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