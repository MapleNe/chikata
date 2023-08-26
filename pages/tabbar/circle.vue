<template>
	<z-paging-swiper>
		<template #top>
			<tn-nav-bar customBack>
				<view class="tn-flex tn-flex-row-center">
					<z-tabs ref="tabs" :current="tabsIndex" active-color="#FB7299" @change="changeTab" :list="tabs"
						:scroll-count="2"></z-tabs>
				</view>
				<view slot="right" class="tn-padding tn-no-padding-top" v-show="!tabsIndex">
					<text>发动态</text>
				</view>
			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<swiper class="swiper" :current="tabsIndex" @animationfinish="swiperAnimationfinish"
			@transition="swiperTransition">
			<swiper-item>
				<articleList :swiper="false" type="circle" @getComments="getComments" @getMenuInfo="getMenuInfo">
				</articleList>
			</swiper-item>
			<swiper-item class="tn-bg-gray--light">
				<z-paging ref="paging" v-model="categoryList" @query="getCategory">
					<view class="tn-margin">
						<tn-swiper :list="swiperList" :height="300" name="img" backgroundColor="tn-bg-gray--light"
							:radius="10" @click="clickSwiper">
						</tn-swiper>
					</view>
					<view class="tn-bg-white tn-padding-top-xs tn-padding-bottom-xs">
						<view class="tn-margin">
							<view>
								<text class="tn-text-bold tn-text-lg">全部分区</text>
							</view>
							<view v-for="(item,index) in categoryList" :key="index" class="tn-margin-top">
								<view class="tn-flex tn-flex-col-center tn-flex-row-between"
									@tap.stop.prevent="goCategory(item)">
									<view class="tn-flex tn-flex-col-center">
										<tn-avatar shape="square" :src="item.opt.head_img" size="lg"
											backgroundColor="none"></tn-avatar>
										<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
											<text class="tn-margin-bottom-xs">{{item.name}}</text>
											<text class="tn-text-sm tn-color-gray">{{item.expand.count}}篇帖子</text>
										</view>
									</view>
									<view>
										<text class="tn-icon-right tn-color-grey-disabled"></text>
									</view>
								</view>
								<view
									class="tn-margin-top-sm tn-text-sm tn-padding-top-sm tn-padding-sm tn-bg-gray--light tn-padding-xs"
									style="border-radius: 10rpx;">
									<view class="tn-padding-left-xs tn-padding-right-sm">
										<view class="tn-flex tn-flex-col-center tn-flex-row-between">
											<text class="tn-text-bold">分区每月热榜</text>
											<view class="tn-flex tn-flex-col-center tn-color-gray">
												<text class="tn-margin-right-xs">全部</text>
												<text class="tn-icon-right"></text>
											</view>
										</view>
										<view class="tn-margin-top">
											<view class="tn-flex tn-flex-col-center">
												<view
													class=" tn-color-orangered tn-border-solid tn-border-orangered tn-margin-right-sm"
													style="border-radius: 10rpx;">
													<text class="tn-padding-xs">ACG</text>
												</view>
												<view class="tn-color-gray--dark">
													<text>这是文本</text>
												</view>

											</view>
										</view>

									</view>

								</view>
							</view>
						</view>
					</view>

				</z-paging>

			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	export default {
		data() {
			return {
				tabs: [{
						id: 1,
						name: '关注',
						type: 'cirecle',

					},
					{
						id: 1,
						name: '发现',
						type: 'cirecle',

					}
				],
				tabsIndex: 0,
				swiperList: [],
				categoryList: []

			}
		},
		created() {
			this.getBanner()
		},
		methods: {
			getCategory(page, num) {
				this.$http.get('/article-sort/all', {
					params: {
						page: page,
						limit: num,
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data.data)
					}
				})
			},
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.tabsIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
			},
			getBanner() {
				this.$http.get('/banner').then(res => {
					if (res.data.code === 200) {
						if (res.data.data.count > 0) {
							let data = res.data.data
							this.swiperList = data.data
						}
					}
				})
			},
			goCategory(category) {
				this.$Router.push({
					path: '/pages/common/category/category',
					query: {
						id: category.id
					}
				})
			},
			changeTab(index) {
				this.tabsIndex = index
			},
			changeSwpier(event) {
				this.tabsIndex = event.detail.current
			},
		}
	}
</script>

<style lang="scss">
	.swiper {
		height: 100%;
	}
</style>