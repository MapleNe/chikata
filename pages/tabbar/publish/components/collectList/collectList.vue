<template>
	<z-paging ref="paging" @query="getCollect" v-model="content" :auto="true">
		<view class="tn-margin">
			<view v-for="(item,index) in content" :key="index">
				<view class="ch-bg-main tn-color-white tn-flex tn-flex-col-center tn-margin-bottom-sm"
					style="border-radius: 10rpx;position: relative;" @tap="pushCollectInfo(item.id)">
					<view class="tn-padding-xs">
						<tn-avatar :border="true" borderColor="#fff" :borderSize="6" size="xl"
							:src="item.image"></tn-avatar>
					</view>
					<view class="tn-flex tn-flex-col-center tn-flex-direction-column tn-flex-1">
						<text>{{item.name}}</text>
						<text>{{item.descrip}}</text>
					</view>
					<view v-if="isSelected(item)" class="tn-icon-left-triangle tn-text-xl-xxl"
						style="position: absolute;right: 0;"></view>
				</view>
			</view>
		</view>

	</z-paging>
</template>

<script>
	export default {
		props: {
			selectedCollect: {
				type: Number,
				default: null,
			},
		},
		name: "collectList",
		data() {
			return {
				content: [],
			};
		},
		created() {
			console.log('输出', this.selectedCollect)
		},
		methods: {
			getCollect() {
				this.$http.get('/collections/Find').then(res => {
					if (res.data.code === 200) {
						this.$refs.paging.complete(res.data.data)
					}
					console.log(res)
				})
			},
			pushCollectInfo(item) {
				if(this.selectedCollect === item){
					this.$emit('getCollectInfo', null)
				}else{
					this.$emit('getCollectInfo', item)
				}
				
				// console.log(item)
			},
			//是否已选中
			isSelected(item) {
				return this.selectedCollect === item.id;
			}
		}
	}
</script>

<style>

</style>