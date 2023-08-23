<template>
	<z-paging ref="paging" v-model="dataList" @query="getFans">
		<template #top>
			<tn-nav-bar backTitle="">粉丝列表</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<view class="tn-margin">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-bottom"
				v-for="(item,index) in dataList" :key="index">
				<view class="tn-flex tn-flex-col-center">
					<tn-avatar size="lg" :src="item.head_img"></tn-avatar>
					<text class="tn-margin-left-sm tn-text-bold">{{item.nickname}}</text>
				</view>
				<view>
					<tn-button plain size="sm" padding="0 15rpx" backgroundColor="#29B7CB" fontColor="#29B7CB"
						v-show="!item.is_focus" @click="followUser(index)">
						<view class="tn-flex tn-flex-col-center">
							<text class="tn-icon-add tn-margin-right-xs"></text>
							<text>回关</text>
						</view>
					</tn-button>
					<tn-button size="sm" padding="0 20rpx" backgroundColor="tn-bg-gray--light" fontColor="tn-color-gray"
						@click="followUser(index)" v-show="item.is_focus">
						<text>已关注</text>
					</tn-button>
				</view>
			</view>
		</view>

	</z-paging>
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
						limiit: num,
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