<template>
	<!-- 使用z-paging-swiper为根节点可以免计算高度 -->
	<z-paging-swiper>
		<!-- 需要固定在顶部不滚动的view放在slot="top"的view中 -->
		<!-- 注意！此处的z-tabs为独立的组件，可替换为第三方的tabs，若需要使用z-tabs，请在插件市场搜索z-tabs并引入，否则会报插件找不到的错误 -->
		<template #top>
			<tn-nav-bar :isBack="false" customBack>
				<view class="tn-margin-sm tn-no-margin-top">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between">
						<tn-avatar :src="userInfo.head_img" @tap="hasLogin?goMine():goLogin()"></tn-avatar>
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
		</template>
		<!-- swiper必须设置height:100%，因为swiper有默认的高度，只有设置高度100%才可以铺满页面  -->

		<swiper class="swiper" :current="tabsIndex" @change="changeSwpier" style="height: 100%">
			<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">

				<articleList :tabsIndex="index" :swiperIndex="tabsIndex" :content="content" :swiper="true">
				</articleList>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
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
			}
		},
		onLoad() {
			//这个userInfo从全局缓存中获取
			// this.userInfo = uni.getStorageSync('userInfo')
			console.log(this.userInfo)
		},
		created() {
		},
		computed: {
			...mapState(['userInfo','hasLogin']),
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			}
		},
		methods: {
			changeTab(index) {
				this.tabsIndex = index
			},
			changeSwpier(event) {
				this.tabsIndex = event.detail.current
			},
			goMine() {
				this.$Router.pushTab({
					path: '/pages/tabbar/mine'
				})
			},
			goLogin() {
				this.$Router.push({
					path: '/pages/user/login'
				})
			},

			// 时间转换，有点长

		}
	}
</script>

<style>
	.swiper {
		height: 100%;
	}
</style>