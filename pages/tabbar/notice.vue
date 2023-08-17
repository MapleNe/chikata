<template>
	<view>
		<z-paging ref="paging" v-model="messages" @query="getChatter">
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
			</template>
			<view class="tn-margin">
				<text class="tn-text-bold tn-text-xxl">Messages</text>
			</view>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center ">
					<tn-avatar src="/static/img/search.png"></tn-avatar>
					<view class="tn-margin-left-sm tn-flex-1">
						<view class="tn-flex tn-flex-col-center tn-flex-row-between">
							<text class="tn-text-lg">这是昵称</text>
							<text class="tn-color-grey">这是时间</text>
						</view>
						<text class="tn-color-grey">这是消息</text>
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
				messages: [],
				notice: {},
			}
		},
		onLoad() {
			this.getNoticeNum()
		},
		methods: {
			getChatter(page, num) {
				this.$http.get('/chat/chatter').then(res => {
					console.log(res)
				})
			},
			getNoticeNum() {
				this.$http.get('/push/count').then(res => {
					if (res.data.code === 200) {
						this.notice = res.data.data
					}
					console.log(res, '消息红点')
				})
			}
		}
	}
</script>

<style lang="scss">
	.ch-border-main {
		border-color: $ch-color-primary;
	}
</style>