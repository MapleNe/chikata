<template>
	<z-paging v-model="noticeList" ref="paging" @query="getNoticeDetail">
		<template #top>
			<tn-nav-bar backTitle="">
				<text>{{type=='comment'?'评论通知':type=='articlelike'?'点赞收藏':'关注我的'}}</text>
			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<view class="tn-margin">
			<view v-for="(item,index) in noticeList" :key="index">
				<block v-if="type==='comment'">
					<view class="tn-flex">
						<view class="tn-flex tn-flex-col-center" @tap.stop.prevent="goUserProfile(index)">
							<view class="tn-margin-right-sm">
								<tn-avatar :src="item.head_img"></tn-avatar>
							</view>
							<view class="tn-flex tn-flex-direction-column">
								<text>{{item.nickname}}</text>
								<text class="tn-color-gray tn-text-sm">{{getDateDiff(item.update_time)}}</text>
							</view>
						</view>
					</view>
					<view class="tn-margin tn-no-margin-right">
						<view class="tn-margin-left-xl tn-margin-bottom">
							<mp-html :content="item.content"></mp-html>
						</view>
						<view class="tn-margin-left-xl tn-bg-gray--light" style="border-radius: 20rpx;">
							<view class="tn-padding-sm tn-color-gray--dark tn-text-ellipsis-2">
								<mp-html :content="item.title"></mp-html>
							</view>
						</view>
					</view>
				</block>
				<block v-if="type==='articlelike'">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between">
						<view class="tn-margin-right-sm tn-flex tn-flex-col-center"
							@tap.stop.prevent="goUserProfile(index)">
							<tn-avatar :src="item.head_img"></tn-avatar>
							<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
								<text>{{item.nickname}}</text>
								<text
									class="tn-color-gray tn-text-sm tn-text-xs">{{getDateDiff(item.create_time)}}</text>
							</view>
						</view>
						<view>
							<text class="tn-color-gray--dark">点赞了你</text>
							<text class="tn-text-xxl tn-icon-like-fill tn-color-red"></text>
						</view>
					</view>
					<view class="tn-margin-left-xl tn-bg-gray--light tn-padding-sm tn-margin-top tn-margin-bottom"
						style="border-radius: 20rpx;">
						<text>{{item.article_title}}</text>
					</view>
				</block>
				<block v-if="type==='focus'">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-bottom">
						<view class="tn-flex tn-flex-col-center">
							<tn-avatar size="lg" :src="item.head_img"></tn-avatar>
							<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
								<text class="tn-text-bold">{{item.nickname}}</text>
								<text>{{getDateDiff(item.create_time)}}</text>
							</view>
						</view>
						<view>

							<tn-button plain size="sm" padding="0 15rpx" backgroundColor="#29b7cb" fontColor="#29b7cb"
								v-show="!item.is_focus" @click="followUser(index)">
								<view class="tn-flex tn-flex-col-center">
									<text class="tn-icon-add tn-margin-right-xs"></text>
									<text>回关</text>
								</view>
							</tn-button>
							<tn-button size="sm" padding="0 20rpx" backgroundColor="tn-bg-gray--light"
								fontColor="tn-color-gray" @click="followUser(index)" v-show="item.is_focus">
								<text>已关注</text>
							</tn-button>
						</view>
					</view>
				</block>
			</view>
		</view>
	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				noticeList: [],
				type: null,
			};
		},
		onLoad(params) {
			this.type = params.type
		},
		computed: {},
		methods: {
			getNoticeDetail(page, num) {
				this.$http.get('/push/history', {
					params: {
						page: page,
						limit: num,
						type: this.type
					}
				}).then(res => {
					if (res.data.code === 200) {
						console.log(res)
						this.$refs.paging.complete(res.data.data)
					}
				}).catch(err => {
					console.log(err)
					this.$refs.paging.complete(false)
				})
			},
			goUserProfile(index) {
				this.$Router.push({
					path: '/pages/common/userProfile/userProfile',
					query: {
						id: this.noticeList[index].users_id ? this.noticeList[index].users_id : this.noticeList[
							index].fuserId
					}
				})
			},
			followUser(index) {
				this.$http.put('/Focus/Record', {
					userId: this.noticeList[index].fansid
				}).then(res => {
					switch (res.data.code) {
						case 200:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							this.noticeList[index].is_focus = !this.noticeList[index].is_focus
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

<style lang="scss">

</style>