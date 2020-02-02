const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const UserRole = require('../../Class/platform/UserRole');

class roles_users extends Base{
  constructor(ctx){
    super(ctx);
  }
}

roles_users.prototype.doUpdate = async function() {
  let queryData = this.ctx.query;
  let postData  = this.ctx.request.body;
  if (!tools.isValidString(queryData.RoleId)) {
    this.LastError = '无有效的RoleId字段';
    this.Code = 101;
    return false;
  }
  if (!tools.isArray(postData)) {
    this.LastError = '关联角色不为数组形式';
    this.Code = 101;
    return false;
  }

  let deal = new UserRole(); 
  let ret = await deal.relateByRole(queryData.RoleId, postData);
  if (ret === false) {
    this.Code = 301;
    this.LastError = deal.getLastError();
    return false;
  }
  return ret;
}

roles_users.prototype.doRead = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;
  if (!tools.isValidString(queryData.RoleId)) {
    this.LastError = '无有效的RoleId字段';
    this.Code = 101;
    return false;
  }
  
  let deal = new UserRole();
  let ret = await deal.queryUsersByRole(queryData.RoleId);
  if (ret === false) {
    this.LastError = deal.getLastError();
    this.Code = 301;
    return false;
  }
  return ret;
}

roles_users.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

roles_users.prototype.read = async function(){
  let _this = this;
  let ret = await _this.doRead();
  if(ret === false){
      _this.responseError();
  }else{
      _this.responseSuccess(ret);
  } 
}

router.all('/',async (ctx, next) => {
    let instance = await new roles_users(ctx);
    await instance.deal();
})
  
  
module.exports = router