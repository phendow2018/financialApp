const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const Role = require('../../Class/platform/Role');

class roles extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

roles.prototype.checkCreate = function(postData) {
  if (!tools.isValidString(postData.Name)) {
    this.LastError = '无有效的Name字段';
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.CreateUser)) {
    this.LastError = '无有效的CreateUser字段';
    this.Code = 101;
    return false;
  }
  return true;
}
roles.prototype.doCreate = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;

  if (!_this.checkCreate(postData)) {
    return false;
  }

  let deal = new Role();
  let ret = await deal.createRole(postData);
  if (ret === false) {
    this.LastError = deal.getLastError();
    this.Code = 301;
    return false;
  }
  return ret;
}


roles.prototype.doUpdate = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;
  if (!tools.isValidString(queryData.Id)) {
    this.LastError = '无有效的Id字段';
    this.Code = 101;
    return false;
  }
  
  let deal = new Role();
  let ret = await deal.modifyRole(queryData.Id, postData);
  if (ret === false) {
    this.LastError = deal.getLastError();
    this.Code = 301;
    return false;
  }
  return ret;
}

roles.prototype.doDelete = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;
  if (!tools.isValidString(queryData.Id)) {
    this.LastError = '无有效的Id字段';
    this.Code = 101;
    return false;
  }

  let deal = new Role();
  let ret = await deal.deleteRole(queryData.Id);
  if (ret === false) {
    this.LastError = deal.getLastError();
    this.Code = 301;
    return false;
  }
  return ret;
}

roles.prototype.doRead = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;
  
  let deal = new Role();
  let ret = await deal.queryRole(queryData);
  if (ret === false) {
    this.LastError = deal.getLastError();
    this.Code = 301;
    return false;
  }
  return ret;
}

roles.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

roles.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

roles.prototype.delete = async function(){
    let _this = this;
    let ret = await _this.doDelete();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess();
    } 
}

roles.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new roles(ctx);
    await instance.deal();
})
  
  
module.exports = router