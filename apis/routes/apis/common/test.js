const router = require('koa-router')()
let   global = require('../../../Common/Global');
let   Base   = require('../../../Common/Base')
const tools = require('../../../Common/tools');
const QichachaReport = require('../../../Class/reports/QichachaReport')

class test extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

test.prototype.read = async function(){
  let report = new QichachaReport();
  await report.makeReport('202001150001');
  this.response200({"test": "success"});
}

router.all('/',async (ctx, next) => {
  let instance = await new test(ctx);
  await instance.deal();
})
  
  
module.exports = router