<template>
	<view>
		<tn-nav-bar backTitle="" :zIndex="5">
			{{update?'编辑':'发布'}}
			<view slot="right" class="tn-padding tn-flex tn-flex-col-center">
				<view class="tn-margin-right-sm" v-show="!update" @tap.stop.prevent="saveDraft()">
					<tn-button size="sm" shape="round" plain>
						存草稿
					</tn-button>
				</view>
				<view @tap.stop.prevent="update?'':publish()">
					<tn-button size="sm" shape="round" backgroundColor="#29B7CB" fontColor="tn-color-white">
						{{update?'更新':'发布'}}
					</tn-button>
				</view>

			</view>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<lsj-edit ref="lsjEdit" placeholder="输入正文" @onReady="editReady" id="editorv"
			:styles="{'overflow':'hidden','height':'60vh'}" :html="draft"></lsj-edit>
		<view v-show="format" style="position: fixed;" :style="'bottom:'+bottom+'px'">
			<scroll-view scroll-x="true" class="toolbar tn-bg-white tn-padding-xs">
				<view class="tn-flex">
					<text v-for="(item,index) in fontFormat" :key="index "
						class="tn-margin-sm tn-flex-basic tn-text-xxl"
						:class="[item.icon,{'tn-color-cyan--dark':(formatObj && formatObj.hasOwnProperty(item.type) && formatObj[item.type]==item.id)}]"
						@tap.stop.prevent="formatTap(item)"></text>
				</view>
			</scroll-view>
		</view>
		<!-- 颜色 -->
		<view v-show="formatColor" style="position: fixed;" :style="'bottom:'+bottom+'px'">
			<scroll-view scroll-x="true" class="toolbar tn-bg-white tn-padding-xs">
				<view class="tn-padding-xs tn-flex tn-flex-col-center">
					<text class="tn-margin-right">文字</text>
					<text v-for="(item,index) in fontColor" :key="index" :style="{backgroundColor:item}"
						class="tn-round tn-margin-right-sm tn-padding-sm"
						:class="[{'tn-shadow':formatObj && formatObj.color ==item.toLowerCase()}]"
						@tap.stop.prevent="colorTap('color',item)"></text>
				</view>
				<view class="tn-padding-xs tn-flex tn-flex-col-center">
					<text class="tn-margin-right">背景</text>
					<text v-for="(item,index) in bgColor" :key="index" :style="{backgroundColor:item}"
						class="tn-padding-sm tn-margin-right-sm tn-round"
						:class="[{'tn-shadow':formatObj && formatObj.backgroundColor ==item.toLowerCase()}]"
						@tap.stop.prevent="colorTap('backgroundColor',item)"></text>
				</view>

			</scroll-view>
		</view>


		<you-touchbox :minTop="0.08" :maxTop="0.85" :auto="false" :initTop="0.45"
			customStyle="border-radius:20rpx 20rpx 0 0" @get-end-detail="getBoxDetail">
			<view class="tn-flex tn-flex-col-center tn-margin tn-flex-row-between">
				<text v-for="(item,index) in btnList" :key="index"
					:class="[item.icon,item.type==='format'&&format||item.type==='color'&& formatColor?'tn-color-cyan--dark':'']"
					class="tn-text-xxl" @tap.stop.prevent="switchBtn(item)"></text>
			</view>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center">
					<text class="tn-icon-set tn-text-bold"></text>
					<text class="tn-margin-left-sm">发布设置</text>
				</view>
				<view class="tn-border-solid-bottom">
					<tn-input v-model="articleTitle" :maxLength="40" placeholder="请输入标题(可选:建议填写)" :clearable="false" />
				</view>
				<tn-list-view :card="true" unlined="all">
					<tn-list-cell unlined :arrow="true" padding="20rpx 0rpx" @click="showSetting = true">
						<view class="tn-flex tn-flex-row-between tn-flex-col-center">
							<view class="tn-flex -tn-flex-col-center">
								<text>分区和标签</text>
								<text class="tn-margin-left-sm tn-color-gray">(必填)</text>
							</view>
							<text class="tn-color-gray--dark tn-margin-right-xl">{{selectedCategory.name}}</text>
						</view>

					</tn-list-cell>
					<tn-list-cell unlined :arrow="true" padding="20rpx 0rpx"
						@click="showDescription = !showDescription">简介</tn-list-cell>
				</tn-list-view>
			</view>
			<view class="tn-bg-gray--light" style="padding:6rpx"></view>
			<view class="tn-margin">
				<view class="tn-margin-bottom-sm">
					<text>帖子设置</text>
				</view>
				<tn-list-cell unlined :arrow="true" padding="20rpx 0rpx" @click="showCollect = !showCollect">
					<view class="tn-flex tn-flex-row-between tn-flex-col-center">
						<text>合集</text>
						<text
							class="tn-color-gray--dark tn-margin-right-xl">{{selectedCollect&& selectedCollect.name}}</text>
					</view>
				</tn-list-cell>
				<tn-list-cell unlined :arrow="true" padding="20rpx 0rpx"
					@click="showPermission = !showPermission">权限</tn-list-cell>

			</view>
		</you-touchbox>
		<!-- 文章设置 -->
		<tn-popup mode="bottom" :borderRadius="20" v-model="showSetting" backgroundColor="#f8f8f8" safeAreaInsetBottom>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<text @tap.stop.prevent="showSetting = !showSetting">取消</text>
					<text class="tn-text-bold">选择分区和话题</text>
					<text @tap.stop.prevent="showSetting = !showSetting">确定</text>
				</view>
				<view class="tn-flex tn-flex-col-center tn-bg-white tn-flex-row-between tn-padding-sm tn-margin-top"
					style="border-radius: 10rpx;" @tap.stop.prevent="showCategory =!showCategory">
					<text>分区</text>
					<view class="tn-flex tn-col-center tn-color-gray tn-text-sm">
						<text class="tn-margin-right-sm">{{selectedCategory.name}}</text>
						<text :class="showCategory? 'tn-icon-down':'tn-icon-right'"></text>
					</view>
				</view>
				<view class="tn-bg-white tn-padding-sm tn-margin-top" style="border-radius: 10rpx;"
					v-show="!showCategory">
					<scroll-view scroll-y style="height: 450rpx;">
						<view v-show="selectedTagsList.length>0">
							<view class="tn-margin-bottom-sm">
								<text class="tn-text-sm tn-color-gray">还可添加{{10-selectedTagsList.length}}个标签</text>
							</view>
							<view class="tn-flex tn-flex-col-center tn-flex-wrap">
								<view
									class="tn-padding-xs tn-round tn-margin-right-sm tn-margin-bottom-sm tn-color-white tagsbg"
									style="position: relative;" v-for="(item,index) in selectedTagsList" :key="index"
									@tap.stop.prevent="tagsTap(item)">
									<text class="tn-padding-xs">{{item.name}}</text>
									<text class="tn-icon-close-fill tn-color-black"
										style="position: absolute;top:-10rpx; right: -10rpx;"></text>
								</view>
							</view>

						</view>
						<view class="tn-flex tn-flex-col-center tn-flex-row-between"
							v-show="selectedTagsList.length==0">
							<text>推荐标签</text>
							<text class="tn-color-gray tn-text-xs">可添加10个标签</text>
						</view>
						<view class="tn-flex tn-flex-col-center">
							<view class="tn-padding-xs tn-round tn-margin-right-sm"
								:class="selectedTagsList && selectedTagsList.map(tags => tags.name).includes(item.name)?'tagsbg':'tn-bg-gray--light tn-color-gray--dark'"
								v-for="(item,index) in tags" :key="index" v-if="index < 2"
								@tap.stop.prevent="tagsTap(item)">
								<text class="tn-padding-xs">{{item.name}}</text>
							</view>
							<tn-button plain shape="round" size="sm" @click="showTagCreate= true">
								<view class=" tn-flex tn-flex-col-center">
									<text class="tn-icon-add"></text>
									<text>自定义标签</text>
								</view>
							</tn-button>
						</view>
						<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-top tn-margin-bottom-sm">
							<text>所有标签</text>
							<view @tap.stop.prevent="goSearch">
								<tn-button plain size="sm" shape="round">搜索</tn-button>
							</view>

						</view>
						<view class="tn-flex tn-flex-col-center tn-flex-wrap">
							<view
								class="tn-flex tn-margin-bottom-sm tn-margin-right-sm tn-flex-col-center tn-round tn-padding-xs"
								:class="selectedTagsList && selectedTagsList.map(tags => tags.name).includes(item.name)?'tagsbg':'tn-bg-gray--light tn-color-gray--dark'"
								v-for="(item,index) in tags" :key="index" @tap.stop.prevent="tagsTap(item)">
								<text class="tn-icon-topic"
									:class="{'ch-color':!selectedTagsList.map(tags => tags.name).includes(item.name)}"></text>
								<text class="tn-margin-left-xs">{{item.name}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="tn-bg-white tn-padding-sm tn-margin-top" style="border-radius: 10rpx;"
					v-show="showCategory">
					<scroll-view scroll-y style="height: 450rpx;">
						<text>选择分区</text>
						<view class="tn-margin-top tn-flex tn-flex-direction-column">
							<view class="tn-flex tn-margin-top" v-for="(item,index) in category" :key="index"
								hover-class="tn-hover" hover-stay-time="150" @tap.stop.prevent="categoryTap(item)">
								<view>
									<image :src="item.opt.head_img" mode="aspectFill" class="tn-round"
										style="height: 60rpx;width: 60rpx;"></image>
								</view>
								<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
									<text class="tn-text-bold">{{item.name}}</text>
									<view class="tn-bg-gray--light tn-padding-xs tn-margin-top-xs tn-text-ellipsis-2"
										style="border-radius: 20rpx;">
										<text class="tn-padding-xs tn-color-gray">{{item.description}}</text>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</tn-popup>
		<!-- 创建标签 -->
		<tn-popup mode="bottom" v-model="showTagCreate" safeAreaInsetBottom>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<text @tap.stop.prevent="showTagCreate = !showTagCreate">取消</text>
					<text>
						填写标签
					</text>
					<text @tap.stop.prevent="createTag(tagName)">
						确定
					</text>
				</view>
				<view class="tn-bg-gray--light tn-margin-top tn-padding-sm tn-padding-top-xs"
					style="border-radius: 10rpx;">
					<tn-input type="text" confirmType="完成" v-model="tagName" :clearable="false"
						placeholder="输入标签,至多20个字符" focus :maxLength="20" />
				</view>
			</view>
		</tn-popup>
		<!-- 填写简介 -->
		<tn-popup mode="bottom" v-model="showDescription" safeAreaInsetBottom>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-row-between tn-flex-col-center">
					<text @tap.stop.prevent="showDescription = !showDescription">取消</text>
					<text>填写简介</text>
					<text @tap.stop.prevent="setDescription">确定</text>
				</view>
				<view class="tn-bg-gray--light tn-margin-top tn-padding-sm tn-padding-top-xs"
					style="border-radius: 10rpx;">
					<tn-input type="textarea" confirmType="完成" v-model="tmpDes" focus :clearable="false"
						placeholder="输入简介,至多1000个字符" :maxLength="1000" />
				</view>
			</view>
		</tn-popup>
		<!-- 权限设置 -->
		<tn-popup mode="bottom" v-model="showPermission" safeAreaInsetBottom>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-bottom-xl">
					<text></text>
					<text>设置权限</text>
					<text @tap.stop.prevent="showPermission = !showPermission">确定</text>
				</view>
				<view class="tn-flex tn-flex-direction-column">
					<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-bottom"
						@click="changePermission('auth')">
						<text>谁人可见</text>
						<text>{{articleOpt.auth=='anyone'?'已公开':'已私有'}}</text>
					</view>
					<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-bottom"
						@click="changePermission('comments','allow')">
						<text>允许评论</text>
						<text>{{articleOpt.comments.allow?'已允许':'不允许'}}</text>
					</view>
					<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-bottom"
						@click="changePermission('comments','show')">
						<text>评论可见</text>
						<text>{{articleOpt.comments.show?'已允许':'不允许'}}</text>
					</view>
				</view>
			</view>
		</tn-popup>
		<!-- 合集设置 -->
		<tn-popup mode="bottom" v-model="showCollect" :borderRadius="20" backgroundColor="#f8f8f8" safeAreaInsetBottom>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-bottom">
					<text @tap.stop.prevent="showCollect = !showCollect">取消</text>
					<text class="tn-text-bold">选择合集</text>
					<text @tap.stop.prevent="showCollect = !showCollect">确定</text>
				</view>
				<view class="tn-flex tn-flex-direction-column">
					<view class="tn-flex tn-flex-col-center tn-margin-bottom" v-for="(item,index) in collects"
						:key="index"
						:class="selectedCollect && selectedCollect.id == item.id?'tn-round tn-padding-sm tn-bg-white':''"
						@tap.stop.prevent="collectsTap(item)">
						<tn-avatar shape="square" size="sm" :src="item.image"></tn-avatar>
						<text class="tn-margin-left-sm">{{item.name}}</text>
					</view>

				</view>
			</view>
		</tn-popup>
		<!-- 添加链接 -->
		<tn-modal v-model="showAddLink" padding="0rpx" custom width="80%" showCloseBtn>
			<view class="tn-margin" @touchmove.stop.prevent>
				<view class="tn-flex-row-center tn-flex tn-margin-bottom">
					<text class="tn-text-bold">添加链接</text>
				</view>
				<view class="tn-flex tn-flex-direction-column">
					<view class="tn-flex tn-flex-col-center tn-bg-gray--light tn-round tn-margin-bottom">
						<text class="tn-icon-link tn-padding-left-sm tn-padding-right-sm"></text>
						<view class="tn-padding-right-sm tn-flex-1">
							<tn-input v-model="link" :clearable="false" placeholder="https://" />
						</view>
					</view>
					<view class="tn-flex tn-flex-col-center tn-bg-gray--light tn-round tn-margin-bottom">
						<text class="tn-icon-image-text tn-padding-left-sm tn-padding-right-sm"></text>
						<view class="tn-padding-right-sm tn-flex-1">
							<tn-input v-model="linkName" :clearable="false" placeholder="链接展示的文本" />
						</view>
					</view>
					<view class="tn-margin-top" @tap.stop.prevent="addLink()">
						<tn-button backgroundColor="#29B7CB" shape="round" fontColor="tn-color-white"
							style="width: 100%;">添加链接</tn-button>
					</view>

				</view>
			</view>
		</tn-modal>
		<!-- 保存草稿 -->
		<tn-modal v-model="showDraft" padding="0rpx" custom width="80%">
			<view class="tn-margin">
				<view class="tn-text-center">
					<text class="tn-text-bold">是否载入草稿？</text>
				</view>
				<view class="tn-margin-top-xl tn-flex tn-flex-col-center tn-flex-row-between">
					<view @tap.stop.prevent="deleteDraft()">
						<tn-button fontColor="tn-color-red">删除</tn-button>
					</view>
					<view @tap.stop.prevent="insertDraft()">
						<tn-button>载入</tn-button>
					</view>
				</view>
			</view>
		</tn-modal>
	</view>
</template>

<script>
	import {
		mapstate
	} from 'vuex';
	export default {
		data() {
			return {
				link: null,
				linkName: null,
				update: false,
				edit: null,
				formatObj: null,
				tabsIndex: 0,
				tabsList: ['格式', '颜色'],
				format: false,
				formatColor: false,
				curTop: 0,
				btnList: [{
						name: '图片',
						type: 'pictrue',
						icon: 'tn-icon-image',

					},
					{
						name: '视频',
						type: 'video',
						icon: 'tn-icon-play',

					},
					{
						name: '格式',
						type: 'format',
						icon: 'tn-icon-font',
					},
					{
						name: '颜色',
						type: 'color',
						icon: 'tn-icon-theme',
					},
					{
						name: '链接',
						type: 'link',
						icon: 'tn-icon-link',

					},
					{
						name: '商品',
						type: 'good',
						icon: 'tn-icon-shop',

					},
					{
						name: '撤回',
						type: 'undo',
						icon: 'editor icon-undo',
						customFn: 'tool'
					}
				],
				fontFormat: [{
						type: 'header',
						value: 'H2',
						id: 2,
						icon: 'editor icon-h2'
					},
					{
						type: 'header',
						value: 'H3',
						id: 3,
						icon: 'editor icon-h3'
					},
					{
						type: 'header',
						value: 'H4',
						id: 4,
						icon: 'editor icon-h4'
					},

					{
						type: 'bold',
						value: '粗体',
						id: true,
						icon: 'editor icon-bold'
					},
					{
						type: 'italic',
						value: '斜体',
						id: true,
						icon: 'editor icon-italic'
					},
					{
						type: 'underline',
						value: '下划线',
						id: true,
						icon: 'editor icon-underline'
					},
					{
						type: 'strike',
						value: '删除线',
						id: true,
						icon: 'editor icon-strikethrough'
					},
					{
						type: 'align',
						value: 'left',
						id: 'left',
						icon: 'editor icon-align-left'
					},
					{
						type: 'align',
						value: 'center',
						id: 'center',
						icon: 'editor icon-align-center'
					},
					{
						type: 'align',
						value: 'right',
						id: 'right',
						icon: 'editor icon-align-right'
					},

					{
						type: 'lineHeight',
						value: '2',
						id: '2',
						icon: 'editor icon-line-height'
					},
					{
						type: 'script',
						value: 'sub',
						id: 'sub',
						icon: 'editor icon-caret-down'
					},
					{
						type: 'script',
						value: 'super',
						id: 'super',
						icon: 'editor icon-caret-up'
					},
					{
						type: 'list',
						value: 'ordered',
						id: 'ordered',
						icon: 'editor icon-ordered-list'
					},
					{
						type: 'list',
						value: 'bullet',
						id: 'bullet',
						icon: 'editor icon-unordered-list'
					},
					{
						type: 'insertDivider',
						value: '',
						id: true,
						icon: 'editor icon-minus',
						customFn: 'tool'
					},
					{
						type: 'removeFormat',
						value: '',
						id: true,
						icon: 'editor icon-eraser',
						customFn: 'tool'
					},
					{
						type: 'clear',
						value: '',
						id: 'clear',
						icon: 'editor icon-delete',
						customFn: 'tool'
					},
				],
				fontColor: [
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
				bgColor: [
					'#E8E8E8',
					'#FED0D0',
					'#FBF0B8',
					'#C3ECDA',
					'#B2D1FF',
					'#E0C4FF',
				],
				fontSize: 16,
				articleTitle: null,
				category: [],
				selectedCategory: {},
				categoryName: null,
				categoryId: null,
				description: null,
				tmpDes: null,
				showCategory: false,
				tags: [],
				collects: [],
				selectedCollect: null,
				showTagCreate: false,
				tagName: null,
				showSetting: false,
				selectedTagsList: [],
				showDescription: false,
				showPermission: false,
				showCollect: false,
				articleOpt: {
					password: '',
					auth: 'anyone',
					comments: {
						show: true,
						allow: true,
					}
				},
				keyHeight: 0,
				bottom: 0,
				showDraft: false,
				draft: null,
				showAddLink: false,
			};
		},
		onLoad(params) {
			uni.onKeyboardHeightChange((res) => {
				// 监听软键盘的高度，页面隐藏后一定要取消监听键盘
				if (res.height !== 0) this.bottom = 0;

				if (res.height === 0) {
					this.bottom = this.curTop
				}
			})
			this.update = params.update
			this.getTags()
			this.getCollect()
			this.getCategory()
			if (uni.getStorageSync('draft')) {
				this.showDraft = true
			}
		},
		created() {
			uni.$on('searchTag', data => {
				this.tagsTap(data)
			})
		},
		computed: {

		},

		methods: {
			getTags() {
				this.$http.get('tag/all', {
					params: {
						page: 1,
						limit: 20,
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.tags = res.data.data.data
					}
				})
			},
			getCollect() {
				this.$http.get('/collections/Find', {
					params: {
						page: 1,
						limit: 10,
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.collects = res.data.data
					}
				})
			},
			getCategory() {
				this.$http.get('article-sort/all', {
					params: {
						page: 1,
						limit: 20,
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.category = res.data.data.data
						this.selectedCategory = res.data.data.data[0]
					}
				})
			},
			// 编辑器初始化完毕，返回edit对象
			editReady(edit) {
				// 将富文本对象存放到当前页面，便于后续直接操作
				this.edit = edit;
				// 监听光标进入
				this.edit.$on('edit:focus', (e) => {
					console.log('监听光标进入', e);

				});
				// 监听输入
				this.edit.$on('edit:input', (e) => {

					console.log('监听输入', e);
				});
				// 监听光标指向不同样式时回调
				this.edit.$on('edit:statuschange', this.statuschange)
			},
			statuschange(e) {
				this.formatObj = e.detail
				if (this.formatObj.hasOwnProperty('fontSize')) {
					this.fontSize = parseInt(this.formatObj['fontSize']);
				} else {
					this.fontSize = 16;
				}
			},
			switchBtn(item) {
				switch (item.type) {
					case 'pictrue':
						this.edit.addImage()
						break;
					case 'video':
						break;
					case 'format':
						if (this.formatColor) {
							this.formatColor = false
						}
						this.format = !this.format
						break;

					case 'color':
						if (this.format) {
							this.format = false
						}
						this.formatColor = !this.formatColor
						break;
					case 'link':
						this.showAddLink = !this.showAddLink
						break;
					case 'good':
						break;
					case 'undo':
						this.formatTap(item)
						break;
					default:
						break;
				}
			},
			changeTab(index) {
				this.tabsIndex = index
			},
			formatTap(item) {
				this.edit[item.customFn ? item.customFn : 'format'](item.type, item.value);
			},
			colorTap(type, color) {
				this.edit.format(type, color);
			},
			setDescription() {
				this.description = this.tmpDes
				this.showDescription = !this.showDescription
			},
			changePermission(type, subType) {
				switch (type) {
					case 'auth':
						this.articleOpt.auth = this.articleOpt.auth == 'anyone' ? 'private' : 'anyone';
						console.log(this.articleOpt.auth)
						break;
					case 'comments':
						if (subType == 'show') this.articleOpt.comments.show = !this.articleOpt.comments.show;
						if (subType == 'allow') this.articleOpt.comments.allow = !this.articleOpt.comments.allow;
						break;
					default:
						break;
				}
			},
			getBoxDetail(e) {
				this.curTop = uni.getSystemInfoSync().windowHeight - e.curTop
				this.bottom = this.curTop
			},
			createTag(name) {
				// 检查是否已存在于 tags 
				if (this.selectedTagsList.length >= 10) {
					uni.showToast({
						icon: 'none',
						title: '至多添加10个标签'
					})
					return
				}
				if (this.tags.some(t => t.name === name)) {
					// 获取已存在的标签数据
					const tag = this.tags.find(t => t.name === name)

					// 检查是否已在 selectedTagsList 中
					if (!this.selectedTagsList.includes(tag)) {
						// 仅当不存在时才添加 
						this.selectedTagsList.push(tag)
					}
					return
				}
				// 新建标签
				const newTag = {
					name,
					new: true
				}
				// 检查是否已在 selectedTagsList 中 
				if (!this.selectedTagsList.includes(newTag)) {
					this.selectedTagsList.push(newTag)
				}
				this.tagName = null
			},
			goSearch() {
				this.$Router.push({
					path: '/pages/tabbar/publish/searchTag',
				})
			},
			categoryTap(item) {
				this.selectedCategory = item
				this.showCategory = !this.showCategory
			},
			tagsTap(item) {
				const index = this.selectedTagsList.findIndex(tag => tag.id === item.id)
				if (index === -1) {
					if (this.selectedTagsList.length >= 10) {
						uni.showToast({
							icon: 'none',
							title: '至多选择10个标签'
						})
						// 已达到最大标签数,禁止添加
						return
					} else {
						this.selectedTagsList = this.selectedTagsList.concat(item)
					}
				} else {
					// 如果存在,则删除该标签
					this.selectedTagsList.splice(index, 1)
				}
			},
			collectsTap(item) {
				if (this.selectedCollect && this.selectedCollect.id === item.id) {
					// 如果点击的是已经选中的标签,则取消选中
					this.selectedCollect = null
				} else {
					// 如果是未选中的标签,则选中它
					this.selectedCollect = item
				}
			},
			async publish() {
				// 获取插入的图片列表
				let imgs = await this.edit.getImages()
				// 判断是否允许提交
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
					} = await this.$http.upload('/file/upload', {
						filePath: img,
						name: 'file',
					})
					return data.data
				}).then(res => {
					console.log('替换完成,最终内容为', JSON.stringify(res.html));
					this.addArtiCle(res)
				});
			},
			addArtiCle(res) {
				const idTags = this.selectedTagsList.filter(t => t.id)
				const newTags = this.selectedTagsList.filter(t => t.new)
				const idList = idTags.map(t => t.id)
				const newNameList = newTags.map(t => t.name)
				this.$http.post('/article/save', {
					title: this.articleTitle ? this.articleTitle : res.text.substring(0, 10),
					content: res.html,
					description: this.description ? this.description : '',
					sort_id: this.selectedCategory.id,
					tag_id: idList,
					collections_id: this.selectedCollect&&this.selectedCollect.id?this.selectedCollect.id:'',
					tag_name: newNameList,
					opt: JSON.stringify(this.articleOpt),
				}).then(res => {
					if (res.data.code === 200) {
						console.log(res)
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: '发布' + res.data.msg
						})
						setTimeout(() => {
							this.$Router.replace({
								path: '/pages/common/article/article',
								query: {
									id: res.data.data
								}
							})
						}, 2000)

					} else {
						uni.hideLoading()
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					}
				}).catch(err => {
					console.log(err)
					uni.showToast({
						icon: 'none',
						title: res.data.msg
					})
				})
			},
			async saveDraft() {
				const contents = await this.edit.getContents()
				uni.setStorageSync('draft', contents.html)
				uni.showToast({
					icon:'none',
					title:'已保存草稿'
				})
			},
			deleteDraft() {
				uni.removeStorageSync('draft')
				this.showDraft = !this.showDraft
			},
			insertDraft() {
				this.draft = uni.getStorageSync('draft')
				this.showDraft = !this.showDraft
			},
			addLink() {
				const link = {
					name: this.linkName,
					data: {
						type:'link',
						url:this.link
					}
				}
				this.edit.addLink(link)
				this.showAddLink = !this.showAddLink
			},
			// 字号滑动条
			fontSliderChange({
				detail
			}) {
				this.fontsize = detail.value;
				this.edit.format('fontSize', detail.value + 'px');
			},
		}
	}
</script>

<style lang="scss">
	@import './static/iconfont.css';

	page {
		background-color: #f7f8f7;
	}

	.swiper {
		height: 100%;
	}

	.tagsbg {
		background-color: $ch-color-primary;
		color: white !important;
	}

	.ch-color {
		color: $ch-color-primary;
	}

	.toolbar {
		width: 100vw;
	}
</style>