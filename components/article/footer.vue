<template>
	<view>
		<!-- 点赞控件 -->
		<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top" v-if="type!=='circle'">
			<!-- 只取第一个tag -->
			<view v-if="data.expand.tag.length>0">
				<view class="tn-bg-grey--light tn-text-sm tn-color-gray--dark tn-margin-right-sm tn-padding-xs"
					style="border-radius: 10rpx;">
					<text>{{data.expand.tag[0].name}}</text>
				</view>
			</view>
			<view
				class="tn-flex tn-text-sm tn-flex-col-center tn-color-grey--disabled tn-flex-basic-sm tn-flex-row-between"
				style="margin-left: auto;">
				<view class="tn-flex tn-flex-col-bottom">
					<text class="tn-text-xxl tn-icon-eye "></text>
					<text class="tn-margin-left-xs">{{data.views}}</text>
				</view>
				<view class="tn-flex tn-flex-col-bottom" @tap.stop="showComments(index)">
					<text class="tn-text-xxl tn-icon-comment"></text>
					<text class="tn-margin-left-xs">{{data.expand.comments.count}}</text>
				</view>
				<view class="tn-flex tn-flex-col-bottom" @tap.stop="likeTap(data.id)">
					<text class="tn-text-xxl" :class="is_like"></text>
					<text class="tn-margin-left-xs ">{{data.expand.like.likes_count}}</text>
				</view>
			</view>
		</view>
		<!-- 动态页面 -->
		<view v-else>
			<view class="tn-flex tn-flex-col-center tn-flex-wrap tn-margin-top">
				<view v-for="tags in data.expand.tag" :key="tags.id"
					class="tn-bg-grey--light tn-text-sm tn-color-gray--dark tn-margin-right-sm tn-margin-bottom-sm tn-padding-xs"
					style="border-radius: 10rpx;">
					<text>{{tags.name}}</text>
				</view>
			</view>
			<view
				class="tn-flex  tn-flex-col-center tn-text-sm tn-color-grey--disabled tn-flex-basic-sm tn-flex-row-around">
				<view class="tn-flex tn-flex-col-bottom">
					<text class="tn-text-xxl tn-icon-share-square "></text>
					<text class="tn-margin-left-xs ">{{data.views}}</text>
				</view>
				<view class="tn-flex tn-flex-col-bottom">
					<text class="tn-text-xxl tn-icon-comment"></text>
					<text class="tn-margin-left-xs ">{{expand.comments.count}}</text>
				</view>
				<view class="tn-flex tn-flex-col-bottom" @tap.stop="likeTap(data.id)">
					<text class="tn-text-xxl" :class="is_like"></text>
					<text class="tn-margin-left-xs ">{{expand.like.likes_count}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "articleFooter",
		props: {
			data: {
				type: Object,
				default: null,
			},
			type: {
				type: String,
				default: null,
			}
		},
		data() {
			return {
				expand: null,
				anime: false,

			}
		},
		computed: {
			is_like() {
				var style = null
				if (this.expand.like.is_like) {
					style = 'ch-color-primary tn-icon-praise-fill'
				} else {
					style = 'tn-icon-praise'
				}
				if (this.anime) style += ' animate__animated animate__bounceIn';

				return style

			}
		},
		created() {
			this.expand = this.data.expand
			console.log(this.is_like,this.expand)
		},
		methods: {
			likeTap(id) {
				this.$http.put('/Article-like/Record', {
					article_id: id,
				}).then(res => {
					if (res.data.code === 200) {
						console.log(res)
						this.expand.like.is_like = !this.expand.like.is_like
						if (this.expand.like.is_like) {
							this.expand.like.likes_count++
							this.anime = true
						} else {
							this.expand.like.likes_count--
							this.anime = false
						}
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					}
				}).catch(err => {

				})
			},
		}
	}
</script>

<style>
</style>