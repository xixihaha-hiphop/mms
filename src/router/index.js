import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import Users from '../components/users/users.vue'
import Privilege from '../components/privilege/privilege.vue'
import Role from '../components/privilege/role.vue'
import Goodslist from '../components/goods/goodslist.vue'
import Goodsadd from '../components/goods/goodsadd.vue'
import Cateparams from '../components/goods/cateparams.vue'
import Orders from '../components/order/order.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children:[
      {
        path: '/users',
        name: 'users',
        component: Users
      },
      {
        path: '/privilege',
        name : 'privilege',
        component: Privilege
      },
      {
        path: '/role',
        name : 'role',
        component: Role
      },
      {
        path: '/goods',
        name: 'goods',
        component: Goodslist
      },
      {
        path: '/goodsadd',
        name: 'goodsadd',
        component: Goodsadd
      },
      {
        path: '/params',
        name: 'params',
        component: Cateparams
      },
      {
        path: '/orders',
        name: 'orders',
        component: Orders
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 导航守卫
// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next()
//   }else{
//     const token = localStorage.getItem('token')
//     // 没有token说明未登录，即跳转到登录页
//     if (!token) {
//       router.push({name:'login'})
//     }
//     return
//   }
//   next()
// })

export default router
