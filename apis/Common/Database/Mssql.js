var mssql = require("mssql");

var mssqlDb = function(config){
    this.config = config;
    this.isConnectded = false;
    this._connection();
    this._waitingPool = [];
    this._waitingProcedure =[];
    this._con = null; 
    this.Transaction = null;
}

mssqlDb.prototype._connection = function(callback= function(){ return;}){
    var _this = this;
    var con = new mssql.ConnectionPool(this.config, function(err) {
        if (err) {
            callback(err);
        }
        else{
            _this.Transaction = new mssql.Transaction(con)
            _this.isConnectded = true;
            _this._con = con;
            callback();
            for(var a of _this._waitingPool){
                _this._querySql(a.sql,a.params,a.callBack);
            }
            _this._waitingPool = [];
            for(var a of _this._waitingProcedure){
                _this._execProcedure(a.ProcedureName,a.params,a.callBack);
            }
            _this._waitingProcedure = [];
        }
    });
}
mssqlDb.prototype._Disconnect = function(){
    
	if(this.isConnectded == true && typeof this._con != undefined){
		this._con.close();
	}
}

mssqlDb.prototype._restoreDefaults = function(){};

mssqlDb.prototype._querySql = function(sql, params, callback = function(){return;}){
    if(this.isConnectded){
        var ps = new mssql.PreparedStatement(this._con);
        if(typeof params == "function"){
            callback = params;
        }
        else if (params != "") {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    ps.input(index, mssql.Int);
                } else if (typeof params[index] == "string") {
                    ps.input(index, mssql.NVarChar);
                }
            }
        }
        //ps.output('DealTime',mssql.DateTime)
        let timmer = setTimeout(() => {
            callback("查询数据库超时");
        }, 5000);
        ps.prepare(sql, function (err) {
            clearTimeout(timmer);
            if (err){
                callback(err);
                console.log(err);
            }
            else{
                
                ps.execute(params, function (err, recordset) {
                    
                    callback(err, recordset);
                    ps.unprepare(function (err) {
                        if (err)
                            console.log(err);
                    });
                });
            }
        });
    }else{
        this._waitingPool.push({sql:sql, params:params, callback:callback});
    }
}

mssqlDb.prototype._execProcedure = function (ProcedureName, params, callBack) {
    if(this.isConnectded){
        const request = new mssql.Request(this._con);
        if(typeof params == "function" ){
            callBack = params;    
        }
        if(typeof callBack != "function"){
            callBack = function(){}
        }
        if (params != "" && typeof params != "function" ) {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    request.input(index, mssql.Int,params[index]);
                } else if (typeof params[index] == "string") {
                    request.input(index, mssql.NVarChar,params[index]);
                } else if (params[index] == null) {
                    request.input(index, mssql.Variant,params[index]);
                }
            }
        }
        request.execute(ProcedureName, (err, result) => {
            callBack(err,result);  
        })  
    }else{
        this._waitingProcedure.push({ProcedureName:ProcedureName,params:params,callBack:callBack});
    }
};

mssqlDb.prototype.query = async function(sql){
    let retData;
    let _this = this;
    retData = await new Promise(function(res,rej){
        _this._querySql(sql,function(err,data){
            if(err){
                _this.LastError = err;
                res(false);
            }else
                res(data.recordsets[0]); 
          //res({err:err,data:data});
      })
    })
    return retData;
}

mssqlDb.prototype.query_Param = async function(sql,Params){
    let retData;
    let _this = this;
    retData = await new Promise(function(res,rej){
        _this._querySql(sql,Params,function(err,data){
            if(err){
                _this.LastError = err;
                res(false);
            }else
                res(data.recordsets[0]); 
          //res({err:err,data:data});
      })
    })
    return retData;
}
mssqlDb.prototype.executeProcedure = async function(ProcedureName,params){
    let retData;
    let _this = this;
    retData = await new Promise(function(res,rej){
        _this._execProcedure(ProcedureName,params,function(err,data){
            if(err){
                _this.LastError = err;
                res(false);
            }else
                res(data.recordsets[0]);   
      })
    })
    return retData;
}

mssqlDb.prototype._querySql_trans = function(sql, params, callback = function(){return;}){
    if(this.isConnectded){
        const request = new mssql.Request(this.Transaction);
        if(typeof params == "function" ){
            callBack = params;    
        }
        if(typeof callBack != "function"){
            callBack = function(){}
        }
        if (params != "" && typeof params != "function" ) {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    request.input(index, mssql.Int,params[index]);
                } else if (typeof params[index] == "string") {
                    request.input(index, mssql.NVarChar,params[index]);
                }
            }
        }
        // request.output('output_parameter', mssql.Int)
        request.query(sql, (err, result) => {
            callBack(err,result);  
        }) 
    }else{
        this._waitingPool.push({sql:sql, params:params, callback:callback});
    }
}

mssqlDb.prototype._execProcedure_trans = function (ProcedureName, params, callBack) {
    if(this.isConnectded){
        const request = new mssql.Request(this.Transaction);
        if(typeof params == "function" ){
            callBack = params;    
        }
        if(typeof callBack != "function"){
            callBack = function(){}
        }
        if (params != "" && typeof params != "function" ) {
            for (var index in params) {
                if (typeof params[index] == "number") {
                    request.input(index, mssql.Int,params[index]);
                } else if (typeof params[index] == "string") {
                    request.input(index, mssql.NVarChar,params[index]);
                }
            }
        }
        // request.output('output_parameter', mssql.Int)
        request.execute(ProcedureName, (err, result) => {
            callBack(err,result);  
        })  
    }else{
        this._waitingProcedure.push({ProcedureName:ProcedureName,params:params,callBack:callBack});
    }
};

mssqlDb.prototype.query_trans = async function(sql){
    let retData;
    let _this = this;
    retData = await new Promise(function(res,rej){
        _this._querySql_trans(sql,function(err,data){
            if(err){
                _this.LastError = err;
                res(false);
            }else
                res(data.recordsets[0]); 
      })
    })
    return retData;
}

mssqlDb.prototype.query_Param_trans = async function(sql,Params){
    let retData;
    let _this = this;
    retData = await new Promise(function(res,rej){
        _this._querySql_trans(sql,Params,function(err,data){
            if(err){
                _this.LastError = err;
                res(false);
            }else
                res(data.recordsets[0]); 
          //res({err:err,data:data});
      })
    })
    return retData;
}


mssqlDb.prototype.executeProcedure_trans = async function(ProcedureName,params){
    let retData;
    let _this = this;
    retData = await new Promise(function(res,rej){
        _this._execProcedure_trans(ProcedureName,params,function(err,data){
            if(err){
                _this.LastError = err;
                res(false);
            }else
                res(data.recordsets[0]);   
      })
    })
    return retData;
}
mssqlDb.prototype.begin = async function(){
    let _this = this;
    if(this.isConnectded){
        await _this.Transaction.begin();
    }
}
mssqlDb.prototype.commit = async function(){
    if(this.isConnectded){
        await this.Transaction.commit();
    }
}
mssqlDb.prototype.rollback = async function(){
    if(this.isConnectded){
        await this.Transaction.rollback();
    }
}

mssqlDb.prototype.getLastError = function(){
    return this.LastError;
}
module.exports = mssqlDb;