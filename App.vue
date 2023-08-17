<script>
	import Vue from 'vue';
	import {
		mapMutations
	} from 'vuex';
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
			console.log('App Launch')
		},
		onShow: function() {
			const nowtime = Math.round(Date.now()/1000).toString();
			console.log('App Show',nowtime)
			console.log(uni.getStorageSync('token'))
		},
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