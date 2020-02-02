// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import 'element-ui/lib/theme-chalk/index.css'
import element from 'element-ui'
Vue.use(element)


import './style/index.less';
import axios from 'axios'

// // 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   console.dir(config)
//   return config;
// }, function (error) {
//   // 对请求错误做些什么
//   return Promise.reject(error);
// });

// 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//   // console.dir(response)
//   // 对响应数据做点什么
  
//   return response;
// }, function (error) {
//   // 对响应错误做点什么
//   if(error.response.status == 401){
//     vueRoot.$emit('showBox',{message:'登录过期，请退出重新登录！',type:'error', callBack: ()=> {
//       vueRoot.$router.push('/login')
//     }});
//   }
//   return Promise.reject(error);
// });

Vue.prototype.http = axios

import jquery from 'jquery'
window.$ = jquery

import vueScroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'
Vue.use(vueScroll)

import gfui from 'gf-uilib'
import 'gf-uilib/lib/styles/gf.css'
Vue.use(gfui)

import '$static/icon/iconfont.css'
import '$static/css/buttonsscope.less'

Vue.config.productionTip = false
Vue.prototype.preName = '/platform'
Vue.prototype.preApiName = ''

Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "H+": this.getHours(), //小时 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

/* eslint-disable no-new */
const vueRoot = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  data() {
    return {
      token: null,
      account: null,
      rights: [],
      modules: [],
      isKeepAliveOrderEdit: [],//['orderMain', 'company'],
      tempObject: {}
    }
  }
})

export default vueRoot
