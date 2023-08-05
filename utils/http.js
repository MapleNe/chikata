import inisENV from '@/static/config.js'
import {
	inisHelper
} from '@/utils/helper.js'
import Request from '@/utils/luch-request/index.js'

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
	if (response.data.code === 403) {
		try {
			const newToken = await http.get('/users/newtoken', {
				header: {
					refreshToken: uni.getStorageSync('refreshToken')
				}
			}).then(res => {
				if (res.data.code === 200) {
					uni.setStorageSync('token', res.data.data['login-token'])
					console.log('更新token完成')
				}
				console.log('请求成功', res)
			})
			response.config.header['Authorization'] = uni.getStorageSync('token')
			const res = await http.request(response.config)
			console.log('newtoken', newToken)
			return res
		} catch (err) {
			console.log('更新失败', err)
		}
	}
	return response
}, error => {
	return Promise.reject(error)
})

export {
	http
}