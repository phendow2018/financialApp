const log4 = require('log4js')
const dir = __dirname;
let log = function (){
    this.config = {
        appenders: {
            WORK_LOG: { type: 'file', filename: `.\\log\\work-${(new Date()).toLocaleDateString()} ${(new Date()).getHours()}-${(new Date()).getMinutes()}-${(new Date()).getSeconds()}.log` },
            console: { type: 'console' }
        },
        categories: {
            cheese: { appenders: ['WORK_LOG'], level: 'info' },
            another: { appenders: ['console'], level: 'info' },
            default: { appenders: ['console', 'WORK_LOG'], level: 'info' }
        }
    },
    this.dir    = dir;
    this.Date   = (new Date()).toLocaleDateString();
    this.newLog(true);
    //this.pLog   = new log4.configure(this.config);
    this.WORK_LOG = this.pLog.getLogger('LOG_WORK');
}

log.prototype.newLog = function(flag = false){
    if(this.Date != (new Date()).toLocaleDateString() || flag){
        this.Date = (new Date()).toLocaleDateString();
        this.config.appenders.WORK_LOG.filename = `${this.dir}/../log/work-${this.Date}.log`;
        this.pLog = new log4.configure(this.config);
    }
}

log.prototype.writeLog = function (str, level){
    this.newLog();
    if(typeof(str) != 'string' || str.length < 1) return;
    if(level == 'TRACE'){
        this.WORK_LOG.trace(str);
    }else if(level == 'DEBUG'){
        this.WORK_LOG.debug(str);
    }else if(level == 'WARN'){
        this.WORK_LOG.warn(str);
    }else if(level == 'ERROR'){
        this.WORK_LOG.error(str);
    }else if(level == 'FATAL'){
        this.WORK_LOG.fatal(str);
    }else{
        level = 'INFO';
        this.WORK_LOG.info(str);
    }
}
module.exports = log;
