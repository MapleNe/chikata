<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			authCheck() {
				let that = this;
				that.$http.post('/users/check', {
					
				}, {
					header: {
						'Authorization': uni.getStorageSync('token')
					}
				}).then(res => {
					if (res.data.code != 200) {
						uni.clearStorageSync('token')
						uni.clearStorageSync('userInfo')
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import './tuniao-ui/index.scss';
	@import './tuniao-ui/iconfont.css';
</style>