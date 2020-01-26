const fs = require('fs');

//此模块中包含一些全局使用的模块，模块内都已经创建OK，外部直接使用
let Log = require('./log');
let log = new Log();

let database = require('./Database/Database');
// let databaseStatus = require('./Database/DatabaseStatus');
let config = require('../config.json'); 

let agent = {
  Addr: '127.0.0.1',
  HttpPort: 8122,
  Url: `http://127.0.0.1:8122`
};

// let MACRO = {};
// if(fs.existsSync(`${__dirname}/../MACRO.js`))
//   MACRO = require('../MACRO');

let _exports = {
  // MACRO: MACRO,
  config:config,      //全局配置信息
  log:log,            //全局日志类导出
  database:database,  //全局数据库类导出
  // databaseStatus:databaseStatus,//全局数据库类导出，状态查询的数据库
  websocketServer:null,//全局websocket服务，用于向客户端发送消息
  agent:agent,         //全局代理url
  webSocketSendMsg:null//
}

_exports.webSocketSendMsg = function(Msg){
  if(this.websocketServer === null)
    return;
  if(typeof Msg !== "string")
    Msg = JSON.stringify(Msg);
  this.websocketServer.sendMsg(Msg);
}

module.exports = _exports