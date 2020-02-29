const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const CompanyStatistics = require('../../Class/statistics/CompanyStatistics');

class CompaynCount extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

CompaynCount.prototype.doRead = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;

    let deal = new CompanyStatistics();
    let ret = await deal.getCount();
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

CompaynCount.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new CompaynCount(ctx);
    await instance.deal();
})
  
  
module.exports = router