<template>
	<view>
		<tn-nav-bar backTitle="" :zIndex="2">
			发布
			<view class="tn-padding tn-flex tn-flex-col-center" slot="right">
				<text class="tn-margin-right-sm tn-color-gray--dark">草稿箱</text>
				<tn-button size="sm" plain fontColor="#29b7cb" backgroundColor="#29b7cb">
					发布
				</tn-button>
			</view>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view class="tn-flex tn-flex-direction-column tn-flex-row-between">
			<view :style="{height:screenHeight - 100 - editHeight - keyHeight +'px',overflow:'scroll'}"
				class="tn-margin">
				<view class="tn-color-grey--disabled tn-flex tn-flex-col-center">
					<tn-input v-model="articleInfo.title" :maxLength="titleMAX" placeholder-style="color:#C6D1D8"
						:clearable="false" placeholder="标题(必填)" />
					<text class="tn-text-sm">{{articleInfo.title.length}}/{{titleMAX}}</text>
				</view>
				<lsj-edit ref="lsjEdit" @onReady="editReady" placeholder="请尽情发挥吧..." :max-count="contentMAX"></lsj-edit>
			</view>
			<view style="position: absolute;bottom: 0;width: 100%;" id="contentBtn">
				<view class="tn-text-right tn-margin">
					<text class="tn-color-grey--disabled tn-text-sm">{{edit&&edit.textCount}}/{{contentMAX}}</text>
				</view>
				<view
					class="tn-flex tn-margin tn-text-md tn-flex-direction-column tn-border-solid-top tn-border-gray--light tn-padding-top-sm">
					<view class="tn-flex tn-flex-col-center tn-flex-row-between" @tap.stop.prevent="showCategory = true"
						style="height: 50rpx;">
						<text>选择发布位置</text>
						<view class="tn-flex tn-flex-col-center">
							<view
								class="tn-margin-right-sm ch-color-primary ch-bg-main--light tn-padding-left-sm tn-radius tn-padding-xs tn-padding-right-sm"
								v-if="articleInfo.sort">
								{{articleInfo.sort.name}}
							</view>
							<text class="tn-icon-right"></text>
						</view>
					</view>
					<view class="tn-flex tn-flex-col-center tn-margin-top-xl" @tap.stop.prevent="showTag = true">
						<view class="tn-flex tn-flex-col-center" style="flex-shrink: 0;">
							<text>参与话题</text>
							<text class="tn-icon-right-triangle tn-text-lg"></text>
						</view>
						<scroll-view scroll-x>
							<view class="tn-flex" style="white-space: nowrap;">
								<block v-for="(item,index) in articleInfo.tags" :key="index">
									<view
										class="tn-margin-left-sm tn-flex-nowrap ch-color-primary ch-bg-main--light tn-padding-left-sm tn-radius tn-padding-xs tn-padding-right-sm">
										<text>{{item.name}}</text>
									</view>
								</block>
							</view>
						</scroll-view>
					</view>
					<!-- 按钮 -->
					<view class="tn-flex tn-felx-col-center tn-flex-row-between tn-margin-top-xl"
						style="font-size: 45rpx;">
						<block v-for="(item,index) in btnList" :key="item.type">
							<text :class="'tn-icon-'+item.icon" @tap.stop.prevent="btnAction(item.type)"></text>
						</block>
						<view class="tn-margin-left-xl">
							<text class="tn-icon-install" @tap.stop.prevent="showCurrent = 'set'"></text>
						</view>
					</view>
					<!-- 表情 -->
					<view v-if="showCurrent == 'emoji'">
						<scroll-view scroll-y style="height: 300rpx;">
							<view class="tn-flex tn-flex-col-center tn-flex-wrap tn-flex-row-between">
								<block v-for="(item,index) in emoji.list[0]" :key="index">
									<image style="height: 50rpx;width: 50rpx;" :src="item" class="tn-margin-xs"
										@tap.stop.prevent="insertEmoji(item)"></image>
								</block>
							</view>
						</scroll-view>
					</view>
					<!-- 格式 -->
					<view v-if="showCurrent == 'font'" style="height: 300rpx">
						<view class="tn-margin-top-sm tn-margin-bottom-sm">
							<text>文字颜色</text>
						</view>
						<view class="tn-flex tn-flex-row-between tn-flex-col-center" style="height: 50rpx;">
							<block v-for="(color,index) in format.color.font">
								<view class="tn-padding-sm tn-round" :style="[{backgroundColor:color}]"
									@tap="colorTap('color',color)">
									<view
										:class="[{'tn-bg-white tn-round tn-padding-xs':format.format && format.format.color == color.toLowerCase()}]">
									</view>
								</view>
							</block>
						</view>
						<view class="tn-margin-top-sm tn-margin-bottom-sm">
							<text>背景颜色</text>
						</view>
						<view class="tn-flex tn-flex-row-between tn-flex-col-center" style="height: 50rpx;">
							<block v-for="(background,index) in format.color.background">
								<view class="tn-padding-sm tn-round" :style="[{backgroundColor:background}]"
									@tap="colorTap('background',background)">
									<view
										:class="[{'tn-bg-white tn-round tn-padding-xs':format.format && format.format.background == background.toLowerCase()}]">
									</view>
								</view>
							</block>
						</view>
					</view>

					<!-- 设置 -->
					<view v-if="showCurrent == 'set'" class="tn-margin-top">
						<scroll-view scroll-y style="height: 300rpx;">
							<view
								class="tn-flex tn-flex-col-center tn-flex-row-between tn-border-solid-bottom tn-padding-bottom-sm tn-border-gray--light"
								@tap.stop.prevent="showCollect = true">
								<text>加入合集</text>
								<i class="tn-icon-right"></i>
							</view>
						</scroll-view>

					</view>
				</view>
			</view>
		</view>
		<!-- 弹出层开始 -->
		<!-- 选择板块 -->
		<tn-popup mode="bottom" :borderRadius="20" length="80%" v-model="showCategory">
			<view class="tn-flex tn-flex-row-between tn-margin tn-flex-col-center">
				<text>选择板块</text>
				<text class="tn-icon-close tn-text-xxl" @tap.stop.prevent="showCategory = false"></text>
			</view>
			<tn-grid align="left" :col="col" hoverClass="none">
				<block v-for="(item, index) in category" :key="index">
					<!-- H5 -->
					<!-- #ifndef MP-WEIXIN -->
					<tn-grid-item>
						<view class="tn-margin-bottom tn-flex tn-flex-direction-column tn-flex-col-center tn-text-md"
							@tap.stop.prevent="articleInfo.sort = item;showCategory = false">
							<tn-avatar :src="item.opt.head_img" size="lg" shape="square">
							</tn-avatar>
							<view class="tn-margin-top-sm">
								<text>{{item.name}}</text>
							</view>
						</view>
					</tn-grid-item>
					<!-- #endif-->

					<!-- 微信小程序 -->
					<!-- #ifdef MP-WEIXIN -->
					<tn-grid-item :style="{width: gridItemWidth}">
						<view class="tn-margin-bottom tn-flex tn-flex-direction-column tn-flex-col-center tn-text-md">
							<tn-avatar :src="item.opt.head_img" size="lg" shape="square">
							</tn-avatar>
							<view class="tn-margin-top-sm">
								<text>{{item.name}}</text>
							</view>
						</view>
					</tn-grid-item>
					<!-- #endif-->
				</block>
			</tn-grid>
		</tn-popup>
		<!-- 选择话题 -->
		<tn-popup mode="bottom" v-model="showTag" :borderRadius="20" length="80%">
			<scroll-view style="height: 100rpx;" scroll-y>
				<view class="tn-margin tn-flex tn-flex-row-between tn-flex-col-center">
					<text class="tn-icon-close tn-text-xxl" @tap.stop.prevent="showTag = false"></text>
					<text>选择话题</text>
					<text class="ch-color-primary" @tap.stop.prevent="showTag = false">确认</text>
				</view>
			</scroll-view>
			<view class="tn-flex tn-text-md tn-margin tn-flex-col-center tn-radius tn-flex-wrap"
				style="min-height: 60rpx;">
				<text class="tn-text-bold">话题：</text>
				<block v-for="(item,index) in articleInfo.tags" :key="index">
					<view
						class="tn-margin-xs tn-no-margin-right tn-no-margin-top tn-bg-gray--light tn-padding-xs tn-padding-left-sm tn-padding-right-sm"
						@tap.stop.prevent="tagTap(item)">
						<text>{{item.name}}</text>
						<text class="tn-margin-left-xs tn-icon-close-fill tn-color-gray"></text>
					</view>
				</block>
			</view>
			<!-- 搜索 -->

			<view
				class="tn-bg-gray--light tn-radius tn-margin tn-padding-left-sm tn-padding-right-sm tn-flex tn-flex-col-center">
				<text class="tn-icon-search tn-padding-right-sm"></text>
				<tn-input v-model="searchTag" :clearable="false" placeholder="搜索话题" />
			</view>

			<!-- 推荐话题 -->
			<view class="tn-margin tn-text-md tn-margin-top-xl">
				<text class="tn-text-bold">推荐话题：</text>
				<view class="tn-margin-top-xl">
					<block v-for="(item,index) in tag" :key="index">
						<view class="tn-flex tn-flex-col-center tn-margin-bottom" @tap.stop.prevent="tagTap(item)">
							<tn-avatar :src="item.opt.head_img" shape="square"></tn-avatar>
							<view class="tn-flex-1 tn-margin-left tn-flex tn-flex-direction-column">
								<view class="tn-flex tn-flex-col-center tn-flex-row-between">
									<text>{{item.name}}</text>
									<text class="tn-color-grey--disabled tn-text-sm">{{item.expand.count}}篇文章</text>
								</view>
								<text>{{item.description}}</text>
							</view>
						</view>
					</block>
				</view>
			</view>

		</tn-popup>
		<!-- 选择合集 -->
		<tn-popup mode="bottom" v-model="showCollect" :borderRadius="20" length="50%">
			<z-paging ref="collect" @query="getCollect" v-model="collect">
				<template #top>
					<view class="tn-margin tn-flex tn-flex-col-center tn-flex-row-between">
						<text>选择合集</text>
						<text class="ch-color-primary tn-text-md" @tap.stop.prevent="goCreateCollect()">创建合集</text>
					</view>
				</template>
				<view class="tn-flex tn-flex-direction-column">
					<view class="tn-flex tn-flex-col-center tn-text-md tn-flex-row-between tn-margin"
						@tap.stop.prevent="articleInfo.collect=null">
						<text>不加入合集</text>
						<view class="tn-round" :class="[!articleInfo.collect?'ch-border-primary':'tn-border-solid']"
							style="height: 32rpx; width: 32rpx;"></view>
					</view>
					<view class="tn-margin">
						<block v-for="(item,index) in collect" :key="index">
							<view class="tn-flex tn-margin-bottom tn-flex-col-center tn-text-md tn-flex-row-between"
								@tap.stop.prevent="articleInfo.collect = item">
								<view class="tn-flex tn-flex-col-center">
									<tn-avatar :src="item.image" siz="lg" shape="square"></tn-avatar>
									<view class="tn-margin-left">
										<text>{{item.name}}</text>
									</view>
								</view>
								<view class="tn-round"
									:class="[articleInfo.collect && articleInfo.collect.id == item.id?'ch-border-primary':'tn-border-solid']"
									style="height: 32rpx; width: 32rpx;"></view>
							</view>
						</block>
					</view>
				</view>
			</z-paging>
		</tn-popup>
	</view>
</template>

<script>
	import {
		mapstate
	} from 'vuex';
	import store from '../../../store';
	export default {
		data() {
			return {
				col: 4,
				params: null,
				titleMAX: 30,
				contentMAX: 30000,
				category: null,
				collect: [],
				tag: null,
				btnList: [{
						type: 'image',
						icon: 'image',
					},
					{
						type: 'at',
						icon: 'at-sign',
					},
					{
						type: 'font',
						icon: 'font',
					},
					{
						type: 'video',
						icon: 'video',
					},
					{
						type: 'more',
						icon: 'add-circle',
					}
				],
				editHeight: 0,
				keyHeight: 0,
				screenHeight: 0,
				edit: null,
				showAt: false,
				// 显示哪个面板
				showCurrent: null,
				articleInfo: {
					title: '',
					tags: [],
					sort: null,
					collect: null,

				},
				//表情
				emoji: {
					tab: [],
					list: [],
				},
				// 格式
				format: {
					format: {},
					color: {
						font: [
							'#303133',
							'#666666',
							'#999999',
							'#E93423',
							'#ED6940',
							'#E7B23E',
							'#59C780',
							'#4EA9FA',
							'#2B61F5',
							'#675BED',
						],
						background: [
							'#E8E8E8',
							'#FED0D0',
							'#FBF0B8',
							'#C3ECDA',
							'#B2D1FF',
							'#E0C4FF',
						]
					}
				},
				// 显示弹窗
				showCategory: false,
				//话题
				showTag: false,

				searchTag: '',
				// 显示合集
				showCollect: false,
			}
		},
		onLoad(params) {
			this.params = params
		},

		beforeRouteLeave(to, from, next) {
			next()
		},
		onReady() {
			// 获取元素高度
			uni.createSelectorQuery().in(this).select('#contentBtn').boundingClientRect(data => {
				this.editHeight = data.height
			}).exec()
			this.screenHeight = uni.getSystemInfoSync().windowHeight

			// 监听键盘高度
			uni.onKeyboardHeightChange(data => {
				this.keyHeight = data.height
			})

			//初始化数据
			this.initData()
		},
		computed: {
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			}
		},
		created() {

		},
		methods: {
			initData() {
				// 获取分类
				this.getCategory()
				// 过去话题标签
				this.getTag()
				// 获取表情
				this.getEmoji()
			},
			getCategory() {
				this.$http.get('/article-sort/all', {
					params: {
						limit: 20,
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.category = res.data.data.data
					}
				})
			},
			getTag(page, limit) {
				this.$http.get('/tag/all', {
					params: {
						page,
						limit: 10
					}
				}).then(res => {

					if (res.data.code === 200) {
						this.tag = res.data.data.data
					}
				})
			},
			getEmoji() {
				this.$http.get('/emoji/list', {}).then(res => {
					if (res.data.code === 200) {
						this.emoji.tab = res.data.data
						this.getEmojiList(res.data.data[0])
					}
				})
			},
			getEmojiList(emoji) {
				this.$http.get('/emoji/one', {
					params: {
						name: emoji
					}

				}).then(res => {

					if (res.data.code === 200) {
						this.emoji.list.push(res.data.data)
					}
				})
			},
			getCollect(page, limit) {
				this.$http.get('/collections/Find', {
					params: {
						page,
						limit
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.collect.complete(res.data.data)

					}
				})
			},
			// 选择话题
			tagTap(item) {
				// 先检查标签数量
				if (this.articleInfo.tags && this.articleInfo.tags.length >= 10) {
					uni.showToast({
						title: '最多选择10个标签'
					});
					return;
				}

				// 再检查标签是否已存在
				const index = this.articleInfo.tags.findIndex(tag => tag.id === item.id);
				if (index === -1) {
					// 不存在则添加
					this.articleInfo.tags.push(item);
				} else {
					// 存在则删除
					this.articleInfo.tags.splice(index, 1);
				}
			},
			// 编辑器初始化完毕，返回edit对象
			editReady(edit) {
				// 将富文本对象存放到当前页面，便于后续直接操作
				this.edit = edit;
				// 监听光标进入
				this.edit.$on('edit:focus', (e) => {
					this.showCurrent = null
				});
				// 监听输入
				this.edit.$on('edit:input', (e) => {
					// console.log('监听输入', e);
				});
				// 监听光标指向不同样式时回调
				this.edit.$on('edit:statuschange', this.editStatus)
			},

			editStatus(e) {
				this.format.format = e.detail
				console.log(e.detail)
			},

			//切换颜色
			colorTap(type, color) {
			
				this.edit.format(type, color);
			},
			// 插入表情
			insertEmoji(src) {
				this.edit.insertEmoji(src)
			},
			// 切换样式
			formatTap(item) {
				this.edit[item.customFn ? item.customFn : 'format'](item.type, item.value);
			},
			// 创建合集
			goCreateCollect() {
				this.$Router.push({
					path: '/pages/user/collect/create'
				})
			},
			// 点击按钮
			btnAction(type) {
				console.log(type)
				switch (type) {
					case 'image':
						this.edit.addImage()
						break;
					case 'at':
						this.showAt = !this.showAt
						break;

					case 'video':
						this.showFont = !this.showFont
						break;
					case 'emoji':
					case 'font':
					case 'more':
						if (this.showCurrent == type) this.showCurrent = null;
						else this.showCurrent = type;
						break;
					default:
						break;
				}
			}
		}
	}
</script>

<style lang="scss">
	@import './static/iconfont.css';

	.swiper {
		height: 100%;
	}

	.tagsbg {
		background-color: $ch-color-primary;
		color: white !important;
	}

	.toolbar {
		width: 100vw;
	}

	.ch-border-primary {
		border: 5px solid #29b7cb;
	}
</style>