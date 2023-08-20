<template>
	<z-paging ref="paging" @query="getCollect" v-model="content" :auto="false">
		<view class="tn-margin">
			<view v-for="(item,index) in content" :key="index">
				<view class="ch-bg-main tn-color-white tn-flex tn-flex-col-center tn-margin-bottom-sm"
					style="border-radius: 10rpx;position: relative;" @tap.stop="goCollect(index)">
					<view class="tn-padding-xs">
						<tn-avatar :border="true" borderColor="#fff" :borderSize="6" size="xl"
							:src="item.image"></tn-avatar>
					</view>
					<view class="tn-flex tn-flex-col-center tn-flex-direction-column tn-flex-1">
						<text class="tn-text-bold">{{item.name}}</text>
						<text>{{item.descrip}}</text>
					</view>

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
				default: 0
			},
			swiperIndex: {
				type: Number,
				default: 0
			}
		},
		name: "collectList",
		data() {
			return {
				firstLoad: false,
				content: [],
			};
		},
		created() {
			uni.$on('createCollect', data => {
				if (data) {
					this.$refs.paging.reload()
				}
			})
		},
		watch: {
			swiperIndex: {
				handler(e) {
					if (e === this.tabsIndex) {
						if (!this.firstLoad) {
							setTimeout(() => {
								this.$refs.paging.reload()
							}, 5)
						}
					}
				},
				immediate: true
			}
		},
		methods: {
			getCollect(page, num) {
				this.$http.get('/collections/Find',{
					params:{
						page:page,
						limit:num,
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data)
						this.firstLoad = true
					}
					console.log(res)
				})
			},
			goCollect(index) {
				this.$Router.push({
					path: '/pages/common/collect/collect',
					query: {
						id: this.content[index].id
					}
				})
			}
		}
	}
</script>

<style>

</style>