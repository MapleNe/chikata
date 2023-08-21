<template>
	<view>
		<z-paging ref="paging" @query="getArticle" v-model="content" :auto="false">
			<view v-for="(item,index) in content" :key="index" @longpress="getMenuInfo(item)" @touchend="touchEnd"
				@touchmove="touchMove">
				<view class="tn-margin">
					<ls-skeleton :skeleton="skeleton" :loading="loading">
						<view class="tn-flex tn-flex-col-center tn-flex-row-between">
							<view class="tn-flex tn-flex-col-center">
								<tn-avatar :src="item.expand.author.head_img"></tn-avatar>
								<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
									<view class="tn-flex tn-flex-col-center">
										<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
										<text v-if="item.expand.author.level==='admin'"
											class="tn-margin-left-xs tn-color-blue tn-icon-trusty-fill"></text>
									</view>
									<text class="tn-text-xs">{{getDateDiff(item.create_time)}}</text>
								</view>
							</view>

						</view>
						<view @tap.stop="goAticle(index)">
							<view class="tn-padding tn-no-padding-left tn-padding-bottom-xs">
								<rich-text :nodes="item.description"></rich-text>
							</view>
							<view v-if="item.expand.tag.length>0">
								<view class="tn-flex tn-flex-col-center tn-flex-wrap ch-color-primary">
									<view v-for="(tags,index) in item.expand.tag" :key="tags.id"
										class="tn-margin-right-xs tn-margin-bottom-sm">
										<text class="tn-icon-topic"></text>
										<text>{{tags.name}}</text>
									</view>
								</view>
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
							<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top">
								<view class="tn-flex tn-flex-row-left">
									<view v-for="(category,index) in item.expand.sort" :key="index" class="tn-padding-right tn-round tn-border-solid tn-flex tn-flex-col-center"
										@tap.stop="goCategory(category)">
										<view class="tn-margin-right-sm">
											<tn-avatar size="sm" :src="category.opt.head_img"></tn-avatar>
										</view>
										<text class="tn-text-sm">{{category.name}}</text>
									</view>
								</view>
								<view class="tn-flex tn-flex-col-center tn-flex-row-around tn-flex-1">
									<view class="tn-flex tn-flex-col-center">
										<text class="tn-text-xxl tn-icon-fireworks tn-color-red"></text>
										<text>{{item.views}}</text>
									</view>
									<view class="tn-flex tn-flex-col-center" @tap.stop="showComments(index)">
										<text class="tn-text-xxl tn-color-orangered tn-icon-comment-fill"></text>
										<text>{{item.expand.comments.count}}</text>
									</view>
									<view class="tn-flex tn-flex-col-center" @tap.stop="likeAction(index)">
										<text class="tn-text-xxl"
											:class="item.expand.like.is_like?' tn-icon-like-fill tn-color-red':'tn-icon-like'"></text>
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
			tabsIndex: {
				type: Number,
				default: null
			},
			swiperIndex: {
				type: Number,
				default: null
			}
		},
		name: "userArticle",
		data() {
			return {
				content: [],
				firstLoad: false,
				isBanner: false,
				swiperList: [],
				token: null,
				skeleton: [
					'circle+line-sm*2',
					'line-sm*3',
					'card-lg',
					'circle-sm+line-sm'
				],
				loading: true,
				isLongTap: true,
			};
		},
		created() {
			uni.$on('deleteArticleOk',data=>{
				if(data){
					this.$refs.paging.reload()
				}
			})
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
			getArticle(page, num) {
				this.$http.get('/article/userFind', {
					params: {
						limit: num,
						page: page,
					}
				}).then(res => {
					this.$refs.paging.complete(res.data.data.data)
					this.firstLoad = true
					//骨架屏仅在第一次加载时显示
					setTimeout(() => {
						this.loading = false
					}, 400)
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			likeAction(index) {
				this.$http.put('/Article-like/Record', {
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
			showComments(index) {
				this.$emit('getComments', this.content[index].id)
			},
			getMenuInfo(data){
				if (this.isLongTap) {
					this.$emit('getMenuInfo', data)
				}
			},
			goAticle(index) {
				let data = this.content
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: data[index].id
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
			touchEnd() {
				this.isLongTap = true;
			},
			touchMove(e) {
				// 手指触摸后的移动事件
				this.isLongTap = false;
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