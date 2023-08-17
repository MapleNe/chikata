<template>
	<view>
		<!-- 文章详情 开始 -->
		<z-paging ref="paging" @query="getComment" v-model="comments" :safe-area-inset-bottom="true"
			:auto-scroll-to-top-when-reload="false">
			<template #top>
				<tn-nav-bar :zIndex="2">
					详情
				</tn-nav-bar>
				<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
			</template>
			<!-- 页面内容 -->

			<view class="tn-margin">
				<ls-skeleton :skeleton="articleSk" :loading="loading">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between">
						<view class="tn-flex tn-flex-col-center">
							<tn-avatar :src="article.expand.author.head_img"></tn-avatar>
							<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
								<view class="tn-flex tn-flex-col-center">
									<text class="tn-text-bold">{{article.expand.author.nickname}}</text>
									<text v-if="article.expand.author.level==='admin'"
										class="tn-margin-left-xs tn-color-blue tn-icon-trusty-fill"></text>
								</view>
								<text class="tn-text-xs">{{getDateDiff(article.create_time)}}</text>
							</view>
						</view>
						<view>
							<tn-button size="sm" :backgroundColor="article.expand.focus?'tn-bg-gray--light':'#29B7CB'"
								:fontColor="article.expand.focus?'tn-color-grey':'tn-color-white'" shape="round"
								:blockRepeatClick="true" @tap="followUser()">
								<text>{{article.expand.focus?'已关注':'关注'}}</text>
							</tn-button>
						</view>
					</view>
					<view class="tn-margin-top" style="max-width: 100%;">
						<mp-html :content="article.content" :selectable="true" />
					</view>
					<view class="tn-flex tn-flex-col-center tn-margin-top">
						<view v-for="(category,index) in article.expand.sort" :key="index"
							class="tn-flex tn-flex-col-center tn-bg-gray--light tn-radius"
							@tap.stop="goCategory(category)">
							<tn-avatar size="sm" shape="square" :src="category.opt.head_img"></tn-avatar>
							<text class="tn-margin-left-xs tn-margin-right-xs tn-text-sm">{{category.name}}</text>
						</view>
					</view>
				</ls-skeleton>
			</view>

			<view class="tn-padding-xs tn-bg-gray--light"></view><!-- 间隔 -->
			<!-- 文章详情 结束 -->
			<!-- 评论区 开始 -->
			<view class="tn-margin">
				<view class="tn-color-grey">
					<text>评论：{{article.expand.comments.count}}</text>
				</view>
				<view class="tn-margin-top">
					<view v-for="(item,index) in comments" :key="index">
						<ls-skeleton :skeleton="commentSk" :loading="loading">
							<view class="tn-flex tn-flex-col-center">
								<tn-avatar :src="item.expand.head_img"></tn-avatar>
								<view class="tn-flex tn-col-center tn-flex-direction-column tn-margin-left-sm">
									<view class="tn-flex tn-flex-col-center">
										<text class="tn-text-bold">{{item.nickname}}</text>
										<text v-if="article.users_id === item.users_id"
											class="tn-margin-left-xs tn-text-xs tn-radius ch-bg-main--light ch-color-primary"
											style="padding:5rpx 8rpx">UP</text>
									</view>
									<text class="tn-text-xs">{{getDateDiff(item.create_time)}}</text>
								</view>
							</view>
							<view class="tn-margin tn-padding-left-xl" style="overflow: hidden;word-wrap: break-word"
								@tap="subReply(item)">
								<!-- {{item.content}} -->
								<mp-html :content="item.content"></mp-html>
							</view>
							<!-- 子评论 -->
							<view class="tn-margin">
								<view class="tn-margin-left-xl tn-padding-sm tn-bg-gray--light ch-radius"
									v-if="item.son.length>0">
									<view v-for="(subComment, index) in item.son" :key="index">
										<view class="tn-flex tn-flex-col-center">
											<tn-avatar :src="subComment.expand.head_img"></tn-avatar>
											<view
												class="tn-flex tn-col-center tn-flex-direction-column tn-margin-left-sm">
												<view class="tn-flex tn-flex-col-center">
													<view class="tn-flex tn-flex-col-center">
														<text class="tn-text-bold">{{subComment.nickname}}</text>
														<text v-if="article.users_id === subComment.users_id"
															class="tn-margin-left-xs tn-text-xs tn-radius ch-bg-main--light ch-color-primary"
															style="padding:5rpx 8rpx">UP</text>
													</view>
													<!-- 写一段注释 这个是父评论的id不等于子评论的pid里的id才会显示-->
													<view v-if="item.id !== subComment.expand.pid.id"
														class="tn-flex tn-flex-col-center">
														<text class="tn-icon-right-triangle"></text>
														<text
															class="tn-text-bold">{{subComment.expand.pid.nickname}}</text>
													</view>

												</view>

												<text class="tn-text-xs">{{getDateDiff(subComment.create_time)}}</text>
											</view>
										</view>
										<view class="tn-margin tn-padding-left-xl"
											style="overflow: hidden;word-wrap: break-word" @tap="subReply(subComment)">
											<mp-html :content="subComment.content" :selectable="true"></mp-html>
										</view>

									</view>
								</view>

							</view>
						</ls-skeleton>
					</view>
				</view>
			</view>
			<template #bottom>
				<!-- 底部开始 -->
				<view class="tn-padding tn-bg-white tn-flex tn-flex-col-center">
					<view class="tn-bg-gray--light tn-padding-left tn-round">
						<tn-input :disabled="true" :placeholder="commentBoxText" @click="commentAction"></tn-input>
					</view>
					<view class="tn-flex tn-flex-col-center tn-flex-row-around tn-flex-1">
						<view class="tn-flex tn-flex-col-center">
							<text class="tn-text-xl tn-icon-fire"></text>
							<text>{{article.views}}</text>
						</view>
						<view class="tn-flex tn-flex-col-center">
							<text class="tn-text-xl tn-icon-message"></text>
							<text>{{article.expand.comments.count}}</text>
						</view>
						<view class="tn-flex tn-flex-col-center" @tap="likeAction">
							<text
								:class="article.expand.like.is_like?'tn-text-xl tn-icon-like-fill tn-color-red':'tn-text-xl tn-icon-like'"></text>
							<text>{{article.expand.like.likes_count}}</text>
						</view>
					</view>
				</view>
				<!-- 底部 结束 -->
			</template>

		</z-paging>

		<!-- 弹出层 开始 -->
		<tn-popup v-model="commentBoxOpen" mode="bottom" :borderRadius="10" :zIndex="3"
			@close="resetComment;showEmoji=false">
			<view class="tn-margin">
				<view class="tn-bg-gray--light tn-padding-sm"
					style="height: 150rpx;overflow: hidden; border-radius: 10rpx;">
					<tn-input type="textarea" v-model="commentText" :clearable="false" :placeholder="commentBoxText"
						:autoHeight="false"></tn-input>
				</view>
			</view>
			<view class="tn-flex tn-margin tn-flex-col-center tn-flex-row-between">
				<view class="tn-flex tn-flex-col-center">
					<text class="tn-text-xl tn-icon-emoji-good" @tap.stop="showEmoji=!showEmoji;getEmojiList()"></text>
				</view>
				<view class="">
					<tn-button shape="round" :plain="true" size="sm" :blockRepeatClick="true" @click="commentCheck">发送~</tn-button>
				</view>
			</view>
			<view v-show="showEmoji">
				<v-tabs v-model="emojiIndex" :tabs="emojiTabs" @change="changeTab" lineHeight="8rpx" lineColor="#29B7CB"
					activeColor="#29B7CB" :lineScale="0.2"></v-tabs>
				<scroll-view scroll-y style="height: 20vh;" class="tn-margin-top-xs">
					<tn-grid :col="8">
						<block v-for="(item, index) in emojiList" :key="index">
							<!-- H5 -->
							<!-- #ifndef MP-WEIXIN -->
							<tn-grid-item>
								<image :src="item" mode="aspectFill" style="height: 50rpx;width: 50rpx;"
									@tap.stop="insertEmoji(index)"></image>
							</tn-grid-item>
							<!-- #endif-->

							<!-- 微信小程序 -->
							<!-- #ifdef MP-WEIXIN -->
							<tn-grid-item :style="{width: gridItemWidth}">
								<view style="padding: 30rpx;">{{ item }}</view>
							</tn-grid-item>
							<!-- #endif-->
						</block>
					</tn-grid>
				</scroll-view>
			</view>

		</tn-popup>

	</view>

</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				commentBoxText: '我想说...', //底部盒子显示的信息
				commentText: '', //这个才是回复的信息
				commentBoxOpen: false, //控制弹出层
				comments: [], //获取到的评论列表
				//为什么要定义这堆东西？我也不知道 不定义就报错 但是不影响正常使用草
				article: {
					title: '',
					expand: {
						author: {
							head_img: ''
						},
						like: {

						},
						comments: {
							count: 0,
						}
					}
				},
				params: [], //页面传参
				secondNav: false,
				token: null,
				pid: 0,
				loading: true,
				articleSk: [
					'circle+line-sm*2',
					'line*3',
					20,
					'card+card+card',
					'circle-sm+line-sm',
				],
				commentSk: [
					'circle+line-sm*2',
					10,
					'line-sm*3'
				],
				showEmoji: false,
				emojiTabs: [],
				emojiIndex: 0,
				emojiList: [],
			}
		},

		onLoad(params) {
			this.params = params
			this.getArticle()
			this.token = uni.getStorageSync('token')
		},

		methods: {
			async getArticle() {
				await this.$http.get('/article/one', {
					params: {
						id: this.params.id,
						mode: 'html'
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.article = res.data.data
						console.log(this.article)
						setTimeout(() => {
							this.loading = false
						}, 600)

					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			async getComment(page, num) {
				await this.$http.get('/comments/article', {
					params: {
						article_id: this.params.id,
						limit: num,
						page: page,
						tree: false
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data.data)
						console.log(this.comments)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			getEmojiList() {
				this.$http.get('/emoji/list').then(res => {
					if (res.data.code === 200) {
						this.emojiTabs = res.data.data
						this.getEmojiAll()
					}
				})
			},
			getEmojiAll() {
				this.$http.get('/emoji/one', {
					params: {
						name: this.emojiTabs[this.emojiIndex]
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.emojiList = res.data.data
					}
				})
			},
			insertEmoji(index) {
				console.log(index)
				this.commentText += `[${index}]`
			},
			renderEmoji(content) {
				return content.replace(/\[([^\]]+)\]/g, (_, name) => {
					const url = this.emojiList[name]
					return `<img src="${url}" class="emoji">`
				})
			},
			followUser() {
				this.$http.put('/Focus/Record', {
					userId: this.article.users_id
				}).then(res => {
					switch (res.data.code) {
						case 200:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
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
			commentAction() {
				this.commentBoxOpen = true
			},
			//关闭popup重置placeholder
			resetComment() {
				this.commentBoxText = '我想说...'
				this.pid = 0
			},
			subReply(item) {
				this.commentBoxOpen = true
				this.commentBoxText = '回复:' + item.nickname
				this.pid = item.id
				console.log(item.id)
			},
			commentCheck() {
				if (this.commentText === '') {
					uni.showToast({
						icon: 'none',
						title: '不说点什么？'
					})
					return
				} else {
					this.commentSend()
				}
			},
			commentSend() {
				
				this.$http.post('/comments/add', {
					article_id: this.article.id,
					content: this.renderEmoji(this.commentText),
					pid: this.pid,
				}).then(res => {
					if (res.data.code === 200) {
						uni.showToast({
							icon: 'none',
							title: '评论' + res.data.msg
						})
						this.commentText = ''
					}
					setTimeout(() => {
						this.commentBoxOpen = false
						this.$refs.paging.reload()
						console.log(this.comments.length)
					}, 800)

				}).catch(err => {
					console.log(err)
					uni.showToast({
						icon: "none",
						title: err.data.msg
					})
				})
			},
			likeAction(index) {
				this.$http.put('/Article-like/Record', {
					article_id: this.article.id
				}).then(res => {
					if (res.data.code === 200) {
						this.article.expand.like.is_like = !this.article.expand.like.is_like
						if (this.article.expand.like.is_like) {
							this.article.expand.like.likes_count++
						} else {
							this.article.expand.like.likes_count--
						}
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					}
				})
			},
			changeTab(index) {
				this.emojiIndex = index
			},
			goCategory(category) {
				this.$Router.push({
					path: '/pages/common/category/category',
					query: {
						id: category.id
					}
				})
			},
			//返回上一页
			back() {
				// 通过判断当前页面的页面栈信息，是否有上一页进行返回，如果没有则跳转到首页
				const pages = getCurrentPages()
				if (pages && pages.length > 0) {
					const firstPage = pages[0]
					if (pages.length == 1 && (!firstPage.route || firstPage.route != 'pages/tabbar/index')) {
						this.$Router.replaceAll({
							path: '/pages/tabbar/index'
						})
					} else {
						this.$Router.back(1)
					}
				} else {
					this.$Router.replaceAll({
						path: '/pages/tabbar/index'
					})
				}
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
		}
	}
</script>

<style lang="scss">
	page {
		height: auto;
	}

	.emoji {
		width: 40rpx !important;
		height: 40rpx !important;
	}

	.ch-radius {
		border-radius: 10rpx;
	}
</style>