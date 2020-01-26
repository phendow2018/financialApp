const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const CompanyStatement = require('../../Class/financial/CompanyStatement');

class statements_batch extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

statements_batch.prototype.checkCreate = function(postData) {
  if (!tools.isArray(postData)) {
    this.LastError = '所传数据不为数组格式，不能进行批量操作';
    this.Code = 101;
    return false;
  }
  return true;
}
statements_batch.prototype.checkCreateOne = function(postData) {
  if (!tools.isValidString(postData.CompanyNumber)) {
    return '无有效的CompanyNumber参数';
  }
  if (!tools.isNumber(postData.Year)) {
    return '无有效的Year参数';
  }
  if (!tools.isNumber(postData.Type)) {
    return '无有效的Type参数';
  }
  return true;
}
statements_batch.prototype.doCreate = async function() {
    let _this = this;
    let postData  = _this.ctx.request.body;
    if (!_this.checkCreate(postData)) {
      return false;
    }

    let ret = [];
    let deal = new CompanyStatement();
    for (let statement of postData) {
      let retOne = {
        CompanyNumber: statement.CompanyNumber,
        Year: statement.Year,
        Type: statement.Type
      }
      let checkOneRet = this.checkCreateOne(statement);
      if (checkOneRet !== true) {
        retOne.Result = {
          Code: 101,
          Message: checkOneRet
        }
      } else {
        let dealRet = await deal.createOrModify(statement);
        if (dealRet === false) {
          retOne.Result = {
            Code: 301,
            Message: deal.getLastError()
          }
        } else {
          retOne.Result = {
            Code: 0,
            Message: 'success'
          }
        }
      }
      ret.push(retOne);
    }

    return ret;
}

statements_batch.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new statements_batch(ctx);
    await instance.deal();
})
  
  
module.exports = router