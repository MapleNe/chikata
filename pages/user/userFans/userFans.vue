<template>
	<z-paging-swiper>
		<template #top>
			<tn-nav-bar backTitle="">粉丝</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<swiper style="height: 100%;">
			<swiper-item>
				<z-paging ref="paging" v-model="dataList" @query="getFans" :auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false">
					<view class="tn-margin">
						<block v-for="(item,index) in dataList" :key="index">
							<view class="tn-flex tn-margin-bottom">
								<tn-avatar size="md" :src="item.head_img"></tn-avatar>
								<view
									class="tn-flex-1 tn-flex-row-between tn-border-solids-bottom tn-padding-bottom-sm tn-flex tn-flex-col-center">
									<view class="tn-margin-left-sm tn-flex tn-flex-direction-column">
										<text class="tn-text-bold">{{item.nickname}}</text>
										<text class="tn-text-md">{{item.description}}</text>
									</view>
									<tn-button plain size="sm" :fontSize="30" padding="0 15rpx" backgroundColor="#29b7cb"
										fontColor="#29b7cb" v-if="!item.is_focus" @click="followUser(index)">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-icon-add tn-margin-right-xs"></text>
											<text>关注</text>
										</view>
									</tn-button>
									<tn-button size="sm" :fontSize="30" padding="0 20rpx" plain backgroundColor="tn-bg-gray--light"
										fontColor="tn-color-gray" @click="followUser(index)" v-else>
										<text>已关注</text>
									</tn-button>
								</view>
							</view>
						</block>

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
				dataList: [],
			}
		},
		methods: {
			getFans(page, num) {
				this.$http.get('/Focus/Find', {
					params: {
						page: page,
						limit: num,
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data.users)
			
					}
				})
			},
			followUser(index) {
				this.$http.put('/Focus/Record', {
					userId: this.dataList[index].fansid
				}).then(res => {
					switch (res.data.code) {
						case 200:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							this.dataList[index].is_focus = !this.dataList[index].is_focus
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

<style>

</style>