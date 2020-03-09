const global = require('../../Common/Global');
const tools = require('../../Common/tools');

class Ratio {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 获取指定报表的比率数据 */
  async getRatio(CompanyNumber, Year, Type) {
    let sql = `SELECT \`Statement\` FROM \`company_statement\` 
      WHERE \`CompanyNumber\`=${tools.MysqlEscape(CompanyNumber)} AND \`Year\`=${Year} 
      AND \`Type\`=${Type}`;
    let retQuery = await this.dbLink.query(sql);
    if (retQuery === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    let ret = {
      // ReturnOnEquity: 0,
      // ReturnOnAssets: 0,
      // GrossProfitRate: 0,
      // NetSalesRate: 0,
      // TotalAssetsTurnover: 0,
      // CurrentAssetsTurnover: 0,
      // AccountsReceivableTurnover: 0,
      // AssetLiabilityRatio: 0,
      // CurrentRatio: 0,
      // QuickRatio: 0,
      // RevenueGrowthRate: 0,
      // GrossProfitGrowthRate: 0,
      // GrowthRateOfTotalAssets: 0
    }
    if (retQuery.length <= 0) {
      return ret;
    }

    let statement = {};
    try{statement = JSON.parse(retQuery[0].Statement);} 
    catch(e) {return ret;}

    //净资产收益率(%)
    if (typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.NetProfit) &&
        typeof statement.Liability != 'undefined' && tools.isNumber(statement.Liability.TotalEquity) && 
        statement.Liability.TotalEquity != 0) {
      let ratio = 1.0 * statement.Income.NetProfit / statement.Liability.TotalEquity;
      ret.ReturnOnEquity = parseFloat((ratio * 100).toFixed(2));
    }
    //资产回报率(%)
    if (typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.NetProfit) &&
        typeof statement.Asset != 'undefined' && tools.isNumber(statement.Asset.TotalAssets) && 
        statement.Asset.TotalAssets != 0) {
      let ratio = 1.0 * statement.Income.NetProfit / statement.Asset.TotalAssets;
      ret.ReturnOnAssets = parseFloat((ratio * 100).toFixed(2));
    }
    //毛利率(%)
    if (typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.OperatingMargin) &&
        typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.OperationRevenue) && 
        statement.Income.OperationRevenue != 0) {
      let ratio = 1.0 * statement.Income.OperatingMargin / statement.Income.OperationRevenue;
      ret.GrossProfitRate = parseFloat((ratio * 100).toFixed(2));
    }
    //净利润率(%)
    if (typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.NetProfit) &&
        typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.OperationRevenue) && 
        statement.Income.OperationRevenue != 0) {
      let ratio = 1.0 * statement.Income.NetProfit / statement.Income.OperationRevenue;
      ret.NetSalesRate = parseFloat((ratio * 100).toFixed(2));
    }

    //总资产周转次数
    if (typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.OperationRevenue) &&
        typeof statement.Asset != 'undefined' && tools.isNumber(statement.Asset.TotalAssets) && 
        statement.Asset.TotalAssets != 0) {
      let ratio = 1.0 * statement.Income.OperationRevenue / statement.Asset.TotalAssets;
      ret.TotalAssetsTurnover = parseFloat(ratio.toFixed(2));
    }
    //流动资产周转次数
    if (typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.OperationRevenue) &&
        typeof statement.Asset != 'undefined' && tools.isNumber(statement.Asset.TotalCurrentAssets) && 
        statement.Asset.TotalCurrentAssets != 0) {
      let ratio = 1.0 * statement.Income.OperationRevenue / statement.Asset.TotalCurrentAssets;
      ret.CurrentAssetsTurnover = parseFloat(ratio.toFixed(2));
    }
    //应收账款周转天数
    if (typeof statement.Asset != 'undefined' && tools.isNumber(statement.Asset.AccountReceivable) &&
        typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.OperationRevenue) && 
        statement.Income.OperationRevenue != 0) {
      let ratio = 1.0 * statement.Asset.AccountReceivable * 360 / statement.Income.OperationRevenue;
      ret.AccountsReceivableTurnover = parseFloat(ratio.toFixed(2));
    }

    //资产负债率(%)
    if (typeof statement.Liability != 'undefined' && tools.isNumber(statement.Liability.TotalLiabilities) &&
        typeof statement.Asset != 'undefined' && tools.isNumber(statement.Asset.TotalAssets) && 
        statement.Asset.TotalAssets != 0) {
      let ratio = 1.0 * statement.Liability.TotalLiabilities / statement.Asset.TotalAssets;
      ret.AssetLiabilityRatio = parseFloat((ratio * 100).toFixed(2));
    }
    //流动比率
    if (typeof statement.Asset != 'undefined' && tools.isNumber(statement.Asset.TotalCurrentAssets) &&
        typeof statement.Liability != 'undefined' && tools.isNumber(statement.Liability.TotalCurrentLiability) && 
        statement.Liability.TotalCurrentLiability != 0) {
      let ratio = 1.0 * statement.Asset.TotalCurrentAssets / statement.Liability.TotalCurrentLiability;
      ret.CurrentRatio = parseFloat(ratio.toFixed(2));
    }
    //速动比率
    if (typeof statement.Asset != 'undefined' && tools.isNumber(statement.Asset.TotalCurrentAssets) &&
        typeof statement.Asset != 'undefined' && tools.isNumber(statement.Asset.Inventory) &&
        typeof statement.Liability != 'undefined' && tools.isNumber(statement.Liability.TotalCurrentLiability) && 
        statement.Liability.TotalCurrentLiability != 0) {
      let ratio = 1.0 * (statement.Asset.TotalCurrentAssets - statement.Asset.Inventory) / statement.Liability.TotalCurrentLiability;
      ret.QuickRatio = parseFloat(ratio.toFixed(2));
    }

    //以下项目需要和前一年数据做比较
    let sql2 = `SELECT \`Statement\` FROM \`company_statement\` 
      WHERE \`CompanyNumber\`=${tools.MysqlEscape(CompanyNumber)} AND \`Year\`=${parseInt(Year)-1} 
      AND \`Type\`=${Type}`;
    let retQuery2 = await this.dbLink.query(sql2);
    if (retQuery2 === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }
    let statement2 = {}
    if (retQuery2 !== false && retQuery2.length > 0) {
      try{statement2 = JSON.parse(retQuery2[0].Statement);}
      catch(e) {}
    }
    //营业收入增长率(%)
    if (typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.OperationRevenue) &&
        typeof statement2.Income != 'undefined' && tools.isNumber(statement2.Income.OperationRevenue) &&
        statement2.Income.OperationRevenue != 0) {
      let ratio = 1.0 * (statement.Income.OperationRevenue - statement2.Income.OperationRevenue) / statement2.Income.OperationRevenue;
      ret.RevenueGrowthRate = parseFloat((ratio * 100).toFixed(2));
    }
    //毛利增长率(%)
    if (typeof statement.Income != 'undefined' && tools.isNumber(statement.Income.OperatingMargin) &&
        typeof statement2.Income != 'undefined' && tools.isNumber(statement2.Income.OperatingMargin) &&
        statement2.Income.OperatingMargin != 0) {
      let ratio = 1.0 * (statement.Income.OperatingMargin - statement2.Income.OperatingMargin) / statement2.Income.OperatingMargin;
      ret.GrossProfitGrowthRate = parseFloat((ratio * 100).toFixed(2));
    }
    //总资产增长率(%)
    if (typeof statement.Asset != 'undefined' && tools.isNumber(statement.Asset.TotalAssets) &&
        typeof statement2.Asset != 'undefined' && tools.isNumber(statement2.Asset.TotalAssets) &&
        statement2.Asset.TotalAssets != 0) {
      let ratio = 1.0 * (statement.Asset.TotalAssets - statement2.Asset.TotalAssets) / statement2.Asset.TotalAssets;
      ret.GrowthRateOfTotalAssets = parseFloat((ratio * 100).toFixed(2));
    }

    return ret;
  }
}

module.exports = Ratio;