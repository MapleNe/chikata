<template>
	<z-paging ref="paging" @query="getTags" v-model="content" :auto="true">
		<view class="tn-margin">
			<view v-for="(item,index) in content" :key="index">
				<view class="ch-bg-main tn-flex tn-flex-col-center tn-margin-bottom-sm"
					style="border-radius: 10rpx;position: relative;" @tap="pushTagsInfo(item)">
					<view class="tn-padding-xs">
						<tn-avatar :border="true" borderColor="#fff" :borderSize="6" size="xl"
							:src="item.opt.head_img"></tn-avatar>
					</view>
					<view class="tn-flex tn-flex-col-center tn-flex-direction-column tn-flex-1">
						<text>{{item.name}}</text>
						<text>{{item.description}}</text>
					</view>
					<view v-if="isSelected(item)" class="tn-icon-left-triangle tn-text-xl-xxl" style="position: absolute;right: 0;"></view>
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
			selectedTags: {
				type: Array,
				default: null,
			},
		},
		name: "tagsList",
		data() {
			return {
				content: [],
				firstLoad: false,
				tagsInfo: [],
				innerSelectedTags: [],
			};
		},
		onLoad() {

		},
		created() {
			uni.$emit('getTagsInfo', this.tagsInfo) //废弃
			console.log('组件加载')
		},
		methods: {
			getTags(page, num) {
				this.$http.get('/tag/all', {
					params: {
						limit: num,
						page: page
					}
				}).then(res => {
					console.log(res)
					this.$refs.paging.complete(res.data.data.data)
				})
			},
			pushTagsInfo(item) {
				this.$emit('getTagsInfo', item)
				// console.log(item)
			},
			//是否已选中
			isSelected(item) {
				return this.selectedTags.some(tag => tag.id === item.id);
			}
		}
	}
</script>

<style lang="scss">
	.ch-border-main {
		border: $ch-color-main 1rpx solid;
	}

	.ch-bg-main {
		background-color: $ch-color-main;
		color: #fff;
	}
</style>