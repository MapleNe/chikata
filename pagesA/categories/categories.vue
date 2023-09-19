<template>
	<view>
		<tn-nav-bar backTitle="">
			分区列表
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<tn-grid align="left" :col="col" hoverClass="none">
			<block v-for="(item, index) in list" :key="index">
				<!-- H5 -->
				<!-- #ifndef MP-WEIXIN -->
				<tn-grid-item>
					<view class="tn-bg-gray--light tn-padding-sm tn-flex tn-flex-direction-column tn-margin-bottom-sm tn-flex-col-center tn-text-ellipsis tn-color-gray--dark"
						@tap.stop.prevent="goCategory(index)" style="border-radius: 10rpx;white-space: normal;overflow: hidden;">
						<image :src="item.opt.head_img" mode="aspectFill" style="width: 100rpx;height: 100rpx;"></image>
						<text class="tn-margin-top-sm tn-text-md">{{item.name}}</text>
					</view>
				</tn-grid-item>
				<!-- #endif-->

				<!-- 微信小程序 -->
				<!-- #ifdef MP-WEIXIN -->
				<tn-grid-item :style="{width: gridItemWidth}">
					<view class="tn-bg-gray--light tn-padding-sm tn-flex tn-flex-direction-column tn-margin-bottom-sm tn-flex-col-center tn-text-ellipsis tn-color-gray--dark"
						@tap.stop.prevent="goCategory(index)" style="border-radius: 10rpx;white-space: normal;overflow: hidden;">
						<image :src="item.opt.head_img" mode="aspectFill" style="width: 100rpx;height: 100rpx;"></image>
						<text class="tn-margin-top-sm tn-text-md">{{item.name}}</text>
					</view>
				</tn-grid-item>
				<!-- #endif-->
			</block>
		</tn-grid>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				col: 4,
			};
		},
		computed: {
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			}
		},
		onReady() {
			this.getCategory()
		},
		methods: {
			// 获取分区
			getCategory() {
				this.$http.get('/article-sort/all', {
					params: {
						limit: 20,
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.list = res.data.data.data
					}
				})
			},
			goCategory(index) {
				this.$Router.push({
					path: '/pages/common/category/category',
					query: {
						id: this.list[index].id
					}
				})
			},
		}
	}
</script>

<style lang="scss">

</style>