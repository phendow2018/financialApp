const global = require('../../Common/Global');
const tools = require('../../Common/tools');
const UserRights = require('../platform/UserRights');
const crypto = require('crypto'); 
const crc32 = require('js-crc').crc32;

const TokenKey = 'Token';
const AccountKey = 'UserAccount';
const UserNameKey = 'UserName';
const key = Buffer.from('9vApxLk5G3PAsJrM', 'utf8');//公钥
const iv = Buffer.from('FnJL7EDzjqWjcaY9', 'utf8');//私钥

class LoginUser {
  constructor(ctx) {
    this.dbLink = global.database;
    this.ctx = ctx;
    this.LastError = '';
  }
  getLastError() {
    return this.LastError;
  }

  /** 创建token */
  createToken(account) {
    let validTime = (new Date()).getTime() + 100*24*60*60*1000;
    let data = `${account}#${validTime}`;
    let hash = this.aseEncode(data);
    let crc = crc32(hash);
    // data = this.aseDecode(hash);
    let token = crc+hash;
    return token;
  }

  /** 验证token */
  checkToken(token) {
    if (!tools.isValidString(token)) {//token是无效字符串
      return false;
    }

    let crc = token.substring(0, 8);
    let hash = token.substring(8, token.length);
    let checkCrc = crc32(hash);
    if (checkCrc != crc) {//校验码对
      return false;
    }

    let data = this.aseDecode(hash);
    let arr = data.split("#");
    if (arr.length < 2) {//格式不正确
      false;
    }
    let account = arr[0];
    let validTime = arr[1];
    if (!tools.isNumber(validTime)) {//格式不正确
      return false;
    }
    let now = (new Date()).getTime();//验证过期先取消
    if (now > validTime) {//过期了
      return false;
    }
    return {
      Account: account,
      ValidTime: validTime
    };
  }

  /** 刷新token */
  getRefreshToken(token) {
    let checkTokenRet = this.checkToken(token);
    if (checkTokenRet === false) {
      return false;
    }
    
    return this.createToken(checkTokenRet.Account);
  }

  /** 登录 */
  async Login(user, password) {
    let _this = this;
    if(!tools.isValidString(user)){
        _this.LastError = `缺少用户名`;
        return false;
    }
    if(!tools.isValidString(password)){
        _this.LastError = `缺少密码`;
        return false;
    }
    let sql = `Select Account, Name From user Where Account = ${tools.MysqlEscape(user)} AND Password = ${tools.MysqlEscape(password)}`
    let ret = await _this.dbLink.query(sql);
    if(ret === false){
        _this.LastError = _this.dbLink.getLastError();
        return false;
    }else if(ret.length <= 0){
        _this.LastError = `账号密码错误`;
        return false;   
    }
    let UserName = ret[0].Name;
    let UserNameBase64 = Buffer.from(UserName).toString('base64');
    let Token = this.createToken(user);

    let userRightsDeal = new UserRights();
    let rightsRet = await userRightsDeal.getRoles(user);
    if (rightsRet === false) {
      rightsRet = [];
    }

    _this.setCookie(TokenKey, Token, 30*60);
    _this.setCookie(AccountKey, user, 30*60);
    _this.setCookie(UserNameKey, UserNameBase64, 30*60);
    return {
      Token: Token,
      UserAccount: user,
      UserName: UserName,
      Roles: rightsRet,
    };
  }

  /** 退出 */
  async Logout() {
    let _this = this;
    let queryData = _this.ctx.query;
    if(!tools.isValidString(queryData.Token)){
        _this.LastError = `缺少Token`;
        return false;
    }
    let token = _this.ctx.cookies.get(TokenKey);
    if (token != queryData.Token) {
      _this.LastError = '当前的Token与需要删除的Token不一致';
      return false;
    }
    let userAccount = _this.ctx.cookies.get(AccountKey);

    _this.deleteCookie(TokenKey);
    _this.deleteCookie(AccountKey);
    _this.deleteCookie(UserNameKey);
    return {Account:userAccount};
  }

  /** 刷新cookie */
  async Refresh() {
    let token = this.ctx.cookies.get(TokenKey);
    let newToken = this.getRefreshToken(token);
    if (newToken === false) {
      return;
    } 

    // this.setCookie(TokenKey, token);
    // _this.setCookie(AccountKey, user);
    // _this.setCookie(UserNameKey, UserName);
  }
}

LoginUser.prototype.setCookie = function(key,value,expires = 0/** 有效时间 秒 */){
  if(!tools.isValidString(key))
      return;
  if(!tools.isValidString(value))
      return;

  if (tools.isNumber(expires) && parseInt(expires) > 0) {
    let time = (new Date()).getTime() + expires*1000;
    let expirestime = new Date(time);
    this.ctx.cookies.set(key, value,{httpOnly:false,MaxAge:expires,expires:expirestime});
  }
  else {
    this.ctx.cookies.set(key, value);
  }
}

LoginUser.prototype.deleteCookie = function(key){
  if(!tools.isValidString(key))
      return;
  this.ctx.cookies.set(key, '',{httpOnly:false,MaxAge:0,expires:(new Date('1969-1-1'))});
}

LoginUser.prototype.aseEncode = function(data) {

  // 如下方法使用指定的算法与密码来创建cipher对象
  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);

  // 使用该对象的update方法来指定需要被加密的数据
  let crypted = cipher.update(data, 'utf-8', 'hex');

  crypted += cipher.final('hex');

  return crypted;
};

LoginUser.prototype.aseDecode = function(data) {
  /* 
   该方法使用指定的算法与密码来创建 decipher对象, 第一个算法必须与加密数据时所使用的算法保持一致;
   第二个参数用于指定解密时所使用的密码，其参数值为一个二进制格式的字符串或一个Buffer对象，该密码同样必须与加密该数据时所使用的密码保持一致
  */
  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);

  /*
   第一个参数为一个Buffer对象或一个字符串，用于指定需要被解密的数据
   第二个参数用于指定被解密数据所使用的编码格式，可指定的参数值为 'hex', 'binary', 'base64'等，
   第三个参数用于指定输出解密数据时使用的编码格式，可选参数值为 'utf-8', 'ascii' 或 'binary';
  */
  let decrypted = decipher.update(data, 'hex', 'utf-8');

  decrypted += decipher.final('utf-8');
  return decrypted;
}; 

module.exports = LoginUser;