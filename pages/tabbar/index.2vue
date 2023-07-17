<template>
	<view>
		<!-- 导航开始 -->
		<tn-nav-bar :isBack="false" customBack>
			<view class="tn-margin-sm tn-no-margin-top">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<tn-avatar :src="userInfo.head_img"></tn-avatar>
					<view
						class="tn-bg-gray--light tn-round tn-padding-left-sm tn-flex-1 tn-margin-left tn-margin-right">
						<tn-input placeholder="这是搜索占位"></tn-input>
					</view>
					<view>
						<text class="tn-text-xxl tn-icon-email"></text>
					</view>
				</view>
			</view>
		</tn-nav-bar>

		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<v-tabs v-model="tabsIndex" :tabs="tabs" @change="changeTab" lineHeight="8rpx" lineColor="#fb7299"
			activeColor="#fb7299"></v-tabs>
		<swiper :current="tabsIndex" @change="changeSwpier" style="height: 100vh;">
			<swiper-item style="overflow: auto;">
				<view class="tn-margin">
					<!-- 轮播图 开始-->
					<tn-swiper :list="swiperList" :height="300" name="img" backgroundColor="tn-bg-gray--light"
						:radius="10" v-if="isBanner">
					</tn-swiper>
					<!-- 轮播图 结束 -->
					<!-- 首页菜单 开始 -->
					<tn-scroll-list>
						<view class="tn-flex tn-margin-top">
							<block v-for="(item, index) in 5" :key="index">
								<view class="tn-flex-1 tn-padding-sm tn-radius">
									<view
										class="tn-flex tn-flex-direction-column tn-flex-row-center tn-flex-col-center">
										<view class="tn-flex tn-flex-row-center tn-flex-col-center">
											<view class="tn-icon-gloves-fill"></view>
										</view>
										<view class="tn-color-black tn-text-lg tn-text-center">
											<text class="tn-text-ellipsis">测试测试</text>
										</view>
									</view>
								</view>
							</block>
						</view>
					</tn-scroll-list>
					<!-- 首页菜单 结束 -->
				</view>
				<!-- 文章开始 -->
				<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
					<articleList :content="content"></articleList>
				</mescroll-body>
				<!-- 文章结束 -->
			</swiper-item>
			<swiper-item>
				
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
				isBanner: false,
				tabsIndex: 0,
				tabs: ['首页', '热门', '关注'],
				content: [],
				userInfo: [],
			}
		},
		onLoad() {
			this.getBanner()
			this.userInfo = uni.getStorageSync('userInfo')
		},
		created() {
			uni.$on('loginCompete', data => {
				this.userInfo = uni.getStorageSync('userInfo')
				// console.log(this.userInfo)
			})
		},
		computed: {
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			}
		},
		methods: {
			getBanner() {
				this.$http.get('/banner').then(res => {
					if (res.data.code === 200) {
						if (res.data.data.count > 0) {
							let data = res.data.data
							this.swiperList = data.data
							this.isBanner = true
						} else {
							this.isBanner = false
						}
					}
				})
			},

			upCallback(mescroll) {
				let size = mescroll.size
				let page = mescroll.num
				let article
				this.$http.get('/article', {
					params: {
						limit: size,
						page: page
					}
				}).then(res => {
					if (res.data.code === 200) {
						article = res.data.data
						if (page === 1) this.content = []
						this.content = this.content.concat(article.data)
					}
					mescroll.endByPage(article.count, article.page);
				})
			},

			changeTab(index) {
				this.tabsIndex = index
			},
			changeSwpier(event) {
				this.tabsIndex = event.detail.current
			},

			// 时间转换，有点长

		}
	}
</script>

<style>

</style>