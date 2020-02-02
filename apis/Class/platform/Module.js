const global = require('../../Common/Global');
const tools = require('../../Common/tools');

const TABLE_NAME = 'module';

class Module {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 检查Flag是否存在 */
  async checkExist(Flag) {
    let sql = `SELECT COUNT(1) AS COUNT FROM \`${TABLE_NAME}\` WHERE \`Flag\`=${tools.MysqlEscape(Flag)}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false || ret.length <= 0) {
      return false;
    }
    if (ret[0].COUNT <= 0) {
      return false;
    }
    return true;
  }

  /** 创建模块 */
  async createModule(postData) {
    let checkExistRet = await this.checkExist(postData.Flag);
    if (checkExistRet === true) {
      this.LastError = `模块标识[${postData.Flag}]已存在`;
      return false;
    }

    let params = {
      Flag: postData.Flag,
      Name: postData.Name,
    };
    if (typeof postData.Functions == 'object') {
      params.Functions = JSON.stringify(postData.Functions);
    };
    if (tools.isNumber(postData.Sort)) {
      params.Sort = postData.Sort;
    }
    let sql = tools.getInsertSql(params, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {Flag: postData.Flag};
  }

  /** 修改模块 */
  async modifyModule(Flag, postData) {
    let checkExistRet = await this.checkExist(Flag);
    if (checkExistRet === false) {
      this.LastError = `模块标识为[${Flag}]的模块不存在`;
      return false;
    }

    let where = {
      Flag: Flag,
    }
    let params = {};
    if (tools.isValidString(postData.Name)) {
      params.Name = postData.Name;
    };
    if (typeof postData.Functions == 'object') {
      params.Functions = JSON.stringify(postData.Functions);
    }
    if (tools.isNumber(postData.Sort)) {
      params.Sort = postData.Sort;
    }
    let sql = tools.getUpdateSql(params, where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {Flag: Flag};
  }

  /** 删除模块 */
  async deleteModule(Flag) {
    let where = {
      Flag: Flag
    }
    let sql = tools.getDeleteSql(where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {Flag: Flag};
  }

  /** 查询模块 */
  async queryModule(queryData) {
    let where = `WHERE 1=1`;
    if (tools.isValidString(queryData.Flag)) {
      where += ` AND \`Flag\`=${tools.MysqlEscape(queryData.Flag)}`;
    }

    let sort = ` ORDER BY \`Sort\``
    let sql = `SELECT \`Flag\`, \`Name\`, \`Functions\` FROM \`${TABLE_NAME}\` ${where} ${sort}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    for (let t of ret) {
      if (typeof t.Functions == 'object') {
        try{t.Functions = JSON.parse(t.Functions);}
        catch(e) {continue;}
      }
    }
    return {
      data: ret
    };
  }
}

module.exports = Module;