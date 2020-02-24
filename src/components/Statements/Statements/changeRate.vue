<template>
  <div class="assets-container">
    <div class="report-date report-item-container" :class="layoutClass">
      <div class="name report-item"></div>
      <div class="report-item report-date-item" v-for="item in reportList" :style="{'color': !!item.validReport && !item.validReport ? 'rgb(255, 73, 73)' : '#000'}" @mouseenter="showDelete = true" @mouseleave="showDelete = false">
        <el-checkbox v-model="item.Checked">{{item.Year}}{{getLabel(item.Type)}}</el-checkbox>
        <i class="el-icon-circle-close delete-icon" title="删除当前报表" v-show="!isOrderEdit && (showDelete && orderStatus < 10) && ($root.rights.includes('company_2_3'))" @click="$emit('on-delete-statement', item)"></i>
      </div>
    </div>
    <vue-scroll :ops="ops" ref="globel-scroll">
      <div>
        <div class="title">
          <i class="header-icon el-icon-star-on"></i>主要财务数据变化率
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">营业收入变化率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatiosOfChange.OperationRevenue"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('OperationRevenue', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">净利润变化率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatiosOfChange.NetProfit"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('NetProfit', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">资产总计变化率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatiosOfChange.TotalAssets"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('TotalAssets', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">负债合计变化率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatiosOfChange.TotalLiabilities"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('TotalLiabilities', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">股东权益合计变化率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatiosOfChange.TotalOwnersEquity"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('TotalOwnersEquity', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">流动资产合计变化率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatiosOfChange.TotalCurrentAssets"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('TotalCurrentAssets', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">流动负债合计变化率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatiosOfChange.TotalCurrentLiability"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('TotalCurrentLiability', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">营运资本变化率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatiosOfChange.WorkingCapital"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('WorkingCapital', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">固定资产变化率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatiosOfChange.FixedAssets"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('FixedAssets', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
      </div>
      <div style="height: 100px;"></div>
    </vue-scroll>
  </div>
</template>

<script>
import mixin from "$mixin/mixin.js";
export default {
  mixins: [mixin],
  props: {
    reportList: {
      type: Array,
      default() {
        return [];
      }
    },
    orderStatus: {
      type: Number,
      default() {
        return 2
      }
    },
    isOrderEdit: {
      type: Boolean,
      default() {
        return 2
      }
    },
  },
  data() {
    return {
      num: 0,
      show: true,
      isDirty: false,
      showDelete: false,
    };
  },
  methods: {
    onInputFucus(evt) {
      $(evt.target).parents(".report-item-container").addClass("assets-container-focus");
    },
    onInputBlur(evt) {
      $(evt.target).parents(".report-item-container").removeClass("assets-container-focus");
    },
    onValueChanged(prop, val) {
      this.$emit('on-value-changed')
    }
  },
  computed: {
    layoutClass() {
      return `report-item-container${this.reportList.length}`;
    },
  }
};
</script>