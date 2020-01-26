const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
const DBLog = require('../../Class/common/DBLog');

class logs extends Base{
  constructor(ctx){
    super(ctx);
  }
}

logs.prototype.doCreate = async function() {
  let dbLog = new DBLog(); 
  let postData  = this.ctx.request.body;
  let ret = await dbLog.writeLog(postData.User, postData.Position, postData.Module, postData.Content);
  if (ret === false) {
    this.Code = 301;
    this.LastError = dbLog.getLastError();
    return false;
  }
  return ret;
}

logs.prototype.doRead = async function(){
    let dbLog = new DBLog(); 
    let queryData = this.ctx.query;
    let ret = await dbLog.searchLog(queryData);
    if (ret === false) {
        this.Code = 301;
        this.LastError = dbLog.getLastError();
        return false;
    }
    return ret;
}

logs.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

logs.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new logs(ctx);
    await instance.deal();
})
  
  
module.exports = router