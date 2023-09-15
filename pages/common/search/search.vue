<template>
	<z-paging-swiper>
		<tn-nav-bar backTitle="" :isBack="false" customBack>
			<view class="tn-margin-sm tn-no-margin-top">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<view class="tn-margin-right" @tap="back()">
						<text class="tn-icon-left tn-text-xxl"></text>
					</view>
					<view
						class="tn-flex tn-flex-col-center tn-bg-gray--light tn-round tn-padding-left-sm tn-padding-right-sm tn-flex-1">
						<tn-input placeholder="这是搜索占位" v-model="key" :clearable="false" :autoHeight="false"
							@focus="focus = true;is_search = false" @blur="focus = false" @input="search"
							@click="searchKey = key;search()"></tn-input>
					</view>
					<view class="tn-margin-left">
						<text class="ch-color-primary" @tap="is_search = true;search()">搜索</text>
					</view>
				</view>
			</view>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view v-if="!is_search&&key">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-direction-column">
					<block v-for="(item,index) in content">
						<text class="tn-padding-sm tn-no-padding-left tn-border-solids-bottom tn-border-gray--light"
							@tap.stop.prevent="selectedKey(item.title)">{{item.title}}</text>
					</block>
				</view>
			</view>
		</view>
		<view v-if="!key&&!is_search">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-color-gray--dark tn-text-md">
					<text class="">历史搜索</text>
					<text>清空</text>
				</view>
			</view>
			<view class="tn-margin">
				<view class="tn-color-gray--dark tn-text-md">
					<text class="">全站热搜</text>
				</view>
				<view class="tn-flex tn-flex-col-center tn-flex-wrap">
				  <block v-for="(name,index) in hotSearchList" :key="index">
				    <view v-if="typeof name == 'string' && name.length >= 4" 
				      class="tn-bg-gray--light tn-radius tn-padding-left-xs tn-padding-right-xs">
				      <text class="tn-text-md">{{name}}</text>
				    </view>
				  </block>  
				</view>
			</view>
		</view>
		<z-tabs ref="tabs" :current="tabsIndex" active-color="#29b7cb" @change="changeTab" :list="tabs"
			:scroll-count="2" v-if="is_search&&!focus"></z-tabs>
		<swiper class="swiper" :current="swiperIndex" v-if="is_search&&!focus" @animationfinish="swiperAnimationfinish"
			@transition="swiperTransition">
			<swiper-item v-for="(item,index) in tabs" :key="index">
				<search-article :tabsIndex="index" :searchKey="searchKey" :swiperIndex="swiperIndex"></search-article>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	import searchArticle from './searchArticle.vue';
	import commonList from '@/components/commonList/commonList.vue';
	export default {
		components: {
			commonList,
			searchArticle,
		},
		data() {
			return {
				tabsIndex: 0,
				tabs: ['综合', '标签', '用户'],
				searchKey: null,
				key: null,
				showMoreHistory: false,
				focus: false,
				swiperIndex: 0,
				is_search: false,
				hotSearchList: [],
				historySearch: [],
				content: [],
			}
		},
		onShow() {},
		created() {
			this.hotList()
		},
		computed: {
			
		},
		methods: {
			selectedKey(key) {
				this.searchKey = key
				this.is_search = true
			},
			search() {
				if (!this.key) return;
				this.searchKey = this.key;
				this.is_search = true;
				this.$http.get('/search', {
					params: {
						value: this.key,
						mode: 'article',
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.content = res.data.data.data
					}
				})
			},
			hotList() {
				this.$http.get('/hot-search/localhot', {
					params: {
						type: 'article_hot'
					}
				}).then(res => {
					console.log(res)
					if (res.data.code === 200) {
						this.hotSearchList = res.data.data
					}

				})
			},
			moreAction() {
				this.showMoreHistory = !this.showMoreHistory
			},
			changeTab(index) {
				this.tabsIndex = index
				this.swiperIndex = index
			},
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.tabsIndex = e.detail.current;
				this.swiperIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
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
		}
	}
</script>

<style lang="scss">
	.ch-color-primary {
		color: $ch-color-primary;
	}

	.swiper {
		height: 100%;
	}

	.hide {
		overflow: hidden;
		height: 160rpx;
		-webkit-box-orient: vertical;
	}
</style>