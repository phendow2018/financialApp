const global = require('../../Common/Global');
const tools = require('../../Common/tools');
const makePy = require('../../Common/makePy').makePy;

const TABLE_NAME = 'Company';

class Company {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 检查CompanyNumber是否存在 */
  async checkExist(CompanyNumber) {
    let sql = `SELECT COUNT(1) AS COUNT FROM \`${TABLE_NAME}\` WHERE \`CompanyNumber\`=${tools.MysqlEscape(CompanyNumber)}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false || ret.length <= 0) {
      return false;
    }
    if (ret[0].COUNT <= 0) {
      return false;
    }
    return true;
  }

  /** 创建企业 */
  async createCompany(postData) {
    let checkExistRet = await this.checkExist(postData.CompanyNumber);
    if (checkExistRet === true) {
      this.LastError = `企业社会统一信用代码[${postData.CompanyNumber}]已存在`;
      return false;
    }

    let params = {
      CompanyNumber: postData.CompanyNumber,
      Name: postData.Name,
      Abbr: makePy(postData.Name),
    };
    if (tools.isValidString(postData.Description)) {
      params.Description = postData.Description;
    };
    let sql = tools.getInsertSql(params, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {CompanyNumber: postData.CompanyNumber};
  }

  /** 修改企业 */
  async modifyCompany(CompanyNumber, postData) {
    let checkExistRet = await this.checkExist(CompanyNumber);
    if (checkExistRet === false) {
      this.LastError = `社会统一信用代码为${CompanyNumber}的企业不存在`;
      return false;
    }

    let where = {
      CompanyNumber: CompanyNumber,
    }
    let params = {};
    if (tools.isValidString(postData.Name)) {
      params.Name = postData.Name;
      params.Abbr = makePy(postData.Name);
    };
    if (typeof postData.Description != 'undefined') {
      params.Description = postData.Description;
    }
    let sql = tools.getUpdateSql(params, where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {CompanyNumber: CompanyNumber};
  }

  /** 删除企业 */
  async deleteCompany(CompanyNumber) {
    let where = {
      CompanyNumber: CompanyNumber
    }
    let sql = tools.getDeleteSql(where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {CompanyNumber: CompanyNumber};
  }

  /** 查询企业 */
  async queryCompany(queryData) {
    let where = `WHERE 1=1`;
    if (tools.isValidString(queryData.CompanyNumber)) {
      where += ` AND \`CompanyNumber\`=${tools.MysqlEscape(queryData.CompanyNumber)}`;
    }
    if (tools.isValidString(queryData.Name)) {
      where += ` AND \`Name\`=${tools.MysqlEscape(queryData.Name)}`;
    }
    if (tools.isValidString(queryData.FuzzyQuery)) {
      let likeStr = `%${queryData.FuzzyQuery}%`;
      where += ` AND (\`CompanyNumber\` LIKE ${tools.MysqlEscape(likeStr)}
        OR \`Name\` LIKE ${tools.MysqlEscape(likeStr)} 
        OR \`Abbr\` LIKE ${tools.MysqlEscape(likeStr)})`;
    }

    let count = 0;
    let sqlCount = `SELECT COUNT(1) AS COUNT FROM \`${TABLE_NAME}\` ${where}`;
    let retCount = await this.dbLink.query(sqlCount);
    if (!(retCount === false || retCount.length <= 0)) {
      count = retCount[0].COUNT;
    }

    let sort = ``;
    let SortType = `ASC`;
    if(tools.isValidString(queryData.SortBy)) {
      let SortBy = queryData.SortBy.toUpperCase(); 
      if(tools.isValidString(queryData.SortType)) {
        let tempSortType = queryData.SortType.toUpperCase(); 
        if(tempSortType == "DESC" || tempSortType == "ASC")
          SortType = tempSortType; 
      } 
      if(SortBy == "COMPANYNUMBER" || SortBy == "NAME") {
          sort = `ORDER BY ${SortBy} ${SortType}`;        
      } 
    }

    let limit = '';
    if(tools.isNumber(queryData.Page) && tools.isNumber(queryData.PerPage) && parseInt(queryData.Page) >=1 && parseInt(queryData.PerPage) >= 1){
      let Page    = parseInt(queryData.Page) - 1;
      let PerPage = parseInt(queryData.PerPage);
      limit = `LIMIT ${Page*PerPage},${PerPage}`;         
    }

    let sql = `SELECT \`CompanyNumber\`, \`Name\`, \`Abbr\`, \`Description\` FROM \`${TABLE_NAME}\` ${where} ${sort} ${limit}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {
      totalCount: count,
      data: ret
    };
  }

  /** 查询企业，联查报表基础信息 */
  async queryCompanyDeatil(queryData) {
    let ret = await this.queryCompany(queryData);
    if (ret === false) {
      return false;
    }

    if (!tools.isArray(ret.data)) {
      this.LastError = `查询结果返回值不为数组`;
      return false;
    }

    for (let t of ret.data) {
      let sql = `SELECT \`Year\`, \`Type\` FROM \`company_statement\` 
        WHERE \`CompanyNumber\`=${tools.MysqlEscape(t.CompanyNumber)}
        ORDER BY \`Year\` DESC, Type`;
      let retStatement = await this.dbLink.query(sql);
      if (retStatement === false) {
        this.LastError = this.dbLink.getLastError();
        return false;
      }

      t.Statements = [];
      for (let r of retStatement) {
        let statement = findByYear(t.Statements, r.Year)
        if (statement === null) {
          t.Statements.push({
            Year: r.Year,
            Reports: [r.Type]
          })
        } else {
          statement.Reports.push(r.Type);
        }
      }
      // t.Statements = retStatement;
    }
    return ret;
  }
};

var findByYear = function(Statements, year) {
  for (let t of Statements) {
    if (t.Year == year)
      return t;
  }
  return null;
}

module.exports = Company;