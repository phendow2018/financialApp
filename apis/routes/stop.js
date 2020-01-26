const router = require('koa-router')();
let Base = require('../Common/Base');
let log = require('../Common/Global').log;

class Stop extends Base {
  constructor(ctx) {
    super(ctx);
    this.ExitProcess = false;
  }

  async create() {
    this.responseSuccess( {
      result: {
        code: 0,
        message: 'set success'
      }
    } );
    this.ExitProcess = true;
  }
}

router.all('/',async (ctx, next) => {
  let obj = new Stop(ctx);
  await obj.deal();
  setTimeout(function() {
    log.writeLog("--------------------进程退出--------------------");
	  process.exit(0);
  }, 10);
});

module.exports = router