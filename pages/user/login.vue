<template>
	<view>
		<tn-nav-bar backTitle="" customBack alpha>
			<view slot="back" class="tn-padding tn-no-padding-left">
				<text class="tn-icon-close tn-text-xxl tn-color-white" @tap.stop.prevent="back()"></text>
			</view>
		</tn-nav-bar>
		<view style="position: relative;">
			<image src="@/static/placeholder.png" mode="aspectFill" style="width: 100%;height: 400rpx;"></image>
			<view style="position: absolute; top:370rpx;border-radius: 30rpx 30rpx;width: 100%;" class="tn-bg-white">
				<view class="tn-margin">
					<!-- <登录页面 -->
					<view class="tn-margin" v-show="loginAction&&!codeEnter">
						<view class="tn-flex tn-flex-direction-column">
							<text class="tn-text-bold">{{codeLogin?'手机短信登录':'账号密码登录'}}</text>
							<text class="tn-margin-top-xs tn-color-gray--dark" style="font-size: 28rpx;"
								v-show="codeLogin">未注册的的手机号验证通过将自动注册</text>
						</view>
						<view class="tn-margin-top">
							<!-- 手机验证码登录 -->
							<view class="tn-flex tn-flex-col-center tn-border-solids-bottom tn-border-gray--light"
								v-show="codeLogin">
								<view class="tn-border-solid-right">
									<text class="tn-margin-right">+86</text>
								</view>
								<view class="tn-padding-left tn-flex-1">
									<tn-input placeholder="请输入手机号码" placeholderStyle="font-size:32rpx;color:#C6D1D8"
										:fontSize="32" v-model="phone" type="number" :maxLength="11" rightIcon="right"
										:clearable="phone"></tn-input>
								</view>
							</view>
							<!-- 账号登录 -->
							<view class="tn-flex tn-flex-direction-column" v-show="!codeLogin">
								<view class="tn-border-solids-bottom tn-border-gray--light">
									<tn-input v-model="account" placeholderStyle="font-size:32rpx;color:#C6D1D8"
										placeholder="手机号/账号" />
								</view>
								<view class="tn-margin-top tn-border-solids-bottom tn-border-gray--light">
									<tn-input type="password" v-model="password" placeholderStyle="color:#C6D1D8"
										placeholder="密码" />
								</view>
							</view>
						</view>
						<view class="tn-margin-top-xl tn-text-center">
							<tn-checkbox v-model="accept" activeColor="#29b7cb" @change="accept =!accept" shape="circle"
								:size="30">
								<view class="tn-color-gray--dark" style="font-size: 28rpx;">
									<text>我已阅读并同意</text>
									<text class="ch-color-primary"
										@tap.stop.prevent="goAgreement($store.state.page,'agreement')">《用户协议》</text>
									<text>和</text>
									<text class="ch-color-primary"
										@tap.stop.prevent="goAgreement($store.state.page,'privacy')">《隐私政策》</text>
								</view>
							</tn-checkbox>
						</view>
						<view class="tn-margin-top-sm">
							<view class="tn-bg-gray--light tn-padding-sm tn-round tn-text-center tn-color-gray--dark"
								:class="{'ch-bg-main tn-color-white':codeLogin&&phone&&phone.length==11&&accept||!codeLogin&&account&&accept&&password}"
								@tap.stop.prevent="codeLogin&&phone&&phone.length==11&&accept?getLoginCode():account&&password?passwordLogin():''">
								<text>{{codeLogin?'获取验证码':'登录'}}</text>
							</view>
						</view>
						<view class="tn-margin-top-xl tn-padding-bottom-xl">
							<view class="tn-flex tn-flex-row-center tn-color-gray--dark" style="font-size: 28rpx;">
								<text @tap.stop.prevent="codeLogin = !codeLogin">{{codeLogin?'账密登录':'短信登录'}}</text>
								<text class="tn-margin-left tn-margin-right tn-color-gray--light">|</text>
								<text @tap.stop.prevent="issueAction=!issueAction">遇到问题</text>
							</view>
							<!-- <view class="tn-margin-top-sm tn-text-center tn-color-gray--dark" style="font-size: 28rpx;">
								<text @tap.stop.prevent="loginAction = !loginAction">通行证创建</text>
							</view> -->
						</view>
						<!-- 三方登录 -->
						<view class="tn-margin-top-xl">
							<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
								<!-- #ifndef MP-WEIXIN-->
								<view style="width: 60%;">
									<tn-button backgroundColor="tn-bg-blue" width="100%" fontColor="white"
										@click="qqLogin">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-icon-qq tn-text-xxl"></text>
											<text class="tn-margin-left-xs">QQ登录</text>
										</view>
									</tn-button>
								</view>
								<!--#endif-->
								<view class="tn-margin-top" style="width: 60%;">
									<tn-button backgroundColor="tn-bg-green" width="100%" fontColor="white">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-icon-wechat tn-text-xxl"></text>
											<text class="tn-margin-left-xs">微信登录</text>
										</view>
									</tn-button>
								</view>
							</view>
						</view>
					</view>
					<!-- 验证码验证界面 -->
					<view class="tn-margin-top" v-show="codeLogin&&codeEnter">
						<view class="tn-text-center tn-flex tn-flex-col-center tn-flex-direction-column">
							<text class="tn-text-bold" style="font-size: 30rpx;">请输入短信验证码</text>
							<text class="tn-color-gray--dark"
								style="font-size: 28rpx;">已发送至{{phone?phoneNum(phone):''}}</text>
						</view>
						<view class="tn-margin-top-sm">
							<tn-verification-code-input v-model="loginCode" :maxLength="6" :breathe="false"
								@finish="vclLogin()"></tn-verification-code-input>
							<view class="tn-margin-top-xl tn-text-center">
								<text class="ch-color-primary" :class="{'tn-color-gray--dark':seconds!==0}"
									@tap.stop.prevent="!seconds?getLoginCode():''">{{seconds!==0?`重新获取（${this.seconds}）`:'获取验证码'}}</text>
							</view>
						</view>

					</view>
					<!-- 注册页面 -->
					<view class="tn-margin" v-show="!loginAction">
						<text class="tn-text-bold">账号注册</text>
						<view class="tn-margin-top-xl tn-color-gray--dark">
							<view
								class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom-lg">
								<text class="tn-text-xxl tn-icon-my tn-padding-right"></text>
								<view class="tn-padding-right tn-flex-1">
									<tn-input type="text" placeholder="昵称"
										placeholderStyle="font-size:32rpx;color:#C6D1D8" v-model="nickname"
										:clearable="false" />
								</view>
							</view>
							<view
								class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom-lg">
								<text class="tn-text-xxl tn-icon-phone tn-padding-right"></text>
								<view class="tn-padding-right tn-flex-1">
									<tn-input type="number" :maxLength="11"
										placeholderStyle="font-size:32rpx;color:#C6D1D8" placeholder="手机号码"
										v-model="phone" :clearable="false" />
								</view>
							</view>
							<view
								class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom-lg">
								<text class="tn-text-xxl tn-padding-right tn-icon-lock"></text>
								<view class="tn-padding-right tn-flex-1">
									<tn-input type="password" placeholder="密码"
										placeholderStyle="font-size:32rpx;color:#C6D1D8" v-model="password"
										:clearable="false" />
								</view>
							</view>
							<view
								class="tn-bg-gray--light tn-round tn-padding-xs tn-padding-left tn-flex tn-flex-col-center tn-margin-bottom-lg">
								<text class="tn-text-xxl tn-padding-right tn-icon-safe"></text>
								<view class="tn-padding-right tn-flex-1">
									<tn-input type="text" placeholder="验证码"
										placeholderStyle="font-size:32rpx;color:#C6D1D8" v-model="code"
										:clearable="false" />
								</view>
								<view class="tn-margin-right-xs">
									<tn-verification-code :seconds="seconds" ref="verificationCode"
										@change="codeChange"></tn-verification-code>
									<tn-button @click="nickname&&phone&&password?getRegisterCode():''" :plain="true"
										shape="round">{{tips}}</tn-button>
								</view>
							</view>
							<view class="tn-margin-top-xl">
								<view
									class="tn-text-center tn-color-gray--dark tn-bg-gray--light tn-padding-sm tn-round"
									:class="{'ch-bg-main tn-color-white':nickname&&phone&&password&&code}"
									@tap.stop.prevent="nickname&&phone&&password&&code?createAccount():''">
									<text>创建</text>
								</view>
							</view>
							<view class="tn-margin-top-xl tn-color-gray--dark tn-flex tn-flex-row-center">
								<text @tap.stop.prevent="loginAction=!loginAction"
									style="font-size: 28rpx;">通行证登录</text>
							</view>
						</view>

					</view>
				</view>
			</view>

		</view>
		<!-- 遇到问题弹出层 -->
		<tn-popup mode="bottom" v-model="issueAction" :borderRadius="30">
			<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
				<text class="tn-margin">忘记密码</text>
				<text class="tn-margin">账号申述</text>
				<text class="tn-margin">常见问题</text>
			</view>
			<view class="tn-text-center tn-text-bold tn-bg-gray--light tn-padding"
				@tap.stop.prevent="issueAction=!issueAction">
				<text>取消</text>
			</view>
		</tn-popup>
		<tn-popup mode="center" :borderRadius="20" v-model="breakLogin" length="80%">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
					<text>登录中止</text>
					<text class="tn-padding-sm tn-color-gray--dark" style="font-size: 28rpx;">点击“确定”之后将中断登录，确定返回？</text>
				</view>
			</view>
			<view class="tn-padding tn-color-gray--dark tn-bg-gray--light">
				<view class="tn-flex tn-flex-row-around" style="font-size: 28rpx;">
					<text @tap.stop.prevent="breakLogin=!breakLogin">取消</text>
					<text class="tn-color-grey--light">|</text>
					<text class="ch-color-primary" @tap.stop.prevent="back()">确定</text>
				</view>
			</view>
		</tn-popup>
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
				phone: null,
				nickname: null,
				password: null,
				code: null,
				loginCode: '',
				codeLogin: true,
				seconds: 65,
				tips: null,
				loginAction: true,
				accept: false,
				issueAction: false,
				codeEnter: false,
				loginTips: null,
				timer: null,
				breakLogin: false,
				realBack: false,
			}
		},
		beforeRouteLeave(to, from, next) {
			if (!this.realBack && this.codeEnter) {
				this.breakLogin = !this.breakLogin
				this.realBack = true
				this.$Router.$lockStatus = false
			} else {
				next()
			}
		},
		onReady() {},
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
		onShow() {},
		methods: {
			...mapMutations(['logout', 'login', 'setToken', 'setRefreshToken']),
			phoneNum(phone) {
				let userPhone = phone.substring(0, 3) + '****' + phone.substring(7)
				return userPhone
			},
			loginChange(text) {
				this.loginTips = text
			},
			loginCheck() {
				if (this.account || this.phone && this.password) {
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
					case this.nickname == null:
						uni.showToast({
							icon: 'none',
							title: '昵称为空'
						});
					case this.account == null:
						uni.showToast({
							icon: 'none',
							title: '邮箱为空'
						});
					case this.password == null:
						uni.showToast({
							icon: 'none',
							title: '密码为空'
						});
						break;
					case this.code == null:
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
					account: this.phone,
					code: this.loginCode,
					cid: this.cid
				}).then(res => {
					console.log(res)
					if (res.data.code === 200 || res.data.code === 201) {
						let data = res.data
						let token = data.data['login-token']
						this.setRefreshToken(res.data.data.refreshToken)
						this.setToken(token)
						// uni.setStorageSync('userInfo', data.data.user)
						this.login(data.data.user)
						uni.$emit('loginComplete', true)
						uni.showToast({
							icon: 'none',
							title: data.msg
						});
						this.realBack = true
						if (res.data.code === 200) {
							setTimeout(() => {
								this.back()
							}, 800)
						} else {
							this.$Router.push({
								path: '/pages/user/firstLogin/firstLogin'
							})
						}

					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
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
						this.realBack = true
						setTimeout(() => {
							this.back()
						}, 800)
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
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

			createAccount() {
				if (this.phone.length < 11) {
					uni.showToast({
						icon: 'none',
						title: '手机号码格式错误'
					})
					return;
				}
				this.$http.post('/users/register', {
					nickname: this.nickname,
					phone: this.phone,
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
			qqLogin() {
				if (!this.accept) {
					uni.showToast({
						icon: 'none',
						title: '请先阅读并同意协议后再登录'
					})
					return;
				}
				uni.login({
					provider: 'qq',
					success: (res) => {
						console.log(res)
						uni.getUserInfo({
							provider: 'qq',
							success: (info) => {
								this.goQqLogin(info.userInfo)
							}
						})
					}
				})
			},
			goQqLogin(info) {
				console.log(info)
				this.$http.post('/users/qqlogin', {
					openId: info.openId,
					figureurl_qq: info.figureurl_qq,
					nickname: info.nickname,
					gender: info.gender,
					//#ifdef APP-PLUS
					cid: this.cid,
					//#endif

				}).then(res => {
					if (res.data.code === 200) {
						console.log(res.data.data)
						let data = res.data
						let token = data.data['login-token']
						this.setRefreshToken(data.data.refreshToken)
						this.setToken(token)
						uni.setStorageSync('loginExp', data.data.loginExp)
						uni.setStorageSync('refreshExp', data.data.refreshExp)
						// uni.setStorageSync('userInfo', data.data.user)
						this.login(data.data.user)
						uni.$emit('loginComplete', true)
						uni.showToast({
							icon: 'none',
							title: data.msg
						});
						this.realBack = true
						setTimeout(() => {
							this.back()
						}, 800)
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					}
				}).catch(err => {
					console.log(err)
					uni.showToast({
						icon: 'none',
						title: err.data.msg
					})
				});
			},
			codeChange(text) {
				this.tips = text
			},
			getLoginCode() {
				this.$http.post('/users/vcl', {
					account: this.phone,
				}).then(res => {
					console.log(res)
					if (res.data.code === 200) {
						if (!this.codeEnter) this.codeEnter = true
						if (!this.timer) { //计时器
							this.seconds = 60
							this.timer = setInterval(() => {
								if (this.seconds !== 0) {
									this.seconds--
								} else {
									clearInterval(this.timer);
								}
							}, 1000)
						}
						if (res.data.data.code) {
							this.loginCode = res.data.data.code
						}
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					}

				})
			},
			getRegisterCode() {
				if (this.phone.length < 11) {
					uni.showToast({
						icon: 'none',
						title: '手机号码格式错误'
					})
					return
				}
				if (this.$refs.verificationCode.canGetCode) {
					this.$http.post('/users/register', {
						nickname: this.nickname,
						account: this.phone,
						phone: this.phone,
						password: this.password,
					}).then(res => {
						console.log(res)
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					}).catch(err => {
						console.log(err)
					})
					setTimeout(() => {
						uni.hideLoading()
						this.$refs.verificationCode.start()
					}, 2000)
				}
			},
			// 协议页面
			goAgreement(data, alias) {
				for (let i = 0; i < data.length; i++) {
					if (data[i].alias == alias) {
						this.$Router.push({
							path: '/pages/user/setting/agreement',
							query: {
								id: data[i].id
							}
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
</style>