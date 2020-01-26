const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const Company = require('../../Class/financial/Company');
const CompanyStatement = require('../../Class/financial/CompanyStatement');

class statements extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

statements.prototype.checkCreate = function(postData) {
  if (!tools.isValidString(postData.CompanyNumber)) {
    this.LastError = '无有效的CompanyNumber参数';
    this.Code = 101;
    return false;
  }
  if (!tools.isNumber(postData.Year)) {
    this.LastError = '无有效的Year参数';
    this.Code = 101;
    return false;
  }
  if (!tools.isNumber(postData.Type)) {
    this.LastError = '无有效的Type参数';
    this.Code = 101;
    return false;
  }
  return true;
}
statements.prototype.doCreate = async function() {
    let _this = this;
    let postData  = _this.ctx.request.body;
    if (!_this.checkCreate(postData)) {
      return false;
    }

    let deal = new CompanyStatement();
    let ret = await deal.createStatement(postData);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

statements.prototype.checkUpdate = function(queryData) {
  if (!tools.isValidString(queryData.CompanyNumber)) {
    this.LastError = '无有效的CompanyNumber参数';
    this.Code = 102;
    return false;
  }
  if (!tools.isNumber(queryData.Year)) {
    this.LastError = '无有效的Year参数';
    this.Code = 102;
    return false;
  }
  if (!tools.isNumber(queryData.Type)) {
    this.LastError = '无有效的Type参数';
    this.Code = 102;
    return false;
  }
  return true;
}
statements.prototype.doUpdate = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    if (!this.checkUpdate(queryData)) {
      return false;
    }

    let deal = new CompanyStatement();
    let ret = await deal.modifyStatement(queryData.CompanyNumber, queryData.Year, queryData.Type, postData);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

statements.prototype.checkDelete = function(queryData) {
  if (!tools.isValidString(queryData.CompanyNumber)) {
    this.LastError = '无有效的CompanyNumber参数';
    this.Code = 102;
    return false;
  }
  if (!tools.isNumber(queryData.Year)) {
    this.LastError = '无有效的Year参数';
    this.Code = 102;
    return false;
  }
  if (!tools.isNumber(queryData.Type)) {
    this.LastError = '无有效的Type参数';
    this.Code = 102;
    return false;
  }
  return true;
}
statements.prototype.doDelete = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    if (!this.checkDelete(queryData)) {
      return false;
    } 

    let deal = new CompanyStatement();
    let ret = await deal.deleteStatement(queryData.CompanyNumber, queryData.Year, queryData.Type);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

statements.prototype.doRead = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;

    if (!tools.isValidString(queryData.CompanyNumber)) {
      this.LastError = '无有效的CompanyNumber参数';
      this.Code = 102;
      return false;
    }

    let retData = {
      isExistCompany: false,
      data: []
    }
    let dealCompany = new Company();
    let companyExist = await dealCompany.checkExist(queryData.CompanyNumber);
    if (companyExist === false) {
      return retData;
    }

    retData.isExistCompany = true;
    let deal = new CompanyStatement();
    let ret = await deal.queryStatement(queryData);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }
    retData.data = ret.data;

    return retData;
}

statements.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

statements.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

statements.prototype.delete = async function(){
    let _this = this;
    let ret = await _this.doDelete();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess();
    } 
}

statements.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new statements(ctx);
    await instance.deal();
})
  
  
module.exports = router