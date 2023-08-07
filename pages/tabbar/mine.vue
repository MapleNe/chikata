<template>
	<z-paging-swiper>
		<template #top>
			<view class="tn-flex tn-flex-direction-column">
				<!-- 头部控件 -->

				<view class="image-wrapper" style="position: relative;">
					<image :src="userInfo.longtext.background_img?userInfo.longtext.background_img:'/static/logo.png'"
						style="height: 500rpx;width: 100%;" mode="aspectFill">
					</image>
				</view>
				<view class="tn-margin tn-flex" style="position: absolute; right: 0;top: 380rpx;" v-if="hasLogin">
					<view class="tn-margin-right-sm">
						<tn-button :plain="true" size="sm" shape="round" @tap="goProfile">编辑</tn-button>
					</view>
					<view>
						<tn-button :plain="true" size="sm" shape="round" @tap="logout">退出</tn-button>
					</view>

				</view>
				<view class="tn-padding" style="position: absolute;top: 100rpx;width: 100%;">
					<view class="tn-flex tn-flex-col-center">
						<tn-avatar :src="userInfo.head_img" size="xl" :border="true" backgroundColor="#f8f7f8"
							borderColor="#ffffff" :borderSize="6" @tap="hasLogin ? goProfile() : goLogin()">
						</tn-avatar>
						<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-flex-1 tn-margin-left-sm">
							<view class="tn-flex tn-flex-col-center">
								<text :class="userInfo.level==='admin'?'ch-color-primary':'tn-color-white'"
									class="tn-text-bold tn-text-xl">{{userInfo.nickname}}</text>
							</view>
							<view v-if="hasLogin">

							</view>
						</view>
					</view>
				</view>

				<!-- 控件结束 -->
				<v-tabs v-model="tabsIndex" :tabs="tabs" @change="changeTab" lineHeight="8rpx" lineColor="#29B7CB"
					:zIndex="2" activeColor="#29B7CB" :lineScale="0.2"
					style="position: relative;bottom: 20rpx;border-radius: 20rpx;">
				</v-tabs>
			</view>
		</template>
		<swiper class="swiper" :current="tabsIndex" @change="changeSwpier">
			<swiper-item class="swiper-item">
				<userArticle :tabsIndex="tabsIndex" :swiperIndex="tabsIndex" v-if="hasLogin"></userArticle>
				<view class="tn-flex tn-flex-row-center tn-margin-top-xl" v-else>
					<tn-button size="sm" :plain="true" shape="round" @tap="goLogin">去登录</tn-button>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<view v-if="hasLogin">
					<collectList :tabsIndex="tabsIndex" :swiperIndex="swiperIndex"></collectList>
					<view class="tn-margin" style="position: absolute;right: 0;bottom: 40rpx;"
						@tap.stop="showCollect = true">
						<tn-button shape="icon" backgroundColor="#29B7CB" size="lg" fontColor="tn-color-white">
							<text class="tn-icon-add"></text>
						</tn-button>
					</view>
				</view>
				<view class="tn-flex tn-flex-row-center tn-margin-top-xl" v-else>
					<tn-button size="sm" :plain="true" shape="round" @tap="goLogin">去登录</tn-button>
				</view>
			</swiper-item>
		</swiper>
		<tn-modal v-model="showCollect" :custom="true" :showCloseBtn="true" width="92%" padding="0rpx" :zIndex="5">
			<view class="tn-margin">
				<view class="tn-margin-bottom-lg">
					<text class="tn-text-bold">创建合集</text>
				</view>

				<view class="ch-bg-main tn-color-white tn-flex tn-flex-col-center tn-margin-bottom-sm"
					style="border-radius: 10rpx;position: relative;">
					<view class="tn-padding-xs" @tap.stop="imageChoose">
						<tn-avatar :border="true" borderColor="#fff" :borderSize="6" size="xl"
							:src="collectHead"></tn-avatar>
					</view>
					<view class="tn-flex tn-flex-col-center tn-flex-direction-column tn-flex-1">
						<tn-input :maxLength="18" v-model="collectName" :clearable="false" placeholder="合集名称"
							placeholderStyle="color:white" />
						<tn-input :maxLength="50" v-model="collectDesc" :clearable="false" placeholder="合集介绍"
							placeholderStyle="color:white" />
					</view>
				</view>
				<view class="tn-margin-top">
					<view class="tn-flex tn-flex-row-right" @tap.stop="createCollect">
						<tn-button size="sm" backgroundColor="#29B7CB" fontColor="tn-color-white">创建</tn-button>
					</view>
				</view>
			</view>
		</tn-modal>
		<l-clipper v-if="showClipper" :image-url="imageUrl"
			@success="collectHead = $event.url; upload();showTabbar();showClipper = false"
			@cancel="showTabbar();showClipper = false" :max-width="700" :max-height="700"
			:is-limit-move="true"></l-clipper>
	</z-paging-swiper>

</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import userArticle from "@/components/userArticle/userArticle.vue";
	import collectList from "@/components/collectList/collectList.vue";
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			userArticle,
			collectList
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']), //从Store获取全局变量
		},
		data() {
			return {
				content: [],
				tabs: ['动态', '合集'],
				tabsIndex: 0,
				swiperHeight: 0, //活动组件高度
				comments: [],
				swiperIndex: null,
				showCollect: false,
				collectHead: null,
				collectName: null,
				collectDesc: null,
				showClipper: false,
				imageUrl: null,
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['logout']),
			changeTab(index) {
				this.tabsIndex = index
			},
			changeSwpier(event) {
				this.swiperIndex = event.detail.current
				this.tabsIndex = event.detail.current
			},
			//前往登录
			goLogin() {
				console.log('点击了登录')
				this.$Router.push({
					path: '/pages/user/login'
				})
			},
			createCollect() {
				let emptyField = ''

				if (!this.collectHead) {
					emptyField = '合集头像'
				} else if (!this.collectName) {
					emptyField = '合集名称'
				}

				if (emptyField) {
					uni.showToast({
						title: `请填写${emptyField}后提交`
					})
					return
				}

				this.$http.post('/collections/Create', {
					name: this.collectName,
					img: this.collectHead,
					descrip: this.collectDesc ? this.collectDesc : ''
				}).then(res => {
					if (res.data.code === 200) {
						uni.$emit('createCollect', true)
						this.showCollect = false
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
			//个人主页
			goProfile() {
				this.$Router.push({
					path: '/pages/user/profile',
					animation: {
						animationType: 'pop-in',
						animationDuration: 300
					}
				})
			},
			imageChoose() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'], //从相册选择
					success: res => {
						this.imageUrl = res.tempFilePaths[0] //交给裁剪去处理
						uni.hideTabBar()
						this.showClipper = true
					}
				})
			},
			showTabbar() {
				uni.showTabBar()
			},
			upload() {
				const filePath = this.$isBase64(this.collectHead) ? this.collectHead : 'file://' + plus.io
					.convertLocalFileSystemURL(this.collectHead)
				this.$http.upload('/file/upload', {
					filePath: filePath,
					name: 'file'
				}).then(res => {
					if (res.data.code === 200) {
						this.collectHead = res.data.data
					}
				})
			},
			// logout() {
			// 	console.log('点击了退出')
			// 	uni.clearStorageSync('token')
			// 	uni.clearStorage('userInfo')
			// 	this.isLogin = false
			// 	setTimeout(() => {
			// 		this.$router.go(0)
			// 	}, 200)
			// }
		}
	}
</script>

<style lang="scss">
	.image-wrapper {
		position: relative;
	}

	.image-wrapper::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
	}

	.swiper {
		height: 100%;
	}
</style>