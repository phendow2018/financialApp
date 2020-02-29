const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const Order = require('../../Class/financial/Order');
const Company = require('../../Class/financial/Company');
const CompanyStatement = require('../../Class/financial/CompanyStatement');

class OrderCommit extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
      this.order = new Order();
  }
}

OrderCommit.prototype.check = async function(postData) {
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

  if (ret.data[0].Status < 0 || ret.data[0].Status >= 10) {//新建订单和已保存的订单才能保存
    this.LastError = `${Order.Status2String(ret.data[0].Status)}订单，不能提交`;
    this.Code = 201;
    return false;
  }

  let company = new Company();
  let companyRet = await company.queryCompany({CompanyNumber: ret.data[0].CompanyNumber});
  if (companyRet === false) {
    this.LastError = this.order.getLastError();
    this.Code = 301;
    return false;
  }

  if (companyRet.totalCount <= 0 || companyRet.data.length <= 0) {
    this.LastError = `订单对应的企业不存在，请先创建企业`;
    this.Code = 201;
    return false;
  }

  return ret.data[0].CustomerFlag;
}
OrderCommit.prototype.doCreate = async function() {
  let _this = this;
  let postData  = _this.ctx.request.body;

  let checkRet = await _this.check(postData);
  if (checkRet === false) {
    return false;
  }

  if (tools.isArray(postData.Statements)) {
    let cs = new CompanyStatement();
    for (let item of postData.Statements) {
      let ret = await cs.createOrModify(item);
      if (ret === false) {
        this.LastError = cs.getLastError();
        this.Code = 302;
        return false;
      }
    }
  }

  let data = {
    Status: 10,
    Editor: postData.Operator,
    LastModifyUser: postData.Operator
  }
  let ret = await this.order.modifyOrder(postData.OrderNumber, data);
  if (ret === false) {
    this.LastError = this.order.getLastError();
    this.Code = 301;
    return false;
  }

  await _this.writeDBLog(postData.Operator, `提交订单 订单编号:${ret.OrderNumber}`);
  return ret;
}

OrderCommit.prototype.checkDelete = async function(postData) {
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
    this.LastError = `不是已完成的订单，不能取消提交`;
    this.Code = 201;
    return false;
  }

  return ret.data[0].CustomerFlag;
}
OrderCommit.prototype.doDelete = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    if (await this.checkDelete(postData) === false) {
      return false;
    } 

    let data = {
      Status: 5,
      // Editor: postData.Operator,
      LastModifyUser: postData.Operator
    }
    let ret = await this.order.modifyOrder(postData.OrderNumber, data);
    if (ret === false) {
      this.LastError = this.order.getLastError();
      this.Code = 301;
      return false;
    }
  
    await _this.writeDBLog(postData.Operator, `取消订单提交 订单编号:${ret.OrderNumber}`);
    return ret;
}

OrderCommit.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

OrderCommit.prototype.delete = async function(){
  let _this = this;
  let ret = await _this.doDelete();
  if(ret === false){
      _this.responseError();
  }else{
      _this.responseSuccess();
  } 
}

router.all('/',async (ctx, next) => {
    let instance = await new OrderCommit(ctx);
    await instance.deal();
})
  
  
module.exports = router