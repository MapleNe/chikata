<template>
	<z-paging ref="paging" @query="getTags" v-model="content" :auto="true">
		<view class="tn-margin">
			<view v-for="(item,index) in content" :key="index" class="tn-flex tn-flex-col-center">
				<view  :class="isSelected(item)?'ch-color-primary':''" @tap.stop="pushTagsInfo(item)">
					<text class="tn-margin-right-xs">#</text>
					<text>{{item.name}}</text>
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
			searchKey: {
				type: String,
				default: null,
			}
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
			uni.$on('searchTag', data => {
				if(data!==null){
					this.seacrchTags(data)
				}
			}) //废弃
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
		border: $ch-color-primary 1rpx solid;
	}

	.ch-bg-main {
		background-color: $ch-color-primary;
		color: #fff;
	}
</style>