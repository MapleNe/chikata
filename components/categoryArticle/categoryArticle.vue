<template>
	<view>
		<!-- 头部组件开始 -->
		
		<view class="image-wrapper">
			<image :src="categoryInfo.opt.head_img" mode="aspectFill" style="width: 100%;height: 300rpx;"></image>
		</view>
		<view style="position: absolute;top: 180rpx;" class="tn-margin-left-sm tn-flex tn-flex-col-center">
			<tn-avatar size="lg" shape="square" :src="categoryInfo.opt.head_img"></tn-avatar>
			<text class="tn-margin-left-sm tn-color-white">{{categoryInfo.name}}</text>
		</view>
		<view style="position: relative;bottom: 15rpx;">
			<v-tabs v-model="tabsIndex" :tabs="tabs" @change="changeTab" lineHeight="8rpx" lineColor="#29B7CB"
				:zIndex="2" activeColor="#29B7CB" style="border-radius: 20rpx 20rpx 0 0;background-color: white;">
			</v-tabs>
		</view>

		<z-paging ref="paging" @query="getArticle" v-model="content" use-page-scroll>
			<view v-for="(item,index) in content" :key="index">
				<view class="tn-margin">
					<ls-skeleton :skeleton="skeleton" :loading="loading">
						<view class="tn-flex tn-flex-col-center tn-flex-row-between">
							<view class="tn-flex tn-flex-col-center">
								<tn-avatar :src="item.expand.author.head_img"></tn-avatar>
								<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
									<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
									<text class="tn-text-xs">{{getDateDiff(item.create_time)}}</text>
								</view>
							</view>
							<view>
								<tn-button size="sm" :backgroundColor="item.expand.focus?'tn-bg-gray--light':'#29B7CB'"
									:fontColor="item.expand.focus?'tn-color-grey':'tn-color-white'" shape="round"
									@tap="followUser(index)">
									<text>{{item.expand.focus?'已关注':'关注'}}</text>
								</tn-button>
							</view>

						</view>
						<view @tap.stop="goAticle(index)">
							<view class="tn-padding tn-no-padding-left">
								<rich-text :nodes="item.description"></rich-text>
							</view>
							<!-- 单张图片 -->
							<view v-if="item.expand.images.length===1">
								<image v-for="(images,index) in item.expand.images" :key="index" :src="images.src"
									mode="aspectFill" style="height: 400rpx;width: 400rpx;border-radius:10rpx;"
									@tap.stop="previewImage(item.expand.images,index)">
								</image>
							</view>
							<!-- 单张结束 -->
							<!-- 复数开始 -->
							<view v-if="item.expand.images.length===2||item.expand.images.length===4">
								<tn-grid align="left" :col="item.expand.images.length" hoverClass="none">
									<block v-for="(images, index) in item.expand.images" :key="index">
										<!-- H5 -->
										<!-- #ifndef MP-WEIXIN -->
										<tn-grid-item
											style="height: 256rpx;width: 256rpx;margin-right: 6rpx;margin-bottom: 6rpx;">
											<image :src="images.src" mode="aspectFill"
												style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
												@tap.stop="previewImage(item.expand.images,index)">
											</image>
										</tn-grid-item>
										<!-- #endif-->

										<!-- 微信小程序 -->
										<!-- #ifdef MP-WEIXIN -->
										<!-- <tn-grid-item :style="{width: gridItemWidth}">
									<view style="padding: 30rpx;">{{ item }}</view>
								</tn-grid-item> -->
										<!-- #endif-->
									</block>
								</tn-grid>
							</view>
							<view v-if="item.expand.images.length>=3">
								<tn-grid align="left" :col="3" hoverClass="none">
									<block v-for="(images, index) in item.expand.images" :key="index">
										<!-- H5 -->
										<!-- #ifndef MP-WEIXIN -->
										<tn-grid-item
											style="height: 220rpx;width: 220rpx;margin-right: 6rpx;margin-bottom: 6rpx">
											<image :src="images.src" mode="aspectFill"
												style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
												@tap.stop="previewImage(item.expand.images,index)">
											</image>
										</tn-grid-item>
										<!-- #endif-->

										<!-- 微信小程序 -->
										<!-- #ifdef MP-WEIXIN -->
										<!-- <tn-grid-item :style="{width: gridItemWidth}">
									<view style="padding: 30rpx;">{{ item }}</view>
								</tn-grid-item> -->
										<!-- #endif-->
									</block>
								</tn-grid>
							</view>
							<!-- 点赞控件 -->
							<view class="tn-flex tn-flex-col-center tn-margin-top-xs tn-flex-row-between">
								<view v-for="(category,index) in item.expand.sort" :key="index"
									class="tn-flex tn-flex-col-center tn-bg-gray--light tn-radius">
									<tn-avatar size="sm" :src="category.opt.head_img"></tn-avatar>
									<text
										class="tn-margin-left-xs tn-margin-right-xs tn-text-sm">{{category.name}}</text>
								</view>
								<view class="tn-flex tn-flex-col-center tn-flex-row-around tn-flex-basic-sm">
									<view class="tn-flex tn-flex-col-center">
										<text class="tn-text-xl tn-icon-fire"></text>
										<text>{{item.views}}</text>
									</view>
									<view class="tn-flex tn-flex-col-center" @tap.stop="showComments(index)">
										<text class="tn-text-xl tn-icon-message"></text>
										<text>{{item.expand.comments.count}}</text>
									</view>
									<view class="tn-flex tn-flex-col-center" @tap.stop="likeAction(index)">
										<text
											:class="item.expand.like.is_like?'tn-text-xl tn-icon-like-fill tn-color-red':'tn-text-xl tn-icon-like'"></text>
										<text>{{item.expand.like.likes_count}}</text>
									</view>
								</view>
							</view>
						</view>
					</ls-skeleton>
				</view>

				<!-- 间隔开始 -->
				<view class="tn-bg-gray--light tn-padding-xs"></view>
				<!-- 间隔结束 -->
			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		props: {
			// content: {
			// 	type: Array,
			// },
			id: {
				type: Number,
				default: 0
			},
			swiper: {
				type: Boolean,
				default: false
			},

			swiperIndex: {
				type: Number,
				default: null
			},
			
		},
		name: "categoryArticle",
		data() {
			return {
				tabs: ['推荐', '最新', '热门'],
				tabsIndex: 0,
				content: [],
				categoryInfo: {
					opt: {
						head_img: null,
					}
				},
				firstLoad: false,
				isBanner: false,
				swiperList: [],
				skeleton: [
					'circle+line-sm*2',
					'line-sm*3',
					'card-lg',
					'circle-sm+line-sm'
				],
				loading: true,
				navcolor: null,
			};

		},
		created() {
			let pages = getCurrentPages()
		},
		watch: {
			swiperIndex: {
				handler(e) {
					if (e === this.tabsIndex) {
						if (!this.firstLoad) {
							setTimeout(() => {
								this.$refs.paging.reload()
							}, 5)
						}
					}
				},
				immediate: true
			},
		},

		methods: {
			async getArticle(page, num) {
				await this.$http.get('/article-sort/article', {
					params: {
						id: this.id,
						limit: num,
						page: page,
						order: this.tabsIndex === 1 ? 'create_time desc' : this.tabsIndex === 2 ?
							'is_top desc,views desc' : ''
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data.expand.data)
						this.categoryInfo = res.data.data
						this.firstLoad = true
						//骨架屏仅在第一次加载数据时显示
						setTimeout(() => {
							this.loading = false
						}, 400)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
					console.log(err)
				})
			},

			likeAction(index) {
				this.$http.put('/ArticleLike/Record', {
					article_id: this.content[index].id
				}).then(res => {
					if (res.data.code === 200) {
						this.content[index].expand.like.is_like = !this.content[index].expand.like.is_like
						if (this.content[index].expand.like.is_like) {
							this.content[index].expand.like.likes_count++
						} else {
							this.content[index].expand.like.likes_count--
						}
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					} else {
						if (res.data.code === 403) {
							uni.showToast({
								icon: 'none',
								title: '令牌失效请重新登录'
							})
						}
					}
				}).catch(err => {
					console.log('位于articleList的错误请联系管理')
				})
			},
			showComments(index){
				this.$emit('getComments',this.content[index].id)
			},
			goAticle(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.content[index].id
					},
				})
			},

			followUser(index) {
				this.$http.put('/Focus/Record', {
					fansId: this.content[index].users_id
				}).then(res => {
					switch (res.data.code) {
						case 200:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							break;
						case 400:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							break;
						default:
							// 处理其他情况
							break;
					}
				});
			},
			changeTab(index) {
				this.tabsIndex = index
				this.$refs.paging.reload();
			},
			getDateDiff(data) {
				// 传进来的data必须是日期格式，不能是时间戳
				//var str = data;
				//将字符串转换成时间格式
				var timePublish = new Date(data);
				var timeNow = new Date();
				var minute = 1000 * 60;
				var hour = minute * 60;
				var day = hour * 24;
				var month = day * 30;
				var result = "2";

				var diffValue = timeNow - timePublish;
				var diffMonth = diffValue / month;
				var diffWeek = diffValue / (7 * day);
				var diffDay = diffValue / day;
				var diffHour = diffValue / hour;
				var diffMinute = diffValue / minute;

				// console.log('diffValue：'+diffValue+' ' +'diffMonth：'+diffMonth+' ' +'diffWeek：'+diffWeek+' ' +'diffDay：'+diffDay+' ' +'diffHour：'+diffHour+' ' +'diffMinute：'+diffMinute);

				if (diffValue < 0) {
					alert("错误时间");
				} else if (diffMonth > 3) {
					result = timePublish.getFullYear() + "-";
					result += timePublish.getMonth() + "-";
					result += timePublish.getDate();
					alert(result);
				} else if (diffMonth > 1) {
					result = parseInt(diffMonth) + "月前";
				} else if (diffWeek > 1) {
					result = parseInt(diffWeek) + "周前";
				} else if (diffDay > 1) {
					result = parseInt(diffDay) + "天前";
				} else if (diffHour > 1) {
					result = parseInt(diffHour) + "小时前";
				} else if (diffMinute > 1) {
					result = parseInt(diffMinute) + "分钟前";
				} else {
					result = "刚刚";
				}
				return result;
			},
			previewImage(images, index) {
				let data = [];
				for (let i = 0; i < images.length; i++) {
					data.push(images[i].src);
				}
				uni.previewImage({
					current: index,
					urls: data,
				});
			},
			reload() {
				this.$refs.paging.reload();
			},
			updatePageScrollTop(scrollTop) {
				this.$refs.paging.updatePageScrollTop(scrollTop);
			},
			doChatRecordLoadMore() {
				this.$refs.paging.doChatRecordLoadMore();
			},
			pageReachBottom() {
				this.$refs.paging.pageReachBottom();
			},
		}
	}
</script>

<style lang="scss" scoped>
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
		background: linear-gradient(to top, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
	}
</style>