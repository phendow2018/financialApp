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
    if (tools.isValidString(postData.Operator)) {
      let time = new Date();
      params.LastModifyUser = postData.Operator;
      params.LastModifyTime = time.format('yyyy-MM-dd HH:mm:ss');
    }
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
    if (tools.isValidString(postData.Operator)) {
      let time = new Date();
      params.LastModifyUser = postData.Operator;
      params.LastModifyTime = time.format('yyyy-MM-dd HH:mm:ss');
    }
    if (typeof postData.Description != 'undefined') {
      params.Description = postData.Description;
    }
    let sql = tools.getUpdateSql(params, where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    //如果修改内容中有CompanyNumber字段，单独进行修改操作
    // if (tools.isValidString(postData.CompanyNumber)) {
    //   let ret = await this.modifyCompanyNumber(CompanyNumber, postData.CompanyNumber);
    //   if(ret === false) {
    //     return false;
    //   } else {
    //     return {CompanyNumber: postData.CompanyNumber};
    //   }
    // }

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
    if (tools.isValidString(queryData.FuzzyCompanyNumber)) {
      let likeStr = `%${queryData.FuzzyCompanyNumber}%`;
      where += ` AND \`CompanyNumber\` LIKE ${tools.MysqlEscape(likeStr)}`;
    }
    if (tools.isValidString(queryData.FuzzyName)) {
      let likeStr = `%${queryData.FuzzyName}%`;
      where += ` AND \`Name\` LIKE ${tools.MysqlEscape(likeStr)}`;
    }
    if (tools.isValidString(queryData.FuzzyAbbr)) {
      let likeStr = `%${queryData.FuzzyAbbr.toUpperCase()}%`;
      where += ` AND \`Abbr\` LIKE ${tools.MysqlEscape(likeStr)}`;
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
      if(SortBy == "COMPANYNUMBER" || SortBy == "NAME" || SortBy == "LASTMODIFYTIME" || SortBy == "LASTMODIFYUSER") {
          sort = `ORDER BY ${SortBy} ${SortType}`;        
      } 
    } else {
      sort = `ORDER BY LASTMODIFYTIME DESC`;
    }

    let limit = '';
    if(tools.isNumber(queryData.Page) && tools.isNumber(queryData.PerPage) && parseInt(queryData.Page) >=1 && parseInt(queryData.PerPage) >= 1){
      let Page    = parseInt(queryData.Page) - 1;
      let PerPage = parseInt(queryData.PerPage);
      limit = `LIMIT ${Page*PerPage},${PerPage}`;         
    }

    let sql = `SELECT \`CompanyNumber\`, \`Name\`, \`Abbr\`, \`LastModifyUser\`, 
      DATE_FORMAT(LastModifyTime, '%Y-%m-%d %H:%i:%S') AS LastModifyTime, \`Description\` 
      FROM \`${TABLE_NAME}\` ${where} ${sort} ${limit}`;
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

  /** 修改企业编号 */
  // async modifyCompanyNumber(OldCompanyNumber, NewCompanyNumber) {
    //如果两个编号相同，不需要修改，直接返回true
    // if (OldCompanyNumber === NewCompanyNumber) {
    //   return true;
    // }

    // let checkExist = await this.checkNewCompanyNumberExist(OldCompanyNumber, NewCompanyNumber);
    // if (checkExist === true) {
    //   this.LastError = `企业社会统一信用代码[${NewCompanyNumber}]已存在`;;
    //   return false;
    // }

    // let where = {
    //   CompanyNumber: OldCompanyNumber,
    // }
    // let params = {
    //   CompanyNumber: NewCompanyNumber,
    // }
    // let sql = tools.getUpdateSql(params, where, TABLE_NAME);
    // let ret = await this.dbLink.query(sql);
    // if (ret === false) {
    //   this.LastError = this.dbLink.getLastError();
    //   return false;
    // }

    // let sqlStatement = tools.getUpdateSql(params, where, `company_statement`);
    // let retStatement = await this.dbLink.query(sqlStatement);
    // if (retStatement === false) {
    //   this.LastError = this.dbLink.getLastError();
    //   return false;
    // }
    // return {CompanyNumber: NewCompanyNumber}
  // }

  /** 修改企业最后操作人 */
  async modifyLastModifyUser(CompanyNumber, Operator) {
    if (!tools.isValidString(Operator)) {
      this.LastError = `无有效的Opeartor参数`;
      return false;
    }

    let checkExistRet = await this.checkExist(CompanyNumber);
    if (checkExistRet === false) {
      this.LastError = `社会统一信用代码为${CompanyNumber}的企业不存在`;
      return false;
    }

    let where = {
      CompanyNumber: CompanyNumber,
    }
    let time = new Date();
    let params = {
      LastModifyUser: Operator,
      LastModifyTime: time.format('yyyy-MM-dd HH:mm:ss')
    };

    let sql = tools.getUpdateSql(params, where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {CompanyNumber: CompanyNumber};
  }

  /** 修改企业说明信息 */
  async modifyCompanyExplain(CompanyNumber, Explain, Operator) {
    let checkExistRet = await this.checkExist(CompanyNumber);
    if (checkExistRet === false) {
      this.LastError = `社会统一信用代码为${CompanyNumber}的企业不存在`;
      return false;
    }

    let config = await this.getConfig();

    let where = {
      CompanyNumber: CompanyNumber,
    }
    let params = {};
    if (typeof Explain == 'string') {
      config.Explain = Explain;
      params.Config = JSON.stringify(config);
    };
    if (tools.isValidString(Operator)) {
      let time = new Date();
      params.LastModifyUser = Operator;
      params.LastModifyTime = time.format('yyyy-MM-dd HH:mm:ss');
    }
    
    let sql = tools.getUpdateSql(params, where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {CompanyNumber: CompanyNumber};
  }

  /** 查询企业说明信息 */
  async getCompanyExplain(CompanyNumber) {
    let checkExistRet = await this.checkExist(CompanyNumber);
    if (checkExistRet === false) {
      this.LastError = `社会统一信用代码为${CompanyNumber}的企业不存在`;
      return false;
    }

    let config = await this.getConfig(CompanyNumber);
    let Explain = '';
    if (tools.isValidString(config.Explain)) {
      Explain = config.Explain;
    }
    return {
      CompanyNumber: CompanyNumber,
      Explain: Explain
    };
  }
};

Company.prototype.checkNewCompanyNumberExist = async function(OldCompanyNumber, NewCompanyNumber) {
  let sql = `SELECT COUNT(1) AS COUNT FROM \`Company\` WHERE \`CompanyNumber\`<>${tools.MysqlEscape(OldCompanyNumber)} 
    AND \`CompanyNumber\`=${tools.MysqlEscape(NewCompanyNumber)}`;
  let ret = await this.dbLink.query(sql);
  if (ret === false || ret.length <= 0) {
    return false;
  }
  return ret[0].COUNT > 0;
}

Company.prototype.getConfig = async function(CompanyNumber) {
  let config = {};
  let sql = `SELECT Config FROM \`Company\` WHERE \`CompanyNumber\`=${tools.MysqlEscape(CompanyNumber)}`;
  let ret = await this.dbLink.query(sql);
  if (!(ret === false || ret.length <= 0)) {
    if (ret[0].Config == null) {
      config = {}
    } else {
      try {config = JSON.parse(ret[0].Config);} catch(e) {}
    }
  }
  return config;
}

var findByYear = function(Statements, year) {
  for (let t of Statements) {
    if (t.Year == year)
      return t;
  }
  return null;
}

module.exports = Company;