import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import MyBread from './components/custom/myBread.vue'
import MyServerHttp from '@/plugins/http.js'
import moment from 'moment'
// css文件
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/reset.css'

import router from './router'

Vue.use(ElementUI)
Vue.use(MyServerHttp)

Vue.config.productionTip = false

// 全局过滤器 - 处理日期
Vue.filter('formatdate',(v)=>{
  return moment(v).format('YYYY-MM-DD')
})

// 全局自定义组件
Vue.component('my-bread',MyBread)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
