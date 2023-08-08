<template>
	<z-paging ref="paging" @query="getTags" v-model="content" :auto="true">
		<view class="tn-margin">
			<view v-for="(item,index) in content" :key="index" class="tn-flex tn-flex-col-center tn-margin-sm tn-no-margin-top tn-no-margin-left">
				<view :class="isSelected(item)?'ch-color-primary':''" @tap.stop="pushTagsInfo(item)">
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
				tagSearchKey: null
			};
		},
		watch: {
			searchKey: {
				handler(e) {
					this.tagSearchKey = e
					setTimeout(() => {
						this.$refs.paging.reload()
					}, 400)

				}
			}
		},
		onLoad() {

		},
		created() {
			uni.$on('createTagcomplete',data=>{
				if(data){
					this.$refs.paging.reload()
				}
			})
		},
		methods: {
			getTags(page, num) {
				this.$http.get('tag/sql', {
					params: {
						limit: num,
						page: page,
						where: `name like '%${this.searchKey}%'`
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