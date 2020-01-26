var net = require("net");

class TCPSocket {
    constructor(host,port,on_data,on_end,on_error,on_connect){
        this.port = port;
        this.host = host;
        this.lastErrorCode = 0;
        this.lastErrorStr  = "";

        this.on_data    = on_data;
        this.on_end     = on_end;
        this.on_error   = on_error;
        this.on_connect = on_connect;

        this.socket = net.createConnection(this.port,this.host,this.on_connect);
        this.socket.on('data',this.on_data);
        this.socket.on('end',this.on_end);
        this.socket.on('error',this.on_error);

        this.socket.tcpLastData = "";
        
    }
}

TCPSocket.prototype.get_lastErrorCode = function(){
    return this.lastErrorCode;
}

TCPSocket.prototype.get_lastErrorStr = function(){
    return this.lastErrorStr;
}

TCPSocket.prototype.get_connect_status = function(){
    let ret = this.socket.connecting;
    return ret;
}

TCPSocket.prototype.send_data = async function(data){
    this.socket.write(data);
}

TCPSocket.prototype.re_connected = async function(){
    let tcpLastData = this.socket.tcpLastData;
    this.socket.destroy();
    this.socket = net.createConnection(this.port,this.host,this.on_connect);
    this.socket.on('data',this.on_data);
    this.socket.on('end',this.on_end);
    this.socket.on('error',this.on_error);

    this.socket.tcpLastData = tcpLastData;
}

TCPSocket.prototype.dis_connect = async function()
{
    this.socket.destroy();
}

module.exports = TCPSocket;