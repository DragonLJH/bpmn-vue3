
const DOMAIN = "http://localhost:8687"
const MERGE_URL = Symbol("MERGE_URL")
const FETCH_CONFIG = Symbol("FETCH_CONFIG") 
const PARAMS_STR = Symbol("PARAMS_STR")
const FORM_DATA = Symbol("FORM_DATA")
const GET_MERGE_URL = Symbol("GET_MERGE_URL")

class Api {
    constructor() {

    }

    // 拼接域名
    [MERGE_URL](url) {
        return DOMAIN + url
    }

    [FETCH_CONFIG](method) {
        return {
            // mode: "cors",
            // credentials: "include",
            method
        }
    }

    // 将参数转换成 & 和 = (xxx=xxx&yyy=yyy) 的形式
    [PARAMS_STR](params) {
        return Object.keys(params).map(item => {
            return item + "=" + params[item]
        }).join("&")
    }
    
    // 将参数转换成 表单 形式
    [FORM_DATA](params) {
        const data = new FormData();
        Object.entries(params).map(([k, v]) => {
            data.append(k, v);
        })
        return data
    }

    // get 方法的拼接调用
    [GET_MERGE_URL](url, params) {
        if (params) {
            if (url.search(/\?/) !== -1) {
                url += this[PARAMS_STR](params)
            } else {
                url += "?" + this[PARAMS_STR](params)
            }
        }
        return this[MERGE_URL](url)
    }

    async GetApi(api = "", params = {}) {
        let response = await fetch(this[GET_MERGE_URL](api, params), this[FETCH_CONFIG]("GET"));
        return response.json()
    }

    async PostApi(api = "", params) {
        const config = {...this[FETCH_CONFIG]("POST") }
        if (params) {
            if (Object.prototype.toString.call(params) == '[object Object]') {
                const data = new FormData();
                Object.entries(params).map(([k, v]) => {
                    data.append(k, v);
                })
                params = this[FORM_DATA](params)
            }
            if (Object.prototype.toString.call(params) == '[object Array]') {
                params = JSON.stringify(params)
                config["headers"] = {
                    'Content-Type': 'application/json;charset=utf-8'
                }
            }
            config["body"] = params
        }
        let response = await fetch(this[MERGE_URL](api), config);
        return response.json()
    }

}


export default new Api();