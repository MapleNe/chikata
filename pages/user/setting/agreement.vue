<template>
	<view>
		<tn-nav-bar backTitle="">
			<text v-if="content">{{content.title}}</text>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view class="tn-margin">
			<mp-html :content="content.content"></mp-html>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: {},
			}
		},
		onLoad(params) {
			this.getPage(params.id)
		},
		methods: {
			getPage(id) {
				this.$http.get('/page/one', {
					params: {
						id: id
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.content = res.data.data
					}
				})
			}
		}
	}
</script>

<style>
</style>