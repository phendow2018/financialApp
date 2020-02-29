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

class CompanyStatistics {
  constructor() {
    this.dbLink = global.database;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 获取总数量 */
  async getCount() {
    let sql = `SELECT COUNT(1) AS COUNT FROM \`company\``;
    let ret = await this.dbLink.query(sql);
    if (ret === false) {
      this.LastError = this.dbLink.getLastError();
      return false;
    }
    let count = 0;
    if (ret.length > 0 && tools.isNumber(ret[0].COUNT)) {
      count  = ret[0].COUNT
    }

    return {Count: count}
  }
}

module.exports = CompanyStatistics;