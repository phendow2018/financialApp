const global = require('../../Common/Global');
const tools = require('../../Common/tools');
const Order = require('../financial/Order');

var makeGroupByStatusResult = function(data) {
  let ret = {
    Count: 0,
    SendCount: 0,
    UnsendCount: 0,
    CancelCount: 0
  }

  for (let t of data) {
    ret.Count += t.COUNT;
    if (t.STATUS == -1) {
      ret.CancelCount += t.COUNT;
    } else if (t.STATUS == 20) {
      ret.SendCount += t.COUNT;
    } else {
      ret.UnsendCount += t.COUNT;
    }
  }
  return ret;
}

var findByYear = function(arr, year) {
  for (let i of arr) {
    if (i.Year == year) {
      return i;
    }
  }
  return null;
}

var findByQuarter = function(arr, quarter) {
  for (let i of arr) {
    if (i.Quarter == quarter) {
      return i;
    }
  }
  return null;
}

var findByMonth = function(arr, month) {
  for (let i of arr) {
    if (i.Month == month) {
      return i;
    }
  }
  return null;
}

var findByDate = function(arr, date) {
  for (let i of arr) {
    if (i.Date == date) {
      return i;
    }
  }
  return null;
}

class OrderStatistics {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 根据状态分组 */
  async getCountGroupByStatus() {
    let queryField = 'STATUS';

    let sql = `SELECT \`${queryField}\`, Count(1) As COUNT FROM \`order\` GROUP BY \`${queryField}\``;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    return makeGroupByStatusResult(ret, queryField);
  }

  /** 根据年份状态分组 */
  async getCountGroupByYearStatus() {
    let sql = `SELECT YEAR(OrderDate) AS YEAR, STATUS, Count(1) As COUNT FROM \`order\` GROUP BY YEAR(OrderDate), STATUS`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    let retData = {
      // totalCount: 0,
      data: []
    } 

    for (let t of ret) {
      // retData.totalCount += t.COUNT;
      let countUnSend = 0;
      let countSend = 0;
      let countCancel = 0;
      if (t.STATUS == -1) {
        countCancel += t.COUNT;
      } else if (t.STATUS == 20) {
        countSend += t.COUNT;
      } else {
        countUnSend += t.COUNT;
      }

      let item = findByYear(retData.data, t.YEAR);
      if (item === null) {
        let yearItem = {
          Year: t.YEAR,
          Count: t.COUNT,
          SendCount: countSend,
          UnsendCount: countUnSend,
          CancelCount: countCancel
        }
        retData.data.push(yearItem);
      } else {
        item.Count += t.COUNT;
        item.SendCount += countSend;
        item.UnsendCount += countUnSend;
        item.CancelCount += countCancel;
      }
    }
      
    return retData;
  }

  /** 根据季度状态分组 */
  async getCountGroupByQuarterStatus() {
    let sql = `SELECT YEAR(OrderDate) AS YEAR, QUARTER(OrderDate) AS QUARTER, STATUS, Count(1) As COUNT FROM \`order\` 
      GROUP BY YEAR(OrderDate),QUARTER(OrderDate), STATUS`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    let retData = {
      // totalCount: 0,
      data: []
    } 

    for (let t of ret) {
      // retData.totalCount += t.COUNT;
      let countUnSend = 0;
      let countSend = 0;
      let countCancel = 0;
      if (t.STATUS == -1) {
        countCancel += t.COUNT;
      } else if (t.STATUS == 20) {
        countSend += t.COUNT;
      } else {
        countUnSend += t.COUNT;
      }

      let quarterStr = `${t.YEAR}-${t.QUARTER}`;
      let item = findByQuarter(retData.data, quarterStr);
      if (item === null) {
        let quarterItem = {
          Quarter: quarterStr,
          Count: t.COUNT,
          SendCount: countSend,
          UnsendCount: countUnSend,
          CancelCount: countCancel
        }
        retData.data.push(quarterItem);
      } else {
        item.Count += t.COUNT;
        item.SendCount += countSend;
        item.UnsendCount += countUnSend;
        item.CancelCount += countCancel;
      }
    }
      
    return retData;
  }

  /** 根据月份状态分组 */
  async getCountGroupByMonthStatus(StartMonth = '', EndMonth = '') {
    if (tools.isMonth(StartMonth) && tools.isMonth(EndMonth)) {
      ;
    } else if (!tools.isMonth(StartMonth) && tools.isMonth(EndMonth)) {
      let arrEnd = EndMonth.split('-');
      let arrStart = JSON.parse(JSON.stringify(arrEnd));
      arrStart[0] = `${parseInt(arrStart[0]) - 1}`;
      StartMonth = `${arrStart[0]}-${arrStart[1]}`;
    } else if (tools.isMonth(StartMonth) && !tools.isMonth(EndMonth)) {
      let arrStart = StartMonth.split('-');
      let arrEnd = JSON.parse(JSON.stringify(arrStart));
      arrEnd[0] = `${parseInt(arrEnd[0]) + 1}`;
      EndMonth = `${arrEnd[0]}-${arrEnd[1]}`;
    } else {
      let now = new Date();
      EndMonth = now.format('yyyy-MM');
      let arrEnd = EndMonth.split('-');
      let arrStart = JSON.parse(JSON.stringify(arrEnd));
      arrStart[0] = `${parseInt(arrStart[0]) - 1}`;
      StartMonth = `${arrStart[0]}-${arrStart[1]}`;
    }

    let where = `WHERE 1=1`;
    if (tools.isMonth(StartMonth)) {
      let start = StartMonth + '-01';
      where += ` AND OrderDate >= ${tools.MysqlEscape(start)}`;
    }
    if (tools.isMonth(EndMonth)) {
      let end = EndMonth + '-01';
      where += ` AND OrderDate < ${tools.MysqlEscape(end)}`;
    }
    let sql = `SELECT DATE_FORMAT(OrderDate, '%Y-%m') AS MONTH, STATUS, Count(1) As COUNT FROM \`order\` 
      ${where} GROUP BY DATE_FORMAT(OrderDate, '%Y-%m'), STATUS`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    let retData = {
      // totalCount: 0,
      data: []
    } 
    for (let t of ret) {
      // retData.totalCount += t.COUNT;
      let countUnSend = 0;
      let countSend = 0;
      let countCancel = 0;
      if (t.STATUS == -1) {
        countCancel += t.COUNT;
      } else if (t.STATUS == 20) {
        countSend += t.COUNT;
      } else {
        countUnSend += t.COUNT;
      }

      let item = findByMonth(retData.data, t.MONTH);
      if (item === null) {
        let quarterItem = {
          Month: t.MONTH,
          Count: t.COUNT,
          SendCount: countSend,
          UnsendCount: countUnSend,
          CancelCount: countCancel
        }
        retData.data.push(quarterItem);
      } else {
        item.Count += t.COUNT;
        item.SendCount += countSend;
        item.UnsendCount += countUnSend;
        item.CancelCount += countCancel;
      }
    }
      
    return retData;
  }

  /** 根据日期状态分组 */
  async getCountGroupByDateStatus(Month) {
    if (!tools.isMonth(Month)) {
      Month = (new Date()).format('yyyy-MM');
    }

    let arrMonth = Month.split('-');
    let where = `WHERE YEAR(OrderDate)=${arrMonth[0]} AND MONTH(OrderDate)=${arrMonth[1]}`;
    
    let sql = `SELECT DATE_FORMAT(OrderDate, '%Y-%m-%d') AS DATE, STATUS, Count(1) As COUNT FROM \`order\` 
      ${where} GROUP BY DATE_FORMAT(OrderDate, '%Y-%m-%d'), STATUS`;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }

    let retData = {
      // totalCount: 0,
      data: []
    } 
    for (let t of ret) {
      // retData.totalCount += t.COUNT;
      let countUnSend = 0;
      let countSend = 0;
      let countCancel = 0;
      if (t.STATUS == -1) {
        countCancel += t.COUNT;
      } else if (t.STATUS == 20) {
        countSend += t.COUNT;
      } else {
        countUnSend += t.COUNT;
      }

      let item = findByDate(retData.data, t.DATE);
      if (item === null) {
        let quarterItem = {
          Date: t.DATE,
          Count: t.COUNT,
          SendCount: countSend,
          UnsendCount: countUnSend,
          CancelCount: countCancel
        }
        retData.data.push(quarterItem);
      } else {
        item.Count += t.COUNT;
        item.SendCount += countSend;
        item.UnsendCount += countUnSend;
        item.CancelCount += countCancel;
      }
    }
      
    return retData;
  }
}

module.exports = OrderStatistics;