<template>
	<view class="tn-flex tn-flex-col-center tn-flex-row-center tn-flex-direction-column" style="height: 100vh;">
		<view class="animate__animated animate__rotateIn animate__faster" v-show="showAnimate">
			<text class="tn-text-xxl tn-text-bold">yaHoo~</text>
		</view>
		<view class="tn-flex tn-flex-direction-column tn-flex-col-center tn-margin-top"
			hover-class="animate__animated animate__fadeOut" v-show="showAnimate" @tap.stop.prevent="setting()">
			<text>你已经完成了第一步了</text>
			<text>点击我然后开始设置你的账号吧~</text>
		</view>
		<view v-show="!showAnimate&&!avatarOk" class="tn-flex tn-flex-col-center tn-flex-direction-column">
			<view class="animate__animated animate__backInLeft tn-flex tn-flex-col-center tn-flex-direction-column">
				<text>看来你已经准备好了</text>
				<text>看到中间的圆了吗？点击它</text>
			</view>
			<view class="animate__animated animate__slideInUp tn-margin-top" @tap.stop.prevent="imageChoose()">
				<tn-avatar :src="avatar" size="xxl"></tn-avatar>
			</view>
			<view class="tn-margin-top">
				<text class="tn-text-md tn-color-gray--dark">点击添加头像</text>
			</view>
			<view class="tn-margin-top-xl animate__animated animate__zoomIn" v-show="avatar">
				<tn-button plain shape="round" @click="avatarOk = !avatarOk">下一步</tn-button>
			</view>
		</view>
		<view v-show="avatarOk" class="tn-flex tn-flex-col-center tn-flex-direction-column" style="position: relative;">
			<view class="animate__animated animate__tada">
				<text>最后一步啦！你的昵称叫什么？</text>
			</view>
			<view class="tn-margin-bottom-xl tn-bg-gray--light tn-round tn-margin-top tn-padding-left-sm tn-padding-right-sm" style="width: 100%;">
				<tn-input v-model="nickname" placeholder="请输入你的昵称" :clearable="false" :maxLength="18"></tn-input>
			</view>
			<view class="animate__animated animate__zoomIn" v-show="nickname" style="position: absolute;top: 400rpx;">
				<tn-button shape="round" plain @click="nickname?modifyProfile():''">开启酒馆之旅~</tn-button>
			</view>
		</view>
		<l-clipper v-if="showClipper" :image-url="imageUrl"
			@success="avatar = $event.url; upload(); showClipper = false" @cancel="showClipper = false" :max-width="700"
			:max-height="700" :is-limit-move="true"></l-clipper>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				showAnimate: true,
				avatar: null,
				imageUrl: null,
				nickname: null,
				avatarOk: false,
				showClipper: false,
			}
		},
		computed: {
			...mapState(['userInfo'])
		},
		methods: {
			setting() {
				setTimeout(() => {
					this.showAnimate = false
				}, 400)
			},
			imageChoose() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'], //从相册选择
					success: res => {
						this.imageUrl = res.tempFilePaths[0] //交给裁剪去处理
						this.showClipper = true
					}
				})
			},
			upload() {
				const filePath = this.$isBase64(this.avatar) ? this.avatar : 'file://' + plus.io
					.convertLocalFileSystemURL(this.avatar)
				this.$http.upload('/file/upload', {
					filePath: filePath,
					name: 'file'
				}).then(res => {
					if (res.data.code === 200) {
						this.avatar = res.data.data
					}
				})
			},
			modifyProfile() {
				this.$http.put('/users/save', {
					id: this.userInfo.id,
					head_img: this.avatar,
					nickname: this.nickname,
				}).then(res => {
					console.log(res)
					if (res.data.code === 200) {
						//每次更新都需要获取最新用户数据否则无法实时更新
						this.getUserProfile()
						if(this.nickname){
							this.$Router.replaceAll('/pages/tabbar/index')
						}
					}
				}).catch(err=>{
					console.log(res)
				})
			},
			getUserProfile() {
				this.$http.get('/users/one', {
					params: {
						id: this.userInfo.id
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$store.commit('setUserInfo', res.data.data)
						console.log('用户数据更新完成')
					}
				})
			},

		}
	}
</script>

<style lang="scss" scoped>

</style>