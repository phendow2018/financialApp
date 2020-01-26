const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');

const TYPE_STRING = 'RelatedCustomer';

class RelatedCustomers extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}

RelatedCustomers.prototype.checkExistFlag = async function(flag) {
  let sql = `SELECT COUNT(1) AS COUNT FROM \`system_param\` 
    WHERE \`Type\`=${tools.MysqlEscape(TYPE_STRING)} AND \`Name\`=${tools.MysqlEscape(flag)}`;
  let ret = await this.dbLink.query(sql);
  if (ret === false || ret.length <= 0) {
    return false;
  }
  if (ret[0].COUNT <= 0) {
    return false;
  }
  return true;
}

RelatedCustomers.prototype.checkCreate = function(postData) {
  if (!tools.isValidString(postData.Flag)) {
    this.LastError = '无有效的Flag字段';
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.Customer)) {
    this.LastError = '无有效的Customer字段';
    this.Code = 101;
    return false;
  }
  if (!tools.isValidString(postData.SubmitOrderUrl)) {
    this.LastError = '无有效的SubmitOrderUrl字段';
    this.Code = 101;
    return false;
  }
  return true;
}
RelatedCustomers.prototype.doCreate = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;

  if (!_this.checkCreate(postData)) {
    return false;
  }
  let checkExistFlagRet = await _this.checkExistFlag(postData.Flag);
  if (checkExistFlagRet === true) {
    this.LastError = 'Flag标识已存在';
    this.Code = 101;
    return false;
  }

  let config = {
    Customer: postData.Customer,
    SubmitOrderUrl: postData.SubmitOrderUrl,
  };
  let params = {
    Type: TYPE_STRING,
    Name: postData.Flag,
    StrValue: JSON.stringify(config),
  };
  if (tools.isValidString(postData.Description)) {
    params.Memo = postData.Description;
  }
  let sql = tools.getInsertSql(params, 'system_param');
  let ret = await _this.dbLink.query(sql);
  if (ret === false) {
    this.LastError = _this.dbLink.getLastError();
    this.Code = 301;
    return false;
  }
  
  return {Id: ret.insertId};
}

RelatedCustomers.prototype.doUpdate = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;
  if (!tools.isNumber(queryData.Id)) {
    this.LastError = '无有效的Id字段';
    this.Code = 101;
    return false;
  }
  let id = parseInt(queryData.Id);

  let sqlGet = `SELECT * FROM \`system_param\` 
    WHERE \`Type\`=${tools.MysqlEscape(TYPE_STRING)} AND \`Id\`=${id}`;
  let retGet = await _this.dbLink.query(sqlGet);
  if (retGet === false || retGet.length <= 0) {
    this.LastError = '对应数据不存在';
    this.Code = 101;
    return false;
  }

  let config = {};
  try{config = JSON.parse(retGet[0].StrValue);} catch(e) {}
  if (tools.isValidString(postData.SubmitOrderUrl)) {
    config.SubmitOrderUrl = postData.SubmitOrderUrl;
  }
  if (tools.isValidString(postData.Customer)) {
    config.Customer = postData.Customer;
  }
  let params = {
    StrValue: JSON.stringify(config),
  };
  if (tools.isValidString(postData.Flag)) {
    params.Name = postData.Flag;
  }
  if (typeof postData.Description != 'undefined') {
    params.Memo = postData.Description;
  }
  let where = {
    Id: id,
    Type: TYPE_STRING,
  }
  let sql = tools.getUpdateSql(params, where, 'system_param');
  let ret = await _this.dbLink.query(sql);
  if (ret === false) {
    this.LastError = _this.dbLink.getLastError();
    this.Code = 301;
    return false;
  }

  return {Id: id};
}

RelatedCustomers.prototype.doDelete = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;
  if (!tools.isValidString(queryData.Id)) {
    this.LastError = '无有效的Id字段';
    this.Code = 101;
    return false;
  }
  let id = parseInt(queryData.Id);
  let sql = `DELETE FROM \`system_param\` WHERE \`Type\`=${tools.MysqlEscape(TYPE_STRING)} AND \`Id\`=${id}`;
  let ret = await _this.dbLink.query(sql);
  if (ret === false) {
    this.LastError = _this.dbLink.getLastError();
    this.Code = 301;
    return false;
  }

  return {Id: id};
}

RelatedCustomers.prototype.doRead = async function(){
  let _this = this;
  let postData  = _this.ctx.request.body;
  let queryData = _this.ctx.query;
  
  let sql = `SELECT * FROM \`system_param\` WHERE \`Type\`=${tools.MysqlEscape(TYPE_STRING)}`;
  if (tools.isNumber(queryData.Id)) {
    sql += ` AND \`Id\`=${parseInt(queryData.Id)}`;
  }
  let ret = await _this.dbLink.query(sql);
  if (ret === false) {
    this.LastError = _this.dbLink.getLastError();
    this.Code = 301;
    return false;
  }

  let data = [];
  for (let item of ret) {
    let one = {
      Id: item.Id,
      Flag: item.Name,
      Description: item.Memo,
      Customer: '',
      SubmitOrderUrl: '',
    }
    let config = {};
    try {config = JSON.parse(item.StrValue);} catch(e) {}
    if (tools.isValidString(config.SubmitOrderUrl)) {
      one.SubmitOrderUrl = config.SubmitOrderUrl;
    }
    if (tools.isValidString(config.Customer)) {
      one.Customer = config.Customer;
    }
    data.push(one);
  }
  return {data: data};
}

RelatedCustomers.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

RelatedCustomers.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

RelatedCustomers.prototype.delete = async function(){
    let _this = this;
    let ret = await _this.doDelete();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess();
    } 
}

RelatedCustomers.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new RelatedCustomers(ctx);
    await instance.deal();
})
  
  
module.exports = router