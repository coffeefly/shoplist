import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css';
import './styles/index.scss';
import App from './App.vue';
import router from './router';
import axios from 'axios'
import '@/mock'
// 全局配置
Vue.use(ElementUI);

Vue.config.productionTip = false;
axios.interceptors.response.use(res => {
  return res.data
}, err => {
  return Promise.reject(err)
})
Vue.prototype.$axios = axios;
// 全局配置
import globalSetting from './globalSetting.js'
Vue.prototype.GLOBAL = globalSetting

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');