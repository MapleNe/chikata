<template>
	<z-paging ref="paging" refresher-only @onRefresh="onRefresh" @scroll="getScroll">
		<template #top>
			<tn-nav-bar backTitle="" :zIndex="11" :backgroundColor="background" :fontColor="!navAuthor?'tn-color-white':''">
				<view class="tn-flex tn-flex-1 tn-flex-col-center tn-flex-row-between" v-show="navAuthor">
					<view class="tn-flex tn-flex-col-center">
						<tn-avatar :src="profile.head_img" border borderColor="#fff" :borderSize="4"></tn-avatar>
						<text class="tn-margin-left-sm">{{profile.nickname}}</text>
					</view>

				</view>
				<view class="tn-flex tn-flex-col-center tn-padding" slot="right">
					<view class="tn-margin-right" v-if="userInfo.id!=id&&profile.expand" v-show="navAuthor">
						<tn-button plain size="sm" padding="0 15rpx" backgroundColor="#29b7cb" fontColor="#29b7cb"
							v-show="profile.expand&&!profile.expand.is_focus" @click="followUser()">
							<view class="tn-flex tn-flex-col-center">
								<text class="tn-icon-add tn-margin-right-xs"></text>
								<text>关注</text>
							</view>
						</tn-button>
						<tn-button size="sm" padding="0 20rpx" backgroundColor="tn-bg-gray--light"
							fontColor="tn-color-gray" @click="followUser()"
							v-show="profile.expand&&profile.expand.is_focus">
							<text>已关注</text>
						</tn-button>
					</view>

					<text class=" tn-text-xl tn-icon-search"></text>
					<text class="tn-text-xl tn-margin-left tn-icon-more-horizontal"
						@tap.stop.prevent="showManage =!showManage" v-if="!hasLogin&&userInfo.id!=id">
					</text>
				</view>
			</tn-nav-bar>
		</template>
		<view style="position: relative;" id="userview">
			<view v-if="profile.longtext">
				<image :src="profile.longtext.background_img?profile.longtext.background_img:profile.head_img"
					mode="aspectFill" style="width: 100%;height: 420rpx;">
				</image>
			</view>
			<!-- 第一层 -->
			<view class="tn-bg-white tn-padding"
				style="position: absolute;top:320rpx;width: 100%; border-radius: 45rpx 45rpx 0 0">
				<view style="position: absolute;top: -70rpx;" class="tn-margin-left-sm">
					<tn-avatar :src="profile.head_img" size="xxl" border borderColor="#fff" :borderSize="6"></tn-avatar>
				</view>
				<!-- 按钮样式 -->
				<view class="tn-flex tn-flex-row-right">
					<view v-if="hasLogin&&userInfo.id == id">
						<tn-button plain backgroundColor="#29b7cb" fontColor="#29b7cb" @click="goEdit">编辑</tn-button>
					</view>
					<view class="tn-flex tn-flex-col-center" v-else>
						<view class="tn-margin-right">
							<tn-button plain backgroundColor="#29b7cb" fontColor="#29b7cb"
								@click="goChat()">私信</tn-button>
						</view>
						<view>
							<tn-button :backgroundColor="profile.expand&&profile.expand.is_focus?'#29b7cb69':'#29b7cb'"
								:fontColor="profile.expand&&profile.expand.is_focus?'#29b7cb':'tn-color-white'"
								padding="0 50rpx"
								@click="profile.expand&&profile.expand.is_focus?showCancelFollow = true:followUser()">
								<text style="width:100rpx">{{profile.expand&&profile.expand.is_focus?'已关注':'关注'}}</text>
							</tn-button>
						</view>
					</view>
				</view>
			</view>
			<!-- 第二层 在这里绘制元素 -->
			<view class="tn-margin">
				<!-- 用户属性 -->
				<view class="tn-margin-top">
					<view class="tn-flex tn-flex-direction-column">
						<view class="tn-flex">
							<text class="tn-text-bold tn-text-xxl">{{profile.nickname}}</text>
							<text class="level tn-margin-left-sm level-text" :class="['lv-'+profile.grade]"
								:style="{'color':level[profile.grade]}"></text>
						</view>
						<view class="tn-flex tn-margin-top tn-flex-top tn-color-gray--dark">
							<text class="tn-icon-image-text"></text>
							<text class="tn-margin-left-xs"
								style="word-break: break-all;">{{profile.description}}</text>
						</view>
					</view>
				</view>
				<view class="tn-margin-top tn-margin-bottom-lg tn-flex">
					<view class="tn-flex tn-flex-col-center tn-text-sm tn-flex-basic-md tn-flex-row-between">
						<view class="tn-flex tn-flex-col-center ">
							<text
								class="tn-text-bold tn-text-xxl tn-margin-right-xs">{{profile.expand&&profile.expand.fansCount}}</text>
							<text class="tn-color-gray--dark">粉丝</text>
						</view>
						<view class="tn-flex tn-flex-col-center ">
							<text
								class="tn-text-bold tn-text-xxl tn-margin-right-xs">{{profile.expand&&profile.expand.focusCount}}</text>
							<text class="tn-color-gray--dark">关注</text>
						</view>
						<view class="tn-flex tn-flex-col-center ">
							<text
								class="tn-text-bold tn-text-xxl tn-margin-right-xs">{{profile.expand&&profile.expand.likeCount}}</text>
							<text class="tn-color-gray--dark">获赞</text>
						</view>
					</view>
				</view>
			</view>
			<view class="tn-padding-xs tn-bg-gray--light"></view>
		</view>
		<!-- 定位结束 -->
		<view :style="{'z-index': 100,'position': 'sticky','top' :vuex_custom_bar_height+'px'}">
			<z-tabs ref="tabs" :current="tabsIndex" active-color="#29b7cb" @change="changeTab" :list="tabs"></z-tabs>
		</view>
		<swiper :current="tabsIndex" @transition="swiperTransition" @animationfinish="swiperAnimationfinish"
			class="swiper">
			<swiper-item>
				<z-paging @query="getUserArticle" v-model="content" ref="article" :auto-clean-list-when-reload="false"
					:auto-scroll-to-top-when-reload="false" use-cache :cache-key="`article_${id}`" :refresher-enabled="false" :use-page-scroll="swiperAction">
					<block v-for="(item,index) in content" :key="index">
						<view class="tn-margin">
							<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-color-gray tn-text-sm">
								<view class="tn-flex tn-flex-col-bottom">
									<text
										class="tn-text-bold tn-color-gray tn-text-xxl">{{getDate(item.create_time).day}}</text>
									<text
										class="tn-margin-left-xs">{{getDate(item.create_time).month}}月/{{getDate(item.create_time).year}}年</text>
									<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
									<text
										v-if="item.expand.sort&&item.expand.sort.length>0">{{item.expand.sort[0].name}}</text>
								</view>
								<view>
									<text class="tn-icon-more-horizontal tn-text-xxl"></text>
								</view>
							</view>
							<view class="tn-margin-top-xs">
								<view @tap="goArticle(item)">
									<view>
										<text class="tn-text-xl">{{item.title}}</text>
									</view>
									<view class="tn-margin-top-xs tn-color-gray--dark tn-margin-bottom-sm">
										<rich-text :nodes="item.description"></rich-text>
									</view>

									<!-- 单张图片 -->
									<view v-if="item.expand.images.length===1">
										<image v-for="(images,subIndex) in item.expand.images" :key="subIndex"
											:src="images.src" mode="aspectFill"
											style="height: 400rpx;width: 400rpx;border-radius:10rpx;"
											@tap.stop="previewImage(item.expand.images,subIndex)">
										</image>
									</view>
									<!-- 单张结束 -->
									<!-- 复数开始 -->
									<view v-if="item.expand.images.length===2 || item.expand.images.length===4">
										<tn-grid align="left" :col="item.expand.images.length" hoverClass="none">
											<block v-for="(images, subIndex) in item.expand.images" :key="subIndex">
												<!-- H5 -->
												<!-- #ifndef MP-WEIXIN -->
												<tn-grid-item
													style="height: 256rpx;width: 256rpx;margin-right: 6rpx;margin-bottom: 6rpx;">
													<image :src="images.src" mode="aspectFill"
														style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
														@tap.stop="previewImage(item.expand.images,subIndex)">
													</image>
												</tn-grid-item>
												<!-- #endif-->
												<!-- 微信小程序 -->
												<!-- #ifdef MP-WEIXIN -->
												<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
													style="margin-right: 6rpx;margin-bottom: 6rpx;">
													<image :src="images.src" mode="aspectFill"
														style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
														@tap.stop="previewImage(item.expand.images,subIndex)">
													</image>
												</tn-grid-item>
												<!-- #endif-->
											</block>
										</tn-grid>
									</view>
									<view v-if="item.expand.images.length===3|| item.expand.images.length>4">
										<tn-grid align="left" :col="3" hoverClass="none">
											<block v-for="(images, subIndex) in item.expand.images" :key="subIndex"
												v-if="subIndex<9">
												<!-- H5 -->
												<!-- #ifndef MP-WEIXIN -->
												<tn-grid-item
													style="height: 220rpx;width: 220rpx;margin-right: 6rpx;margin-bottom: 6rpx">
													<image :src="images.src" mode="aspectFill"
														style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
														@tap.stop="previewImage(item.expand.images,subIndex)">
													</image>
												</tn-grid-item>
												<!-- #endif-->
												<!-- 微信小程序 -->
												<!-- #ifdef MP-WEIXIN -->
												<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
													style="margin-right: 6rpx;margin-bottom: 6rpx">
													<image :src="images.src" mode="aspectFill"
														style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
														@tap.stop="previewImage(item.expand.images,subIndex)">
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
											<view class="tn-flex tn-flex-col-center" @tap.stop="likeAction(index)">
												<text class="tn-text-xxl"
													:class="item.expand.like.is_like?'ch-color-primary tn-icon-praise-fill':'tn-icon-praise'"></text>
												<text class="tn-margin-left-xs">{{item.expand.like.likes_count}}</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
						<view class="tn-padding-xs tn-bg-gray--light">

						</view>
					</block>
				</z-paging>

			</swiper-item>
			<swiper-item>
				<z-paging @query="getComments" v-model="comments" ref="comments" :auto-clean-list-when-reload="false"
					:auto-scroll-to-top-when-reload="false" use-cache :cache-key="`comments_${id}`" :refresher-enabled="false" :use-page-scroll="swiperAction">
					<view class="tn-margin">
						<block v-for="(item,index) in comments" :key="index">
							<view class="tn-margin-bottom-sm">
								<view class="tn-flex tn-flex-col-center tn-color-gray tn-text-sm">

									<text
										class="tn-text-bold tn-color-gray tn-text-xxl">{{getDate(item.create_time).isToday?getDate(item.create_time).hourDifference:getDate(item.create_time).day}}</text>
									<text v-if="getDate(item.create_time).isToday" class="tn-margin-left-xs">小时前</text>
									<text v-else
										class="tn-margin-left-xs">{{getDate(item.create_time).month}}月/{{getDate(item.create_time).year}}年</text>
									<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
									<text>{{item.article_title}}</text>
								</view>
								<view class="tn-margin-top-sm">
									<mp-html :preview-img="false" :content="item.content"></mp-html>
								</view>
								<view class="tn-margin-top-sm tn-margin-bottom-sm">
									<view class="tn-bg-gray--light tn-color-gray--dark tn-padding-sm"
										@tap.stop.prevent="goArticle(item)">
										<view class="tn-text-ellipsis-2">
											<text>{{!item.pid?'回复帖子：':'回复评论：'}}</text>
											<text>{{!item.pid?item.article_title:item.up_comment}}</text>
										</view>
									</view>
								</view>
								<view class="tn-border-solid tn-border-gray--light tn-margin-bottom-sm"></view>
							</view>
						</block>
					</view>
				</z-paging>

			</swiper-item>
			<swiper-item>
				<z-paging ref="favorite" @query="getFavorite" v-model="favorite" :auto-clean-list-when-reload="false"
					:auto-scroll-to-top-when-reload="false" use-cache :cache-key="`favorite_${id}`" :refresher-enabled="false" :use-page-scroll="swiperAction">
					<block v-for="(item,index) in favorite">
						<view class="tn-margin">
							<view class="tn-flex tn-flex-col-center tn-flex-row-between">
								<view class="tn-flex tn-flex-col-center">
									<tn-avatar :src="item.expand.author.head_img"
										@tap="goUserProfile(index)"></tn-avatar>
									<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
											<text v-if="item.expand.author.level==='admin'"
												class="tn-margin-left-xs tn-color-blue tn-icon-trusty-fill"></text>
										</view>
										<view class="tn-flex tn-flex-col-center tn-text-sm tn-color-gray--dark">
											<text>{{getDateDiff(item.create_time)}}</text>
											<view class="tn-flex tn-flex-col-center">
												<text class="tn-margin-right-xs tn-margin-left-xs">·</text>
												<text
													v-if="item.expand.sort&&item.expand.sort.length>0">{{item.expand.sort[0].name}}</text>
											</view>
										</view>
									</view>
								</view>

							</view>
							<view @tap="goArticle(item)">
								<view class="tn-margin-top">
									<text class="tn-text-title">{{item.title}}</text>
								</view>
								<view class="tn-padding-sm tn-no-padding-left tn-color-gray--dark tn-padding-bottom-sm">
									<rich-text :nodes="item.description"></rich-text>
								</view>

								<!-- 单张图片 -->
								<view v-if="item.expand.images.length===1" style="height: 350rpx;width: 100%;">
									<image :src="item.expand.images[0].src" mode="aspectFill"
										style="height: 350rpx; width: 100%;border-radius:10rpx;"
										@tap.stop="previewImage(item.expand.images,index)">
									</image>

								</view>
								<!-- 单张结束 -->
								<!-- 点赞控件 -->
								<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top">
									<!-- 只取第一个tag -->
									<view v-if="item.expand.tag.length>0">
										<view
											class="tn-bg-grey--light tn-text-sm tn-color-gray--dark tn-margin-right-sm tn-padding-xs"
											style="border-radius: 10rpx;">
											<text>{{item.expand.tag[0].name}}</text>
										</view>
									</view>
									<view
										class="tn-flex tn-text-sm tn-flex-col-center tn-color-grey--disabled tn-flex-basic-sm tn-flex-row-between"
										style="margin-left: auto;">
										<view class="tn-flex tn-flex-col-bottom">
											<text class="tn-text-xxl tn-icon-eye "></text>
											<text class="tn-margin-left-xs">{{item.views}}</text>
										</view>
										<view class="tn-flex tn-flex-col-bottom" @tap.stop="showComments(index)">
											<text class="tn-text-xxl tn-icon-comment"></text>
											<text class="tn-margin-left-xs">{{item.expand.comments.count}}</text>
										</view>
										<view class="tn-flex tn-flex-col-bottom" @tap.stop="likeAction(index)">
											<text class="tn-text-xxl"
												:class="item.expand.like.is_like?'ch-color-primary tn-icon-praise-fill':'tn-icon-praise'"></text>
											<text class="tn-margin-left-xs">{{item.expand.like.likes_count}}</text>
										</view>
									</view>
								</view>

							</view>
						</view>

						</view>
						<!-- 间隔开始 -->
						<view class="tn-bg-gray--light tn-padding-xs"></view>
					</block>
				</z-paging>
			</swiper-item>
		</swiper>
		<tn-popup mode="bottom" v-model="showManage" :borderRadius="30">
			<view class="tn-margin">
				<view class="tn-text-bold">
					<text>管理</text>
				</view>
				<view class="tn-margin-top">
					<view class="tn-flex tn-color-gray--dark">
						<view class="tn-flex tn-flex-col-center tn-flex-direction-column">
							<text class="tn-icon-like-break tn-text-xxl tn-round tn-bg-gray--light tn-padding"></text>
							<text class="tn-text-lg tn-margin-top-sm">拉黑</text>
						</view>
					</view>
				</view>
			</view>
			<view class="tn-margin-top">
				<view class="tn-bg-gray--light tn-padding tn-text-center">
					<text class="tn-text-bold">取消</text>
				</view>
			</view>
		</tn-popup>
		<tn-popup mode="center" :borderRadius="20" v-model="showCancelFollow" length="80%">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
					<text>取消关注</text>
					<text class="tn-padding-sm tn-color-gray--dark" style="font-size: 28rpx;">点击“确定”则取消关注该用户</text>
				</view>
			</view>
			<view class="tn-padding tn-color-gray--dark tn-bg-gray--light">
				<view class="tn-flex tn-flex-row-around" style="font-size: 28rpx;">
					<text @tap.stop.prevent="showCancelFollow = false">取消</text>
					<text class="tn-color-grey--light">|</text>
					<text class="ch-color-primary" @tap.stop.prevent="followUser();showCancelFollow = false">确定</text>
				</view>
			</view>
		</tn-popup>
	</z-paging>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		props: {
			users_id: {
				type: [Number, String],
				default: 0,
			},
			article_id: {
				type: [Number, String],
				default: 0,
			},
		},
		name: 'userProfile',
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
						is_focus: 0,
					},
					longtext: {
						background_img: ''
					}
				},
				commentId: null,
				showCommentsBox: false,
				background: 'rgba(255,255,255,0)',
				swiperHeight: 1080,
				comments: [],
				favorite: [],
				pageMethod: 'paging',
				userviewHeight: 328,
				navAuthor: false,
				swiperAction: true,
				showManage: false,
				showCancelFollow: false,
			}
		},
		computed: {
			...mapState(['userInfo', 'hasLogin']),
		},
		onLoad(params) {
			this.id = params.id
			if (this.id) {
				this.getUserInfo()
			}
		},
		created() {
			if (this.users_id) {
				this.id = this.users_id
				this.getUserInfo()
			}
		},
		onReady() {
			if (this.users_id) {
				this.id = this.users_id
				this.getUserInfo()
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
			getComments(page, num) {
				this.$http.get('/comments/user', {
					params: {
						page: page,
						limit: num,
						type: 'icomment',
						uid: this.id
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.comments.complete(res.data.data)
					}
				})
			},
			getFavorite(page, num) {
				this.$http.get('/favorites/lookup', {
					params: {
						page: page,
						limit: num,
						uid: this.id
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.favorite.complete(res.data.data.article)
					}
				})
			},
			getUserArticle(page, num) {
				this.$http.get('/article/sql', {
					params: {
						limit: num,
						page: page,
						where: `users_id = ${this.id}`
					}
				}).then(res => {
					this.$refs.article.completeByTotal(res.data.data.data, res.data.data.count)

				}).catch(err => {
					this.$refs.article.complete(false)
				})
			},
			getUserInfo() {
				this.$http.get('/users/one', {
					params: {
						id: this.id ? this.id : this.users_id
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.profile = res.data.data
					}
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

			goArticle(item) {
				if (item.article_id ? item.article_id : item.id == this.article_id) {
					this.$emit('goArticle', true)
					return
				}

				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: item.article_id ? item.article_id : item.id,
						users_id: item.users_id
					},
				})
			},
			// 私信
			goChat() {
				this.$Router.push({
					path: '/pages/common/chat/chat',
					query: {
						users_id: this.profile.id,
						nickname: this.profile.nickname,
						head_img: this.profile.head_img
					}
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
			// 下拉刷新被触发
			onRefresh() {
				switch (this.tabsIndex) {
					case 0:
						this.$refs.article.reload()
						break;
					case 1:
						this.$refs.comments.reload()
						break;
					case 2:
						this.$refs.favorite.reload()
						break;
					default:
						break;
				}
				// 告知z-paging下拉刷新结束，这样才可以开始下一次的下拉刷新
				setTimeout(() => {
					//0.5秒之后停止刷新动画
					this.$refs.paging.complete();
				}, 500)
			},
			getScroll(e) {
				const scrollTop = e.detail.scrollTop;
				if (scrollTop > 150) this.navAuthor = true
				else this.navAuthor = false
				if (scrollTop > this.userviewHeight) this.swiperAction = false
				else this.swiperAction = true
				// 计算当前透明度
				const opacity = scrollTop <= 200 ? scrollTop / 200 : 1; // 根据透明度设置导航栏背景颜色
				this.background = `rgba(255, 255, 255, ${opacity})`;
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
							this.profile.expand.is_focus = !this.profile.expand.is_focus
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
				const dateParts = dateString.split(" ");
				const date = dateParts[0];
				const time = dateParts[1].split(":");

				const datePartsArray = date.split("-");
				const year = parseInt(datePartsArray[0]);
				const month = parseInt(datePartsArray[1]);
				const day = parseInt(datePartsArray[2]);
				const hour = parseInt(time[0]);

				const currentDate = new Date();
				const differenceInMilliseconds = currentDate.getTime() - new Date(year, month - 1, day, hour).getTime();
				const differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));

				const isToday = currentDate.getFullYear() === year && currentDate.getMonth() === month - 1 && currentDate
					.getDate() === day;

				return {
					year,
					month,
					day,
					hour,
					hourDifference: differenceInHours,
					isToday
				};
			},
			goEdit() {
				this.$emit('edit', true)
				this.$Router.push({
					path: '/pages/user/profile'
				})
			},
			changeTab(index) {
				this.tabsIndex = index
			},
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.tabsIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
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
			getDateDiff(data) {
				// 传进来的data必须是日期格式，不能是时间戳
				//var str = data;
				//将字符串转换成时间格式
				var timePublish = new Date(data);
				var timeNow = new Date();
				var minute = 1000 * 60;
				var hour = minute * 60;
				var day = hour * 24;
				var month = day * 30;
				var result = "";
				var diffValue = timeNow - timePublish;
				var diffMonth = diffValue / month;
				var diffWeek = diffValue / (7 * day);
				var diffDay = diffValue / day;
				var diffHour = diffValue / hour;
				var diffMinute = diffValue / minute;

				// console.log('diffValue：'+diffValue+' ' +'diffMonth：'+diffMonth+' ' +'diffWeek：'+diffWeek+' ' +'diffDay：'+diffDay+' ' +'diffHour：'+diffHour+' ' +'diffMinute：'+diffMinute);

				if (diffValue < 0) {} else if (diffMonth > 3) {
					result = timePublish.getFullYear() + "-";
					result += timePublish.getMonth() + "-";
					result += timePublish.getDate();
				} else if (diffMonth > 1) {
					result = parseInt(diffMonth) + "月前";
				} else if (diffWeek > 1) {
					result = parseInt(diffWeek) + "周前";
				} else if (diffDay > 1) {
					result = parseInt(diffDay) + "天前";
				} else if (diffHour > 1) {
					result = parseInt(diffHour) + "小时前";
				} else if (diffMinute > 1) {
					result = parseInt(diffMinute) + "分钟前";
				} else {
					result = "刚刚";
				}
				return result;
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
		height: 100vh;
	}

	.topfixed-active {
		width: 100%;
		padding: 0 25upx;
		position: fixed;
		top: var(--window-top);
		/* 顶部导航栏位置 */
		/* top: calc(9.3vh + var(--window-top)); */
		/* 顶部导航栏还有其他盒子 使用  */
		left: 0;
		background: #fff;
		z-index: 9;
		box-sizing: border-box;
	}

	.tagTop {
		height: 80upx;
		line-height: 80upx;
		background-color: #eeeeee;
		text-align: center;
	}

	.paTop80 {
		padding-top: 80upx;
	}
</style>