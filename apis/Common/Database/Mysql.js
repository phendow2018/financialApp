var mysql    = require("mysql");

var transactionLink = function(con){
    this.isConnectded = false;
    this.con          = con;
    this.transaction  = false;
    this.Error        = "";
    this.isRelease    = false;
}

transactionLink.prototype.transaction = false;

transactionLink.prototype.beginTransaction = async function(){
    let _this = this;
    if(!_this.transaction){
        let ret = await new Promise(function(res,rej){ 
                            _this.con.beginTransaction(function(err){
                                if(err){
                                    _this.Error = err;
                                    res(false);
                                }
                                _this.transaction = true;
                                res(true);
                            });
                        })
        return ret;
    }   
    return true; 
}

transactionLink.prototype.queryTrans = async function(sql){
    let _this = this;
    if(!_this.transaction){
        let ret = await new Promise(function(res,rej){ 
                            _this.con.beginTransaction(function(err){
                                if(err){
                                    _this.Error = err;
                                    res(false);
                                }
                                _this.transaction = true;
                                res(true);
                            });
                        })
        if(ret === false)
            return false
    }
    if(_this.transaction)
    return  await new Promise(function(res,rej){ 
                let timmer = setTimeout(() => {
                    res(false);
                }, 5000);
                _this.con.query(sql,function(err, data){   
                    clearTimeout(timmer);  
                    if(err){
                        _this.Error = err; 
                        res(false)
                    }else{
                        res(data);
                    }    
                }); 
            })  
    return true;
}

transactionLink.prototype.query = async function(sql){
    let _this = this;
    return  await new Promise(function(res,rej){ 
                let timmer = setTimeout(() => {
                    res(false);
                }, 5000);
                _this.con.query(sql,function(err, data){     
                    clearTimeout(timmer);
                    if(err){
                        _this.Error = err; 
                        res(false)
                    }else{
                        res(data);
                    }    
                }); 
            })  
} 

transactionLink.prototype.commit = async function(){
    let _this = this;
    let ret = true;
    if(this.transaction)
        ret = await new Promise(function(res,rej){
                _this.con.commit(function(err){
                    if(err){
                        _this.Error = err; 
                        res(false)
                    }
                    _this.transaction = false;
                    res(true);
                });
            }) 
    return ret;    
}

transactionLink.prototype.rollback = async function(){
    let _this = this;
    let ret = true;
    if(this.transaction)
        ret = await new Promise(function(res,rej){
                _this.con.rollback(function(err){
                    if(err){
                        _this.Error = err; 
                        res(false)
                    }
                    _this.transaction = false;
                    res(true);
                });
            }) 
    return ret; 
}

transactionLink.prototype.commitRelease = async function(){
    let _this = this;
    let ret = true;
    if(this.transaction)
        ret = await new Promise(function(res,rej){
                _this.con.commit(function(err){
                    if(err){
                        _this.Error = err; 
                        res(false)
                    }
                    res(true);
                });
            }) 
    await _this.con.release();
    return ret;    
}

transactionLink.prototype.rollbackRelease = async function(){
    let _this = this;
    let ret = true;
    if(this.transaction)
        ret = await new Promise(function(res,rej){
                _this.con.rollback(function(err){
                    if(err){
                        _this.Error = err;  
                        res(false)
                    }
                    res(true);
                });
            }) 
    await _this.con.release();
    return ret; 
}

transactionLink.prototype.release = async function(){
    let _this = this;
    if(this.transaction)
         await new Promise(function(res,rej){
                _this.con.rollback(function(err){
                    if(err){
                        _this.Error = err; 
                        res(false)
                    }
                    _this.transaction = false;
                    res(true);
                });
            }) 
    if(!_this.isRelease)
        _this.con.release(); 
    _this.isRelease = true;    
    return true; 
}

transactionLink.prototype.getLastError = function(){
    return this.Error;
}

var mysqlDb = function(config){
    this.config = config;
    this.isConnectded = false;
    this.connection();
    this._con = null; 
    this.Error = "";
}

mysqlDb.prototype.connection = async function(){ 
    let _this = this;
    this._con = await new Promise(function(res,rej){
        let con = mysql.createPool({
                    host            : _this.config.host,
                    port            : _this.config.port,
                    protocol        : _this.config.protocol,
                    user            : _this.config.user,
                    password        : _this.config.password,
                    database        : _this.config.database,
                    connectionLimit : _this.config.connectionLimit
                }) 
        res(con); 
    })
    this.isConnectded = true;
}

mysqlDb.prototype.getLastError = function(){
    return this.Error;
}

mysqlDb.prototype.getTransActionCon = async function(){
    let _this = this;  
    let ret = await new Promise(function(res,rej){ 
            if(!_this.isConnectded){
                _this.Error = "数据库未连接";
                res(false);
            }
            _this._con.getConnection(function(err,conn){    
                if(err){  
                    _this.Error = err;  
                    res(false);    
                }else{    
                    res(conn);
                }    
            });
        })
    if(ret === false){
        return false;
    }
    let con = new transactionLink(ret);
    return con;
}

mysqlDb.prototype.disconnection = async function() {
    if(this.isConnectded == true){
        this._con.releaseConnection();
    }   
}

mysqlDb.prototype.releasePoolConnection = async function(conn) {
    try{
        this._con.releaseConnection(conn.con);
    }catch(e){

    } 
}
mysqlDb.prototype.query = async function(sql){
    let _this = this;    
    let data = await new Promise(function(res,rej){ 
                    if(!_this.isConnectded){
                        _this.Error  = "数据库未连接";
                        res(false);
                    }
                    _this._con.getConnection(function(err,conn){    
                        if(err){  
                            _this.Error  = err;  
                            res(false);    
                        }else{    
                            let timmer = setTimeout(() => {
                                res(false);
                            }, 5000);
                            conn.query(sql,function(err, data){     
                                clearTimeout(timmer);
                                if(err){
                                    _this.Error  = err;  
                                    res(false)
                                }else{
                                    res(data);
                                }
                                conn.release();        
                            });    
                        }    
                    });
                })
    return data;
}

module.exports = mysqlDb;