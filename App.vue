<script>
	import Vue from 'vue';
	import {
		mapMutations,
		mapState
	} from 'vuex';
	import config from './config/config.js';
	import WS from "@/utils/webSocket.js";
	import APPUpdate from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	export default {
		data() {
			return {
				ws: null,
				isLogin: false,
				id: null,
			}
		},
		onLaunch: function() {
			// #ifdef APP-PLUS
			APPUpdate();
			// #endif
			//启动APP时判断是否已有用户数据
			let userInfo = uni.getStorageSync('userInfo') || ''
			this.id = userInfo.id
			if (userInfo.id) {
				uni.getStorage({
					key: 'userInfo',
					success: res => {
						this.login(res.data)
					}
				})
			}
			uni.onTabBarMidButtonTap(() => {
				this.$Router.push({
					path: '/pages/tabbar/publish/publish'
				})
			})
			// 这是websocket
			uni.$on('loginComplete', data => {
				this.isLogin = true
				this.connectWebSocket()
			})
			if (uni.getStorageSync('token')) {
				this.connectWebSocket()
			}
			uni.$on('logoutComplete', data => {
				this.ws.closeSocket()
			})
			// 获取客户端ID
			// #ifdef APP-PLUS
			const clientInfo = plus.push.getClientInfo()
			this.$store.commit('setCID', clientInfo.clientid)
			// #endif

			// 消息通知
			// #ifdef APP-PLUS
			let timer = false;
			plus.push.addEventListener("click", (msg) => {
				clearTimeout(timer);
				timer = setTimeout(() => {
					console.log(1111, msg);
					if (msg.payload) {
						uni.navigateTo({
							url: msg.payload
						})
					}
				}, 1500)
			}, false)
			plus.push.addEventListener("receive", (msg) => {
				if ("LocalMSG" == msg.payload) {} else {
					if (msg.type == 'receive') {
						var options = {
							cover: false,
							title: msg.title
						};
						plus.push.createMessage(msg.content, msg.payload, options);
					}
				}
			}, false)
			// #endif
			uni.preloadPage({
				url: '/pages/tabbar/circle'
			})
			console.log('App 启动')
		},
		beforeDestroy() {
			this.ws && this.ws.closeSocket();
		},
		onShow() {
			// #ifdef APP-PLUS
			// 切入后台会导致WS断开连接重新打开时重新连接
			if (this.hasLogin) {
				this.connectWebSocket()
			}
			// #endif

		},
		onHide: function() {
			console.log('App 隐藏')
		},
		computed: {
			...mapState(['hasLogin'])
		},
		methods: {
			...mapMutations(['login', 'logout', 'updateNotice']),
			connectWebSocket() {
				this.ws && this.ws.closeSocket();
				this.ws = new WS(config.wss) // xxx 表示接口地址URL
				// 发送数据
				const msg = {
					type: 'bind',
					uid: this.id
				}
				const message = JSON.stringify(msg)
				setTimeout(() => {
					this.ws.webSocketSendMsg(message)
				}, 1500)

				this.ws.getWebSocketMsg(data => {
					const dataJson = data;
					if (typeof(dataJson) == "object") {
						if (data.type === 'like' || data.type === 'focus' || data.type === 'comment' || data
							.type === 'placard') {
							this.$store.commit('updateNotice', data.type)
						} else if (data.type === 'chat') {
							uni.$emit('getNewChat', data)
						}
					} else {
						// console.log(dataJson);
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	@import '@/tuniao-ui/index.scss';
	@import '@/tuniao-ui/iconfont.css';
	@import '@/static/css/animate.css';
	@import '@/static/css/level.css';
	/*引入文件不要在uni.scss引入*/

	/*APP自定义样式*/
	.ch-bg-main {
		background: $ch-color-primary !important;
		color: white;
	}

	.level-text {
		font-size: 55rpx;
	}

	.ch-bg-main--light {
		background: rgba(lighten($ch-color-primary, 30%), 0.5) !important;
	}

	.ch-up-bg-primary {
		background: $ch-up-bg-primary;
	}

	.ch-color-primary {
		color: $ch-color-primary;
	}
</style>