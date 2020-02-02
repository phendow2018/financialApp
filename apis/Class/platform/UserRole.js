const global = require('../../Common/Global');
const tools = require('../../Common/tools');
const User = require('./User');
const Role = require('./Role'); 

const TABLE_NAME = 'user_role';

class UserRole {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 通过用户关联用户角色 */
  async relateByUser(UserAccount, RoleIds) {
    let userDeal = new User();
    let checkUserExist = await userDeal.checkExist(UserAccount);
    if (checkUserExist === false) {
      this.LastError = '指定的用户账户不存在';
      return false;
    }

    let roleDeal = new Role();
    for (let role of RoleIds) {
      if (!tools.isValidString(role.RoleId)) {
        this.LastError = '存在无效的RoleId';
        return false;
      }
      let checkRoleExist = await roleDeal.checkExist(role.RoleId);
      if(checkRoleExist === false) {
        this.LastError = `需要绑定的RoleId不存在，RoleId=${role.RoleId}`;
        return false;
      }
    }
    
    //删除原有关联
    let ret = await this.deleteUserRole(UserAccount, '');
    if (ret === false) {
      return false;
    }
    //重新建立关联
    for (let role of RoleIds) {
      let retRelate = await this.createUserRole(UserAccount, role.RoleId);
      if (retRelate === false) {
        return false;
      }
    }

    return {UserAccount: UserAccount};
  }

  /** 通过角色关联用户 */
  async relateByRole(RoleId, UserAccounts) {
    let roleDeal = new Role();
    let checkRoleExist = await roleDeal.checkExist(RoleId);
    if (checkRoleExist === false) {
      this.LastError = '指定的角色不存在';
      return false;
    }

    let userDeal = new User();
    for (let user of UserAccounts) {
      if (!tools.isValidString(user.UserAccount)) {
        this.LastError = '存在无效的UserAccount';
        return false;
      }
      let checkUserExist = await userDeal.checkExist(user.UserAccount);
      if(checkUserExist === false) {
        this.LastError = `需要绑定的UserAccount不存在，UserAccount=${user.UserAccount}`;
        return false;
      }
    }

    //删除原有关联
    let ret = await this.deleteUserRole("", RoleId);
    if (ret === false) {
      return false;
    }
    //重新建立关联
    for (let user of UserAccounts) {
      let retRelate = await this.createUserRole(user.UserAccount, RoleId);
      if (retRelate === false) {
        return false;
      }
    }

    return {RoleId: RoleId};
  }

  /** 查询角色关联用户 */
  async queryUsersByRole(RoleId) {
    let sql = `SELECT user.Account, user.Name, user.Level, user.Sex, user.Email, user.Description 
      FROM user_role LEFT JOIN user ON(user.Account=user_role.UserAccount) 
      WHERE user_role.RoleId=${tools.MysqlEscape(RoleId)}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {data: ret};
  }

  /** 查询用户关联角色 */
  async queryRoleByUser(UserAccount) {
    let sql = `SELECT role.Id, role.Name, role.IsAdmin
      FROM user_role LEFT JOIN role ON(role.Id=user_role.RoleId) 
      WHERE user_role.UserAccount=${tools.MysqlEscape(UserAccount)}`
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {data: ret};
  }

  /** 创建用户角色关联 */
  async createUserRole(UserAccount, RoleId) {
    let params = {
      UserAccount: UserAccount,
      RoleId: RoleId,
    };
  
    let sql = tools.getInsertSql(params, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {
      UserAccount: UserAccount, 
      RoleId: RoleId
    };
  }

  /** 删除用户角色关联 */
  async deleteUserRole(UserAccount, RoleId) {
    let where = {}
    if (tools.isValidString(UserAccount)) {
      where.UserAccount = UserAccount;
    }
    if (tools.isValidString(RoleId)) {
      where.RoleId = RoleId;
    }
    let sql = tools.getDeleteSql(where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {
      UserAccount: UserAccount, 
      RoleId: RoleId
    };
  }
}

module.exports = UserRole;