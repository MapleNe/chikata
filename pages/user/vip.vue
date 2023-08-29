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
							<tn-button size="sm" shape="round" backgroundColor="tn-main-gradient-orangeyellow"
								fontColor="tn-color-black" @tap="showBuyVip = true">立即开通</tn-button>
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
					<text class="tn-margin-left-xs tn-margin-bottom">已成功邀请{{invite.length}}/5位</text>
					<view class="tn-flex tn-flex-direction-column tn-margin-left-xs tn-text-sm" style="color: #999999;">
						<text class="tn-margin-bottom-sm">1、点击邀请好友生成海报</text>
						<text class="tn-margin-bottom-sm">2、好友扫码下载APP注册填写邀请码</text>
						<text class="tn-margin-bottom-sm">3、邀请好友成功</text>
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
		<tn-popup mode="center" length="90%" v-model="showPoster" :borderRadius="20" safeAreaInsetBottom>
			<l-painter>
				<l-painter-view css="background-color:#333;height:300rpx">

				</l-painter-view>
			</l-painter>
		</tn-popup>
		<!-- 充值弹窗 -->
		<tn-popup mode="bottom" v-model="showBuyVip" :borderRadius="20" safeAreaInsetBottom>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-row-center">
					<text class="tn-text-center tn-color-orange--dark">会员套餐推荐</text>
				</view>
			</view>
			<tn-grid align="center" :col="3" hoverClass='none'>
				<block v-for="(item, index) in vipPrice" :key="index">
					<!-- H5 -->
					<!-- #ifndef MP-WEIXIN -->
					<tn-grid-item>
						<view class="tn-border-solid tn-padding" style="border-radius: 20rpx;"
							:class="selectedPackage ===index?'tn-border-cyan--dark tn-color-cyan--dark':'tn-border-black'"
							@tap.stop="selectPackage(index)">
							<view class="tn-flex tn-flex-direction-column tn-flex-col-center ">
								<text>{{item.day}}天</text>
								<view class="tn-flex tn-margin-top-sm">
									<text class="tn-text-xs">￥</text>
									<text class="tn-text-xxl tn-text-bold">{{item.price}}</text>
								</view>
								<text class="tn--margin-top-sm tn-text-sm tn-color-gray"
									style="text-decoration:line-through;">￥{{item.oPrice}}</text>
							</view>
							<view class="tn-margin-top tn-flex tn-flex-col-center tn-text-sm">
								<text class="tn-icon-gift tn-margin-right-sm"></text>
								<text>赠送{{item.gift}}天</text>
							</view>
						</view>

					</tn-grid-item>
					<!-- #endif-->
					<!-- 微信小程序 -->
					<!-- #ifdef MP-WEIXIN -->
					<tn-grid-item :style="{width: gridItemWidth}">
						<view class="tn-border-solid tn-padding" style="border-radius: 20rpx;"
							:class="selectedPackage ===index?'tn-border-cyan--dark tn-color-cyan--dark':'tn-border-black'"
							@tap.stop="selectPackage(item.id)">
							<view class="tn-flex tn-flex-direction-column tn-flex-col-center ">
								<text>{{item.day}}天</text>
								<view class="tn-flex tn-margin-top-sm">
									<text class="tn-text-xs">￥</text>
									<text class="tn-text-xxl tn-text-bold">{{item.price}}</text>
								</view>
								<text class="tn--margin-top-sm tn-text-sm tn-color-gray"
									style="text-decoration:line-through;">￥{{item.oPrice}}</text>
							</view>
							<view class="tn-margin-top tn-flex tn-flex-col-center tn-text-sm">
								<text class="tn-icon-gift tn-margin-right-sm"></text>
								<text>赠送{{item.gift}}天</text>
							</view>
						</view>
					</tn-grid-item>
					<!-- #endif-->
				</block>
			</tn-grid>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-row-center tn-bg-cyan--dark tn-color-white tn-padding-sm tn-round"
					hover-class="tn-hover" hover-stay-time="150" @tap.stop="showPay = true">
					<text class="">立即开通</text>
				</view>
			</view>
			<view class="tn-margin">
				<view class="tn-color-gray tn-flex tn-flex-direction-column">
					<text class="tn-margin-bottom-sm">购买须知</text>
					<view class="tn-text-sm tn-flex tn-flex-direction-column">
						<view class="tn-margin-bottom-sm">
							<text>1、购买会员则代表您同意</text>
							<text class="tn-color-cyan--dark">《会员协议》</text>
						</view>
						<text class="tn-margin-bottom-sm">2、购买后即享受会员特权，非特殊情况不允许退款</text>
						<text>3、最终解释权归软件方所有</text>

					</view>
				</view>
			</view>
		</tn-popup>
		<!-- 充值弹窗 -->
		<tn-popup v-model="showPay" mode="bottom" :borderRadius="20">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-row-center">
					<text class="tn-text-bold">选择支付方式</text>
				</view>
			</view>
			<view class="tn-margin">
				<view class="tn-flex">
					<tn-radio-group activeColor="#29b7cb" v-model="paymentSelect" @change="radioGroupChange"
						class="tn-flex-1 tn-flex tn-flex-direction-column">
						<view class="tn-flex tn-flex-row-between tn-flex-col-flex tn-margin-bottom">
							<view class="tn-flex tn-flex-col-center">
								<text
									class="tn-icon-funds tn-text-xxl tn-bg-cyan--dark tn-padding-xs tn-round tn-color-white"></text>
								<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
									<text>余额支付</text>
									<text class="tn-text-sm tn-color-gray">推荐使用余额支付</text>
								</view>
							</view>
							<tn-radio @change="radioChange" name="money"></tn-radio>
						</view>
						<view class="tn-flex tn-flex-row-between tn-flex-col-flex tn-margin-bottom">
							<view class="tn-flex tn-flex-col-center">
								<text
									class="tn-icon-payment-wechat tn-text-xxl tn-bg-cyan--dark tn-padding-xs tn-round tn-color-white"></text>
								<text class="tn-margin-left-sm">微信支付</text>
							</view>
							<tn-radio @change="radioChange" name="wechatpay"></tn-radio>
						</view>
						<view class="tn-flex tn-flex-row-between tn-flex-col-flex tn-margin-bottom">
							<view class="tn-flex tn-flex-col-center">
								<text
									class="tn-icon-alipay tn-text-xxl tn-bg-blue tn-padding-xs tn-round tn-color-white"></text>
								<text class="tn-margin-left-sm">支付宝支付</text>
							</view>
							<tn-radio @change="radioChange" name="alipay"></tn-radio>
						</view>
					</tn-radio-group>
				</view>
				<view class="tn-margin-top-xl tn-padding-top-xl">
					<view class="tn-margin-top-xl tn-padding-sm tn-flex tn-flex-row-center tn-round tn-bg-cyan--dark tn-shadow"
						hover-class="tn-hover" hover-stay-time="150">
						<text class="tn-color-white">确认支付</text>
					</view>
				</view>



			</view>
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
				showBuyVip: false,
				selectedPackage: 0,
				showPay: false,
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
				],
				vipPrice: [{
						id: 1,
						day: 30,
						price: 15,
						oPrice: 30,
						gift: 5
					},
					{
						id: 2,
						day: 90,
						price: 60,
						oPrice: 90,
						gift: 5
					},
					{
						id: 3,
						day: 180,
						price: 80,
						oPrice: 180,
						gift: 5
					},
				],
				paymentSelect: 'money',

			};
		},
		computed: {
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			},
			...mapState(['userInfo'])
		},
		methods: {
			selectPackage(id) {
				this.selectedPackage = id
			},
			radioChange(e) {
				console.log(e);
			},
			// 选中任一radio时，由radio-group触发
			radioGroupChange(e) {
				console.log(e);
			}
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