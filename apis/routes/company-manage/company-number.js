const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const CompanyNumber = require('../../Class/financial/CompanyNumber');

class company_number extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

company_number.prototype.checkUpdate = function(queryData, postData) {
  if (!tools.isValidString(queryData.CompanyNumber)) {
    this.LastError = '无有效的CompanyNumber参数';
    this.Code = 102;
    return false;
  }

  if (!tools.isValidString(postData.Operator)) {
    this.LastError = '无有效的Operator参数';
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.CompanyNumber)) {
    this.LastError = '无有效的新CompanyNumber参数';
    this.Code = 101;
    return false;
  }

  return true;
}
company_number.prototype.doUpdate = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    if (!this.checkUpdate(queryData, postData)) {
      return false;
    }

    let deal = new CompanyNumber();
    let ret = await deal.modifyCompanyNumber(queryData.CompanyNumber, postData.CompanyNumber, postData.Operator);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

company_number.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new company_number(ctx);
    await instance.deal();
})
  
  
module.exports = router