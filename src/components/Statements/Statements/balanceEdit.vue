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
            <i class="header-icon el-icon-star-on"></i>流动负债
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">短期借款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.ShortTermBorrowing"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ShortTermBorrowing', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付票据：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.NotesPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('NotesPayable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付账款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.AccountsPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('AccountsPayable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">预收账款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.UnearnedRevenue"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('UnearnedRevenue', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付职工薪酬：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.EmployeePayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('EmployeePayable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>

          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应交税费：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.TaxPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('TaxPayable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付利息：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.AccrualInterestPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('AccrualInterestPayable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付利润：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.ProfitPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ProfitPayable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他应付款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.OtherPayables"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('OtherPayables', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他流动负债：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.OtherCurrentLiability"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('OtherCurrentLiability', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">流动负债合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.TotalCurrentLiability"
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
              <div class="suggestion-label">{{item.Statement.Liability.TotalCurrentLiabilitySuggest}}</div>
            </div>
          </div>
        </div>
        <div class="title-name">
          <div class="title">
            <i class="header-icon el-icon-star-on"></i>非流动负债
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">长期借款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.LongTermLoan"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('LongTermLoan', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付债券：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.BondsPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('BondsPayable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">长期应付款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.LongTermPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('LongTermPayable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">专项应付款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.AccountPayableSpecialFunds"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('AccountPayableSpecialFunds', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付融资租赁款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.FinanceLeasePayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('FinanceLeasePayable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">大修理准备：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.MajorRepairPreparation"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('MajorRepairPreparation', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">预计负债：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.AnticipationLiabilities"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('AnticipationLiabilities', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">一年以上应付职工薪酬：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.EmployeePayableMoreThanOneYear"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('EmployeePayableMoreThanOneYear', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">递延所得税负债：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.DeferredIncomeTaxLiabilities"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('DeferredIncomeTaxLiabilities', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">递延收益：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.DeferredIncome"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('DeferredIncome', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他非流动负债：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.OtherNonCurrentLiability"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('OtherNonCurrentLiability', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">非流动负债合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.TotalNonCurrentLiability"
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
              <div class="suggestion-label">{{item.Statement.Liability.TotalNonCurrentLiabilitySuggest}}</div>
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
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container report-item-container-suggestion" :class="layoutClass">
            <div class="report-item-name report-item">系统建议值：</div>
            <div class="report-item" v-for="item in reportList">
              <div class="suggestion-label">{{item.Statement.Liability.TotalLiabilitiesSuggest}}</div>
            </div>
          </div>
        </div>
        <div class="title-name">
          <div class="title">
            <i class="header-icon el-icon-star-on"></i>股东权益（所有者权益）合计
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">实收资本（或股本）：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.PaidInCapital"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('PaidInCapital', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">资本公积：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.CapitalReserve"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('CapitalReserve', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">盈余公积：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.EarnedSurplus"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('EarnedSurplus', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">一般风险准备：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.GeneralRiskPreparation"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('GeneralRiskPreparation', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">专项储备：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.ReasonableReserve"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ReasonableReserve', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">未分配利润：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.UndistributedProfit"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('UndistributedProfit', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">外币报表折算差额：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.TranslationReserve"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('TranslationReserve', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">少数股东权益：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.MinorityEquity"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('MinorityEquity', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item report-small-item">所有者权益（或股东权益）合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.TotalEquity"
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
              <div class="suggestion-label">{{item.Statement.Liability.TotalEquitySuggest}}</div>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item report-small-item">负债和所有者权益（或股东权益）总计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Liability.TotalLiabilitiesOwnersEquity"
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
              <div class="suggestion-label">{{item.Statement.Liability.TotalLiabilitiesOwnersEquitySuggest}}</div>
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
  created() {
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
      this.$emit('on-value-changed')
      this.reportList.map(item => {
        let Liability = item.Statement.Liability

        let ShortTermBorrowing = Liability.ShortTermBorrowing == undefined ? 0 : Liability.ShortTermBorrowing
        let NotesPayable = Liability.NotesPayable == undefined ? 0 : Liability.NotesPayable
        let AccountsPayable = Liability.AccountsPayable == undefined ? 0 : Liability.AccountsPayable
        let UnearnedRevenue = Liability.UnearnedRevenue == undefined ? 0 : Liability.UnearnedRevenue
        let EmployeePayable = Liability.EmployeePayable == undefined ? 0 : Liability.EmployeePayable
        let TaxPayable = Liability.TaxPayable == undefined ? 0 : Liability.TaxPayable
        let AccrualInterestPayable = Liability.AccrualInterestPayable == undefined ? 0 : Liability.AccrualInterestPayable
        let ProfitPayable = Liability.ProfitPayable == undefined ? 0 : Liability.ProfitPayable
        let OtherPayables = Liability.OtherPayables == undefined ? 0 : Liability.OtherPayables
        let OtherCurrentLiability = Liability.OtherCurrentLiability == undefined ? 0 : Liability.OtherCurrentLiability

        let curTotalCurrentLiabilitySuggest = ShortTermBorrowing + NotesPayable + AccountsPayable + UnearnedRevenue + EmployeePayable + TaxPayable 
          + AccrualInterestPayable + ProfitPayable + OtherPayables + OtherCurrentLiability

        Liability.TotalCurrentLiabilitySuggest = curTotalCurrentLiabilitySuggest.toFixed(2)

        let LongTermLoan = Liability.LongTermLoan == undefined ? 0 : Liability.LongTermLoan
        let BondsPayable = Liability.BondsPayable == undefined ? 0 : Liability.BondsPayable
        let LongTermPayable = Liability.LongTermPayable == undefined ? 0 : Liability.LongTermPayable
        let AccountPayableSpecialFunds = Liability.AccountPayableSpecialFunds == undefined ? 0 : Liability.AccountPayableSpecialFunds
        let FinanceLeasePayable = Liability.FinanceLeasePayable == undefined ? 0 : Liability.FinanceLeasePayable
        let MajorRepairPreparation = Liability.MajorRepairPreparation == undefined ? 0 : Liability.MajorRepairPreparation
        let AnticipationLiabilities = Liability.AnticipationLiabilities == undefined ? 0 : Liability.AnticipationLiabilities
        let EmployeePayableMoreThanOneYear = Liability.EmployeePayableMoreThanOneYear == undefined ? 0 : Liability.EmployeePayableMoreThanOneYear
        let DeferredIncomeTaxLiabilities = Liability.DeferredIncomeTaxLiabilities == undefined ? 0 : Liability.DeferredIncomeTaxLiabilities
        let DeferredIncome = Liability.DeferredIncome == undefined ? 0 : Liability.DeferredIncome
        let OtherNonCurrentLiability = Liability.OtherNonCurrentLiability == undefined ? 0 : Liability.OtherNonCurrentLiability

        let curTotalNonCurrentLiabilitySuggest = LongTermLoan + BondsPayable + LongTermPayable + AccountPayableSpecialFunds + FinanceLeasePayable 
          + MajorRepairPreparation + AnticipationLiabilities + EmployeePayableMoreThanOneYear + DeferredIncomeTaxLiabilities + DeferredIncome + OtherNonCurrentLiability
        Liability.TotalNonCurrentLiabilitySuggest = curTotalNonCurrentLiabilitySuggest.toFixed(2)

        Liability.TotalLiabilitiesSuggest = (curTotalCurrentLiabilitySuggest + curTotalNonCurrentLiabilitySuggest).toFixed(2)

        let PaidInCapital = Liability.PaidInCapital == undefined ? 0 : Liability.PaidInCapital
        let CapitalReserve = Liability.CapitalReserve == undefined ? 0 : Liability.CapitalReserve
        let EarnedSurplus = Liability.EarnedSurplus == undefined ? 0 : Liability.EarnedSurplus
        let GeneralRiskPreparation = Liability.GeneralRiskPreparation == undefined ? 0 : Liability.GeneralRiskPreparation
        let ReasonableReserve = Liability.ReasonableReserve == undefined ? 0 : Liability.ReasonableReserve
        let UndistributedProfit = Liability.UndistributedProfit == undefined ? 0 : Liability.UndistributedProfit
        let TranslationReserve = Liability.TranslationReserve == undefined ? 0 : Liability.TranslationReserve
        let MinorityEquity = Liability.MinorityEquity == undefined ? 0 : Liability.MinorityEquity
        
        let curTotalEquitySuggest = PaidInCapital + CapitalReserve + EarnedSurplus + GeneralRiskPreparation + ReasonableReserve + UndistributedProfit 
          + TranslationReserve + MinorityEquity
        Liability.TotalEquitySuggest = curTotalEquitySuggest.toFixed(2)


        Liability.TotalLiabilitiesOwnersEquitySuggest = (curTotalCurrentLiabilitySuggest + curTotalNonCurrentLiabilitySuggest + curTotalEquitySuggest).toFixed(2)
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