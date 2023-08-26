<template>
	<view>
		<tn-nav-bar backTitle="">
			<text>通行证账号与安全</text>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<tn-list-cell :arrow="true">管理收获地址</tn-list-cell>
		<tn-list-cell :arrow="true">修改密码</tn-list-cell>
		<tn-list-cell :arrow="true">账号安全设置</tn-list-cell>
		<tn-list-cell unlined :arrow="true">注销账号</tn-list-cell>
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
