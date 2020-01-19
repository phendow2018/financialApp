<template>
  <div class="assets-container">
    <div class="report-date report-item-container" :class="layoutClass">
      <div class="name report-item"></div>
      <div class="report-item report-date-item" v-for="item in reportList" :style="{'color': !!item.validReport && !item.validReport ? 'rgb(255, 73, 73)' : '#000'}">{{item.Year}}{{getLabel(item.Type)}}</div>
    </div>
    <vue-scroll :ops="ops" ref="globel-scroll">
      <el-collapse v-model="activeNames">
        <el-collapse-item title="流动负债" name="2">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>流动负债
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">短期借款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.ShortTermLoan"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付票据：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.NotesPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付账款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.AccountsPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">预收账款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.AdvanceAccountReceivable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付职工薪酬：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.PayrollPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>

          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应交税费：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.TaxesPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付利息：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.InterestPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应付股利：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.DividendsPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他应付款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.OtherPayables"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">一年内到期的非流动性负债：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.NoncurrentLiabilitiesDueWithinOneYear"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他流动负债：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.OtherCurrentLiabilities"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">流动负债合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.TotalCurrentLiabilities"
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
        <el-collapse-item title="非流动负债" name="3">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>非流动负债
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">长期借款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.LongtermLoan"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">长期应付款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.LongtermAccountsPayable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">递延所得税负债：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.DeferredTaxLiability"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他非流动负债：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.OtherNoncurrentLiabilities"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">非流动负债合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.TotalNoncurrentLiabilities"
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
            <div class="report-item-name report-item">负债合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.LargeNumber.TotalLiabilities"
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
        <el-collapse-item title="股东权益（所有者权益）合计" name="4">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>股东权益（所有者权益）合计
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">股本（实收资本）：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.Equity"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">资本公积：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.CapitalSurplus"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">盈余公积：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.SurplusReserves"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">专项储备：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.SpecialReserve"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">未分配利润：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.UndistributedProfit"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">少数股东权益：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Balance.MinorityInterest"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">股东权益（所有者权益）合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.LargeNumber.TotalEquity"
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
            <div class="report-item-name report-item">负债及股东权益合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.LargeNumber.TotalLiabilitiesAndShareholdersEquity"
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
      activeNames: ["1", "2", "3", "4"],
      num: 0,
      show: true
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
    }
  },
  computed: {
    layoutClass() {
      return `report-item-container${this.reportList.length}`;
    }
  }
};
</script>