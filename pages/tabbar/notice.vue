<template>
	<view>
		<z-paging ref="paging" v-model="chatList" @query="getChatter">
			<template #top>
				<tn-nav-bar :isBack="false">消息</tn-nav-bar>
				<!-- 页面内容 -->
				<view :style="{paddingTop: vuex_custom_bar_height + 'px'}">
				</view>
				<view class="tn-margin tn-flex tn-flex-row-between">
					<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
						<view class="tn-bg-purplered--disabled tn-shadow-blur tn-radius tn-padding-sm"
							style="position:relative">
							<text class="tn-icon-like tn-text-xxl tn-color-white">
							</text>
							<tn-badge backgroundColor="tn-bg-red" :translateCenter="true" :absolute="true" :radius="20"
								v-show="notice.commnet_count>0"></tn-badge>
						</view>
						<text class="tn-margin-top-sm">回复我的</text>
					</view>

					<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
						<view class="tn-bg-purplered--disabled tn-shadow-blur tn-radius tn-padding-sm">
							<text class="tn-icon-like tn-text-xxl tn-color-white">
							</text>
							<tn-badge backgroundColor="tn-bg-red" :translateCenter="true" :absolute="true" :radius="20"
								v-show="notice.article_like_count"></tn-badge>
						</view>
						<text class="tn-margin-top-sm">收到的赞</text>
					</view>
					<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
						<view class="tn-bg-purplered--disabled tn-shadow-blur tn-radius tn-padding-sm">
							<text class="tn-icon-like tn-text-xxl tn-color-white">
							</text>
							<tn-badge backgroundColor="tn-bg-red" :translateCenter="true" :absolute="true" :radius="20"
								v-show="notice.placard_count"></tn-badge>
						</view>
						<text class="tn-margin-top-sm">
							系统通知
						</text>
					</view>
					<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
						<view class="tn-bg-purplered--disabled tn-shadow-blur tn-radius tn-padding-sm">
							<text class="tn-icon-like tn-text-xxl tn-color-white">
							</text>
							<tn-badge backgroundColor="tn-bg-red" :translateCenter="true" :absolute="true" :radius="20"
								v-show="notice.focus_count"></tn-badge>
						</view>
						<text class="tn-margin-top-sm">
							关注我的
						</text>
					</view>
				</view>
				<view class="tn-margin tn-no-margin-bottom">
					<text class="tn-text-bold tn-text-xxl">Messages</text>
				</view>
			</template>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center tn-margin-bottom" v-for="(item,index) in chatList" :key="index"
					@tap="goChat(index)">
					<tn-avatar :src="item.head_img"></tn-avatar>
					<view class="tn-margin-left-sm tn-flex-1">
						<view class="tn-flex tn-flex-col-center tn-flex-row-between">
							<view class="tn-flex tn-flex-direction-column">
								<text class="tn-text-lg">{{item.nickname}}</text>
								<text class="tn-color-grey tn-text-sm">{{item.last_message}}</text>
							</view>
							<text class="tn-color-grey tn-text-sm">{{formatDate(item.last_message_time)}}</text>
						</view>
					</view>
				</view>
			</view>
		</z-paging>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				notice: {},
				chatList: [],
			}
		},
		onLoad() {
			this.getNoticeNum()
		},
		methods: {
			getChatter(page, num) {
				this.$http.get('/chat/chatter').then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data)
					}
				}).catch(err => {

				})
			},
			getNoticeNum() {
				this.$http.get('/push/count').then(res => {
					if (res.data.code === 200) {
						this.notice = res.data.data
					}
					console.log(res, '消息红点')
				})
			},
			goChat(index) {
				this.$Router.push({
					path: '/pages/common/chat/chat',
					query: {
						params: this.chatList[index],
					}
				})
			},
			formatDate(dateString) {
				const date = new Date(dateString);
				const now = new Date();
				const year = date.getFullYear();
				const month = ("0" + (date.getMonth() + 1)).slice(-2);
				const day = ("0" + date.getDate()).slice(-2);
				const hour = ("0" + date.getHours()).slice(-2);
				const minute = ("0" + date.getMinutes()).slice(-2);

				// 计算时间差（单位：毫秒）
				const timeDiff = now - date;
				const oneDay = 24 * 60 * 60 * 1000;

				if (timeDiff < oneDay && date.getDate() === now.getDate()) {
					// 当天的时间，只显示小时和分钟
					return `${hour}:${minute}`;
				} else if (timeDiff < oneDay * 2) {
					// 昨天的时间
					return "昨天";
				} else if (timeDiff < oneDay * 3) {
					// 前天的时间
					return "前天";
				} else {
					// 其他时间，显示月、日
					return `${month}-${day}`;
				}
			}

		}
	}
</script>

<style lang="scss">
	.ch-border-main {
		border-color: $ch-color-primary;
	}
</style>