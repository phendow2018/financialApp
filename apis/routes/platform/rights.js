const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const UserRights = require('../../Class/platform/UserRights');

class rights extends Base{
  constructor(ctx){
    super(ctx);
  }
}

rights.prototype.doRead = async function() {
  let queryData = this.ctx.query;
  if (!tools.isValidString(queryData.Account)) {
    this.LastError = `无有效的Account字段`;
    this.Code = 101;
    return false;
  }

  let deal = new UserRights(); 
  let ret = await deal.getRoles(queryData.Account);
  if (ret === false) {
    this.Code = 301;
    this.LastError = deal.getLastError();
    return false;
  }
  return {data: ret};
}

rights.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new rights(ctx);
    await instance.deal();
})
  
  
module.exports = router