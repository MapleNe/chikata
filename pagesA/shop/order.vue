<template>
	<view>
		<tn-nav-bar backTitle="" :zIndex="2">
			<text>确认订单</text>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view class="tn-margin">
			<tn-list-cell :arrow="true" unlined padding="15rpx 0rpx" @click="showAddress = true">
				<view class="tn-flex tn-flex-col-center ">
					<text class="tn-text-xxl tn-icon-location"></text>
					<text class="tn-text-lg tn-margin-left-sm">无收货地址，点击前往设置</text>
				</view>
			</tn-list-cell>
		</view>

		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<!-- 商品信息 -->
		<view class="tn-margin">
			<view class="tn-flex tn-flex-col-center">
				<text class="tn-icon-shop"></text>
				<text class="tn-margin-left-sm tn-text-md">店铺名称</text>
			</view>
			<view class="tn-margin-top-sm">
				<view class="tn-flex">
					<view class="tn-border-solid tn-margin-right-sm"
						style="border-radius: 10rpx;height: 140rpx;width: 140rpx;">
						<image
							src="http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800"
							mode="aspectFill" style="width: 100%;height: 100%;border-radius: 10rpx;"></image>
					</view>
					<view class="tn-flex tn-flex-direction-column tn-flex-1">
						<view class="tn-flex tn-flex-row-between tn-text-md">
							<text>商品标题</text>
							<view class="tn-flex">
								<text class="tn-text-xs">￥</text>
								<text>114.11</text>
							</view>
						</view>
						<view
							class="tn-flex-1 tn-flex tn-margin-top-xs tn-flex-row-between tn-text-md tn-color-gray--dark">
							<text>商品规格</text>
							<view class="tn-flex tn-flex-direction-column">
								<view class="tn-flex">
									<text class="tn-text-xs">￥</text>
									<text>115.11</text>
								</view>
								<view class="tn-flex-end">
									<text>x1</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 商品金额 -->
				<view class="tn-margin-top-sm tn-margin-bottom">
					<view class="tn-flex tn-flex-direction-column tn-text-md">
						<view class="tn-flex tn-flex-col-center tn-flex-row-between">
							<text>商品金额：</text>
							<view class="tn-flex">
								<text class="tn-text-xs">￥</text>
								<text>115.11</text>
							</view>
						</view>
						<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top-sm">
							<text>运费：</text>
							<view class="tn-flex">
								<text class="tn-text-xs">￥</text>
								<text>10</text>
							</view>
						</view>
						<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top-sm">
							<text>商品优惠：</text>
							<view class="tn-flex tn-color-red">
								<text class="tn-text-xs">- ￥</text>
								<text>10</text>
							</view>
						</view>
						<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top-sm">
							<text>店铺优惠：</text>
							<view class="tn-flex tn-color-red">
								<text class="tn-text-xs">- ￥</text>
								<text>10</text>
							</view>
						</view>
						<view class="tn-flex-end tn-margin-top-sm">
							<view class="tn-flex tn-flex-col-center">
								<text>小计</text>
								<view class="tn-flex tn-flex-col-center tn-text-bold tn-margin-left-xs">
									<text class="tn-text-sm">￥</text>
									<text>114</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 备注 -->
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<view class="tn-margin tn-margin-top-xs tn-margin-bottom-xs">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-text-md tn-color-gray--dark">
				<text>备注</text>
				<view class="tn-padding-left-sm tn-padding-right-sm tn-flex-1">
					<tn-input v-model="remark" placeholder="选填/建议先和客服协商一致" :clearable="false" inputAlign="right" />
				</view>
			</view>
		</view>
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<!-- 订单导航 -->
		<view style="position: fixed;bottom: 0;width: 100%;" class="tn-border-solid-top">

			<view class="tn-margin tn-margin-top-sm tn-margin-bottom-sm">
				<view class="tn-flex tn-flex-col-center">
					<view class="tn-margin-left-xl tn-flex tn-flex-col-bottom tn-flex-basic-full tn-text-md">
						<text>共1件，需付款</text>
						<view class="tn-flex tn-flex-col-bottom tn-text-bold tn-margin-left-xs">
							<text class="tn-text-sm">￥</text>
							<text class="tn-text-xl">114</text>
						</view>
					</view>
					<tn-button backgroundColor="#29b7cb" shape="round" size="lg" width="100%" fontColor="white">
						<text class="tn-text-md">提交订单</text>
					</tn-button>
				</view>

			</view>
		</view>
		<!-- 地址弹窗 -->
		<tn-popup v-model="showAddress" mode="bottom" length="50%" :borderRadius="20">
			<scroll-view scroll-y style="height: 100rpx;">
				<view class="tn-margin">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between">
						<text>选择收货地址</text>
						<text class="tn-icon-close tn-text-xxl" @tap.stop.prevent="showAddress = false"></text>
					</view>
				</view>
			</scroll-view>
			<!-- 底部增加地址 -->
			<view style="position: fixed;bottom: 0;width: 100%;" class="tn-border-solid-top">
				<view class="tn-margin tn-margin-top-sm tn-margin-bottom-sm">
					<tn-button backgroundColor="#29b7cb" shape="round" size="lg" width="100%" fontColor="white">
						<text class="tn-text-md">新增收货地址</text>
					</tn-button>
				</view>
			</view>
		</tn-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showAddress: false,
				remark: ''
			};
		}
	}
</script>

<style lang="scss">

</style>