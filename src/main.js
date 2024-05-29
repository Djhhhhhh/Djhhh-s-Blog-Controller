import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from '@/router'
import locale from 'element-plus/dist/locale/zh-cn.js'
import axios from 'axios';

const app = createApp(App)
const pinia =createPinia()
const persist =createPersistedState()
pinia.use(persist)
app.config.globalProperties.$http = axios;
app.use(ElementPlus,{locale})
app.use(router)
app.use(pinia)
app.mount('#app')
