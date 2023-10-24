<template>
	<z-paging ref="paging" @query="getArticle" use-cache :cache-key="`indexArticle${tabsIndex}`" v-model="content"
		:auto="false" :auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false"
		@onRefresh="onRefresh" @onRestore="onRestore">
		<view v-show="tabsIndex===0">
			<view class="tn-margin" v-show="swiper">
				<tn-swiper :list="swiperList" :height="350" name="img" backgroundColor="tn-bg-gray--light" :radius="10"
					v-show="isBanner" @click="clickSwiper">
				</tn-swiper>
			</view>
		</view>
		<view v-for="(item,index) in content" :key="index" @touchend="touchEnd" @touchmove="touchMove">
			<view class="tn-margin">
				<ls-skeleton :skeleton="skeleton" :loading="loading">
					<article-header :data="item"></article-header>
					<article-content :data="item"></article-content>
					<article-footer :data="item"></article-footer>
				</ls-skeleton>
			</view>
			<!-- 间隔开始 -->
			<view class="tn-bg-gray--light tn-padding-xs"></view>
			<!-- 间隔结束 -->
		</view>
	</z-paging>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import articleHeader from '@/components/article/header.vue';
	import articleContent from '@/components/article/content.vue';
	import articleFooter from '@/components/article/footer.vue';
	export default {
		components: {
			articleHeader,
			articleContent,
			articleFooter,
		},
		props: {
			// content: {
			// 	type: Array,
			// },
			swiper: {
				type: Boolean,
				default: false
			},
			tabsIndex: {
				type: Number,
				default: null
			},
			type: {
				type: String,
				default: 'index'
			},
			id: {
				type: Number,
				default: null,
			},
			order: {
				type: String,
				default: ''
			},
			swiperIndex: {
				type: Number,
				default: null
			}
		},

		name: "articleList",
		data() {
			return {
				content: [],
				firstLoad: false,
				isBanner: false,
				swiperList: [],
				skeleton: [
					'circle+line-sm*2',
					'line-sm*3',
					'card-lg',
					'circle-sm+line-sm'
				],
				loading: true,
				showPop: false,
				showMenu: false,
				isLongTap: true,
				api: null,
				col: 3

			};
		},
		onReady() {
			this.$nextTick(() => {
				this.$refs.readMore.init()
			})
		},
		created() {

			this.getBanner()
			// this.getPlacard()
			uni.$on('deleteArticleOk', data => {
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
		computed: {
			...mapState(['hasLogin']),
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			}
		},
		methods: {
			async getArticle(page, num) {
				switch (this.type) {
					case 'index':
						this.api = '/article/all'
						break;
					case 'focus':
						this.api = '/article/focusFind'
						break;
					case 'circle':
						this.api = this.hasLogin ? '/article/focusFind' : '/article/all'
						break;
					case 'user':
						this.api = '/article/userFind'
						break;
					default:
						this.api = '/article/all'
						break;
				}
				await this.$http.get(this.api, {
					params: {
						limit: num,
						page: page,
						id: this.id ? this.id : '',
						order: this.tabsIndex === 1 ? 'create_time desc views desc' : ''
					}
				}).then(res => {

					if (res.data.code === 200) {

						this.$refs.paging.complete(res.data.data.data)
						this.firstLoad = true
						//骨架屏仅在第一次加载数据时显示
						setTimeout(() => {
							this.loading = false
						}, 400)
					}
				}).catch(err => {

					this.$refs.paging.complete(false)
				})
			},
			async getBanner() {
				await this.$http.get('/banner').then(res => {
					if (res.data.code === 200) {
						if (res.data.data.count > 0) {
							let data = res.data.data
							this.swiperList = data.data
							this.isBanner = true
						} else {
							this.isBanner = false
						}
					}
				})
			},
			likeAction(index) {
				this.$http.put('/Article-like/Record', {
					article_id: this.content[index].id
				}).then(res => {
					if (res.data.code === 200) {
						this.content[index].expand.like.is_like = !this.content[index].expand.like.is_like
						if (this.content[index].expand.like.is_like) {
							this.content[index].expand.like.likes_count++
						} else {
							this.content[index].expand.like.likes_count--
						}
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					}
				}).catch(err => {

				})
			},
			showComments(index) {
				this.$emit('getComments', this.content[index].id)
			},
			getMenuInfo(data) {
				if (this.isLongTap) {
					this.$emit('getMenuInfo', data)
				}
			},
			goArticle(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.content[index].id,
						users_id: this.content[index].users_id
					},
				})
			},
			goUserProfile(index) {
				this.$Router.push({
					path: '/pages/common/userProfile/userProfile',
					query: {
						id: this.content[index].users_id
					}
				})
			},
			clickSwiper(index) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: this.swiperList[index].opt.article_id,
						users_id: this.swiperList[index].opt.users_id
					},
				})
			},
			goCategory(id) {
				this.$Router.push({
					path: '/pages/common/category/category',
					query: {
						id: id
					}
				})
			},
			touchEnd() {
				this.isLongTap = true;
			},
			touchMove(e) {
				// 手指触摸后的移动事件
				this.isLongTap = false;
			},
			followUser(index) {
				this.$http.put('/Focus/Record', {
					userId: this.content[index].users_id
				}).then(res => {
					switch (res.data.code) {
						case 200:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							this.content[index].expand.focus = !this.content[index].expand.focus
							break;
						case 400:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							break;
						default:
							// 处理其他情况
							break;
					}
				});
			},
			getDateDiff(data) {
				// 传进来的data必须是日期格式，不能是时间戳
				//var str = data;
				//将字符串转换成时间格式
				var timePublish = new Date(data);
				var timeNow = new Date();
				var minute = 1000 * 60;
				var hour = minute * 60;
				var day = hour * 24;
				var month = day * 30;
				var result = "2";

				var diffValue = timeNow - timePublish;
				var diffMonth = diffValue / month;
				var diffWeek = diffValue / (7 * day);
				var diffDay = diffValue / day;
				var diffHour = diffValue / hour;
				var diffMinute = diffValue / minute;

				// console.log('diffValue：'+diffValue+' ' +'diffMonth：'+diffMonth+' ' +'diffWeek：'+diffWeek+' ' +'diffDay：'+diffDay+' ' +'diffHour：'+diffHour+' ' +'diffMinute：'+diffMinute);

				if (diffValue < 0) {} else if (diffMonth > 3) {
					result = timePublish.getFullYear() + "-";
					result += timePublish.getMonth() + "-";
					result += timePublish.getDate();

				} else if (diffMonth > 1) {
					result = parseInt(diffMonth) + "月前";
				} else if (diffWeek > 1) {
					result = parseInt(diffWeek) + "周前";
				} else if (diffDay > 1) {
					result = parseInt(diffDay) + "天前";
				} else if (diffHour > 1) {
					result = parseInt(diffHour) + "小时前";
				} else if (diffMinute > 1) {
					result = parseInt(diffMinute) + "分钟前";
				} else {
					result = "刚刚";
				}
				return result;
			},
			previewImage(images, index) {
				let data = [];
				for (let i = 0; i < images.length; i++) {
					data.push(images[i].src);
				}
				uni.previewImage({
					current: index,
					urls: data,
				});
			},
			onRefresh(e) {
				this.$emit('scroll', true)
			},
			onRestore(e) {
				this.$emit('scroll', false)
			}
		}
	}
</script>

<style>

</style>