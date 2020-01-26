let log = require('./Global').log;
const tools = require('./tools');
const ServerLog = require('../Class/common/ServerLog');
const LoginUser = require('../Class/common/LoginUser');
let baseServerLog = new ServerLog();

class Base {
  constructor(ctx) {
    this.ctx = ctx;
    this.LastError  = "未知错误"; 
    this.Code       = 0; //1001--未知错误;101--参数不符合要求; 201--已存在的数据; 301--数据库执行错误;
    this.responseStatus = 1;//0表示成功的返回，1表示错误的返回
    this.LoginUser = new LoginUser(ctx);
  }

  getLastError() {
    return this.LastError;
  }

  responseError(err={}) {
    this.responseStatus = 1;
    if(typeof err.result == "undefined")
        err = {
                Code :1001,
                Message: "未知错误"
            };
    err.Code = this.Code;
    let error = this.getLastError();
    if (typeof error == 'string')
        err.Message = error;
    else 
        err.Message = JSON.stringify(error);
    this.ctx.status = 422;
    this.ctx.body = err;
  }

  response200(message={}) {
    this.responseStatus = 0;
    this.ctx.status = 200;
    this.ctx.body = message;
  }

  responseSuccess(message={}) {
    this.responseStatus = 0;
    let method = this.ctx.request.method.toUpperCase();
    if(method == "GET")
        this.ctx.status = 200;
    else if(method == "POST")
        this.ctx.status = 201;
    else if(method == "PUT")
        this.ctx.status = 201;
    else if(method == "DELETE")
        this.ctx.status = 204;
    this.ctx.body = message;
  }

  async deal() {
    this.ctx.deal = true;
    let method = this.ctx.request.method.toLocaleLowerCase();
    //刷新cookie
    // await this.LoginUser.Refresh();
    try{
      if(method == "get" && typeof this.read == "function"){            
        await this.read();
      }
      else if(method == "post" && typeof this.create == "function"){
        await this.create();
      }
      else if(method == "put" && typeof this.update == "function"){
        await this.update();
      }
      else if(method == "delete" && typeof this.delete == "function"){
        await this.delete();
      }
      else{
        this.LastError = `请求的方法不存在`
        this.responseError();
      }
    }catch(e){
        this.LastError = e;
        this.responseError();
    }  
    let flag = this.responseStatus == 0 ? false : true;
    if(method != "get"){
        this.writeLog(flag);
    }
  }

  async writeLog(err=false) {
    let Method = this.ctx.request.method.toLocaleLowerCase();
    let Ip = this.ctx.request.ip.substr(this.ctx.request.ip.indexOf(':',3)+1,this.ctx.request.ip.length);
    let Url = this.ctx.request.originalUrl;
    let postData = this.ctx.request.body;
    let queryData = this.ctx.query;
    let strLog = `Request Ip:${Ip};  Url:${Url};  Method:${Method}  QueryData:${JSON.stringify(queryData)}; PostData:${JSON.stringify(postData)};`;
    if(err){
        strLog +=` Error:${this.LastError}`;
        log.writeLog(strLog, `ERROR`); 
    }else{
        log.writeLog(strLog);  
    }      
  }

  async writeDBLog(Account, Content) {
    let Module = "";
    let Url = this.ctx.originalUrl;
    if(Url.indexOf("/financial-management/api/v1/platform") >= 0){
      Module = "系统管理模块";
    }else if(Url.indexOf("/financial-management/api/v1/order-manage") >= 0){
      Module = "订单管理模块";
    }else if(Url.indexOf("/financial-management/api/v1/company-manage") >= 0){
      Module = "企业管理模块";
    }else if(Url.indexOf("/apis/v1") >= 0){
      Module = "系统接口";
    }else {
      Module = "未定义模块";
    }

    await baseServerLog.write(Account, Module, Content);
  }
}

module.exports = Base;