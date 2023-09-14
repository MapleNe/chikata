<template>
	<z-paging ref="paging" @query="getCollect" v-model="content">
		<template #top>
			<tn-nav-bar backTitle="">
				合集列表
				<view class="tn-padding" slot="right">
					<tn-button plain backgroundColor="#29b7cb" padding="0 15rpx" fontColor="#29b7cb" size="sm" @click="goCreate()">
						<view class="tn-flex tn-flex-col-center">
							<text class="tn-icon-add tn-margin-right-xs"></text>
							<text>创建合集</text>
						</view>
					</tn-button>
				</view>
			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<view class="tn-margin">
			<block v-for="(item,index) in content" :key="index">
				<view class="tn-bg-gray--light tn-padding tn-margin-bottom" style="border-radius: 10rpx;"
					@tap="goCollect(index)">
					<view class="tn-flex tn-flex-col-center">
						<view class="tn-margin-right-sm">
							<tn-avatar shape="square" size="xl" :src="item.image"></tn-avatar>
						</view>
						<view class="tn-flex tn-flex-direction-column">
							<text class="tn-margin-bottom-xs">{{item.name}}</text>
							<text class="tn-color-gray--dark tn-margin-bottom-xs tn-text-md">{{item.descrip}}</text>
							<view class="tn-flex tn-flex-col-center tn-text-sm tn-color-grey--disabled">
								<text>0篇作品</text>
								<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
								<text>0浏览</text>
								<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
								<text>{{getDate(item.create_time)}}</text>
							</view>
						</view>
					</view>
				</view>
			</block>
		</view>

	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				content: [],
			};
		},
		methods: {
			getCollect(page, num) {
				this.$http.get('/collections/Find', {}).then(res => {
					console.log(res)
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data)
					}
				})
			},
			goCollect(index) {
				this.$Router.push({
					path: '/pages/user/collect/detail',
					query: {
						id: this.content[index].id,
						name: this.content[index].name,
						obj: encodeURIComponent(JSON.stringify(this.content[index]))
					}
				})
			},
			goCreate(){
				this.$Router.push({name:'collectCreate'})
			},
			getDate(data) {
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