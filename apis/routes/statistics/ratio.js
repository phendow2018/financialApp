const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const CompanyStatement = require('../../Class/financial/CompanyStatement');
const RatioDeal = require('../../Class/statistics/Ratio');

class Ratio extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

Ratio.prototype.checkCreate = function(postData) {
    if (typeof postData.Statements == 'undefined') {
        this.LastError = `无有效的Statements字段`;
        this.Code = 101;
        return false;
    }
    return true;
}

Ratio.prototype.doCreate = async function() {
    let _this = this;
    let postData  = _this.ctx.request.body;
  
    let checkRet = _this.checkCreate(postData);
    if (checkRet === false) {
      return false;
    }
  
    let arr = [];

    let companyStatement = new CompanyStatement();
    let ratio = new RatioDeal();
    for (let s of postData.Statements) {
        let ret = await companyStatement.checkExist(s.CompanyNumber, s.Year, s.Type)
        if (ret === false) {
            continue;
        }

        let ratioRet = await ratio.getRatio(s.CompanyNumber, s.Year, s.Type);
        let retItem = {
            CompanyNumber: s.CompanyNumber,
            Year: s.Year,
            Type: s.Type,
            FinancialRatio: ratioRet
        }
        arr.push(retItem);
    }

    return {data: arr};
}

Ratio.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new Ratio(ctx);
    await instance.deal();
})
  
  
module.exports = router