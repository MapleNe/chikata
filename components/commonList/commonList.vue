<template>
	<view>
		<view v-for="(item,index) in content" :key="index">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<view class="tn-flex tn-flex-col-center">
						<tn-avatar :src="item.expand.author.head_img"></tn-avatar>
						<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
							<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
							<text class="tn-text-xs">{{getDateDiff(item.create_time)}}</text>
						</view>
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
							<text class="tn-margin-left-xs tn-margin-right-xs tn-text-sm">{{category.name}}</text>
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
							<view class="tn-flex tn-flex-col-center" @tap.stop="likeAction(index)">
								<text
									:class="item.expand.like.is_like?'tn-text-xl tn-icon-like-fill tn-color-red':'tn-text-xl tn-icon-like'"></text>
								<text>{{item.expand.like.likes_count}}</text>
							</view>

						</view>
					</view>
				</view>
			</view>

			<!-- 间隔开始 -->
			<view class="tn-bg-gray--light tn-padding-xs"></view>
			<!-- 间隔结束 -->
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			content: {
				type: Array,
			},
		},
		name: "commonList",
		data() {
			return {

			};
		},
		methods: {
			goAticle(index) {
				let data = this.content
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: data[index].id
					},
				})
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
		}
	}
</script>

<style>

</style>