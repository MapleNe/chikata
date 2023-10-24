<template>
	<view class="tn-flex tn-flex-col-center tn-flex-row-between">
		<view class="tn-flex tn-flex-col-center" style="position: relative;">
			<tn-avatar :src="data.expand.author.head_img" @tap="goUserProfile(data.users_id)"></tn-avatar>
			<text v-if="data.expand.author.level==='admin'"
				class="tn-margin-left-xs tn-text-md tn-color-blue tn-icon-trusty-fill tn-bg-white tn-round"
				style="position: absolute;top: 58rpx;left: 30rpx; z-index: 9999; padding: 2rpx;"></text>
			<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
				<view class="tn-flex tn-flex-col-center">
					<text class="tn-text-bold">{{data.expand.author.nickname}}</text>
					<text class="level tn-margin-left-xs level-text" :class="['lv-'+data.expand.author.grade]"
						:style="{'color':level[data.expand.author.grade]}"></text>
				</view>
				<view class="tn-flex tn-flex-col-center tn-text-sm tn-color-gray--dark">
					<text>{{getDateDiff(data.create_time)}}</text>
					<view class="tn-flex tn-flex-col-center" v-if="data.expand.sort.length"
						@tap.stop.prevent="goCategory(data.expand.sort[0].id)">
						<text class="tn-margin-right-xs tn-margin-left-xs">·</text>
						<text>{{data.expand.sort[0].name}}</text>
					</view>
					<!-- 圈子页面显示以下样式 -->
					<view class="tn-flex tn-flex-col-center" v-if="data.expand.sort.length && type==='circle'">
						<text class="tn-margin-right-xs tn-margin-left-xs">·</text>
						<text>在{{data.expand.sort[0].name}}发了帖子</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 可能不需要关注，注释 -->
		<!-- <view v-show="type!=='user'">
			<tn-button plain size="sm" :fontSize="30" padding="0 15rpx" backgroundColor="#29b7cb"
				fontColor="#29b7cb" v-if="!data.expand.focus" @click="followUser(index)">
				<view class="tn-flex tn-flex-col-center">
					<text class="tn-icon-add tn-margin-right-xs"></text>
					<text>关注</text>
				</view>
			</tn-button>
			<tn-button size="sm" :fontSize="30" padding="0 20rpx" plain
				backgroundColor="tn-bg-gray--light" fontColor="tn-color-gray" @click="followUser(index)"
				v-else>
				<text>已关注</text>
			</tn-button>
		</view> -->
	</view>
</template>

<script>
	export default {
		name: "articleHeader",
		props: {
			data: {
				type: Object,
				default: null,
			},
			type: {
				type: String,
				default: null,
			}
		},
		data() {
			return {

			}
		},

		methods: {
			goUserProfile(id) {
				this.$Router.push({
					path: '/pages/common/userProfile/userProfile',
					query: {
						id
					}
				})
			},
			goCategory(id) {
				this.$Router.push({
					path: '/pages/common/category/category',
					query: {
						id
					}
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

<style>
</style>