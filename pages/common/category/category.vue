<template>
	<view>
		<tn-nav-bar :backgroundColor="background"></tn-nav-bar>
		<categoryArticle :id="id" ref="paging"></categoryArticle>
	</view>
</template>

<script>
	import ZPMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin';
	import categoryArticle from '../../../components/categoryArticle/categoryArticle.vue';
	export default {
		components: {
			categoryArticle
		},
		mixins: [ZPMixin],
		data() {
			return {
				content: [],
				id: 0,
				categoryInfo: {
					opt: {
						head_img: null
					}
				},
				maxScroll: 200,
				background:'rgba(255,255,255,0)'
			}
		},
		onPageScroll(e) {
			this.$refs.paging.updatePageScrollTop(e.scrollTop);
			// 获取页面滚动距离
			const scrollTop = e.scrollTop;
			// 计算当前透明度
			const opacity = scrollTop <= this.maxScroll ? scrollTop / this.maxScroll : 1;
			
			// 根据透明度设置导航栏背景颜色
			this.background = `rgba(255, 255, 255, ${opacity})`;
			
		},
		onReachBottom() {
			this.$refs.paging.pageReachBottom();
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
			back() {
				// 通过判断当前页面的页面栈信息，是否有上一页进行返回，如果没有则跳转到首页
				const pages = getCurrentPages()
				if (pages && pages.length > 0) {
					const firstPage = pages[0]
					if (pages.length == 1 && (!firstPage.route || firstPage.route != 'pages/tabbar/index')) {
						this.$Router.replaceAll({
							path: '/pages/tabbar/index'
						})
					} else {
						this.$Router.back(1)
					}
				} else {
					this.$Router.replaceAll({
						path: '/pages/tabbar/index'
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	.swiper {
		height: 100%;
	}
</style>