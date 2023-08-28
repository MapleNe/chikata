<template>
	<z-paging ref="paging" v-model="tagsList" @query="getTags">
		<template #top>
			<tn-nav-bar backTitle="">
				<view class="tn-padding-top-sm">
					<view class="tn-bg-gray--light tn-padding-left-sm tn-round">
						<tn-input v-model="searchKey" @input="getTags()" :clearable="false" placeholder="搜索标签" />
					</view>
				</view>

			</tn-nav-bar>
			<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		</template>
		<view class="tn-margin tn-bg-gray--light tn-padding-sm tn-flex tn-flex-direction-column"
			style="border-radius: 20rpx;" v-if="tagsList">
			<view class="tn-margin-bottom" v-for="(item,index) in tagsList" :key="index" @tap="pushTag(item)">
				<text class="tn-icon-topic ch-color-primary"></text>
				<text>{{item.name}}</text>
			</view>
		</view>
	</z-paging>

</template>

<script>
	export default {
		data() {
			return {
				searchKey: null,
				tagsList: [],
				selectedTagsList: []
			};
		},
		onLoad() {

		},
		methods: {
			getTags(page, num) {
				this.$http.get('/tag/sql', {
					params: {
						page: page,
						limit: num,
						where: !this.searchKey ? '' : `name like '%${this.searchKey}%'`
					}
				}).then(res => {
					if (res.data.code === 200) {
						console.log(res)
						this.$refs.paging.complete(res.data.data.data)
					}
				})
			},
			pushTag(item) {
				uni.$emit('searchTag', item)
				this.$Router.back(1)
			}
		}
	}
</script>

<style lang="scss">

</style>