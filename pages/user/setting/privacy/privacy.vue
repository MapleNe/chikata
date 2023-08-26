<template>
	<view>
		<tn-nav-bar backTitle="">
			<text>隐私设置</text>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<tn-list-view customTitle>
			<view slot="title" class="tn-padding-sm tn-text-sm tn-bg-gray--light">
				<text class="tn-color-gray--dark">社交隐私设置</text>
			</view>
			<tn-list-cell arrow>个人主页访问权限</tn-list-cell>
			<tn-list-cell arrow>个人主页展示发布的帖子</tn-list-cell>
			<tn-list-cell arrow>在个人主页展示我的评论</tn-list-cell>
			<tn-list-cell arrow>在个人主页展示我的收藏</tn-list-cell>
			<tn-list-cell unlined arrow>在个人主页展示我的合集</tn-list-cell>
		</tn-list-view>
		<view class="tn-padding-xs tn-bg-gray--light">
		</view>
		<tn-list-cell arrow>上传图片时添加水印</tn-list-cell>
		<tn-list-cell unlined arrow>记录帖子浏览历史</tn-list-cell>
		<view class="tn-padding-xs tn-bg-gray--light">
		</view>
		<tn-list-cell unlined arrow>APP隐私权限</tn-list-cell>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">

</style>