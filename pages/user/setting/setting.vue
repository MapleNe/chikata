<template>
	<view>
		<tn-nav-bar backTitle="">
			设置
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<tn-list-cell unlined :arrow="true" :arrowRight="true" v-if="hasLogin"
			@click="goAccount">通行证账号与安全</tn-list-cell>
		<view v-if="hasLogin">
			<view class="tn-padding-xs tn-bg-gray--light"></view>
			<tn-list-cell :arrow="true" :arrowRight="true" @click="goNotice">新消息通知</tn-list-cell>
			<tn-list-cell :arrow="true" :arrowRight="true" @click="goPrivacy">隐私设置</tn-list-cell>
			<tn-list-cell unlined :arrow="true" :arrowRight="true" @click="goBlock">屏蔽设置</tn-list-cell>
		</view>

		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<tn-list-cell :arrow="true" :arrowRight="true">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between">
				<text>护眼模式</text>
				<text class="tn-margin-right tn-text-sm tn-color-gray--dark">关闭</text>
			</view>
		</tn-list-cell>
		<tn-list-cell :arrow="true" :arrowRight="true">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between">
				<text>列表视频播放</text>
				<text class="tn-margin-right tn-text-sm tn-color-gray--dark">仅WI-FI</text>
			</view>
		</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true">
			<view class="tn-flex tn-flex-col-center tn-flex-row-between">
				<text>动图自动播放</text>
				<text class="tn-margin-right tn-text-sm tn-color-gray--dark">大智慧模式</text>
			</view>
		</tn-list-cell>
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<tn-list-cell :arrow="true" :arrowRight="true">关于APP</tn-list-cell>
		<tn-list-cell :arrow="true" :arrowRight="true">清除缓存</tn-list-cell>
		<tn-list-cell :arrow="true" :arrowRight="true">建议与反馈</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true" @click="onAPPUpdate()">检查更新</tn-list-cell>
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<tn-list-cell unlined :arrow="true" :arrowRight="true"
			@click="goAgreement($store.state.page,'agreement')">用户协议</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true"
			@click="goAgreement($store.state.page,'privacy')">隐私政策</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true"
			@click="goAgreement($store.state.page,'permission')">个人信息收集清单</tn-list-cell>
		<tn-list-cell unlined :arrow="true" :arrowRight="true">第三方共享个人信息清单</tn-list-cell>
		<view class="tn-padding-xs tn-bg-gray--light"></view>
		<view class="tn-padding tn-text-center" style="font-size: 28rpx;" @tap.stop.prevent="logout" v-if="hasLogin">
			<text>退出登录</text>
		</view>
	</view>
</template>

<script>
	import APPUpdate, {
		getCurrentNo
	} from '@/uni_modules/zhouWei-APPUpdate/js_sdk/appUpdate';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {

		data() {
			return {
				version: ''
			};
		},
		created() {
			// #ifdef APP-PLUS
			getCurrentNo(res => {
				// 进页面获取当前APP版本号（用于页面显示）
				this.version = res.version;
			});
			// #endif
		},
		computed: {
			...mapState(['hasLogin'])
		},
		methods: {
			...mapMutations(['logout']),
			// 检查APP是否有新版本
			onAPPUpdate() {
				// true 没有新版本的时候有提示，默认：false
				APPUpdate(true);
			},
			goAccount() {
				this.$Router.push({
					path: '/pages/user/setting/account/account'
				})
			},
			goNotice() {
				this.$Router.push({
					path: '/pages/user/setting/notice/notice'
				})
			},
			goPrivacy() {
				this.$Router.push({
					path: '/pages/user/setting/privacy/privacy'
				})
			},
			goBlock() {
				this.$Router.push({
					path: '/pages/user/setting/block/block'
				})
			},
			goAgreement(data, alias) {
				for (let i = 0; i < data.length; i++) {
					if (data[i].alias == alias) {
						this.$Router.push({
							path: '/pages/user/setting/agreement',
							query: {
								id: data[i].id
							}
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">

</style>