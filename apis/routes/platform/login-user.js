const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools')
const LoginUserDeal = require('../../Class/common/LoginUser');

class LoginUser extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

LoginUser.prototype.create = async function(){
    let _this = this;
    let loginUser = new LoginUserDeal(_this.ctx);
    let postData  = _this.ctx.request.body;
    let ret = await loginUser.Login(postData.Account, postData.Password);

    if(ret === false){
        _this.Code = 301;
        _this.LastError = loginUser.getLastError();
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
        await _this.writeDBLog(postData.Account, `用户登录:${postData.Account}`);
    } 
}

LoginUser.prototype.delete = async function(){
    let _this = this;
    let loginUser = new LoginUserDeal(_this.ctx);
    let ret = await loginUser.Logout();
    if(ret === false){
        _this.Code = 301;
        _this.LastError = loginUser.getLastError();
        _this.responseError();
    }else{
        _this.responseSuccess();

        if (tools.isValidString(ret.Account))
            await _this.writeDBLog(ret.Account, `用户退出:${ret.Account}`);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new LoginUser(ctx);
    await instance.deal();
})
  
  
module.exports = router