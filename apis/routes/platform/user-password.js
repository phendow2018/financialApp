const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');

class UserPassword extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

UserPassword.prototype.doUpdate = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    let retData = {};
    if(typeof queryData.Account != 'string' || queryData.Account.trim().length == 0){
        _this.LastError = `缺少用户名`;
        return false;
    }else if(typeof postData.OldPassword != 'string' || postData.OldPassword.trim().length == 0){
        _this.LastError = `缺少原密码`;
        return false;
    }else if(typeof postData.NewPassword != 'string' || postData.NewPassword.trim().length == 0){
        _this.LastError = `缺少新密码`;
        return false;
    }
    let Sql = `Select Count(*) AS Count From user Where Account = ${tools.MysqlEscape(queryData.Account)} AND Password = ${tools.MysqlEscape(postData.OldPassword)}`
    let Count = await _this.dbLink.query(Sql);
    if(Count === false){
        _this.LastError = _this.dbLink.getLastError();
        return false;
    }else if(Count[0].Count <= 0){
        _this.LastError = `原账号密码错误`;
        return false;   
    }

    Sql = `update user set Password = ${tools.MysqlEscape(postData.NewPassword)} Where Account = ${tools.MysqlEscape(queryData.Account)} `
    let ret = await _this.dbLink.query(Sql);
    if(ret === false){
        _this.LastError = _this.dbLink.getLastError();
        return false;
    }

    await _this.writeDBLog(queryData.Account, `修改密码:账号(${queryData.Account})`);
    return {Account:queryData.Account};
}

UserPassword.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new UserPassword(ctx);
    await instance.deal();
})
  
module.exports = router