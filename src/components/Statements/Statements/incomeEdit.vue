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
            <i class="header-icon el-icon-star-on"></i>营业总收入
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">营业收入：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.OperationRevenue"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('OperationRevenue', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">主营业务收入：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.MainBusinessIncome"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('MainBusinessIncome', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
        </div>
        <div class="title-name">
          <div class="title">
            <i class="header-icon el-icon-star-on"></i>营业总成本
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">减：营业成本：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.OperatingCosts"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('OperatingCosts', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">营业税金及附加：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.BusinessTariffAndAnnex"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('BusinessTariffAndAnnex', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其中：消费税：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.ConsumptionTax"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ConsumptionTax', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">营业税：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.BusinessTax"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('BusinessTax', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">城市维护建设税：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.UrbanMaintenanceAndConstructionTax"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('UrbanMaintenanceAndConstructionTax', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">资源税：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.ResourcesTax"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ResourcesTax', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">土地增值税：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.LandValueIncrementTax"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('LandValueIncrementTax', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item report-small-item">城镇土地使用税、房产税、车船税、印花税：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.LandUse_House_VehVesl_StmpTax"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('LandUse_House_VehVesl_StmpTax', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item report-small-item">教育费附加、矿产资源补偿费、排污费：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.EduSurtax_MineralRsrcCompFees_SwgChrg"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('EduSurtax_MineralRsrcCompFees_SwgChrg', $event)"
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
                @focus="onInputFucus" @change="onValueChanged('OperatingMargin', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container report-item-container-suggestion" :class="layoutClass">
            <div class="report-item-name report-item">系统建议值：</div>
            <div class="report-item" v-for="item in reportList">
              <div class="suggestion-label">{{item.Statement.Income.OperatingMarginSuggest}}</div>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">减：销售费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.SellingExpenses"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('SellingExpenses', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其中：商品维修费：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.CostOfGoodsMaintenance"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('CostOfGoodsMaintenance', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">广告费和业务宣传费：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.AdRate_BusinessPropagandizeFee"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('AdRate_BusinessPropagandizeFee', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">管理费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.AdministrationExpenseCost"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('AdministrationExpenseCost', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其中：开办费：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.OrganizationCosts"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('OrganizationCosts', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">业务招待费：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.BusinessEntertainment"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('BusinessEntertainment', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">研究费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.ResearchExpenditure"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ResearchExpenditure', $event)"
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
                @focus="onInputFucus" @change="onValueChanged('FinancialCost', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其中：利息费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.InterestCost"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('InterestCost', $event)"
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
                @focus="onInputFucus" @change="onValueChanged('AssetsImpairmentLoss', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">勘探费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.ExplorationExpenditure"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ExplorationExpenditure', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.OtherExpenses"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('OtherExpenses', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">加：投资收益：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.IncomeFromInvestment"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('IncomeFromInvestment', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">公允价值变动净收益：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.NetIncomeFromChangesInFairValue"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('NetIncomeFromChangesInFairValue', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">汇兑收益：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.ExchangeEarning"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ExchangeEarning', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
        </div>
        <div class="title-name">
          <div class="title">
            <i class="header-icon el-icon-star-on"></i>营业利润
          </div>
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
              <div class="suggestion-label">{{item.Statement.Income.OperatingProfitSuggest}}</div>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">加：营业外收入：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.NonOperatingIncome"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('NonOperatingIncome', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其中：政府补助：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.PublicSubsidy"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('PublicSubsidy', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">减：营业外支出：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.NonBusinessExpenditure"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('NonBusinessExpenditure', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其中：坏账损失：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.LossOnBadDebts"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('LossOnBadDebts', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他利润：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.OtherProfit"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('OtherProfit', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item" style="font-size: 14px;">无法收回的长期债券投资损失：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.UnrecoverableLossOnLongTermBondInvestment"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('UnrecoverableLossOnLongTermBondInvestment', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item" style="font-size: 14px;">无法收回的长期股权投资损失：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.UnrecoverableLossOnLongTermEquityInvestment"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('UnrecoverableLossOnLongTermEquityInvestment', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item report-small-item">自然灾害等不可抗力因素造成的损失：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.LossByForceMajeureFactors"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('LossByForceMajeureFactors', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">税收滞纳金：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.TaxDelayCharge"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('TaxDelayCharge', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">纳税总额：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.TotalTax"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('TotalTax', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
        </div>
        <div class="title-name">
          <div class="title">
            <i class="header-icon el-icon-star-on"></i>利润总额
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">利润总额：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.TotalProfit"
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
              <div class="suggestion-label">{{item.Statement.Income.TotalProfitSuggest}}</div>
            </div>
          </div>
          
        </div>
        <div class="title-name">
          <div class="title">
            <i class="header-icon el-icon-star-on"></i>净利润
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">减：所得税费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Income.IncomeTaxExpense"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('IncomeTaxExpense', $event)"
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
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container report-item-container-suggestion" :class="layoutClass">
            <div class="report-item-name report-item">系统建议值：</div>
            <div class="report-item" v-for="item in reportList">
              <div class="suggestion-label">{{item.Statement.Income.NetProfitSuggest}}</div>
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
      $(evt.target).parents(".report-item-container").addClass("assets-container-focus")
    },
    onInputBlur(evt) {
      $(evt.target).parents(".report-item-container").removeClass("assets-container-focus")
    },
    onValueChanged(prop, val) {
      this.$emit('on-value-changed')
      this.reportList.map(item => {
        let Income = item.Statement.Income
        
        let OperationRevenue = Income.OperationRevenue == undefined ? 0 : Income.OperationRevenue
        let BusinessTariffAndAnnex = Income.BusinessTariffAndAnnex == undefined ? 0 : Income.BusinessTariffAndAnnex
        let OperatingCosts = Income.OperatingCosts == undefined ? 0 : Income.OperatingCosts
        let EduSurtax_MineralRsrcCompFees_SwgChrg = Income.EduSurtax_MineralRsrcCompFees_SwgChrg == undefined ? 0 : Income.EduSurtax_MineralRsrcCompFees_SwgChrg 

        let curOperatingMarginSuggest = OperationRevenue - BusinessTariffAndAnnex - OperatingCosts - EduSurtax_MineralRsrcCompFees_SwgChrg
        Income.OperatingMarginSuggest = (curOperatingMarginSuggest).toFixed(2)

        let SellingExpenses = Income.SellingExpenses == undefined ? 0 : Income.SellingExpenses
        let AdministrationExpenseCost = Income.AdministrationExpenseCost == undefined ? 0 : Income.AdministrationExpenseCost
        let FinancialCost = Income.FinancialCost == undefined ? 0 : Income.FinancialCost
        let AssetsImpairmentLoss = Income.AssetsImpairmentLoss == undefined ? 0 : Income.AssetsImpairmentLoss
        let ExplorationExpenditure = Income.ExplorationExpenditure == undefined ? 0 : Income.ExplorationExpenditure
        let OtherExpenses = Income.OtherExpenses == undefined ? 0 : Income.OtherExpenses
        let IncomeFromInvestment = Income.IncomeFromInvestment == undefined ? 0 : Income.IncomeFromInvestment
        let NetIncomeFromChangesInFairValue = Income.NetIncomeFromChangesInFairValue == undefined ? 0 : Income.NetIncomeFromChangesInFairValue
        let ExchangeEarning = Income.ExchangeEarning == undefined ? 0 : Income.ExchangeEarning

        let curOperatingProfitSuggest = curOperatingMarginSuggest - SellingExpenses - AdministrationExpenseCost - FinancialCost - AssetsImpairmentLoss 
          - ExplorationExpenditure - OtherExpenses + IncomeFromInvestment + NetIncomeFromChangesInFairValue + ExchangeEarning
        Income.OperatingProfitSuggest = curOperatingProfitSuggest.toFixed(2)

        let NonOperatingIncome = Income.NonOperatingIncome == undefined ? 0 : Income.NonOperatingIncome
        let NonBusinessExpenditure = Income.NonBusinessExpenditure == undefined ? 0 : Income.NonBusinessExpenditure
        let OtherProfit = Income.OtherProfit == undefined ? 0 : Income.OtherProfit
        let UnrecoverableLossOnLongTermBondInvestment = Income.UnrecoverableLossOnLongTermBondInvestment == undefined ? 0 : Income.UnrecoverableLossOnLongTermBondInvestment
        let LossByForceMajeureFactors = Income.LossByForceMajeureFactors == undefined ? 0 : Income.LossByForceMajeureFactors
        let UnrecoverableLossOnLongTermEquityInvestment = Income.UnrecoverableLossOnLongTermEquityInvestment == undefined ? 0 : Income.UnrecoverableLossOnLongTermEquityInvestment
        let TaxDelayCharge = Income.TaxDelayCharge == undefined ? 0 : Income.TaxDelayCharge

        let curTotalProfitSuggest = curOperatingProfitSuggest +  NonOperatingIncome - NonBusinessExpenditure + OtherProfit - UnrecoverableLossOnLongTermBondInvestment 
          - UnrecoverableLossOnLongTermEquityInvestment - LossByForceMajeureFactors - TaxDelayCharge
        Income.TotalProfitSuggest = (curTotalProfitSuggest).toFixed(2)

        let IncomeTaxExpense = Income.IncomeTaxExpense == undefined ? 0 : Income.IncomeTaxExpense
        Income.NetProfitSuggest = (curTotalProfitSuggest - IncomeTaxExpense).toFixed(2)
      }) 
    }
  },
  computed: {
    layoutClass() {
      return `report-item-container${this.reportList.length}`;
    }
  }
};
</script>