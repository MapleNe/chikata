<template>
	<!-- 使用z-paging-swiper为根节点可以免计算高度 -->
	<z-paging-swiper>
		<template #top>
			<tn-nav-bar :isBack="false" customBack :zIndex="2">
				<view class="tn-margin-sm tn-no-margin-top">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between">
						<tn-avatar :src="userInfo.head_img" @tap="hasLogin?goMine():goLogin()"></tn-avatar>
						<view
							class="tn-padding tn-bg-gray--light tn-padding-left-sm tn-round tn-flex tn-flex-1 tn-margin-left tn-margin-right" style="max-height: 46rpx;" @tap.stop.prevent="goSearch">
							<view class="tn-color-gray--dark" style="line-height: 0rpx;">
								<text class="tn-icon-search"></text>
								<text class="tn-text-md tn-margin-left-sm">精彩搜索</text>
							</view>
							
						</view>
						<view @tap.stop="goNotice()">
							<text class="tn-text-xxl tn-icon-email"></text>
						</view>
					</view>
				</view>
			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
			<z-tabs ref="tabs" :current="tabsIndex" active-color="#29b7cb" @change="changeTab" :list="tabs"
				:scroll-count="2"></z-tabs>
		</template>
		<!-- swiper必须设置height:100%，因为swiper有默认的高度，只有设置高度100%才可以铺满页面  -->
		<swiper class="swiper" :current="tabsIndex" @animationfinish="swiperAnimationfinish"
			@transition="swiperTransition">
			<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">
				<articleList :tabsIndex="index" :swiperIndex="tabsIndex" :content="content" :swiper="true"
					:type="item.type" @getComments="getComments" @scroll="getScroll">
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

	import config from "@/config/config.js";
	import articleList from "@/components/articleList/articleList.vue";
	import commentList from '@/components/commentList/commentList.vue';
	import articleMenu from '@/components/aticleMenu/aticleMenu.vue';
	export default {
		components: {
			articleList,
			commentList,
			articleMenu,
		},
		data() {
			return {
				isBanner: false,
				tabsIndex: 0,
				tabs: [{
						id: 1,
						name: '首页',
						type: 'index',
					},
					{
						id: 2,
						name: '热门',
						type: 'index',

					},
					{
						id: 3,
						name: '关注',
						type: 'focus',
					}
				],
				content: [],
				showComments: false,
				commentId: null,
				showMenu: false,
				menuData: null,
				ws: null,
				backButtonPress: 0,
				swiperAction: false,
			}
		},
		created() {},
		computed: {
			...mapState(['userInfo', 'hasLogin']),
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			}
		},
		methods: {
			getComments(id) {
				if (id) {
					this.commentId = id
					this.showComments = true
				}
			},
			getMenuInfo(data) {
				this.showMenu = true
				this.menuData = data
			},
			changeTab(index) {
				this.tabsIndex = index
			},
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.tabsIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
			},
			changeSwpier(event) {
				this.tabsIndex = event.detail.current
			},
			goMine() {
				this.$Router.pushTab({
					path: '/pages/tabbar/mine'
				})
			},
			goNotice() {
				this.$Router.pushTab({
					path: '/pages/tabbar/notice'
				})
			},
			goLogin() {
				this.$Router.push({
					path: '/pages/user/login',
					animation: {
						animationType: 'slide-in-bottom',
						animationDuration: 350
					},
				})
			},
			goSearch() {
				this.$Router.push({
					path: '/pages/common/search/search',

				})
			},
			getScroll(status) {
				return status
			},

		}
	}
</script>

<style lang="scss">
	.swiper {
		height: 100%;
	}
</style>