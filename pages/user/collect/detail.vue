<template>
	<z-paging ref="paging" @query="getArticle" v-model="content">
		<template #top>
			<tn-nav-bar backTitle="">
				{{name}}
				<view class="tn-padding" slot="right">
					<tn-button plain size="sm" fontColor="#29b7cb" backgroundColor="#29b7cb">
						<view class="tn-flex tn-flex-col-center">
							<text>管理作品</text>
						</view>
					</tn-button>
				</view>
			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<view class="tn-margin">
			<view class="tn-bg-gray--light tn-padding tn-margin-bottom" style="border-radius: 10rpx;">
				<view class="tn-flex tn-flex-col-center">
					<view class="tn-margin-right-sm">
						<tn-avatar shape="square" size="xl" :src="info.image"></tn-avatar>
					</view>
					<view class="tn-flex tn-flex-direction-column">
						<text class="tn-margin-bottom-xs">{{info.name}}</text>
						<text class="tn-color-gray--dark tn-margin-bottom-xs tn-text-md">{{info.descrip}}</text>
						<view class="tn-flex tn-flex-col-center tn-text-sm tn-color-grey--disabled">
							<text>{{article_count}}篇作品</text>
							<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
							<text>0浏览</text>
							<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
							<text>{{getDate(info.create_time)}}</text>
						</view>
					</view>
				</view>
			</view>
			<block v-for="(item,index) in content" :key="index">
				<view class="tn-flex tn-flex-direction-column tn-margin-bottom-sm" @tap.stop.prevent="goArticle(index)">
					<view class="tn-flex tn-flex-top">
						<view v-if="item.expand.images.length">
							<image :src="item.expand.images.length?item.expand.images[0].src:''" mode="aspectFill"
								style="border-radius: 10rpx; width: 260rpx;height: 140rpx;"></image>
						</view>
						<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
							<text class="tn-text-bold">{{item.title}}</text>
							<text class="tn-text-md tn-text-ellipsis-2 tn-color-gray--dark">{{item.description}}</text>
						</view>
					</view>
					<view class="tn-margin-top-sm">
						<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-text-sm tn-color-grey--disabled">
							<text>{{getDate(item.create_time)}}</text>
							<view class="tn-flex tn-flex-col-center">
								<text>{{item.expand.comments.count}}评论</text>
								<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
								<text>{{item.expand.like.likes_count}}点赞</text>
							</view>
						</view>
					</view>
				</view>
				<view class="tn-border-solids tn-border-gray--light tn-margin-bottom-sm"></view>
			</block>
		</view>

	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				content: [],
				info: {},
				article_count: 0,
				id: 0,
			};
		},
		onLoad(params) {
			this.id = params.id
			this.name = params.name
			this.info = params.obj
			console.log(this.info)
		},
		methods: {
			getArticle(page, num) {
				this.$http.get('/collections/postFind', {
					params: {
						page: page,
						limit: num,
						cid: this.id
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data.data)
						this.article_count = res.data.data.count
					}
				})
			},
			goArticle(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.content[index].id,
						users_id: this.content[index].users_id
					}
				})
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