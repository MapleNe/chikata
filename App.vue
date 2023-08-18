<script>
	import Vue from 'vue';
	import {
		mapMutations,
		mapState
	} from 'vuex';
	import config from './static/config.js'
	import WS from "@/utils/webSocket.js";
	export default {
		data() {
			return {
				ws: null,
				isLogin: false,
			}
		},
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
			uni.$on('loginComplete', data => {
				this.isLogin = true
			})
			if (uni.getStorageSync('token') || this.isLogin) {
				this.ws && this.ws.closeSocket();
				this.ws = new WS(config.wss) // xxx 表示接口地址URL
				// 发送数据
				const msg = {
					type: 'bind',
					uid: userInfo.id
				}
				const message = JSON.stringify(msg)
				setTimeout(() => {
					this.ws.webSocketSendMsg(message)
				}, 1000)

				this.ws.getWebSocketMsg(data => {
					const dataJson = data;
					console.log('data', dataJson);
					if (typeof(dataJson) == "object") {
						console.log("wsObject", dataJson);
						if (data.type === 'like' || data.type === 'focus' || data.type === 'comment' || data
							.type === 'placard') {
							this.$store.commit('updateNotice', data.type)
						} else if (data.type === 'chat') {
							uni.$emit('getNewChat', data)
						}

					} else {
						console.log(dataJson);
					}
				});
			}

			console.log('App 启动')
		},
		beforeDestroy() {
			this.ws && this.ws.closeSocket();
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