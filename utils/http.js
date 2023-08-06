import inisENV from '@/static/config.js'
import {
	inisHelper
} from '@/utils/helper.js'
import Request from '@/utils/luch-request/index.js'
import { router } from '../router/router'

const http = new Request()
// 全局配置
http.setConfig((config) => {
	config.baseURL = inisHelper.customProcessApi(inisENV.api)
	config.header = {
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
	const access_exp = uni.getStorageSync('loginExp')
	const nowtime = Math.round(Date.now()/1000).toString();
	const refreshExp = uni.getStorageSync('refreshExp')
	if (access_exp!=''&&access_exp <= nowtime) {
		
		try {
			http.get('/user/NewToken', {
				header: {
					Accept: uni.getStorageSync('refreshToken')
				}
			}).then(res => {
				uni.setStorageSync('token', res.data.data['login-token'])
				uni.setStorageSync('loginExp',res.data.data.loginExp)
				console.log('token更新完成',res)
			}).catch(err => {
				console.log('更新失败')
			})
		} catch (e) {
			return Promise.reject(config)
		}
	} else if(refreshExp!=''&&refreshExp <= nowtime){
		uni.showToast({
			icon:'none',
			title:'登录状态失效'
		})
	}
	if (config.method == 'GET') config.params.token = inisENV.token
	const token = uni.getStorageSync('token')
	if (token) {
		config.header['Authorization'] = uni.getStorageSync('token');
	}
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