const router = require('koa-router')()
const fs = require('fs');
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const Order = require('../../Class/financial/Order');
let HttpClient = require('../../Common/HttpClient');

const QichachaReport = require('../../Class/reports/QichachaReport');

class OrderSend extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
      this.order = new Order();
  }
}

OrderSend.prototype.check = async function(postData) {
  if (!tools.isValidString(postData.OrderNumber)) {
    this.LastError = '无有效的OrderNumber参数';
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.Operator)) {
    this.LastError = '无有效的Operator参数';
    this.Code = 101;
    return false;
  }

  let ret = await this.order.queryOrder({OrderNumber: postData.OrderNumber});
  if (ret === false) {
    this.LastError = this.order.getLastError();
    this.Code = 301;
    return false;
  }

  if (ret.totalCount <= 0 || ret.data.length <= 0) {
    this.LastError = `对应订单不存在，订单编号:${postData.OrderNumber}`;
    this.Code = 201;
    return false;
  }

  if (ret.data[0].Status != 10) {//已完成的订单才能发送
    this.LastError = `不是已完成的订单，不能发送`;
    this.Code = 201;
    return false;
  }

  return ret.data[0].CustomerFlag;
}
OrderSend.prototype.doCreate = async function() {
  let _this = this;
  let postData  = _this.ctx.request.body;

  let checkRet = await _this.check(postData);
  if (checkRet === false) {
    return false;
  }

  if (checkRet === QichachaReport.CUSTOMER_FLAG){
    if (await this.qichachaSend(postData) === false) {
      return false;
    }
  }

  let data = {
    Status: 20,
    LastModifyUser: postData.Operator
  }
  let ret = await this.order.modifyOrder(postData.OrderNumber, data);
  if (ret === false) {
    this.LastError = this.order.getLastError();
    this.Code = 301;
    return false;
  }

  await _this.writeDBLog(postData.Operator, `发送订单 订单编号:${ret.OrderNumber} 操作人:${postData.Operator}`);
  return ret;
}

OrderSend.prototype.qichachaSend = async function(postData) {
  try {
    let qichachaReport = new QichachaReport();
    let ret = await qichachaReport.makeReport(postData.OrderNumber);
    if (ret === false) {
      this.LastError = qichachaReport.getLastError();
      this.Code = 1001;
      return false;
    }

    let jsonStr = JSON.stringify(ret, null, '\t');
    fs.writeFileSync(`${__dirname}/../../log/send.json`, jsonStr);

    let config = QichachaReport.CommonInfo;
    let client = new HttpClient();
    let retHttp = await client.send(config.host, config.uri, config.port, "POST", ret);
    if (retHttp === false) {
      this.LastError = `发送Http请求失败 http://${config.host}:${config.port}${config.uri}, 原因:${client.getLastError().ErrorMessage}`;
      this.Code = 1010;
      return false;
    }
    if (typeof retHttp.Data == 'undefined' || typeof retHttp.Data.Result == 'undefined' || !tools.isNumber(retHttp.Data.Result.code)) {
      this.LastError = `返回结果异常，无有效的code字段`;
      this.Code = 1011;
      return false;
    }
    if (retHttp.Data.Result.code != 1) {
      this.LastError = retHttp.Data.Result.msg;
      this.Code = 1015;
      return false;
    }
    return true;
  } catch(e) {
    this.LastError = `qichachaSend异常`;
    this.Code = 1;
    return false;
  }
}

OrderSend.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new OrderSend(ctx);
    await instance.deal();
})
  
  
module.exports = router