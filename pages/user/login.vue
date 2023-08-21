<template>
	<view>
		<tn-nav-bar :isBack="false"></tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view class="tn-margin">
			<tn-button :plain="true" height="80rpx" width="80rpx" @tap="back">
				<text class="tn-text-xl tn-icon-left"></text>
			</tn-button>
			<view class="tn-flex tn-flex-direction-column">
				<text class="tn-text-bold tn-text-xl-xxl tn-margin-bottom-sm tn-margin-top-lg">
					Luck Day
				</text>
				<text class="tn-color-grey tn-margin-bottom-sm">
					快来{{loginAction?'登录':'注册'}}吧~
				</text>
				<view class="tn-color-grey tn-flex tn-flex-direction-column" style="height: 30rpx;" v-show="hitokoto">
					<text>{{hitokoto.hitokoto}}</text>
					<text class="tn-text-right tn-icon-right-triangle">{{hitokoto.from}}</text>
				</view>
			</view>
			<view v-if="loginAction">
				<view class="tn-margin-top-xl tn-padding-top-xl">
					<view
						class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom-lg">
						<text class="tn-text-xxl tn-icon-email tn-padding-right"></text>
						<view class="tn-padding-right tn-flex-1">
							<tn-input type="text" placeholder="邮箱/账号" v-model="account" :clearable="false" />
						</view>
					</view>
					<view
						class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom-lg">
						<text class="tn-text-xxl tn-padding-right"
							:class="codeLogin?'tn-icon-safe':'tn-icon-lock'"></text>
						<view class="tn-padding-right tn-flex-1">
							<tn-input :type="codeLogin?'text':'password'" :placeholder="codeLogin? '验证码':'密码'"
								v-model="passMode" :clearable="false" />
						</view>
						<view class="tn-margin-right-xs" v-if="codeLogin">
							<tn-verification-code :seconds="seconds" ref="verificationCode"
								@change="codeChange"></tn-verification-code>
							<tn-button @tap="getCode" :plain="true" shape="round">{{tips}}</tn-button>
						</view>

					</view>
					<view class="tn-margin-left-sm tn-flex tn-flex-row-between">
						<text @tap.stop.prevent="changeLogin">
							{{codeLogin?'密码登录':'验证码登录'}}
						</text>
						<text @tap="fogetPassword">忘记密码？</text>
					</view>
				</view>
				<view class="tn-margin-top-xl tn-text-center">
					<tn-button shape="round" :plain="true" width="200rpx" @tap="loginCheck">登录</tn-button>
				</view>
				<view class="tn-margin-top-xl tn-flex tn-flex-row-center">
					<text @tap="createAction">通行证创建</text>
				</view>
				<view class="tn-padding-xl tn-margin-xl">
					<view class="tn-margin-top-xl tn-text-xxl tn-flex tn-flex-row-around tn-padding-xl">
						<text class="tn-icon-qq tn-bg-blue tn-round tn-padding-xs tn-color-white"></text>
						<text class="tn-icon-wechat tn-bg-green tn-round tn-padding-xs tn-color-white"></text>
					</view>
				</view>
			</view>
			<view v-else>
				<view class="tn-margin-top-xl tn-padding-top-xl">
					<view
						class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom-lg">
						<text class="tn-text-xxl tn-icon-my tn-padding-right"></text>
						<view class="tn-padding-right tn-flex-1">
							<tn-input type="text" placeholder="昵称" v-model="nickname" :clearable="false" />
						</view>
					</view>
					<view
						class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom-lg">
						<text class="tn-text-xxl tn-icon-email tn-padding-right"></text>
						<view class="tn-padding-right tn-flex-1">
							<tn-input type="email" placeholder="邮箱" v-model="account" :clearable="false" />
						</view>
					</view>
					<view
						class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom-lg">
						<text class="tn-text-xxl tn-padding-right tn-icon-lock"></text>
						<view class="tn-padding-right tn-flex-1">
							<tn-input type="password" placeholder="密码" v-model="password" :clearable="false" />
						</view>
					</view>
					<view
						class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom-lg">
						<text class="tn-text-xxl tn-padding-right tn-icon-safe"></text>
						<view class="tn-padding-right tn-flex-1">
							<tn-input type="text" placeholder="验证码" v-model="code" :clearable="false" />
						</view>
						<view class="tn-margin-right-xs">
							<tn-verification-code :seconds="seconds" ref="verificationCode"
								@change="codeChange"></tn-verification-code>
							<tn-button @tap="getCode" :plain="true" shape="round">{{tips}}</tn-button>
						</view>
					</view>
					<view class="tn-margin-top-xl tn-text-center">
						<tn-button shape="round" :plain="true" width="200rpx" @tap="registerCheck">注册</tn-button>
					</view>
					<view class="tn-margin-top-xl tn-flex tn-flex-row-center">
						<text @tap="createAction">通行证登录</text>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {
				account: null,
				nickname: null,
				password: null,
				code: null,
				codeLogin: false,
				seconds: 60,
				tips: null,
				loginAction: true,
				hitokoto: [],
				timer: null,
			}
		},
		computed: {
			// v-model无法使用三元判断 使用计算属性
			passMode: {
				get() {
					return this.codeLogin ? this.code : this.password;
				},
				set(value) {
					if (this.codeLogin) {
						this.code = value;
					} else {
						this.password = value;
					}
				}
			},
			cid: {
				get() {
					return this.$store.state.cid
				},
				set(value) {

				}
			}
		},
		onShow() {
			this.getHitokoto();
			this.timer = setInterval(() => {
				this.getHitokoto();
			}, 30000);
		},
		onHide() {
			clearInterval(this.timer);
			this.timer = null;
		},
		methods: {
			...mapMutations(['logout', 'login', 'setToken', 'setRefreshToken']),
			changeLogin() {
				if (!this.codeLogin) {
					this.codeLogin = true
				} else {
					this.codeLogin = false
				}
			},
			loginCheck() {
				if (this.account && this.password) {
					if (this.codeLogin) {
						this.vclLogin();
					} else {
						this.passwordLogin();
					}
				} else {
					uni.showToast({
						icon: 'none',
						title: '账号或密码不能为空'
					});
				}
			},
			registerCheck() {
				switch (true) {
					case this.account === null:
						uni.showToast({
							icon: 'none',
							title: '邮箱为空'
						});
						break;
					case this.password === null:
						uni.showToast({
							icon: 'none',
							title: '密码为空'
						});
						break;
					case this.code === null:
						uni.showToast({
							icon: 'none',
							title: '验证码为空'
						})
					default:
						// 处理账号和密码都不为空的情况
						this.createAccount()
						// 执行相应的注册操作
						break;
				}
			},
			vclLogin() {
				this.$http.post('/users/vcl', {
					account: this.account,
					code: this.code,
					cid: this.cid
				}).then(res => {
					if (res.data.code === 200) {
						let data = res.data
						let token = data.data['login-token']
						this.setRefreshToken(res.data.data.refreshToken)
						this.setToken(token)
						// uni.setStorageSync('userInfo', data.data.user)
						this.login(data.data.user)
						uni.$emit('loginComplete', true)
						console.log(data.data.user)
						uni.showToast({
							icon: 'none',
							title: data.msg
						});
						setTimeout(() => {
							this.back()
						}, 800)
					}
				})
			},
			passwordLogin() {
				this.$http.post('/users/login', {
					account: this.account,
					password: this.password,
					//#ifdef APP-PLUS
					cid: this.cid,
					//#endif

				}).then(res => {
					if (res.data.code === 200) {
						let data = res.data
						let token = data.data['login-token']
						this.setRefreshToken(data.data.refreshToken)
						this.setToken(token)
						uni.setStorageSync('loginExp', data.data.loginExp)
						uni.setStorageSync('refreshExp', data.data.refreshExp)
						// uni.setStorageSync('userInfo', data.data.user)
						this.login(data.data.user)
						uni.$emit('loginComplete', true)
						console.log(res)
						uni.showToast({
							icon: 'none',
							title: data.msg
						});
						setTimeout(() => {
							this.back()
						}, 800)
					}
				}).catch(err => {
					console.log(err)
					uni.showToast({
						icon: 'none',
						title: err.data.msg
					})
				});
			},
			fogetPassword() {
				uni.showToast({
					icon: 'none',
					title: '忘记就忘记了呗'
				})
			},
			createAction() {
				if (!this.loginAction) {
					this.loginAction = true
				} else {
					this.loginAction = false
				}

			},
			getRegisterCode() {
				this.$http.post('/users/register', {
					nickname: this.nickname,
					email: this.account,
					password: this.password,
				}).then(res => {
					console.log(res)
					uni.showToast({
						icon: 'none',
						title: res.data.msg
					})
				})
			},
			createAccount() {
				this.$http.post('/users/register', {
					nickname: this.nickname,
					email: this.account,
					password: this.password,
					code: this.code
				}).then(res => {
					console.log(res)
					uni.showToast({
						icon: 'none',
						title: res.data.msg
					})
					setTimeout(() => {
						this.passwordLogin()
					}, 500)
				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: err.data.msg
					})
				})
			},
			back() {
				// 通过判断当前页面的页面栈信息，是否有上一页进行返回，如果没有则跳转到首页
				const pages = getCurrentPages()
				if (pages && pages.length > 0) {
					const firstPage = pages[0]
					if (pages.length == 1 && (!firstPage.route || firstPage.route != 'pages/tabbar/index')) {
						this.$Router.replaceAll({
							path: '/pages/tabbar/index'
						})
					} else {
						this.$Router.back(1)
					}
				} else {
					this.$Router.replaceAll({
						path: '/pages/tabbar/index'
					})
				}
			},
			codeChange(text) {
				this.tips = text
			},
			getCode() {
				if (this.account === null) {
					uni.showToast({
						icon: 'none',
						title: '请输入账号'
					})
					return;
				}
				if (this.$refs.verificationCode.canGetCode) {
					//请求验证码
					if (!this.loginAction) {
						this.getRegisterCode()
					} else {
						this.getLoginCode()
					}
					setTimeout(() => {
						uni.hideLoading()
						this.$refs.verificationCode.start()
					}, 2000)
				} else {
					uni.showToast({
						icon: 'none',
						title: '倒计时结束后可再次获取！'
					})
				}
			},
			getLoginCode() {
				this.$http.post('/users/vcl', {
					account: this.account,
				}).then(res => {
					uni.showToast({
						icon: 'none',
						title: res.data.msg
					})
				})
			},
			getHitokoto() {
				this.$http.get('/proxy', {
					params: {
						p_url: 'https://v1.hitokoto.cn/?c=a&c=b&c=c',
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.hitokoto = res.data.data
					}
				})
			},

		}
	}
</script>

<style>

</style>