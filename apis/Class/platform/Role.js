const global = require('../../Common/Global');
const tools = require('../../Common/tools');

const TABLE_NAME = 'role';

class Role {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 检查Flag是否存在 */
  async checkExist(Id) {
    let sql = `SELECT COUNT(1) AS COUNT FROM \`${TABLE_NAME}\` WHERE \`Id\`=${tools.MysqlEscape(Id)}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false || ret.length <= 0) {
      return false;
    }
    if (ret[0].COUNT <= 0) {
      return false;
    }
    return true;
  }

  /** 创建角色 */
  async createRole(postData) {
    let id = tools.createUuid();
    let time = new Date();
    let params = {
      Id: id,
      Name: postData.Name,
      IsAdmin: 0,
      CreateUser: postData.CreateUser,
      CreateTime: time.format('yyyy-MM-dd HH:mm:ss.S'),
    };
    if (tools.isNumber(postData.IsAdmin)) {
      params.IsAdmin = postData.IsAdmin;
    }
    if (typeof postData.Description != 'undefined') {
      params.Description = postData.Description;
    }
    if (typeof postData.Rights == 'object') {
      params.Rights = JSON.stringify(postData.Rights);
    };

    let sql = tools.getInsertSql(params, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {Id: id};
  }

  /** 修改模块 */
  async modifyRole(Id, postData) {
    let checkExistRet = await this.checkExist(Id);
    if (checkExistRet === false) {
      this.LastError = `对应角色不存在`;
      return false;
    }

    let where = {
      Id: Id,
    }
    let params = {};
    if (tools.isValidString(postData.Name)) {
      params.Name = postData.Name;
    };
    if (tools.isNumber(postData.IsAdmin)) {
      params.IsAdmin = postData.IsAdmin;
    };
    if (typeof postData.Description != 'undefined') {
      params.Description = postData.Description;
    }
    if (typeof postData.Rights == 'object') {
      params.Rights = JSON.stringify(postData.Rights);
    };

    let sql = tools.getUpdateSql(params, where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {Id: Id};
  }

  /** 删除模块 */
  async deleteRole(Id) {
    let where = {
      Id: Id
    }
    let sql = tools.getDeleteSql(where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {Id: Id};
  }

  /** 查询模块 */
  async queryRole(queryData) {
    let where = `WHERE 1=1`;
    if (tools.isValidString(queryData.Id)) {
      where += ` AND \`Id\`=${tools.MysqlEscape(queryData.Id)}`;
    }
    if (tools.isValidString(queryData.Name)) {
      where += ` AND \`Name\`=${tools.MysqlEscape(queryData.Name)}`;
    }
    if (tools.isNumber(queryData.IsAdmin)) {
      where += ` AND \`IsAdmin\`=${tools.MysqlEscape(queryData.IsAdmin)}`;
    }
    if (tools.isValidString(queryData.FuzzyQuery)) {
      let likeStr = `%${queryData.FuzzyQuery}%`;
      where += ` AND (\`Name\` LIKE ${tools.MysqlEscape(likeStr)})`;
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
      if(SortBy == "NAME" || SortBy == "ISADMIN" || SortBy == "CREATEUSER" || SortBy == "CREATETIME") {
          sort = `ORDER BY ${SortBy} ${SortType}`;        
      } 
    }

    let limit = '';
    if(tools.isNumber(queryData.Page) && tools.isNumber(queryData.PerPage) && parseInt(queryData.Page) >=1 && parseInt(queryData.PerPage) >= 1){
      let Page    = parseInt(queryData.Page) - 1;
      let PerPage = parseInt(queryData.PerPage);
      limit = `LIMIT ${Page*PerPage},${PerPage}`;         
    }

    let sql = `SELECT \`Id\`, \`Name\`, \`IsAdmin\`, \`CreateUser\`, \`CreateTime\`, \`Description\`, \`Rights\` FROM \`${TABLE_NAME}\` ${where} ${sort} ${limit}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    for (let t of ret) {
      try{
        t.CreateTime = (new Date(t.CreateTime)).format('yyyy-MM-dd HH:mm:ss');
        t.Rights = JSON.parse(t.Rights);
      } catch(e) {
        continue;
      }
    }
    return {
      totalCount: count,
      data: ret
    };
  }
}

module.exports = Role;