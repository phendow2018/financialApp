const global = require('../../Common/Global');
const tools = require('../../Common/tools');
const CompanyStatement = require('../financial/CompanyStatement');

var makeRatioOfChange = function(CurrentNumber, BaseNumber) {
  if (tools.isNumber(CurrentNumber) && tools.isNumber(BaseNumber) && BaseNumber != 0) {
    return parseFloat(((100.0 * (CurrentNumber - BaseNumber)) / (Math.abs(BaseNumber))).toFixed(2));
  }
  return null;
}

class RatiosOfChange {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 获取指定报表的变化率数据 */
  async getRatiosOfChange(CompanyNumber, Year, Type) {
    let retData = {
      CompanyNumber: CompanyNumber,
      Year: Year,
      Type: Type
    };
    let c_s = new CompanyStatement();
    
    let CurrentData = await c_s.getMainData(CompanyNumber, Year, Type);
    if (CurrentData != null) {
      retData.CurrentData = CurrentData;
    }
    let BaseData = await c_s.getMainData(CompanyNumber, Year-1, Type);
    if (BaseData != null) {
      retData.BaseData = BaseData;
    }

    if (typeof retData.CurrentData == 'undefined' || typeof retData.BaseData == 'undefined') {
      return retData;
    }
    
    let FinancialRatiosOfChange = {};
    let OperationRevenue = makeRatioOfChange(CurrentData.OperationRevenue, BaseData.OperationRevenue);
    if (OperationRevenue != null) {
      FinancialRatiosOfChange.OperationRevenue = OperationRevenue;
    }
    let NetProfit = makeRatioOfChange(CurrentData.NetProfit, BaseData.NetProfit);
    if (NetProfit != null) {
      FinancialRatiosOfChange.NetProfit = NetProfit;
    }
    let TotalAssets = makeRatioOfChange(CurrentData.TotalAssets, BaseData.TotalAssets);
    if (TotalAssets != null) {
      FinancialRatiosOfChange.TotalAssets = TotalAssets;
    }
    let TotalLiabilities = makeRatioOfChange(CurrentData.TotalLiabilities, BaseData.TotalLiabilities);
    if (TotalLiabilities != null) {
      FinancialRatiosOfChange.TotalLiabilities = TotalLiabilities;
    }
    let TotalOwnersEquity = makeRatioOfChange(CurrentData.TotalOwnersEquity, BaseData.TotalOwnersEquity);
    if (TotalOwnersEquity != null) {
      FinancialRatiosOfChange.TotalOwnersEquity = TotalOwnersEquity;
    }
    let TotalCurrentAssets = makeRatioOfChange(CurrentData.TotalCurrentAssets, BaseData.TotalCurrentAssets);
    if (TotalCurrentAssets != null) {
      FinancialRatiosOfChange.TotalCurrentAssets = TotalCurrentAssets;
    }
    let TotalCurrentLiability = makeRatioOfChange(CurrentData.TotalCurrentLiability, BaseData.TotalCurrentLiability);
    if (TotalCurrentLiability != null) {
      FinancialRatiosOfChange.TotalCurrentLiability = TotalCurrentLiability;
    }
    let WorkingCapital = makeRatioOfChange(CurrentData.WorkingCapital, BaseData.WorkingCapital);
    if (WorkingCapital != null) {
      FinancialRatiosOfChange.WorkingCapital = WorkingCapital;
    }
    let FixedAssets = makeRatioOfChange(CurrentData.FixedAssets, BaseData.FixedAssets);
    if (FixedAssets != null) {
      FinancialRatiosOfChange.FixedAssets = FixedAssets;
    }
  
    retData.FinancialRatiosOfChange = FinancialRatiosOfChange;
    return retData;
  }
}

module.exports = RatiosOfChange;