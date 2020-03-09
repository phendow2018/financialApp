const global = require('../../Common/Global');
const tools = require('../../Common/tools');
const makePy = require('../../Common/makePy').makePy;
const Company = require('./Company');

const TABLE_NAME = 'company_statement';

class CompanyStatement {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 检查CompanyNumber是否存在 */
  async checkExist(CompanyNumber, Year, Type) {
    let sql = `SELECT COUNT(1) AS COUNT FROM \`${TABLE_NAME}\` WHERE \`CompanyNumber\`=${tools.MysqlEscape(CompanyNumber)}
      AND \`Year\`=${Year} AND \`Type\`=${Type}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false || ret.length <= 0) {
      return false;
    }
    if (ret[0].COUNT <= 0) {
      return false;
    }
    return true;
  }

  static isValidReportType(ReportType) {
    if (!tools.isNumber(ReportType))
      return false;
    if (ReportType == 1 || ReportType == 2) 
      return true;
    return false;
  }

  /** 创建企业报表 */
  async createStatement(postData) {
    let checkExistRet = await this.checkExist(postData.CompanyNumber, postData.Year, postData.Type);
    if (checkExistRet === true) {
      this.LastError = `报表已存在`;
      return false;
    }

    let params = {
      CompanyNumber: postData.CompanyNumber,
      Year: postData.Year,
      Type: postData.Type,
      ReportType: 1
    };
    if (CompanyStatement.isValidReportType(postData.ReportType)) {
      params.ReportType = postData.ReportType;
    }
    let statement = {}
    if (typeof postData.Statement != 'undefined') {
      statement = postData.Statement;
    }
    params.Statement = JSON.stringify(statement);

    let sql = tools.getInsertSql(params, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    if (tools.isValidString(postData.Operator)) {
      let deal = new Company();
      await deal.modifyLastModifyUser(postData.CompanyNumber, postData.Operator); 
    }

    return {
      CompanyNumber: postData.CompanyNumber,
      Year: postData.Year,
      Type: postData.Type
    };
  }

  /** 修改企业报表 */
  async modifyStatement(CompanyNumber, Year, Type, postData) {
    let checkExistRet = await this.checkExist(CompanyNumber, Year, Type);
    if (checkExistRet === false) {
      this.LastError = `指定企业报表不存在`;
      return false;
    }

    let where = {
      CompanyNumber: CompanyNumber,
      Year: Year,
      Type: Type
    }
    let params = {};
    if (CompanyStatement.isValidReportType(postData.ReportType)) {
      params.ReportType = postData.ReportType;
    }
    if (typeof postData.Statement != 'undefined') {
      params.Statement = JSON.stringify(postData.Statement);
    }
    let sql = tools.getUpdateSql(params, where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    if (tools.isValidString(postData.Operator)) {
      let deal = new Company();
      await deal.modifyLastModifyUser(CompanyNumber, postData.Operator); 
    }

    return {
      CompanyNumber: CompanyNumber,
      Year: Year,
      Type: Type
    };
  }

  /** 添加或修改一份报表 */
  async createOrModify(data) {
    let checkExistRet = await this.checkExist(data.CompanyNumber, data.Year, data.Type);
    if (checkExistRet === false) {
      let createData = {
        CompanyNumber: data.CompanyNumber,
        Year: data.Year,
        Type: data.Type,
        Operator: data.Operator,
        ReportType: data.ReportType,
        Statement: data.Statement
      }
      return await this.createStatement(createData);
    } else {
      let modifyData = {
        Operator: data.Operator,
        ReportType: data.ReportType,
        Statement: data.Statement
      }
      return await this.modifyStatement(data.CompanyNumber, data.Year, data.Type, modifyData);
    }
  }

  /** 删除企业报表 */
  async deleteStatement(CompanyNumber, Year, Type, postData) {
    let where = {
      CompanyNumber: CompanyNumber,
      Year: Year,
      Type: Type
    }
    let sql = tools.getDeleteSql(where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    if (tools.isValidString(postData.Operator)) {
      let deal = new Company();
      await deal.modifyLastModifyUser(CompanyNumber, postData.Operator); 
    }

    return {
      CompanyNumber: CompanyNumber,
      Year: Year,
      Type: Type
    };
  }

  /** 查询企业报表 */
  async queryStatement(queryData) {
    let where = `WHERE 1=1`;
    if (tools.isValidString(queryData.CompanyNumber)) {
      where += ` AND \`CompanyNumber\`=${tools.MysqlEscape(queryData.CompanyNumber)}`;
    }
    if (tools.isNumber(queryData.Year)) {
      where += ` AND \`Year\`=${queryData.Year}`;
    }
    if (tools.isNumber(queryData.Type)) {
      where += ` AND \`Type\`=${queryData.Type}`;
    }
    if (tools.isValidString(queryData.ReportingNeeds)) {
      let needs = CompanyStatement.NeedStringToArr(queryData.ReportingNeeds);
      if (needs !== false) {
        let orWhere = ``;
        for (let i = 0; i < needs.length; i++) {
          let n = needs[i];
          if (i == 0) {
            orWhere += `(\`Year\`=${tools.MysqlEscape(n.Year)} AND \`Type\`=${tools.MysqlEscape(n.Type)})`;
          } else {
            orWhere += ` OR (\`Year\`=${tools.MysqlEscape(n.Year)} AND \`Type\`=${tools.MysqlEscape(n.Type)})`
          }
        }
        where += ` AND (${orWhere})`;
      }
    }

    let sort = ` ORDER BY \`CompanyNumber\` ASC, \`Year\` DESC, \`Type\` DESC`;

    let sql = `SELECT \`CompanyNumber\`, \`Year\`, \`Type\`, \`ReportType\`, \`Statement\` FROM \`${TABLE_NAME}\` ${where} ${sort}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    for (let item of ret) {
      item.Statement = JSON.parse(item.Statement);
    }

    return {
      data: ret
    };
  }

  /** 获取企业报表的主要数据 */
  async getMainData(CompanyNumber, Year, Type) {
    let sql = `SELECT \`Statement\` FROM \`company_statement\` 
      WHERE \`CompanyNumber\`=${tools.MysqlEscape(CompanyNumber)} AND \`Year\`=${Year} 
      AND \`Type\`=${Type}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false || ret.length <= 0) {
      return null;
    }
    let statement = {};
    try{statement = JSON.parse(ret[0].Statement);} 
    catch(e) {return null;}

    let MainData = {
      OperationRevenue: null,
      NetProfit: null,
      TotalAssets: null,
      TotalLiabilities: null,
      TotalOwnersEquity: null,
      TotalCurrentAssets: null,
      TotalCurrentLiability: null,
      WorkingCapital: null,
      FixedAssets: null
    };
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.OperationRevenue)) {
      MainData.OperationRevenue = statement.Income.OperationRevenue;
    }
    if (typeof statement.Income == 'object' && tools.isNumber(statement.Income.NetProfit)) {
      MainData.NetProfit = statement.Income.NetProfit;
    }
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.TotalAssets)) {
      MainData.TotalAssets = statement.Asset.TotalAssets;
    }
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TotalLiabilities)) {
      MainData.TotalLiabilities = statement.Liability.TotalLiabilities;
    }
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TotalEquity)) {
      MainData.TotalOwnersEquity = statement.Liability.TotalEquity;
    }
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.TotalCurrentAssets)) {
      MainData.TotalCurrentAssets = statement.Asset.TotalCurrentAssets;
    }
    if (typeof statement.Liability == 'object' && tools.isNumber(statement.Liability.TotalCurrentLiability)) {
      MainData.TotalCurrentLiability = statement.Liability.TotalCurrentLiability;
    }
    if (tools.isNumber(MainData.TotalCurrentAssets) && tools.isNumber(MainData.TotalCurrentLiability)) {
      MainData.WorkingCapital = MainData.TotalCurrentAssets - MainData.TotalCurrentLiability;
    }
    if (typeof statement.Asset == 'object' && tools.isNumber(statement.Asset.FixedAssets)) {
      MainData.FixedAssets = statement.Asset.FixedAssets;
    }
    return MainData;
  }
};

CompanyStatement.NeedStringToArr = function(needStr) {
  try {
    let arr = needStr.split(',');
    if (!tools.isArray(arr)) 
      return false;

    let needs = []
    for (let item of arr) {
      let arr2 = item.split('_');
      if (arr2.length < 2)
        continue;

      if (!tools.isNumber(arr2[0]) || !tools.isNumber(arr2[1]))
        continue; 

      let n = {
        Year: parseInt(arr2[0]),
        Type: parseInt(arr2[1])
      };
      needs.push(n);
    }

    if (needs.length <= 0) {
      return false;
    }
    return needs;
  } catch(e) {
    return false;
  }
}

module.exports = CompanyStatement;