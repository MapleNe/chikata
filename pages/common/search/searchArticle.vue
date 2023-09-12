<template>
	<z-paging ref="paging" @query="getContent" use-cache cache-key="searchAricle" v-model="content" :auto="false"
		:auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false" @onRefresh="onRefresh"
		@onRestore="onRestore" :refresher-enabled="false">
		<view v-for="(item,index) in content" :key="index" @touchend="touchEnd" @touchmove="touchMove"
			v-if="tabsIndex==0">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-text-md">
					<view class="tn-flex tn-flex-col-center">
						<tn-avatar :src="item.expand.author.head_img"
							@tap="type!=='user'?goUserProfile(item.users_id):''"></tn-avatar>
						<view class="tn-flex tn-flex-col-center tn-margin-left-sm">
							<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
							<text v-if="item.expand.author.level==='admin'"
								class="tn-margin-left-xs tn-color-blue tn-icon-trusty-fill"></text>
						</view>
					</view>
					<view class="tn-flex tn-flex-col-center tn-text-sm tn-color-gray--dark">
						<text>{{getDateDiff(item.create_time)}}</text>
						<view v-if="item.expand.sort.length">
							<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
							<text>{{item.expand.sort[0].name}}</text>
						</view>
					</view>
				</view>
				<view @tap="goAticle(index)">
					<view class="tn-margin-top">
						<text class="tn-text-title">{{item.title}}</text>
					</view>
					<view class="tn-margin-bottom-sm tn-text-ellipsis-2 tn-color-gray--dark">
						<rich-text :nodes="item.description"></rich-text>
					</view>
					<view v-if="item.expand.images.length">
						<tn-grid align="left" :col="3" hoverClass="none">
							<block v-for="(images, subIndex) in item.expand.images" :key="subIndex" v-if="subIndex<3">
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
								<text class="tn-text-xxl tn-icon-fire "></text>
								<text class="tn-margin-left-xs">{{item.views}}</text>
							</view>
							<view class="tn-flex tn-flex-col-bottom">
								<text class="tn-text-xxl tn-icon-comment"></text>
								<text class="tn-margin-left-xs">{{item.expand.comments.count}}</text>
							</view>
							<view class="tn-flex tn-flex-col-bottom"
								:class="item.expand.like.is_like?'tn-color-red':''">
								<text class="tn-text-xxl"
									:class="item.expand.like.is_like?' tn-icon-praise-fill':'tn-icon-praise'"></text>
								<text class="tn-margin-left-xs">{{item.expand.like.likes_count}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="tn-bg-gray--light tn-padding-xs"></view>
		</view>
		<view v-if="tabsIndex==1">
			<view class="tn-flex tn-flex-col-center tn-margin tn-flex-wrap tn-color-gray--dark">
				<block v-for="(item,index) in content" :key="index">
					<view class="tn-bg-gray--light tn-margin-right-sm tn-padding-left-xs tn-padding-right-xs">
						<text>{{item.name}}</text>
					</view>
				</block>
			</view>
		</view>
		<view v-if="tabsIndex==2">
			<view class="tn-flex tn-flex-direction-column tn-margin tn-flex-wrap tn-color-gray--dark">
				<block v-for="(item,index) in content" :key="index">
					<view class="tn-flex tn-flex-col-center tn-margin-bottom-sm" style="position: relative;">
						<tn-avatar :src="item.head_img"
							@tap="goUserProfile(item.id)"></tn-avatar>
							<text v-if="item.level==='admin'"
								class="tn-margin-left-xs tn-color-blue tn-icon-trusty-fill"
								style="position: absolute;top: 40rpx;left: 30rpx; z-index: 9999;"></text>
						<view class="tn-flex tn-flex-col-center tn-margin-left-sm">
							<text>{{item.nickname}}</text>
						</view>
					</view>
				</block>
			</view>
		</view>
	</z-paging>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		props: {
			type: {
				type: String,
				default: 'article'
			},
			searchKey: {
				type: String,
				default: null,
			},
			tabsIndex: {
				type: Number,
				default: null
			},
			id: {
				type: Number,
				default: null,
			},
			order: {
				type: String,
				default: ''
			},
			swiperIndex: {
				type: Number,
				default: null
			}
		},

		name: "searchArticle",
		data() {
			return {
				content: [],
				firstLoad: false,
				isBanner: false,
				swiperList: [],
				skeleton: [
					'circle+line-sm*2',
					'line-sm*3',
					'card-lg',
					'circle-sm+line-sm'
				],
				loading: true,
				isLongTap: true,
				api: null,
				key: null,
				current: 0,

			};
		},
		onReady() {
			this.$nextTick(() => {
				this.$refs.readMore.init()
			})
		},
		created() {},
		watch: {
			swiperIndex: {
				handler(e) {
					if (e === this.tabsIndex) {
						if (!this.firstLoad) {
							setTimeout(() => {
								this.$refs.paging.reload()
							}, 5)
						}
					}
				},
				immediate: true
			},
			searchKey: {
				handler(e) {
					this.key = e
					setTimeout(() => {
						this.$refs.paging.reload()
					}, 200)
				},
				deep: true,
				immediate: true
			}
		},
		computed: {
			...mapState(['hasLogin']),
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			}
		},
		methods: {
			async getContent(page, num) {
				if (!this.key) return;
				await this.$http.get('/search', {
					params: {
						limit: num,
						page: page,
						value: this.key,
						mode: this.tabsIndex == 0 ? 'article' : this.tabsIndex == 1 ? 'tags' : this
							.tabsIndex == 2 ? 'users' : ''
					}
				}).then(res => {
					if (res.data.code === 200) {
						console.log(res)
						this.$refs.paging.complete(res.data.data.data)
						this.firstLoad = true
						//骨架屏仅在第一次加载数据时显示
						setTimeout(() => {
							this.loading = false
						}, 400)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			async getBanner() {
				await this.$http.get('/banner').then(res => {
					if (res.data.code === 200) {
						if (res.data.data.count > 0) {
							let data = res.data.data
							this.swiperList = data.data
							this.isBanner = true
						} else {
							this.isBanner = false
						}
					}
				})
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
				this.$emit('getComments', this.content[index].id)
			},
			getMenuInfo(data) {
				if (this.isLongTap) {
					this.$emit('getMenuInfo', data)
				}
			},
			goAticle(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.content[index].id,
						users_id: this.content[index].users_id
					},
				})
			},
			goUserProfile(id) {
				this.$Router.push({
					path: '/pages/common/userProfile/userProfile',
					query: {
						id: id
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
			touchEnd() {
				this.isLongTap = true;
			},
			touchMove(e) {
				// 手指触摸后的移动事件
				this.isLongTap = false;
			},
			followUser(index) {
				this.$http.put('/Focus/Record', {
					userId: this.content[index].users_id
				}).then(res => {
					switch (res.data.code) {
						case 200:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							this.content[index].expand.focus = !this.content[index].expand.focus
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
			onRefresh(e) {
				this.$emit('scroll', true)
			},
			onRestore(e) {
				this.$emit('scroll', false)
			}
		}
	}
</script>

<style>

</style>