<template>
	<z-paging ref="paging" @query="getUserArticle" v-model="content">
		<template #top>
			<tn-nav-bar alpha></tn-nav-bar>
		</template>
		<view class="image-wrapper" style="position: relative;">
			<image :src="profile.longtext.background_img?profile.longtext.background_img:'/static/logo.png'"
				style="height: 500rpx;width: 100%;" mode="aspectFill">
			</image>
		</view>
		<view class="tn-padding tn-flex tn-flex-col-center tn-flex-row-between"
			style="position: absolute;top: 380rpx;width: 100%;">
			<view class="tn-flex tn-flex-col-center tn-color-white tn-flex-row-around tn-flex-basic-sm">
				<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
					<text class="tn-text-bold tn-text-lg">{{profile.expand.focusCount}}</text>
					<text>关注</text>
				</view>
				<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
					<text class="tn-text-bold tn-text-lg">{{profile.expand.likeCount}}</text>
					<text>喜欢</text>
				</view>
				<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
					<text class="tn-text-bold tn-text-lg">{{profile.expand.fansCount}}</text>
					<text>粉丝</text>
				</view>
			</view>
		</view>
		<view class="tn-padding" style="position: absolute;top: 100rpx;width: 100%;">
			<view class="tn-flex tn-flex-col-center">
				<tn-avatar :src="profile.head_img" size="xl" :border="true" backgroundColor="#f8f7f8"
					borderColor="#ffffff" :borderSize="6" @tap="hasLogin ? goProfile() : goLogin()">
				</tn-avatar>
				<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-flex-1 tn-margin-left-sm">
					<view class="tn-flex tn-flex-col-center">
						<text :class="profile.level==='admin'?'ch-color-primary':'tn-color-white'"
							class="tn-text-bold tn-text-xl">{{profile.nickname}}</text>
					</view>
					<view>
						<tn-button size="sm" :backgroundColor="profile.expand.focus?'tn-bg-gray--light':'#29B7CB'"
							:fontColor="profile.expand.focus?'tn-color-grey':'tn-color-white'" shape="round"
							:blockRepeatClick="true" @tap="followUser()">
							<text>{{profile.expand.focus?'已关注':'关注'}}</text>
						</tn-button>
					</view>
				</view>
			</view>
		</view>
		<v-tabs v-model="tabsIndex" :tabs="tabs" @change="changeTab" lineHeight="8rpx" lineColor="#29B7CB" :zIndex="2"
			activeColor="#29B7CB" :lineScale="0.2" style="position: relative;bottom: 20rpx;border-radius: 20rpx;">
		</v-tabs>
		<view v-for="(item,index) in content" :key="index" @longpress="getMenuInfo(item)">
			<view class="tn-margin">
				<ls-skeleton :skeleton="skeleton" :loading="loading">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between">
						<view class="tn-flex tn-flex-col-center">
							<tn-avatar :src="item.expand.author.head_img" @tap="goUserProfile(index)"></tn-avatar>
							<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
								<view class="tn-flex tn-flex-col-center">
									<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
									<text v-if="item.expand.author.level==='admin'"
										class="tn-margin-left-xs tn-color-blue tn-icon-trusty-fill"></text>
								</view>
								<text class="tn-text-xs">{{getDateDiff(item.create_time)}}</text>
							</view>
						</view>

					</view>
					<view @tap="goAticle(index)">

						<view class="tn-padding tn-no-padding-left">
							<rich-text :nodes="item.description"></rich-text>
						</view>
						<!-- 单张图片 -->
						<view v-if="item.expand.images.length===1">
							<image v-for="(images,index) in item.expand.images" :key="index" :src="images.src"
								mode="aspectFill" style="height: 400rpx;width: 400rpx;border-radius:10rpx;"
								@tap.stop="previewImage(item.expand.images,index)">
							</image>
						</view>
						<!-- 单张结束 -->
						<!-- 复数开始 -->
						<view v-if="item.expand.images.length===2||item.expand.images.length===4">
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
									<!-- <tn-grid-item :style="{width: gridItemWidth}">
								<view style="padding: 30rpx;">{{ item }}</view>
							</tn-grid-item> -->
									<!-- #endif-->
								</block>
							</tn-grid>
						</view>
						<view v-if="item.expand.images.length>=3">
							<tn-grid align="left" :col="3" hoverClass="none">
								<block v-for="(images, index) in item.expand.images" :key="index">
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
									<!-- <tn-grid-item :style="{width: gridItemWidth}">
								<view style="padding: 30rpx;">{{ item }}</view>
							</tn-grid-item> -->
									<!-- #endif-->
								</block>
							</tn-grid>
						</view>
						<!-- 点赞控件 -->
						<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top-xs">
							<view class="tn-flex tn-flex-row-left">
								<view v-for="(category,index) in item.expand.sort" :key="index"
									class="tn-flex tn-flex-col-center tn-bg-gray--light tn-radius"
									@tap.stop="goCategory(category)">
									<tn-avatar size="sm" :src="category.opt.head_img" shape="square"></tn-avatar>
									<text
										class="tn-margin-left-xs tn-margin-right-xs tn-text-sm">{{category.name}}</text>
								</view>
							</view>
							<view class="tn-flex tn-flex-col-center tn-flex-row-around tn-flex-basic-sm">
								<view class="tn-flex tn-flex-col-center">
									<text class="tn-text-xl tn-icon-fire"></text>
									<text>{{item.views}}</text>
								</view>
								<view class="tn-flex tn-flex-col-center" @tap.stop="showComments(index)">
									<text class="tn-text-xl tn-icon-message"></text>
									<text>{{item.expand.comments.count}}</text>
								</view>
								<view class="tn-flex tn-flex-col-center" @tap.stop="likeAction(index)">
									<text
										:class="item.expand.like.is_like?'tn-text-xl tn-icon-like-fill tn-color-red':'tn-text-xl tn-icon-like'"></text>
									<text>{{item.expand.like.likes_count}}</text>
								</view>
							</view>

						</view>
					</view>
				</ls-skeleton>
			</view>

			<!-- 间隔开始 -->
			<view class="tn-bg-gray--light tn-padding-xs"></view>
			<!-- 间隔结束 -->
		</view>
	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				content: [],
				id: null,
				loading: true,
				skeleton: [
					'circle+line-sm*2',
					'line-sm*3',
					'card-lg',
					'circle-sm+line-sm'
				],
				tabs: ['帖子'],
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
			}
		},
		onLoad(params) {
			this.id = params.id
			this.getUserInfo()
		},
		methods: {
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
					}, 400)
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
			likeAction(index) {
				this.$http.put('/ArticleLike/Record', {
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
				this.$emit('getComments', this.content[index].id)
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
				var result = "2";

				var diffValue = timeNow - timePublish;
				var diffMonth = diffValue / month;
				var diffWeek = diffValue / (7 * day);
				var diffDay = diffValue / day;
				var diffHour = diffValue / hour;
				var diffMinute = diffValue / minute;

				// console.log('diffValue：'+diffValue+' ' +'diffMonth：'+diffMonth+' ' +'diffWeek：'+diffWeek+' ' +'diffDay：'+diffDay+' ' +'diffHour：'+diffHour+' ' +'diffMinute：'+diffMinute);

				if (diffValue < 0) {
					alert("错误时间");
				} else if (diffMonth > 3) {
					result = timePublish.getFullYear() + "-";
					result += timePublish.getMonth() + "-";
					result += timePublish.getDate();
					alert(result);
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