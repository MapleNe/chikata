<template>
	<z-paging v-model="noticeList" ref="paging" @query="getNoticeDetail">
		<template #top>
			<tn-nav-bar backTitle="" :zIndex="2">
				<text>{{type=='comment'?'评论通知':type=='articlelike'?'点赞收藏':'关注我的'}}</text>
			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<!-- 分开样式 -->
		<view class="tn-margin">
			<!-- 评论通知 -->
			<block v-if="type==='comment'" v-for="(item,index) in noticeList" :key="index">
				<view class="tn-flex">
					<view class="tn-flex tn-flex-col-center" @tap.stop.prevent="goUserProfile(index)">
						<view class="tn-margin-right-sm">
							<tn-avatar :src="item.head_img"></tn-avatar>
						</view>
						<view class="tn-flex tn-flex-direction-column">
							<text>{{item.nickname}}</text>
							<text class="tn-color-grey--disabled tn-text-sm">{{getDateDiff(item.update_time)}}</text>
						</view>
					</view>
				</view>
				<view class="tn-flex tn-flex-direction-column tn-margin tn-padding-left tn-margin-left-xl">
					<view class="tn-text-ellipsis-2" @tap.stop.prevent="comments_id = item.id;showComments = true">
						<mp-html container-style="word-wrap: break-word;" :content="item.content"></mp-html>
					</view>
					<view class="tn-bg-gray--light tn-radius tn-margin-top-sm" @tap.stop.prevent="">
						<view class="tn-padding-sm tn-text-ellipsis tn-color-gray--dark">
							<text>{{item.pid?'评论':'帖子'}}： {{item.title}}</text>
						</view>
					</view>
				</view>
				<view class="tn-margin tn-no-margin-right">
					<view class="tn-margin-left-xl tn-bg-gray--light" style="border-radius: 20rpx;">
					</view>
				</view>
			</block>
			<!-- 点赞文章 -->
			<block v-if="type==='articlelike'" v-for="(item,index) in noticeList" :key="index">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<view class="tn-margin-right-sm tn-flex tn-flex-col-center"
						@tap.stop.prevent="goUserProfile(index)">
						<tn-avatar :src="item.head_img"></tn-avatar>
						<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
							<text>{{item.nickname}}</text>
							<text class="tn-color-gray tn-text-sm tn-text-xs">{{getDateDiff(item.create_time)}}</text>
						</view>
					</view>
					<view class="tn-text-md">
						<text class="tn-color-gray--dark">点赞了你</text>
						<text class="tn-icon-praise tn-color-red"></text>
					</view>
				</view>
				<view class="tn-margin-left-xl tn-bg-gray--light tn-padding-sm tn-margin-top tn-margin-bottom"
					style="border-radius: 20rpx;">
					<text>{{item.article_title}}</text>
				</view>
			</block>
			<!-- 关注用户 -->
			<block v-if="type==='focus'" v-for="(item,index) in noticeList" :key="index">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-bottom">
					<view class="tn-flex tn-flex-col-center" @tap.stop="goUserProfile(index)">
						<tn-avatar :src="item.head_img"></tn-avatar>
						<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
							<text>{{item.nickname}}</text>
							<text class="tn-text-sm">{{getDateDiff(item.create_time)}}</text>
						</view>
					</view>
					<view>
						<tn-button plain :fontSize="30" size="sm" padding="0 15rpx" backgroundColor="#29b7cb"
							fontColor="#29b7cb" v-if="!item.focus" @click="followUser()">
							<view class="tn-flex tn-flex-col-center">
								<text class="tn-icon-add tn-margin-right-xs"></text>
								<text>关注</text>
							</view>
						</tn-button>
						<tn-button :fontSize="30" size="sm" plain padding="0 20rpx" backgroundColor="tn-bg-gray--light"
							fontColor="tn-color-gray" @click="showCancelFollow = true" v-else>
							<text>已关注</text>
						</tn-button>
					</view>
				</view>
			</block>
		</view>
		<!-- 弹窗 -->
		<!-- 查看评论 -->
		<tn-popup v-model="showComments" mode="bottom" length="80%" :borderRadius="20" :zIndex="3">
			<z-paging ref="comments" @query="getComments" v-model="comments" :auto-scroll-to-top-when-reload="false"
				use-cache :cache-key="`noticeComments_${comments_id}`" :auto-clean-list-when-reload="false"
				:refresher-enabled="false">
				<template #top>
					<view class="tn-margin">
						<view class="tn-flex tn-flex-col-center  tn-text-xxl tn-flex-row-between">
							<text class="tn-icon-close" @tap.stop.prevent="showComments = false"></text>
							<text class="tn-icon-more-horizontal"></text>
						</view>
					</view>
				</template>
				<view class="tn-margin tn-no-margin-top" v-if="commentAuthor">
					<view class="tn-flex tn-flex-col-center tn-text-md">
						<tn-avatar :src="commentAuthor.expand.user.head_img"></tn-avatar>
						<view class="tn-flex tn-col-center tn-flex-direction-column tn-margin-left-sm">
							<view class="tn-flex tn-flex-col-center">
								<text>{{commentAuthor.expand.user.nickname}}</text>
								<text v-if="commentAuthor.expand.article.users_id === commentAuthor.users_id"
									class="tn-margin-left-xs tn-text-xs tn-radius ch-bg-main--light ch-color-primary"
									style="padding:5rpx 8rpx">楼主</text>
								<text class="level tn-margin-left-xs level-text"
									:class="['lv-'+commentAuthor.expand.user.grade]"
									:style="{'color':level[commentAuthor.expand.user.grade]}"></text>
							</view>
							<view class="tn-flex tn-text-sm tn-color-grey--disabled tn-flex-col-center">
								<text>{{getDateDiff(commentAuthor.create_time)}}</text>
								<text class="tn-margin-left-sm">{{commentAuthor.ip.province}}</text>
							</view>
						</view>
					</view>
					<view class="tn-margin-top tn-margin-left">
						<view class="tn-flex tn-flex-direction-column tn-margin-left-xl">
							<view style="overflow: hidden;word-wrap: break-word" @tap="subReply(commentAuthor)">
								<!-- {{item.content}} -->
								<mp-html :preview-img="false" :img-cache="true"
									:content="renderEmoji(commentAuthor.content)"></mp-html>
								<view v-if="commentAuthor.images && commentAuthor.images.length>0">
									<tn-grid align=" left" :col="col" hoverClass="none">
										<block v-for="(images, subIndex) in commentAuthor.images" :key="subIndex"
											v-if="subIndex<9">
											<!-- H5 -->
											<!-- #ifndef MP-WEIXIN -->
											<tn-grid-item
												style="height: 180rpx;width: 180rpx;margin-right: 6rpx;margin-bottom: 6rpx">
												<image :src="images" mode="aspectFill"
													style="height: 180rpx;width: 180rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(commentAuthor.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->

											<!-- 微信小程序 -->
											<!-- #ifdef MP-WEIXIN -->
											<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
												style="margin-right: 6rpx;margin-bottom: 6rpx">
												<image :src="images.src" mode="aspectFill"
													style="height: 180rpx;width: 180rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(commentAuthor.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->
										</block>
									</tn-grid>
								</view>
							</view>
							<view class="tn-flex tn-flex-col-center tn-text-md tn-flex-row-between tn-margin-top-sm">
								<text class="ch-color-primary" @tap.stop.prevent="showComment = false">查看原帖</text>
								<view
									class="tn-flex tn-flex-col-center tn-color-grey--disabled tn-flex-row-between tn-flex-basic-xs">
									<view class="tn-flex tn-flex-col-center"
										@tap.stop.prevent="commentLike(commentAuthor,'subAuthor')">
										<text class="tn-icon-praise-simple"></text>
										<text class="tn-margin-left-xs"
											v-if="commentAuthor.opt">{{commentAuthor.opt.like}}</text>
									</view>
									<text class="tn-icon-tread-simple"></text>
								</view>

							</view>
						</view>
					</view>
				</view>
				<!-- 间隔 -->
				<view class="tn-padding-xs tn-bg-gray--light"></view>
				<view class="tn-margin">
					<block v-for="(item,index) in comments" :key="index">
						<view class="tn-flex tn-flex-col-center tn-margin-top-sm tn-text-md">
							<tn-avatar :src="item.expand.head_img" @click="goProfile(item.users_id)"></tn-avatar>
							<view class="tn-flex tn-col-center tn-flex-direction-column tn-margin-left-sm">
								<view class="tn-flex tn-flex-col-center">
									<text>{{item.nickname}}</text>
									<text v-if="item.expand.article.users_id === item.users_id"
										class="tn-margin-left-xs tn-text-xs tn-radius ch-bg-main--light ch-color-primary"
										style="padding:5rpx 8rpx">楼主</text>
									<text class="level tn-margin-left-xs level-text"
										:class="['lv-'+item.expand.user.grade]"
										:style="{'color':level[item.expand.user.grade]}"></text>
								</view>
								<text
									class="tn-text-sm tn-color-grey--disabled">{{item.ip.province?item.ip.province:item.ip.country}}</text>
							</view>
						</view>

						<view class="tn-margin-top tn-margin-left">
							<view
								class="tn-flex tn-flex-direction-column tn-margin-left-xl tn-padding-bottom-xs tn-border-solid-bottom tn-border-gray--light">
								<view @tap="subReply(item)">
									<text class="tn-margin-right-xs" v-if="item.pid != commentAuthor.id">回复</text>
									<text class="tn-color-indigo"
										@tap.stop.prevent="goProfile(item.expand.pid.users_id)"
										v-if="item.pid != commentAuthor.id">{{item.expand.pid.nickname}}</text>
									<text v-if="item.pid != commentAuthor.id">：</text>
									<mp-html container-style="display:inline;white-space:nomarl;"
										:content="renderEmoji(item.content)" :preview-img="false"
										:img-cache="true"></mp-html>
								</view>
								<view v-if="item.images && item.images.length>0">
									<tn-grid align=" left" :col="col" hoverClass="none">
										<block v-for="(images, subIndex) in item.images" :key="subIndex"
											v-if="subIndex<9">
											<!-- H5 -->
											<!-- #ifndef MP-WEIXIN -->
											<tn-grid-item
												style="height: 180rpx;width: 180rpx;margin-right: 6rpx;margin-bottom: 6rpx">
												<image :src="images" mode="aspectFill"
													style="height: 180rpx;width: 180rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->

											<!-- 微信小程序 -->
											<!-- #ifdef MP-WEIXIN -->
											<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
												style="margin-right: 6rpx;margin-bottom: 6rpx">
												<image :src="images.src" mode="aspectFill"
													style="height: 180rpx;width: 180rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->
										</block>
									</tn-grid>
								</view>

								<!-- 评论底部控件 -->
								<view class="tn-color-grey--disabled tn-text-sm tn-margin-top-sm">
									<view class="tn-flex tn-flex-col-center tn-flex-row-between">
										<text>{{getDateDiff(item.create_time)}}</text>
										<view class="tn-flex tn-flex-col-center tn-flex-row-between"
											style="flex-basis: 35%;">
											<view class="tn-flex-col-center">
												<text class="tn-text-md tn-icon-comment"></text>
												<text class="tn-margin-left-xs">回复</text>
											</view>
											<view class="tn-flex tn-flex-col-cen-ter"
												@tap.stop.prevent="commentLike(index,'comments')">
												<text class="tn-text-md tn-icon-praise-simple"></text>
												<text class="tn-margin-left-xs" v-if="item.opt">{{item.opt.like}}</text>
											</view>

											<text class="tn-text-md tn-icon-tread-simple"></text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</block>
				</view>
				<template #bottom>
					<view class="tn-bg-gray--light tn-padding-sm">
						<view class="tn-bg-white tn-padding-left tn-radius" v-if="commentAuthor">
							<tn-input :disabled="true"
								:placeholder="'回复：' + commentAuthor.nickname"
								@click="commentAuthor.expand&& commentAuthor.expand.article.opt.comments.allow?subReply(commentAuthor):''"></tn-input>
						</view>
					</view>
				</template>
			</z-paging>
		</tn-popup>
		<!-- 回复弹窗 -->
		<tn-popup v-model="commentBoxOpen" mode="bottom" :borderRadius="20" :zIndex="999"
			@close="pid = 0;showEmoji=false">
			<view class="tn-margin">
				<view class="tn-bg-gray--light tn-padding-sm"
					style="height: 150rpx;overflow: hidden; border-radius: 10rpx;">
					<tn-input type="textarea" v-model="commentText" :clearable="false" :placeholder="commentBoxText"
						:autoHeight="false"></tn-input>
				</view>
			</view>
			<view class="tn-flex tn-margin tn-flex-col-center tn-flex-row-between">
				<view class="tn-flex tn-flex-col-center">
					<text class="tn-text-xl tn-margin-right" v-for="(item,index) in commentBtn" :key="index"
						:class="item.icon" @tap.stop="commentBtnTap(index)"></text>
				</view>
				<view class="">
					<tn-button :plain="true" size="sm"
						:backgroundColor="images&&images.length||commentText?'#29b7cb':'#aaa'"
						:fontColor="images&&images.length||commentText?'#29b7cb':'#aaa'" blockRepeatClick
						@click="images&&images.length||commentText?commentSend():''">发送~</tn-button>
				</view>
			</view>
			<!-- 图片 -->
			<scroll-view scroll-x="true" style="height: 200rpx;"
				class="tn-padding tn-padding-top-xs tn-no-padding-bottom" v-if="images&&images.length">
				<view class="tn-flex">
					<block v-for="(item,index) in images" :key="index">
						<view style="height: 140rpx;width: 140rpx;position: relative;" class="tn-margin-right-xs">
							<image :src="item" style="height: 140rpx;width: 140rpx;" mode="aspectFill"></image>
							<text style="position: absolute;top: 0;z-index: 10;right: 0;"
								class="tn-icon-close-circle tn-color-white"
								@tap.stop.prevent="deleteImage(index)"></text>
						</view>
					</block>
				</view>
			</scroll-view>
			<view v-show="showEmoji">
				<v-tabs v-model="emojiIndex" :tabs="emojiTabs" @change="changeTab" lineHeight="8rpx" lineColor="#29b7cb"
					activeColor="#29b7cb" :lineScale="0.2"></v-tabs>
				<scroll-view scroll-y style="height: 20vh;" class="tn-margin-top-xs">
					<tn-grid :col="8">
						<block v-for="(item, index) in emoji.list" :key="index">
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
								<image :src="item" mode="aspectFill" style="height: 50rpx;width: 50rpx;"
									@tap.stop="insertEmoji(index)"></image>
							</tn-grid-item>
							<!-- #endif-->
						</block>
					</tn-grid>
				</scroll-view>
			</view>
		</tn-popup>
	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				noticeList: [],
				type: null,
				showComments: false,
				//评论
				comments: [],
				comments_id: null,
				commentAuthor: null,
				commentBoxOpen: false,
				commentBoxText: '',
				commentText: '',
				commentBtn: [{
						name: '表情',
						type: 'emoji',
						active: false,
						icon: 'tn-icon-emoji-good'
					},
					{
						name: '图片',
						type: 'picture',
						active: false,
						icon: 'tn-icon-image'
					},
					{
						name: '@',
						type: 'at',
						active: false,
						icon: 'tn-icon-like'
					}
				],
				pid: 0,
				showEmoji: false,
				emojiTabs: [],
				emojiIndex: 0,
				emoji: {
					list: null
				},
				images: [],
			};
		},
		onLoad(params) {
			this.type = params.type
		},
		computed: {},
		methods: {
			// 获取评论
			getComments(page, limit) {
				this.$http.get('/comments/one', {
					params: {
						page: page,
						limit: limit,
						id: this.comments_id,
						tree: false,
					}
				}).then(res => {
					console.log(res)
					if (res.data.code === 200) {
						this.commentAuthor = res.data.data
						this.$refs.comments.complete(res.data.data.son)
					}
				})
			},
			getNoticeDetail(page, num) {
				this.$http.get('/push/history', {
					params: {
						page: page,
						limit: num,
						type: this.type
					}
				}).then(res => {
					console.log(res)
					if (res.data.code === 200) {

						this.$refs.paging.complete(res.data.data)
					}
				}).catch(err => {
					console.log(err)
					this.$refs.paging.complete(false)
				})
			},
			goUserProfile(index) {
				console.log(this.noticeList[index])
				this.$Router.push({
					path: '/pages/common/userProfile/userProfile',
					query: {
						id: this.noticeList[index].users_id ? this.noticeList[index].users_id : this.noticeList[
							index].fuserId
					}
				})
			},
			followUser(index) {
				this.$http.put('/Focus/Record', {
					userId: this.noticeList[index].fansid
				}).then(res => {
					switch (res.data.code) {
						case 200:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							this.noticeList[index].is_focus = !this.noticeList[index].is_focus
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
			getDateDiff(date) {
				// 传进来的date必须是日期格式，不能是时间戳
				var timePublish = new Date(date);
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

				if (diffValue < 0) {} else if (diffMonth > 3) {
					result = timePublish.getFullYear() + "-";
					result += timePublish.getMonth() + "-";
					result += timePublish.getDate();
				} else if (diffDay > 3) {
					// 超过三天直接显示日期
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
			renderEmoji(content) {
				return content.replace(/_\(([^)]+)\)/g, (_, name) => {
					const url = this.emojiList[name]
					return `<img src="${url}" style="height:25px;width:25px">`
				})
			},
			subReply(item) {
				this.commentBoxOpen = true
				this.commentBoxText = '回复：' + item.nickname
				this.pid = item.id
			},
			commentBtnTap(index) {
				switch (index) {
					case 0:
						this.showEmoji = !this.showEmoji
						this.getEmojiList()
						break;
					case 1:
						this.imageChoose()
						break;
					case 2:
						this.showAt = !this.showAt
						break;
					default:
						break;
				}
				this.commentBtn[index].active = !this.commentBtn[index].active
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
						this.emoji.list = res.data.data
					}
				})
			},
			imageChoose() {
				uni.chooseImage({
					count: 9,
					success: (res) => {

						this.imageUpload(res.tempFilePaths)
					}
				})
			},
			async imageUpload(images) {
				try {
					for (const image of images) {
						const res = await this.$http.upload('/file/uploadImg', {
							filePath: image,
							name: 'file',
							getTask: (task, options) => {
								task.onProgressUpdate((res) => {

								})
							}
						});
						// 在这里可以处理上传成功的逻辑

						if (res.data.code === 200) {
							this.images.push(res.data.data)
							// 上传成功推入
						}
					}
				} catch (error) {

					// 在这里可以处理上传失败后的逻辑
				}
			},
			commentSend() {
				if (!this.commentText && !this.images.length) {
					uni.showToast({
						icon: 'none',
						title: '再多说点什么吧~'
					})
					return
				}
				// 将数组改为字符串
				const images = this.images.join(',')
				this.$http.post('/comments/add', {
					article_id: this.commentAuthor.article_id,
					content: this.commentText ? this.commentText : images ? '[图片]' : '',
					images: images,
					pid: this.pid,
				}).then(res => {
					if (res.data.code === 200) {
						this.commentText = ''
						this.commentBoxOpen = false
						this.images = []
						uni.showToast({
							icon: 'none',
							title: '评论' + res.data.msg
						})
					}
					setTimeout(() => {
						this.$refs.comments.reload()
					}, 400)
				}).catch(err => {
			
					uni.showToast({
						icon: "none",
						title: err.data.msg
					})
				})
			},
		}
	}
</script>

<style lang="scss">

</style>