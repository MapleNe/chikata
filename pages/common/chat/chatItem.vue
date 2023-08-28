<template>
	<view>
		<view class="tn-flex tn-flex-start" v-if="chatInfo.users_id === item.sendId">
			<view>
				<tn-avatar :src="chatInfo.head_img"></tn-avatar>
			</view>
			<view class="tn-margin-left-sm tn-margin-right-xl tn-bg-white tn-padding-sm" style="border-radius: 10rpx;">
				<text style="line-break: anywhere;">{{item.text}}</text>
			</view>
		</view>
		<view v-else class="tn-flex tn-flex-start tn-flex-direction-row-reverse">
			<view>
				<tn-avatar :src="userInfo.head_img"></tn-avatar>
			</view>
			<view class="tn-margin-right-sm tn-margin-left-xl tn-bg-white tn-padding-sm" style="border-radius: 10rpx;">
				<text style="line-break: anywhere;">{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "chatItem",
		props: {
			item: {
				type: Object,
				default: function() {
					return {
						time: '',
						icon: '',
						name: '',
						content: '',
						isMe: false
					}
				}
			}
		},
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