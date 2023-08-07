<template>
	<view>
		<z-paging ref="paging" @query="getComment" v-model="comments">
			<template #top>
				<view class="tn-flex tn-flex-row-between tn-margin tn-text-bold">
					<text class="tn-text-bold">评论列表</text>
					<text>ID:{{id}}</text>
					<view class="tn-flex tn-flex-col-center" @tap.stop="goAticle()">
						<text class="tn-icon-open tn-text-lg"></text>
						<text>详情</text>
					</view>
				</view>
			</template>
			<view class="tn-margin tn-no-margin-top">
				<view v-for="(item,index) in comments" :key="index">
					<ls-skeleton :skeleton="commentSk" :loading="loading">
						<view class="tn-flex tn-flex-col-center">
							<tn-avatar :src="item.expand.head_img"></tn-avatar>
							<view class="tn-flex tn-col-center tn-flex-direction-column tn-margin-left-sm">
								<text class="tn-text-bold">{{item.nickname}}</text>
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
										<view class="tn-flex tn-col-center tn-flex-direction-column tn-margin-left-sm">
											<view class="tn-flex tn-flex-col-center">
												<text class="tn-text-bold">{{subComment.nickname}}</text>
												<!-- 写一段注释 这个是父评论的id不等于子评论的pid里的id才会显示-->
												<view v-if="item.id !== subComment.expand.pid.id"
													class="tn-flex tn-flex-col-center">
													<text class="tn-icon-right-triangle"></text>
													<text class="tn-text-bold">{{subComment.expand.pid.nickname}}</text>
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
		</z-paging>
	</view>
</template>

<script>
	export default {
		props: {
			id: {
				type: Number,
				default: null
			}
		},
		name: "commentList",
		data() {
			return {
				commentBoxText: '我想说...', //底部盒子显示的信息
				commentText: null, //这个才是回复的信息
				commentBoxOpen: false, //控制弹出层
				comments: [], //获取到的评论列表
				commentSk: [
					'circle+line-sm*2',
					10,
					'line-sm*3'
				],
				loading: true,
			};
		},
		methods: {
			async getComment(page, num) {
				await this.$http.get('/comments/article', {
					params: {
						article_id: this.id,
						limit: num,
						page: page,
						tree: false
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data.data)
						setTimeout(() => {
							this.loading = false
						}, 600)
					}
				}).catch(err => {
					this.$refs.paging.complete(false)
				})
			},
			goAticle(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.id
					},
				})
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
					pid: this.pid,
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
						this.$refs.paging.reload()

					}, 800)
				}).catch(err => {
					console.log(err)
				})
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

<style lang="scss">

</style>