const global = require('../../Common/Global');
const tools = require('../../Common/tools');
const Order = require('../financial/Order');
const qichachaConfig = require('./common.json').qichacha;
const CompanyStatement = require('../financial/CompanyStatement');

class QichachaReport {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 生成报表 */
  async makeReport(OrderNumber) {
    let orderDeal = new Order();
    let orderInfo = await orderDeal.queryOrder({OrderNumber: OrderNumber});
    if (orderInfo === false || !tools.isArray(orderInfo.data) || orderInfo.data.length <= 0) {
      this.LastError = '无法找到指定订单';
      return false;
    }
    orderInfo = orderInfo.data[0];
    if (orderInfo.CustomerFlag != QichachaReport.CUSTOMER_FLAG) {
      this.LastError = `订单客户类型不为${QichachaReport.CUSTOMER_FLAG},不能进行操作`;
      return false;
    }
    if (!Order.isValidType(orderInfo.Type)) {
      this.LastError = `无效的订单类型Type`;
      return false;
    }

    let statementDeal = new CompanyStatement();
    let queryParams = {
      CompanyNumber: orderInfo.CompanyNumber,
      ReportingNeeds: orderInfo.ReportingNeeds
    }
    let retData = await statementDeal.queryStatement(queryParams);
    if (retData === false) {
      this.LastError = statementDeal.getLastError();
      return false;
    }
    
    if (orderInfo.Type == 1) {
      return this.makeLargeNumberReport(orderInfo, retData.data);
    } else {
      return this.makeFianacialDetailReport(orderInfo, retData.data);
    }
  }

  /** 生成取消信息 */
  async makeCancel(OrderNumber) {
    let orderDeal = new Order();
    let orderInfo = await orderDeal.queryOrder({OrderNumber: OrderNumber});
    if (orderInfo === false || !tools.isArray(orderInfo.data) || orderInfo.data.length <= 0) {
      this.LastError = '无法找到指定订单';
      return false;
    }
    orderInfo = orderInfo.data[0];
    if (orderInfo.CustomerFlag != QichachaReport.CUSTOMER_FLAG) {
      this.LastError = `订单客户类型不为${QichachaReport.CUSTOMER_FLAG},不能进行操作`;
      return false;
    }

    return this.makeReportStruct(orderInfo, true);
  }
}
QichachaReport.CUSTOMER_FLAG = 'qichacha';
QichachaReport.CommonInfo = {
  host: qichachaConfig.host,
  port: tools.isNumber(qichachaConfig.port)?parseInt(qichachaConfig.port):80,
  uri: qichachaConfig.uri
}

QichachaReport.prototype.makeReportStruct = function(orderInfo, cancel=false) {
  let ReportStruct = {
    orderCode: orderInfo.ExternalId,
    code: `1`,
    type: `${orderInfo.Type}`,
    resultBalance: "",
    incomeStatement: "",
    financialRatiosOfChange: "",
    financialRatios: "",
    cancelReason: ""
  };

  if (cancel == true) {
    ReportStruct.code = `-1`;
    ReportStruct.cancelReason = orderInfo.Explain;
  }
  return ReportStruct;
}
QichachaReport.prototype.resultBalanceDefault = function() {
  return {
    Annual: "",
    ReportsType: "",
    ExplainedSpecially: "",
    MonetaryResources: "",
    ShortTermInvestments: "",
    NotesReceivable: "",
    AccountReceivable: "",
    PrePayment: "",
    DividendsReceivable: "",
    InterestReceivable: "",
    ReceivableOther: "",
    Inventory: "",
    RawMaterial: "",
    GoodsInProcess: "",
    MerchandiseInventory: "",
    RevolvingMaterials: "",
    OtherCurrentAssets: "",
    TotalCurrentAssets: "",
    LongTermBondInvestment: "",
    LongTermEquityInvestment: "",
    FixedAssets: "",
    AccumulatedDepreciation: "",
    NetValueOfFixedAssets: "",
    ConstructionInProcess: "",
    EngineeringMaterial: "",
    DisposalOfFixedAssets: "",
    CapitalizedBiologicalAssets: "",
    IntangibleAssets: "",
    DevelopmentExpenditure: "",
    LongTermUnamortizedExpenses: "",
    OtherNonCurrentAssets: "",
    TotalNonCurrentAssets: "",
    TotalAssets: "",
    ShortTermBorrowing: "",
    NotesPayable: "",
    AccountsPayable: "",
    UnearnedRevenue: "",
    EmployeePayable: "",
    TaxPayable: "",
    AccrualInterestPayable: "",
    ProfitPayable: "",
    OtherPayables: "",
    OtherCurrentLiability: "",
    TotalCurrentLiability: "",
    LongTermLoan: "",
    LongTermPayable: "",
    DeferredIncome: "",
    OtherNonCurrentLiability: "",
    TotalNonCurrentLiability: "",
    TotalLiabilities: "",
    PaidInCapital: "",
    CapitalReserve: "",
    EarnedSurplus: "",
    UndistributedProfit: "",
    TotalEquity: "",
    TotalLiabilitiesOwnersEquity: "",
    BriefTotalAssets: "",
    BriefTotalLiabilities: "",
    BriefGrossTradingIncome: "",
    BriefMainBusinessIncome: "",
    BriefTotalProfit: "",
    BriefNetProfit: "",
    BriefTotalTax: "",
    BriefTotalEquity: "",
  }
}
QichachaReport.prototype.incomeStatementDefault = function() {
  return {
    Annual: "",
    ReportsType: "",
    ExplainedSpecially: "",
    OperationRevenue: "",
    OperatingCosts: "",
    BusinessTariffAndAnnex: "",
    ConsumptionTax: "",
    BusinessTax: "",
    UrbanMaintenanceAndConstructionTax: "",
    ResourcesTax: "",
    LandValueIncrementTax: "",
    LandUse_House_VehVesl_StmpTax: "",
    EduSurtax_MineralRsrcCompFees_SwgChrg: "",
    SellingExpenses: "",
    CostOfGoodsMaintenance: "",
    AdRate_BusinessPropagandizeFee: "",
    AdministrationExpenseCost: "",
    OrganizationCosts: "",
    BusinessEntertainment: "",
    ResearchExpenditure: "",
    FinancialCost: "",
    InterestCost: "",
    IncomeFromInvestment: "",
    OperatingProfit: "",
    NonOperatingIncome: "",
    PublicSubsidy: "",
    NonBusinessExpenditure: "",
    LossOnBadDebts: "",
    UnrecoverableLossOnLongTermBondInvestment: "",
    UnrecoverableLossOnLongTermEquityInvestment: "",
    LossByForceMajeureFactors: "",
    TaxDelayCharge: "",
    TotalProfit: "",
    IncomeTaxExpense: "",
    NetProfit: "", 
  }
}
QichachaReport.prototype.financialRatiosOfChangeDefault = function() {
  return {
    annual: "",
    operationRevenue: "",//营业收入
    netProfit: "",//净利润
    totalAssets: "",//资产总计
    totalLiabilities: "",//负债合计
    totalOwnersEquity: "",//股东权益合计
    totalCurrentAssets: "",//流动资产合计
    totalCurrentLiability: "",//流动负债合计
    workingCapital: "",//营运资本
    fixedAssets: "",//固定资产
  }
}
QichachaReport.prototype.financialRatiosDefault = function() {
  return {
    annual: "",
    returnOnEquity: "",//净资产收益率
    returnOnAssets: "",//资产回报率
    grossProfitRate: "",//毛利率
    netSalesRate: "",//净利润率
    totalAssetsTurnover: "",//总资产周转次数
    currentAssetsTurnover: "",//流动资产周转次数
    accountsReceivableTurnover: "",//应收账款周转天数
    assetLiabilityRatio: "",//资产负债率
    currentRatio: "",//流动比率
    quickRatio: "",//速动比率
    revenueGrowthRate: "",//营业收入增长率   
    grossProfitGrowthRate: "",//毛利增长率
    growthRateOfTotalAssets: "",//总资产增长率
  }
}

QichachaReport.prototype.makeLargeNumberReport = function(orderInfo, statements) {
  let Report = this.makeReportStruct(orderInfo);

  resultBalance = [];
  for (let item of statements) {
    let b = this.resultBalanceDefault();
    if (tools.isNumber(item.Year)) 
      b.Annual = item.Year;
    if (tools.isNumber(item.ReportType))
      b.ReportsType = item.ReportType;

    let statement = item.Statement;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.TotalAssets))
      b.BriefTotalAssets = `${statement.Asset.TotalAssets}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TotalLiabilities))  
      b.BriefTotalLiabilities = `${statement.Liability.TotalLiabilities}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.OperationRevenue))
      b.BriefGrossTradingIncome = `${statement.Income.OperationRevenue}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.MainBusinessIncome))
      b.BriefMainBusinessIncome = `${statement.Income.MainBusinessIncome}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.TotalProfit))
      b.BriefTotalProfit = `${statement.Income.TotalProfit}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.NetProfit))
      b.BriefNetProfit = `${statement.Income.NetProfit}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.TotalTax))
      b.BriefTotalTax = `${statement.Income.TotalTax}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TotalEquity))  
      b.BriefTotalEquity = `${statement.Liability.TotalEquity}`; 
      
    resultBalance.push(b);
  }
  Report.resultBalance = resultBalance;
  return Report;
}

QichachaReport.prototype.makeFianacialDetailReport = function(orderInfo, statements) {
  let Report = this.makeReportStruct(orderInfo);

  Report.resultBalance = this.makeFianacialDetailResultBalance(orderInfo, statements);
  Report.incomeStatement = this.makeFianacialDetailIncomeStatement(orderInfo, statements);
  Report.financialRatiosOfChange = this.makeFianacialDetailFinancialRatiosOfChange(orderInfo, statements);
  Report.financialRatios = this.makeFianacialDetailFinancialRatios(orderInfo, statements);

  return Report;
}

QichachaReport.prototype.makeFianacialDetailResultBalance = function(orderInfo, statements) {
  resultBalance = [];
  for (let item of statements) {
    let b = this.resultBalanceDefault();
    if (tools.isNumber(item.Year)) 
      b.Annual = item.Year;
    if (tools.isNumber(item.ReportType))
      b.ReportsType = item.ReportType;

    let statement = item.Statement;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.MonetaryResources))
      b.MonetaryResources = `${statement.Asset.MonetaryResources}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.ShortTermInvestments))
      b.ShortTermInvestments = `${statement.Asset.ShortTermInvestments}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.NotesReceivable))
      b.NotesReceivable = `${statement.Asset.NotesReceivable}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.AccountReceivable))
      b.AccountReceivable = `${statement.Asset.AccountReceivable}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.PrePayment))
      b.PrePayment = `${statement.Asset.PrePayment}`;

    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.DividendsReceivable))
      b.DividendsReceivable = `${statement.Asset.DividendsReceivable}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.InterestReceivable))
      b.InterestReceivable = `${statement.Asset.InterestReceivable}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.ReceivableOther))
      b.ReceivableOther = `${statement.Asset.ReceivableOther}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.Inventory))
      b.Inventory = `${statement.Asset.Inventory}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.RawMaterial))
      b.RawMaterial = `${statement.Asset.RawMaterial}`;

    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.GoodsInProcess))
      b.GoodsInProcess = `${statement.Asset.GoodsInProcess}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.MerchandiseInventory))
      b.MerchandiseInventory = `${statement.Asset.MerchandiseInventory}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.RevolvingMaterials))
      b.RevolvingMaterials = `${statement.Asset.RevolvingMaterials}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.OtherCurrentAssets))
      b.OtherCurrentAssets = `${statement.Asset.OtherCurrentAssets}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.TotalCurrentAssets))
      b.TotalCurrentAssets = `${statement.Asset.TotalCurrentAssets}`;

    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.LongTermBondInvestment))
      b.LongTermBondInvestment = `${statement.Asset.LongTermBondInvestment}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.LongTermEquityInvestment))
      b.LongTermEquityInvestment = `${statement.Asset.LongTermEquityInvestment}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.FixedAssets))
      b.FixedAssets = `${statement.Asset.FixedAssets}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.AccumulatedDepreciation))
      b.AccumulatedDepreciation = `${statement.Asset.AccumulatedDepreciation}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.NetValueOfFixedAssets))
      b.NetValueOfFixedAssets = `${statement.Asset.NetValueOfFixedAssets}`;

    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.ConstructionInProcess))
      b.ConstructionInProcess = `${statement.Asset.ConstructionInProcess}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.EngineeringMaterial))
      b.EngineeringMaterial = `${statement.Asset.EngineeringMaterial}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.DisposalOfFixedAssets))
      b.DisposalOfFixedAssets = `${statement.Asset.DisposalOfFixedAssets}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.CapitalizedBiologicalAssets))
      b.CapitalizedBiologicalAssets = `${statement.Asset.CapitalizedBiologicalAssets}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.IntangibleAssets))
      b.IntangibleAssets = `${statement.Asset.IntangibleAssets}`;
    
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.DevelopmentExpenditure))
      b.DevelopmentExpenditure = `${statement.Asset.DevelopmentExpenditure}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.LongTermUnamortizedExpenses))
      b.LongTermUnamortizedExpenses = `${statement.Asset.LongTermUnamortizedExpenses}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.OtherNonCurrentAssets))
      b.OtherNonCurrentAssets = `${statement.Asset.OtherNonCurrentAssets}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.TotalNonCurrentAssets))
      b.TotalNonCurrentAssets = `${statement.Asset.TotalNonCurrentAssets}`;
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.TotalAssets))
      b.TotalAssets = `${statement.Asset.TotalAssets}`;

    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.ShortTermBorrowing))
      b.ShortTermBorrowing = `${statement.Liability.ShortTermBorrowing}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.NotesPayable))
      b.NotesPayable = `${statement.Liability.NotesPayable}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.AccountsPayable))
      b.AccountsPayable = `${statement.Liability.AccountsPayable}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.UnearnedRevenue))
      b.UnearnedRevenue = `${statement.Liability.UnearnedRevenue}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.EmployeePayable))
      b.EmployeePayable = `${statement.Liability.EmployeePayable}`;

    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TaxPayable))
      b.TaxPayable = `${statement.Liability.TaxPayable}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.AccrualInterestPayable))
      b.AccrualInterestPayable = `${statement.Liability.AccrualInterestPayable}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.ProfitPayable))
      b.ProfitPayable = `${statement.Liability.ProfitPayable}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.OtherPayables))
      b.OtherPayables = `${statement.Liability.OtherPayables}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.OtherCurrentLiability))
      b.OtherCurrentLiability = `${statement.Liability.OtherCurrentLiability}`;

    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TotalCurrentLiability))
      b.TotalCurrentLiability = `${statement.Liability.TotalCurrentLiability}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.LongTermLoan))
      b.LongTermLoan = `${statement.Liability.LongTermLoan}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.LongTermPayable))
      b.LongTermPayable = `${statement.Liability.LongTermPayable}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.DeferredIncome))
      b.DeferredIncome = `${statement.Liability.DeferredIncome}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.OtherNonCurrentLiability))
      b.OtherNonCurrentLiability = `${statement.Liability.OtherNonCurrentLiability}`;

    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TotalNonCurrentLiability))
      b.TotalNonCurrentLiability = `${statement.Liability.TotalNonCurrentLiability}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TotalLiabilities))
      b.TotalLiabilities = `${statement.Liability.TotalLiabilities}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.PaidInCapital))
      b.PaidInCapital = `${statement.Liability.PaidInCapital}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.CapitalReserve))
      b.CapitalReserve = `${statement.Liability.CapitalReserve}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.EarnedSurplus))
      b.EarnedSurplus = `${statement.Liability.EarnedSurplus}`;

    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.UndistributedProfit))
      b.UndistributedProfit = `${statement.Liability.UndistributedProfit}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TotalEquity))
      b.TotalEquity = `${statement.Liability.TotalEquity}`;
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TotalLiabilitiesOwnersEquity))
      b.TotalLiabilitiesOwnersEquity = `${statement.Liability.TotalLiabilitiesOwnersEquity}`;
      
    resultBalance.push(b);
  }
  return resultBalance; 
}
QichachaReport.prototype.makeFianacialDetailIncomeStatement = function(orderInfo, statements) {
  incomeStatement = [];
  for (let item of statements) {
    let b = this.incomeStatementDefault();
    if (tools.isNumber(item.Year)) 
      b.Annual = item.Year;
    if (tools.isNumber(item.ReportType))
      b.ReportsType = item.ReportType;

    let statement = item.Statement;

    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.OperationRevenue))
      b.OperationRevenue = `${statement.Income.OperationRevenue}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.OperatingCosts))
      b.OperatingCosts = `${statement.Income.OperatingCosts}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.BusinessTariffAndAnnex))
      b.BusinessTariffAndAnnex = `${statement.Income.BusinessTariffAndAnnex}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.ConsumptionTax))
      b.ConsumptionTax = `${statement.Income.ConsumptionTax}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.BusinessTax))
      b.BusinessTax = `${statement.Income.BusinessTax}`;

    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.UrbanMaintenanceAndConstructionTax))
      b.UrbanMaintenanceAndConstructionTax = `${statement.Income.UrbanMaintenanceAndConstructionTax}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.ResourcesTax))
      b.ResourcesTax = `${statement.Income.ResourcesTax}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.LandValueIncrementTax))
      b.LandValueIncrementTax = `${statement.Income.LandValueIncrementTax}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.LandUse_House_VehVesl_StmpTax))
      b.LandUse_House_VehVesl_StmpTax = `${statement.Income.LandUse_House_VehVesl_StmpTax}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.EduSurtax_MineralRsrcCompFees_SwgChrg))
      b.EduSurtax_MineralRsrcCompFees_SwgChrg = `${statement.Income.EduSurtax_MineralRsrcCompFees_SwgChrg}`;
      
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.SellingExpenses))
      b.SellingExpenses = `${statement.Income.SellingExpenses}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.CostOfGoodsMaintenance))
      b.CostOfGoodsMaintenance = `${statement.Income.CostOfGoodsMaintenance}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.AdRate_BusinessPropagandizeFee))
      b.AdRate_BusinessPropagandizeFee = `${statement.Income.AdRate_BusinessPropagandizeFee}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.AdministrationExpenseCost))
      b.AdministrationExpenseCost = `${statement.Income.AdministrationExpenseCost}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.OrganizationCosts))
      b.OrganizationCosts = `${statement.Income.OrganizationCosts}`;

    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.BusinessEntertainment))
      b.BusinessEntertainment = `${statement.Income.BusinessEntertainment}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.ResearchExpenditure))
      b.ResearchExpenditure = `${statement.Income.ResearchExpenditure}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.FinancialCost))
      b.FinancialCost = `${statement.Income.FinancialCost}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.InterestCost))
      b.InterestCost = `${statement.Income.InterestCost}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.IncomeFromInvestment))
      b.IncomeFromInvestment = `${statement.Income.IncomeFromInvestment}`;

    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.OperatingProfit))
      b.OperatingProfit = `${statement.Income.OperatingProfit}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.NonOperatingIncome))
      b.NonOperatingIncome = `${statement.Income.NonOperatingIncome}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.PublicSubsidy))
      b.PublicSubsidy = `${statement.Income.PublicSubsidy}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.NonBusinessExpenditure))
      b.NonBusinessExpenditure = `${statement.Income.NonBusinessExpenditure}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.LossOnBadDebts))
      b.LossOnBadDebts = `${statement.Income.LossOnBadDebts}`;

    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.UnrecoverableLossOnLongTermBondInvestment))
      b.UnrecoverableLossOnLongTermBondInvestment = `${statement.Income.UnrecoverableLossOnLongTermBondInvestment}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.UnrecoverableLossOnLongTermEquityInvestment))
      b.UnrecoverableLossOnLongTermEquityInvestment = `${statement.Income.UnrecoverableLossOnLongTermEquityInvestment}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.LossByForceMajeureFactors))
      b.LossByForceMajeureFactors = `${statement.Income.LossByForceMajeureFactors}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.TaxDelayCharge))
      b.TaxDelayCharge = `${statement.Income.TaxDelayCharge}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.TotalProfit))
      b.TotalProfit = `${statement.Income.TotalProfit}`;

    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.IncomeTaxExpense))
      b.IncomeTaxExpense = `${statement.Income.IncomeTaxExpense}`;
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.NetProfit))
      b.NetProfit = `${statement.Income.NetProfit}`;

    incomeStatement.push(b);
  }
  return incomeStatement; 
}
QichachaReport.prototype.makeFianacialDetailFinancialRatiosOfChange = function(orderInfo, statements) {
  financialRatiosOfChange = [];
  for (let item of statements) {
    let b = this.financialRatiosOfChangeDefault();
    if (tools.isNumber(item.Year)) 
      b.annual = `${item.Year}`;
  
    let statement = item.Statement;

    if (typeof statement.FinancialRatiosOfChange == 'object' && tools.isNumber(statement.FinancialRatiosOfChange.OperationRevenue))
      b.operationRevenue = `${statement.FinancialRatiosOfChange.OperationRevenue}`;
    if (typeof statement.FinancialRatiosOfChange == 'object' && tools.isNumber(statement.FinancialRatiosOfChange.NetProfit))
      b.NetProfit = `${statement.FinancialRatiosOfChange.NetProfit}`;
    if (typeof statement.FinancialRatiosOfChange == 'object' && tools.isNumber(statement.FinancialRatiosOfChange.TotalAssets))
      b.totalAssets = `${statement.FinancialRatiosOfChange.TotalAssets}`;
    if (typeof statement.FinancialRatiosOfChange == 'object' && tools.isNumber(statement.FinancialRatiosOfChange.TotalLiabilities))
      b.totalLiabilities = `${statement.FinancialRatiosOfChange.TotalLiabilities}`;
    if (typeof statement.FinancialRatiosOfChange == 'object' && tools.isNumber(statement.FinancialRatiosOfChange.TotalOwnersEquity))
      b.totalOwnersEquity = `${statement.FinancialRatiosOfChange.TotalOwnersEquity}`;
    if (typeof statement.FinancialRatiosOfChange == 'object' && tools.isNumber(statement.FinancialRatiosOfChange.TotalCurrentAssets))
      b.totalCurrentAssets = `${statement.FinancialRatiosOfChange.TotalCurrentAssets}`;
    if (typeof statement.FinancialRatiosOfChange == 'object' && tools.isNumber(statement.FinancialRatiosOfChange.TotalCurrentLiability))
      b.totalCurrentLiability = `${statement.FinancialRatiosOfChange.TotalCurrentLiability}`;
    if (typeof statement.FinancialRatiosOfChange == 'object' && tools.isNumber(statement.FinancialRatiosOfChange.WorkingCapital))
      b.workingCapital = `${statement.FinancialRatiosOfChange.WorkingCapital}`;
    if (typeof statement.FinancialRatiosOfChange == 'object' && tools.isNumber(statement.FinancialRatiosOfChange.FixedAssets))
      b.fixedAssets = `${statement.FinancialRatiosOfChange.FixedAssets}`;
    
    financialRatiosOfChange.push(b);
  }
  return financialRatiosOfChange; 
}
QichachaReport.prototype.makeFianacialDetailFinancialRatios = function(orderInfo, statements) {
  financialRatios = [];
  for (let item of statements) {
    let b = this.financialRatiosDefault();
    if (tools.isNumber(item.Year)) 
      b.annual = `${item.Year}`;
  
    let statement = item.Statement;

    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.ReturnOnEquity))
      b.returnOnEquity = `${statement.FinancialRatios.ReturnOnEquity}`;
    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.ReturnOnAssets))
      b.returnOnAssets = `${statement.FinancialRatios.ReturnOnAssets}`;    
    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.GrossProfitRate))
      b.grossProfitRate = `${statement.FinancialRatios.GrossProfitRate}`;      
    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.NetSalesRate))
      b.netSalesRate = `${statement.FinancialRatios.NetSalesRate}`;
    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.TotalAssetsTurnover))
      b.totalAssetsTurnover = `${statement.FinancialRatios.TotalAssetsTurnover}`;

    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.CurrentAssetsTurnover))
      b.currentAssetsTurnover = `${statement.FinancialRatios.CurrentAssetsTurnover}`;
    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.AccountsReceivableTurnover))
      b.accountsReceivableTurnover = `${statement.FinancialRatios.AccountsReceivableTurnover}`;
    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.AssetLiabilityRatio))
      b.assetLiabilityRatio = `${statement.FinancialRatios.AssetLiabilityRatio}`;      
    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.CurrentRatio))
      b.currentRatio = `${statement.FinancialRatios.CurrentRatio}`;    
    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.QuickRatio))
      b.quickRatio = `${statement.FinancialRatios.QuickRatio}`;

    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.RevenueGrowthRate))
      b.revenueGrowthRate = `${statement.FinancialRatios.RevenueGrowthRate}`;
    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.GrossProfitGrowthRate))
      b.grossProfitGrowthRate = `${statement.FinancialRatios.GrossProfitGrowthRate}`;
    if (typeof statement.FinancialRatios == 'object' && tools.isNumber(statement.FinancialRatios.GrowthRateOfTotalAssets))
      b.growthRateOfTotalAssets = `${statement.FinancialRatios.GrowthRateOfTotalAssets}`; 

    financialRatios.push(b);
  }
  return financialRatios; 
}
module.exports = QichachaReport;