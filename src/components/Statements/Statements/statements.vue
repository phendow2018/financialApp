<template>
  <div class="big-container" v-loading="isLoading">
    <aom-header :parentTitle="reportType =='company' ? '企业' : '订单'" mainTitle="财务信息" @aom-go-back="backPath"></aom-header>
    <div :class="[preCls + '-tabs']">
      <div class="main-header" :style="orderStatus">
        <div class="company-header" v-if="reportType == 'company'">
          <div class="name header-item">
            <span class="name-label">公司名称：</span>
            <span class="name-value">{{companyData.Name}}</span>
          </div>
          <div class="companyid header-item">
            <span class="name-label">统一社会信用代码：</span>
            <span class="name-value">{{companyData.CompanyNumber}}</span>
          </div>
        </div>
        <div class="order-header" v-if="reportType != 'company'">
          <div class="order header-item">
            <span class="name-label">订单编号：</span>
            <span class="name-value">{{orderData.OrderNumber}}</span>
          </div>
          <div class="name header-item">
            <span class="name-label">下单时间：</span>
            <span class="name-value">{{orderData.CreateTime}}</span>
          </div>
          <div style="text-align:right;color:#aaa;">
            <a @click="onReturn" v-show="(orderData.Status == 10 || orderData.Status == -1) && $root.rights.includes('order_2_6')" class="small-btn">撤销</a>
            <a @click="onCancel" v-show="(!(orderData.Status == 20 || orderData.Status == -1)) && $root.rights.includes('order_2_5')" class="small-btn">取消订单</a>
          </div>
          <div class="name header-item">
            <span class="name-label">企业名称：</span>
            <span class="name-value">{{orderData.CompanyName}}</span>
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
            <summary-edit :reportList="reportList"></summary-edit>
          </el-tab-pane>
          <el-tab-pane label="资产" name="assets" v-if="reportProp == 2">
            <assets-edit :reportList="reportList"></assets-edit>
          </el-tab-pane>
          <el-tab-pane label="负债" name="balance" v-if="reportProp == 2">
            <balance-edit :reportList="reportList"></balance-edit>
          </el-tab-pane>
          <el-tab-pane label="损益" name="income" v-if="reportProp == 2">
            <income-edit :reportList="reportList"></income-edit>
          </el-tab-pane>
          <el-tab-pane label="说明" name="memo" v-if="reportProp == 2"></el-tab-pane>
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
  </div>
</template>

<script>
import mixin from "$mixin/mixin";
import AomHeader from "$packages/frame/aom-header"
import assetsEdit from "./assetsEdit";
import balanceEdit from "./balanceEdit";
import incomeEdit from "./incomeEdit";
import summaryEdit from "./summaryEdit";
const preCls = "statements";

let initReportData = {
  CompanyNumber: "",
  Year: "",
  Type: 4,
  Statement: {
    Asset: {
      MonetaryResources: 0,
      ShortTermInvestments: 0,
      NotesReceivable: 0,
      AccountReceivable: 0,
      PrePayment: 0,
      DividendsReceivable: 0,
      InterestReceivable: 0,
      ReceivableOther: 0,
      Inventory: 0,
      RawMaterial: 0,
      GoodsInProcess: 0,
      MerchandiseInventory: 0,
      RevolvingMaterials: 0,
      OtherCurrentAssets: 0,
      TotalCurrentAssets: 0,
      TotalCurrentAssetsSuggest: "0.00",
      LongTermBondInvestment: 0,
      LongTermEquityInvestment: 0,
      FixedAssets: 0,
      AccumulatedDepreciation: 0,
      NetValueOfFixedAssets: 0,
      ConstructionInProcess: 0,
      EngineeringMaterial: 0,
      DisposalOfFixedAssets: 0,
      CapitalizedBiologicalAssets: 0,
      OilAndGasAssets: 0,
      IntangibleAssets: 0,
      DevelopmentExpenditure: 0,
      Goodwill: 0,
      EquipmentRentalDeposit: 0,
      LongTermUnamortizedExpenses: 0,
      DeferredIncomeTaxAssets: 0,
      OtherNonCurrentAssets: 0,
      TotalNonCurrentAssets: 0,
      TotalNonCurrentAssetsSuggest: "0.00",
      TotalAssets: 0,
      TotalAssetsSuggest: "0.00",
    },
    Liability: {
      ShortTermBorrowing: 0,
      NotesPayable: 0,
      AccountsPayable: 0,
      UnearnedRevenue: 0, 
      EmployeePayable: 0,
      TaxPayable: 0,
      AccrualInterestPayable: 0,
      ProfitPayable: 0,
      OtherPayables: 0,
      OtherCurrentLiability: 0,
      TotalCurrentLiability: 0,
      TotalCurrentLiabilitySuggest: "0.00",
      LongTermLoan: 0,
      BondsPayable: 0,
      LongTermPayable: 0,
      AccountPayableSpecialFunds: 0,
      FinanceLeasePayable: 0,
      MajorRepairPreparation: 0,
      AnticipationLiabilities: 0,
      EmployeePayableMoreThanOneYear: 0,
      DeferredIncomeTaxLiabilities: 0,
      DeferredIncome: 0,
      OtherNonCurrentLiability: 0,
      TotalNonCurrentLiability: 0,
      TotalNonCurrentLiabilitySuggest: "0.00",
      TotalLiabilities: 0,
      TotalLiabilitiesSuggest: "0.00",
      PaidInCapital: 0,
      CapitalReserve: 0,
      EarnedSurplus: 0,
      GeneralRiskPreparation: 0,
      ReasonableReserve: 0,
      UndistributedProfit: 0,
      TranslationReserve: 0,
      MinorityEquity: 0,
      TotalEquity: 0,
      TotalEquitySuggest: "0.00",
      TotalLiabilitiesOwnersEquity: 0,
      TotalLiabilitiesOwnersEquitySuggest: "0.00",
    },
    Income: {
      OperationRevenue: 0,
      MainBusinessIncome: 0,
      OperatingCosts: 0,
      BusinessTariffAndAnnex: 0,
      ConsumptionTax: 0,
      BusinessTax: 0,
      UrbanMaintenanceAndConstructionTax: 0,
      ResourcesTax: 0,
      LandValueIncrementTax: 0,
      LandUse_House_VehVesl_StmpTax: 0,
      EduSurtax_MineralRsrcCompFees_SwgChrg: 0,
      OperatingMargin: 0,
      OperatingMarginSuggest: "0.00",
      SellingExpenses: 0,
      CostOfGoodsMaintenance: 0,
      AdRate_BusinessPropagandizeFee: 0,
      AdministrationExpenseCost: 0,
      OrganizationCosts: 0,
      BusinessEntertainment: 0,
      ResearchExpenditure: 0,
      FinancialCost: 0,
      InterestCost: 0,
      AssetsImpairmentLoss: 0,
      ExplorationExpenditure: 0,
      OtherExpenses: 0,
      IncomeFromInvestment: 0,
      NetIncomeFromChangesInFairValue: 0,
      ExchangeEarning: 0,
      OperatingProfit: 0,
      OperatingProfitSuggest: "0.00",
      NonOperatingIncome: 0,
      PublicSubsidy: 0,
      NonBusinessExpenditure: 0,
      LossOnBadDebts: 0,
      OtherProfit: 0,
      UnrecoverableLossOnLongTermBondInvestment: 0,
      UnrecoverableLossOnLongTermEquityInvestment: 0,
      LossByForceMajeureFactors: 0,
      TaxDelayCharge: 0,
      TotalTax: 0,
      TotalProfit: 0,
      TotalProfitSuggest: "0.00",
      IncomeTaxExpense: 0,
      NetProfit: 0,
      NetProfitSuggest: "0.00",
    }
  }
};
export default {
  name: preCls,
  components: {
    AomHeader,
    assetsEdit,
    balanceEdit,
    incomeEdit,
    summaryEdit
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
      availableAddYears: [],
      isCompanyValid: false,
      initShow: false
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
      let newReport = this.deepCopy(initReportData);
      newReport.Type = report.Type;
      newReport.Year =
        typeof report.Year == "string"
          ? parseInt(report.Year)
          : report.Year.Format("yyyy");
      newReport.CompanyNumber = this.curCompanyId;
      newReport.validReport =
        this.reportType == "order"
          ? this.validOrderReport(this.addReportForm)
          : true;

      this.http
        .post(`/financial/company-manage/statements`, newReport)
        .then(res => {
          if (res.status == 201) this.reportList.unshift(newReport);
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
      this.http
        .get(
          `${this.preApiName}/financial/company-manage/companies?CompanyNumber=${id}`
        )
        .then(res => {
          _.companyData =
            res.data.data.length > 0 ? res.data.data[0] : _.companyData;
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
      this.http
        .get(
          `/financial/company-manage/statements?CompanyNumber=${this.$route.query.companyId}&ReportingNeeds=${ReportingNeeds}`
        )
        .then(v => {
          this.isCompanyValid = v.status == 200 ? v.data.isExistCompany : false
          this.reportList = v.status == 200 ? v.data.data : [];
          this.initShow = true
        });

      this.$nextTick(() => {
        this.isLoading = false;
      });
    },
    onSave() {
      this.http
        .post(
          `/financial/company-manage/statements/batch-operation`,
          this.reportList
        )
        .then(res => {
          if(res.status == 201) {
            this.reportType == 'order' && this.updateOrderStatus(5, () => {
              this.showMessage(`保存成功！`,'success')
            })

            this.reportType != 'order' && this.showMessage(`保存成功！`,'success')
          }
        });
    },
    onSubmit() {
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
      this.$confirm('取消订单将导致该订单无法继续操作，确定取消吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.updateOrderStatus(-1, () => {
            this.showMessage(`取消订单成功！`,'success')
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
    onLinkToCompany(companyId) {
      this.$router.push(
        `${this.preName}/company/companyEdit?companyId=${companyId}`
      );
    },
    backPath() {
      this.$router.go(-1);
    },
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
        'border-left': `10px solid ${color}`
      }
    }
  }
};
</script>