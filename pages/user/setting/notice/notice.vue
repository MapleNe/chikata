<template>
	<view>
		<tn-nav-bar backTitle="">
			<text>新消息通知</text>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<tn-list-view customTitle>
			<view slot="title" class="tn-padding-sm tn-text-sm tn-bg-gray--light">
				<text class="tn-color-gray--dark">陌生人私信过滤</text>
			</view>
			<tn-list-cell arrow>回复我的</tn-list-cell>
			<tn-list-cell arrow>转发@我</tn-list-cell>
			<tn-list-cell arrow>主动@我</tn-list-cell>
			<tn-list-cell arrow>给我点赞</tn-list-cell>
			<tn-list-cell arrow>关注了我</tn-list-cell>
			<tn-list-cell arrow>订阅通知</tn-list-cell>
			<tn-list-cell arrow>私信通知</tn-list-cell>
		</tn-list-view>
		<tn-list-view customTitle>
			<view slot="title" class="tn-padding-sm tn-text-sm tn-bg-gray--light">
				<text class="tn-color-gray--dark">陌生人私信过滤</text>
			</view>
			<tn-list-cell arrow>不接收未关注人的私信</tn-list-cell>
			<tn-list-cell arrow>合并未关注人私信</tn-list-cell>
		</tn-list-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">

</style>