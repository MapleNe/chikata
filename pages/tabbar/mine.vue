<template>
	<view>
		<tn-nav-bar customBack alpha>
			<view slot="right" class="tn-padding tn-color-white tn-text-xxl">
				<text class="tn-margin-right-sm tn-icon-scan tn-padding-xs tn-round"
					style="background-color: rgba(0,0,0,0.2);" @tap="" @tap.stop.prevent="scanQrcode"></text>
				<text class="tn-icon-install tn-padding-xs tn-round" style="background-color: rgba(0,0,0,0.2);"
					@tap.stop.prevent="goSetting"></text>
			</view>
		</tn-nav-bar>

		<view style="position: relative;">
			<view>
				<image :src="userInfo.longtext.background_img?userInfo.longtext.background_img:userInfo.head_img"
					mode="aspectFill" style="width: 100%;height: 420rpx;">
				</image>
			</view>
			<!-- 第一层 -->
			<view class="tn-bg-white tn-padding tn-no-padding-right"
				style="position: absolute;top:320rpx;width: 100%; border-radius: 45rpx 45rpx 0 0">
				<view style="position: absolute;top: -70rpx;" class="tn-margin-left-sm"
					@tap.stop.prevent="hasLogin?goProfile():goLogin()">
					<tn-avatar :src="userInfo.head_img" size="xxl" border borderColor="#fff"
						:borderSize="6"></tn-avatar>
				</view>
				<!-- 按钮样式 -->
				<view class="tn-flex tn-flex-row-right" v-if="hasLogin">
					<view class="tn-flex tn-flex-col-center">
						<view class="tn-margin-right">
							<tn-button plain backgroundColor="#29b7cb" fontColor="#29b7cb"
								@click="goProfile()">个人主页</tn-button>
						</view>
					</view>
				</view>
			</view>
			<!-- 第二层 在这里绘制元素 -->
			<view class="tn-margin">
				<!-- 用户属性 -->
				<view class="tn-margin-top">
					<view class="tn-flex tn-flex-direction-column" v-if="hasLogin">
						<view class="tn-flex">
							<text class="tn-text-bold tn-text-xxl">{{userInfo.nickname}}</text>
							<text class="level level-text tn-margin-left-sm" :class="['lv-'+userInfo.grade]"
								:style="{'color':level[userInfo.grade]}"></text>
						</view>

						<text class="tn-text-md tn-margin-top-xs">通行证ID: {{userInfo.account}}</text>
					</view>
					<view class="tn-flex tn-flex-direction-column" v-else @tap="goLogin()">
						<text class="tn-text-bold tn-text-xxl">点击登录</text>
						<text class="tn-text-md tn-margin-top-xs">登录解锁更多精彩</text>
					</view>
				</view>
				<!-- 预备个人TAG -->
				<view class="">

				</view>
				<view class="tn-margin-top-xl tn-margin-bottom-lg" v-if="hasLogin">
					<view class="tn-flex tn-flex-col-center tn-text-sm">
						<view class="tn-flex tn-flex-col-center tn-margin-right" @tap.stop.prevent="goFans()">
							<text
								class="tn-text-bold tn-text-xxl tn-margin-right-xs">{{userInfo.expand.fansCount}}</text>
							<text class="tn-color-gray--dark">粉丝</text>
						</view>
						<view class="tn-flex tn-flex-col-center tn-margin-right">
							<text
								class="tn-text-bold tn-text-xxl tn-margin-right-xs">{{userInfo.expand.focusCount}}</text>
							<text class="tn-color-gray--dark">关注</text>
						</view>
						<view class="tn-flex tn-flex-col-center tn-margin-right">
							<text
								class="tn-text-bold tn-text-xxl tn-margin-right-xs">{{userInfo.expand.likeCount}}</text>
							<text class="tn-color-gray--dark">获赞</text>
						</view>
					</view>
				</view>
			</view>
			<view class="tn-padding-xs tn-bg-gray--light"></view>
			<view class="tn-margin tn-no-margin-left tn-no-margin-right">
				<tn-grid align="left" :col="col" hoverClass="none" class="tn-text-md">
					<block v-for="(item, index) in btnList" :key="index">
						<!-- H5 -->
						<!-- #ifndef MP-WEIXIN -->
						<tn-grid-item>
							<view class="tn-flex tn-flex-direction-column" @tap.stop.prevent="goPage(item)">
								<text :class="item.icon" class="ch-color-primary tn-text-xxl"></text>
								<text class="tn-margin-top-sm tn-text-sm tn-margin-bottom">{{item.name}}</text>
							</view>
						</tn-grid-item>
						<!-- #endif-->

						<!-- 微信小程序 -->
						<!-- #ifdef MP-WEIXIN -->
						<tn-grid-item :style="{width: gridItemWidth}" class="tn-flex tn-flex-row-between">
							<view class="tn-flex tn-flex-direction-column" @tap.stop.prevent="goPage(item)">
								<text :class="item.icon" class="ch-color-primary tn-text-xxl"></text>
								<text class="tn-margin-top-sm tn-text-sm tn-margin-bottom">{{item.name}}</text>
							</view>
						</tn-grid-item>
						<!-- #endif-->
					</block>
				</tn-grid>
			</view>
			<view class="tn-padding-xs tn-bg-gray--light"></view>
			<tn-list-cell :arrow="true">
				<view class="tn-flex tn-flex-col-center">
					<text class="tn-icon-gift tn-text-xxl"></text>
					<text class="tn-margin-left-sm">活动</text>
				</view>
			</tn-list-cell>
			<tn-list-cell :arrow="true">
				<view class="tn-flex tn-flex-col-center">
					<text class="tn-icon-gift tn-text-xxl"></text>
					<text class="tn-margin-left-sm">客服</text>
				</view>
			</tn-list-cell>
			<tn-list-cell unlined :arrow="true">
				<view class="tn-flex tn-flex-col-center">
					<text class="tn-icon-gift tn-text-xxl"></text>
					<text class="tn-margin-left-sm">青少年守护</text>
				</view>
			</tn-list-cell>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		components: {},
		computed: {
			...mapState(['hasLogin', 'userInfo']), //从Store获取全局变量
		},
		data() {
			return {
				content: [],
				tabs: ['动态', '合集'],
				tabsIndex: 0,
				col: 4,
				btnList: [{
						name: '头像框',
						page: 'avatar',
						icon: 'tn-icon-my'
					},
					{
						name: '好物',
						page: 'shop',
						icon: 'tn-icon-shop'
					},
					{
						name: '收藏',
						page: 'favorite',
						icon: 'tn-icon-star'
					},
					{
						name: '浏览历史',
						page: 'history',
						icon: 'tn-icon-order'
					},
					{
						name: '小摊',
						page: 'othershop',
						icon: 'tn-icon-commissary'
					},
					{
						name: '创作中心',
						page: 'creative',
						icon: 'tn-icon-creative'
					},
					{
						name: '社区中心',
						page: 'home',
						icon: 'tn-icon-home-leaf'
					},
					{
						name: '合集',
						page: 'collect',
						icon: 'tn-icon-folder'
					},
				],
				swiperHeight: 0, //活动组件高度
				comments: [],
				swiperIndex: null,
				showCollect: false,
				collectHead: null,
				collectName: null,
				collectDesc: null,
				showClipper: false,
				imageUrl: null,
				commentId: 0,
				showComments: false,
				showMenu: false,
				menuData: null,
				showMenu: false,
				showProfileMenu: false,
			}
		},
		onLoad() {

		},
		computed: {
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			}
		},
		methods: {
			...mapMutations(['logout']),
			changeTab(index) {
				this.tabsIndex = index
			},
			changeSwpier(event) {
				this.swiperIndex = event.detail.current
				this.tabsIndex = event.detail.current
			},
			//前往登录
			goLogin() {
				console.log('点击了登录')
				this.$Router.push({
					path: '/pages/user/login',
					animation: {
						animationType: 'slide-in-bottom',
						animationDuration: 200
					},
				})
			},
			createCollect() {
				let emptyField = ''

				if (!this.collectHead) {
					emptyField = '合集头像'
				} else if (!this.collectName) {
					emptyField = '合集名称'
				}

				if (emptyField) {
					uni.showToast({
						title: `请填写${emptyField}后提交`
					})
					return
				}

				this.$http.post('/collections/Create', {
					name: this.collectName,
					img: this.collectHead,
					descrip: this.collectDesc ? this.collectDesc : ''
				}).then(res => {
					if (res.data.code === 200) {
						uni.$emit('createCollect', true)
						this.showCollect = false
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					} else {
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					}
				})
			},
			//个人主页
			goProfile() {
				this.$Router.push({
					path: '/pages/common/userProfile/userProfile',
					query: {
						id: this.userInfo.id
					}
				})
			},
			goVip() {
				this.$Router.push({
					path: '/pages/user/vip',
				})
			},
			goFans() {
				this.$Router.push({
					path: '/pages/user/userFans/userFans',
				})
			},
			goCollect() {
				this.$Router.push({
					path: '/pages/user/collect/collect',
				})
			},
			goSetting() {
				this.$Router.push({
					path: '/pages/user/setting/setting'
				})
			},
			goFavorite() {
				this.$Router.push({
					path: '/pages/user/favorite/favorite'
				})
			},
			goPage(item) {
				switch (item.page) {
					case 'profile':
						this.goProfile()
						break;
					case 'money':
						break;
					case 'VIP':
						this.goVip()
						break;
					case 'focus':
						break;
					case 'favorite':
						this.goFavorite()
						break;
					case 'fans':
						this.goFans()
						break;
					case 'collect':
						this.goCollect()
						break;

					default:
						break;
				}
			},
			imageChoose() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'], //从相册选择
					success: res => {
						this.imageUrl = res.tempFilePaths[0] //交给裁剪去处理
						uni.hideTabBar()
						this.showClipper = true
					}
				})
			},
			showTabbar() {
				uni.showTabBar()
			},
			scanQrcode() {
				uni.scanCode({
					success: function(res) {
						console.log('条码类型：' + res.scanType);
						console.log('条码内容：' + res.result);
					}
				});
			},
			upload() {
				const filePath = this.$isBase64(this.collectHead) ? this.collectHead : 'file://' + plus.io
					.convertLocalFileSystemURL(this.collectHead)
				this.$http.upload('/file/upload', {
					filePath: filePath,
					name: 'file'
				}).then(res => {
					if (res.data.code === 200) {
						this.collectHead = res.data.data
					}
				})
			},
			getComments(id) {
				if (id) {
					this.commentId = id
					this.showComments = true
				}
			},
			showProfile() {
				this.showProfileMenu = true
				uni.hideTabBar()
			},
			getMenuInfo(data) {
				this.showMenu = true
				this.menuData = data
			},

			// logout() {
			// 	console.log('点击了退出')
			// 	uni.clearStorageSync('token')
			// 	uni.clearStorage('userInfo')
			// 	this.isLogin = false
			// 	setTimeout(() => {
			// 		this.$router.go(0)
			// 	}, 200)
			// }
		}
	}
</script>

<style lang="scss">
	.image-wrapper {
		position: relative;
	}

	.image-wrapper::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
	}

	.swiper {
		height: 100%;
	}
</style>