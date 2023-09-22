import Vue from 'vue'
import Vuex from 'vuex'
import {
	router
} from '../router/router'

Vue.use(Vuex)

let lifeData = {}

// 尝试获取本地是否存在lifeData变量，第一次启动时不存在
try {
	lifeData = uni.getStorageSync('lifeData')
} catch (e) {

}

// 标记需要永久存储的变量，在每次启动时取出，在state中的变量名
let saveStateKeys = ['vuex_user']

// 保存变量到本地存储
const saveLifeData = function(key, value) {
	// 判断变量是否在存储数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmpLifeData = uni.getStorageSync('lifeData')
		// 第一次启动时不存在，则放一个空对象
		tmpLifeData = tmpLifeData ? tmpLifeData : {},
			tmpLifeData[key] = value
		// 将变量再次放回本地存储中
		uni.setStorageSync('lifeData', tmpLifeData)
	}
}

const store = new Vuex.Store({
	state: {
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_user: lifeData.vuex_user ? lifeData.vuex_user : {
			name: '图鸟'
		},

		// 如果vuex_version无需保存到本地永久存储，无需lifeData.vuex_version方式
		// app版本
		vuex_version: "1.0.0",
		// 是否使用自定义导航栏
		vuex_custom_nav_bar: true,
		// 状态栏高度
		vuex_status_bar_height: 0,
		// 自定义导航栏的高度
		vuex_custom_bar_height: 0,
		hasLogin: false,
		userInfo: {
			longtext: {
				background_img: ''
			}
		},
		noticeNum: {
			commnet_count: 0,
			article_like_count: 0,
			placard_count: 0,
			focus_count: 0,
		},
		chatData: null,
		cid: null,
		page: [],
	},
	mutations: {
		$tStore(state, payload) {
			// 判断是否多层调用，state中为对象存在的情况，例如user.info.score = 1
			let nameArr = payload.name.split('.')
			let saveKey = ''
			let len = nameArr.length
			if (len >= 2) {
				let obj = state[nameArr[0]]
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]]
				}
				obj[nameArr[len - 1]] = payload.value
				saveKey = nameArr[0]
			} else {
				// 单层级变量
				state[payload.name] = payload.value
				saveKey = payload.name
			}
			// 保存变量到本地中
			saveLifeData(saveKey, state[saveKey])
		},
		// 保存设备cid
		setCID(state, cid) {
			state.cid = cid
		},
		// 保存登录状态
		login(state, user) {
			state.hasLogin = true
			state.userInfo = user
			uni.setStorage({
				key: 'userInfo',
				data: user
			})
		},
		// 保存用户信息
		setUserInfo(state, user) {
			state.userInfo = user
			uni.setStorage({
				key: 'userInfo',
				data: user
			})
		},
		// 保存刷新令牌
		setRefreshToken(state, refreshToken) {
			uni.setStorage({
				key: 'refreshToken',
				data: refreshToken
			})
		},
		// 保存令牌
		setToken(state, token) {
			uni.setStorage({
				key: 'token',
				data: token
			})
		},
		// 保存消息
		setNotice(state, noticeNum) {
			state.noticeNum = noticeNum
		},
		// 清除消息
		clearNotice(state) {
			state.noticeNum = {
				commnet_count: 0,
				article_like_count: 0,
				placard_count: 0,
				focus_count: 0,
			}
		},
		// 更新消息
		updateNotice(state, type) {
			switch (type) {
				case 'comment':
					state.noticeNum.commnet_count += 1;
					break;
				case 'like':
					state.noticeNum.article_like_count += 1;
					break;
				case 'placard':
					state.noticeNum.placard_count += 1;
					break;
				case 'focus':
					state.noticeNum.focus_count += 1;
					break;
				default:
					break;
			}
		},
		// 设置聊天信息
		setChatData(state, data) {
			state.chatData = data
		},
		// 退出登录
		logout(state) {
			state.userInfo = {
				longtext: {
					background_img: '', //必须定义 为什么我也不知道
				}
			}
			state.hasLogin = false,
				uni.removeStorage({
					key: 'userInfo',
				})
			uni.removeStorage({
				key: 'token',
			})
			uni.removeStorage({
				key: 'refreshToken',
			})
			uni.removeStorage({
				key: 'loginExp'
			})
			uni.removeStorage({
				key: 'refreshExp'
			})
			uni.$emit('logoutComplete')
			router.replaceAll({
				path: '/pages/tabbar/index'
			})
		},
		// 保存页面
		setPage(state, payload) {
			state.page = payload
			uni.setStorage({
				key: 'page',
				data: payload,
			})

		}
	},
	actions: {}
})

export default store