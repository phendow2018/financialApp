const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const Module = require('../../Class/platform/Module');

class Modules extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

Modules.prototype.checkCreate = function(postData) {
  if (!tools.isValidString(postData.Flag)) {
    this.LastError = '无有效的Flag字段';
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.Name)) {
    this.LastError = '无有效的Name字段';
    this.Code = 101;
    return false;
  }
  return true;
}
Modules.prototype.doCreate = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;

  if (!_this.checkCreate(postData)) {
    return false;
  }

  let deal = new Module();
  let ret = await deal.createModule(postData);
  if (ret === false) {
    this.LastError = deal.getLastError();
    this.Code = 301;
    return false;
  }
  return ret;
}


Modules.prototype.doUpdate = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;
  if (!tools.isValidString(queryData.Flag)) {
    this.LastError = '无有效的Flag字段';
    this.Code = 101;
    return false;
  }
  
  let deal = new Module();
  let ret = await deal.modifyModule(queryData.Flag, postData);
  if (ret === false) {
    this.LastError = deal.getLastError();
    this.Code = 301;
    return false;
  }
  return ret;
}

Modules.prototype.doDelete = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;
  if (!tools.isValidString(queryData.Flag)) {
    this.LastError = '无有效的Flag字段';
    this.Code = 101;
    return false;
  }

  let deal = new Module();
  let ret = await deal.deleteModule(queryData.Flag);
  if (ret === false) {
    this.LastError = deal.getLastError();
    this.Code = 301;
    return false;
  }
  return ret;
}

Modules.prototype.doRead = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;
  
  let deal = new Module();
  let ret = await deal.queryModule(queryData);
  if (ret === false) {
    this.LastError = deal.getLastError();
    this.Code = 301;
    return false;
  }
  return ret;
}

Modules.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

Modules.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

Modules.prototype.delete = async function(){
    let _this = this;
    let ret = await _this.doDelete();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess();
    } 
}

Modules.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new Modules(ctx);
    await instance.deal();
})
  
  
module.exports = router