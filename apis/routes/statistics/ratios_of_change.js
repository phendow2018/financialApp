const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const RatiosOfChangeDeal = require('../../Class/statistics/RatiosOfChange');

class RatiosOfChange extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

RatiosOfChange.prototype.checkCreate = function(postData) {
    if (typeof postData.Statements == 'undefined') {
        this.LastError = `无有效的Statements字段`;
        this.Code = 101;
        return false;
    }
    return true;
}

RatiosOfChange.prototype.doCreate = async function() {
    let _this = this;
    let postData  = _this.ctx.request.body;
  
    let checkRet = _this.checkCreate(postData);
    if (checkRet === false) {
      return false;
    }
  
    let arr = []
    let ratios = new RatiosOfChangeDeal();
    for (let s of postData.Statements) {
        let ratiosRet = await ratios.getRatiosOfChange(s.CompanyNumber, s.Year, s.Type);
        arr.push(ratiosRet);
    }

    return {data: arr};
}

RatiosOfChange.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new RatiosOfChange(ctx);
    await instance.deal();
})
  
  
module.exports = router