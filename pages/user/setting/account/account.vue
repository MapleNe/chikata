<template>
	<view>
		<tn-nav-bar backTitle="" :zIndex="2">
			<text>通行证账号与安全</text>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<tn-list-cell :arrow="true">管理收获地址</tn-list-cell>
		<tn-list-cell :arrow="true" @click="showChangePassword=true">修改密码</tn-list-cell>
		<tn-list-cell :arrow="true" @click="goSecurity()">账号安全设置</tn-list-cell>
		<tn-list-cell unlined :arrow="true">注销账号</tn-list-cell>
		<tn-popup mode="center" :borderRadius="20" v-model="showChangePassword" length="80%" :zIndex="3">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-row-center">
					<text>修改密码</text>
				</view>
				<view class="tn-flex tn-flex-direction-column">
					<view class="tn-flex tn-flex-direction-column tn-margin-bottom">
						<text class="tn-color-gray--dark">新密码</text>
						<view class="tn-margin-top tn-radius tn-bg-gray--light tn-padding-left-sm tn-padding-right-sm">
							<tn-input type="password" v-model="password"></tn-input>
						</view>
					</view>
					<view class="tn-flex tn-flex-direction-column tn-margin-bottom">
						<view class="tn-flex tn-flex-col-bottom tn-color-gray--dark">
							<text>验证码</text>
							<text class="tn-text-sm tn-margin-left"></text>
						</view>
						<view
							class="tn-margin-top tn-radius tn-flex tn-flex-col-center tn-border-solid-bottom tn-padding-left-sm tn-padding-right-sm"
							style="border-bottom-color: #29b7cb;">
							<tn-input v-model="code"></tn-input>
							<text class="tn-color-gray--disabled">|</text>
							<text class="ch-color-primary tn-margin-left-sm" @tap.stop="getCode()">{{tips}}</text>
							<tn-verification-code :seconds="seconds" ref="verificationCode" @change="codeChange"
								uniqueKey="changePassword"></tn-verification-code>
						</view>

					</view>
				</view>
			</view>
			<view class="tn-padding tn-color-gray--dark tn-bg-gray--light">
				<view class="tn-flex tn-flex-row-around" style="font-size: 28rpx;">
					<text @tap.stop="showChangePassword = false">取消</text>
					<text class="tn-color-grey--light">|</text>
					<text class="ch-color-primary" @tap.stop="save()">确定</text>
				</view>
			</view>
		</tn-popup>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				showChangePassword: false,
				password: '',
				seconds: 60,
				code: '',
				tips: '',
			};
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			codeChange(text) {
				this.tips = text
			},
			phoneNum(phone) {
				let userPhone = phone.substring(0, 3) + '****' + phone.substring(7)
				return userPhone
			},
			goSecurity() {
				this.$Router.push({
					path: '/pages/user/setting/account/security'
				})
			},
			save() {
				if (!this.code) {
					uni.showToast({
						icon: 'none',
						title: '请输入验证码！'
					})
					return
				}
				this.$http.put('/users/save', {
					id: this.userInfo.id,
					password: this.password,
					code: this.code,
				}).then(res => {
					if (res.data.code === 200) {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
						setTimeout(() => {
							this.showChangePassword = false
						}, 200)

					}
				})
			},
			getCode() {
				if (this.password.length < 8) {
					uni.showToast({
						icon: 'none',
						title: '密码长度必须大于等于8'
					})
					return;
				}
				if (this.$refs.verificationCode.canGetCode) {
					this.$http.put('/users/save', {
						id: this.userInfo.id,
						password: this.password,
						code: ''
					}).then(res => {
						console.log(res)
						if (res.data.code == 201) {
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							})
							// 通知验证码组件内部开始倒计时
							setTimeout(() => {
								this.$refs.verificationCode.start()
							}, 400)
						}
					}).catch(err => {
						console.log(err)
					})
				}
			}
		}
	}
</script>

<style lang="scss">

</style>