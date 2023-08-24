<template>
	<z-paging ref="paging" v-model="content" @query="getUserArticle">
		<template #top>
			<tn-nav-bar backTitle="" alpha>
				<view class="tn-flex tn-flex-1 tn-flex-col-center tn-flex-row-between" v-show="navAuthor">
					<view class="tn-flex tn-flex-col-center">
						<tn-avatar :src="profile.head_img"></tn-avatar>
						<text class="tn-margin-left-sm">{{profile.nickname}}</text>
					</view>

					<view>
						<tn-button plain size="sm" padding="0 15rpx" backgroundColor="#29B7CB" fontColor="#29B7CB"
							v-if="!profile.focus" @click="followUser()">
							<view class="tn-flex tn-flex-col-center">
								<text class="tn-icon-add tn-margin-right-xs"></text>
								<text>关注</text>
							</view>
						</tn-button>
						<tn-button size="sm" padding="0 20rpx" backgroundColor="tn-bg-gray--light"
							fontColor="tn-color-gray" @click="followUser()" v-else>
							<text>已关注</text>
						</tn-button>
					</view>
				</view>
				<view class="tn-flex tn-flex-col-center tn-padding" slot="right">
					<text class=" tn-text-xl tn-icon-search tn-margin-right"></text>
					<text class="tn-text-xl tn-icon-more-vertical">
					</text>
				</view>
			</tn-nav-bar>
		</template>
		<view style="position: relative;">
			<image :src="profile.longtext.background_img" mode="aspectFill" style="width: 100%;height: 400rpx;"></image>
			<!-- 第一层 -->
			<view class="tn-bg-white tn-padding"
				style="position: absolute;top:300rpx;width: 100%; border-radius: 45rpx 45rpx 0 0">
				<view style="position: absolute;top: -70rpx;" class="tn-margin-left-sm">
					<tn-avatar :src="profile.head_img" size="xl" border borderColor="#fff" :borderSize="6"></tn-avatar>
				</view>
				<!-- 按钮样式 -->
				<view class="tn-flex tn-flex-row-right">
					<view class="tn-flex tn-flex-col-center">
						<view class="tn-margin-right">
							<tn-button plain backgroundColor="#29B7CB" fontColor="#29B7CB">私信</tn-button>
						</view>
						<view>
							<tn-button backgroundColor="#29B7CB" fontColor="tn-color-white">
								<view class="tn-flex tn-flex-col-center tn-flex-row-between" style="width: 150rpx;">
									<text class="tn-text-center" style="margin-left: auto;margin-right: auto;">关注</text>
									<text class="tn-icon-up-triangle"></text>
								</view>
							</tn-button>
						</view>
					</view>
				</view>

			</view>
			<!-- 第二层 在这里绘制元素 -->
			<view class="tn-margin">
				<!-- 用户属性 -->
				<view class="tn-margin-top-lg">
					<view class="tn-flex tn-flex-direction-column">
						<text class="tn-text-bold tn-text-xl">{{profile.nickname}}</text>
						<view class="tn-flex tn-margin-top tn-flex-top tn-color-gray--dark">
							<text class="tn-icon-image-text tn-margin-right-xs"></text>
							<text class="tn-text-ellipsis-2" style="max-width: 50%;">{{profile.description}}</text>
						</view>
					</view>
				</view>
				<view class="tn-margin-top-xl tn-margin-bottom-lg">
					<view class="tn-flex tn-flex-col-center">
						<view class="tn-flex tn-flex-col-center tn-margin-right">
							<text class="tn-text-bold tn-text-xl tn-margin-right-xs">{{profile.expand.fansCount}}</text>
							<text class="tn-color-grey--disabled">粉丝</text>
						</view>
						<view class="tn-flex tn-flex-col-center tn-margin-right">
							<text
								class="tn-text-bold tn-text-xl tn-margin-right-xs">{{profile.expand.focusCount}}</text>
							<text class="tn-color-grey--disabled">关注</text>
						</view>
						<view class="tn-flex tn-flex-col-center tn-margin-right">
							<text class="tn-text-bold tn-text-xl tn-margin-right-xs">{{profile.expand.likeCount}}</text>
							<text class="tn-color-grey--disabled">获赞</text>
						</view>
					</view>
				</view>
			</view>
			<view class="tn-padding-xs tn-bg-gray--light"></view>
		</view>
		<!-- 定位结束 -->
		<v-tabs v-model="tabsIndex" :tabs="tabs" @change="changeTab" lineHeight="8rpx" lineColor="#29B7CB"
			activeColor="#29B7CB" :lineScale="0.2" color="#AAA" :scroll="false"></v-tabs>
		<swiper :current="tabsIndex" @animationfinish="swiperChange" :style="[{height: swiperHeight+ 'px'}]">
			<swiper-item>
				<view id="article">
					<block v-for="(item,index) in content" :key="index">
						<view class="tn-margin">
							<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-color-gray tn-text-xs">
								<view class="tn-flex tn-flex-col-center">
									<text
										class="tn-text-bold tn-color-gray tn-text-xl">{{getDate(item.create_time).day}}</text>
									<text
										class="tn-margin-left-xs">{{getDate(item.create_time).month}}月/{{getDate(item.create_time).year}}年</text>
									<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
									<text>{{item.expand.sort[0].name}}</text>
								</view>
								<view>
									<text class="tn-icon-more-horizontal tn-text-lg"></text>
								</view>
							</view>
							<view class="tn-margin-top-xs">
								<view @tap="goAticle(index)">
									<view>
										<text class="tn-text-bold tn-text-lg">{{item.title}}</text>
									</view>
									<view class="tn-margin-top-xs tn-color-gray--dark tn-margin-bottom-sm">
										<rich-text :nodes="item.description"></rich-text>
									</view>

									<!-- 单张图片 -->
									<view v-if="item.expand.images.length===1">
										<image v-for="(images,index) in item.expand.images" :key="index"
											:src="images.src" mode="aspectFill"
											style="height: 400rpx;width: 400rpx;border-radius:10rpx;"
											@tap.stop="previewImage(item.expand.images,index)">
										</image>
									</view>
									<!-- 单张结束 -->
									<!-- 复数开始 -->
									<view v-if="item.expand.images.length===2 || item.expand.images.length===4">
										<tn-grid align="left" :col="item.expand.images.length" hoverClass="none">
											<block v-for="(images, index) in item.expand.images" :key="index">
												<!-- H5 -->
												<!-- #ifndef MP-WEIXIN -->
												<tn-grid-item
													style="height: 256rpx;width: 256rpx;margin-right: 6rpx;margin-bottom: 6rpx;">
													<image :src="images.src" mode="aspectFill"
														style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
														@tap.stop="previewImage(item.expand.images,index)">
													</image>
												</tn-grid-item>
												<!-- #endif-->

												<!-- 微信小程序 -->
												<!-- #ifdef MP-WEIXIN -->
												<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
													style="margin-right: 6rpx;margin-bottom: 6rpx;">
													<image :src="images.src" mode="aspectFill"
														style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
														@tap.stop="previewImage(item.expand.images,index)">
													</image>
												</tn-grid-item>
												<!-- #endif-->
											</block>
										</tn-grid>
									</view>
									<view v-if="item.expand.images.length===3|| item.expand.images.length>4">
										<tn-grid align="left" :col="3" hoverClass="none">
											<block v-for="(images, index) in item.expand.images" :key="index"
												v-if="index<9">
												<!-- H5 -->
												<!-- #ifndef MP-WEIXIN -->
												<tn-grid-item
													style="height: 220rpx;width: 220rpx;margin-right: 6rpx;margin-bottom: 6rpx">
													<image :src="images.src" mode="aspectFill"
														style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
														@tap.stop="previewImage(item.expand.images,index)">
													</image>
												</tn-grid-item>
												<!-- #endif-->

												<!-- 微信小程序 -->
												<!-- #ifdef MP-WEIXIN -->
												<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
													style="margin-right: 6rpx;margin-bottom: 6rpx">
													<image :src="images.src" mode="aspectFill"
														style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
														@tap.stop="previewImage(item.expand.images,index)">
													</image>
												</tn-grid-item>
												<!-- #endif-->
											</block>
										</tn-grid>
									</view>
									<!-- 点赞控件 -->
									<view>
										<view class="tn-flex tn-flex-col-center tn-flex-wrap tn-margin-top">
											<view v-for="tags in item.expand.tag" :key="tags.id"
												class="tn-bg-grey--light tn-text-sm tn-color-gray--dark tn-margin-right-sm tn-margin-bottom-sm tn-padding-xs"
												style="border-radius: 10rpx;">
												<text>{{tags.name}}</text>
											</view>
										</view>
										<view
											class="tn-flex  tn-flex-col-center tn-color-gray tn-flex-basic-sm tn-flex-row-around">
											<view class="tn-flex tn-flex-col-center">
												<text class="tn-text-xxl tn-icon-share-square "></text>
												<text class="tn-margin-left-xs">{{item.views}}</text>
											</view>
											<view class="tn-flex tn-flex-col-center" @tap.stop="showComments(index)">
												<text class="tn-text-xxl tn-icon-comment"></text>
												<text class="tn-margin-left-xs">{{item.expand.comments.count}}</text>
											</view>
											<view class="tn-flex tn-flex-col-center"
												:class="item.expand.like.is_like?'tn-color-red':''"
												@tap.stop="likeAction(index)">
												<text class="tn-text-xxl"
													:class="item.expand.like.is_like?' tn-icon-praise-fill':'tn-icon-praise'"></text>
												<text class="tn-margin-left-xs">{{item.expand.like.likes_count}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
			</swiper-item>
		</swiper>

	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				content: [],
				tabs: ['帖子', '评论', '收藏'],
				id: null,
				loading: true,
				skeleton: [
					'circle+line-sm*2',
					'line-sm*3',
					'card-lg',
					'circle-sm+line-sm'
				],
				tabsIndex: 0,
				profile: {
					expand: {
						focusCount: 0,
						fansCount: 0,
						likeCount: 0,
					},
					longtext: {
						background_img: ''
					}
				},
				commentId: null,
				showCommentsBox: false,
				background: 'rgba(255,255,255,0)',
				swiperHeight: 1080,
				navAuthor: false,
				date: null,
			}
		},
		onPageScroll(e) {
			console.log(e)

		},
		onLoad(params) {
			this.id = params.id
			this.getUserInfo()

		},
		// onReady() {
		// 	setTimeout(() => {
		// 		this.getElementHeight('#user')
		// 	}, 500)
		// },
		created() {

		},

		computed: {
			dates() {
				return this.data.map(item => this.getDate(item.date));
			}
		},

		methods: {
			getElementHeight(element) {
				let query = uni.createSelectorQuery().in(this);
				query.select(element).boundingClientRect(data => {
					console.log(data.height);
					this.swiperHeight = data.height + 50;
				}).exec()
			},
			getUserArticle(page, num) {
				this.$http.get('/article/sql', {
					params: {
						limit: num,
						page: page,
						where: `users_id = ${this.id}`
					}
				}).then(res => {
					console.log(res)
					this.$refs.paging.complete(res.data.data.data)

					setTimeout(() => {
						this.loading = false
						this.$nextTick(() => {
							this.getElementHeight('#article')
						})
					}, 10)
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			getUserInfo() {
				this.$http.get('/users/one', {
					params: {
						id: this.id
					}

				}).then(res => {
					console.log(res)
					this.profile = res.data.data
				}).catch(err => {

				})
			},
			getCurrentSwiperHeight(element) {
				const query = uni.createSelectorQuery().in(this);
				query.select(element).boundingClientRect(data => {
					console.log(data)
				}).exec();
			},
			likeAction(index) {
				this.$http.put('/Article-like/Record', {
					article_id: this.content[index].id
				}).then(res => {
					if (res.data.code === 200) {
						this.content[index].expand.like.is_like = !this.content[index].expand.like.is_like
						if (this.content[index].expand.like.is_like) {
							this.content[index].expand.like.likes_count++
						} else {
							this.content[index].expand.like.likes_count--
						}
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					} else {
						if (res.data.code === 403) {
							uni.showToast({
								icon: 'none',
								title: '令牌失效请重新登录'
							})
						}
					}
				}).catch(err => {

				})
			},
			showComments(index) {
				this.commentId = this.content[index].id
				this.showCommentsBox = !this.showCommentsBox
			},
			getMenuInfo(data) {
				this.$emit('getMenuInfo', data)
			},
			goAticle(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.content[index].id
					},
				})
			},
			goUserProfile(index) {
				this.$Router.push({
					path: '/pages/common/userProfile/userProfile',
					query: {
						id: this.content[index].users_id
					}
				})
			},
			clickSwiper(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.swiperList[index].opt.article_id
					},
				})
			},
			getScroll(e) {
				console.log(e)
				this.$refs.paging.updatePageScrollTop(e.detail.scrollTop)
			},
			goCategory(category) {
				this.$Router.push({
					path: '/pages/common/category/category',
					query: {
						id: category.id
					}
				})
			},
			followUser() {
				this.$http.put('/Focus/Record', {
					userId: this.id
				}).then(res => {
					switch (res.data.code) {
						case 200:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							this.$refs.paging.reload()
							break;
						case 400:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							break;
						default:
							// 处理其他情况
							break;
					}
				});
			},
			getDate(dateString) {
				const dateParts = dateString.split(" ")[0].split("-");
				const year = parseInt(dateParts[0]);
				const month = parseInt(dateParts[1]);
				const day = parseInt(dateParts[2]);
				return {
					year,
					month,
					day
				};
			},
			changeTab(index) {
				this.tabsIndex = index
			},
			swiperChange(e) {
				this.tabsIndex = e.detail.current
				this.getCurrentSwiperHeight('.swiper-item-content');
			},
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
		background: linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
	}

	.swiper {
		height: 100%;
	}
</style>