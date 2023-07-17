<template>
	<view class="tn-flex tn-flex-direction-column">
		<!-- 头部控件 -->
		<view class="image-wrapper">
			<image :src="userInfo.head_img" style="position: relative;height: 600rpx;width: 100%;" mode="aspectFill"
				@tap="isLogin?'':goLogin">
			</image>
		</view>
		<view class="tn-padding" style="position: absolute;top: 100rpx;width: 100%;">
			<view class="tn-flex tn-flex-col-center">
				<tn-avatar :src="userInfo.head_img" size="xl" :border="true" backgroundColor="#f8f7f8"
					borderColor="#ffffff" :borderSize="6"></tn-avatar>
				<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-flex-1 tn-margin-left-sm">
					<view class="tn-flex tn-flex-col-center">
						<text :class="userInfo.level==='admin'?'tn-color-purplered':'tn-color-white'"
							class="tn-text-bold tn-text-xl">{{userInfo.nickname}}</text>
					</view>
					<view v-if="isLogin">
						<tn-button :plain="true" size="sm" shape="round"> 编辑
						</tn-button>
					</view>
				</view>
			</view>
		</view>
		<!-- 控件结束 -->
		<view style="position: relative;bottom: 20rpx;">
			<v-tabs v-model="tabsIndex" :tabs="tabs" @change="changeTab" lineHeight="8rpx" lineColor="#fb7299"
				:zIndex="2" activeColor="#fb7299" style="border-radius: 20rpx 20rpx 0 0;background-color: white;">
			</v-tabs>
		</view>
		<swiper :current="tabsIndex" @change="changeSwpier" style="height: 100vh;">
			<swiper-item style="overflow: auto;">
				<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<articleList :content="content"></articleList>
				</mescroll-body>

			</swiper-item>
			<swiper-item>
				
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	import articleList from "@/components/articleList/articleList.vue";
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			articleList
		},
		data() {
			return {
				userInfo: [],
				content: [],
				isLogin: false,
				tabs: ['动态', '评论'],
				tabsIndex: 0,
				swiperHeight: 0, //活动组件高度
				comments:[],
			}
		},
		onLoad() {
			//每次加载页面时都获取userInfo
			this.userInfo = uni.getStorageSync('userInfo')
			if (uni.getStorageSync('token') != null) {
				this.isLogin = true
			}
		},
		created() {
			//监听登录事件获取userInfo
			uni.$on('loginCompete', data => {
				this.userInfo = uni.getStorageSync('userInfo')
			})
		},
		methods: {
			//获取文章信息
			upCallback(mescroll) {
				let num = mescroll.size
				let page = mescroll.num
				let article
				this.$http.get('/article/sql', {
					params: {
						page: page,
						limit: num,
						where: 'users_id=' + this.userInfo.id
					}
				}, {
					header: {
						'Authorization': uni.getStorageSync('token')
					}
				}).then(res => {
					if (res.data.code === 200) {
						article = res.data.data
						if (page === 1) this.content = []
						this.content = this.content.concat(article.data)
					}
					mescroll.endByPage(article.count, article.page);
				}).catch(err => {
					console.log(err)
				})
			},
			changeTab(index) {
				this.tabsIndex = index
			},
			changeSwpier(event) {
				this.tabsIndex = event.detail.current
			},
			//前往登录
			goLogin() {
				uni.navigateTo({
					url: '/pages/user/login'
				})
			}
		}
	}
</script>

<style>
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
</style>