<template>
	<z-paging ref="paging" @query="getCategory" v-model="content" :auto="true">
		<view class="tn-margin">
			<view v-for="(item,index) in content" :key="index">
				<view class="ch-bg-main tn-flex tn-flex-col-center tn-margin-bottom-sm"
					style="border-radius: 10rpx;position: relative;" @tap="pushCategoryInfo(item)">
					<view class="tn-padding-xs">
						<tn-avatar :border="true" borderColor="#fff" :borderSize="6" size="xl"
							:src="item.opt.head_img"></tn-avatar>
					</view>
					<view class="tn-flex tn-flex-col-center tn-flex-direction-column tn-flex-1">
						<text>{{item.name}}</text>
						<text>{{item.description}}</text>
					</view>
					<view v-if="selectedCategory.id === item.id" class="tn-icon-left-triangle tn-text-xl-xxl"
						style="position: absolute;right: 0;"></view>

				</view>
			</view>
		</view>

	</z-paging>
</template>

<script>
	export default {
		props: {
			tabsIndex: {
				type: Number,
				default: null
			},
			selectedCategory: {
				type: Object,
				default: null
			}
		},
		name: "categoryList",
		data() {
			return {
				content: [],
				firstLoad: false,
				categoryInfo: [],
			};
		},
		onLoad() {

		},
		created() {
			console.log('组件加载')
		},
		methods: {
			getCategory(page, num) {
				this.$http.get('/article-sort/all', {
					params: {
						limit: num,
						page: page
					}
				}).then(res => {
					console.log(res)
					this.$refs.paging.complete(res.data.data.data)
				})
			},
			pushCategoryInfo(item) {
				this.$emit('getCategoryInfo', item)
				// console.log(item)
			},
		}
	}
</script>

<style lang="scss">
	.ch-border-main {
		border: $ch-color-primary 1rpx solid;
	}

	.ch-bg-main {
		background-color: $ch-color-primary;
		color: #fff;
	}
</style>