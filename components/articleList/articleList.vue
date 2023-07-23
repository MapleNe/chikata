<template>
	<view>
		<z-paging ref="paging" @query="getArticle" v-model="content" :auto="false">
			<view v-if="tabsIndex===0 &&swiper" class="tn-margin">
				<tn-swiper :list="swiperList" :height="300" name="img" backgroundColor="tn-bg-gray--light" :radius="10"
					v-if="isBanner">
				</tn-swiper>
			</view>
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
								<tn-button size="sm" :plain="true" shape="round" @tap="followUser">关注</tn-button>
							</view>

						</view>
						<view @tap.stop="goPost(index)">
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
									<view class="tn-flex tn-flex-col-center">
										<text class="tn-text-xl tn-icon-message"></text>
										<text>{{item.expand.comments.count}}</text>
									</view>
									<view class="tn-flex tn-flex-col-center">
										<text class="tn-text-xl tn-icon-like"></text>
										<text>{{item.views}}</text>
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
			swiper: {
				type: Boolean,
				default: false
			},
			tabsIndex: {
				type: Number,
				default: null
			},
			swiperIndex: {
				type: Number,
				default: null
			}
		},
		name: "articleList",
		data() {
			return {
				content: [],
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
			};
		},
		created() {
			this.getBanner()
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
			}
		},
		methods: {
			async getArticle(page, num) {
				await this.$http.get('/article/all', {
					params: {
						limit: num,
						page: page,
						order: this.tabsIndex === 1 ? 'views desc' : this.tabsIndex === 2 ?
							'is_top desc,views desc' : ''
					}
				}).then(res => {
					console.log(res)
					this.$refs.paging.complete(res.data.data.data)
					this.firstLoad = true
					//骨架屏仅在第一次加载数据时显示
					setTimeout(() => {
						this.loading = false
					}, 400)
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			async getBanner() {
				await this.$http.get('/banner').then(res => {
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
			goPost(index) {
				let data = this.content
				this.$Router.push({
					path: '/pages/article/article',
					query: {
						id: data[index].id
					},
				})
			},
			followUser() {
				console.log('点击了关注')
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
		}
	}
</script>

<style>

</style>