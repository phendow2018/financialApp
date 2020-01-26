let Mssql = require('./Mssql');
let Mysql = require('./Mysql');

class Database {
  constructor() {
    this.LastError = '';
    this.dbLink = null;
    this.dbConfig = this.getConfig();
    this.createDbLink();
  }

  getConfig() {
    let config = require('../../config.json');
    return config.Database;
  }

  createDbLink() {
    if (typeof this.dbConfig.Type == 'undefined')
      return;

    if (typeof this.dbConfig.Type == 'string' && this.dbConfig.Type.toLocaleUpperCase() == 'MSSQL') {
      let config = {
        user: this.dbConfig.User,
        password: this.dbConfig.Password,
        server: this.dbConfig.ServerIp,
        database: this.dbConfig.DatabaseName,
        port: 1433,
        options: {
            encrypt: false // Use this if you're on Windows Azure  
        },
        pool: {
            max: 50,
            min: 10,
            idleTimeoutMillis: 30000
        }
      }
      this.dbLink = new Mssql(config);
    } else if (typeof this.dbConfig.Type == 'string' && this.dbConfig.Type.toLocaleUpperCase() == 'MYSQL') {
      let config = {
        host: this.dbConfig.ServerIp,
        port:3306,
        protocol:'mysql',
        user: this.dbConfig.User,
        password: this.dbConfig.Password,
        database: this.dbConfig.DatabaseName,
        connectionLimit:100
      };
      this.dbLink = new Mysql(config);
    }
  }

  async query(sql) {
    return await this.dbLink.query(sql);
  }
  async query_Param(sql,Params) {
    return await this.dbLink.query_Param(sql,Params);
  }
  async executeProcedure(name,params){
    return await this.dbLink.executeProcedure(name,params);
  }
  
  async query_trans(sql) {
    return await this.dbLink.query_trans(sql);
  }
  async query_Param_trans(sql,Params) {
    return await this.dbLink.query_Param_trans(sql,Params);
  }
  async executeProcedure_trans(name,params){
    return await this.dbLink.executeProcedure_trans(name,params);
  }

  async begin() {
    await this.dbLink.begin();
  }

  async commit() {
    await this.dbLink.commit();
  }

  async rollback() {
    await this.dbLink.rollback();
  }

  getLastError() {
    return this.dbLink.getLastError();
  }
}

var database = new Database();

module.exports = database;