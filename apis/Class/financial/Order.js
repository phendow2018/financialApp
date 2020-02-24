const global = require('../../Common/Global');
const tools = require('../../Common/tools');

const TABLE_NAME = 'order';

class Order {
  /** 订单状态转字符串 */
  static Status2String(status) {
    if (status == -1) {
      return `已取消`;
    } else if (status == 0) {
      return `新建`;
    } else if (status == 1) {
      return `已指派`;
    } else if (status == 5) {
      return `未完成`;
    } else if (status == 10) {
      return `已完成`;
    } else if (status == 20) {
      return `已发送`;
    } else {
      return `未知状态`;
    }
  }
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 判断是否为有效的订单类型 */
  static isValidType(type) {
    if(!tools.isNumber(type)) {
      return false;
    }
    if (type == 1 || type == 2) {
      return true;
    }
    return false;
  }

  /** 判断是否为有效的订单年份数组 */
  static YearStrToYears(yearStr) {
    try {
      let arr = yearStr.split(',');
      if (!tools.isArray(arr)) 
        return false;
  
      let years = []
      for (let item of arr) {
        let y = parseInt(item);
        if (!isNaN(y)) {
          years.push(y);
        }
      }

      if (years.length <= 0) {
        return false;
      }
      return years;

    } catch(e) {
      return false;
    }
  }

  /** 获取一个新的订单编号 */
  async getNewOrderNumber() {
    try {
      let ret = await this.dbLink.query(`CALL AutoOrderNumber(@a)`)
      if(ret.error) {
        this.LastError = '创建订单编号失败';
        return false;
      } else {
        let data = ret[0];
        return data[0].OrderNumber;
      }
    } catch(e) {
      return false;
    }
  }

  /** 检查订单是否存在 */
  async checkExist(OrderNumber) {
    let sql = `SELECT COUNT(1) AS COUNT FROM \`${TABLE_NAME}\` WHERE \`OrderNumber\`=${tools.MysqlEscape(OrderNumber)}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false || ret.length <= 0) {
      return false;
    }
    if (ret[0].COUNT <= 0) {
      return false;
    }
    return true;
  }

  /** 创建一个新订单 */
  async createOrder(postData) {
    let orderNO = await this.getNewOrderNumber();
    if (orderNO === false) {
      this.LastError = `创建订单编号失败`;
      return false;
    } 

    let time = new Date();
    let params = {
      OrderNumber: orderNO,
      CustomerFlag: postData.CustomerFlag,
      OrderDate: time.format('yyyy-MM-dd'),
      Type: postData.Type,
      CompanyNumber: postData.CompanyNumber,
      CompanyName: postData.CompanyName,
      Status: 0,
      ReportingNeeds: postData.ReportingNeeds,
      CreateTime: time.format('yyyy-MM-dd HH:mm:ss'),
      ExternalId: postData.ExternalId,
      Explain: "",
    }
    let sql = tools.getInsertSql(params, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }
    return {OrderNumber: orderNO};
  }

  /** 修改订单 */
  async modifyOrder(OrderNumber, postData) {
    let exist = await this.checkExist(OrderNumber);
    if (exist === false) {
      this.LastError = `不存在的订单编号${OrderNumber}`;
      return false;
    }

    let time = new Date();
    let where = {
      OrderNumber: OrderNumber,
    }
    let params = {};
    if (Order.isValidType(postData.Type)) {
      params.Type = postData.Type;
    }
    if (tools.isValidString(postData.CompanyNumber)) {
      params.CompanyNumber = postData.CompanyNumber;
    }
    if (tools.isValidString(postData.CompanyName)) {
      params.CompanyName = postData.CompanyName;
    }
    if (tools.isValidString(postData.ReportingNeeds)) {
      params.ReportingNeeds = postData.ReportingNeeds;
    }
    if (tools.isNumber(postData.Status)) {
      params.Status = postData.Status;
    }
    if (typeof postData.Editor == 'string') {
      params.Editor = postData.Editor;
    }
    if (tools.isValidString(postData.LastModifyUser)) {
      params.LastModifyUser = postData.LastModifyUser;
      params.LastModifyTime = time.format('yyyy-MM-dd HH:mm:ss');
    }
    if (typeof postData.Explain == 'string') {
      params.Explain = postData.Explain;
    }
    let sql = tools.getUpdateSql(params, where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }
    return {OrderNumber: OrderNumber};
  }

  /** 删除订单 */
  async deleteOrder(OrderNumber) {
    let where = {
      OrderNumber: OrderNumber
    }
    let sql = tools.getDeleteSql(where, TABLE_NAME);
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return {OrderNumber: OrderNumber};
  }

  /** 读取订单信息 */
  async queryOrder(queryData) {
    let where = `WHERE 1=1`;
    if (tools.isValidString(queryData.OrderNumber)) {
      where += ` AND \`OrderNumber\`=${tools.MysqlEscape(queryData.OrderNumber)}`;
    }
    if (tools.isValidString(queryData.CustomerFlag)) {
      where += ` AND \`CustomerFlag\`=${tools.MysqlEscape(queryData.CustomerFlag)}`;
    }
    if (tools.isNumber(queryData.Type)) {
      where += ` AND \`Type\`=${parseInt(queryData.Type)}`;
    }
    if (tools.isDate(queryData.OrderDate)) {
      where += ` AND \`OrderDate\`=${tools.MysqlEscape(queryData.OrderDate)}`;
    }
    if (tools.isNumber(queryData.Status)) {
      where += ` AND \`Status\`=${parseInt(queryData.Status)}`;
    }
    if (tools.isValidString(queryData.Editor)) {
      where += ` AND \`Editor\`=${tools.MysqlEscape(queryData.Editor)}`;
    }
    if (tools.isDateTime(queryData.CreateTimeStart) || tools.isDate(queryData.CreateTimeStart)) {
      where += ` AND \`CreateTime\`>=${tools.MysqlEscape(queryData.CreateTimeStart)}`;
    }
    if (tools.isDateTime(queryData.CreateTimeEnd) || tools.isDate(queryData.CreateTimeEnd)) {
      where += ` AND \`CreateTime\`<=${tools.MysqlEscape(queryData.CreateTimeEnd)}`;
    }
    if (tools.isValidString(queryData.FuzzyQuery)) {
      let likeStr = `%${queryData.FuzzyQuery}%`;
      // where += ` AND (\`OrderNumber\` LIKE ${tools.MysqlEscape(likeStr)} 
      //   OR \`CompanyNumber\` LIKE ${tools.MysqlEscape(likeStr)}
      //   OR \`CompanyName\` LIKE ${tools.MysqlEscape(likeStr)})`;
      where += ` AND (\`OrderNumber\` LIKE ${tools.MysqlEscape(likeStr)} 
        OR \`CompanyName\` LIKE ${tools.MysqlEscape(likeStr)})`;
    }
    if (tools.isValidString(queryData.FuzzyOrderNumber)) {
      let likeStr = `%${queryData.FuzzyOrderNumber}%`;
      where += ` AND \`OrderNumber\` LIKE ${tools.MysqlEscape(likeStr)}`;
    }
    if (tools.isValidString(queryData.FuzzyCompanyName)) {
      let likeStr = `%${queryData.FuzzyCompanyName}%`;
      where += ` AND \`CompanyName\` LIKE ${tools.MysqlEscape(likeStr)}`;
    }

    let count = 0;
    let sqlCount = `SELECT COUNT(1) AS COUNT FROM \`${TABLE_NAME}\` ${where}`;
    let retCount = await this.dbLink.query(sqlCount);
    if (!(retCount === false || retCount.length <= 0)) {
      count = retCount[0].COUNT;
    }

    let sort = `ORDER BY \`OrderNumber\` DESC`;
    let SortType = `ASC`;
    if(tools.isValidString(queryData.SortBy)) {
      let SortBy = queryData.SortBy.toUpperCase(); 
      if(tools.isValidString(queryData.SortType)) {
        let tempSortType = queryData.SortType.toUpperCase(); 
        if(tempSortType == "DESC" || tempSortType == "ASC")
          SortType = tempSortType; 
      } 
      if (SortBy == "ORDERNUMBER" || SortBy == "CUSTOMERFLAG" || SortBy == "ORDERDATE" || SortBy == "TYPE" ||
          SortBy == "COMPANYNUMBER" || SortBy == "COMPANYNAME" || SortBy == "STATUS" || SortBy == "EDITOR" ||
          SortBy == "CREATETIME") {
          sort = `ORDER BY ${SortBy} ${SortType}`;        
      } 
    }

    let limit = '';
    if(tools.isNumber(queryData.Page) && tools.isNumber(queryData.PerPage) && parseInt(queryData.Page) >=1 && parseInt(queryData.PerPage) >= 1){
      let Page    = parseInt(queryData.Page) - 1;
      let PerPage = parseInt(queryData.PerPage);
      limit = `LIMIT ${Page*PerPage},${PerPage}`;         
    }
    
    let sql = `SELECT \`OrderNumber\`, \`CustomerFlag\`, \`Type\`, \`CompanyNumber\`, \`CompanyName\`
      , DATE_FORMAT(OrderDate, '%Y-%m-%d') AS OrderDate, \`Status\`, \`Editor\`, \`ReportingNeeds\`
      , DATE_FORMAT(CreateTime, '%Y-%m-%d %H:%i:%S') AS CreateTime, \`LastModifyUser\`
      , DATE_FORMAT(LastModifyTime, '%Y-%m-%d %H:%i:%S') AS LastModifyTime, \`ExternalId\`, \`Explain\`
      FROM \`${TABLE_NAME}\` ${where} ${sort} ${limit}`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }
    return {
      totalCount: count,
      data: ret
    }
  }

  /** 指派订单 */
  async assignOrder(OrderNumber, Editor, Operator) {
    if (!tools.isValidString(OrderNumber)) {
      this.LastError = `无效的OrderNamber参数`;
      return false;
    }

    let retQuery = await this.queryOrder({OrderNumber: OrderNumber});
    if (retQuery === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    if (retQuery.totalCount <= 0 || retQuery.data.length <= 0) {
      this.LastError = `对应订单不存在，订单编号:${OrderNumber}`;
      return false;
    }

    if (retQuery.data[0].Status != 0) {//新建订单才能指派
      this.LastError = `${Order.Status2String(retQuery.data[0].Status)}订单，不能指派`;
      return false;
    }

    let data = {
      Status: 1,
      Editor: Editor,
      LastModifyUser: Operator
    }
    let ret = await this.modifyOrder(OrderNumber, data);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }
    return {OrderNumber: OrderNumber};
  }

  /** 取消订单指派 */
  async assignOrderCancel(OrderNumber, Operator) {
    if (!tools.isValidString(OrderNumber)) {
      this.LastError = `无效的OrderNamber参数`;
      return false;
    }

    let retQuery = await this.queryOrder({OrderNumber: OrderNumber});
    if (retQuery === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    if (retQuery.totalCount <= 0 || retQuery.data.length <= 0) {
      this.LastError = `对应订单不存在，订单编号:${OrderNumber}`;
      return false;
    }

    if (retQuery.data[0].Status > 1 || retQuery.data[0].Status < 0) {//新建订单或刚指派的订单才能取消指派
      this.LastError = `${Order.Status2String(retQuery.data[0].Status)}订单，可能已经有人操作过，不能取消指派`;
      return false;
    }

    let data = {
      Status: 0,
      Editor: "",
      LastModifyUser: Operator
    }
    let ret = await this.modifyOrder(OrderNumber, data);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }
    return {OrderNumber: OrderNumber};
  }
};

module.exports = Order;