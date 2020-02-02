const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const Company = require('../../Class/financial/Company');

class companies_detail extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

companies_detail.prototype.doRead = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;

    let deal = new Company();
    let ret = await deal.queryCompanyDeatil(queryData);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

companies_detail.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new companies_detail(ctx);
    await instance.deal();
})
  
  
module.exports = router