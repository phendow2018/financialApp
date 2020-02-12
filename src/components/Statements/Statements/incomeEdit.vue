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
        </el-collapse-item>
        <el-collapse-item title="营业总成本" name="2">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>营业总成本
          </template>
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
        </el-collapse-item>
        <el-collapse-item title="利润总额" name="4">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>利润总额
          </template>
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
          
        </el-collapse-item>
        <el-collapse-item title="净利润" name="5">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>净利润
          </template>
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
    onValueChanged(prop, val) {
      this.isDirty = true
      this.reportList.map(item => {
        let Income = item.Statement.Income
        if(Income[prop] == undefined || Income[prop] == null) {
          Income[prop] = 0
        }
        Income.OperatingMarginSuggest = (Income.OperationRevenue + Income.MainBusinessIncome + Income.OperatingCosts + Income.BusinessTariffAndAnnex + Income.BusinessTax + Income.UrbanMaintenanceAndConstructionTax + Income.ResourcesTax + Income.LandValueIncrementTax + Income.LandUse_House_VehVesl_StmpTax + Income.EduSurtax_MineralRsrcCompFees_SwgChrg).toFixed(2)
        Income.OperatingProfitSuggest = (Income.SellingExpenses + Income.AdRate_BusinessPropagandizeFee + Income.AdministrationExpenseCost + Income.BusinessEntertainment + Income.ResearchExpenditure + Income.FinancialCost + Income.AssetsImpairmentLoss + Income.ExplorationExpenditure + Income.OtherExpenses + Income.IncomeFromInvestment + Income.NetIncomeFromChangesInFairValue + Income.ExchangeEarning).toFixed(2)
        Income.TotalProfitSuggest = (Income.NonOperatingIncome - Income.NonBusinessExpenditure + Income.OtherProfit + Income.UnrecoverableLossOnLongTermBondInvestment + Income.UnrecoverableLossOnLongTermEquityInvestment + Income. LossByForceMajeureFactors + Income.TaxDelayCharge + Income.TotalTax).toFixed(2)
        
        Income.NetProfitSuggest = (parseFloat(Income.TotalProfitSuggest) - Income.IncomeTaxExpense).toFixed(2)
        
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