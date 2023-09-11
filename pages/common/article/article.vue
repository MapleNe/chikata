<template>
	<z-paging-swiper>
		<swiper class="swiper" :current="swiperIndex" @animationfinish="swiperAnimationfinish">
			<swiper-item>
				<z-paging ref="paging" @query="getComment" v-model="comments" :safe-area-inset-bottom="true"
					:auto-scroll-to-top-when-reload="false" :auto-clean-list-when-reload="false" @scroll="onScroll">
					<template #top>
						<tn-nav-bar :zIndex="5" backTitle="">
							<text v-show="!navAuthor"
								v-if="article.expand.sort&&article.expand.sort.length>0">{{article.expand.sort[0].name}}</text>
							<view class="tn-flex tn-flex-1 tn-flex-col-center tn-flex-row-between" v-show="navAuthor">
								<view class="tn-flex tn-flex-col-center" @tap.stop="swiperIndex=1">
									<tn-avatar :src="article.expand.author.head_img"></tn-avatar>
									<text class="tn-margin-left-sm">{{article.expand.author.nickname}}</text>
								</view>
								<view>
									<tn-button plain :fontSize="30" size="sm" padding="0 15rpx"
										backgroundColor="#29b7cb" fontColor="#29b7cb" v-if="!article.expand.focus"
										@click="followUser()">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-icon-add tn-margin-right-xs"></text>
											<text>关注</text>
										</view>
									</tn-button>
									<tn-button :fontSize="30" size="sm" padding="0 20rpx"
										backgroundColor="tn-bg-gray--light" fontColor="tn-color-gray"
										@click="showCancelFollow = true" v-else>
										<text>已关注</text>
									</tn-button>
								</view>
							</view>
							<view slot="right" class="tn-padding" @tap.stop.prevent="showShare = !showShare">
								<text class="tn-text-bold tn-text-lg tn-icon-more-horizontal"></text>
							</view>
						</tn-nav-bar>
						<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
					</template>
					<!-- 页面内容 -->
					<view class="tn-margin" v-if="article" id="article">
						<view class="tn-flex tn-flex-col-center tn-flex-row-between">
							<view class="tn-flex tn-flex-col-center" style="position: relative;">
								<tn-avatar :src="article.expand.author.head_img" @click="swiperIndex=1"></tn-avatar>
								<text v-if="article.expand.author.level==='admin'"
									class="tn-margin-left-xs tn-color-blue tn-icon-trusty-fill"
									style="position: absolute;top: 40rpx;left: 30rpx; z-index: 9999;"></text>
								<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
									<view class="tn-flex tn-flex-col-center">
										<text class="tn-text-bold">{{article.expand.author.nickname}}</text>

										<text class="level tn-margin-left-xs level-text"
											:class="['lv-'+article.expand.author.grade]"
											:style="{'color':level[article.expand.author.grade]}"></text>
									</view>

								</view>
							</view>
							<view>
								<tn-button plain :fontSize="30" size="sm" padding="0 15rpx" backgroundColor="#29b7cb"
									fontColor="#29b7cb" v-if="!article.expand.focus" @click="followUser()">
									<view class="tn-flex tn-flex-col-center">
										<text class="tn-icon-add tn-margin-right-xs"></text>
										<text>关注</text>
									</view>
								</tn-button>
								<tn-button :fontSize="30" size="sm" plain padding="0 20rpx"
									backgroundColor="tn-bg-gray--light" fontColor="tn-color-gray"
									@click="showCancelFollow = true" v-else>
									<text>已关注</text>
								</tn-button>
							</view>
						</view>
						<view class="tn-margin-top tn-flex tn-flex-direction-column">
							<text class="tn-text-bold tn-text-xxl">{{article.title}}</text>
							<view
								class="tn-flex tn-flex-row-center tn-color-grey--disabled tn-text-sm tn-margin-top-sm">
								<text>帖子发表：{{getDateDiff(article.create_time)}}</text>
								<view v-if="article.create_time!==article.last_update_time">
									<text class="tn-margin-left-sm tn-margin-right-sm">|</text>
									<text>最后编辑：{{getDateDiff(article.last_update_time)}}</text>
								</view>
							</view>
						</view>

						<view class="tn-margin-top" style="max-width: 100%;" @touchend="touchEnd"
							@touchmove="touchMove">
							<mp-html :tag-style="{img:'border-radius:10rpx'}" :img-cache="true" :show-img-menu="imgMenu"
								:content="article.content" :selectable="true" />
						</view>
						<view class="tn-margin-top-sm">
							<view class="tn-margin-top-xs">
								<view class="tn-flex tn-flex-col-center tn-flex-wrap"
									v-if="article.expand.tag && article.expand.tag.length>0">
									<view
										class="tn-bg-grey--light tn-text-sm tn-margin-bottom-xs tn-color-gray--dark tn-margin-right-sm tn-padding-xs"
										style="border-radius: 10rpx;" v-for="tags in article.expand.tag" :key="tags.id">
										<text>{{tags.name}}</text>
									</view>
								</view>
								<view
									class="tn-flex tn-flex-col-center tn-text-sm tn-color-grey--disabled tn-margin-top-sm">
									<view class="tn-flex tn-flex-col-center  tn-margin-right">
										<text class="tn-icon-fire tn-margin-right-xs"></text>
										<text class="tn-margin-right-xs">浏览数：</text>
										<text>{{article.views}}</text>
									</view>
									<!-- <view >
										<text class="tn-icon-tip tn-margin-right-xs"></text>
										<text>已开启创作声明，允许规范转载</text>
									</view> -->
								</view>

							</view>
						</view>
					</view>

					<view class="tn-padding-xs tn-bg-gray--light"></view><!-- 间隔 -->
					<!-- 文章详情 结束 -->
					<!-- 评论区 开始 -->
					<view class="tn-color-grey" style="position: sticky;top: 0;z-index: 9999;">
						<z-tabs ref="tabs" :current="tabsIndex" active-color="#29b7cb" :scrollCount="1"
							@change="changeComentTab" :list="tabs"></z-tabs>

					</view>
					<view class="tn-margin">
						<view class="tn-margin-top">
							<view v-for="(item,index) in comments" :key="index">
								<view class="tn-flex tn-flex-col-center tn-text-md">
									<tn-avatar :src="item.expand.head_img"
										@click="article.users_id==item.users_id?swiperIndex=1:goProfile(item.users_id)"></tn-avatar>
									<view class="tn-flex tn-col-center tn-flex-direction-column tn-margin-left-sm">
										<view class="tn-flex tn-flex-col-center">
											<text>{{item.nickname}}</text>
											<text v-if="article.users_id === item.users_id"
												class="tn-margin-left-xs tn-text-xs tn-radius ch-bg-main--light ch-color-primary"
												style="padding:5rpx 8rpx">楼主</text>

											<text class="level tn-margin-left-xs level-text"
												:class="['lv-'+item.expand.user.grade]"
												:style="{'color':level[item.expand.user.grade]}"></text>

										</view>

									</view>
								</view>
								<view class="tn-margin tn-margin-top-sm tn-padding-left-xl"
									style="overflow: hidden;word-wrap: break-word" @tap="subReply(item)">
									<!-- {{item.content}} -->
									<mp-html :content="item.content"></mp-html>
								</view>
								<!-- 子评论 -->
								<view class="tn-margin">
									<view class="tn-margin-left-xl tn-padding-sm tn-bg-gray--light ch-radius"
										v-if="item.son.length>0"
										@tap.stop.prevent="showComment= !showComment;subId=item.id;subCommentAuthor=item">
										<!-- 这里只显示两条防止太多评论导致的过长 -->
										<block v-for="(subComment, subIndex) in item.son" :key="subIndex"
											v-if="subIndex<2">
											<view class=" tn-text-md">
												<text class="tn-color-indigo"
													@tap.stop.prevent="goProfile(subComment.users_id)">{{subComment.nickname}}</text>
												<text v-if="article.users_id === subComment.users_id"
													class="tn-margin-left-xs tn-text-xs tn-radius ch-bg-main--light ch-color-primary"
													style="padding:5rpx 8rpx">楼主</text>
												<text class="tn-margin-left-xs">：</text>
												<mp-html container-style="display:inline;white-space:nomarl;"
													:content="subComment.content" :selectable="true"></mp-html>
											</view>
										</block>
										<view class="tn-flex tn-flex-col-center tn-margin-top-sm tn-color-gray--dark"
											v-if="item.son.length>2">
											<text>全部{{item.son.length}}条评论</text>
											<text class="tn-icon-right tn-text-md"></text>
										</view>
									</view>
								</view>

							</view>
						</view>
					</view>
					<template #bottom>
						<!-- 底部开始 -->
						<view class="tn-padding tn-bg-white tn-flex tn-flex-col-center">
							<view class="tn-bg-gray--light tn-padding-left tn-round tn-margin-right">
								<tn-input :disabled="true" placeholder="我想说..."
									@click="commentAllow?commentAction():''"></tn-input>
							</view>
							<view
								class="tn-flex tn-text-sm tn-flex-col-center tn-color-gray--dark tn-flex-basic-sm tn-flex-row-between"
								style="margin-left: auto;">
								<view class="tn-flex tn-flex-col-center tn-flex-direction-column"
									v-if="article.expand.favorites" @tap.stop="favorite()">
									<text class="tn-text-xxl"
										:class="article.expand.favorites.is_favorites?'tn-icon-star-fill tn-color-orangered':'tn-icon-star'"></text>
									<text>{{article.expand.favorites.favorites_count}}</text>
								</view>
								<view class="tn-flex tn-flex-col-center tn-flex-direction-column">
									<text class="tn-text-xxl tn-icon-comment"></text>
									<text>{{article.expand.comments.count}}</text>
								</view>
								<view class="tn-flex tn-flex-col-center tn-flex-direction-column"
									:class="article.expand.like.is_like?'tn-color-red':''" @tap.stop="likeAction">
									<text class=" tn-text-xxl"
										:class="article.expand.like.is_like?' tn-icon-praise-fill':'tn-icon-praise'"></text>
									<text>{{article.expand.like.likes_count}}</text>
								</view>
							</view>
						</view>
						<!-- 底部 结束 -->
					</template>

				</z-paging>


				<!-- 弹出层 开始 -->
				<tn-popup v-model="commentBoxOpen" mode="bottom" :borderRadius="20" :zIndex="999"
					@close="resetComment();showEmoji=false">
					<view class="tn-margin">
						<view class="tn-bg-gray--light tn-padding-sm"
							style="height: 150rpx;overflow: hidden; border-radius: 10rpx;">
							<tn-input type="textarea" v-model="commentText" :clearable="false"
								:placeholder="commentBoxText" :autoHeight="false"></tn-input>
						</view>
					</view>
					<view class="tn-flex tn-margin tn-flex-col-center tn-flex-row-between">
						<view class="tn-flex tn-flex-col-center">
							<text class="tn-text-xl tn-margin-right" v-for="(item,index) in commentBtn" :key="index"
								:class="item.icon" @tap.stop="commentBtnTap(index)"></text>
						</view>
						<view class="">
							<tn-button :plain="true" size="sm" backgroundColor="#29b7cb" fontColor="#29b7cb"
								blockRepeatClick @click="commentCheck">发送~</tn-button>
						</view>
					</view>
					<view v-show="showEmoji">
						<v-tabs v-model="emojiIndex" :tabs="emojiTabs" @change="changeTab" lineHeight="8rpx"
							lineColor="#29b7cb" activeColor="#29b7cb" :lineScale="0.2"></v-tabs>
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
				<!-- 分享 -->
				<tn-popup mode="bottom" :borderRadius="30" v-model="showShare">
					<view class="tn-margin">
						<view class="tn-flex tn-flex-row-center tn-margin-bottom">
							<text class="tn-text-sm tn-color-gray">分享到</text>
						</view>
						<view class="tn-flex tn-flex-col-center tn-flex-row-between">
							<view
								class="tn-flex tn-flex-col-center tn-text-lg tn-color-gray--dark tn-flex-direction-column"
								v-for="item in shareProvider" :key="item.provider">
								<view :class="[item.icon,item.color]"
									class="tn-round tn-color-white tn-text-xxl tn-padding">
								</view>
								<text class="tn-margin-top-sm">{{item.name}}</text>
							</view>
						</view>
						<view class="tn-margin-top">
							<view class="tn-flex">
								<view
									class="tn-flex tn-color-gray--dark tn-flex-col-center tn-flex-direction-column tn-margin-right">
									<text
										class="tn-icon-warning tn-text-xxl tn-round tn-bg-gray--light tn-padding"></text>
									<text class="tn-text-lg tn-margin-top-sm">举报</text>
								</view>

								<view class="tn-flex tn-color-gray--dark tn-flex-col-center tn-flex-direction-column"
									v-if="article.users_id == userInfo.id" @tap.stop.prevent="goEdit">
									<text class="tn-icon-edit tn-text-xxl tn-round tn-bg-gray--light tn-padding"></text>
									<text class="tn-text-lg tn-margin-top-sm">编辑</text>
								</view>
							</view>
						</view>
					</view>
					<view class="tn-bg-gray--light tn-text-center tn-padding"
						@tap.stop.prevent="showShare = !showShare">
						<text class="tn-text-bold">取消</text>
					</view>
				</tn-popup>
				<!-- 评论详情 -->
				<tn-popup v-model="showComment" mode="bottom" length="70%" :borderRadius="20" :zIndex="3">
					<z-paging ref="subComment" @query="getSubComment" v-model="subComment" :refresher-enabled="false">
						<template#top>
							<view class="tn-margin">
								<view class="tn-flex tn-flex-col-center  tn-text-xxl tn-text-bold tn-flex-row-between">
									<text class="tn-icon-close"></text>
									<text class="tn-icon-more-horizontal"></text>
								</view>
							</view>
</template>
<view class="tn-margin tn-no-margin-top" v-if="subCommentAuthor">
	<view class="tn-flex tn-flex-col-center tn-text-md">
		<tn-avatar :src="subCommentAuthor.expand.head_img"></tn-avatar>
		<view class="tn-flex tn-col-center tn-flex-direction-column tn-margin-left-sm">
			<view class="tn-flex tn-flex-col-center">
				<text>{{subCommentAuthor.nickname}}</text>
				<text v-if="article.users_id === subCommentAuthor.users_id"
					class="tn-margin-left-xs tn-text-xs tn-radius ch-bg-main--light ch-color-primary"
					style="padding:5rpx 8rpx">楼主</text>
				<text class="level tn-margin-left-xs level-text" :class="['lv-'+subCommentAuthor.expand.user.grade]"
					:style="{'color':level[subCommentAuthor.expand.user.grade]}"></text>

			</view>
			<text class="tn-text-sm tn-color-grey--disabled">{{getDateDiff(subCommentAuthor.create_time)}}</text>
		</view>
	</view>
	<view class="tn-margin tn-margin-top-sm tn-padding-left-xl" style="overflow: hidden;word-wrap: break-word"
		@tap="subReply(subCommentAuthor)">
		<!-- {{item.content}} -->
		<mp-html :content="subCommentAuthor.content"></mp-html>
	</view>
</view>
<view class="tn-padding-xs tn-bg-gray--light"></view>
<block v-for="(item,index) in subComment" :key="index">
	<view class="tn-margin">
		<view class="tn-flex tn-flex-col-center tn-text-md">
			<tn-avatar :src="item.expand.head_img" @click="goProfile(item.users_id)"></tn-avatar>
			<view class="tn-flex tn-col-center tn-flex-direction-column tn-margin-left-sm">
				<view class="tn-flex tn-flex-col-center">
					<text>{{item.nickname}}</text>
					<text v-if="article.users_id === item.users_id"
						class="tn-margin-left-xs tn-text-xs tn-radius ch-bg-main--light ch-color-primary"
						style="padding:5rpx 8rpx">楼主</text>
					<text class="level tn-margin-left-xs level-text" :class="['lv-'+item.expand.user.grade]"
						:style="{'color':level[item.expand.user.grade]}"></text>
				</view>
			</view>
		</view>
		<view class="tn-margin tn-margin-top-xs tn-padding-left-xl" @tap="subReply(item)">
			<view>
				<text class="tn-margin-right-xs" v-if="item.pid != subCommentAuthor.id">回复</text>
				<text class="tn-color-indigo" @tap.stop.prevent="goProfile(item.expand.pid.users_id)"
					v-if="item.pid != subCommentAuthor.id">{{item.expand.pid.nickname}}</text>
				<text v-if="item.pid != subCommentAuthor.id">：</text>
				<mp-html container-style="display:inline;white-space:nomarl;" :content="item.content"></mp-html>
			</view>
		</view>
	</view>
</block>
<template #bottom>
	<view class="tn-bg-gray--light tn-padding-sm">
		<view class="tn-bg-white tn-padding-left tn-radius">
			<tn-input :disabled="true" :placeholder="'回复：'+subCommentAuthor.nickname"
				@click="commentAllow?subReply(subCommentAuthor):''"></tn-input>
		</view>
	</view>

</template>
</z-paging>

</tn-popup>
</view>
</swiper-item>
<swiper-item v-if="params">
	<userProfile :users_id="Number(params.users_id)" @edit="is_edit = true"></userProfile>
</swiper-item>
</swiper>
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
</z-paging-swiper>
</template>

<script>
	import userProfile from '@/pages/common/userProfile/userProfile';
	import store from '../../../store';
	export default {
		components: {
			userProfile
		},
		data() {
			return {
				tabs: ['全部评论', '只看楼主'],
				tabsIndex: 0,
				swiperIndex: 0,
				commentBoxText: '我想说...', //底部盒子显示的信息
				subCommentBoxText: null,
				commentText: '', //这个才是回复的信息
				commentBoxOpen: false, //控制弹出层
				comments: [], //获取到的评论列表
				showShare: false,
				showComment: false,
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
				shareProvider: [{
						provider: 'wechat',
						icon: 'tn-icon-wechat-fill',
						color: 'tn-bg-green',
						name: '微信'
					},
					{
						provider: 'friend',
						icon: 'tn-icon-moments',
						color: 'tn-bg-teal',
						name: '朋友圈'
					},
					{
						provider: 'qq',
						icon: 'tn-icon-qq',
						color: 'tn-bg-blue',
						name: 'QQ'
					},
					{
						provider: 'qqZone',
						icon: 'tn-icon-star-fill',
						color: 'tn-bg-orangeyellow',
						name: 'QQ空间'
					},
					{
						provider: 'link',
						icon: 'tn-icon-link',
						color: 'tn-bg-grey--disabled',
						name: '复制链接'
					}
				],
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
				isBackCount: 0,
				navAuthor: false,
				authorComments: [],
				commentAllow: true,
				imgMenu: true,
				showAt: false,
				subId: null,
				subComment: [],
				subCommentAuthor: null,
				is_edit: false,
				goLogin: false,
				showCancelFollow: false,
			}
		},
		onPageScroll(e) {
			console.log(e)
		},
		onLoad(params) {
			this.params = params
			this.getArticle()
		},
		beforeRouteLeave(to, from, next) {
			//退出前判断
			switch (true) {
				case this.swiperIndex > 0:
					if (this.is_edit) {
						this.is_edit = !this.is_edit;
						next();
					} else if (to.NAVTYPE == 'push') {
						next();
					} else {
						this.swiperIndex = 0;
						this.$Router.$lockStatus = false
					}
					break;
				case !this.commentBoxOpen && !this.showComment:
					next();
					break;
				case this.commentBoxOpen:
				case this.showComment:
					this.commentBoxOpen = false;
					this.showComment = false;
					this.$Router.$lockStatus = false;
					next(false);
					break;
				case this.goLogin:
					next();
					break;
				default:
					next();
					break;
			}
		},
		created() {
		},
		computed: {},
		methods: {
			getArticle() {
				this.$http.get('/article/one', {
					params: {
						id: this.params.id,
						mode: 'html'
					}
				}).then(res => {
					console.log(res)
					if (res.data.code == 200) {
						this.article = res.data.data
						this.commentDisAllow = res.data.data.opt.comments.allow
						if (!res.data.data.opt.comments.allow) this.commentBoxText = '作者关闭了评论...';
					}

				}).catch(err => {

				})
			},
			getComment(page, num) {
				this.$http.get('/comments/article', {
					params: {
						article_id: this.params.id,
						limit: num,
						page: page,
						tree: false
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data.data)
						setTimeout(() => {
							const author = res.data.data.data.filter(item => item.users_id === this
								.article.users_id);
							const uniqueAuthor = author.filter(item => !this.authorComments.some(
								comment => comment.id === item.id));
							this.authorComments = this.authorComments.concat(uniqueAuthor);

						}, 10)


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
			followUserAction(data) {},
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

							this.article.expand.focus = !this.article.expand.focus
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
				if (store.state.hasLogin && uni.getStorageSync('token')) {
					this.commentBoxOpen = true,
						this.commentBoxText = '我想说...',
						this.pid = 0
				} else {
					this.$Router.push({
						path: '/pages/user/login',
						animation: {
							animationType: 'slide-in-bottom',
							animationDuration: 350
						},
					})
				}
			},
			//关闭popup重置placeholder
			resetComment() {
				this.pid = 0
			},
			subReply(item) {
				if (store.state.hasLogin && uni.getStorageSync('token')) {
					this.commentBoxOpen = true
					this.commentBoxText = '回复:' + item.nickname
					this.pid = item.id
				} else {
					this.goLogin = true
					this.$Router.push({
						path: '/pages/user/login',
						animation: {
							animationType: 'slide-in-bottom',
							animationDuration: 350
						},
					})
				}
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
					console.log(res)
					if (res.data.code === 200) {
						uni.showToast({
							icon: 'none',
							title: '评论' + res.data.msg
						})
						this.commentText = ''
					}
					setTimeout(() => {
						this.commentBoxOpen = false
						if (this.showComment) {
							this.$refs.subComment.reload()
						} else {
							this.$refs.paging.reload()
						}

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
			goComment(id) {
				this.$Router.push({
					path: '/pages/common/article/comment/comment',
					query: {
						id: id
					}
				})
			},
			goEdit() {
				uni.$emit('editArticle', this.article)
				this.$Router.push({
					path: '/pages/tabbar/publish/publish',
					query: {
						id: this.article.id,
						update: 1,
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
			changeComentTab(index) {
				this.tabsIndex = index
				if (this.tabsIndex) {
					this.$refs.paging.complete(this.authorComments)
				} else {
					this.$refs.paging.reload()
				}
			},
			onScroll(e) {
				const scrollTop = e.detail.scrollTop
				this.navAuthor = scrollTop >= 60 ? true : false
			},
			getElementHeight(element) {
				let query = uni.createSelectorQuery().in(this);
				query.select(element).boundingClientRect(data => {
					console.log(data.height);
					this.articleHeight = data.height;
				}).exec()
			},
			goProfile(id) {
				this.$Router.push({
					path: '/pages/common/userProfile/userProfile',
					query: {
						id: id
					}
				})
			},
			getSubComment(page, num) {
				this.$http.get('/comments/one', {
					params: {
						page: page,
						limit: num,
						id: this.subId,
						tree: false,
					}
				}).then(res => {
					console.log(res, '评论')
					if (res.data.code === 200) {
						this.$refs.subComment.complete(res.data.data.son)
					}

				})
			},
			favorite() {
				this.$http.post('/favorites/modify', {
					article_id: this.article.id
				}).then(res => {
					if (res.data.code === 200) {
						if (this.article.expand.favorites.is_favorites) {
							this.article.expand.favorites.favorites_count--

						} else {
							this.article.expand.favorites.favorites_count++

						}
						this.article.expand.favorites.is_favorites = !this.article.expand.favorites.is_favorites
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					}

				}).catch(err => {
					uni.showToast({
						icon: 'none',
						title: res.data.msg
					})
				})
			},
			swiperAnimationfinish(e) {
				this.swiperIndex = e.detail.current;
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
			touchEnd() {
				this.imgMenu = true;
			},
			touchMove(e) {
				// 手指触摸后的移动事件
				this.imgMenu = false;
			},
			imageChoose() {
				uni.chooseImage({
					count: 1,
					success: (res) => {
						console.log(res)
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: auto;
	}

	.swiper {
		height: 100%;
	}

	.emoji {
		width: 40rpx !important;
		height: 40rpx !important;
	}

	.ch-radius {
		border-radius: 10rpx;
	}

	image {
		border-radius: 10rpx;
	}

	img {
		border-radius: 10rpx;
	}
</style>