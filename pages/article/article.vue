<template>
	<view>
		<tn-nav-bar customBack :zIndex="2">
			<view slot="back" class="tn-margin-top-sm tn-flex tn-flex-col-start" @tap="back">
				<text class="tn-icon-left tn-text-xxl"></text>
				<view class="tn-flex tn-flex-col-center" v-if="secondNav">
					<tn-avatar size="sm" :src="article.expand.author.head_img"></tn-avatar>
					<text class="tn-margin-left-sm">{{article.expand.author.nickname}}</text>
				</view>
			</view>
			{{article.title}}
		</tn-nav-bar>
		<!-- 页面内容 -->
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<!-- 文章详情 开始 -->
		<mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :safearea="true"
			bottom="100rpx">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<view class="tn-flex tn-flex-col-center">
						<tn-avatar :src="article.expand.author.head_img"></tn-avatar>
						<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
							<text>{{article.expand.author.nickname}}</text>
							<text class="tn-text-xs">{{getDateDiff(article.create_time)}}</text>
						</view>
					</view>
					<view>
						<tn-button size="sm" :plain="true" shape="round">关注</tn-button>
					</view>
				</view>
				<view class="tn-margin-top" style="max-width: 100%;">
					<mp-html :content="article.content" />
				</view>
				<view class="tn-flex tn-flex-col-center">
					<view v-for="(category,index) in article.expand.sort" :key="index"
						class="tn-flex tn-flex-col-center tn-bg-gray--light tn-radius">
						<tn-avatar size="sm" :src="category.opt.head_img"></tn-avatar>
						<text class="tn-margin-left-xs tn-margin-right-xs tn-text-sm">{{category.name}}</text>
					</view>
				</view>
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
						<view class="tn-flex tn-flex-col-center">
							<tn-avatar :src="item.expand.head_img"></tn-avatar>
							<view class="tn-flex tn-col-center tn-flex-direction-column tn-margin-left-sm">
								<text>{{item.nickname}}</text>
								<text class="tn-text-xs">{{getDateDiff(item.create_time)}}</text>
							</view>
						</view>
						<view class="tn-margin tn-padding-left-xl" style="overflow: hidden;word-wrap: break-word">
							<!-- {{item.content}} -->
							<mp-html :content="item.content"></mp-html>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>
		<!-- 底部开始 -->
		<view style="position: fixed;bottom: 0;width: 100%;z-index: 2;"
			class="tn-padding tn-bg-white tn-flex tn-flex-col-center">
			<view class="tn-bg-gray--light tn-padding-left tn-round">
				<tn-input :disabled="true" :placeholder="commentBoxText" @click="commentAction"></tn-input>
			</view>
			<view class="tn-flex tn-flex-row-around tn-text-xl tn-flex-basic-md">
				<text class="tn-icon-fire"></text>
				<text class="tn-icon-message"></text>
				<text class="tn-icon-like"></text>
			</view>
		</view>
		<!-- 底部 结束 -->
		<!-- 弹出层 开始 -->
		<tn-popup v-model="commentBoxOpen" mode="bottom" :borderRadius="10" :zIndex="3">
			<view class="tn-margin">
				<view class="tn-bg-gray--light tn-padding-sm"
					style="height: 150rpx;overflow: hidden; border-radius: 10rpx;">
					<tn-input type="textarea" v-model="commentText" :clearable="false" :placeholder="commentBoxText"
						:autoHeight="false"></tn-input>
				</view>
			</view>
			<view class="tn-margin tn-text-right">
				<tn-button shape="round" :plain="true" size="sm" @click="commentCheck">发送~</tn-button>
			</view>
		</tn-popup>
	</view>

</template>

<script>
	// import {
	// 	token
	// } from '../../static/config';
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin], // 使用mixin
		data() {
			return {
				mescroll: null,
				commentBoxText: '我想说...', //底部盒子显示的信息
				commentText: null, //这个才是回复的信息
				commentBoxOpen: false, //控制弹出层
				comments: [], //获取到的评论列表
				article: {
					expand: {
						author: {},
						comments: {
							count: 0
						}
					}
				},
				params: [], //页面传参
				secondNav: false,
				token: null,
			}
		},

		onLoad(params) {
			this.params = params
			this.getArticle()
			this.token = uni.getStorageSync('token')
		},
		onPageScroll(scroll) {
			let scrollTop = scroll.scrollTop
			if (scrollTop >= this.vuex_custom_bar_height) {
				this.secondNav = true
			} else {
				this.secondNav = false
			}
		},
		methods: {
			getArticle() {
				this.$http.get('/article/one', {
					params: {
						id: this.params.id,
						mode: 'html'
					}
				}).then(res => {
					if (res.data.code == 200) {
						let data = res.data.data
						this.article = data
						console.log(this.article)
					}
				})
			},
			upCallback(mescroll) {
				let num = mescroll.size
				let page = mescroll.num
				this.$http.get('/comments/article', {
					params: {
						article_id: this.params.id,
						limit: num,
						page: page

					}
				}).then(res => {
					if (res.data.code === 200) {
						let data = res.data.data
						if (page === 1) this.comments = []
						this.comments = this.comments.concat(data.data)
						mescroll.endByPage(data.count, data.page, 1000);
						// console.log(data.count, data.page)

					}
				})
			},
			commentAction() {
				this.commentBoxOpen = true
			},
			commentCheck() {
				if (this.commentText === null) {
					uni.showToast({
						icon: 'none',
						title: '不说点什么？'
					})
				} else {
					this.commentSend()
				}
			},
			commentSend() {
				this.$http.post('/comments/add', {
					article_id: this.article.id,
					content: this.commentText,
				}, {
					header: {
						'Authorization': this.token,
					}
				}).then(res => {
					if (res.data.code === 200) {
						uni.showToast({
							icon: 'none',
							title: '评论' + res.data.msg
						})
						this.commentText = null
					}
					setTimeout(() => {
						this.commentBoxOpen = false
						this.mescroll.resetUpScroll()

					}, 800)
				}).catch(err => {
					console.log(err)
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
		}
	}
</script>

<style>
	page {
		height: auto;
	}
</style>