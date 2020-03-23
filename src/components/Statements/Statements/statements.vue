<template>
  <div class="big-container" v-loading="isLoading">
    <aom-header :parentTitle="reportType =='company' ? '企业' : '订单'" mainTitle="财务信息" @aom-go-back="backPath"></aom-header>
    <div :class="[preCls + '-tabs']">
      <div class="main-header" :style="orderStatus">
        <div class="company-header" v-if="reportType == 'company'">
          <div class="name header-item">
            <span class="name-label">公司名称：</span>
            <span class="name-value" :title="companyData.Name">{{companyData.Name}}</span>
          </div>
          <div class="companyid header-item">
            <span class="name-label">统一社会信用代码：</span>
            <span class="name-value">{{companyData.CompanyNumber}}</span>
          </div>
          <div></div>
          <div class="name header-item">
            <span class="name-label">最后修改人：</span>
            <span class="name-value" :title="companyData.LastModifyUser">{{companyData.LastModifyUser}}</span>
          </div>
          <div class="companyid header-item">
            <span class="name-label">最后修改时间：</span>
            <span class="name-value">{{companyData.LastModifyTime}}</span>
          </div>
          <div style="text-align: right;"><el-button @click="onDisplay" type="default">预览</el-button></div>
        </div>
        <div class="order-header" v-if="reportType != 'company'">
          <div class="order header-item">
            <span class="name-label">订单编号：</span>
            <span class="name-value">{{orderData.OrderNumber}}</span>
          </div>
          <div class="name header-item">
            <span class="name-label">下单时间：</span>
            <span class="name-value">{{orderData.CreateTime}}</span>
            <span class="name-label" v-show="orderData.LastModifyTime != null"> | {{getTimeLabel(orderData.Status)}}：</span>
            <span class="name-value" v-show="orderData.LastModifyTime != null">{{orderData.LastModifyTime}}</span>
          </div>
          <div style="text-align:right;color:#aaa;">
            <a @click="onReturn" v-show="(orderData.Status == 10 || orderData.Status == -1) && $root.rights.includes('order_2_6')" class="small-btn">撤销</a>
            <a @click="onCancel" v-show="(!(orderData.Status == 20 || orderData.Status == -1)) && $root.rights.includes('order_2_5')" class="small-btn">取消订单</a>
          </div>
          <div class="name header-item">
            <span class="name-label">企业名称：</span>
            <span class="name-value" :title="orderData.CompanyName">{{orderData.CompanyName}}</span>
          </div>
          <div class="companyid header-item">
            <span class="name-label">统一社会信用代码：</span>
            <span class="name-value">{{orderData.CompanyNumber}}</span>
          </div>
          <div> </div>
          <div class="report-list header-item">
            <span class="name-label">订单报表：</span>
            <span class="name-value">{{getReportStr()}}</span>
          </div>
          <div class="report-list header-item">
            <span class="name-label">{{orderData.Status == 0 ? '' : '制单人：'}}</span>
            <span class="name-value">{{orderData.Status == 0 ? '' : orderData.Editor + '&nbsp;&nbsp;'}}</span>
            <span class="name-label" v-html="getLastModifyLabel()"></span>
            <span class="name-value">{{getLastModifyUser()}}</span>
          </div>
          <div v-show="reportType == 'order' && isCompanyValid">
            <el-button @click="onDisplay" type="default">预览</el-button>
            <el-button @click="onSubmit" type="primary" :disabled="(orderData.Status != 5) " v-if="$root.rights.includes('order_2_3')">提交</el-button>
            <el-button @click="onSend" type="success" :disabled="(!(orderData.Status == 10 || orderData.Status == 20))" v-if="$root.rights.includes('order_2_4')">发送</el-button>
          </div>
        </div>
      </div>
      <div class="main-content" v-if="isCompanyValid && initShow">
        <div class="opertion-buttons">
          <el-button @click="onAdd" :disabled="(orderData.Status == 20 || orderData.Status == 10  || orderData.Status == -1)" v-if="(reportType == 'order' && $root.rights.includes('order_2_1')) || (reportType == 'company' && $root.rights.includes('company_2_1'))">添加</el-button>
          <el-button @click="onSave" :disabled="(orderData.Status == 20 || orderData.Status == 10  || orderData.Status == -1)" v-if="(reportType == 'order' && $root.rights.includes('order_2_2')) || (reportType == 'company' && $root.rights.includes('company_2_2'))">保存</el-button>
        </div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="大数" name="summary" v-if="reportProp != 2">
            <summary-edit :reportList="reportList" @on-value-changed="onValueChanged" @on-delete-statement="onDeleteStatement" :orderStatus="orderData.Status" :isOrderEdit="reportType == 'order'"></summary-edit>
          </el-tab-pane>
          <el-tab-pane label="资产" name="assets" v-if="reportProp == 2">
            <assets-edit :reportList="reportList" @on-value-changed="onValueChanged" @on-delete-statement="onDeleteStatement" :orderStatus="orderData.Status" :isOrderEdit="reportType == 'order'"></assets-edit>
          </el-tab-pane>
          <el-tab-pane label="负债" name="balance" v-if="reportProp == 2">
            <balance-edit :reportList="reportList" @on-value-changed="onValueChanged" @on-delete-statement="onDeleteStatement" :orderStatus="orderData.Status" :isOrderEdit="reportType == 'order'"></balance-edit>
          </el-tab-pane>
          <el-tab-pane label="损益" name="income" v-if="reportProp == 2">
            <income-edit :reportList="reportList" @on-value-changed="onValueChanged" @on-delete-statement="onDeleteStatement" :orderStatus="orderData.Status" :isOrderEdit="reportType == 'order'"></income-edit>
          </el-tab-pane>
          <el-tab-pane label="变化率" name="rate">
            <change-rate :reportList="reportList" @on-value-changed="onValueChanged" @on-delete-statement="onDeleteStatement" :orderStatus="orderData.Status" :isOrderEdit="reportType == 'order'"></change-rate>
          </el-tab-pane>
          <el-tab-pane label="比率" name="ratio">
            <main-ratio :reportList="reportList" @on-value-changed="onValueChanged" @on-delete-statement="onDeleteStatement" :orderStatus="orderData.Status" :isOrderEdit="reportType == 'order'"></main-ratio>
          </el-tab-pane>
          <el-tab-pane label="说明" style="margin-top: 20px;">
            <el-input type="textarea" :rows="20" placeholder="请输入说明" v-model="companyMemo"></el-input>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="add-company-container" v-else-if="initShow && !isCompanyValid && $root.rights.includes('company_1_1')">
        <div class="add-company-desc">系统中不存在订单中需要的企业信息，请先点击</div>
        <div class="add-company-btn" @click="onAddCompany" v-show="$root.rights.includes('company_1_1')"><i class="el-icon-plus"></i>添加企业</div>
      </div>
      <div class="add-company-container" v-else-if="!$root.rights.includes('company_1_1')">
        <div class="add-company-desc">系统中不存在订单中需要的企业信息</div>
        <div class="add-company-desc" style="color: red;">您没有添加新企业的权限，请联系管理员！</div>
      </div>
    </div>
    <el-dialog title="添加报表" :visible.sync="addReportWndVisible" width="500px">
      <div class="dialog-body">
        <el-form
          :model="addReportForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-dynamic"
        >
          <el-row>
            <el-col>
              <el-form-item label="年份" prop="Year">
                <el-date-picker
                  v-model="addReportForm.Year"
                  type="year"
                  placeholder="选择年"
                  :clearable="false"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-form-item label="报表类型">
                <el-radio-group v-model="addReportForm.Type">
                  <el-radio :label="1">一季报</el-radio>
                  <el-radio :label="2">中报</el-radio>
                  <el-radio :label="3">三季报</el-radio>
                  <el-radio :label="4">
                    <span style="padding-right: 13px;">年报</span>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <div
              class="error"
              style="color: red; padding-left: 30px;"
              v-show="errOccured"
            >已存在相同的报表，请重新选择</div>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addReport">确 定</el-button>
        <el-button @click="addReportWndVisible = false;errOccured = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加报表" :visible.sync="addReportWndVisibleOrder" width="500px">
      <el-form
        :model="addReportFormForOrder"
        ref="ruleForm"
        label-width="100px"
        class="demo-dynamic"
      >
        <el-row>
          <el-col>
            <el-form-item label="报表选择" v-if="availableAddYears.length > 0">
              <el-radio-group v-model="addReportFormForOrder.ReportIdx">
                <template v-for="(report, idx) in availableAddYears">
                  <el-radio :label="idx">{{report.Year +getLabel(report.Type)}}</el-radio>
                </template>
              </el-radio-group>
            </el-form-item>
            <div v-else style="color: red; font-size: 16px;padding-left: 10px;">当前订单不存在需要添加的报表~~</div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addReportForOrder">确 定</el-button>
        <el-button @click="addReportWndVisibleOrder = false;errOccured = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="displayReport" :width="`${headList.length * 180 + 344}px`" top="20px">
      <div slot="title">
        <div style="font-size: 20px;line-height: 40px;" v-html="`${reportType == 'company' ? `${companyData.Name}` : `${orderData.CompanyName}`}`"></div>
        <div style="font-size: 16px;color: #666;" v-html="`${reportType == 'company' ? `-- ${companyData.CompanyNumber}` : `-- ${orderData.CompanyNumber}`}`"></div>
      </div>
      <div class="display-report">
          <div class="display-container">
            <report-view :reportList="tempReportList" :headList="headList"></report-view>
          </div>
        <!-- </vue-scroll> -->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import mixin from "$mixin/mixin";
import AomHeader from "$packages/frame/aom-header"
import assetsEdit from "./assetsEdit";
import balanceEdit from "./balanceEdit";
import incomeEdit from "./incomeEdit";
import summaryEdit from "./summaryEdit";
import mainRatio from './mainRatio'
import changeRate from './changeRate'
import reportView from "$packages/others/reportView"
const preCls = "statements";

let FinancialRatiosOfChange = {
      OperationRevenue: undefined,
      NetProfit: undefined,
      TotalAssets: undefined,
      TotalLiabilities: undefined,
      TotalOwnersEquity: undefined,
      TotalCurrentAssets: undefined,
      TotalCurrentLiability: undefined,
      WorkingCapital: undefined,
      FixedAssets: undefined,
    }
  
let FinancialRatio = {
      ReturnOnEquity: undefined,
      ReturnOnAssets: undefined,
      GrossProfitRate: undefined,
      NetSalesRate: undefined,
      TotalAssetsTurnover: undefined,
      CurrentAssetsTurnover: undefined,
      AccountsReceivableTurnover: undefined,
      AssetLiabilityRatio: undefined,
      CurrentRatio: undefined,
      QuickRatio: undefined,
      RevenueGrowthRate: undefined,
      GrossProfitGrowthRate: undefined,
      GrowthRateOfTotalAssets: undefined,
    }

let initReportData = {
  CompanyNumber: "",
  Year: "",
  Type: 4,
  ReportType: 1,
  Checked: false,
  Statement: {
    Version: '1.0',
    isEqual: true,
    Asset: {
      MonetaryResources: undefined,
      ShortTermInvestments: undefined,
      NotesReceivable: undefined,
      AccountReceivable: undefined,
      PrePayment: undefined,
      DividendsReceivable: undefined,
      InterestReceivable: undefined,
      ReceivableOther: undefined,
      Inventory: undefined,
      RawMaterial: undefined,
      GoodsInProcess: undefined,
      MerchandiseInventory: undefined,
      RevolvingMaterials: undefined,
      OtherCurrentAssets: undefined,
      TotalCurrentAssets: undefined,
      TotalCurrentAssetsSuggest: "0.00",
      LongTermBondInvestment: undefined,
      LongTermEquityInvestment: undefined,
      FixedAssets: undefined,
      AccumulatedDepreciation: undefined,
      NetValueOfFixedAssets: undefined,
      ConstructionInProcess: undefined,
      EngineeringMaterial: undefined,
      DisposalOfFixedAssets: undefined,
      CapitalizedBiologicalAssets: undefined,
      OilAndGasAssets: undefined,
      IntangibleAssets: undefined,
      DevelopmentExpenditure: undefined,
      Goodwill: undefined,
      EquipmentRentalDeposit: undefined,
      LongTermUnamortizedExpenses: undefined,
      DeferredIncomeTaxAssets: undefined,
      OtherNonCurrentAssets: undefined,
      TotalNonCurrentAssets: undefined,
      TotalNonCurrentAssetsSuggest: "0.00",
      TotalAssets: undefined,
      TotalAssetsSuggest: "0.00",
    },
    Liability: {
      ShortTermBorrowing: undefined,
      NotesPayable: undefined,
      AccountsPayable: undefined,
      UnearnedRevenue: undefined, 
      EmployeePayable: undefined,
      TaxPayable: undefined,
      AccrualInterestPayable: undefined,
      ProfitPayable: undefined,
      OtherPayables: undefined,
      OtherCurrentLiability: undefined,
      TotalCurrentLiability: undefined,
      TotalCurrentLiabilitySuggest: "0.00",
      LongTermLoan: undefined,
      BondsPayable: undefined,
      LongTermPayable: undefined,
      AccountPayableSpecialFunds: undefined,
      FinanceLeasePayable: undefined,
      MajorRepairPreparation: undefined,
      AnticipationLiabilities: undefined,
      EmployeePayableMoreThanOneYear: undefined,
      DeferredIncomeTaxLiabilities: undefined,
      DeferredIncome: undefined,
      OtherNonCurrentLiability: undefined,
      TotalNonCurrentLiability: undefined,
      TotalNonCurrentLiabilitySuggest: "0.00",
      TotalLiabilities: undefined,
      TotalLiabilitiesSuggest: "0.00",
      PaidInCapital: undefined,
      CapitalReserve: undefined,
      EarnedSurplus: undefined,
      GeneralRiskPreparation: undefined,
      ReasonableReserve: undefined,
      UndistributedProfit: undefined,
      TranslationReserve: undefined,
      MinorityEquity: undefined,
      TotalEquity: undefined,
      TotalEquitySuggest: "0.00",
      TotalLiabilitiesOwnersEquity: undefined,
      TotalLiabilitiesOwnersEquitySuggest: "0.00",
    },
    Income: {
      OperationRevenue: undefined,
      MainBusinessIncome: undefined,
      OperatingCosts: undefined,
      BusinessTariffAndAnnex: undefined,
      ConsumptionTax: undefined,
      BusinessTax: undefined,
      UrbanMaintenanceAndConstructionTax: undefined,
      ResourcesTax: undefined,
      LandValueIncrementTax: undefined,
      LandUse_House_VehVesl_StmpTax: undefined,
      EduSurtax_MineralRsrcCompFees_SwgChrg: undefined,
      OperatingMargin: undefined,
      OperatingMarginSuggest: "0.00",
      SellingExpenses: undefined,
      CostOfGoodsMaintenance: undefined,
      AdRate_BusinessPropagandizeFee: undefined,
      AdministrationExpenseCost: undefined,
      OrganizationCosts: undefined,
      BusinessEntertainment: undefined,
      ResearchExpenditure: undefined,
      FinancialCost: undefined,
      InterestCost: undefined,
      AssetsImpairmentLoss: undefined,
      ExplorationExpenditure: undefined,
      OtherExpenses: undefined,
      IncomeFromInvestment: undefined,
      NetIncomeFromChangesInFairValue: undefined,
      ExchangeEarning: undefined,
      OperatingProfit: undefined,
      OperatingProfitSuggest: "0.00",
      NonOperatingIncome: undefined,
      PublicSubsidy: undefined,
      NonBusinessExpenditure: undefined,
      LossOnBadDebts: undefined,
      OtherProfit: undefined,
      UnrecoverableLossOnLongTermBondInvestment: undefined,
      UnrecoverableLossOnLongTermEquityInvestment: undefined,
      LossByForceMajeureFactors: undefined,
      TaxDelayCharge: undefined,
      TotalTax: undefined,
      TotalProfit: undefined,
      TotalProfitSuggest: "0.00",
      IncomeTaxExpense: undefined,
      NetProfit: undefined,
      NetProfitSuggest: "0.00",
    },
    FinancialRatiosOfChange,
    FinancialRatio,
  }
};
export default {
  name: preCls,
  components: {
    AomHeader,
    assetsEdit,
    balanceEdit,
    incomeEdit,
    summaryEdit,
    reportView,
    mainRatio,
    changeRate,
  },
  mixins: [mixin],
  data() {
    var _ = this;
    var YearCheck = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择报表年份"));
      }
      callback();
    };
    return {
      preCls,
      addReportWndVisible: false,
      addReportWndVisibleOrder: false,
      activeName: "assets",
      reportType: "company",
      isLoading: false,
      reportProp: 2,
      curCompanyId: "", //当前企业唯一编号
      errOccured: false,
      reportList: [],
      addReportFormForOrder: {
        ReportIdx: -1
      },
      rules: {
        Year: [{ required: true, validator: YearCheck, trigger: "blur" }]
      },
      addReportForm: {
        Year: new Date(),
        Type: 4
      },
      orderData: {
        CompanyName: "",
        CompanyNumber: "",
        CreateTime: "",
        CustomerFlag: "",
        Editor: null,
        Explain: "",
        ExternalId: null,
        LastModifyTime: null,
        LastModifyUser: null,
        OrderDate: "",
        OrderNumber: "",
        ReportingNeeds: "",
        Status: 0,
        Type: 2
      },
      companyData: {
        CompanyNumber: "",
        Name: ""
      },
      reportYears: [],
      tempReportList: [],
      availableAddYears: [],
      isCompanyValid: false,
      initShow: false,
      isDirty: false,
      companyMemo: '',
      displayReport: false,
      headList: [],
    };
  },
  created() {
    this.reportType = this.$route.name == "orderEdit" ? "order" : "company";
    this.reportProp = !!this.$route.query.type ? this.$route.query.type : 2;
    this.activeName = this.reportProp == 2 ? "assets" : "summary";
    this.curCompanyId = this.$route.query.companyId;

    if (this.reportType == "order")
      this.getOrderById(this.$route.query.orderId);
    else {
      this.initShow = true
      this.isCompanyValid = true
      this.getCompanyById(this.curCompanyId);
      this.getStatements(this.curCompanyId);
    }

    this.getCompanyMemo()
  },
  methods: {
    onAdd() {
      let _ = this;
      _.addReportForOrder.ReportIdx = 0;
      _.availableAddYears = _.reportYears.filter(v => {
        return (
          _.reportList.findIndex(vv => {
            return vv.Year == v.Year && vv.Type == v.Type;
          }) == -1
        );
      });
      _.addReportWndVisibleOrder = false;
      _.addReportWndVisible = false;
      _.addReportWndVisibleOrder = _.reportType == "order";
      _.addReportWndVisible = _.reportType != "order";
    },
    addReportForOrder() {
      if (this.addReportFormForOrder.ReportIdx > -1) {
        this.addReportToDb( this.availableAddYears[this.addReportFormForOrder.ReportIdx], () => {
            this.addReportWndVisibleOrder = false;
          }
        );
      } 
      if(this.availableAddYears.length == 0) {
        this.addReportWndVisibleOrder = false;
      }
    },
    addReport() {
      if (!this.getValidateStatus()) return;
      if (this.checkReportUnique()) {
        this.errOccured = true;
        return;
      }

      this.addReportToDb(this.addReportForm, () => {});

      this.addReportWndVisible = false;
      this.errOccured = false;
    },
    addReportToDb(report, callback) {
      let newReport = this.deepCopy(initReportData)
      newReport.Type = report.Type
      newReport.Year =typeof report.Year == "string" ? parseInt(report.Year) : report.Year.Format("yyyy")
      newReport.CompanyNumber = this.curCompanyId
      newReport.validReport = this.reportType == "order" ? this.validOrderReport(this.addReportForm) : true

      this.http.post(`/financial/company-manage/statements`, newReport)
        .then(res => {
          if (res.status == 201) this.reportList.unshift(newReport)
          callback && callback(res);
        })
        .catch(err => {
          callback && callback(err);
        });
    },
    getOrderById(id) {
      let _ = this;
      this.http
        .get(`${this.preApiName}/financial/order-manage/orders?OrderNumber=${id}`)
        .then(res => {
          if (res.status == 200 && res.data.data.length > 0) {
            _.orderData = res.data.data[0];
            _.getStatements(_.curCompanyId, res.data.data[0].ReportingNeeds);
          }

          _.decodeYears(_.orderData);
        });
    },
    getCompanyById(id) {
      let _ = this;
      this.http.get(`${this.preApiName}/financial/company-manage/companies?CompanyNumber=${id}`)
        .then(res => {
          _.companyData = res.data.data.length > 0 ? res.data.data[0] : _.companyData;
        });
    },
    decodeYears(item) {
      let list = item.ReportingNeeds.split(","); //["2019_4", "2010_3"]

      this.reportYears = list.map(v => {
        let vv = v.split("_"); //[2019, 4]
        return {
          Year: vv[0],
          Type: vv[1]
        };
      });
    },
    getReportStr() {
      let strList = this.reportYears.map(v => {
        return `${v.Year}${this.getLabel(v.Type)}`;
      });
      return strList.join("/");
    },
    getValidateStatus() {
      let validStatus = false;
      this.$refs["ruleForm"].validate(valid => {
        validStatus = valid;
      });
      return validStatus;
    },
    validOrderReport(item) {
      let idx = this.reportYears.findIndex(v => {
        return v.Year == item.Year.Format("yyyy") && v.Type == item.Type;
      });

      return idx >= 0;
    },
    checkReportUnique() {
      let _ = this;
      let idx = this.reportList.findIndex(v => {
        return (
          v.Year == _.addReportForm.Year.Format("yyyy") &&
          v.Type == _.addReportForm.Type
        );
      });

      return idx >= 0;
    },
    getStatements(CompanyNumber, ReportingNeeds = "") {
      this.isLoading = true;
      this.http.get(`/financial/company-manage/statements?CompanyNumber=${this.$route.query.companyId}&ReportingNeeds=${ReportingNeeds}`)
        .then(v => {
          this.isCompanyValid = v.status == 200 ? v.data.isExistCompany : false
          this.reportList = v.status == 200 ? v.data.data : [];
          this.reportList.map( vv => {
            if(!vv.Statement.FinancialRatiosOfChange) {
              vv.Statement.FinancialRatiosOfChange = this.deepCopy(FinancialRatiosOfChange)
              vv.Statement.FinancialRatio = this.deepCopy(FinancialRatio)
            } 

            if(!vv.Statement.Version) {
              vv.Statement.Version = '1.0'
            }
            if(!vv.Statement.isEqual) {
              vv.Statement.isEqual = vv.Statement.Asset.TotalAssets != undefined && 
                                      vv.Statement.Liability.TotalLiabilitiesOwnersEquity != undefined &&
                                      vv.Statement.Asset.TotalAssets == vv.Statement.Liability.TotalLiabilitiesOwnersEquity
            }
          })
          this.initShow = true
        });

      this.$nextTick(() => {
        this.isLoading = false;
      });
    },
    getCompanyMemo() {
      this.http.get(`/financial/company-manage/company-explain?CompanyNumber=${this.$route.query.companyId}`)
        .then(v => {
          this.companyMemo = v.status == 200 ? v.data.data.Explain : ''
        })
    },
    onSave() {
      this.http.post( `/financial/company-manage/statements/batch-operation`, this.reportList)
        .then(res => {
          if(res.status == 201) {
            this.reportType == 'order' && this.updateOrderStatus(5, () => {
              this.showMessage(`保存成功！`,'success')
            })
            
            this.isDirty = false
            this.reportType != 'order' && this.showMessage(`保存成功！`,'success')
          }
        })

      let param = {
        Operator: localStorage.getItem('UserName'),
        Explain: this.companyMemo
      }  

      this.http.put( `/financial/company-manage/company-explain?CompanyNumber=${this.curCompanyId}`, param)
        .then(res => {
          if(res.status != 201) {
            this.showMessage('保存财务说明失败！', 'error')
          }
        })
    },
    onSubmit() {
      if(this.isDirty) {
        this.$alert(`当前订单还有未保存，不能提交，请先保存后再进行提交`, '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      if(this.reportYears.length != this.reportList.length) {
        this.$alert(`当前订单还有未完成的报表，不能提交`, '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.$confirm('确定提交此订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateOrderStatus(10, (res) => {
            this.showMessage(`提交成功！`,'success')
          })
        })
    },
    onSend() {
      this.$confirm('确定发送此订单到客户那里吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.http.post(`/financial/order-manage/orders/send-operation?`, {OrderNumber: this.orderData.OrderNumber, Operator: localStorage.getItem("UserName")}).then(res => {
            res.status == 201 && this.showMessage('发送订单成功', 'success')
          }).catch(err => {
            this.showMessage(`发送订单失败, ${err.response.data.Message}`, 'error')
          })
        })
    },
    onReturn() {
      this.$confirm('确定撤销到上一个状态吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          
          this.updateOrderStatus(0, () => {
            this.showMessage(`撤销状态成功！`,'success')
          })
        })
    },
    onCancel() {
      this.$prompt('请输入取消订单的原因：', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          if(res.value == null) {
            this.showMessage(`请输入取消订单的原因`, 'warning')
            return
          }
          this.http.post(`/financial/order-manage/orders/cancel-operation?`, {OrderNumber: this.orderData.OrderNumber, Operator: localStorage.getItem("UserName"), Explain: res.value}).then(res => {
            if(res.status == 201) {
              this.showMessage('取消订单成功!', 'success')
              this.orderData.Status = -1
              this.orderData.LastModifyUser = localStorage.getItem("UserName")

              this.orderData.Editor = localStorage.getItem("UserName")
            }
          }).catch(err => {
            this.showMessage(`取消订单失败, ${err.response.data.Message}`, 'error')
          })
        })
    },
    updateOrderStatus(status, callback) {
      let param = status != 20 ? {
        Status: status,
        LastModifyUser: localStorage.getItem("UserName"),
        Editor: localStorage.getItem("UserName"),
      } : {
        Status: status,
        LastModifyUser: localStorage.getItem("UserName"),
      }
      this.http
        .put(`/financial/order-manage/orders?OrderNumber=${this.orderData.OrderNumber}`, param)
        .then(res => {
          if(res.status == 201) {
            this.orderData.Status = status
            this.orderData.LastModifyUser = localStorage.getItem("UserName")

            this.orderData.Editor = status != 20 ? localStorage.getItem("UserName") : this.orderData.Editor
          }
          callback && callback(res)
        }).catch(err => {
          callback && callback(err)
        })
    },
    onAddCompany() {
      let item = this.orderData
      this.http
        .post(`${this.preApiName}/financial/company-manage/companies`, {
          CompanyNumber: item.CompanyNumber,
          Name: item.CompanyName,
          Description: ""
        })
        .then(res => {
          this.isCompanyValid = res.status == 201
        });
    },
    getLastModifyLabel() {
      switch(this.orderData.Status) {
        case 10:
        case '10':
          return '<i style="padding-left: 10px;border-left: 1px solid #aaa;"></i>提交人：'
        case 20:
        case '20':
          return '<i style="padding-left: 10px;border-left: 1px solid #aaa;"></i>发送人:'
        default: return ''
      }
    },
    getLastModifyUser() {
      switch(this.orderData.Status) {
        case 10:
        case '10':
          return this.orderData.LastModifyUser
        case 20:
        case '20':
          return this.orderData.LastModifyUser
        default: return ''
      }
    },
    getTimeLabel(status) {
      switch(status) {
        case 1:
        case '1':
          return '指派时间';
        case 5:
        case '5':
          return '保存时间'
        case 10:
        case '10':
          return '提交时间'
        case 20:
        case '20':
          return '发送时间'
        default:
          return '最后时间'
      }
    },
    onDeleteStatement(report) {
      let _ = this
      this.$confirm(`删除报表可能会导致相关联的订单不完整，确定删除报表[${report.Year}${_.getLabel(report.Type)}]吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            Operator: localStorage.getItem('UserName')
          }
          _.http.delete(`/financial/company-manage/statements?CompanyNumber=${report.CompanyNumber}&Year=${report.Year}&Type=${report.Type}`, {data: param})
          .then(res => {
            if(res.status == 204) {
              _.showMessage('删除报表成功！', 'success')
              let idx = _.reportList.findIndex(v => {
                return v.CompanyNumber == report.CompanyNumber && v.Year == report.Year && v.Type == report.Type
              })

              idx >= 0 && _.reportList.splice(idx, 1)
            }
          }).catch(err => {
            _.showMessage('删除报表失败', 'error', 3000)
          })
        })
    },
    onLinkToCompany(companyId) {
      this.$router.push(`${this.preName}/company/companyEdit?companyId=${companyId}`)
    },
    backPath() {
      this.reportType == "order" ? this.$router.push(`${this.preName}/order`) : this.$router.push(`${this.preName}/company`)
    },
    onValueChanged(index) {
      this.isDirty = true
      if(index != undefined && index >= 0) {
        this.reportList[index].Statement.isEqual =  this.reportList[index].Statement.Asset.TotalAssets != undefined && 
                                                    this.reportList[index].Statement.Liability.TotalLiabilitiesOwnersEquity != undefined &&
                                                    this.reportList[index].Statement.Asset.TotalAssets == this.reportList[index].Statement.Liability.TotalLiabilitiesOwnersEquity
      }
      
    },
    onDisplay() {
      let {value, items} = this.getViewReportList()

      if(value == 0) {
        this.$alert('请选择要预览的报表', '警告')
        return
      } else if(value == 4) {
        this.$alert('当前同时预览的报表数目不能超过4个！', '警告')
        return
      } else if(value == 5) {
        this.$alert('请选择相同类型的报表！', '警告')
        return
      }
      this.tempReportList = items
      this.displayReport = true
    },
    getViewReportList() {
        let arr = []
        let list = this.reportList.filter(v => { return v.Checked })

        if(list.length == 0) {
          return {value: 0, items: []}
        } else if(list.length > 4) {
          return {value: 4, items: []}
        } else {
          let type = list[0].Type

          for(let i = 1; i < list.length; ++i) {
            if(type != list[i].Type) {
              return {value: 5}
            }
          }
        }

        let validList = this.sortReportList(list)

        this.headList = [{
            CompanyNumber: '',
            Year: 2010,
            Type: 1,
            Desc: ``
          }]

        let FlowAsset = {}
        // FlowAsset.title = '流动资产'

        let unFlowAsset = {}
        // unFlowAsset.title = '非流动资产'

        let totalAsset = {}
        // totalAsset.title = '总额'

        validList.forEach((item, index, array) => {
          let head = {
            CompanyNumber: item.CompanyNumber,
            Year: item.Year,
            Type: item.Type,
            Desc: `${item.Year}${this.getLabel(item.Type)}`
          }
          this.headList.push(head)
        })

        Object.keys(initReportData.Statement.Asset).forEach((key, idx) => {
          validList.forEach((item, index, array) => {
            let {type, label} = this.getItemLabel(key)
            if(label !== '') {
              switch(type) {
                  case 1: //流动资产
                    if(index == 0) {
                      FlowAsset[`${idx}_${key}`] = []
                      FlowAsset[`${idx}_${key}`].push(label)
                    }
                    FlowAsset[`${idx}_${key}`].push(this.formatNumer(item.Statement.Asset[key]))
                  break;
                  case 2: //非流动资产
                    if(index == 0) {
                      unFlowAsset[`${idx}_${key}`] = []
                      unFlowAsset[`${idx}_${key}`].push(label)
                    }
                    unFlowAsset[`${idx}_${key}`].push(this.formatNumer(item.Statement.Asset[key]))
                  break;
                  case 3: //资产总额
                    if(index == 0) {
                      totalAsset[`${idx}_${key}`] = []
                      totalAsset[`${idx}_${key}`].push(label)
                    }
                    totalAsset[`${idx}_${key}`].push(this.formatNumer(item.Statement.Asset[key]))
                  break;
              }
            }
          })
        })
        arr.push({title: '流动资产', items:this.reFormatData(FlowAsset)})
        arr.push({title: '非流动资产', items: this.reFormatData(unFlowAsset)})
        arr.push({title: '总额', items: this.reFormatData(totalAsset)})

        let FlowBalance = {}

        let unFlowBalance = {}

        let totalFlowBalance = {}

        Object.keys(initReportData.Statement.Liability).forEach((key, idx) => {
          validList.forEach((item, index, array) => {
            let {type, label} = this.getItemLabel(key)
            if(label !== '') {
              switch(type) {
                  case 4: //流动负债
                    if(index == 0) {
                      FlowBalance[`${idx}_${key}`] = []
                      FlowBalance[`${idx}_${key}`].push(label)
                    }
                    FlowBalance[`${idx}_${key}`].push(this.formatNumer(item.Statement.Liability[key]))
                  break;
                  case 5: //非流动负债
                    if(index == 0) {
                      unFlowBalance[`${idx}_${key}`] = []
                      unFlowBalance[`${idx}_${key}`].push(label)
                    }
                    unFlowBalance[`${idx}_${key}`].push(this.formatNumer(item.Statement.Liability[key]))
                  break;
                  case 6: //负债总额
                    if(index == 0) {
                      totalFlowBalance[`${idx}_${key}`] = []
                      totalFlowBalance[`${idx}_${key}`].push(label)
                    }
                    totalFlowBalance[`${idx}_${key}`].push(this.formatNumer(item.Statement.Liability[key]))
                  break;
              }
            }
          })
        })
        arr.push({title: '流动负债', items: this.reFormatData(FlowBalance)})
        arr.push({title: '非流动负债', items:this.reFormatData(unFlowBalance)})
        arr.push({title: '股东权益（所有者权益）合计', items: this.reFormatData(totalFlowBalance)})

        let totalRevenue = {}
        let chengben = {}
        let lirun = {}
        let lirunzonge = {}
        let jinlirun = {}

        Object.keys(initReportData.Statement.Income).forEach((key, idx) => {
          validList.forEach((item, index, array) => {
            let {type, label} = this.getItemLabel(key)
            if(label !== '') {
              switch(type) {
                  case 7: //营业总收入
                    if(index == 0) {
                      totalRevenue[`${idx}_${key}`] = []
                      totalRevenue[`${idx}_${key}`].push(label)
                    }
                    totalRevenue[`${idx}_${key}`].push(this.formatNumer(item.Statement.Income[key]))
                  break;
                  case 8: //营业总成本
                    if(index == 0) {
                      chengben[`${idx}_${key}`] = []
                      chengben[`${idx}_${key}`].push(label)
                    }
                    chengben[`${idx}_${key}`].push(this.formatNumer(item.Statement.Income[key]))
                  break;
                  case 9: //营业利润
                    if(index == 0) {
                      lirun[`${idx}_${key}`] = []
                      lirun[`${idx}_${key}`].push(label)
                    }
                    lirun[`${idx}_${key}`].push(this.formatNumer(item.Statement.Income[key]))
                  break;
                  case 10: //利润总额
                    if(index == 0) {
                      lirunzonge[`${idx}_${key}`] = []
                      lirunzonge[`${idx}_${key}`].push(label)
                    }
                    lirunzonge[`${idx}_${key}`].push(this.formatNumer(item.Statement.Income[key]))
                  break;
                  case 11: //净利润
                    if(index == 0) {
                      jinlirun[`${idx}_${key}`] = []
                      jinlirun[`${idx}_${key}`].push(label)
                    }
                    jinlirun[`${idx}_${key}`].push(this.formatNumer(item.Statement.Income[key]))
                  break;
              }
            }
          })
        })
        
        arr.push({title: '营业总收入', items: this.reFormatData(totalRevenue)})
        arr.push({title: '营业总成本', items: this.reFormatData(chengben)})
        arr.push({title: '营业利润', items: this.reFormatData(lirun)})
        arr.push({title: '利润总额', items: this.reFormatData(lirunzonge)})
        arr.push({title: '净利润', items: this.reFormatData(jinlirun)})

        return {value: 1, items: arr}
    },
    reFormatData(item) {
      let items = []
      let keys = Object.keys(item)
      for(let i = 0; i < 100; ++i) {
        let curKey = keys.find(v => {
          return v.startsWith(`${i}_`)
        })
        if(curKey != undefined) {
          items.push(item[curKey])
        }
      }

      return items
    },
    getItemLabel(key) {
      switch(key) {
          case 'MonetaryResources':
              return {type: 1, label: '货币资金：'}
          case 'ShortTermInvestments':
              return {type: 1, label: '短期投资：'}
          case 'NotesReceivable':
              return {type: 1, label: '应收票据：'}
          case 'AccountReceivable':
              return {type: 1, label: '应收账款：'}
          case 'PrePayment':
              return {type: 1, label: '预付账款：'}              
          case 'DividendsReceivable':
              return {type: 1, label: '应收股利：'}            
          case 'InterestReceivable':
              return {type: 1, label: '应收利息：'}           
          case 'ReceivableOther':
              return {type: 1, label: '其他应收款：'}           
          case 'Inventory':
              return {type: 1, label: '存货：'}        
          case 'RawMaterial':
              return {type: 1, label: '其中：原材料：'}          
          case 'GoodsInProcess':
              return {type: 1, label: '在产品：'}          
          case 'MerchandiseInventory':
              return {type: 1, label: '库存商品：'}             
          case 'RevolvingMaterials':
              return {type: 1, label: '周转材料：'}             
          case 'OtherCurrentAssets':
              return {type: 1, label: '其他流动资产：'}            
          case 'TotalCurrentAssets':
              return {type: 1, label: '流动资产合计：'}            
          case 'TotalCurrentAssetsSuggest':
              return {type: 1, label: ''}          
          case 'LongTermBondInvestment':
              return {type: 2, label: '长期债券投资：'}         
          case 'LongTermEquityInvestment':
              return {type: 2, label: '长期股权投资：'}           
          case 'FixedAssets':
              return {type: 2, label: '固定资产原价：'}            
          case 'AccumulatedDepreciation':
              return {type: 2, label: '减：累计折旧：'}
          case 'NetValueOfFixedAssets':
              return {type: 2, label: '固定资产账面价值：'}
          case 'ConstructionInProcess':
              return {type: 2, label: '在建工程：'}
          case 'EngineeringMaterial':
              return {type: 2, label: '工程物资：'}
          case 'DisposalOfFixedAssets':
              return {type: 2, label: '固定资产清理：'}
          case 'CapitalizedBiologicalAssets':
              return {type: 2, label: '生产性生物资产：'}
          case 'OilAndGasAssets':
              return {type: 2, label: '油气资产：'}
          case 'IntangibleAssets':
              return {type: 2, label: '无形资产：'}
          case 'DevelopmentExpenditure':
              return {type: 2, label: '开发支出：'}
          case 'Goodwill':
              return {type: 2, label: '商誉：'}
          case 'EquipmentRentalDeposit':
              return {type: 2, label: '设备租赁定金：'}
          case 'LongTermUnamortizedExpenses':
              return {type: 2, label: '长期待摊费用：'}
          case 'DeferredIncomeTaxAssets':
              return {type: 2, label: '递延所得税资产:'}
          case 'OtherNonCurrentAssets':
              return {type: 2, label: '其他非流动资产:'}
          case 'TotalNonCurrentAssets':
              return {type: 2, label: '非流动资产合计:'}
          case 'TotalNonCurrentAssetsSuggest':
              return {type: 1, label: ''}
          case 'TotalAssets':
              return {type: 3, label: '资产总额:'}
          case 'TotalAssetsSuggest':
              return {type: 3, label: ''}
          case 'ShortTermBorrowing':
              return {type: 4, label: '短期借款：'}
          case 'NotesPayable':
              return {type: 4, label: '应付票据：'}
          case 'AccountsPayable':
              return {type: 4, label: '应付账款：'}
          case 'UnearnedRevenue':
              return {type: 4, label: '预收账款：'} 
          case 'EmployeePayable':
              return {type: 4, label: '应付职工薪酬：'}
          case 'TaxPayable':
              return {type: 4, label: '应交税费：'}
          case 'AccrualInterestPayable':
              return {type: 4, label: '应付利息：'}
          case 'ProfitPayable':
              return {type: 4, label: '应付利润：'}
          case 'OtherPayables':
              return {type: 4, label: '其他应付款：'}
          case 'OtherCurrentLiability':
              return {type: 4, label: '其他流动负债：'}
          case 'TotalCurrentLiability':
              return {type: 4, label: '流动负债合计：'}
          case 'TotalCurrentLiabilitySuggest':
              return {type: 4, label: ''}
          case 'LongTermLoan':
              return {type: 5, label: '长期借款：'}
          case 'BondsPayable':
              return {type: 5, label: '应付债券：'}
          case 'LongTermPayable':
              return {type: 5, label: '长期应付款：'}
          case 'AccountPayableSpecialFunds':
              return {type: 5, label: '专项应付款：'}
          case 'FinanceLeasePayable':
              return {type: 5, label: '应付融资租赁款：'}
          case 'MajorRepairPreparation':
              return {type: 5, label: '大修理准备：'}
          case 'AnticipationLiabilities':
              return {type: 5, label: '预计负债：'}
          case 'EmployeePayableMoreThanOneYear':
              return {type: 5, label: '一年以上应付职工薪酬：'}
          case 'DeferredIncomeTaxLiabilities':
              return {type: 5, label: '递延所得税负债：'}
          case 'DeferredIncome':
              return {type: 5, label: '递延收益：'}
          case 'OtherNonCurrentLiability':
              return {type: 5, label: '其他非流动负债：'}
          case 'TotalNonCurrentLiability':
              return {type: 5, label: '非流动负债合计：'}
          case 'TotalNonCurrentLiabilitySuggest':
              return {type: 5, label: ''}
          case 'TotalLiabilities':
              return {type: 5, label: '负债合计：'}
          case 'TotalLiabilitiesSuggest':
              return {type: 5, label: ''}
          case 'PaidInCapital':
              return {type: 6, label: '实收资本（或股本）：'}
          case 'CapitalReserve':
              return {type: 5, label: '资本公积：'}
          case 'EarnedSurplus':
              return {type: 6, label: '盈余公积：'}
          case 'GeneralRiskPreparation':
              return {type: 6, label: '一般风险准备：'}
          case 'ReasonableReserve':
              return {type: 6, label: '专项储备：'}
          case 'UndistributedProfit':
              return {type: 6, label: '未分配利润：'}
          case 'TranslationReserve':
              return {type: 6, label: '外币报表折算差额：'}
          case 'MinorityEquity':
              return {type: 6, label: '少数股东权益：'}
          case 'TotalEquity':
              return {type: 6, label: '所有者权益（或股东权益）合计：'}
          case 'TotalEquitySuggest':
              return {type: 6, label: ''}
          case 'TotalLiabilitiesOwnersEquity':
              return {type: 6, label: '负债和所有者权益（或股东权益）总计：'}
          case 'TotalLiabilitiesOwnersEquitySuggest':
              return {type: 6, label: ''}
          case 'OperationRevenue':
              return {type: 7, label: '营业收入：'}
          case 'MainBusinessIncome':
              return {type: 7, label: '主营业务收入：'}
          case 'OperatingCosts':
              return {type: 8, label: '减：营业成本：'}
          case 'BusinessTariffAndAnnex':
              return {type: 8, label: '营业税金及附加：'}
          case 'ConsumptionTax':
              return {type: 8, label: '其中：消费税：'}
          case 'BusinessTax':
              return {type: 8, label: '营业税：'}
          case 'UrbanMaintenanceAndConstructionTax':
              return {type: 8, label: '城市维护建设税：'}
          case 'ResourcesTax':
              return {type: 8, label: '资源税：'}
          case 'LandValueIncrementTax':
              return {type: 8, label: '土地增值税：'}
          case 'LandUse_House_VehVesl_StmpTax':
              return {type: 8, label: '城镇土地使用税、房产税、车船税、印花税：'}
          case 'EduSurtax_MineralRsrcCompFees_SwgChrg':
              return {type: 8, label: '教育费附加、矿产资源补偿费、排污费：'}
          case 'OperatingMargin':
              return {type: 8, label: '营业毛利：'}
          case 'OperatingMarginSuggest':
              return {type: 8, label: ''}
          case 'SellingExpenses':
              return {type: 8, label: '减：销售费用：'}
          case 'CostOfGoodsMaintenance':
              return {type: 8, label: '其中：商品维修费：'}
          case 'AdRate_BusinessPropagandizeFee':
              return {type: 8, label: '广告费和业务宣传费：'}
          case 'AdministrationExpenseCost':
              return {type: 8, label: '管理费用：'}
          case 'OrganizationCosts':
              return {type: 8, label: '其中：开办费：'}
          case 'BusinessEntertainment':
              return {type: 8, label: '业务招待费：'}
          case 'ResearchExpenditure':
              return {type: 8, label: '研究费用：'}
          case 'FinancialCost':
              return {type: 8, label: '财务费用：'}
          case 'InterestCost':
              return {type: 8, label: '其中：利息费用：'}
          case 'AssetsImpairmentLoss':
              return {type: 8, label: '资产减值损失：'}
          case 'ExplorationExpenditure':
              return {type: 8, label: '勘探费用：'}
          case 'OtherExpenses':
              return {type: 8, label: '其他费用：'}
          case 'IncomeFromInvestment':
              return {type: 8, label: '加：投资收益：'}
          case 'NetIncomeFromChangesInFairValue':
              return {type: 8, label: '公允价值变动净收益：'}
          case 'ExchangeEarning':
              return {type: 8, label: '汇兑收益：'}
          case 'OperatingProfit':
              return {type: 9, label: '营业利润：'}
          case 'OperatingProfitSuggest':
              return {type: 9, label: ''}
          case 'NonOperatingIncome':
              return {type: 9, label: '加：营业外收入：'}
          case 'PublicSubsidy':
              return {type: 9, label: '其中：政府补助：'}
          case 'NonBusinessExpenditure':
              return {type: 9, label: '减：营业外支出：'}
          case 'LossOnBadDebts':
              return {type: 9, label: '其中：坏账损失：'}
          case 'OtherProfit':
              return {type: 9, label: '其他利润：'}
          case 'UnrecoverableLossOnLongTermBondInvestment':
              return {type: 9, label: '无法收回的长期债券投资损失：'}
          case 'UnrecoverableLossOnLongTermEquityInvestment':
              return {type: 9, label: '无法收回的长期股权投资损失：'}
          case 'LossByForceMajeureFactors':
              return {type: 9, label: '自然灾害等不可抗力因素造成的损失：'}
          case 'TaxDelayCharge':
              return {type: 9, label: '税收滞纳金：'}
          case 'TotalTax':
              return {type: 9, label: '纳税总额：'}
          case 'TotalProfit':
              return {type: 10, label: '利润总额：'}
          case 'TotalProfitSuggest':
              return {type: 10, label: ''}
          case 'IncomeTaxExpense':
              return {type: 11, label: '减：所得税费用：'}
          case 'NetProfit':
              return {type: 11, label: '净利润：'}
          case 'NetProfitSuggest':
              return {type: 11, label: ''}
          default:
              return {type: 12, label: ''}

      }
    },
    sortReportList(sourceList) {
      if(sourceList.length == 1) {
        return sourceList
      }

      let newArray = sourceList.sort((a, b) => {
        return Number(a.Year) - Number(b.Year) > 0 ? -1 : 1
      })

      return newArray.sort((a, b) => {
        if(Number(a.Year) == Number(b.Year)) {
          return Number(a.Type) - Number(b.Type) > 0 ? -1 : 1
        } else {
          return 0
        }
      })
    }
  },
  computed: {
    orderStatus: function() {
      let color = '#fff'
      switch(this.orderData.Status) {
        case -1:
        color = 'rgb(255, 73, 73)'
        break;
        case 0:
          color = 'rgb(215, 219, 226)'
        break;
        case 10:
        color = 'rgb(32, 160, 255)'
        break;
        case 20:
        color = 'rgb(19, 206, 102)'
        break;
        default:
          color = 'rgb(144, 147, 153)'
        break;
      }
      return {
        'border-left': `15px solid ${color}`
      }
    }
  },
  watch: {
    activeName(n) {
      this.reportList = this.deepCopy(this.reportList)
    }
  },
  beforeRouteLeave(to, from, next) {
    this.isDirty ? this.$confirm('当前报表信息有修改，还未保存，确定离开吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }) : next()
  },
};
</script>