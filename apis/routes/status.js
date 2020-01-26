const router = require('koa-router')();
let Base = require('../Common/Base');
let tools = require('../Common/tools');

class Status extends Base {
  constructor(ctx) {
    super(ctx);
  }

  async read() {
    this.responseSuccess( {
      result: {
        code: 0,
        message: 'get success'
      },
      values: {
        Status: "running",
        StartTime: tools.getStartTime(),
        UpTime: tools.getUpDuration()
      }
    } );
  }
}


router.all('/',async (ctx, next) => {
  let obj = new Status(ctx);
  await obj.deal();
});

module.exports = router