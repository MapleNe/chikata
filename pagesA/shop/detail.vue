<template>
	<view>
		<tn-nav-bar backTitle="" :zIndex="2"></tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<tn-swiper :list="swiperList" name="src" :height="500"></tn-swiper>
		<view class="tn-margin">
			<text>{{good.title}}</text>
			<view class="tn-margin-top-sm tn-flex tn-flex-col-bottom tn-color-orangeyellow tn-text-bold">
				<text class="tn-text-md">￥</text>
				<text class="tn-text-xxl">{{good.price}}</text>
			</view>
			<view class="tn-margin-top-sm tn-border-solid-top tn-border-gray--light">
				<tn-list-cell :arrow="true" unlined padding="15rpx 0rpx" @click="showSize = true">
					<text class="tn-text-md tn-color-gray--dark">请选择规格</text>
				</tn-list-cell>
			</view>
		</view>
		<!-- 间隔 -->
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<view class="tn-margin">
			<tn-list-cell :arrow="true" unlined padding="0rpx" @click="showSize = true">
				<text>商品评价</text>
				<text class="tn-margin-left-sm tn-color-gray--dark">{{good.reviews.length}}</text>
			</tn-list-cell>
			<view class="tn-margin-top">
				<block v-for="(item,index) in good.reviews" :key="index">
					<view class="tn-flex tn-flex-col-center">
						<tn-avatar :src="item.expand.author.head_img"></tn-avatar>
						<text class="tn-margin-left-sm tn-text-sm">{{item.expand.author.nickname}}</text>
					</view>
					<view class="tn-margin-top-xs tn-margin-bottom-xs">
						<text class="tn-text-md">{{item.content}}</text>
					</view>
					<tn-grid align="left" :col="3" hoverClass="none">
						<block v-for="(images, subIndex) in item.images" :key="subIndex" v-if="subIndex<3">
							<!-- H5 -->
							<!-- #ifndef MP-WEIXIN -->
							<tn-grid-item style="height: 220rpx;width: 220rpx;margin-right: 6rpx;margin-bottom: 6rpx">
								<image :src="images" mode="aspectFill"
									style="height: 200rpx;width: 200rpx;border-radius: 10rpx;"
									@tap.stop="previewImage(item.images,subIndex)">
								</image>
							</tn-grid-item>
							<!-- #endif-->

							<!-- 微信小程序 -->
							<!-- #ifdef MP-WEIXIN -->
							<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
								style="margin-right: 6rpx;margin-bottom: 6rpx">
								<image :src="images" mode="aspectFill"
									style="height: 200rpx;width: 200rpx;border-radius: 10rpx;"
									@tap.stop="previewImage(item.images,subIndex)">
								</image>
							</tn-grid-item>
							<!-- #endif-->
						</block>
					</tn-grid>
				</block>
			</view>
		</view>
		<!-- 间隔 -->
		<view class="tn-bg-gray--light tn-padding-xs"></view>
		<view class="tn-margin">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between">
				<view class="tn-flex tn-flex-col-center">
					<tn-avatar :src="good.shop.head_img"></tn-avatar>
					<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
						<view class="tn-flex tn-flex-col-center">
							<text class="tn-text-md">{{good.shop.name}}</text>
							<view class="tn-bg-yellow--light tn-color-orangeyellow tn-margin-left"
								style="padding: 2rpx 4rpx;" v-if="good.shop.offical">
								<text class="tn-text-xs">官方</text>
							</view>
						</view>
						<text class="tn-text-sm tn-color-gray--dark">{{good.shop.goods}}件商品在售</text>
					</view>
				</view>
				<view class="tn-flex tn-flex-col-center tn-flex-basic-sm tn-flex-row-between">
					<tn-button shape="round" size="sm" backgroundColor="#29b7cb" plain fontColor="#29b7cb"
						padding="15rpx 20rpx">
						<view class="tn-flex">
							<text class="tn-icon-add"></text>
							<text>关注</text>
						</view>
					</tn-button>
					<tn-button shape="round" size="sm" backgroundColor="#aaa" plain padding="15rpx 20rpx">
						<text>更多商品</text>
					</tn-button>
				</view>
			</view>
		</view>
		<!-- 间隔 -->
		<view class="tn-bg-gray--light tn-padding-xs"></view>
		<view class="tn-margin">
			<text>商品详情</text>
			<mp-html :content="good.detail"></mp-html>
			<view class="tn-color-gray--dark tn-margin-top tn-text-md tn-margin-bottom">
				<text>相关资质：</text>
				<text class="ch-color-primary">点击查看</text>
			</view>
		</view>
		<!-- 底部结束 -->
		<view class="tn-bg-gray--light tn-padding-lg tn-color-gray--dark tn-text-center">
			<text>已经到底了哦~</text>
		</view>
		<!-- 商品导航 -->
		<view style="position: fixed;bottom: 0;width: 100%;" class="tn-bg-white tn-border-solid-top">
			<view class="tn-margin-sm tn-margin-left tn-margin-right">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<view class="tn-flex tn-flex-col-center tn-text-xxl tn-flex-row-between">
						<text class="tn-icon-shop"></text>
						<text class="tn-margin-left tn-icon-service-simple"></text>
						<text class="tn-margin-left tn-margin-right tn-icon-cart"></text>
					</view>
					<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-flex-1">
						<tn-button backgroundColor="#29b7cb4c" shape="round" size="lg" width="100%" fontColor="#29b7cb">
							<view class="">
								<text class="tn-text-md">加入购物车</text>
							</view>
						</tn-button>
						<!-- 间隔 -->
						<view class="tn-margin-left-xs tn-margin-right-xs"></view>
						<tn-button backgroundColor="#29b7cb" shape="round" size="lg" width="100%" fontColor="white">
							<view class=" ">
								<text class="tn-text-md">立即购买</text>
							</view>
						</tn-button>
					</view>
				</view>
			</view>

		</view>
		<!-- 规格选择弹窗 -->
		<tn-popup v-model="showSize" mode="bottom" :borderRadius="20">
			<view class="tn-margin">
				<view style="position: absolute;right: 0;" class="tn-margin-right" @tap.stop.prevent="showSize = false">
					<text class="tn-icon-close tn-text-xxl"></text>
				</view>
				<view class="tn-flex tn-flex-col-bottom">
					<view class="tn-border-solid" style="border-radius: 10rpx;height: 164rpx;width: 164rpx;">
						<image :src="good.specifications[0].image" mode="aspectFill"
							style="width: 100%;height: 100%; border-radius: 10rpx;"></image>
					</view>
					<view class="tn-flex tn-flex-direction-column tn-margin-left-sm tn-flex-1">
						<view class="tn-margin-top-sm tn-flex tn-flex-col-bottom tn-color-orangeyellow tn-text-bold">
							<text class="tn-text-md">￥</text>
							<text class="tn-text-xxl">{{good.price}}</text>
						</view>
						<view class="tn-color-gray--dark tn-text-sm tn-flex tn-flex-direction-column">
							<text class="tn-margin-top-xs">剩余 {{good.specifications[0].num}} 件</text>
							<text class="tn-margin-top-xs">请选择规格</text>
						</view>
					</view>
				</view>
				<!-- 规格 -->
				<view class="tn-margin-top-lg">
					<text>规格</text>
					<view
						class="tn-flex tn-flex-col-center tn-flex-wrap tn-margin-top tn-border-solid-bottom tn-border-gray--light">
						<block v-for="(item,index) in good.size" :key="index">
							<view
								class="tn-text-md tn-margin-bottom tn-bg-gray--light tn-padding-sm tn-padding-top-xs tn-padding-bottom-xs"
								style="border-radius: 20rpx;">
								<text>{{item.name}}</text>
							</view>
						</block>
					</view>
				</view>
				<!-- 数量 -->
				<view class="tn-margin-top">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between">
						<text>购买数量</text>
						<tn-number-box v-model="buyNum" backgroundColor="#29b7cb" fontColor="white" disabledInput
							:min="1" :max="999"></tn-number-box>
					</view>
				</view>

				<!-- 购买加入控件 -->
				<view class="tn-margin-top-xl tn-padding-top-xl">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between">
						<tn-button backgroundColor="#29b7cb4c" shape="round" size="lg" width="100%" fontColor="#29b7cb">
							<view class="tn-padding-left tn-padding-right">
								<text class="tn-text-md">加入购物车</text>
							</view>
						</tn-button>
						<!-- 间隔 -->
						<view class="tn-margin-left-xs tn-margin-right-xs"></view>
						<tn-button backgroundColor="#29b7cb" shape="round" size="lg" width="100%" fontColor="white">
							<view class="tn-padding-left tn-padding-right">
								<text class="tn-text-md">立即购买</text>
							</view>
						</tn-button>
					</view>
				</view>
			</view>
		</tn-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				swiperList: [{
					src: 'http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800'
				}],
				good: {
					title: '七彩杯子',
					price: 50,
					specifications: [{
						name: '七彩杯子',
						image: 'http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800',
						price: 50,
						num: 1145,
					}],
					shop: {
						id: 1,
						name: '七彩万事屋',
						goods: 123,
						head_img: 'http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800',
						offical: true,
					},
					detail: '<p>这是一个商品详情</p>',
					reviews: [{
						id: 1,
						content: '很好吃，琪亚娜很喜欢',
						images: [
							'http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800'
						],
						good: {
							id: 1,
							name: '七彩杯子',
						},
						expand: {
							author: {
								users_id: 2,
								nickname: '德莉莎天下第一可爱',
								head_img: 'http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800'
							}
						},
						create_time: '2023-09-15',
					}]
				},
				showSize: false,
				buyNum: 1,
				col: 3,
			};
		},
		computed: {
			gridItemWidth() {
				return 100 / this.col + '%'
			}
		},
		methods: {
			previewImage(images, index) {
				let data = [];
				for (let i = 0; i < images.length; i++) {
					data.push(images[i]);
				}
				uni.previewImage({
					current: index,
					urls: data,
				});
			},
		}
	}
</script>

<style lang="less">

</style>