<template>
	<view @tap.stop.prevent="goArticle(data.id,data.users_id)">
		<view class="tn-margin-top">
			<text class="tn-text-title">{{data.title}}</text>
		</view>
		<view class="tn-padding-sm tn-no-padding-left tn-color-gray--dark tn-padding-bottom-sm"
			style="word-break: break-all;">
			<rich-text :nodes="data.description"></rich-text>
		</view>
		<!-- 单张图片 -->
		<view v-if="data.expand.images.length===1">
			<image v-for="(images,subIndex) in data.expand.images" :key="subIndex" :src="images.src" mode="aspectFill"
				style="height: 400rpx;width: 400rpx;border-radius:10rpx;"
				@tap.stop="previewImage(data.expand.images,subIndex)">
			</image>
		</view>
		<!-- 单张结束 -->
		<!-- 复数开始 -->
		<view v-if="data.expand.images.length===2 || data.expand.images.length===4">
			<tn-grid align="left" :col="data.expand.images.length" hoverClass="none">
				<block v-for="(images, subIndex) in data.expand.images" :key="subIndex">
					<!-- H5 -->
					<!-- #ifndef MP-WEIXIN -->
					<tn-grid-item style="height: 256rpx;width: 256rpx;margin-right: 6rpx;margin-bottom: 6rpx;">
						<image :src="images.src" mode="aspectFill"
							style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
							@tap.stop="previewImage(data.expand.images,subIndex)">
						</image>
					</tn-grid-item>
					<!-- #endif-->

					<!-- 微信小程序 -->
					<!-- #ifdef MP-WEIXIN -->
					<tn-grid-item :style="{width: griddataWidth,height:griddataWidth}"
						style="margin-right: 6rpx;margin-bottom: 6rpx;">
						<image :src="images.src" mode="aspectFill"
							style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
							@tap.stop="previewImage(data.expand.images,subIndex)">
						</image>
					</tn-grid-item>
					<!-- #endif-->
				</block>
			</tn-grid>
		</view>
		<view v-if="data.expand.images.length===3|| data.expand.images.length>4">
			<tn-grid align="left" :col="col" hoverClass="none">
				<block v-for="(images, subIndex) in data.expand.images" :key="subIndex" v-if="subIndex<9">
					<!-- H5 -->
					<!-- #ifndef MP-WEIXIN -->
					<tn-grid-item style="height: 220rpx;width: 220rpx;margin-right: 6rpx;margin-bottom: 6rpx">
						<image :src="images.src" mode="aspectFill"
							style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
							@tap.stop="previewImage(data.expand.images,subIndex)">
						</image>
					</tn-grid-item>
					<!-- #endif-->

					<!-- 微信小程序 -->
					<!-- #ifdef MP-WEIXIN -->
					<tn-grid-item :style="{width: griddataWidth,height:griddataWidth}"
						style="margin-right: 6rpx;margin-bottom: 6rpx">
						<image :src="images.src" mode="aspectFill"
							style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
							@tap.stop="previewImage(data.expand.images,subIndex)">
						</image>
					</tn-grid-item>
					<!-- #endif-->
				</block>
			</tn-grid>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		name: "articleContent",
		props: {
			data: {
				type: Object,
				default: null,
			}
		},
		computed: {
			...mapState(['hasLogin']),
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			}
		},
		data() {
			return {

			}
		},
		methods:{
			previewImage(images, index) {
				let data = [];
				for (let i = 0; i < images.length; i++) {
					data.push(images[i].src);
				}
				uni.previewImage({
					current: index,
					urls: data,
				});
			},
			goArticle(id,users_id) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id,
						users_id
					},
				})
			},
		}
	}
</script>

<style>
</style>