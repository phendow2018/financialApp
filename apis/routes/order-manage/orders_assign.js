const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const Order = require('../../Class/financial/Order');
const Company = require('../../Class/financial/Company');
const CompanyStatement = require('../../Class/financial/CompanyStatement');

class OrderAssign extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
      this.order = new Order();
  }
}

OrderAssign.prototype.checkCreate = async function(postData) {
  if (!tools.isValidString(postData.Editor)) {
    this.LastError = '无有效的Editor参数';
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.Operator)) {
    this.LastError = '无有效的Operator参数';
    this.Code = 101;
    return false;
  }

  if (!tools.isArray(postData.Orders)) {
    this.LastError = '无有效的Orders参数';
    this.Code = 101;
    return false;
  }

  return true;
}
OrderAssign.prototype.doCreate = async function() {
  let _this = this;
  let postData  = _this.ctx.request.body;

  let checkRet = await _this.checkCreate(postData);
  if (checkRet === false) {
    return false;
  }

  let ret = {
    Editor: postData.Editor,
    Results: []
  }
  for (let t of postData.Orders) {
    let result = {
      OrderNumber: t.OrderNumber,
      Code: 0,
      Message: "success"
    }
    let retAssign = await this.order.assignOrder(t.OrderNumber, postData.Editor, postData.Operator);
    if (retAssign === false) {
      result.Message = this.order.getLastError();
      result.Code = 301;
    } else {
      await _this.writeDBLog(postData.Operator, `指派订单给${postData.Editor} 订单编号:${t.OrderNumber}`);
    }
    ret.Results.push(result);
  }
  return ret;
}

OrderAssign.prototype.checkDelete = async function(postData) {
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

  return true;
}
OrderAssign.prototype.doDelete = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    if (await this.checkDelete(postData) === false) {
      return false;
    } 

    let ret = await this.order.assignOrderCancel(postData.OrderNumber, postData.Operator);
    if (ret === false) {
      this.LastError = this.order.getLastError();
      this.Code = 301;
      return false;
    }
  
    await _this.writeDBLog(postData.Operator, `取消订单指派人 订单编号:${ret.OrderNumber}`);
    return ret;
}

OrderAssign.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

OrderAssign.prototype.delete = async function(){
  let _this = this;
  let ret = await _this.doDelete();
  if(ret === false){
      _this.responseError();
  }else{
      _this.responseSuccess();
  } 
}

router.all('/',async (ctx, next) => {
    let instance = await new OrderAssign(ctx);
    await instance.deal();
})
  
  
module.exports = router