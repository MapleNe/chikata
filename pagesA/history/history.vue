<template>
	<view>
		<tn-nav-bar backTitle="">浏览历史</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<block v-for="(item,index) in list">
			<view class="tn-margin">
				<view class="tn-flex" @tap.stop.prevent="goArticle(index)">
					<view>
						<image :src="item.expand.images.length?item.expand.images[0].src:item.expand.img_src"
							mode="aspectFill" style="height: 150rpx;width: 260rpx;border-radius: 10rpx;"></image>
					</view>
					<view class="tn-flex tn-flex-1 tn-flex-direction-column tn-margin-left tn-flex-row-between"
						style="white-space: nowrap;overflow: hidden;">
						<view class="tn-text-bold tn-text-ellipsis">
							<text>{{item.title}}</text>
						</view>
						<view class="tn-text-ellipsis-2 tn-text-md tn-color-gray--dark" style="word-break: break-all;">
							<text>{{item.description}}</text>
						</view>
						<view class="tn-margin-top-xs">
							<view class="tn-flex tn-flex-col-center tn-flex-row-between">
								<view>
									<tn-avatar :src="item.expand.author.head_img" size="xs"></tn-avatar>
								</view>
								<view
									class="tn-flex-basic-md tn-flex-row-between tn-flex tn-flex-col-center tn-color-gray--dark tn-text-sm">
									<view class="tn-flex">
										<text class="tn-icon-fire"></text>
										<text>{{item.views}}</text>
									</view>
									<view class="tn-flex">
										<text class="tn-icon-comment"></text>
										<text>{{item.expand.comments.count}}</text>
									</view>
									<view class="tn-flex">
										<text class="tn-icon-praise"></text>
										<text>{{item.expand.like.likes_count}}</text>
									</view>

								</view>
							</view>

						</view>
					</view>
				</view>
			</view>
			<view class="tn-border-solid-bottom tn-border-gray--light">

			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: []
			};
		},
		onLoad() {
			this.initData()
		},
		methods: {
			initData() {
				this.list = uni.getStorageSync('history')
			},
			goArticle(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.list[index].id,
						users_id: this.list[index].users_id
					},
				})
			},
		}
	}
</script>

<style lang="scss">

</style>