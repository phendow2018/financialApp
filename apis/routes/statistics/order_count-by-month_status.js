const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const OrderStatistics = require('../../Class/statistics/OrderStatistics');

class order_CountByMonthStatus extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

order_CountByMonthStatus.prototype.checkStartAndEndMonth = function(queryData) {
    if (tools.isYear(queryData.Year)) {
        return {
            StartMonth: `${queryData.Year}-01`,
            EndMonth: `${parseInt(queryData.Year)+1}-01`
        };
    } else {
        if (!tools.isMonth(queryData.StartMonth)) {
            this.LastError = `无有效Year参数 且 无有效的StartMonth参数`;
            this.Code = 101;
            return false;
        }
        if (!tools.isMonth(queryData.EndMonth)) {
            this.LastError = `无有效Year参数 且 无有效的EndMonth参数`;
            this.Code = 101;
            return false;
        }
        return {
            StartMonth: queryData.StartMonth,
            EndMonth: queryData.EndMonth,
        }
    }
}
order_CountByMonthStatus.prototype.doRead = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    
    let checkStartAndEndMonthRet = this.checkStartAndEndMonth(queryData);
    if (checkStartAndEndMonthRet === false) {
        return false;
    }

    let deal = new OrderStatistics();
    let ret = await deal.getCountGroupByMonthStatus(checkStartAndEndMonthRet.StartMonth, checkStartAndEndMonthRet.EndMonth);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

order_CountByMonthStatus.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new order_CountByMonthStatus(ctx);
    await instance.deal();
})
  
  
module.exports = router