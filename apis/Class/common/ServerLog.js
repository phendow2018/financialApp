const tools = require('../../Common/tools');
const global = require('../../Common/Global');
const DBLog = require('./DBLog');

class ServerLog {
    constructor() {
        this.dbLink = global.database;
        this.LastError = ``;
        this.dbLog = new DBLog(); 
    }
    getLastError() {
        return this.LastError;
    }
}

ServerLog.prototype.GetUser = async function(token){
    let _this = this;
    let UserAccount = "";
    if(!tools.isValidString(token)){
        return UserAccount;
    }
    let sql = `SELECT UserAccount From login_user Where Id = ${tools.MysqlEscape(token)}`;
    let ret = await _this.dbLink.query(sql);
    if(ret === false || ret.length <= 0){
        _this.LastError = _this.dbLink.getLastError();
        return UserAccount;
    }
    UserAccount = ret[0].UserAccount;
    return UserAccount;
}

ServerLog.prototype.write = async function(UserAccount, Module, Content){
    try {
        // let user = await this.GetUser(token);
        await this.dbLog.writeLog(UserAccount, '', Module, Content);
    } catch(e) {

    }
}

module.exports = ServerLog