import inisENV from '@/static/config.js'
import { inisHelper } from '@/utils/helper.js'
import Request from '@/utils/luch-request/index.js'

const http = new Request()

// 全局配置
http.setConfig((config) => {
    config.baseURL = inisHelper.customProcessApi(inisENV.api)
	config.header  = {
		'Content-Type': 'application/x-www-form-urlencoded',
	}
	config.timeout = 60 * 1000
    return config
})

// 请求拦截
//   所有的网络请求都会先走这个方法
http.interceptors.request.use((config) => {
	config.header = {
		...config.header,
	}
	if (config.method == 'GET') config.params.token = inisENV.token
	return config
}, (config) => {
	return Promise.reject(config)
})

// 响应拦截
//   所有的网络请求返回数据之后都会先执行这个方法
http.interceptors.response.use(async (response) => {
	return response
}, error => {
	return Promise.reject(error)
})

export {
	http
}