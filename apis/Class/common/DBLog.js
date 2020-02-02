const global = require('../../Common/Global');
const tools = require('../../Common/tools');

class DBLog {
  constructor() {
    this.dbLink = global.database;
    this.LastError = ``;
  }
  getLastError() {
    return this.LastError;
  }

  async writeLog(user='', position='', module='', content='') { 
    let id = tools.createUuid();
    let time = new Date();
    let userName = await this.getUserName(user);
    let sql = this.makeInsertSql(id, time, user, userName, position, module, content);
    if (!tools.isValidString(sql)) { 
      this.LastError = `无效的sql语句`;
      return false;
    }

    let ret = await this.dbLink.query(sql);
    let logContent = `[User:${user} Position:${position} Module:${module}] => ${content}`;
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      global.log.writeLog(`写入数据库日志失败，内容信息{${logContent}}`);
      return false;
    } else {
      // global.log.writeLog(logContent);
    }

    return {Id: id};
  }

  async searchLog(queryParams) {
    let sqls = this.makeSearchSql(queryParams);
    let ret = {};
    if (tools.isValidString(sqls.sqlQueryCount)) {
      let retCount = await this.dbLink.query(sqls.sqlQueryCount);
      if (retCount === false) {
        this.LastError = this.dbLink.getLastError();
        return false;
      }
      if (tools.isArray(retCount) && tools.isNumber(retCount[0].COUNT)) {
        ret.totalCount = retCount[0].COUNT;
      }
    }
    
    if (tools.isValidString(sqls.sqlQueryData)) {
      let retData = await this.dbLink.query(sqls.sqlQueryData);
      if (retData === false) {
        this.LastError = this.dbLink.getLastError();
        return false;
      }
      ret.data = retData;
    }
    return ret;
  }
}

DBLog.prototype.getUserName = async function(account) {
  let sql = `SELECT \`Name\` FROM \`user\` WHERE \`Account\`=${tools.MysqlEscape(account)}`;
  let ret = await this.dbLink.query(sql);
  if (ret === false || ret.length <= 0) {
    return "";
  }
  return ret[0].Name;
}

DBLog.prototype.makeInsertSql = function(id, time, user='', userName='', position='', module='', content='') {
  if (!tools.isValidString(user)) {
    user = '';
  }
  if (!tools.isValidString(userName)) {
    userName = '';
  }
  if (!tools.isValidString(position)) {
    position = '';
  }
  if (!tools.isValidString(module)) {
    module = '';
  }
  if (!tools.isValidString(content)) {
    content = '';
  }
  let sql = '';
  if (global.database.dbConfig.Type.toLocaleUpperCase() == 'MYSQL') {
    let fields = `\`Id\`, \`Time\`, \`User\`, \`UserName\`, \`Position\`, \`Module\`, \`Content\``;
    let values = `${tools.MysqlEscape(id)}, ${tools.MysqlEscape(time.format('yyyy-MM-dd HH:mm:ss.S'))}`;
    values += `,${tools.MysqlEscape(user)}, ${tools.MysqlEscape(userName)}, ${tools.MysqlEscape(position)}, ${tools.MysqlEscape(module)}, ${tools.MysqlEscape(content)}`;
    sql = `INSERT INTO \`log\`(${fields}) VALUES(${values})`;
  }
  return sql;
}

DBLog.prototype.makeSearchSql = function(queryParams) { 
  let sqlQueryData = '';
  let sqlQueryCount = '';
  if (global.database.dbConfig.Type.toLocaleUpperCase() == 'MYSQL') {
    let where = ` WHERE 1=1`;
    if (tools.isValidString(queryParams.Id)) {
      where += ` AND \`Id\`=${tools.MysqlEscape(queryParams.Id)}`;
    }
    if (tools.isDate(queryParams.StartTime) || tools.isDateTime(queryParams.StartTime)) {
      where += ` AND \`Time\`>=${tools.MysqlEscape(queryParams.StartTime)}`;
    }
    if (tools.isDate(queryParams.EndTime) || tools.isDateTime(queryParams.EndTime)) {
      where += ` AND \`Time\`<=${tools.MysqlEscape(queryParams.EndTime)}`;
    }
    if (tools.isValidString(queryParams.User)) {
      where += ` AND \`User\`=${tools.MysqlEscape(queryParams.User)}`;
    }
    if (tools.isValidString(queryParams.UserName)) {
      where += ` AND \`User\`=${tools.MysqlEscape(queryParams.UserName)}`;
    }
    if (tools.isValidString(queryParams.Position)) {
      where += ` AND \`Position\`=${tools.MysqlEscape(queryParams.Position)}`;
    }
    if (tools.isValidString(queryParams.Module)) {
      where += ` AND \`Module\`=${tools.MysqlEscape(queryParams.Module)}`;
    }
    if (tools.isValidString(queryParams.FuzzyQuery)) {
      let likeString = tools.MysqlEscape(`%${queryParams.FuzzyQuery}%`);
      where += ` AND (\`User\` LIKE ${likeString} OR \`UserName\` LIKE ${likeString} OR \`Position\` LIKE ${likeString} OR \`Module\` LIKE ${likeString} OR \`Content\` LIKE ${likeString})`;
    }

    sqlQueryCount = `SELECT COUNT(1) AS COUNT FROM \`log\` ${where}`;
    let limit = ``
    if(tools.isNumber(queryParams.Page) && tools.isNumber(queryParams.PerPage) && parseInt(queryParams.Page) >=1 && parseInt(queryParams.PerPage) >= 1){
      let Page    = parseInt(queryParams.Page) - 1;
      let PerPage = parseInt(queryParams.PerPage);
      limit = ` LIMIT ${Page*PerPage},${PerPage}`;         
    }

    let sort = ` ORDER BY Time DESC`;
    if(typeof queryParams.SortBy == 'string' && queryParams.SortBy.trim().length > 0){
      let SortBy = queryParams.SortBy.trim(); 
      let  SORTBY = SortBy.toUpperCase(); 
      let  SortType = `ASC`;
      if(SORTBY == "ID" || SORTBY == "TIME" || SORTBY == "USER" || SORTBY == "POSITION" || SORTBY == "MODULE" || SORTBY == "CONTENT"){
        if(typeof queryParams.SortType == 'string' && queryParams.SortType.trim().length > 0){
          let tempSortType = queryParams.SortType.toUpperCase(); 
          if(tempSortType == "DESC" || tempSortType == "ASC")
              SortType =  tempSortType; 
        }
        sort = ` ORDER BY ${SortBy} ${SortType}`;        
      }  
    }
    sqlQueryData = `SELECT \`Id\`,DATE_FORMAT(Time, '%Y-%m-%d %H:%i:%S') AS Time,\`User\`,\`UserName\`,\`Position\`,\`Module\`,\`Content\` FROM \`log\` ${where} ${sort} ${limit}`;
  }
  return {
    sqlQueryCount: sqlQueryCount,
    sqlQueryData: sqlQueryData,
  };
}

module.exports = DBLog;