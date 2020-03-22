const global = require('../../Common/Global');
const tools = require('../../Common/tools');

const Company = require('../../Class/financial/Company');
const CompanyStatement = require('../../Class/financial/CompanyStatement');

class CompanyNumber {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  async modifyCompanyNumber(CompanyNumber, NewCompanyNumber, Operator) {
    if (CompanyNumber == NewCompanyNumber) {//无需做修改
      return {CompanyNumber: CompanyNumber};
    }

    let company = new Company();
    let companyStatement = new CompanyStatement();

    let checkOld = await company.checkExist(CompanyNumber)
    if (!checkOld) {
      this.LastError = `企业社会统一信用代码[${CompanyNumber}]的企业不存在`;
      return false;
    }

    let checkNew = await company.checkNewCompanyNumberExist(CompanyNumber, NewCompanyNumber);
    if (checkNew) {
      this.LastError = `企业社会统一信用代码[${NewCompanyNumber}]已存在`;
      return false;
    }

    let sql = `SELECT * FROM \`company\` WHERE \`CompanyNumber\`=${tools.MysqlEscape(CompanyNumber)}`
    let ret = await this.dbLink.query(sql);
    if (tools.isArray(ret) && ret.length > 0) {
      let baseData = ret[0];
      let sqlStatement = `SELECT * FROM \`company_statement\` WHERE \`CompanyNumber\`=${tools.MysqlEscape(CompanyNumber)}`;
      let retStatement = await this.dbLink.query(sqlStatement);
      let baseStatement = [];
      if (tools.isArray(retStatement)) {
        baseStatement = retStatement;
      }

      //删除老数据
      let delRet = await company.deleteCompany(CompanyNumber);
      if (delRet === false) {
        this.LastError = company.getLastError();
        return false;
      }
      //构造sql 企业数据
      baseData.CompanyNumber = NewCompanyNumber;
      if (tools.isValidString(Operator)) {
        baseData.LastModifyTime = (new Date()).format('yyyy-MM-dd HH:mm:ss');
        baseData.LastModifyUser = Operator;
      }
      let sql1 = tools.getInsertSql(baseData, 'company') + ';';
      let retInsert = await this.dbLink.query(sql1);
      if (retInsert === false) {
        this.LastError = this.dbLink.getLastError();
        return false;
      }
      //报表数据
      for (let t of baseStatement) {
        t.CompanyNumber = NewCompanyNumber;
        let sql2 = tools.getInsertSql(t, 'company_statement') + ';';
        let retInsertS = await this.dbLink.query(sql2);
        if (retInsertS === false) {
          this.LastError = this.dbLink.getLastError();
          return false;
        }
      }
    }

    return {CompanyNumber: NewCompanyNumber};
  }
}

module.exports = CompanyNumber;