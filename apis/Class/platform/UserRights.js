const global = require('../../Common/Global');
const tools = require('../../Common/tools');

class UserRights {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 检查Account是否存在 */
  async getRoles(Account) {
    let sql = `SELECT role.Id, role.Name, role.IsAdmin, role.Rights FROM user_role 
      LEFT JOIN role ON (role.Id=user_role.RoleId) 
      WHERE user_role.UserAccount=${tools.MysqlEscape(Account)}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    } 

    for (let t of ret) {
      try{t.Rights = JSON.parse(t.Rights);}
      catch(e) {continue;}
    }

    let isSuperUser = await this.isSuperUser(Account);
    if (isSuperUser) {
      let superRole = await this.getSuperRole();
      ret.push(superRole);
    }

    return ret;
  }
}

UserRights.prototype.isSuperUser = async function(Account) {
  let sql = `SELECT COUNT(1) AS COUNT FROM \`user\` WHERE Level=0 AND Account=${tools.MysqlEscape(Account)}`;
  let ret = await this.dbLink.query(sql);
  if (ret === false || ret.length <= 0 || !tools.isNumber(ret[0].COUNT)) {
    return false;
  }
  return (ret[0].COUNT >= 1) ? true : false;
}

/** 获取超级管理员权限 */
UserRights.prototype.getSuperRole = async function() {
  let superRole = {
    Id: "00000000-0000-0000-0000-000000000000",
    Name: "超级管理员角色",
    IsAdmin: 1,
    Rights: [],
  }

  let sql = `SELECT * FROM module ORDER BY Sort`;
  let ret = await this.dbLink.query(sql);
  if (ret === false || ret.length <= 0) {
    return superRole;
  }
  for (let t of ret) {
    let functions = [];
    try{functions = JSON.parse(t.Functions);} catch(e){}
    let right = {
      Flag: t.Flag,
      Functions: functions,
    }
    superRole.Rights.push(right);
  }
  return superRole;
}

module.exports = UserRights;