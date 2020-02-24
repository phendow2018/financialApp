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
        <div class="title-name">
          <div class="title">
            <i class="header-icon el-icon-star-on"></i>大数
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">资产总额：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.TotalAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @change="onValueChanged($event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">负债合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.TotalLiabilities"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @change="onValueChanged($event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">股东权益合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.TotalEquity"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @change="onValueChanged($event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">负债及股东权益合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.TotalLiabilitiesOwnersEquity"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @change="onValueChanged($event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">营业收入：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.OperationRevenue"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @change="onValueChanged($event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">利润总额：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.TotalProfit"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @change="onValueChanged($event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">所得税：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.IncomeTaxExpense"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @change="onValueChanged($event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">净利润：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.NetProfit"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @change="onValueChanged($event)"
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
      showDelete: false,
    };
  },
  methods: {
    onInputFucus(evt) {
      $(evt.target)
        .parents(".report-item-container")
        .addClass("assets-container-focus");
    },
    onInputBlur(evt) {
      $(evt.target)
        .parents(".report-item-container")
        .removeClass("assets-container-focus");
    },
    onValueChanged(value) {
      this.$emit('on-value-changed')
    }
  },
  computed: {
    layoutClass() {
      return `report-item-container${this.reportList.length}`;
    }
  }
};
</script>