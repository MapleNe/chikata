<template>
	<view>
		<tn-nav-bar backTitle="">
			活动
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<block v-for="(item,index) in data">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-direction-column" style="border-radius: 10rpx;">
					<view class="tn-flex tn-flex-row-between">
						<view class="tn-flex tn-flex-col-center">
							<tn-avatar :src="item.image" size="xs"></tn-avatar>
							<text class="tn-margin-left-xs tn-margin-right-xs tn-text-md">分类</text>
							<text class="tn-bg-red tn-round" style="padding:6rpx"></text>
						</view>
						<view class="tn-text-sm tn-color-gray--dark">
							<text>3小时前</text>
						</view>

					</view>
					<view class="tn-margin-top-sm tn-margin-bottom-sm">
						<image :src="item.image" mode="aspectFill"
							style="height: 268rpx;width: 100%;border-radius: 10rpx;">
						</image>
					</view>

					<view class="tn-flex tn-flex-direction-column">
						<text class="tn-text-bold">{{item.title}}</text>
						<text class="tn-color-gray--dark">{{item.description}}</text>
					</view>
				</view>
			</view>
			<view class="tn-padding-xs tn-bg-gray--light">
			</view>
		</block>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				data: [{
					id: 1,
					image: 'https://api.guan.asia/storage/users/files/3/2023-09/65031a4a6ab14.png',
					title: '白丝萝莉大爆发',
					description: '狼人的野性在此爆发'
				}]
			};
		}
	}
</script>

<style lang="scss">

</style>