import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //最后必须return config
  return config
})
Vue.prototype.$http = axios

Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
Vue.filter('dataFormat', origin => {
  const time = new Date(origin)
  const y = time.getFullYear()
  const m = (time.getMonth() + 1 + '').padStart(2, '0')
  const d = (time.getDate() + '').padStart(2, '0')
  const hh = (time.getHours() + '').padStart(2, '0')
  const mm = (time.getMinutes() + '').padStart(2, '0')
  const ss = (time.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
