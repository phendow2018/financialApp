<template>
  <div class="assets-container">
    <div class="report-date report-item-container" :class="layoutClass">
      <div class="name report-item"></div>
      <div class="report-item report-date-item" v-for="item in reportList" :style="{'color': !!item.validReport && !item.validReport ? 'rgb(255, 73, 73)' : '#000'}">{{item.Year}}{{getLabel(item.Type)}}</div>
    </div>
    <vue-scroll :ops="ops" ref="globel-scroll">
      <el-collapse v-model="activeNames">
        <!-- <el-collapse-item title="基本信息" name="1">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>基本信息
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">财务报表类型：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset."
                :precision="2"
                :controls="false"
                style="color:red;"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">是否显示：</div>
            <div class="report-item" v-for="item in reportList">
              <el-switch v-model="show"></el-switch>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">数据特性：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset."
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">是否审计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset."
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
        </el-collapse-item> -->
        <el-collapse-item title="流动资产" name="2">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>流动资产
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">货币资金：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.MonetaryFund"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应收票据：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.NotesReceivable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应收账款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.AccountsReceivable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">预付账款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.AdvancePayment"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他应收款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.OtherReceivables"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">存货：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.Stock"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他流动资产：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.OtherCurrentAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">流动资产合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.TotalCurrentAssets"
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
        <el-collapse-item title="非流动资产" name="3">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>非流动资产
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">长期股权投资：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.LongtermEquityInvestment"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">长期应收款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.longtermReceivables"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">投资性房地产：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.InvestmentRealEstate"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">固定资产：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.FixedAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">在建工程：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.ConstructionInProgress"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">无形资产：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.IntangibleAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">商誉：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.Goodwill"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">长期待摊费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.LongtermUnamortizedExpenses"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">递延所得税资产：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.DeferredTaxAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他非流动资产：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.OtherNoncurrentAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">非流动资产合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.TotalNoncurrentAssets"
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
        <el-collapse-item title="总额" name="4">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>总额
          </template>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">资产总额：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.LargeNumber.TotalAssets"
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
  created() {},
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