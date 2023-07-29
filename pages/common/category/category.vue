<template>
	<z-paging-swiper>
		<template #top>
			<tn-nav-bar alpha :zIndex="2">
			</tn-nav-bar>
			<view class="image-wrapper">
				<image :src="categoryInfo.opt.head_img" mode="aspectFill" style="width: 100%;height: 300rpx;"></image>
			</view>
			<view style="position: absolute;top: 180rpx;" class="tn-margin-left-sm tn-flex tn-flex-col-center">
				<tn-avatar size="lg" :src="categoryInfo.opt.head_img"></tn-avatar>
				<text class="tn-margin-left-sm tn-color-white">{{categoryInfo.name}}</text>
			</view>

			<v-tabs v-model="tabsIndex" :tabs="tabs" @change="changeTab" lineHeight="8rpx" lineColor="#29B7CB"
				activeColor="#29B7CB"></v-tabs>
		</template>
		<swiper class="swiper" :current="tabsIndex" @change="changeSwpier">
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<categoryArticle :id="id" :tabsIndex="index" :swiperIndex="tabsIndex"></categoryArticle>
			</swiper-item>
		</swiper>
	</z-paging-swiper>
</template>

<script>
	import categoryArticle from '../../../components/categoryArticle/categoryArticle.vue';

	export default {
		components: {
			categoryArticle
		},
		data() {
			return {
				tabs: ['推荐', '最新', '热门'],
				tabsIndex: 0,
				content: [],
				id: 0,
				categoryInfo: {
					opt: {
						head_img: null
					}
				},
			}
		},
		onLoad(option) {
			this.id = Number(option.id)
			this.getcategoryInfo()
		},
		methods: {
			getcategoryInfo() {
				this.$http.get('/article-sort/one', {
					params: {
						id: this.id
					}
				}).then(res => {
					this.categoryInfo = res.data.data
					console.log(res)
				})
			},
			changeTab(index) {
				this.tabsIndex = index
			},
			changeSwpier(event) {
				this.tabsIndex = event.detail.current
			},
		}
	}
</script>

<style lang="scss">
	.swiper {
		height: 100%;
	}

	.image-wrapper {
		position: relative;
	}

	.image-wrapper::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
	}
</style>