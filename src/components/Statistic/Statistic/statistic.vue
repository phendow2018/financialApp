<template>
  <div>
    <ICountUp :delay="delay" :endVal="endVal" :options="options" @ready="onReady" />
    <div id="chart" style="width: 400px;height: 400px;"></div>
    <el-button @click="onAdd">添加模块</el-button>
  </div>
</template>

<script>
let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
require("echarts/lib/component/legend");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/tooltip");
require('echarts/lib/component/dataZoom')

import modules from "@/common/modules";
import ICountUp from "vue-countup-v2";
export default {
  components: { ICountUp },
  data() {
    return {
      delay: 10,
      endVal: 0,
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ",",
        decimal: ".",
        prefix: "",
        suffix: "",
        duration: 1
      }
    };
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    initEcharts() {
      let chartDom = document.getElementById("chart");
      let chart = echarts.init(chartDom);

      let option = {
        title: {
          text: "某楼盘销售情况",
          subtext: "纯属虚构"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["意向", "预购", "成交"]
        },
        dataZoom: [{
          type: 'slider',
          start: 0,
          end: 80,
        }, {
          type: 'inside',
          start: 0,
          end: 80,
        }],
        toolbox: {
          show: true,
          feature: {
            magicType: { show: true, type: ["stack", "tiled"] },
            saveAsImage: { show: true }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "成交",
            type: "line",
            smooth: false,
            label: {
              show: true,
              position: "bottom",
              rotate: 0,
              formatter: "{c}"
            },
            itemStyle: {
              color: "#000"
            },
            lineStyle: {
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "red" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "blue" // 100% 处的颜色
                  }
                ],
                global: false // 缺省为 false
              }
            },
            areaStyle: {
              color: 'red'
            },
            
            data: [10, 12, 21, 54, 260, 830, 710]
          },
          {
            name: "预购",
            type: "line",
            smooth: true,
            data: [30, 182, 434, 791, 390, 30, 10]
          },
          {
            name: "意向",
            type: "line",
            smooth: true,
            data: [{value:130,
            symbol: 'rect'}, {value:1132, symbol: 'rect',symbolSize: [10, 8], symbolOffset: [-5,-5]}, 601, 234, 120, 90, 20]
          }
        ]
      };

      chart.setOption(option);

      chart.on("click", params => {
        console.log(params);
      });
    },
    onReady: function(instance, CountUp) {
      //   const that = this;
      //   instance.update(that.endVal + 100);
    },
    onAdd() {
      this.endVal = 10000;
      //   this.http
      //     .post(`${this.preApiName}/financial/platform/modules`, modules.company)
      //     .then(res => {
      //       this.showMessage(`添加模块成功！`, "success");
      //     })
      //     .catch(({ response }) => {
      //       this.showMessage(
      //         `添加模块成功，原因：${response.data.error}！`,
      //         "error"
      //       );
      //     });
    }
  }
};
</script>