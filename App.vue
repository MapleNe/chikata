<script>
	import Vue from 'vue';
	import {
		mapMutations,
		mapState
	} from 'vuex';
	import config from './static/config.js'
	export default {
		onLaunch: function() {
			//启动APP时判断是否已有用户数据
			let userInfo = uni.getStorageSync('userInfo') || ''
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
			// 每次APP启动检擦是否为登录状态 打开WS链接
			if (this.hasLogin) {
				let users_id = uni.getStorageSync('userInfo').id
				this.connectWebSocket()
				setTimeout(() => {
					const message = {
						type: 'bind',
						uid: users_id
					}
					this.sendWebSocketMessage(JSON.stringify(message))
				}, 1000)
			}
			// 只监听登录状态
			uni.$on('loginComplete', data => {
				let users_id = uni.getStorageSync('userInfo').id
				this.connectWebSocket()
				setTimeout(() => {
					const message = {
						type: 'bind',
						uid: users_id
					}
					console.log(JSON.stringify(message))
					this.sendWebSocketMessage(JSON.stringify(message))
				}, 1000)
			})
			console.log('App 启动')
		},
		onShow: function() {},
		onHide: function() {
			console.log('App 隐藏')
		},
		computed: {
			...mapState(['hasLogin'])
		},
		methods: {
			...mapMutations(['login', 'logout', 'updateNotice']),
			connectWebSocket() {
				uni.connectSocket({
					url: config.wss, // WebSocket 服务器地址
					success: () => {
						console.log('WebSocket 连接成功');
					},
					fail: (err) => {
						console.error('WebSocket 连接失败:', err);
					}
				});

				uni.onSocketOpen(() => {
					console.log('WebSocket 已打开');
				});

				uni.onSocketClose(() => {
					console.log('WebSocket 已关闭');
				});

				uni.onSocketError((err) => {
					console.error('WebSocket 错误:', err);
				});

				uni.onSocketMessage((res) => {
					let data = JSON.parse(res.data)
					if (data.type !== 'ping' || data.type !== 'bind') {
						this.$store.commit('updateNotice', data.type)
					}
					console.log(res.data)
				});
			},
			sendWebSocketMessage(message) {
				uni.sendSocketMessage({
					data: message,
					success: () => {
						console.log('聊天WS绑定OK');
					},
					fail: (err) => {
						console.error('聊天绑定失败:', err);
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	@import './tuniao-ui/index.scss';
	@import './tuniao-ui/iconfont.css';

	/*APP自定义样式*/
	.ch-bg-main {
		background: $ch-color-primary;
	}

	.ch-bg-main--light {
		background: rgba(lighten($ch-color-primary, 30%), 0.5);
	}

	.ch-color-primary {
		color: $ch-color-primary;
	}
</style>