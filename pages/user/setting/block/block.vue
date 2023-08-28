<template>
	<view>
		<tn-nav-bar backTitle="">
			<text>屏蔽设置</text>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<tn-list-cell arrow>黑名单列表</tn-list-cell>
		<tn-list-cell arrow>私信屏蔽黑名单</tn-list-cell>
		<tn-list-cell unlined arrow>关键词屏蔽</tn-list-cell>
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
