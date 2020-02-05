const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const OrderStatistics = require('../../Class/statistics/OrderStatistics');

class order_CountByStatus extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

order_CountByStatus.prototype.doRead = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;

    let deal = new OrderStatistics();
    let ret = await deal.getCountGroupByStatus();
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

order_CountByStatus.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new order_CountByStatus(ctx);
    await instance.deal();
})
  
  
module.exports = router