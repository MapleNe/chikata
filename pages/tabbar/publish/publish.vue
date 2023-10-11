<template>
	<view>
		<tn-nav-bar backTitle="" :zIndex="2">
			编辑
			<view class="tn-padding tn-flex tn-flex-col-center" slot="right">
				<view class="tn-margin-right-sm" v-if="!params.update">
					<tn-button size="sm" plain @click="showDraftList = true">
						草稿箱
					</tn-button>
				</view>

				<tn-button size="sm" plain fontColor="#29b7cb" backgroundColor="#29b7cb" @click="publish">
					{{params.update?'更新':'发布'}}
				</tn-button>
			</view>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view class="tn-flex tn-flex-direction-column tn-flex-row-between">

			<view :style="{height:screenHeight -100- editHeight - keyHeight +'px',overflow:'scroll'}" class="tn-margin">
				<view class="tn-color-grey--disabled tn-flex tn-flex-col-center">
					<tn-input v-model="articleInfo.title" :maxLength="titleMAX" placeholder-style="color:#C6D1D8"
						:clearable="false" placeholder="标题(必填)" />
					<text class="tn-text-sm">{{articleInfo.title.length}}/{{titleMAX}}</text>
				</view>


				<lsj-edit ref="lsjEdit" :onreadOnly="isReady" :html="articleInfo.content" @onReady="editReady"
					placeholder="请尽情发挥吧..." :max-count="contentMAX" @tap="showCurrent = null"></lsj-edit>
				<!-- 遮罩 -->
				<view v-if="isReady" @tap="showCurrent =null" style="position: fixed;top: 0;width: 100%;height: 100vh;">
				</view>
			</view>
			<view style="position: absolute;bottom: 0;width: 100%;" class="tn-bg-white" id="contentBtn">
				<view class="tn-text-right tn-margin-right">
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
							<text class="tn-icon-install" @tap.stop.prevent="btnAction('set')"></text>
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
					<view v-if="showCurrent == 'set'">
						<scroll-view scroll-y style="height: 300rpx;">
							<view
								class="tn-flex tn-flex-col-center tn-margin-top tn-flex-row-between tn-border-solid-bottom tn-padding-bottom-sm tn-border-gray--light"
								@tap.stop.prevent="showCollect = true">
								<text>加入合集</text>
								<view class="tn-flex tn-flex-col-center">
									<text
										class="tn-margin-right-xs tn-color-grey--disabled">{{articleInfo.collect&&articleInfo.collect.name}}</text>
									<i class="tn-icon-right"></i>
								</view>
							</view>
							<!-- 创作设置 -->
							<view
								class="tn-flex tn-flex-col-center tn-flex-row-between tn-border-solid-bottom tn-border-gray--light">
								<view class="tn-flex tn-flex-direction-column">
									<text>创作设置</text>
									<view>
										<text class="tn-text-sm tn-color-grey--disabled">
											启用后代表独立创作|阅读并接受
										</text>
										<text class="ch-color-primary">《内容创作协议》</text>
									</view>
								</view>
								<tn-switch v-model="creative" activeColor="#29b7cb" :size="40"></tn-switch>
							</view>
							<!-- 公开可见 -->
							<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top-sm">
								<view class="tn-flex tn-flex-direction-column">
									<text>公开可见</text>
									<text class="tn-text-sm tn-color-grey--disabled">开启后文章可被所有人查看</text>
								</view>
								<tn-switch v-model="auth" activeColor="#29b7cb" :size="40"
									@input="authChange"></tn-switch>
							</view>
							<view v-if="creative">
								<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top-sm">
									<view class="tn-flex tn-flex-direction-column">
										<text>允许评论发图片</text>
										<text class="tn-text-sm tn-color-grey--disabled">
											关闭后评论无法发送图片
										</text>
									</view>
									<tn-switch v-model="articleInfo.opt.comments.image" activeColor="#29b7cb"
										:size="40"></tn-switch>
								</view>
								<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top-sm">
									<text>允许规范转载</text>
									<tn-switch v-model="articleInfo.opt.transport" activeColor="#29b7cb"
										:size="40"></tn-switch>
								</view>
							</view>
						</scroll-view>
					</view>
				</view>
			</view>
		</view>
		<!-- 弹出层开始 -->
		<!-- 选择板块 -->
		<tn-popup mode="bottom" :borderRadius="20" length="60%" v-model="showCategory">
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
			<z-paging ref="tags" @query="getTag" v-model="tag">
				<template #top>
					<view class="tn-margin tn-flex tn-flex-row-between tn-flex-col-center">
						<text class="tn-icon-close tn-text-xxl" @tap.stop.prevent="showTag = false"></text>
						<text>选择话题</text>
						<text class="ch-color-primary" @tap.stop.prevent="showTag = false">确认</text>
					</view>
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
						<tn-input v-model="searchKey" :clearable="false" placeholder="搜索话题" @input="searchTag" />
					</view>
					<view class="tn-margin tn-text-md tn-margin-top-xl">
						<text class="tn-text-bold">推荐话题：</text>
					</view>
				</template>
				<!-- 推荐话题 -->
				<view class="tn-margin tn-text-md">
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
			</z-paging>
		</tn-popup>
		<!-- 选择合集 -->
		<tn-popup mode="bottom" v-model="showCollect" :borderRadius="20" length="50%">
			<z-paging ref="collect" @query="getCollect" v-model="collect" :refresher-enabled="false">
				<template #top>
					<view class="tn-margin tn-flex tn-flex-col-center tn-flex-row-between">
						<text>选择合集</text>
						<text class="ch-color-primary tn-text-md" @tap.stop.prevent="goCreateCollect()">创建合集</text>
					</view>
				</template>
				<view class="tn-flex tn-flex-direction-column">
					<view class="tn-flex tn-flex-col-center tn-text-md tn-flex-row-between tn-margin"
						@tap.stop.prevent="articleInfo.collect=null;showCollect=false">
						<text>不加入合集</text>
						<view class="tn-round" :class="[!articleInfo.collect?'ch-border-primary':'tn-border-solid']"
							style="height: 32rpx; width: 32rpx;"></view>
					</view>
					<view class="tn-margin">
						<block v-for="(item,index) in collect" :key="index">
							<view class="tn-flex tn-margin-bottom tn-flex-col-center tn-text-md tn-flex-row-between"
								@tap.stop.prevent="articleInfo.collect = item;showCollect=false">
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
		<!-- 草稿列表 -->
		<tn-popup mode="bottom" v-model="showDraftList" :borderRadius="20" length="60%">
			<view class="tn-margin tn-flex tn-flex-row-between tn-flex-col-center">
				<text class="tn-icon-close tn-text-xxl" @tap.stop.prevent="showDraftList = false"></text>
				<text class="ch-color-primary" @tap.stop.prevent="deleteDraft(0,'all')">清空</text>
			</view>
			<view class="tn-margin" v-if="draftList.length">
				<block v-for="(item,index) in draftList" :key="index">
					<view class="tn-margin-bottom tn-flex tn-flex-direction-column tn-color-gray tn-text-md"
						@tap.stop.prevent="getDraft(item)">
						<view class="tn-flex tn-flex-col-center tn-flex-row-between">
							<text>编辑于 {{item&&item.update_time}}</text>
							<text @tap.stop.prevent="deleteDraft(index)">删除</text>
						</view>
						<view class="tn-flex tn-margin-top-sm">
							<view class=" tn-bg-grey--light tn-flex tn-flex-col-center tn-flex-row-center"
								style="width: 120rpx;height: 120rpx;border-radius: 10rpx;">
								<text class="tn-icon-image-text tn-text-xl-xxl"></text>
							</view>
							<view
								class="tn-margin-left-sm tn-flex tn-flex-direction-column tn-flex-row-between tn-text-ellipsis">
								<text>{{item&&item.title}}</text>
								<text class="tn-text-ellipsis-2">{{item&&item.content}}</text>
							</view>
						</view>
					</view>
				</block>
			</view>
			<view class="tn-margin tn-margin-top-xl tn-padding-top-xl tn-flex tn-flex-row-center tn-flex-col-center"
				v-else>
				<text class="tn-text-md tn-color-grey--disabled">干净清爽...</text>
			</view>
		</tn-popup>
		<!-- 保存草稿 -->
		<tn-popup mode="center" :borderRadius="20" v-model="showSaveDraft" length="80%" :zIndex="5">
			<view class="tn-margin">
				<view class="tn-flex tn-flex-direction-column tn-flex-col-center">
					<text>保存草稿</text>
					<text class="tn-padding-sm tn-color-gray--dark" style="font-size: 28rpx;">是否保存草稿？</text>
				</view>
			</view>
			<view class="tn-padding tn-color-gray--dark tn-bg-gray--light">
				<view class="tn-flex tn-flex-row-around" style="font-size: 28rpx;">
					<view class="tn-flex-1 tn-text-center" @tap.stop.prevent="showSaveDraft= false">
						<text>取消</text>
					</view>
					<text class="tn-color-grey--light">|</text>
					<view class="tn-flex-1 tn-text-center" @tap.stop.prevent="saveDraft()">
						<text class="ch-color-primary">确定</text>
					</view>
				</view>
			</view>
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
				onreadOnly: false,
				col: 4,
				params: null,
				titleMAX: 30,
				contentMAX: 30000,
				category: null,
				collect: [],
				tag: [],
				btnList: [{
						type: 'image',
						icon: 'image',
					},
					{
						type: 'emoji',
						icon: 'emoji-good',
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
					opt: {
						password: '',
						auth: 'anyone',
						comments: {
							show: true,
							allow: true,
							image: true,
						},
						transport: false,
					}
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
				// 搜索关键词
				searchKey: '',
				// 显示合集
				showCollect: false,
				realBack: false,
				// 显示草稿
				showSaveDraft: false,
				// 草稿列表
				showDraftList: false,
				draftList: [],
				// 创作
				creative: false,
				auth: true,
			}
		},
		onLoad(params) {
			this.params = params
		},

		beforeRouteLeave(to, from, next) {
			this.$Router.$lockStatus = false
			if (this.edit.textCount >= 10 && !this.realBack) {
				this.showSaveDraft = true
				next(false)
				return
			}
			next()
		},
		onReady() {
			uni.createSelectorQuery().select('#contentBtn').boundingClientRect(data => {
				this.editHeight = data.height
			}).exec()
			this.screenHeight = uni.getSystemInfoSync().windowHeight
			uni.onKeyboardHeightChange(data => {
				this.keyHeight = data.height
			})

			console.log(this.editHeight, this.keyHeight, this.screenHeight)
			this.initData()
			// 获取草稿
			this.draftList = uni.getStorageSync('draft')
			if (!this.draftList) this.draftList = [];

		},

		computed: {
			// 兼容小程序
			gridItemWidth() {
				return 100 / this.col + '%'
			},
			// 是否为编辑
			isReady() {
				let status = false
				if (this.showCurrent != 'font' && this.showCurrent != null) status = true
				return status
			},
		},
		methods: {
			initData() {
				// 获取分类
				this.getCategory()
				// 获取表情
				this.getEmoji()
				if (this.params.update) {
					this.getArticle()
				}
			},
			getArticle() {
				this.$http.get('/article/one', {
					params: {
						id: this.params.id
					}
				}).then(res => {
					if (res.data.code === 200) {
						console.log(res)
						this.articleInfo.title = res.data.data.title
						this.articleInfo.content = res.data.data.content
						this.articleInfo.tags = res.data.data.expand.tag
						this.articleInfo.sort = res.data.data.expand.sort[0]
						this.articleInfo.opt = res.data.data.opt
						this.articleInfo.collect = res.data.data.expand.collections
					}
				})
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
			// 获取标签
			getTag(page, limit) {
				this.$http.get('/tag/all', {
					params: {
						page: page,
						limit: 20
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$refs.tags.complete(res.data.data.data)
					}
				})
			},
			// 搜索标签
			searchTag(page, limit) {
				this.$http.get('/tag/sql', {
					params: {
						page,
						limit,
						where: `name like '%${this.searchKey}%'`
					}
				}).then(res => {

					this.$refs.tags.complete(res.data.data.data)
				})
			},
			// 获取表情
			getEmoji() {
				this.$http.get('/emoji/list', {}).then(res => {
					if (res.data.code === 200) {
						this.emoji.tab = res.data.data
						this.getEmojiList(res.data.data[0])
					}
				})
			},
			// 获取表情列表
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
			// 获取合集
			getCollect(page, limit) {
				this.$http.get('/collections/users', {
					params: {
						page,
						limit
					}
				}).then(res => {
					console.log(res)
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
			// 切换权限
			authChange(e) {
				if (e) this.articleInfo.opt.auth = 'anyone';
				else this.articleInfo.opt.auth = 'private';
			},

			// 发布准备
			async publish() {
				// 获取插入的图片列表
				let imgs = await this.edit.getImages()
				// 判断是否允许提交
				if (!this.articleInfo.sort) {
					uni.showToast({
						icon: 'none',
						title: '未选择分区'
					});
					return;
				}
				if (!this.articleInfo.title) {
					uni.showToast({
						icon: 'none',
						title: '标题未填写~'
					});
					return;
				}
				if (!this.edit.textCount && !imgs.length) {
					uni.showToast({
						icon: 'none',
						title: '再多说点吧~'
					});
					return;
				}
				uni.showLoading({
					title: '发布中...'
				})
				// 将所有未上传的本地图片上传到服务器并替换到编辑器
				this.edit.replaceImage(async (img) => {
					// 已上传的无需再上传
					// img.indexOf('http') = 0说明这个图片已经是网络地址，无需替换就直接跳过
					if (img.indexOf('http') === 0) {
						return img;
					}
					// 上传并替换图片
					let {
						data
					} = await this.$http.upload('/file/uploadImg', {
						filePath: img,
						name: 'file',
					})
					return data.data
				}).then(res => {
					// console.log('替换完成,最终内容为', JSON.stringify(res.html));
					// 在这全局替换表情
					const pattern = /<img[^>]+src="[^"]+\/([^/]+)\.[^"]*"[^>]*alt="emoji"[^>]*>/g;
					res.html = res.html.replace(pattern, '_($1)')
					// 发布文章
					this.addArticle(res)

				});
			},
			addArticle(res) {
				const idTags = this.articleInfo.tags.filter(t => t.id)
				const idList = idTags.map(t => t.id)
				this.$http.post('/article/save', {
					id: this.params.update ? this.params.id : '',
					title: this.articleInfo.title ? this.articleInfo.title : res.text.substring(0, 10),
					content: res.html,
					sort_id: this.articleInfo.sort.id,
					tag_id: idList,
					collections_id: this.articleInfo.collect && this.articleInfo.collect.id ? this
						.articleInfo
						.collect.id : '',
					opt: JSON.stringify(this.articleInfo.opt),
				}).then(res => {
					if (res.data.code === 200) {
						this.realBack = true
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: '发布' + res.data.msg
						})
						// 如果articleInfo.id存在且等于草稿中的id，则删除草稿
						const index = this.draftList.findIndex(draft => draft.id === this.articleInfo
							.id);
						if (index !== -1) {
							this.draftList.splice(index, 1);
							uni.setStorageSync('draft', this.draftList);
						}
						setTimeout(() => {
							this.$Router.replaceAll({
								path: '/pages/common/article/article',
								query: {
									id: res.data.data
								}
							})
						}, 1000)
					}
				}).catch(err => {
					console.log(err)
					uni.showToast({
						icon: 'none',
						title: res.data.msg
					})
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
					case 'set':
						if (this.showCurrent == type) this.showCurrent = null;
						else this.showCurrent = type;
						break;
					default:
						break;
				}
			},
			// 保存草稿
			async saveDraft() {
				let nowTime = new Date().toLocaleDateString();
				let article = this.articleInfo;
				let content = await this.edit.getContents();
				article.content = content.html;
				article.update_time = nowTime;

				// 检查是否已存在相同ID的草稿
				let index = this.draftList.findIndex(draft => draft.id === article.id);

				if (index !== -1) {
					// 如果存在相同ID的草稿，更新草稿
					this.draftList[index] = article;
				} else {
					// 否则，添加新的草稿到列表
					article.id = this.draftList.length++; // 请注意这里的写法
					this.draftList.push(article);
				}

				this.realBack = true;
				uni.setStorageSync('draft', this.draftList);
				uni.showToast({
					icon: 'none',
					title: '保存成功！'
				});
				setTimeout(() => {
					this.$Router.back(1);
				}, 500);
			},
			// 删除草稿
			deleteDraft(index, type) {
				if (type == 'all') this.draftList = [];
				else this.draftList.splice(index, 1); // 删除指定索引的元素
				uni.setStorageSync('draft', this.draftList);
				this.draftList = uni.getStorageSync('draft');
			},

			// 设置草稿
			getDraft(article) {
				console.log(article)
				this.articleInfo = article
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