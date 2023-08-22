<template>
	<!-- 使用z-paging-swiper为根节点可以免计算高度 -->
	<z-paging-swiper>
		<template #top>
			<tn-nav-bar :isBack="false" customBack :zIndex="2">
				<view class="tn-margin-sm tn-no-margin-top">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between">
						<tn-avatar :src="userInfo.head_img" @tap="hasLogin?goMine():goLogin()"></tn-avatar>
						<view
							class="tn-bg-gray--light tn-round tn-padding-left-sm tn-flex-1 tn-margin-left tn-margin-right">
							<tn-input placeholder="Luck Day for you" :disabled="true" @tap="goSearch()"></tn-input>
						</view>
						<view @tap.stop="goNotice()">
							<text class="tn-text-xxl tn-icon-email"></text>
						</view>
					</view>
				</view>
			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
			<v-tabs v-model="tabsIndex" :tabs="tabs" @change="changeTab" lineHeight="8rpx" lineColor="#29B7CB"
				activeColor="#29B7CB" :lineScale="0.2"></v-tabs>
		</template>
		<!-- swiper必须设置height:100%，因为swiper有默认的高度，只有设置高度100%才可以铺满页面  -->

		<swiper class="swiper" :current="tabsIndex" @change="changeSwpier">
			<swiper-item class="swiper-item" v-for="(item, index) in tabs" :key="index">
				<articleList :tabsIndex="index" :swiperIndex="tabsIndex" :content="content" :swiper="true"
					@getComments="getComments" @getMenuInfo="getMenuInfo">
				</articleList>
			</swiper-item>
		</swiper>
		<tn-popup v-model="showComments" mode="bottom" length="60%" :borderRadius="20" :safeAreaInsetBottom="true">
			<commentList :id="commentId"></commentList>
		</tn-popup>
	</z-paging-swiper>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';

	import config from "@/static/config.js";
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
				tabs: ['首页', '热门', '关注'],
				content: [],
				showComments: false,
				commentId: null,
				showMenu: false,
				menuData: null,
				ws: null,
				backButtonPress: 0
			}
		},
		onLoad() {},
		onBackPress(e) {
			console.log(e)
			// 评论相关弹窗
			if (this.showComments) {
				this.showComments = false;
				return true;
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
					path: '/pages/user/login'
				})
			},
			goSearch() {
				this.$Router.push({
					path: '/pages/common/search/search',
					animation: {
						animationType: 'slide-in-right',
						animationDuration: 500
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.swiper {
		height: 100%;
	}
</style>