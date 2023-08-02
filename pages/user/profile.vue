<template>
	<view>
		<tn-nav-bar>
			个人信息
			<view slot="right" class="tn-margin">
				<tn-button shape="round" size="sm" backgroundColor="#29b7cb" fontColor="tn-color-white">
					保存
				</tn-button>
			</view>
		</tn-nav-bar>
		 <view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view class="tn-margin">
			<view class="tn-margin-bottom-lg">
				<tn-avatar size="xl" shape="square"></tn-avatar>
			</view>
			<view class="tn-margin-bottom-lg tn-flex">
				<text class="tn-icon-my-simple tn-text-xxl"></text>
				<text>昵称</text>
			</view>
			<view class="tn-margin-bottom-lg tn-flex">
				<text class="tn-icon-sex tn-text-xxl"></text>
				<text>性别</text>
			</view>
			<view class="tn-margin-bottom-lg tn-flex">
				<text class="tn-icon-sex tn-text-xxl"></text>
				<text>简介</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
