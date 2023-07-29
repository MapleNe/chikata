<template>
	<z-paging-swiper>
		<template #top>
			<view class="tn-flex tn-flex-direction-column">
				<!-- 头部控件 -->
				<view style="position: fixed; right: 0;z-index: 2;" class="tn-margin" v-if="hasLogin">
					<tn-button :plain="true" size="sm" shape="round" @tap="logout">退出</tn-button>
				</view>
				<view class="image-wrapper">
					<image :src="userInfo.head_img" style="position: relative;height: 500rpx;width: 100%;"
						mode="aspectFill">
					</image>
				</view>
				<view class="tn-padding" style="position: absolute;top: 100rpx;width: 100%;">
					<view class="tn-flex tn-flex-col-center">
						<tn-avatar :src="userInfo.head_img" size="xl" :border="true" backgroundColor="#f8f7f8"
							borderColor="#ffffff" :borderSize="6" @tap="hasLogin ? goProfile() : goLogin()">
						</tn-avatar>
						<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-flex-1 tn-margin-left-sm">
							<view class="tn-flex tn-flex-col-center">
								<text :class="userInfo.level==='admin'?'ch-color-main':'tn-color-white'"
									class="tn-text-bold tn-text-xl">{{userInfo.nickname}}</text>
							</view>
							<view v-if="hasLogin">
								<tn-button :plain="true" size="sm" shape="round"> 编辑
								</tn-button>
							</view>
						</view>
					</view>
				</view>
				<!-- 控件结束 -->
				<view style="position: relative;bottom: 20rpx;">
					<v-tabs v-model="tabsIndex" :tabs="tabs" @change="changeTab" lineHeight="8rpx" lineColor="#29B7CB"
						:zIndex="2" activeColor="#29B7CB"
						style="border-radius: 20rpx 20rpx 0 0;background-color: white;">
					</v-tabs>
				</view>

			</view>
		</template>
		<swiper class="swiper" :current="tabsIndex" @change="changeSwpier">
			<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">
				<userArticle :tabsIndex="index" :swiperIndex="tabsIndex" v-if="hasLogin"></userArticle>
				<view class="tn-flex tn-flex-row-center tn-margin-top-xl" v-else>
					<tn-button size="sm" :plain="true" shape="round" @tap="goLogin">去登录</tn-button>
				</view>
			</swiper-item>
		</swiper>
	</z-paging-swiper>

</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import userArticle from "@/components/userArticle/userArticle.vue";
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			userArticle
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']), //从Store获取全局变量
		},
		data() {
			return {
				content: [],
				tabs: ['动态', '评论'],
				tabsIndex: 0,
				swiperHeight: 0, //活动组件高度
				comments: [],
				token: null,
			}
		},
		onLoad() {
			// uni.clearStorageSync('token')
			// uni.clearStorageSync('userInfo')

		},
		created() {
			//监听登录事件获取userInfo
			uni.$on('loginCompete', data => {})
			this.token = uni.getStorageSync('token')
			console.log(this.token)
		},
		methods: {
			...mapMutations(['logout']),
			changeTab(index) {
				this.tabsIndex = index
			},
			changeSwpier(event) {
				this.tabsIndex = event.detail.current
			},
			//前往登录
			goLogin() {
				console.log('点击了登录')
				this.$Router.push({
					path: '/pages/user/login'
				})
			},
			//个人主页
			goProfile() {

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

	.ch-color-main {
		color: $ch-color-main;
	}
</style>