<script>
	import Vue from 'vue';
	import {
		mapMutations
	} from 'vuex';
	import config from './static/config.js'
	export default {
		data() {
			return {
				socketOpen: false,
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
				if (data) {
					const socketTask = uni.connectSocket({
						url: config.wss,
						complete: (res) => {
							console.log(res, '链接ws')
						}
					});
					uni.onSocketOpen(function(res) {
						this.socketOpen = true
						console.log('WebSocket连接已打开！', res);
					});

					function sendSocketMessage() {
						const msg = {
							"type": 'bind',
							"uid": userInfo.id
						}
						if (socketOpen) {
							uni.sendSocketMessage({
								data: msg
							});
						}
					};
					uni.onSocketMessage(function(res) {
						console.log('收到服务器内容：' + res.data);
					});
				}
			})
			console.log('App Launch')
		},
		onShow: function() {},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations(['login', 'logout']),
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