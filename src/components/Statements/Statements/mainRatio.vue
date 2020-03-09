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
          <i class="header-icon el-icon-star-on"></i>主要财务数据比率
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">净资产收益率(%)：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.ReturnOnEquity"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('ReturnOnEquity', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">资产回报率(%)：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.ReturnOnAssets"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('ReturnOnAssets', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">毛利率(%)：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.GrossProfitRate"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('GrossProfitRate', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">净利润率(%)：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.NetSalesRate"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('NetSalesRate', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">总资产周转次数：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.TotalAssetsTurnover"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('TotalAssetsTurnover', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">流动资产周转次数：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.CurrentAssetsTurnover"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('CurrentAssetsTurnover', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">应收账款周转天数：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.AccountsReceivableTurnover"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('AccountsReceivableTurnover', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">资产负债率(%)：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.AssetLiabilityRatio"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('AssetLiabilityRatio', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">流动比率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.CurrentRatio"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('CurrentRatio', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">速动比率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.QuickRatio"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('QuickRatio', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">营业收入增长率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.RevenueGrowthRate"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('RevenueGrowthRate', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">毛利增长率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.GrossProfitGrowthRate"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('GrossProfitGrowthRate', $event)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">总资产增长率：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index">
            <el-input-number
              v-model="item.Statement.FinancialRatio.GrowthRateOfTotalAssets"
              :precision="2"
              :controls="false"
              @focus="onInputFucus" @change="onValueChanged('GrowthRateOfTotalAssets', $event)"
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