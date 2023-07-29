<template>
	<view>
		<tn-nav-bar :isBack="false" customBack>
			<view class="tn-margin-sm tn-no-margin-top">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<text class="tn-icon-left tn-text-xxl" @tap="back"></text>
					<view
						class="tn-flex tn-flex-col-center tn-bg-gray--light tn-round tn-padding-left-sm tn-padding-right-sm tn-flex-1 tn-margin-left tn-margin-right">
						<tn-input placeholder="这是搜索占位" v-model="searchKey" :clearable="false"
							:autoHeight="false"></tn-input>
					</view>
					<view>
						<text class="ch-color-main" @tap="searchAction">搜索</text>
					</view>
				</view>
			</view>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view v-show="is_search">
			<commonList :content="article"></commonList>
		</view>
		<view class="tn-margin" v-show="!is_search">
			<text class="tn-text-bold">热搜</text>
			<view v-for="(item,index) in hotSearchList" :key="index" class="tn-margin-bottom-xs">
				<view class="tn-flex tn-flex-col-center">
					<text>
						{{item.title}}
					</text>
					<text class="tn-bg-red tn-text-xs tn-margin-left-xs tn-radius tn-color-white" style="padding: 4rpx;"
						v-if="item.hot">
						热
					</text>
				</view>
			</view>
			<view class="tn-margin-top-xl tn-padding-top-xl">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<text class="tn-text-bold">
						搜索历史
					</text>
					<text class="tn-color-grey" @tap="moreAction">{{showMoreHistory?'收起':'展开'}}</text>
				</view>
				<view :class="{'hide': !showMoreHistory}" class="tn-margin-top">
					<view class="tn-flex tn-flex-col-center tn-flex-wrap">
						<view v-for="(item, index) in historySearch" :key="index"
							class="tn-margin-right-sm tn-padding-xs">
							<text class="tn-bg-gray--light tn-radius tn-padding-xs" @tap="selectSearch(index)">
								{{item}}
							</text>
						</view>
					</view>
				</view>
				<view class="tn-flex tn-flex-row-center tn-margin-top-lg">
					<text class="tn-icon-delete tn-color-grey" @tap="deleteHistory"
						v-if="historySearch.length!==0">清除搜索记录</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import commonList from '@/components/commonList/commonList.vue';
	export default {
		components: {
			commonList
		},
		data() {
			return {
				searchKey: null,
				showMoreHistory: false,
				focus: false,
				is_search: false,
				//虚拟数据
				hotSearchList: [{
						title: '老八大战奥里给',
						hot: 1,
						articleId: 133,
					},
					{
						title: '盗妻雷神三彩团子离奇失踪这究竟是...',
						hot: 0,
						articleId: 133,
					},
					{
						title: '猫尾酒馆调酒师Dio娜聚众赌博被捕',
						hot: 1,
						articleId: 133,
					},
					{
						title: '洛天依吸毒',
						hot: 0,
						articleId: 133,
					},

				],
				historySearch: [],
				article: [],
			}
		},
		onShow() {


		},
		mounted() {
			const historySearchStr = uni.getStorageSync('historySearch');
			if (historySearchStr) {
				this.historySearch = historySearchStr;
			}
			console.log(this.historySearch)
		},
		methods: {
			searchAction() {
				if (!this.searchKey) {
					return; // Exit the function if searchKey is empty
				}
				this.$http.get('/article/all', {
					params: {
						search: this.searchKey
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.is_search = true
						this.article = res.data.data.data
						console.log(this.article)
						if (!this.historySearch.includes(this.searchKey)) {
							if (this.historySearch.length >= 10) {
								this.historySearch.shift(); // Remove the oldest search record
							}
							this.historySearch.push(this.searchKey);
							uni.setStorageSync('historySearch', this.historySearch);
						}
					}
				})
			},
			moreAction() {
				this.showMoreHistory = !this.showMoreHistory
			},
			deleteHistory() {
				this.historySearch = [],
					uni.clearStorageSync('historySearch')
			},
			selectSearch(index) {
				this.searchKey = this.historySearch[index]
				this.searchAction()
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
	.ch-color-main {
		color: $ch-color-main;
	}

	.hide {
		overflow: hidden;
		height: 160rpx;
		-webkit-box-orient: vertical;
	}
</style>