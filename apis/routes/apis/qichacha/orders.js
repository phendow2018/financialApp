const router = require('koa-router')()
let   global = require('../../../Common/Global');
let   Base   = require('../../../Common/Base')
const tools = require('../../../Common/tools');
const Order = require('../../../Class/financial/Order');
const DBLog = require('../../../Class/common/DBLog');
let dbLog = new DBLog();

const CUSTOMER_FLAG = require('../../../Class/reports/QichachaReport').CUSTOMER_FLAG;

class orders extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

orders.prototype.checkCreate = function(postData) {
  if (!tools.isValidString(postData.companyName)) {
    this.LastError = '无有效的companyName参数';
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.companyNumber)) {
    this.LastError = '无有效的companyNumber参数';
    this.Code = 101;
    return false;
  }
  if (!tools.isNumber(postData.type)) {
    this.LastError = '无有效的type参数';
    this.Code = 101;
    return false;
  }
  if (!Order.isValidType(postData.type)) {
    this.LastError = `无效的Type`;
    this.Code = 101;
    return false;
  }
  if (Order.YearStrToYears(postData.year) === false) {
    this.LastError = `无有效的year参数`;
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.orderNumber)) {
    this.LastError = `无有效的orderNumber参数`;
    this.Code = 101;
    return false;
  }
  return true;
}
orders.prototype.doCreate = async function() {
  let _this = this;
  let postData  = _this.ctx.request.body;
  if (!_this.checkCreate(postData)) {
    return false;
  }

  let years = Order.YearStrToYears(postData.year);
  let Needs = ``;
  for (let y of years) {
    let need = `${y}_4,`;
    Needs += need;
  }
  if (Needs.length > 0) {
    Needs = Needs.substring(0, Needs.length-1);
  }

  let deal = new Order();
  let params = {
    CustomerFlag: CUSTOMER_FLAG,
    Type: parseInt(postData.type),
    CompanyNumber: postData.companyNumber,
    CompanyName: postData.companyName,
    ReportingNeeds: Needs,
    ExternalId: postData.orderNumber,
  }
  let ret = await deal.createOrder(params);
  if (ret === false) {
    this.LastError = deal.getLastError();
    this.Code = 301;
    return false;
  }

  await dbLog.writeAllField('system', "系统", '', '系统接口', `企查查建立订单 订单编号:${ret.OrderNumber} 企查查订单号:${postData.orderNumber}`);
  // await _this.writeDBLog('系统', `企查查建立订单 订单编号:${ret.OrderNumber} 企查查订单号:${postData.orderNumber}`);
  return ret;
}

orders.prototype.create = async function(){
  let _this = this;
  let ret = await _this.doCreate();
  
  let retData = {
    code: 1,
    msg: "成功",
  }

  if (ret === false) {
    retData.code = -1;
    retData.msg = _this.LastError;
    retData.orderNumber = "";
  } else {
    retData.orderNumber = ret.OrderNumber;
  }
  _this.response200(retData);
}

router.all('/',async (ctx, next) => {
  let instance = await new orders(ctx);
  await instance.deal();
})
  
  
module.exports = router