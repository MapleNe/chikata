<template>
	<view>
		<tn-nav-bar :isBack="false"></tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view class="tn-margin">
			<tn-button :plain="true" height="80rpx" width="80rpx" @tap="back">
				<text class="tn-text-xl tn-icon-left"></text>
			</tn-button>
			<view class="tn-flex tn-flex-direction-column">
				<text class="tn-text-bold tn-text-xl-xxl">
					嗨~友达~
				</text>
				<text class="tn-color-grey">
					快来登录吧~
				</text>
			</view>
			<view class="tn-margin-top-xl">
				<view
					class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom">
					<text class="tn-text-xxl tn-icon-email tn-padding-right"></text>
					<view class="tn-padding-right tn-flex-1">
						<tn-input type="text" placeholder="邮箱/账号" v-model="account" :clearable="false" />
					</view>
				</view>
				<view
					class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom">
					<text class="tn-text-xxl tn-padding-right" :class="codeLogin?'tn-icon-safe':'tn-icon-lock'"></text>
					<view class="tn-padding-right tn-flex-1">
						<tn-input :type="codeLogin?'number':'password'" :placeholder="codeLogin? '验证码':'密码'"
							v-model="codeLogin?code:password" :clearable="false" />
					</view>
				</view>
				<view class="tn-margin-left-sm" @tap.stop.prevent="changeLogin">
					{{codeLogin?'密码登录':'验证码登录'}}
				</view>
			</view>
			<view class="tn-margin-top tn-text-center">
				<tn-button shape="round" :plain="true" width="200rpx" @tap="loginCheck">登录</tn-button>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				account: null,
				password: null,
				code: null,
				codeLogin: false,
			}
		},
		methods: {
			changeLogin() {
				if (!this.codeLogin) {
					this.codeLogin = true
				} else {
					this.codeLogin = false
				}
			},
			loginCheck() {
				if (this.codeLogin) {
					this.volLogin()
				} else {
					this.passwordLogin()
				}
			},
			volLogin() {

			},
			passwordLogin() {
				this.$http.post('/users/login', {
					account: this.account,
					password: this.password
				}).then(res => {
					if (res.data.code === 200) {
						let data = res.data;
						uni.setStorageSync('token', data.data['login-token']);
						uni.setStorageSync('userInfo',data.data.user)
						uni.$emit('loginCompete',true)
						// console.log(uni.getStorageSync('userInfo'))
						uni.showToast({
							icon: 'none',
							title: data.msg
						});
						setTimeout(()=>{
							this.back()
						},800)
					}
				}).catch(err => {
					console.log(err);
				});
			},
			back() {
			  
			  // 通过判断当前页面的页面栈信息，是否有上一页进行返回，如果没有则跳转到首页
			  const pages = getCurrentPages()
			  if (pages && pages.length > 0) {
			    const firstPage = pages[0]
			    if (pages.length == 1 && (!firstPage.route || firstPage.route != 'pages/tabbar/index')) {
			      uni.reLaunch({
			        url: '/pages/tabbar/index'
			      })
			    } else {
			      uni.navigateBack({
			        delta: 1
			      })
			    }
			  } else {
			    uni.reLaunch({
			      url: '/pages/tabbar/index'
			    })
			  }
			}

		}
	}
</script>

<style>

</style>