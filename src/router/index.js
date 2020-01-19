import Vue from 'vue'
import Router from 'vue-router'

import login from '@/packages/login/login'
import frame from '@/packages/frame/frame'
import {companyRouter} from './company'
import {orderRouter} from './order'        //订单
import {userRouter} from './user'     //用户

Vue.use(Router)

const modules = companyRouter.concat(userRouter).concat(orderRouter)


let route = [{
  path: '/',
  redirect: '/platform',
  meta:{
    title:'财务管理系统'
  }
},
{
  path: '/login',
  component: login,
  meta:{
    title:'登录'
  }
},
{
  path: '/platform',
  component: frame,
  children: modules,
}]

const router = new Router({
  mode: 'history',
  routes: route,
})

router.beforeEach((to,from,next) => {
  var getCookie = function(name) {
    let arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) {
        return unescape(arr[2]);
    }
    return null;
  };
  document.title = to.meta.title
  // if(to.path === '/login'){
  //   if(!!getCookie('Token') && localStorage.getItem('isLogin') == 1){
  //     next('/platform')
  //   }else{
  //     next()
  //   } 
  // }else 
  if(to.path !== '/login'){
    if(!(getCookie('Token') != null && getCookie('Token') != '' && localStorage.getItem('isLogin') == '1')){
      next('/login');
    }else if(to.matched.length === 0){
      from.name ? next({ name:from.name }) : next('/login');
    }else {
      next();
    }
  }else{
    next();
  }
});

export default router


