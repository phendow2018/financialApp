const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const Order = require('../../Class/financial/Order');

class orders extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

orders.prototype.checkCreate = function(postData) {
  if (!tools.isValidString(postData.CompanyNumber)) {
    this.LastError = '无有效的CompanyNumber参数';
    this.Code = 101;
    return false;
  }
  if (!tools.isNumber(postData.Type)) {
    this.LastError = '无有效的Type参数';
    this.Code = 101;
    return false;
  }
  if (!Order.isValidType(postData.Type)) {
    this.LastError = `无效的Type`;
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.ReportingNeeds)) {
    this.LastError = `无有效的ReportingNeeds参数`;
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

    postData.CustomerFlag = 'system';
    let deal = new Order();
    let ret = await deal.createOrder(postData);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

orders.prototype.checkUpdate = function(queryData, postData) {
  if (!tools.isValidString(queryData.OrderNumber)) {
    this.LastError = '无有效的OrderNumber参数';
    this.Code = 102;
    return false;
  }
  return true;
}
orders.prototype.doUpdate = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    if (!this.checkUpdate(queryData, postData)) {
      return false;
    }

    let deal = new Order();
    let ret = await deal.modifyOrder(queryData.OrderNumber, postData);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

orders.prototype.checkDelete = function(queryData) {
  if (!tools.isValidString(queryData.OrderNumber)) {
    this.LastError = '无有效的OrderNumber参数';
    this.Code = 102;
    return false;
  }
  return true;
}
orders.prototype.doDelete = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    if (!this.checkDelete(queryData)) {
      return false;
    } 

    let orderDeal = new Order();
    let ret = await orderDeal.deleteOrder(queryData.OrderNumber);
    if (ret === false) {
      this.LastError = orderDeal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

orders.prototype.doRead = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;

    let deal = new Order();
    let ret = await deal.queryOrder(queryData);
    if (ret === false) {
      this.LastError = orderDeal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

orders.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

orders.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

// orders.prototype.delete = async function(){
//     let _this = this;
//     let ret = await _this.doDelete();
//     if(ret === false){
//         _this.responseError();
//     }else{
//         _this.responseSuccess();
//     } 
// }

orders.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new orders(ctx);
    await instance.deal();
})
  
  
module.exports = router