<template>
	<view>
		<tn-nav-bar backTitle=""><text>关于</text></tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view class="tn-margin-to-xl tn-flex tn-flex-row-center tn-padding-top-xl">
			<view>
				<image src="../../../../static/logo.png" mode="aspectFit" style="height: 180rpx;"></image>
			</view>
			<view class="tn-margin-top">

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cacheSize: null,
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>