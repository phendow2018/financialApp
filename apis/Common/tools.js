let os = require('os'); 
let uuid = require('node-uuid');
let mysql = require('mysql');
exports.MysqlEscape = mysql.escape;

exports.createUuid = function (){
    return uuid.v4().toUpperCase();
};

let IPv4     = [];
for(let t in os.networkInterfaces()){
    let info = os.networkInterfaces()[t];
    for(var i=0;i<info.length;i++){
        if(info[i].family=='IPv4' && info[i].address != "127.0.0.1"){
            IPv4.push(info[i].address);
        }
    }
}
exports.IPv4 = IPv4;
exports.getAddr = function(addr){
    for(let Ip of IPv4){
      let temaddr = addr.substring(0,addr.lastIndexOf('.'));
      let tempIp  = Ip.substring(0,Ip.lastIndexOf('.'));
      if(tempIp == temaddr){
        return Ip;
      }
    }
    return '127.0.0.1';
}

module.exports.getHostName = function () {
    return os.hostname();
}

Date.prototype.format = function(fmt){
    var o={
        "M+":this.getMonth()+1,//月份
        "d+":this.getDate(),//日
        "H+":this.getHours(),//小时
        "m+":this.getMinutes(),//分
        "s+":this.getSeconds(),//秒
        "q+":Math.floor((this.getMonth()+3)/3)//季度
        // "S+":this.getMilliseconds()//毫秒
    };
    if(/(y+)/.test(fmt)) fmt=fmt.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    if(new RegExp("(S+)").test(fmt)) {
        let str = `${this.getMilliseconds()}`;
        if (str.length < 1)
            str = '000';
        else if(str.length < 2)
            str = '00' + str;
        else if(str.length < 3)
            str = '0' + str;
        else 
            str = str;
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (str) : (("000" + str).substr(("" +str).length)));  
    }
    return fmt;
};

module.exports.isDate = function (dateString){
    try
    {
        if(typeof dateString != 'string' || dateString.trim()==""){
            return false;
        }
        var r=dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); 
        if(r==null){
            return false;
        }
        var d=new Date(r[1],r[3]-1,r[4]);   
        var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
        if(num==0){
            return false;
        }
        return (num!=0);
    }catch(e){
        return false
    }
 }
 
 module.exports.isDateTime = function (dateTimeString){
    try{
        if(dateTimeString.trim()==""){
            return false;
        }
        var r=dateTimeString.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})\s(\d{1,2})(:|\/)(\d{1,2})\6(\d{1,2})$/); 
        if(r==null){
            return false;
        }
        var d=new Date(r[1],r[3]-1,r[4]);   
        var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
        if(num==0){
            return false;
        }
        if(!(parseInt(r[5])<24 && parseInt(r[5]) >= 0) || !(parseInt(r[7]) < 60 && parseInt(r[7]) >= 0) || !(parseInt(r[8]) < 60 && parseInt(r[8]) >= 0)){
            return false;
        }
        return true;
    }catch(e){
        return false;
    }
}


 module.exports.isIpAddr = function (ipString){
    try{    
        if(typeof ipString != 'string' || ipString.trim()==""){
            return false;
        }
        var r=ipString.match(/^(\d{1,3})(.|\/)(\d{1,3})\2(\d{1,3})\2(\d{1,3})$/); 
        if(r==null){
            return false;
        }
        if(isNaN(parseInt(r[1])) || parseInt(r[1]) > 255 || parseInt(r[1]) <= 0)
            return false;
        if(isNaN(parseInt(r[3])) || parseInt(r[3]) > 255 || parseInt(r[3]) <= 0)
            return false;
        if(isNaN(parseInt(r[4])) || parseInt(r[4]) > 255 || parseInt(r[4]) <= 0)
            return false;
        if(isNaN(parseInt(r[5])) || parseInt(r[5]) > 255 || parseInt(r[5]) <= 0)
            return false;
        return true;
    }catch(e){
        return false
    }
 } 

 module.exports.isMulticastIpAddr = function (ipString){
    try{    
        if(typeof ipString != 'string' || ipString.trim()==""){
            return false;
        }
        var r=ipString.match(/^(\d{1,3})(.|\/)(\d{1,3})\2(\d{1,3})\2(\d{1,3})$/); 
        if(r==null){
            return false;
        }
        if(isNaN(parseInt(r[1])) || parseInt(r[1]) > 239 || parseInt(r[1]) < 224)
            return false;
        if(isNaN(parseInt(r[3])) || parseInt(r[3]) > 255 || parseInt(r[3]) <= 0)
            return false;
        if(isNaN(parseInt(r[4])) || parseInt(r[4]) > 255 || parseInt(r[4]) <= 0)
            return false;
        if(isNaN(parseInt(r[5])) || parseInt(r[5]) > 255 || parseInt(r[5]) <= 0)
            return false;
        return true;
    }catch(e){
        return false
    }
} 
module.exports.isTime = function (timeString){
    try{
        if(timeString.trim()==""){
            return false;
        }
        var r=timeString.match(/^(\d{1,2})(:|\/)(\d{1,2})\2(\d{1,2})$/); 
        if(r==null){
            return false;
        }
        if(!(parseInt(r[1])<24 && parseInt(r[1]) >= 0) || !(parseInt(r[3]) < 60 && parseInt(r[3]) >= 0) || !(parseInt(r[4]) < 60 && parseInt(r[4]) >= 0)){
            return false;
        }
        return true;
    }catch(e){
        return false;
    }
}

module.exports.isMonth = function (dateString){
    try
    {   
        if(typeof dateString != 'string' || dateString.trim()==""){
            return false;
        }
        var r=dateString.match(/^(\d{1,4})(-|\/)(\d{1,2})$/); //\2(\d{1,2})
        if(r==null){
            return false;
        }
        var d=new Date(r[1],r[3]-1);   //,r[4]
        var num = (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]);//&&d.getDate()==r[4]
        if(num==0){
            return false;
        }
        return (num!=0);
    }catch(e){
        return false;
    }
} 
 
module.exports.isDiscount = function (dateString){
    if(typeof dateString != 'string' && typeof dateString != 'number')
        return false;
    if(typeof dateString == 'number')
        dateString = dateString.toString(); 
    if(dateString.trim()==""){
        return false;
    }
    var r=dateString.match(/^(\d{1,6})(.|\/)(\d{1,6})$/); //\2(\d{1,2})
    if(r==null){
        return false;
    } 
    return true;
}

module.exports.isProductionCost = function (dateString){
    if(typeof dateString != 'string' && typeof dateString != 'number')
        return false;
    if(typeof dateString == 'number')
        dateString = dateString.toString(); 
    if(dateString.trim()==""){
        return false;
    }
    var r=dateString.match(/^(\d{1,18})(.|\/)(\d{1,2})$/); //\2(\d{1,2})
    if(r==null){
        return false;
    }
    return true;
}

module.exports.isTelephone = function (dateString){
    if(typeof dateString != 'string' && typeof dateString != 'number')
        return false;
    if(typeof dateString == 'number')
        dateString = dateString.toString(); 
    if(dateString.trim()==""){
        return false;
    }
    var r=dateString.match(/^(\d{11})$/); //\2(\d{1,2})
    if(r==null){
        return false;
    }
    return true;
}

module.exports.getInsertSql = function(params,tableName) {
    if(typeof params != "object")
        params = {};
    let key="";
    let values = "";
    for(let param in params){
        key    += `,\`${param}\``;
        if(typeof params[param] == "object" &&  params[param] != null)
            params[param] = JSON.stringify(params[param]);    
        values += `,${mysql.escape(params[param])}`;
    }   
    key    = key.substr(1,key.length);
    values = values.substr(1,values.length);
    return `INSERT INTO \`${tableName}\` (${key}) VALUES(${values})`;
}

module.exports.getUpdateSql = function(params,where,tableName) {
    if(typeof params != "object")
        params = {};
    if(typeof where != "object")
        params = {};
    let strSet="";
    let strWhere = "";
    for(let param in params){
        if(typeof params[param] == "object" &&  params[param] != null)
            params[param] = JSON.stringify(params[param]); 
        strSet    += `,\`${param}\` = ${mysql.escape(params[param])}`;
    }  
    for(let param in where){
        if(typeof where[param] == "object" &&  params[param] != null)
            where[param] = JSON.stringify(where[param]);
        strWhere    += ` AND \`${param}\` = ${mysql.escape(where[param])}`;
    }  
    strSet   = strSet.substr(1,strSet.length);
    strWhere = `1 = 1 ${strWhere.substr(1,strWhere.length)}`;

    if (strSet.length <= 0) {
        return `SELECT * FROM \`${tableName}\` WHERE ${strWhere}`;
    }

    return `UPDATE \`${tableName}\` SET ${strSet} WHERE ${strWhere}`;
}

module.exports.getDeleteSql = function(where, tableName = null) {
   let strWhere = this.getWhereSql(where, tableName);
   return `DELETE FROM \`${tableName}\` ${strWhere}`; 
}


module.exports.getWhereSql = function(where,tableName = null) {
    if(tableName != null)
        tableName = `\`${tableName}\`.`
    else    
        tableName = ``;    
    if(typeof where != "object")
        where = {};
    let strWhere = " Where 1 = 1 ";
    for(let param in where){
        if(typeof where[param] == "object" &&  params[param] != null)
            where[param] = JSON.stringify(where[param]);
        strWhere    += ` AND ${tableName}\`${param}\` = ${mysql.escape(where[param])}`;
    }  
    //strWhere = ` Where 1 = 1 ${strWhere.substr(1,strWhere.length)}`;
    return strWhere;
}

module.exports.isValidDateOfWeek = function (WeekString){
    try{
        if(WeekString.trim()==""){
            return false;
        }
        var r=WeekString.match(/^([1,2,3,4,5,6,7]{1,7})$/); 
        if(r==null){
            return false;
        }
        return true;
    }catch(e){
        return false;
    }
}

module.exports.isValidString = function(str) {
    try {
        if (typeof str === 'string' && str.trim().length > 0)
            return true;
    } catch(e) {
        return false;
    }
    return false;
} 

module.exports.isNumber = function (data) {
    if(typeof data == 'string'){
        var r=data.match(/^\d+$/); //\2(\d{1,2})
        let t=data.match(/^-(\d+)$/);
        if(r==null && t == null){
            return false;
        }
        return true;
    }
    if(typeof data == 'number')
       return true; 
    return false;
}

module.exports.isArray = function (o) {
    return Object.prototype.toString.call(o) === '[object Array]';
}

module.exports.isEmptyObject = function (data) {
    var arr = Object.keys(data);
    return arr.length === 0;
}

let startTime = new Date();
//获取当前软件的启动时间
module.exports.getStartTime = function() {
    return startTime.format('yyyy-MM-dd HH:mm:ss.S');
}
//获取当前软件的运行时长(毫秒数)
module.exports.getUpDuration = function() {
    let time = new Date();
    let ms = time - startTime;
    return ms;
}

module.exports.checkCommunity = function(Community) {
    if (typeof (Community) == 'object') {
        if (!this.isArray(Community)) {
            return `对象中Community格式错误`;
        }

        if (Community.length < 1) {
            return '对象中Community的数量不正确';
        }

        for (let i = 0, l = Community.length; i < l; i++) {
            if (typeof (Community[i].Type) != 'string') {
                return '对象中Community的Type属性未指定';
            }
            if (Community[i].Type == 'SNMP') {
                if (typeof (Community[i].Attributes) != 'object') {
                  return '对象SNMP协议的属性未指定';
                }
                if (typeof (Community[i].Attributes.Version) != 'string') {
                    return '对象SNMP协议的Version属性未指定';
                }
                if (Community[i].Attributes.Version != 'SNMPv1' && Community[i].Attributes.Version != 'SNMPv2' && Community[i].Attributes.Version != 'SNMPv3') {
                    return '对象SNMP协议的Version属性不在指定范围内，指定范围SNMPv1、v2、v3';
                }
                if (typeof (Community[i].Attributes.RetryCount) != 'number') {
                    return '对象SNMP协议的RetryCount属性未指定';
                }
                if (Community[i].Attributes.RetryCount < 1 || Community[i].Attributes.RetryCount > 10) {
                    return '对象SNMP协议的RetryCount不在指定范围内[1-10]';
                }
                if (typeof (Community[i].Attributes.TimeOut) != 'number') {
                    return '对象SNMP协议的TimeOut属性未指定';
                }
                if (Community[i].Attributes.TimeOut < 5 || Community[i].Attributes.TimeOut > 10000) {
                    return '对象SNMP协议的TimeOut不在指定范围内[5-10000]';
                }
                if (typeof (Community[i].Attributes.PortNum) != 'number') {
                    return '对象SNMP协议的PortNum属性未指定';
                }
                if (Community[i].Attributes.PortNum < 1 || Community[i].Attributes.PortNum > 65535) {
                    return '对象SNMP协议的PortNum不在指定范围内[1-65535]';
                }
                if (typeof (Community[i].Attributes.IpAddr) != 'string') {
                    return '对象SNMP协议的IpAddr属性未指定';
                }
                var p = Community[i].Attributes.IpAddr.trim().split('.');
                if (typeof (p) != 'object' || p.length != 4) {
                    return '对象SNMP协议的IpAddr不合法';
                }
                for (var j = 0; j < 4; j++) {
                    var temp_int = parseInt(p[j], 10);
                    if (isNaN(temp_int) || temp_int < 0 || temp_int > 255) {
                        return '对象SNMP协议的IpAddr不合法';
                    }
                }
            } else if (Community[i].Type == 'HTTP' || Community[i].Type == 'HTTPS' || Community[i].Type == 'UDP' || Community[i].Type == 'TCP') {
                if (typeof (Community[i].Attributes) != 'object') {
                    return '对象' + Community[i].Type + '协议的属性未指定';
                }
                if (typeof (Community[i].Attributes.IpAddr) != 'string') {
                    return '对象' + Community[i].Type + '协议的IpAddr属性未指定';
                }
                var p = Community[i].Attributes.IpAddr.trim().split('.');
                if (typeof (p) != 'object' || p.length != 4) {
                    return '对象' + Community[i].Type + '协议的IpAddr不合法';
                }
                for (var j = 0; j < 4; j++) {
                    var temp_int = parseInt(p[j], 10);
                    if (isNaN(temp_int) || temp_int < 0 || temp_int > 255) {
                        return '对象' + Community[i].Type + '协议的IpAddr不合法';
                    }
                }
                if (!isNumber(Community[i].Attributes.PortNum)) {
                    return '对象' + Community[i].Type + '协议的PortNum属性未指定';
                }
                Community[i].Attributes.PortNum = parseInt(Community[i].Attributes.PortNum);
                if (Community[i].Attributes.PortNum < 1 || Community[i].Attributes.PortNum > 65535) {
                    return '对象' + Community[i].Type + '协议的PortNum不在指定范围内[1-65535]';
                }
            } else if (Community[i].Type == 'COM') {
                if (typeof (Community[i].Attributes.PortNum) != 'number') {
                    return '对象COM协议的PortNum属性未指定';
                }
                if (Community[i].Attributes.PortNum < 1 || Community[i].Attributes.PortNum > 256) {
                    return '对象COM协议的PortNum不在指定范围内[1-256]';
                }
                if (typeof (Community[i].Attributes.Baud) != 'number') {
                    return '对象COM协议的Baud属性未指定';
                }
                if (Community[i].Attributes.Baud != 50 && Community[i].Attributes.Baud != 75 && Community[i].Attributes.Baud != 110 && Community[i].Attributes.Baud != 134 &&
                    Community[i].Attributes.Baud != 150 && Community[i].Attributes.Baud != 300 && Community[i].Attributes.Baud != 600 && Community[i].Attributes.Baud != 1200 &&
                    Community[i].Attributes.Baud != 1800 && Community[i].Attributes.Baud != 2400 && Community[i].Attributes.Baud != 4800 && Community[i].Attributes.Baud != 7200 &&
                    Community[i].Attributes.Baud != 9600 && Community[i].Attributes.Baud != 19200 && Community[i].Attributes.Baud != 38400 && Community[i].Attributes.Baud != 57600 &&
                    Community[i].Attributes.Baud != 115200 && Community[i].Attributes.Baud != 230400 && Community[i].Attributes.Baud != 460800 && Community[i].Attributes.Baud != 921600 &&
                    Community[i].Attributes.Baud != 31250) {//xl add 适应调音台
                    return '对象COM协议的Baud不在指定范围内';
                }
                if (typeof (Community[i].Attributes.Bits) != 'number') {
                    return '对象COM协议的Bits属性未指定';
                }
                if (Community[i].Attributes.Bits < 5 || Community[i].Attributes.Bits > 8) {
                    return '对象COM协议的Bits不在指定范围内[5-8]';
                }
                if (typeof (Community[i].Attributes.Stop) != 'number') {
                    return '对象COM协议的Stop属性未指定';
                }
                if (Community[i].Attributes.Stop < 0 || Community[i].Attributes.Stop > 2) {
                    return '对象COM协议的Stop不在指定范围内[5-8]';
                }
                if (typeof (Community[i].Attributes.Parity) != 'string') {
                    return '对象COM协议的Parity属性未指定';
                }
                if (Community[i].Attributes.Parity != 'NONE' && Community[i].Attributes.Parity != 'EVEN' &&
                    Community[i].Attributes.Parity != 'ODD' && Community[i].Attributes.Parity != 'SPC' && Community[i].Attributes.Parity != 'MRK' &&
                    Community[i].Attributes.Parity != 'none' && Community[i].Attributes.Parity != 'even' &&
                    Community[i].Attributes.Parity != 'odd' && Community[i].Attributes.Parity != 'spc' && Community[i].Attributes.Parity != 'mrk') {
                    return '对象COM协议的Parity不在指定范围内';
                }
            } else {
                return '对象中Community的协议类型暂时不支持';
            }
        }
    } else {
        if (typeof (object.Community) != 'undefined') {
            return '对象中Community属性定义不正确';
        }
    }
    return true;
}

module.exports.toHexString = function(data) {
    let configStr = `0x`;
    if (typeof data === 'object') {
      let configJsonStr = JSON.stringify(data);
      let buf = Buffer.from(configJsonStr);
      configStr = `0x${buf.toString('hex')}`
    } else {
      try {
        let configJsonStr = `${data}`;
        let buf = Buffer.from(configJsonStr);
        configStr = `0x${buf.toString('hex')}`;
      } catch(e) {}
    }
    return configStr;
}