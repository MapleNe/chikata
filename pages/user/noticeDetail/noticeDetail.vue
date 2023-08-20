<template>
	<z-paging v-model="noticeList" ref="paging" @query="getNoticeDetail">
		<template #top>
			<tn-nav-bar backTitle="">
				<text>{{type=='comment'?'评论通知':type=='articlelike'?'点赞收藏':'关注我的'}}</text>
			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<view class="tn-margin">
			<viwe class="tn-flex tn-flex-col-center">
				<view>
					<tn-avatar></tn-avatar>
				</view>
				<view class="tn-margin-left-sm">
					<view class="tn-flex tn-flex-direction-column">
						<text>昵称</text>
						<text class="tn-color-gray tn-text-sm">时间</text>
					</view>
				</view>
			</viwe>
			<view class="tn-margin-left-xl tn-margin tn-padding-left-lg">
				<text>这是评论</text>
			</view>

		</view>
	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				noticeList: [],
				type: null,
			};
		},
		onLoad(params) {
			this.type = params.type
		},
		computed: {},
		methods: {
			getNoticeDetail(page, num) {
				this.$http.get('/push/history', {
					params: {
						page: page,
						limit: num,
						type: this.type
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data)
						console.log(this.noticeList)
					}
				}).catch(err => {
					console.log(err)
					this.$refs.paging.complete(false)
				})
			}
		}
	}
</script>

<style lang="scss">

</style>