import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
// 导入axios
import _axios from './axios'

Vue.config.productionTip = false
Vue.prototype.$http = _axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
