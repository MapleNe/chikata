<template>
	<z-paging ref="paging" v-model="chatList" use-page-scroll use-chat-record-mode safe-area-inset-bottom
		@query="getChatList">
		<template #top>
			<tn-nav-bar :customBack="true" :bottomShadow="true">
				<view slot="back" class="tn-margin-top" @tap.stop="back">
					<text class="tn-icon-left tn-text-xl"></text>
				</view>
				<text v-if="chatInfo">
					{{chatInfo.nickname}}
				</text>
				<view slot="right" class="tn-padding">
					<text class="tn-icon-menu"></text>
				</view>
			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<view class="tn-margin-sm" v-if="chatList">
			<view class="tn-margin-bottom" v-for="(item,index) in chatList" :key="index" :id="`z-paging-${index}`">
				<view class="tn-flex tn-flex-start" v-if="!isMine(item.sendId)">
					<view>
						<tn-avatar :src="chatInfo.head_img"></tn-avatar>
					</view>
					<view class="tn-margin-left-sm tn-margin-right-xl tn-bg-white tn-padding-sm"
						style="border-radius: 10rpx;">
						<text style="line-break: anywhere;">{{item.text}}</text>
					</view>
				</view>
				<view v-if="isMine(item.sendId)" class="tn-flex tn-flex-start tn-flex-direction-row-reverse">
					<view>
						<tn-avatar :src="userInfo.head_img"></tn-avatar>
					</view>
					<view class="tn-margin-right-sm tn-margin-left-xl tn-bg-white tn-padding-sm"
						style="border-radius: 10rpx;">
						<text style="line-break: anywhere;">{{item.text}}</text>
					</view>
				</view>
			</view>
		</view>
		<template #bottom>
			<view class="tn-bg-white tn-border-solid tn-border-solid-top">
				<view class=" tn-flex tn-margin-sm tn-flex-col-center tn-flex-row-between">
					<view class="tn-bg-gray--light tn-flex-basic-lg ch-radius tn-padding-xs tn-no-padding-bottom">
						<tn-input type="textarea" v-model="chatText" :height="40" :autoHeight='true'
							:clearable="false" />
					</view>
					<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-left tn-flex-1">
						<text class="tn-icon-emoji-good tn-text-xxl"></text>
						<text class="tn-icon-image tn-text-xxl"></text>
						<tn-button size="sm" backgroundColor="#29b7cb" fontColor="tn-color-white"
							@tap="sendMessage">发送</tn-button>
					</view>
				</view>
			</view>
		</template>
	</z-paging>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import WS from "@/utils/webSocket.js";
	export default {
		data() {
			return {
				chatList: [],
				chatInfo: {
					users_id: 0,
					nickname: null,
					head_img: ''
				},
				chatText: null,
				isFoucs: false,
				ws: null,
			};
		},
		onLoad(params) {
			this.chatInfo = params
		},
		created() {
			uni.$on('getNewChat', data => {
				if (data) {
					this.addNewChat(data)
				}
			})
		},
		onUnload() {
			uni.$off('getNewChat')
		},
		computed: {
			...mapState(['userInfo']),
			isMine() {
				return function(sendId) {
					return sendId === this.userInfo.id
				}
			}
		},
		onPageScroll(e) {
			//如果滚动到顶部，触发加载更多聊天记录
			if (e.scrollTop < 10) {
				this.$refs.paging.doChatRecordLoadMore();
			}

		},
		methods: {
			addNewChat(msg) {
				if (this.$refs.paging && this.$refs.paging.addChatRecordData) {
					this.$refs.paging.addChatRecordData(msg)
				}
			},
			getChatList(page, num) {
				this.$http.get('/Chat/history', {
					params: {
						page: page,
						limit: 20,
						id: this.chatInfo.users_id ? this.chatInfo.users_id : ''
					}
				}).then(res => {

					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			getNowTime() {
				const date = new Date()
				// 格式化时间
				const year = date.getFullYear()
				const month = (date.getMonth() + 1).toString().padStart(2, '0')
				const day = date.getDate().toString().padStart(2, '0')

				const hours = date.getHours().toString().padStart(2, '0')
				const minutes = date.getMinutes().toString().padStart(2, '0')
				const seconds = date.getSeconds().toString().padStart(2, '0')

				// 拼接格式化后的时间字符串
				const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

				return formattedTime
			},
			sendMessage() {
				if (this.chatText === null) {
					return
				};
				const msg = this.chatText
				this.chatText = null
				const data = {
					type: 'chat',
					text: msg,
					sendId: this.userInfo.id,
					receId: this.chatInfo.users_id
				}
				const message = JSON.stringify(data)
				// this.ws.webSocketSendMsg('发送信息')
				uni.sendSocketMessage({
					data: message,
					success: (res) => {
						this.$refs.paging.addChatRecordData({
							id: '',
							sendId: this.userInfo.id,
							text: msg,
							create_time: this.getNowTime(),
						});
						console.log(res, '发送成功')
						this.scrollToBottom()
					},
					fail: (err) => {
						console.error('发送消息失败:', err);
					}
				});
			},
			showSendBtn(text) {
				if (text) {
					this.isFoucs = true
				} else {
					this.isFoucs = false
				}
			},

			scrollToBottom() {
				this.$nextTick(function() {
					setTimeout(() => {
						uni.pageScrollTo({
							scrollTop: 99999,
							duration: 0
						})
					}, 200) // 要加点延迟, 不然有可能不生效
				});
			},
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
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f8f7;
	}

	.ch-radius {
		border-radius: $ch-radius;
	}
</style>