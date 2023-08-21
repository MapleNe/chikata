<template>
	<view>
		<tn-nav-bar backTitle="" :zIndex="5">
			{{update?'编辑':'发布'}}
			<view slot="right" class="tn-padding tn-flex tn-flex-col-center">
				<view class="tn-margin-right-sm" v-show="!update">
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
		<lsj-edit ref="lsjEdit" placeholder="输入正文" @onReady="editReady"
			:styles="{'overflow':'hidden','height':'60vh'}"></lsj-edit>
		<you-touchbox :minTop="0.08" :maxTop="0.85" :auto="false" :initTop="0.45"
			customStyle="border-radius:20rpx 20rpx 0 0">
			<view class="tn-flex tn-flex-col-center tn-margin tn-flex-row-between">
				<text v-for="(item,index) in btnList" :key="index"
					:class="[item.icon,item.type==='format'&&format?'tn-color-cyan--dark':'']" class="tn-text-xxl"
					@tap.stop.prevent="switchBtn(item)"></text>
			</view>
			<view v-show="!format">
				<view class="tn-margin">
					<view class="tn-flex tn-flex-col-center">
						<text class="tn-icon-set tn-text-bold"></text>
						<text class="tn-margin-left-sm">发布设置</text>
					</view>
					<view class="tn-border-solid-bottom">
						<tn-input v-model="articleTitle" :maxLength="40" placeholder="请输入标题(可选:建议填写)"
							:clearable="false" />
					</view>
					<tn-list-view :card="true" unlined="all">
						<tn-list-cell unlined :arrow="true" padding="20rpx 0rpx" @click="showSetting = true">
							<view class="tn-flex tn-flex-row-between tn-flex-col-center">
								<view class="tn-flex -tn-flex-col-center">
									<text>分区和标签</text>
									<text class="tn-margin-left-sm tn-color-gray">(必填)</text>
								</view>
								<text class="tn-color-gray--dark">{{selectedCategory.name}}</text>
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
					<tn-list-cell unlined :arrow="true" padding="20rpx 0rpx"
						@click="showPermission = !showPermission">权限</tn-list-cell>
				</view>
			</view>


			<view v-show="format">
				<v-tabs v-model="tabsIndex" :tabs="tabsList" @change="changeTab" lineHeight="8rpx" lineColor="#29B7CB"
					activeColor="#29B7CB" :lineScale="0.2"></v-tabs>
				<view class="tn-margin">
					<!-- 格式 -->
					<view v-show="tabsIndex===0">
						<view class="tn-bg-gray--light tn-padding-sm tn-flex tn-flex-wrap tn-flex-row-between"
							style="border-radius: 20rpx;">
							<text v-for="(item,index) in fontFormat" :key="index "
								class="tn-margin-sm tn-flex-basic tn-text-xxl"
								:class="[item.icon,{'tn-color-cyan--dark':(formatObj && formatObj.hasOwnProperty(item.type) && formatObj[item.type]==item.id)}]"
								@tap.stop.prevent="formatTap(item)"></text>
						</view>
						<view class="tn-flex tn-flex-col-center">
							<slider v-model="fontSize" min="10" max="50" showValue activeColor="darkcyan"
								backgroundColor="#d8d8d8" blockColor="darkcyan" blockSize="15"
								@change="fontSliderChange" class="tn-flex-1" />
							<tn-number-box v-model="fontSize" :min="10" :max="50"></tn-number-box>
						</view>
					</view>
					<!-- 颜色 -->
					<view v-show="tabsIndex===1">
						<view class="tn-margin-bottom">
							<view class=" tn-margin-bottom">
								<view class="tn-flex tn-flex-col-center tn-flex-row-between">
									<view>
										<text class="tn-text-bold editor icon-font-colors"></text>
										<text class="tn-margin-left-sm">文字颜色</text>
									</view>
									<text>自定义</text>
								</view>
							</view>
							<view class="tn-bg-gray--light tn-padding-sm tn-flex tn-flex-wrap tn-flex-row-between"
								style="border-radius: 20rpx;">
								<text v-for="(item,index) in fontColor" :key="index" :style="{backgroundColor:item}"
									class="tn-padding-sm tn-round"
									:class="[{'tn-shadow':formatObj && formatObj.color ==item.toLowerCase()}]"
									@tap.stop.prevent="colorTap('color',item)"></text>
							</view>
						</view>
						<view>
							<view class=" tn-margin-bottom">
								<view class="tn-flex tn-flex-col-center tn-flex-row-between">
									<view>
										<text class="tn-text-bold editor icon-bg-colors"></text>
										<text class="tn-margin-left-sm">背景</text>
									</view>
									<text>自定义</text>
								</view>

							</view>
							<view class="tn-bg-gray--light tn-padding-sm tn-flex tn-flex-wrap tn-flex-row-between"
								style="border-radius: 20rpx;">
								<text v-for="(item,index) in bgColor" :key="index" :style="{backgroundColor:item}"
									class="tn-padding-sm tn-round"
									:class="[{'tn-shadow':formatObj && formatObj.backgroundColor ==item.toLowerCase()}]"
									@tap.stop.prevent="colorTap('backgroundColor',item)"></text>
							</view>
						</view>

					</view>

				</view>

			</view>
		</you-touchbox>
		<!-- 文章设置 -->
		<tn-popup mode="bottom" :borderRadius="20" v-model="showSetting" backgroundColor="#f8f8f8" safeAreaInsetBottom>
			<view class="tn-margin">
				<view class="tn-flex tn-flex-col-center tn-flex-row-between">
					<text @tap.stop.prevent="showSetting = !showSetting">取消</text>
					<text class="tn-text-bold">选择分区和话题</text>
					<text>确定</text>
				</view>
				<view class="tn-flex tn-flex-col-center tn-bg-white tn-flex-row-between tn-padding-sm tn-margin-top"
					style="border-radius: 10rpx;" @tap.stop.prevent="showCategory =!showCategory">
					<text>分区</text>
					<view class="tn-flex tn-col-center tn-color-gray tn-text-sm">
						<text class="tn-margin-right-sm">{{selectedCategory.name}}</text>
						<text class="tn-icon-right"></text>
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
							<tn-button plain size="sm" shape="round">搜索</tn-button>
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
								hover-class="tn-hover" hover-stay-time="150">
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
		<tn-popup mode="bottom" v-model="showTagCreate">
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
						placeholder="输入标签,至多20个字符" :maxLength="20" />
				</view>
			</view>
		</tn-popup>
		<!-- 填写简介 -->
		<tn-popup mode="bottom" v-model="showDescription">
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
		<tn-popup mode="bottom" v-model="showPermission">
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				update: false,
				edit: null,
				formatObj: null,
				tabsIndex: 0,
				tabsList: ['格式', '颜色'],
				format: false,
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
						type: 'header',
						value: 'H5',
						id: 5,
						icon: 'editor icon-h5'
					},
					{
						type: 'header',
						value: 'H6',
						id: 6,
						icon: 'editor icon-h6'
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
						type: 'marginTop',
						value: '10px',
						id: '10px',
						icon: 'editor icon-to-top'
					},
					{
						type: 'marginBottom',
						value: '10px',
						id: '10px',
						icon: 'editor icon-to-bottom'
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
						type: 'indent',
						value: '-1',
						id: 'indent',
						icon: 'editor icon-menu-unfold'
					},
					{
						type: 'indent',
						value: '+1',
						id: 'indent',
						icon: 'editor icon-menu-fold'
					},
					{
						type: 'direction',
						value: 'rtl',
						id: 'rtl',
						icon: 'editor icon-layout'
					},
					{
						type: 'lineHeight',
						value: '2',
						id: '2',
						icon: 'editor icon-line-height'
					},
					{
						type: 'letterSpacing',
						value: '2em',
						id: '2em',
						icon: 'editor icon-expand'
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
						value: 'check',
						id: 'check',
						icon: 'editor icon-check-square'
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
				collect: null,
				description: null,
				tmpDes: null,
				showCategory: false,
				tags: [],
				showTagCreate: false,
				tagName: null,
				showSetting: false,
				selectedTagsList: [],
				showDescription: false,
				showPermission: false,
				articleOpt: {
					password: '',
					auth: 'anyone',
					comments: {
						show: true,
						allow: true,
					}
				}
			};
		},
		onLoad(params) {
			this.update = params.update
			this.getTags()
			this.getCategory()
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
						this.format = !this.format
						break;
					case 'link':
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
			createTag(name) {
				if (!name || this.selectedTagsList.length >= 10) {
					if (this.selectedTagsList.length >= 10) {
						uni.showToast({
							icon: 'none',
							title: '至多选择10个标签'
						})
						return
					}
				};
				const exist = this.selectedTagsList.some(tag => tag.name === name)
				if (exist) {
					uni.showToast({
						icon: 'none',
						title: '已有相同的标签'
					})
					return
				}
				const newTag = {
					name: name,
					new: true
				}
				this.selectedTagsList.push(newTag)
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
			async publish() {
				uni.showLoading({
					title: '发布中...'
				})
				// 获取插入的图片列表
				let imgs = await this.edit.getImages()
				// 判断是否允许提交
				if (!this.edit.textCount && !imgs.length) {
					uni.showToast({
						title: '再多说点吧~'
					});
				}
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
					// console.log('替换完成,最终内容为', JSON.stringify(res.html));
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
</style>