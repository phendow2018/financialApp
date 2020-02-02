let http = require('http');

let clientPost = async function (ipAddr, url, port, postData, method) {
    if (typeof postData == "object")
        postData = JSON.stringify(postData);
    let options = {
        host: ipAddr,
        port: port,
        path: url,
        method: method,
        headers: {
            'Content-type': 'application/json',
            'Content-Length': Buffer.byteLength(postData, 'utf8'),
            'connection': 'close'
        }
    }
    let data = "";
    return await new Promise(function (resolve, reject) {
        let req = http.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                if (typeof data == "string" && data.length > 0) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        data = data;
                    }
                }
                let retData = {
                    statusCode: res.statusCode,
                    data: data
                }
                resolve(retData);
            })
        });
        req.setNoDelay(true);
        // req.setSocketKeepAlive(false,2);
        req.setTimeout(10000, function () {
            let retData = {
                statusCode: 408,
                data: `request error:超时`
            }
            reject(retData);
        })
        req.on('error', function (error) {
            let retData = {
                statusCode: 400,
                data: `${error}`
            }
            reject(retData);
        })
        req.write(postData);
        req.end();
    });
}


let httpClient = async function (ipAddr = '127.0.0.1', url = '/', port = 8122, method = 'get', postData = {}) {
    let tmethod = method.toLocaleLowerCase();
    let result = {
        Result: false,
        StatusCode: 500,
        Data: "",
        Error: "未知错误",
    }
    let ret = false;
    if (tmethod == 'get' || tmethod == 'post' || tmethod == 'put' || tmethod == 'delete') {
        ret = await clientPost(ipAddr, url, port, postData, tmethod).then(function(data) {
            result = {
                Result: true,
                StatusCode: data.statusCode,
                Data: data.data
            }
            return result;
        }, function(err) {
            result = {
                Result: false,
                StatusCode: err.statusCode,
                Error: err.data 
            }
            return false;
        });
    } else {
        retData = {
            Result: false,
            StatusCode: 405,
            Error: `不支持此方法:${tmethod}`
        }
        return false;
    }

    if (ret === false) {
        return result;
    }
    return ret;
};

class HttpClient {
    constructor() {
        this.LastError = '未知错误';
        this.StatusCode = 500;
    }
    getLastError() {
        return {
            ErrorMessage: this.LastError,
            StatusCode: this.StatusCode
        }
    }

    async send(host = '127.0.0.1', uri = '/', port = 80, method = 'get', postData = {}) {
        let ret = await httpClient(host, uri, port, method, postData);
        if (typeof ret.Result != 'boolean') {
            return false;
        }

        if (ret.Result === false) {
            this.LastError = ret.Error;
            this.StatusCode = ret.StatusCode;
            return false;
        }

        return ret;
    }
}

module.exports = HttpClient;