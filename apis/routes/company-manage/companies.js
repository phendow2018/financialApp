const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const Company = require('../../Class/financial/Company');

class companies extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

companies.prototype.checkCreate = function(postData) {
  if (!tools.isValidString(postData.CompanyNumber)) {
    this.LastError = '无有效的CompanyNumber参数';
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.Name)) {
    this.LastError = '无有效的Name参数';
    this.Code = 101;
    return false;
  }
  return true;
}
companies.prototype.doCreate = async function() {
    let _this = this;
    let postData  = _this.ctx.request.body;
    if (!_this.checkCreate(postData)) {
      return false;
    }

    let deal = new Company();
    let ret = await deal.createCompany(postData);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

companies.prototype.checkUpdate = function(queryData) {
  if (!tools.isValidString(queryData.CompanyNumber)) {
    this.LastError = '无有效的CompanyNumber参数';
    this.Code = 102;
    return false;
  }
  return true;
}
companies.prototype.doUpdate = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    if (!this.checkUpdate(queryData)) {
      return false;
    }

    let deal = new Company();
    let ret = await deal.modifyCompany(queryData.CompanyNumber, postData);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

companies.prototype.checkDelete = function(queryData) {
  if (!tools.isValidString(queryData.CompanyNumber)) {
    this.LastError = '无有效的CompanyNumber参数';
    this.Code = 102;
    return false;
  }
  return true;
}
companies.prototype.doDelete = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    if (!this.checkDelete(queryData)) {
      return false;
    } 

    let deal = new Company();
    let ret = await deal.deleteCompany(queryData.CompanyNumber);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

companies.prototype.doRead = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;

    let deal = new Company();
    let ret = await deal.queryCompany(queryData);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

companies.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

companies.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

companies.prototype.delete = async function(){
    let _this = this;
    let ret = await _this.doDelete();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess();
    } 
}

companies.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new companies(ctx);
    await instance.deal();
})
  
  
module.exports = router