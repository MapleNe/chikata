<template>
	<view>
		<z-paging ref="paging" v-model="messages">
			<template #top>
				<tn-nav-bar :isBack="false">消息</tn-nav-bar>
				<!-- 页面内容 -->
				<view :style="{paddingTop: vuex_custom_bar_height + 'px'}">
				</view>
				<view class="tn-margin tn-flex tn-flex-row-between">
					<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
						<view class="tn-bg-red tn-shadow-blur tn-round tn-padding-sm">
							<text class="tn-icon-like tn-text-xxl tn-color-white">
							</text>
						</view>
						<text class="tn-margin-top-sm">回复我的</text>
					</view>
					<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
						<view class="tn-bg-red tn-shadow-blur tn-round tn-padding-sm">
							<text class="tn-icon-like tn-text-xxl tn-color-white">
							</text>
						</view>
						<text class="tn-margin-top-sm">收到的赞</text>
					</view>
					<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
						<view class="tn-bg-red tn-shadow-blur tn-round tn-padding-sm">
							<text class="tn-icon-like tn-text-xxl tn-color-white">
							</text>
						</view>
						<text class="tn-margin-top-sm">
							系统通知
						</text>
					</view>
					<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
						<view class="tn-bg-red tn-shadow-blur tn-round tn-padding-sm">
							<text class="tn-icon-like tn-text-xxl tn-color-white">
							</text>
						</view>
						<text class="tn-margin-top-sm">
							@我的
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
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
	.ch-border-main {
		border-color: $ch-color-main;
	}
</style>