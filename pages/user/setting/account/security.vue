<template>
	<view>
		<tn-nav-bar backTitle="">账号安全</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<tn-list-cell :arrow="true" @click="showChangePassword=true">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between">
				<text>手机号</text>
				<text class="tn-margin-right">已绑定</text>
			</view>
		</tn-list-cell>
		<tn-list-cell :arrow="true" @click="showChangePassword=true">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between">
				<text>QQ</text>
				<text class="tn-margin-right">已绑定</text>
			</view>
		</tn-list-cell>
		<tn-list-cell :arrow="true" @click="showChangePassword=true">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between">
				<text>微信</text>
				<text class="tn-margin-right">已绑定</text>
			</view>
		</tn-list-cell>
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