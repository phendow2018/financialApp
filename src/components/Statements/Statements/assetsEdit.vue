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
                @focus="onInputFucus" @change="onValueChanged('MonetaryResources', $event)"
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
                @focus="onInputFucus" @change="onValueChanged('MonetaryResources', $event)"
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
                @focus="onInputFucus" @change="onValueChanged('MonetaryResources', $event)"
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
            <div class="report-item" v-for="(item, index) in reportList" :key="index">
              <el-input-number
                v-model="item.Statement.Asset.MonetaryResources"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('MonetaryResources', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">短期投资：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.ShortTermInvestments"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ShortTermInvestments', $event)"
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
                @focus="onInputFucus" @change="onValueChanged('NotesReceivable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应收账款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.AccountReceivable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('AccountReceivable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">预付账款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.PrePayment"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('PrePayment', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应收股利：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.DividendsReceivable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('DividendsReceivable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">应收利息：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.InterestReceivable"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('InterestReceivable', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他应收款：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.ReceivableOther"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ReceivableOther', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">存货：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.Inventory"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('Inventory', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其中：原材料：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.RawMaterial"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('RawMaterial', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">在产品：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.GoodsInProcess"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('GoodsInProcess', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">库存商品：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.MerchandiseInventory"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('MerchandiseInventory', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">周转材料：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.RevolvingMaterials"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('RevolvingMaterials', $event)"
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
                @focus="onInputFucus" @change="onValueChanged('OtherCurrentAssets', $event)"
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
              <div class="suggestion-label">{{item.Statement.Asset.TotalCurrentAssetsSuggest}}</div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="非流动资产" name="3">
          <template slot="title">
            <i class="header-icon el-icon-star-on"></i>非流动资产
          </template>
          
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">长期债券投资：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.LongTermBondInvestment"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('LongTermBondInvestment', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">长期股权投资：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.LongTermEquityInvestment"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('LongTermEquityInvestment', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">固定资产原价：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.FixedAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('FixedAssets', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">减：累计折旧：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.AccumulatedDepreciation"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('AccumulatedDepreciation', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">固定资产账面价值：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.NetValueOfFixedAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('NetValueOfFixedAssets', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">在建工程：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.ConstructionInProcess"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('ConstructionInProcess', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">工程物资：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.EngineeringMaterial"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('EngineeringMaterial', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">固定资产清理：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.DisposalOfFixedAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('DisposalOfFixedAssets', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">生产性生物资产：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.CapitalizedBiologicalAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('CapitalizedBiologicalAssets', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">油气资产：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.OilAndGasAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('OilAndGasAssets', $event)"
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
                @focus="onInputFucus" @change="onValueChanged('IntangibleAssets', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">开发支出：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.DevelopmentExpenditure"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('DevelopmentExpenditure', $event)"
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
                @focus="onInputFucus" @change="onValueChanged('Goodwill', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">设备租赁定金：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.EquipmentRentalDeposit"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('EquipmentRentalDeposit', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">长期待摊费用：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.LongTermUnamortizedExpenses"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('LongTermUnamortizedExpenses', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">递延所得税资产：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.DeferredIncomeTaxAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('DeferredIncomeTaxAssets', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">其他非流动资产：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.OtherNonCurrentAssets"
                :precision="2"
                :controls="false"
                @focus="onInputFucus" @change="onValueChanged('OtherNonCurrentAssets', $event)"
                @blur="onInputBlur"
              ></el-input-number>
            </div>
          </div>
          <div class="report-item-container" :class="layoutClass">
            <div class="report-item-name report-item">非流动资产合计：</div>
            <div class="report-item" v-for="item in reportList">
              <el-input-number
                v-model="item.Statement.Asset.TotalNonCurrentAssets"
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
              <div class="suggestion-label">{{item.Statement.Asset.TotalNonCurrentAssetsSuggest}}</div>
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
                v-model="item.Statement.Asset.TotalAssets"
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
              <div class="suggestion-label">{{item.Statement.Asset.TotalAssetsSuggest}}</div>
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
      show: true,
      isDirty: false,
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
    },
    onValueChanged(prop, val) {
      this.isDirty = true
      this.reportList.map(item => {
        let asset = item.Statement.Asset
        if(asset[prop] == undefined || asset[prop] == null) {
          asset[prop] = 0
        }
        
        asset.TotalCurrentAssetsSuggest = (asset.MonetaryResources + asset.ShortTermInvestments + asset.NotesReceivable + asset.AccountReceivable + asset.PrePayment + asset.DividendsReceivable + asset.InterestReceivable + asset.ReceivableOther + asset.Inventory + asset.RawMaterial + asset.GoodsInProcess + asset.MerchandiseInventory + asset.RevolvingMaterials + asset.OtherCurrentAssets).toFixed(2)
        asset.TotalNonCurrentAssetsSuggest = (asset.LongTermBondInvestment + asset.LongTermEquityInvestment + asset.FixedAssets + asset.AccumulatedDepreciation + asset.NetValueOfFixedAssets + asset.ConstructionInProcess + asset.EngineeringMaterial + asset.DisposalOfFixedAssets + asset.CapitalizedBiologicalAssets + asset.OilAndGasAssets + asset.IntangibleAssets + asset.DevelopmentExpenditure + asset.Goodwill  + asset.EquipmentRentalDeposit + asset.LongTermUnamortizedExpenses + asset.DeferredIncomeTaxAssets + asset.OtherNonCurrentAssets + asset.TotalNonCurrentAssets).toFixed(2)
        asset.TotalAssetsSuggest = (parseFloat(asset.TotalCurrentAssetsSuggest) + parseFloat(asset.TotalNonCurrentAssetsSuggest)).toFixed(2)
      })
    }
  },
  computed: {
    layoutClass() {
      return `report-item-container${this.reportList.length}`;
    },
  }
};
</script>