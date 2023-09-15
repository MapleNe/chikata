<template>
	<z-paging ref="paging">
		<template #top>
			<tn-nav-bar backTitle="" alpha>好物</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		
		<view class="tn-margin">
			<tn-swiper :list="swiperList" name="src" style="border-radius: 20rpx;"></tn-swiper>
		</view>

		<uv-waterfall ref="waterfall" v-model="content" :left-gap="leftGap" :right-gap="rightGap"
			:column-gap="columnGap" @changeList="changeList">
			<!-- 第一列数据 -->
			<template v-slot:list1>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<block v-for="(item,index) in list1" :key="item.id">
						<view class="tn-bg-white tn-margin-top" style="border-radius: 20rpx;">
							<view class="tn-flex tn-flex-direction-column" :style="imageStyle(item)">
								<image :src="item.image" mode="widthFix" style="border-radius: 20rpx 20rpx 0 0;"
									:style="{width:item.width+'px'}"></image>
								<view class="tn-margin-top tn-padding-sm">
									<view class="tn-text-ellipsis-2 tn-text-md"
										style="white-space: nowrap;word-break: break-all;">
										<text>{{item.title}}</text>
									</view>
									<view class="tn-margin-top">
										<view class="tn-flex tn-flex-bottom tn-color-orangeyellow">
											<text class="tn-text-xs">￥</text>
											<text class="tn-text-bold">{{item.price}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>

				</view>
			</template>
			<!-- 第二列数据 -->
			<template v-slot:list2>
				<!-- 为了磨平部分平台的BUG，必须套一层view -->
				<view>
					<block v-for="(item,index) in list2" :key="item.id">
						<view class="tn-bg-white tn-margin-top" style="border-radius: 20rpx;">
							<view class="tn-flex tn-flex-direction-column" :style="imageStyle(item)">
								<image :src="item.image" mode="widthFix" style="border-radius: 20rpx 20rpx 0 0;"
									:style="{width:item.width+'px'}"></image>
								<view class="tn-margin-top tn-padding-sm">
									<view class="tn-text-ellipsis-2 tn-text-md"
										style="white-space: nowrap;word-break: break-all;">
										<text>{{item.title}}</text>
									</view>
									<view class="tn-margin-top">
										<view class="tn-flex tn-flex-bottom tn-color-orangeyellow">
											<text class="tn-text-xs">￥</text>
											<text class="tn-text-bold">{{item.price}}</text>
										</view>

									</view>

								</view>
							</view>
						</view>
					</block>
				</view>
			</template>
		</uv-waterfall>
	</z-paging>

</template>

<script>
	export default {
		data() {
			return {
				content: [{
						id: 1,
						image: 'http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800',
						price: 50,
						title: '标题'
					},
					{
						id: 2,
						image: 'http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800',
						price: 50,
						title: '标题'
					},
					{
						id: 3,
						image: 'http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800',
						price: 50,
						title: '标题'
					},
					{
						id: 4,
						image: 'http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800',
						price: 50,
						title: '标题'
					}
				],
				list1: [],
				list2: [],
				leftGap: 10,
				rightGap: 10,
				columnGap: 10,
				swiperList: [{
					src: 'http://img-qn.51miz.com/preview/element/00/01/29/78/E-1297822-3991F801.jpg!/quality/90/unsharp/true/compress/true/fwfh/800x800'
				}],
			};
		},
		computed: {
			imageStyle(item) {
				return item => {
					const v = uni.upx2px(750) - this.leftGap - this.rightGap - this.columnGap;
					const w = v / 2;
					const rate = w / item.w;
					const h = rate * item.h;
					return {
						width: w + 'px',
						height: h + 'px'
					}
				}
			}
		},
		methods: {
			changeList(e) {
				this[e.name].push(e.value);
			},
		}
	}
</script>

<style lang="less">
	page {
		background-color: #f7f8f7;
	}
</style>