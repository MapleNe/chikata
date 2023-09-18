import config from '@/config/config.js'
import inisENV from '@/config/config.js'
import {
	inisHelper
} from '@/utils/helper.js'
import Request from '@/utils/luch-request/index.js'
import {
	router
} from '../router/router'
import store from '../store'

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
// 刷新请求
const refresh = new Request()
refresh.setConfig((config) => {
	/* 设置全局配置 */
	config.baseURL = inisHelper.customProcessApi(inisENV.api)
	config.header = {
		'Content-Type': 'application/x-www-form-urlencoded',

	}
	config.timeout = 60 * 1000
	return config
})

// 请求后刷新
const againHttp = new Request()
againHttp.interceptors.request.use(config => {
	config.header['Authorization'] = uni.getStorageSync('token')
	return config
}, error => {
	return Promise.reject(error)
})
// 请求拦截
//   所有的网络请求都会先走这个方法
http.interceptors.request.use((config) => {
	config.header = {
		...config.header,
	}
	const token = uni.getStorageSync('token')
	const nowtime = Math.round(Date.now() / 1000).toString();
	//如果未登录且请求方法为PUT则停止本次请求并跳转登录
	if (!store.state.hasLogin && config.method == 'PUT') {
		router.push({
			path: '/pages/user/login',
			animation: {
				animationType: 'slide-in-bottom',
				animationDuration: 350
			},
		})
		return Promise.reject(config)
	}
	if (token && uni.getStorageSync('refreshToken') && store.state.hasLogin) {
		if (uni.getStorageSync('loginExp') <= nowtime) {
			try {
				console.log('开始请求')
				refresh.get('/users/NewToken', {
					header: {
						accept: uni.getStorageSync('refreshToken')
					}
				}).then(res => {
					if (res.data.code === 200) {
						uni.setStorageSync('loginExp', res.data.data.loginExp)
						uni.setStorageSync('token', res.data.data['login-token'])
					} else {
						uni.showToast({
							icon: 'none',
							title: '登录失效请重新登录'
						})
						store.commit('logout')
						router.push({
							path: '/pages/user/login',
						})
					}
				})
			} catch (e) {
				return Promise.reject(config)
			}
		}

	}
	if (config.method == 'GET') config.params.token = inisENV.token
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
	const token = uni.getStorageSync('token')
	const nowtime = Math.round(Date.now() / 1000).toString();
	if (response.data.code === 403) {
		if (uni.getStorageSync('refreshToken') <= nowtime) {
			try {
				const res = await refresh.get('/users/NewToken', {
					header: {
						accept: uni.getStorageSync('refreshToken')
					}
				})
				if (res.data.code === 200) {
					uni.setStorageSync('loginExp', res.data.data.loginExp)
					uni.setStorageSync('token', res.data.data['login-token'])
					try {
						const againhttp = await againHttp.middleware(response.config)
						return againhttp
					} catch (e) {
						// 重新获取数据可能因为网络原因获取失败了
						return Promise.reject(e)
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: '登录失效请重新登录'
					})
					this.$router.push({
						path: '/pages/user/login'
					})
				}
			} catch (e) {
				return Promise.reject(config)
			}
		}

	}
	return response
}, error => {
	return Promise.reject(error)
})

export {
	http
}