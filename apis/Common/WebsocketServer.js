var WebSocket = require("ws");
let log = require('./Global').log;

var WebSocketServer = function(port=8808){
    this._port = port;
    this._con = null; 
    this.connect();
    this._clientCon = [];
}

WebSocketServer.prototype.connect = function(){
    let _this = this;
    _this._con = new WebSocket.Server({ port: _this._port});//创建一个WebSocketServer的实例，监听端口8080
    _this._con.on('connection', function connection(conn) {
        _this._clientCon.push(conn);
        conn.on('message', function incoming(message) {
          console.log('received: %s', message);
          //_this.sendMsg('Hi Client');
        });
    });

}

WebSocketServer.prototype.sendMsg = async function(Msg){
    let _this = this;
    for(let i = 0; i < _this._clientCon.length; i++){
        if(_this._clientCon[i]._closeCode == 1006)
             _this._clientCon[i].send(Msg);
             //await _this._clientCon[i].send(Msg);  
        else{
            _this._clientCon[i].close();
            _this._clientCon.splice(i--,1);
        }
    }
}

module.exports = WebSocketServer;