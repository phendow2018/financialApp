const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const Company = require('../../Class/financial/Company');

class CompanyExpain extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

CompanyExpain.prototype.checkUpdate = function(queryData) {
  if (!tools.isValidString(queryData.CompanyNumber)) {
    this.LastError = '无有效的CompanyNumber参数';
    this.Code = 102;
    return false;
  }
  return true;
}
CompanyExpain.prototype.doUpdate = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    if (!this.checkUpdate(queryData)) {
      return false;
    }

    let deal = new Company();
    let ret = await deal.modifyCompanyExplain(queryData.CompanyNumber, postData.Explain, postData.Operator);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return ret;
}

CompanyExpain.prototype.doRead = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;

    if (!this.checkUpdate(queryData)) {
      return false;
    }

    let deal = new Company();
    let ret = await deal.getCompanyExplain(queryData.CompanyNumber);
    if (ret === false) {
      this.LastError = deal.getLastError();
      this.Code = 301;
      return false;
    }

    return {data: ret};
}

CompanyExpain.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

CompanyExpain.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new CompanyExpain(ctx);
    await instance.deal();
})
  
  
module.exports = router