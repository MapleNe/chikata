<template>
	<z-paging ref="paging" @query="getArticle" use-cache :cache-key="`indexArticle${tabsIndex}`" v-model="content" :auto="false"
		:auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false" @onRefresh="onRefresh"
		@onRestore="onRestore">
		<view v-show="tabsIndex===0">
			<view class="tn-margin" v-show="swiper">
				<tn-swiper :list="swiperList" :height="350" name="img" backgroundColor="tn-bg-gray--light" :radius="10"
					v-show="isBanner" @click="clickSwiper">
				</tn-swiper>
			</view>
		</view>
		<view v-for="(item,index) in content" :key="index" @touchend="touchEnd" @touchmove="touchMove">
			<view class="tn-margin">
				<ls-skeleton :skeleton="skeleton" :loading="loading">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between">
						<view class="tn-flex tn-flex-col-center" style="position: relative;">
							<tn-avatar :src="item.expand.author.head_img"
								@tap="type!=='user'?goUserProfile(index):''"></tn-avatar>
							<text v-if="item.expand.author.level==='admin'"
								class="tn-margin-left-xs tn-text-md tn-color-blue tn-icon-trusty-fill tn-bg-white tn-round"
								style="position: absolute;top: 58rpx;left: 30rpx; z-index: 9999; padding: 2rpx;"></text>
							<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
								<view class="tn-flex tn-flex-col-center">
									<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
									<text class="level tn-margin-left-xs level-text"
										:class="['lv-'+item.expand.author.grade]"
										:style="{'color':level[item.expand.author.grade]}"></text>
								</view>
								<view class="tn-flex tn-flex-col-center tn-text-sm tn-color-gray--dark">
									<text>{{getDateDiff(item.create_time)}}</text>
									<view class="tn-flex tn-flex-col-center" v-if="item.expand.sort.length"
										@tap.stop.prevent="goCategory(item.expand.sort[0].id)">
										<text class="tn-margin-right-xs tn-margin-left-xs">·</text>
										<text>{{item.expand.sort[0].name}}</text>
									</view>
									<!-- 圈子页面显示以下样式 -->
									<view class="tn-flex tn-flex-col-center"
										v-if="item.expand.sort.length && type==='circle'">
										<text class="tn-margin-right-xs tn-margin-left-xs">·</text>
										<text>在{{item.expand.sort[0].name}}发了帖子</text>
									</view>
								</view>
							</view>
						</view>
						<!-- 可能不需要关注，注释 -->
						<!-- <view v-show="type!=='user'">
							<tn-button plain size="sm" :fontSize="30" padding="0 15rpx" backgroundColor="#29b7cb"
								fontColor="#29b7cb" v-if="!item.expand.focus" @click="followUser(index)">
								<view class="tn-flex tn-flex-col-center">
									<text class="tn-icon-add tn-margin-right-xs"></text>
									<text>关注</text>
								</view>
							</tn-button>
							<tn-button size="sm" :fontSize="30" padding="0 20rpx" plain
								backgroundColor="tn-bg-gray--light" fontColor="tn-color-gray" @click="followUser(index)"
								v-else>
								<text>已关注</text>
							</tn-button>
						</view> -->
					</view>
					<view @tap="goArticle(index)">
						<view class="tn-margin-top">
							<text class="tn-text-title">{{item.title}}</text>
						</view>
						<view class="tn-padding-sm tn-no-padding-left tn-color-gray--dark tn-padding-bottom-sm" style="word-break: break-all;">
							<rich-text :nodes="item.description"></rich-text>
						</view>

						<!-- 单张图片 -->
						<view v-if="item.expand.images.length===1">
							<image v-for="(images,subIndex) in item.expand.images" :key="subIndex" :src="images.src"
								mode="aspectFill" style="height: 400rpx;width: 400rpx;border-radius:10rpx;"
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
							<tn-grid align="left" :col="col" hoverClass="none">
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
						<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top"
							v-if="type!=='circle'">
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
									<text class="tn-margin-left-xs ">{{item.expand.like.likes_count}}</text>
								</view>
							</view>
						</view>
						<!-- 动态页面 -->
						<view v-else>
							<view class="tn-flex tn-flex-col-center tn-flex-wrap tn-margin-top">
								<view v-for="tags in item.expand.tag" :key="tags.id"
									class="tn-bg-grey--light tn-text-sm tn-color-gray--dark tn-margin-right-sm tn-margin-bottom-sm tn-padding-xs"
									style="border-radius: 10rpx;">
									<text>{{tags.name}}</text>
								</view>
							</view>
							<view
								class="tn-flex  tn-flex-col-center tn-text-sm tn-color-grey--disabled tn-flex-basic-sm tn-flex-row-around">
								<view class="tn-flex tn-flex-col-bottom">
									<text class="tn-text-xxl tn-icon-share-square "></text>
									<text class="tn-margin-left-xs ">{{item.views}}</text>
								</view>
								<view class="tn-flex tn-flex-col-bottom" @tap.stop="showComments(index)">
									<text class="tn-text-xxl tn-icon-comment"></text>
									<text class="tn-margin-left-xs ">{{item.expand.comments.count}}</text>
								</view>
								<view class="tn-flex tn-flex-col-bottom" @tap.stop="likeAction(index)">
									<text class="tn-text-xxl"
										:class="item.expand.like.is_like?'ch-color-primary tn-icon-praise-fill':'tn-icon-praise'"></text>
									<text class="tn-margin-left-xs ">{{item.expand.like.likes_count}}</text>
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
	import {
		mapState
	} from 'vuex';
	export default {
		props: {
			// content: {
			// 	type: Array,
			// },
			swiper: {
				type: Boolean,
				default: false
			},
			tabsIndex: {
				type: Number,
				default: null
			},
			type: {
				type: String,
				default: 'index'
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

		name: "articleList",
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
				showPop: false,
				showMenu: false,
				isLongTap: true,
				api: null,
				col:3

			};
		},
		onReady() {
			this.$nextTick(() => {
				this.$refs.readMore.init()
			})
		},
		created() {
			
			this.getBanner()
			// this.getPlacard()
			uni.$on('deleteArticleOk', data => {
				if (data) {
					this.$refs.paging.reload()
				}
			})
		},
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
			async getArticle(page, num) {
				switch (this.type) {
					case 'index':
						this.api = '/article/all'
						break;
					case 'focus':
						this.api = '/article/focusFind'
						break;
					case 'circle':
						this.api = this.hasLogin ? '/article/focusFind' : '/article/all'
						break;
					case 'user':
						this.api = '/article/userFind'
						break;
					default:
						this.api = '/article/all'
						break;
				}
				await this.$http.get(this.api, {
					params: {
						limit: num,
						page: page,
						id: this.id ? this.id : '',
						order: this.tabsIndex === 1 ? 'create_time desc views desc' : ''
					}
				}).then(res => {
					
					if (res.data.code === 200) {

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
			goArticle(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.content[index].id,
						users_id: this.content[index].users_id
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
						id: this.swiperList[index].opt.article_id,
						users_id:this.swiperList[index].opt.users_id
					},
				})
			},
			goCategory(id) {
				this.$Router.push({
					path: '/pages/common/category/category',
					query: {
						id: id
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