<template>
	<z-paging-swiper>
		<template #top>
			<tn-nav-bar customBack>
				<tn-tabs-swiper :list="tabs" ref="tabs" :isScroll="false" :current="tabsIndex" name="name"
					@change="changeTab" bold activeColor="#29b7cb"></tn-tabs-swiper>
				<view slot="right" class="tn-padding tn-no-padding-top" v-show="tabsIndex">
					<text class="tn-text-md">发动态</text>
				</view>
			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<swiper class="swiper" :current="tabsIndex" @animationfinish="swiperAnimationfinish"
			@transition="swiperTransition">
			<swiper-item>
				<z-paging ref="paging" v-model="content" @query="getArticle">
					<view class="tn-margin-left tn-margin-right tn-flex tn-flex-col-center tn-flex-row-between">
						<text class="tn-text-bold tn-text-md">分区列表</text>
						<view class="tn-flex tn-flex-col-center tn-text-md tn-color-gray--dark"
							@tap.stop.prevent="goCategoryList()">
							<text class="tn-margin-right-xs">全部</text>
							<text class="tn-icon-right"></text>
						</view>
					</view>
					<view class="tn-margin tn-no-margin-top">
						<tn-grid align="left" :col="5" hoverClass="none">
							<block v-for="(item,index) in categoryList" :key="index">
								<tn-grid-item>
									<view
										class="tn-margin-top tn-flex tn-flex-col-center tn-flex-direction-column tn-margin-right"
										@tap.stop.prevent="goCategory(index)">
										<image :src="item.opt.head_img" mode="aspectFill"
											class="tn-border-solid tn-border-gray--light tn-bold-border tn-round"
											style="width: 100rpx;height: 100rpx;"></image>
										<text class="tn-text-ellipsis tn-text-md tn-margin-top-sm">{{item.name}}</text>
									</view>
								</tn-grid-item>

							</block>
						</tn-grid>
					</view>

					<view class="tn-margin">
						<tn-swiper :list="swiperList" :height="300" name="img" backgroundColor="tn-bg-gray--light"
							:radius="10">
						</tn-swiper>
					</view>
					<view class="tn-margin ">
						<text>随便看看</text>
					</view>
					<uv-waterfall ref="waterfall" v-model="content" left-gap="13" right-gap="13" column-gap="8"
						@changeList="changeList">
						<!-- 第一列数据 -->
						<template v-slot:list1>
							<!-- 为了磨平部分平台的BUG，必须套一层view -->
							<view>
								<view v-for="(item, index) in list1" :key="item.id"
									v-if="item&&item.width&&item.expand.images.length>0"
									class="tn-margin-bottom-sm tn-padding-bottom-sm"
									style="box-shadow: 0 0 18rpx 2rpx rgba(0,0,0,0.1);border-radius: 20rpx;"
									@tap.stop.prevent="goArticle(item)">
									<image :src="item.expand.images[0].src" mode="widthFix"
										:style="{width:item.width+'px'}" style="border-radius: 20rpx 20rpx 0 0;">
									</image>
									<view class="tn-padding-xs">
										<view class="tn-text-ellipsis-2 tn-text-md">
											<text>{{item.description}}</text>
										</view>
									</view>
									<view class="tn-padding-xs tn-flex tn-flex-col-center">
										<tn-avatar :src="item.expand.author.head_img" size="xs"></tn-avatar>
										<text
											class="tn-margin-left-xs tn-text-sm tn-color-gray--dark">{{item.expand.author.nickname}}</text>
									</view>
								</view>
							</view>
						</template>
						<!-- 第二列数据 -->
						<template v-slot:list2>
							<!-- 为了磨平部分平台的BUG，必须套一层view -->
							<view>
								<view v-for="(item, index) in list2" :key="item.id"
									v-if="item&&item.width&&item.expand.images.length>0"
									class="tn-margin-bottom-sm tn-padding-bottom-sm" :style="{width:item.width+'px'}"
									style="box-shadow: 0 0 18rpx 2rpx rgba(0,0,0,0.1);border-radius: 20rpx;"
									@tap.stop.prevent="goArticle(item)">
									<view class="">
										<image :src="item.expand.images[0].src" mode="widthFix"
											:style="{width:item.width+'px'}" style="border-radius: 20rpx 20rpx 0 0;">
										</image>
									</view>
									<view class="tn-padding-xs">
										<view class="tn-text-ellipsis-2 tn-text-md">
											<text>{{item.description}}</text>
										</view>
									</view>
									<view class="tn-padding-xs tn-flex tn-flex-col-center">
										<tn-avatar :src="item.expand.author.head_img" size="xs"></tn-avatar>
										<text
											class="tn-margin-left-xs tn-text-sm tn-color-gray--dark">{{item.expand.author.nickname}}</text>
									</view>
								</view>
							</view>
						</template>
					</uv-waterfall>

				</z-paging>

			</swiper-item>
			<swiper-item>
				<articleList :swiper="false" type="circle">
				</articleList>
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
						name: '发现',
						type: 'cirecle',

					},
					{
						id: 1,
						name: '关注',
						type: 'cirecle',

					}
				],
				tabsIndex: 0,
				swiperList: [],
				categoryList: [],
				content: [],
				list1: [],
				list2: [],
				leftGap: 13,
				rightGap: 13,
				columnGap: 8

			}
		},
		created() {
			this.getBanner()
			this.getCategory()
		},
		mounted() {

		},
		computed: {
			imageStyle(item) {
				return item => {
					const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
					const w = v / 2;
					const rate = w / item.w;
					const h = rate * item.h;
					return {
						width: w + 'px',
						height: h + 'px'
					}
				}
			}
		},
		methods: {
			changeList(e) {
				this[e.name].push(e.value);
			},
			getArticle(page, num) {
				this.$http.get('/article/all', {
					params: {
						page: page,
						limit: num,
						random: true
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data.data)

					}
				})
			},
			getCategory() {
				this.$http.get('/article-sort/all', {
					params: {
						page: 1,
						limit: 10,
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.categoryList = res.data.data.data
					}
				})
			},
			goArticle(item) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: item.id,
						users_id: item.users_id
					},
				})
			},
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.tabsIndex = e.detail.current;
				this.$refs.tabs.setFinishCurrent(e.detail.current)
			},
			changeTab(index) {
				this.tabsIndex = index
			},
			goCategoryList() {
				this.$Router.push({
					path: '/pagesA/categories/categories'
				})
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
			goCategory(index) {
				this.$Router.push({
					path: '/pages/common/category/category',
					query: {
						id: this.categoryList[index].id
					}
				})
			},
			changeSwpier(e) {
				this.tabsIndex = e.detail.current
			},
		}
	}
</script>

<style lang="scss">
	.swiper {
		height: 100%;
	}

	.left,
	.right {
		margin: 0 auto;
		width: 48%;
	}
</style>