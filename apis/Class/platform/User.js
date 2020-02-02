const global = require('../../Common/Global');
const tools = require('../../Common/tools');

const TABLE_NAME = 'user';

class User {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 检查Account是否存在 */
  async checkExist(Account) {
    let sql = `SELECT COUNT(1) AS COUNT FROM \`${TABLE_NAME}\` WHERE \`Account\`=${tools.MysqlEscape(Account)}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false || ret.length <= 0) {
      return false;
    }
    if (ret[0].COUNT <= 0) {
      return false;
    }
    return true;
  }

  async queryUser(queryData) {
    let where = `WHERE 1=1`;
    if (tools.isValidString(queryData.Account)) {
      where += ` AND \`Account\`=${tools.MysqlEscape(queryData.Account)}`;
    }
    if (tools.isValidString(queryData.Name)) {
      where += ` AND \`Name\`=${tools.MysqlEscape(queryData.Name)}`;
    }
    if (tools.isNumber(queryData.Level)) {
      where += ` AND \`Level\`=${parseInt(queryData.Level)}`;
    }
    if (tools.isNumber(queryData.Sex)) {
      where += ` AND \`Sex\`=${parseInt(queryData.Sex)}`;
    }

    let sql = `SELECT \`Account\`, \`Name\`, \`Password\`, \`Level\`, \`Sex\`, \`Email\`, \`Description\` FROM ${TABLE_NAME} ${where}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }
    return {data: ret};
  }
}

module.exports = User;