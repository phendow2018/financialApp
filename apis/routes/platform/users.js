const router = require('koa-router')()
let   global = require('../../Common/Global');
let   Base   = require('../../Common/Base')
const tools = require('../../Common/tools');
class users extends Base{
  constructor(ctx){
      super(ctx);
      this.dbLink = global.database;
  }
}
users.prototype.checkAccount = async function(Account){
    let Sql = `Select COUNT(*) As Count  FROM \`user\` Where Account = ${tools.MysqlEscape(Account)}`;
    try
    {    
        let ret = await this.dbLink.query(Sql);
        if(!ret){
            return false;
        }
        if(ret[0].Count > 0){
            return true;
        }
        return false;
    }catch(e){
        return false
    }
}
users.prototype.checkUserName = async function(Name, Account=""){
    let Sql = `Select COUNT(*) As Count  FROM \`user\` Where Name = ${tools.MysqlEscape(Name)}`;
    if (tools.isValidString(Account)) {
        Sql += ` AND Account<>${tools.MysqlEscape(Account)}`;
    }
    try
    {    
        let ret = await this.dbLink.query(Sql);
        if(!ret){
            return false;
        }
        if(ret[0].Count > 0){
            return true;
        }
        return false;
    }catch(e){
        return false
    }
}
users.prototype.GetNameByAccount = async function(Account){
    let _this = this;
    let Sql = `Select Name from user Where Account = ${tools.MysqlEscape(Account)}`;
    let ret = await _this.dbLink.query(Sql);
    if(ret === false || ret.length == 0){
        return '';
    }    
    return ret[0].Name;// > 0
}
users.prototype.doCreate = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    let whereData = {};
    if(typeof postData.Account != 'string' || postData.Account.trim().length == 0){
        _this.Code = 101;
        _this.LastError = `缺少用户名`;
        return false;
    }else if(typeof postData.Password != 'string' || postData.Password.trim().length == 0){
        _this.Code = 101;
        _this.LastError = `缺少密码`;
        return false;    
    }else if(typeof postData.Name != 'string' || postData.Name.trim().length == 0){
        _this.Code = 101;
        _this.LastError = `缺少正确的名字`;
        return false;    
    }

    let ret = await _this.checkAccount(postData.Account);
    if(ret){
        _this.Code = 101;
        _this.LastError = `该账号已存在`;
        return false;     
    }
    ret = await _this.checkUserName(postData.Name);
    if (ret === true) {
        _this.Code = 101;
        _this.LastError = `用户名称[${postData.Name}]已存在`;
        return false;
    }


    if(typeof postData.Description == 'string'){ 
        whereData.Description =  postData.Description;     
    }
    if(tools.isNumber(postData.Sex) && (parseInt(postData.Sex)==1 || parseInt(postData.Sex) == 0)){ 
            whereData.Sex =  postData.Sex;     
    }
    if (typeof postData.Description == 'string' && postData.Description.trim().length > 0) {
        whereData.Description = postData.Description;
    }

    whereData.Account    = postData.Account;
    whereData.Name =  postData.Name;
    // whereData.Enabled    = 1;
    whereData.CreateTime = (new Date()).format('yyyy-MM-dd HH:mm:ss.S');
    whereData.Password   = postData.Password;
    whereData.Level      = 1;
    if(tools.isNumber(postData.Level) && postData.Level == 0) {
        whereData.Level = postData.Level;
    } 

    let Sql = tools.getInsertSql(whereData,'user');
    ret = await _this.dbLink.query(Sql);
    if(ret === false){
        _this.LastError = _this.dbLink.getLastError();
        _this.Code = 301;
        return false;
    }

    return {Account:postData.Account};
}

users.prototype.doUpdate = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    let whereData = {};
    if(typeof queryData.Account != 'string' || queryData.Account.trim().length == 0){
        _this.Code = 101;
        _this.LastError = `无有效的Account参数`;
        return false;
    }

    if(typeof postData.Description == 'string'){ 
        whereData.Description =  postData.Description;     
    }
    if(typeof postData.Name == 'string' && postData.Name.trim().length > 0){ 
        let checkUserNameRet = await _this.checkUserName(postData.Name, queryData.Account);
        if (checkUserNameRet === true) {
            _this.Code = 101;
            _this.LastError = `指定的用户名称[${postData.Name}]已存在`;
            return false;
        }
        whereData.Name =  postData.Name;     
    }
    if((typeof postData.Sex == 'string' && postData.Sex.trim().length > 0) || typeof postData.Sex == 'number'){ 
        let Sex = parseInt(postData.Sex);
        if(!isNaN(Sex) && (Sex==1 || Sex == 0))
            whereData.Sex =  postData.Sex;     
    }
    if(typeof postData.Email == 'string' && postData.Email.trim().length > 0){ 
        whereData.Email =  postData.Email;     
    }

    let Sql = tools.getUpdateSql(whereData,{Account:queryData.Account},'user');
    ret = await _this.dbLink.query(Sql);
    if(ret === false){
        _this.LastError = _this.dbLink.getLastError();
        _this.Code = 301;
        return false;
    }

    // let Name = await _this.GetNameByAccount(queryData.Account);
    return {Account:queryData.Account};
}

users.prototype.doDelete = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    let retData = {};
    if(typeof queryData.Account != 'string' || queryData.Account.trim().length == 0){
        _this.Code = 101;
        _this.LastError = `无有效的Account参数`;
        return false;
    }    
    let Sql = `delete from \`user\` where \`Account\` = ${tools.MysqlEscape(queryData.Account)}`;
    // let Name = await this.GetNameByAccount(queryData.Account);
    let ret = await _this.dbLink.query(Sql);
    if(ret === false){
        _this.Code = 301;
        _this.LastError = _this.dbLink.getLastError();
        return false;
    }

    return true;
}

users.prototype.doRead = async function(){
    let _this = this;
    let postData  = _this.ctx.request.body;
    let queryData = _this.ctx.query;
    let Where = ' Where 1=1 ';
    if(typeof queryData.Account == 'string' && queryData.Account.trim().length > 0){
        Where += ` AND user.Account = ${tools.MysqlEscape(queryData.Account)}`;   
    }
    if(typeof queryData.Name == 'string' && queryData.Name.trim().length > 0){ 
        Where += ` AND user.Name = ${tools.MysqlEscape(queryData.Name)}`;    
    }
    if((typeof queryData.Sex == 'string' && queryData.Sex.trim().length > 0) || typeof queryData.Sex == 'number'){ 
        let Sex = parseInt(queryData.Sex);
        if(!isNaN(Sex) && (Sex==1 || Sex == 0))
            Where += ` AND user.Sex = ${tools.MysqlEscape(Sex)}`;             
    }
    if((typeof queryData.Level == 'string' && queryData.Level.trim().length > 0) || typeof queryData.Level == 'number'){ 
        let Level = parseInt(queryData.Level);
        if(!isNaN(Level) && (Level==1 || Level == 0))
            Where += ` AND user.Level = ${tools.MysqlEscape(Level)}`;             
    }
    if(typeof queryData.Email == 'string' && queryData.Email.trim().length > 0){ 
        Where += ` AND user.Email = ${tools.MysqlEscape(queryData.Email)}`;     
    }
    if (tools.isValidString(queryData.FuzzyQuery)) {
        let likeStr = `%${queryData.FuzzyQuery}%`;
        Where += ` AND (user.Account LIKE ${tools.MysqlEscape(likeStr)} OR user.Name LIKE ${tools.MysqlEscape(likeStr)})`;
    }
    if (tools.isValidString(queryData.FuzzyName)) {
        let likeStr = `%${queryData.FuzzyName}%`;
        Where += ` AND user.Name LIKE ${tools.MysqlEscape(likeStr)}`;
    }

    let Sql = `Select Count(*) AS Count From \`user\` ${Where}`;
    let Count = await _this.dbLink.query(Sql);
    if(Count === false){
        _this.Code = 301;
        _this.LastError = _this.dbLink.getLastError();
        return false;
    }
    let  SortType  = ` ASC`;
    if(typeof queryData.SortBy == 'string' && queryData.SortBy.trim().length > 0){ 
        let  SortBy = queryData.SortBy.toUpperCase(); 
        if(typeof queryData.SortType != "undefined"){
            let tempSortType = queryData.SortType.toUpperCase(); 
            if(tempSortType == "DESC" || tempSortType == "ASC")
                SortType = tempSortType; 
        } 
        if(SortBy == "ACCOUNT" || SortBy == "NAME" || SortBy == "LEVEL" || SortBy == "SEX" || SortBy == "EMAIL"){
            Where += `ORDER BY ${SortBy} ${SortType}`;        
        } 
    }
   
    let Limit = ``;
    if(tools.isNumber(queryData.Page) && tools.isNumber(queryData.PerPage) && parseInt(queryData.Page) >=1 && parseInt(queryData.PerPage) >= 1){
        let Page    = parseInt(queryData.Page) - 1;
        let PerPage = parseInt(queryData.PerPage);
        Limit = ` limit ${Page*PerPage},${PerPage}`;         
    }
    Sql = `Select Account,Name,Password,Level,Sex,Email,Description from user ${Where} ${Limit}`;
    let Users = await _this.dbLink.query(Sql);
    if(Users === false){
        _this.Code = 301;
        _this.LastError = _this.dbLink.getLastError();
        return false;
    }
    return {totalCount:Count[0].Count, data:Users};
}

users.prototype.create = async function(){
    let _this = this;
    let ret = await _this.doCreate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

users.prototype.update = async function(){
    let _this = this;
    let ret = await _this.doUpdate();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

users.prototype.delete = async function(){
    let _this = this;
    let ret = await _this.doDelete();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess();
    } 
}

users.prototype.read = async function(){
    let _this = this;
    let ret = await _this.doRead();
    if(ret === false){
        _this.responseError();
    }else{
        _this.responseSuccess(ret);
    } 
}

router.all('/',async (ctx, next) => {
    let instance = await new users(ctx);
    await instance.deal();
})
  
  
module.exports = router