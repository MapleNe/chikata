import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import {router,RouterMount} from './router/router.js'  //路径换成自己的
Vue.use(router)
let vuexStore = require('@/store/$tn.mixin.js')
Vue.mixin(vuexStore)
import store from './store'
// 引入全局TuniaoUI
import TuniaoUI from 'tuniao-ui'
Vue.use(TuniaoUI)
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
	...App
})

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
	RouterMount(app,router,'#app')
// #endif

// #ifndef H5
	app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif

// INIS助手函数
import {
	inisHelper
} from '@/utils/helper.js'
Vue.prototype.$inisHelper = inisHelper

// INIS 配置文件
import config from '@/static/config.js'
process.inisENV = config

// http模块
import {
	http
} from '@/utils/http.js'
Vue.prototype.$http = http