<template>
	<view>
		<tn-nav-bar backTitle="">
			设置
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<tn-list-cell unlined :arrow="true" :arrowRight="true">通行证账号与安全</tn-list-cell>
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<tn-list-cell :arrow="true" :arrowRight="true">新消息通知</tn-list-cell>
		<tn-list-cell :arrow="true" :arrowRight="true">隐私设置</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true">屏蔽设置</tn-list-cell>
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<tn-list-cell :arrow="true" :arrowRight="true">护眼模式</tn-list-cell>
		<tn-list-cell :arrow="true" :arrowRight="true">列表视频自动播放</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true">动图自动播放</tn-list-cell>
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<tn-list-cell :arrow="true" :arrowRight="true">关于APP</tn-list-cell>
		<tn-list-cell :arrow="true" :arrowRight="true">清除缓存</tn-list-cell>
		<tn-list-cell :arrow="true" :arrowRight="true">建议与反馈</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true">检查更新</tn-list-cell>
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<tn-list-cell unlined :arrow="true" :arrowRight="true">用户协议</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true">隐私政策</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true">个人信息收集清单</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true">第三方共享个人信息清单</tn-list-cell>
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<view class="tn-padding tn-text-center" style="font-size: 28rpx;" @tap.stop.prevent="logout">
			<text>退出登录</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		
		data() {
			return {

			};
		},
		methods:{
			...mapMutations(['logout']),
		}
	}
</script>

<style lang="scss">

</style>