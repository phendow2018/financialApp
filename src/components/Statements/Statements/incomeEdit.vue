<template>
  <div class="assets-container">
    <div class="report-date report-item-container" :class="layoutClass">
      <div class="name report-item"></div>
      <div class="report-item report-date-item" v-for="item in reportList" :style="{'color': !!item.validReport && !item.validReport ? 'rgb(255, 73, 73)' : '#000'}">{{item.Year}}{{getLabel(item.Type)}}</div>
    </div>
    <vue-scroll :ops="ops" ref="globel-scroll">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="营业总收入" name="1">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>营业总收入
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">营业收入：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.LargeNumber.BusinessIncome"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="营业总成本" name="2">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>营业总成本
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">减：营业成本：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.LessOperatingCost"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">营业税金及附加：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.BusinessTaxAndSurcharges"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">营业毛利：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.OperatingMargin"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container report-item-container-suggestion" :class="layoutClass">
            <div class="report-item-name report-item">系统建议值：</div>
            <div class="report-item" v-for="item in reportList">
              <div class="suggestion-label">0.00</div>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">减：销售费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.SalesExpenses"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">管理费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.ManagementCost"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">财务费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.FinancialCost"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">资产减值损失：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.AssetsImpairmentLoss"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">加：投资收益：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.PlusInvestmentIncome"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="营业利润" name="3">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>营业利润
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">营业利润：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.OperatingProfit"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container report-item-container-suggestion" :class="layoutClass">
            <div class="report-item-name report-item">系统建议值：</div>
            <div class="report-item" v-for="item in reportList">
              <div class="suggestion-label">0.00</div>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">加：营业外收入：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.PlusNonoperatingIncome"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">减：营业外支出：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.LessNonoperatingExpenses"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="利润总额" name="4">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>利润总额
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">利润总额：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.LargeNumber.TotalProfit"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container report-item-container-suggestion" :class="layoutClass">
            <div class="report-item-name report-item">系统建议值：</div>
            <div class="report-item" v-for="item in reportList">
              <div class="suggestion-label">0.00</div>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">减：所得税：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.LargeNumber.LessIncomeTax"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="净利润" name="5">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>净利润
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">净利润：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.LargeNumber.NetProfit"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container report-item-container-suggestion" :class="layoutClass">
            <div class="report-item-name report-item">系统建议值：</div>
            <div class="report-item" v-for="item in reportList">
              <div class="suggestion-label">0.00</div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
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
    }
  },
  data() {
    return {
      activeNames: ["1", "2", "3", "4", "5"],
      num: 0,
      show: true
    };
  },
  created() {
    console.log(this);
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
    }
  },
  computed: {
    layoutClass() {
      return `report-item-container${this.reportList.length}`;
    }
  }
};
</script>