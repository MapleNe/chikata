<template>
	<view class="tn-padding-bottom">
		<tn-nav-bar backTitle='' alpha class="tn-color-white"></tn-nav-bar>
		<!-- 会员卡片 -->
		<view style="height: 450rpx;position: relative;" class="tn-bg-black">
			<view class="tn-padding" style="position: absolute;top: 180rpx; width: 100%;">
				<view style="height: 300rpx; border-radius: 15rpx;background-color: #333;position: relative;">
					<image src="./static/vip_background.png" mode="widthFix" style="width: 100%;opacity: 0.5;"></image>
					<view class="tn-padding tn-flex tn-flex-col-center tn-flex-row-between"
						style="position: absolute;top: 0;width: 100%;">
						<view class="tn-flex tn-flex-direction-column">
							<text class="tn-color-white tn-text-xl">VIP 会员</text>
							<text class="tn-padding-top-sm" style="color: #999999;">精彩会员，特殊特权等你来拿！</text>
						</view>
						<view>
							<text class="tn-color-orangeyellow tn-icon-vip-fill" style="font-size: 130rpx;"></text>
						</view>
					</view>
					<view class="tn-padding" style="position: absolute;bottom: 0;width: 100%;">
						<view class="tn-flex tn-flex-col-center tn-flex-row-between">
							<text class="tn-color-orangeyellow">新人大礼包邀请免费领取</text>
							<tn-button size="sm" shape="round"
								backgroundColor="tn-main-gradient-orangeyellow" fontColor="tn-color-black">立即开通</tn-button>
						</view>
					</view>

				</view>
			</view>
		</view>
		<!-- 卡片结束 -->
		<view class="tn-margin-sm tn-padding-top-xl tn-border-solids-left tn-border-solids-right tn-border-solid"
			style="border-radius: 20rpx;box-shadow: 0px 4rpx 8rpx rgba(0, 0, 0, 0.1);">
			<view class="tn-margin-xs">
				<view class="tn-margin-top tn-flex tn-flex-row-center">
					<text>邀请好友领30天会员</text>
				</view>
				<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top">
					<view class="tn-flex">
						<view v-for="(item,index) in 5" :key="index">
							<view class="tn-round tn-border-dashed tn-flex tn-flex-col-center"
								style="height: 100rpx;width: 100rpx;">
								<tn-avatar size="lg" :src="invite[index] && invite[index].head_img"
									v-if="invite[index]"></tn-avatar>
								<text v-else class="tn-icon-add tn-flex-1"></text>
							</view>
						</view>
					</view>
					<view @tap.stop="showPoster = true">
						<tn-button backgroundColor="tn-bg-orange" shape="round"
							fontColor="tn-color-white">{{invite.length>=5?'立即领取':'邀请好友'}}</tn-button>
					</view>

				</view>
				<view class="tn-margin-top">
					<text class="tn-margin-left-xs">已成功邀请{{invite.length}}/5位</text>
					<view class="tn-flex tn-flex-direction-column tn-margin-left-xs tn-text-xs tn-padding-bottom-xs"
						style="color: #999999;">
						<text>1、点击邀请好友生成海报</text>
						<text>2、好友扫码下载APP注册填写邀请码</text>
						<text>3、邀请好友成功</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 特权列表 -->
		<view class="tn-margin-top-xl tn-margin">
			<view class="tn-flex tn-flex-row-center tn-flex-col-center">
				<text>会员尊享特权</text>
			</view>
			<tn-grid :col="5" hoverClass="none">
				<block v-for="(item, index) in permission" :key="index">
					<!-- H5 -->
					<!-- #ifndef MP-WEIXIN -->
					<tn-grid-item>
						<view class="tn-flex tn-flex-direction-column tn-flex-col-center tn-margin-top">
							<text :class="item.icon" class="tn-text-xxl tn-color-orangeyellow"></text>
							<text class="tn-margin-top">{{item.name}}</text>
						</view>

					</tn-grid-item>
					<!-- #endif-->

					<!-- 微信小程序 -->
					<!-- #ifdef MP-WEIXIN -->
					<tn-grid-item :style="{width: gridItemWidth}">
						<view class="tn-flex tn-flex-direction-column tn-flex-col-center tn-margin-top">
							<text :class="item.icon" class="tn-text-xxl tn-color-orangeyellow"></text>
							<text class="tn-margin-top">{{item.name}}</text>
						</view>
					</tn-grid-item>
					<!-- #endif-->
				</block>
			</tn-grid>
		</view>
		<!-- 特权详情 -->
		<view class="tn-margin-top-xl tn-margin">
			<view class="tn-border-solids-left tn-border-solids-right tn-border-solid"
				style="border-radius: 20rpx;box-shadow: 0px 4rpx 8rpx rgba(0, 0, 0, 0.1);">
				<view>
					<view class="tn-flex tn-flex-row-center tn-margin-top">
						<text>特权详情</text>
					</view>
					<view class="tn-margin-sm tn-flex tn-flex-col-center">
						<tn-avatar backgroundColor="tn-bg-orange"></tn-avatar>
						<view class="tn-margin-left-sm tn-flex tn-flex-direction-column">
							<view class="tn-flex tn-flex-col-center">
								<view class="tn-bg-purplered--disabled tn-margin-right-xs"
									style="width: 60rpx;height: 20rpx;"></view>
								<text class="tn-icon-trusty-fill tn-color-blue"></text>
							</view>
							<view class="tn-bg-gray--disabled tn-margin-top-sm" style="width: 100rpx;height: 20rpx;">
							</view>
						</view>
					</view>
					<view class="tn-margin-left-xl">
						<view class="tn-margin-left-xl tn-bg-orange" style="width: 300rpx; height: 20rpx;"></view>
						<view class="tn-bg-gray--light tn-margin-xl" style="border-radius: 20rpx;">
							<view class="tn-padding-sm">
								<view class="tn-flex tn-flex-col-center">
									<tn-avatar backgroundColor="tn-bg-bluepurple--light"></tn-avatar>
									<view class="tn-margin-left-sm tn-flex tn-flex-direction-column">
										<view class="tn-flex tn-flex-col-center">
											<view class="tn-bg-gray tn-margin-right-xs"
												style="width: 120rpx;height: 20rpx;"></view>
										</view>
										<view class="tn-bg-gray--disabled tn-margin-top-sm"
											style="width: 60rpx;height: 20rpx;"></view>
									</view>
								</view>
							</view>
							<view class="tn-margin-left-xl">
								<view class="tn-margin-left-xl tn-bg-gray" style="width: 200rpx; height: 20rpx;"></view>
							</view>
						</view>
					</view>
				</view>
				<view class="tn-margin-top-xl">
					<view class="tn-flex tn-flex-row-center">
						<text>头像挂件</text>
					</view>
					<tn-grid :col="3" hoverClass="none" class="tn-margin-top">
						<block v-for="(item, index) in avatar" :key="index">
							<!-- H5 -->
							<!-- #ifndef MP-WEIXIN -->
							<tn-grid-item>
								<view class="tn-bg-gray--light tn-flex tn-margin tn-padding tn-flex-col-center"
									style="border-radius: 20rpx;">
									<view class="tn-flex tn-flex-col-center tn-flex-direction-column">
										<view style="position: relative;">
											<tn-avatar :src="userInfo.head_img"></tn-avatar>
											<image :src="item.avatar_img" mode="aspectFill" class="avatar">
											</image>
										</view>
										<view class="tn-margin-top-lg">
											<text>{{item.name}}</text>
										</view>
									</view>
								</view>

							</tn-grid-item>
							<!-- #endif-->

							<!-- 微信小程序 -->
							<!-- #ifdef MP-WEIXIN -->
							<tn-grid-item :style="{width: gridItemWidth}">
								<view class="tn-bg-gray--light tn-flex tn-margin tn-padding tn-flex-col-center"
									style="border-radius: 20rpx;">
									<view class="tn-flex tn-flex-col-center tn-flex-direction-column">
										<view style="position: relative;">
											<tn-avatar :src="userInfo.head_img"></tn-avatar>
											<image :src="item.avatar_img" mode="aspectFill" class="avatar"></image>
										</view>
										<view class="tn-margin-top-lg">
											<text>{{item.name}}</text>
										</view>
									</view>
								</view>
							</tn-grid-item>
							<!-- #endif-->
						</block>
					</tn-grid>
				</view>
			</view>
			<view class="tn-flex tn-flex-row-center tn-margin-top">
				<text style="color: #999999;">更多特权敬请期待</text>
			</view>
		</view>
		<!-- 海报弹窗 -->
		<tn-popup mode="center" length="90%" v-model="showPoster" :borderRadius="20">
			<l-painter>
				<l-painter-view css="background-color:#333;height:300rpx">
					
				</l-painter-view>
			</l-painter>
		</tn-popup>
	</view>


</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				showPoster: false,
				invite: [{
						head_img: 'https://img.harumoe.cn/uploads/20230630/3bb7c3b581168627d64f2602227e4e40.png',
						id: 1
					},
					{
						head_img: 'https://img.harumoe.cn/uploads/20230630/3bb7c3b581168627d64f2602227e4e40.png',
						id: 2
					}
				],
				avatar: [{
						name: '挂件1',
						avatar_img: 'https://img1.imgtp.com/2023/08/19/fqfm10Iy.png'
					},
					{
						name: '挂件1',
						avatar_img: ''
					},
					{
						name: '挂件1',
						avatar_img: ''
					},
					{
						name: '挂件1',
						avatar_img: ''
					},
					{
						name: '挂件1',
						avatar_img: ''
					},
					{
						name: '挂件1',
						avatar_img: ''
					},


				],
				permission: [{
						name: '至尊身份',
						icon: 'tn-icon-vip-fill'
					},
					{
						name: '彩色昵称',
						icon: 'tn-icon-theme-fill'
					},
					{
						name: '头像挂件',
						icon: 'tn-icon-circle-fill'
					},
					{
						name: '多彩评论',
						icon: 'tn-icon-message-fill'
					},
					{
						name: '动态头像',
						icon: 'tn-icon-tailor'
					},
					{
						name: '动态头像',
						icon: 'tn-icon-tailor'
					}
				]
			};
		},
		computed: {
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			},
			...mapState(['userInfo'])
		}
	}
</script>

<style lang="scss" scoped>
	.avatar {
		position: absolute;
		left: 50%;
		margin-left: -45rpx;
		/* decoration图片宽度的一半 */
		top: 50%;
		margin-top: -50rpx;
		width: 90rpx;
		height: 90rpx;

	}
</style>