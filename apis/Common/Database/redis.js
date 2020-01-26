const redispool = require('redis-connection-pool');

class redisClient {
    // _Client;
    // _LastError;
    // ip;
    // port;
    constructor(uuid, config = {
        host: '127.0.0.1',
        port: 6379,
        max_clients: 30,
        perform_checks: false,
        database: 0,
        options: {
            auth_pass: 'password'
        }
    }) {
        this.uuid = uuid;
        this.config = config;
        this.connet();
        this._LastError = '未知错误';
    }

    connet() {
        let _this = this;
        _this._Client = redispool(_this.uuid, _this.config);
    }

    getLastErr() {
        return this._LastError;
    }

    async get(key) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.get(key, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } else {
                    res(data);
                }
            })
        })
    }
    async set(key, value) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        if (typeof value != 'string' || value.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.set(key, value, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } 
                // else if (data != 1) {
                //     _this._LastError = `设置值失败`;
                //     res(false);
                // } 
                else {
                    res(true);
                }
            })
        })
    }
    async setex(key, value, sec) {
        let _this = this;
        let ret = await _this.set(key, value);
        if (ret === false)
            return false;

        return await new Promise(function (res, rej) {
            _this._Client.expire(key, sec, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } 
                else {
                    res(true);
                }
            })
        })
    } 
    async expire(key, sec) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        if (typeof sec != 'number')
            return false;
        
        return await new Promise(function (res, rej) {
            _this._Client.expire(key, sec, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } 
                else {
                    res(true);
                }
            })
        })    
    }
    async del(key) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.del(key, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } else {
                    res(true);
                }
            })
        })
    }

    async hget(key, field) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        if (typeof field != 'string' || field.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.hget(key,field, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } else {
                    res(data);
                }
            })
        })
    }
    async hgetAll(key) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.hgetall(key, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } else {
                    res(data);
                }
            })
        })
    }
    async hset(key, field, value) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        if (typeof value != 'string' || value.length <= 0)
            return false;
        if (typeof field != 'string' || field.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.hset(key,field, value, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } 
                // else if (data != 1) {
                //     _this._LastError = `设置值失败`;
                //     res(false);
                // } 
                else {
                    res(true);
                }
            })
        })
    }
    async hdel(key,field=null) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            
            _this._Client.hdel(key,field,function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } else {
                    res(true);
                }
            });
        })
    }

    async rpush(key,values) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.rpush(key,values, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } else {
                    res(data);
                }
            })
        })
    }
    async brpop(key) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.brpop(key, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } else {
                    res(data);
                }
            })
        })
    }
    async lpush(key,values) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.lpush(key,values, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } else {
                    res(data);
                }
            })
        })
    }
    async blpop(key) {
        let _this = this;
        if (typeof key != 'string' || key.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.blpop(key, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } else {
                    res(data);
                }
            })
        })
    }
    async brpoplpush(key1,key2) {
        let _this = this;
        if (typeof key1 != 'string' || key1.length <= 0)
            return false;
        if (typeof key2 != 'string' || key2.length <= 0)
            return false;
        return await new Promise(function (res, rej) {
            _this._Client.brpoplpush(key1,key2, function (err, data) {
                if (err) {
                    _this._LastError = err;
                    res(false);
                } else {
                    res(data);
                }
            })
        })
    }

};
async function test() {
    let t = new redisClient('127.0.0.1', 6379);
    await t.brpoplpush('ket14','ket15');
    let ret = await t.brpop('ket15');
    console.log(ret);
    setTimeout(test, 3000);
}
//test()
module.exports = redisClient;