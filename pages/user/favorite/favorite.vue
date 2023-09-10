<template>
	<z-paging-swiper>
		<template #top>
			<tn-nav-bar backTitle="">收藏</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
			<z-tabs ref="tabs" :current="tabsIndex" active-color="#29b7cb" @change="changeTab" :list="tabs"></z-tabs>
		</template>
		<swiper class="swiper" :current="swiperIndex">
			<swiper-item>
				<z-paging ref="article" @query="getArticle" v-model="article">
					<block v-for="(item,index) in article">
						<view class="tn-margin">
							<view class="tn-flex tn-flex-col-center tn-flex-row-between">
								<view class="tn-flex tn-flex-col-center">
									<tn-avatar :src="item.expand.author.head_img"
										@tap="goUserProfile(index)"></tn-avatar>
									<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
											<text v-if="item.expand.author.level==='admin'"
												class="tn-margin-left-xs tn-color-blue tn-icon-trusty-fill"></text>
										</view>
										<view class="tn-flex tn-flex-col-center tn-text-sm tn-color-gray--dark">
											<text>{{getDateDiff(item.create_time)}}</text>
											<view class="tn-flex tn-flex-col-center">
												<text class="tn-margin-right-xs tn-margin-left-xs">·</text>
												<text v-if="item.expand.sort&&item.expand.sort.length>0">{{item.expand.sort[0].name}}</text>
											</view>
										</view>
									</view>
								</view>

							</view>
							<view @tap="goAticle(index)">
								<view class="tn-margin-top">
									<text class="tn-text-title">{{item.title}}</text>
								</view>
								<view class="tn-padding-sm tn-no-padding-left tn-color-gray--dark tn-padding-bottom-sm">
									<rich-text :nodes="item.description"></rich-text>
								</view>

								<!-- 单张图片 -->
								<view v-if="item.expand.images.length===1" style="height: 350rpx;width: 100%;">
									<image :src="item.expand.images[0].src" mode="aspectFill"
										style="height: 350rpx; width: 100%;border-radius:10rpx;"
										@tap.stop="previewImage(item.expand.images,index)">
									</image>

								</view>
								<!-- 单张结束 -->
								<!-- 点赞控件 -->
								<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top">
									<!-- 只取第一个tag -->
									<view v-if="item.expand.tag.length>0">
										<view
											class="tn-bg-grey--light tn-text-sm tn-color-gray--dark tn-margin-right-sm tn-padding-xs"
											style="border-radius: 10rpx;">
											<text>{{item.expand.tag[0].name}}</text>
										</view>
									</view>
									<view
										class="tn-flex tn-text-sm tn-flex-col-center tn-color-grey--disabled tn-flex-basic-sm tn-flex-row-between"
										style="margin-left: auto;">
										<view class="tn-flex tn-flex-col-bottom">
											<text class="tn-text-xxl tn-icon-eye "></text>
											<text class="tn-margin-left-xs">{{item.views}}</text>
										</view>
										<view class="tn-flex tn-flex-col-bottom" @tap.stop="showComments(index)">
											<text class="tn-text-xxl tn-icon-comment"></text>
											<text class="tn-margin-left-xs">{{item.expand.comments.count}}</text>
										</view>
										<view class="tn-flex tn-flex-col-bottom"
											:class="item.expand.like.is_like?'tn-color-red':''"
											@tap.stop="likeAction(index)">
											<text class="tn-text-xxl"
												:class="item.expand.like.is_like?' tn-icon-praise-fill':'tn-icon-praise'"></text>
											<text class="tn-margin-left-xs">{{item.expand.like.likes_count}}</text>
										</view>
									</view>
								</view>

							</view>
						</view>

						</view>
						<!-- 间隔开始 -->
						<view class="tn-bg-gray--light tn-padding-xs"></view>
					</block>
				</z-paging>


			</swiper-item>
			<swiper-item>

			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['帖子', '合集'],
				article: [],
				collect: [],
				tabsIndex: 0,
				swiperIndex: 0,
			};
		},
		methods: {
			getArticle(page, num) {
				this.$http.get('/favorites/lookup', {
					params: {
						page: page,
						limit: num,
					}
				}).then(res => {
					if (res.data.code === 200) {
						console.log(res)
						this.$refs.article.complete(res.data.data.article)
					}
				})
			},
			changeTab(index) {
				this.tabsIndex = index
			},
			goAticle(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.article[index].id,
						users_id: this.article[index].users_id
					},
				})
			},
			goUserProfile(index) {
				this.$Router.push({
					path: '/pages/common/userProfile/userProfile',
					query: {
						id: this.article[index].users_id
					}
				})
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

				if (diffValue < 0) {} else if (diffMonth > 3) {
					result = timePublish.getFullYear() + "-";
					result += timePublish.getMonth() + "-";
					result += timePublish.getDate();

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
			
		}
	}
</script>

<style lang="scss" scoped>
	.swiper {
		height: 100%;
	}
</style>