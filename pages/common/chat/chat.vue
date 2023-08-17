<template>
	<z-paging ref="paging" v-model="chatList" use-page-scroll use-chat-record-mode>
		<template #top>
			<view class="tn-margin-sm tn-flex tn-flex-row-between tn-flex-col-center">
				<text class="tn-icon-left tn-text-xxl" @tap.stop="back"></text>
				<text>{{chatInfo.nickname}}</text>
				<text>菜单</text>
			</view>
		</template>
	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				chatList: [],
				chatInfo: {},
			};
		},
		onLoad(params) {
			this.chatInfo = params.query.params
			console.log(this.chatInfo)
		},
		methods: {
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

</style>