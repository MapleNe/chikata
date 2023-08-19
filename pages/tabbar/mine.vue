<template>
	<z-paging-swiper>
		<template #top>
			<tn-nav-bar alpha customBack :zIndex="5">
				<view slot="right" class="tn-flex tn-flex-col-center tn-margin tn-text-xxl tn-color-white"
					v-if="hasLogin">
					<text class="tn-icon-circle-more" @tap.stop="showProfile()"></text>
				</view>
			</tn-nav-bar>
			<view class="tn-flex tn-flex-direction-column">
				<!-- 头部控件 -->
				<view class="image-wrapper" style="position: relative;">
					<image :src="userInfo.longtext.background_img?userInfo.longtext.background_img:'/static/logo.png'"
						style="height: 500rpx;width: 100%;" mode="aspectFill">
					</image>
				</view>
				<view class="tn-padding-top tn-flex tn-flex-col-center tn-flex-row-between"
					style="position: absolute;top: 380rpx;width: 100%;" v-if="hasLogin">
					<view class="tn-flex tn-flex-col-center tn-color-white tn-flex-row-around tn-flex-basic-sm">
						<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
							<text class="tn-text-bold tn-text-lg">{{userInfo.expand.focusCount}}</text>
							<text>关注</text>
						</view>
						<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
							<text class="tn-text-bold tn-text-lg">{{userInfo.expand.likeCount}}</text>
							<text>喜欢</text>
						</view>
						<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
							<text class="tn-text-bold tn-text-lg">{{userInfo.expand.fansCount}}</text>
							<text>粉丝</text>
						</view>
					</view>

				</view>
				<view class="tn-padding" style="position: absolute;top: 160rpx;width: 100%;">
					<view class="tn-flex tn-flex-col-center">
						<view>
							<tn-avatar :src="userInfo.head_img" size="xl" :border="true" backgroundColor="#f8f7f8"
								borderColor="#ffffff" :borderSize="6" @tap="hasLogin ? goProfile() : goLogin()">
							</tn-avatar>
						</view>

						<view class="tn-flex tn-flex-direction-column tn-flex-1 tn-margin-left">
							<view class="tn-flex tn-flex-col-center">
								<text :class="userInfo.level==='admin'?'ch-color-primary':'tn-color-white'"
									class="tn-text-bold tn-text-xl">{{userInfo.nickname}}</text>
								<text class="tn-text-xl tn-icon-trusty-fill tn-color-white tn-margin-left-xs"></text>
							</view>
							<view class="tn-flex tn-flex-col-center tn-margin-top-sm">
								<text style="color: #c3c3c3;">UID：{{userInfo.id}}</text>
							</view>

						</view>
					</view>
				</view>

				<!-- 控件结束 -->
				<v-tabs v-model="tabsIndex" :tabs="tabs" @change="changeTab" lineHeight="8rpx" lineColor="#29B7CB"
					:zIndex="2" activeColor="#29B7CB" :lineScale="0.2"
					style="position: relative;bottom: 20rpx;border-radius: 20rpx;">
				</v-tabs>
			</view>
		</template>
		<swiper class="swiper" :current="tabsIndex" @change="changeSwpier">
			<swiper-item class="swiper-item">
				<userArticle :tabsIndex="tabsIndex" :swiperIndex="tabsIndex" v-if="hasLogin" @getComments="getComments"
					@getMenuInfo="getMenuInfo">
				</userArticle>
				<view class="tn-flex tn-flex-row-center tn-margin-top-xl" v-else>
					<tn-button size="sm" :plain="true" shape="round" @tap="goLogin">去登录</tn-button>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<view v-if="hasLogin">
					<collectList :tabsIndex="tabsIndex" :swiperIndex="swiperIndex"></collectList>
					<view class="tn-margin" style="position: absolute;right: 0;bottom: 40rpx;"
						@tap.stop="showCollect = true">
						<tn-button shape="icon" backgroundColor="#29B7CB" size="lg" fontColor="tn-color-white">
							<text class="tn-icon-add"></text>
						</tn-button>
					</view>
				</view>
				<view class="tn-flex tn-flex-row-center tn-margin-top-xl" v-else>
					<tn-button size="sm" :plain="true" shape="round" @tap="goLogin">去登录</tn-button>
				</view>
			</swiper-item>
		</swiper>
		<tn-modal v-model="showCollect" :custom="true" :showCloseBtn="true" width="92%" padding="0rpx" :zIndex="5">
			<view class="tn-margin">
				<view class="tn-margin-bottom-lg">
					<text class="tn-text-bold">创建合集</text>
				</view>

				<view class="ch-bg-main tn-color-white tn-flex tn-flex-col-center tn-margin-bottom-sm"
					style="border-radius: 10rpx;position: relative;">
					<view class="tn-padding-xs" @tap.stop="imageChoose">
						<tn-avatar :border="true" borderColor="#fff" :borderSize="6" size="xl"
							:src="collectHead"></tn-avatar>
					</view>
					<view class="tn-flex tn-flex-col-center tn-flex-direction-column tn-flex-1">
						<tn-input :maxLength="18" v-model="collectName" :clearable="false" placeholder="合集名称"
							placeholderStyle="color:white" />
						<tn-input :maxLength="50" v-model="collectDesc" :clearable="false" placeholder="合集介绍"
							placeholderStyle="color:white" />
					</view>
				</view>
				<view class="tn-margin-top">
					<view class="tn-flex tn-flex-row-right" @tap.stop="createCollect">
						<tn-button size="sm" backgroundColor="#29B7CB" fontColor="tn-color-white">创建</tn-button>
					</view>
				</view>
			</view>
		</tn-modal>
		<l-clipper v-if="showClipper" :image-url="imageUrl"
			@success="collectHead = $event.url; upload();showTabbar();showClipper = false"
			@cancel="showTabbar();showClipper = false" :max-width="700" :max-height="700"
			:is-limit-move="true"></l-clipper>
		<tn-popup v-model="showComments" mode="bottom" length="60%" :borderRadius="20" :safeAreaInsetBottom="true">
			<commentList :id="commentId"></commentList>
		</tn-popup>
		<articleMenu :showMenu.sync="showMenu" :data="menuData"></articleMenu>
		<tn-popup mode="right" length="60%" v-model="showProfileMenu" safeAreaInsetBottom @close="showTabbar()">
			<image :src="userInfo.longtext.background_img" mode="aspectFit" style="height: 285rpx;width: 100%;"></image>
			<view class="tn-margin-bottom-sm" v-for="(item,index) in btnList" :key="item.page" @tap.stop="goPage(item)">
				<tn-button>
					<view class="tn-flex tn-flex-col-center" :class="item.page==='logout'?'tn-color-red':''">
						<text :class="item.icon"></text>
						<text class="tn-margin-left-xs">{{item.name}}</text>
					</view>

				</tn-button>
			</view>
			<view class="tn-padding tn-flex tn-flex-row-between" style="position: absolute;bottom: 0;width: 100%;">
				<tn-button shape="icon" backgroundColor="tn-bg-gray--light" size="lg">
					<text class="tn-icon-set tn-text-bold"></text>
				</tn-button>
				<view @tap.stop="scanQrcode()">

				</view>
				<tn-button shape="icon" backgroundColor="tn-bg-gray--light" size="lg">
					<text class="tn-icon-scan tn-text-bold"></text>
				</tn-button>
				<view @tap.stop="logout">
					<tn-button shape="icon" backgroundColor="tn-bg-gray--light" size="lg">
						<text class="tn-icon-logout tn-text-bold tn-color-red"></text>
					</tn-button>
				</view>
			</view>
		</tn-popup>
	</z-paging-swiper>

</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import userArticle from "@/components/userArticle/userArticle.vue";
	import collectList from "@/components/collectList/collectList.vue";
	import articleMenu from "@/components/aticleMenu/aticleMenu.vue";
	export default {
		components: {
			userArticle,
			collectList,
			articleMenu,
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']), //从Store获取全局变量
		},
		data() {
			return {
				content: [],
				tabs: ['动态', '合集'],
				tabsIndex: 0,
				btnList: [{
						name: '个人资料',
						page: 'profile',
						icon: 'tn-icon-my'
					},
					{
						name: '我的会员',
						page: 'VIP',
						icon: 'tn-icon-vip'
					},
					{
						name: '我的钱包',
						page: 'money',
						icon: 'tn-icon-pay'
					},
					{
						name: '我的关注',
						page: 'focus',
						icon: 'tn-icon-flower'
					},
					{
						name: '我的粉丝',
						page: 'fans',
						icon: 'tn-icon-like'
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
					path: '/pages/user/login'
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
					path: '/pages/user/profile',
				})
			},
			goVip() {
				this.$Router.push({
					path: '/pages/user/vip',
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
					case 'fans':
						break
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