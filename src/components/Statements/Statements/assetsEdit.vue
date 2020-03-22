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
          <i class="header-icon el-icon-star-on"></i>基本信息
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">报告种类：</div>
          <div class="report-item" v-for="(item, index) in reportList" :key="index" style="padding: 0 10px;">
            <el-select v-model="item.ReportType">
              <el-option :key="1" label="个别报表" :value="1"></el-option>
              <el-option :key="2" label="合并报表" :value="2"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div>
        <div class="title">
          <i class="header-icon el-icon-star-on"></i>流动资产
        </div>
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
      </div>
      <div>
        <div class="title">
          <i class="header-icon el-icon-star-on"></i>非流动资产
        </div>
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
      </div>
      <div>
        <div class="title">
          <i class="header-icon el-icon-star-on"></i>总额
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item">资产总额：</div>
          <div class="report-item" v-for="(item, index) in reportList">
            <el-input-number
              v-model="item.Statement.Asset.TotalAssets"
              :precision="2"
              :controls="false"
              @focus="onInputFucus"
              @change="onValueChanged('TotalAssets', $event, index)"
              @blur="onInputBlur"
            ></el-input-number>
          </div>
        </div>
        <div class="report-item-container" :class="layoutClass">
          <div class="report-item-name report-item"></div>
          <div class="report-item" v-for="item in reportList">
            <span>{{item.Statement.isEqual ? '' : '资产与权益不一致'}}</span>
          </div>
        </div>
        <div class="report-item-container report-item-container-suggestion" :class="layoutClass">
          <div class="report-item-name report-item">系统建议值：</div>
          <div class="report-item" v-for="item in reportList">
            <div class="suggestion-label">{{item.Statement.Asset.TotalAssetsSuggest}}</div>
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
    onValueChanged(prop, val, index) {
      this.$emit('on-value-changed', index)
      this.reportList.map(item => {
        let asset = item.Statement.Asset
        
        let MonetaryResources = asset.MonetaryResources == undefined ? 0 : asset.MonetaryResources
        let ShortTermInvestments = asset.ShortTermInvestments == undefined ? 0 : asset.ShortTermInvestments
        let NotesReceivable = asset.NotesReceivable == undefined ? 0 : asset.NotesReceivable
        let AccountReceivable = asset.AccountReceivable == undefined ? 0 : asset.AccountReceivable
        let PrePayment = asset.PrePayment == undefined ? 0 : asset.PrePayment
        let DividendsReceivable = asset.DividendsReceivable == undefined ? 0 : asset.DividendsReceivable
        let InterestReceivable = asset.InterestReceivable == undefined ? 0 : asset.InterestReceivable
        let ReceivableOther = asset.ReceivableOther == undefined ? 0 : asset.ReceivableOther
        let Inventory = asset.Inventory == undefined ? 0 : asset.Inventory
        let GoodsInProcess = asset.GoodsInProcess == undefined ? 0 : asset.GoodsInProcess
        let MerchandiseInventory = asset.MerchandiseInventory == undefined ? 0 : asset.MerchandiseInventory
        let RevolvingMaterials = asset.RevolvingMaterials == undefined ? 0 : asset.RevolvingMaterials
        let OtherCurrentAssets = asset.OtherCurrentAssets == undefined ? 0 : asset.OtherCurrentAssets
        
        let curTotalCurrentAssetsSuggest = MonetaryResources + ShortTermInvestments + NotesReceivable + AccountReceivable + PrePayment + DividendsReceivable 
          + InterestReceivable + ReceivableOther + Inventory + GoodsInProcess + MerchandiseInventory + RevolvingMaterials + OtherCurrentAssets

        asset.TotalCurrentAssetsSuggest = curTotalCurrentAssetsSuggest.toFixed(2)

        let LongTermBondInvestment = asset.LongTermBondInvestment == undefined ? 0 : asset.LongTermBondInvestment
        let LongTermEquityInvestment = asset.LongTermEquityInvestment == undefined ? 0 : asset.LongTermEquityInvestment
        let NetValueOfFixedAssets = asset.NetValueOfFixedAssets == undefined ? 0 : asset.NetValueOfFixedAssets
        let ConstructionInProcess = asset.ConstructionInProcess == undefined ? 0 : asset.ConstructionInProcess
        let EngineeringMaterial = asset.EngineeringMaterial == undefined ? 0 : asset.EngineeringMaterial
        let DisposalOfFixedAssets = asset.DisposalOfFixedAssets == undefined ? 0 : asset.DisposalOfFixedAssets
        let CapitalizedBiologicalAssets = asset.CapitalizedBiologicalAssets == undefined ? 0 : asset.CapitalizedBiologicalAssets
        let OilAndGasAssets = asset.OilAndGasAssets == undefined ? 0 : asset.OilAndGasAssets
        let IntangibleAssets = asset.IntangibleAssets == undefined ? 0 : asset.IntangibleAssets
        let DevelopmentExpenditure = asset.DevelopmentExpenditure == undefined ? 0 : asset.DevelopmentExpenditure
        let Goodwill = asset.Goodwill == undefined ? 0 : asset.Goodwill
        let EquipmentRentalDeposit = asset.EquipmentRentalDeposit == undefined ? 0 : asset.EquipmentRentalDeposit
        let LongTermUnamortizedExpenses = asset.LongTermUnamortizedExpenses == undefined ? 0 : asset.LongTermUnamortizedExpenses
        let DeferredIncomeTaxAssets = asset.DeferredIncomeTaxAssets == undefined ? 0 : asset.DeferredIncomeTaxAssets
        let OtherNonCurrentAssets = asset.OtherNonCurrentAssets == undefined ? 0 : asset.OtherNonCurrentAssets

        let curTotalNonCurrentAssetsSuggest = LongTermBondInvestment + LongTermEquityInvestment + NetValueOfFixedAssets + ConstructionInProcess + EngineeringMaterial 
          + DisposalOfFixedAssets + CapitalizedBiologicalAssets + OilAndGasAssets + IntangibleAssets + DevelopmentExpenditure + Goodwill  
          + EquipmentRentalDeposit + LongTermUnamortizedExpenses + DeferredIncomeTaxAssets + OtherNonCurrentAssets

        asset.TotalNonCurrentAssetsSuggest = curTotalNonCurrentAssetsSuggest.toFixed(2)

        asset.TotalAssetsSuggest = (curTotalCurrentAssetsSuggest + curTotalNonCurrentAssetsSuggest).toFixed(2)
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