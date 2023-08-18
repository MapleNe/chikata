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
				ws: null
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
			this.ws && this.ws.closeSocket();
			this.ws = new WS(config.wss) // xxx 表示接口地址URL
			// 发送数据
			const msg = {
				type: 'bind',
				uid: userInfo.id
			}
			setTimeout(() => {
				this.ws.webSocketSendMsg(JSON.stringify(msg))
			}, 1000)

			this.ws.getWebSocketMsg(data => {
				const dataJson = data;
				console.log('data', dataJson);
				if (typeof(dataJson) == "object") {
					
					console.log("wsObject", dataJson);
					console.log('wsObject', dataJson.type)
				} else {
					console.log(dataJson);
				}
			});
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