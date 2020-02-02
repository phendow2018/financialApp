const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const User = require('../../Class/platform/User');
const UserRole = require('../../Class/platform/UserRole');

class users_roles extends Base{
  constructor(ctx){
    super(ctx);
  }
}

users_roles.prototype.doUpdate = async function() {
  let queryData = this.ctx.query;
  let postData  = this.ctx.request.body;
  if (!tools.isValidString(queryData.UserAccount)) {
    this.LastError = '无有效的UserAccount字段';
    this.Code = 101;
    return false;
  }
  if (!tools.isArray(postData)) {
    this.LastError = '关联角色不为数组形式';
    this.Code = 101;
    return false;
  }

  let deal = new UserRole(); 
  let ret = await deal.relateByUser(queryData.UserAccount, postData);
  if (ret === false) {
    this.Code = 301;
    this.LastError = deal.getLastError();
    return false;
  }
  return ret;
}

users_roles.prototype.doRead = async function() {
  let queryData = this.ctx.query;
  let postData  = this.ctx.request.body;
  if (!tools.isValidString(queryData.UserAccount)) {
    this.LastError = '无有效的UserAccount字段';
    this.Code = 101;
    return false;
  }

  let deal = new User(); 
  let ret = await deal.queryUser({Account: queryData.UserAccount});
  if (ret === false) {
    this.Code = 301;
    this.LastError = deal.getLastError();
    return false;
  }
  if (!tools.isArray(ret.data) || ret.data.length <= 0) {
    this.Code = 302;
    this.LastError = `未找到指定用户`;
    return false;
  }
  let data = ret.data[0];

  let dealRole = new UserRole(); 
  let retRole = await dealRole.queryRoleByUser(queryData.UserAccount);
  if (retRole === false) {
    this.Code = 301;
    this.LastError = dealRole.getLastError();
    return false;
  }
  data.Roles = retRole.data;

  return {data: data};
}

users_roles.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

users_roles.prototype.read = async function() {
  let _this = this;
  let ret = await _this.doRead();
  if(ret === false){
    _this.responseError();
  }else{
    _this.responseSuccess(ret);
  }
}

router.all('/',async (ctx, next) => {
    let instance = await new users_roles(ctx);
    await instance.deal();
})
  
  
module.exports = router