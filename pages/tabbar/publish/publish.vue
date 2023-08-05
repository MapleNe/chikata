<template>
	<view class="tn-bg-gray--light">
		<tn-nav-bar fiexd :zIndex="2">
			编辑
			<view slot="right" class="tn-margin">
				<tn-button size="sm" shape="round" :plain="true" @tap="save">保存</tn-button>
			</view>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<lsj-edit ref="lsjEdit" placeholder="啊~灵感在迸发~" @onReady="editReady"
			:styles="{'overflow':'hidden','height':'75vh'}">
		</lsj-edit>
		<!-- 上拉组件 -->
		<you-touchbox :auto="false" :maxTop="0.85" :minTop="0.08" :initTop="0.5"
			customStyle="border-radius:20rpx 20rpx 0 0">
			<view class="tn-margin tn-flex tn-flex-row-between tn-text-xxl">
				<text class="tn-icon-image" @tap="addImage"></text>
				<!-- 循环控件 -->
				<view v-for="(item ,index) in editList" :key="item.id" @tap="editAction(item)">
					<text :class="[item.icon, {'ch-color-primary': moreAction === item.id}]"></text>
				</view>
			</view>
			<!-- 展开面板 -->
			<view v-show="moreAction === 0" class="tn-margin">
				<view class="tn-margin-bottom">
					<text class="tn-icon-down-triangle">标题大小</text>
					<view class=" tn-flex tn-flex-row-between tn-bg-gray--light tn-radius">
						<view v-for="(item,index) in title" :key="item.id" class="tn-text-xl tn-padding"
							@tap="editSubAction(item)">
							<text :class="{'ch-color-primary': statusObj.header === item.id}">{{item.val}}</text>
						</view>
					</view>
				</view>
				<view class="tn-margin-bottom">
					<text class="tn-icon-down-triangle">字体样式</text>
					<view class=" tn-flex tn-flex-row-between tn-bg-gray--light tn-radius">
						<view v-for="(item,index) in fontStyle" :key="item.id" class="tn-text-xl tn-padding"
							@tap="editSubAction(item)">
							<text :class="{'ch-color-primary': statusObj[item.format]}">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-show="moreAction === 1" class="tn-margin tn-flex tn-flex-direction-column">
				<view class="tn-margin-bottom">
					<text class="tn-icon-down-triangle tn-text-left">字体大小</text>
					<view class="tn-flex tn-bg-gray--light tn-flex-row-between tn-padding tn-radius">
						<view v-for="(item,index) in fontSize" :key="item.id" @tap="editSubAction(item)">
							<text :class="{'ch-color-primary': statusObj.fontSize === item.val}">{{item.name}}</text>
						</view>
					</view>
				</view>
				<view class="tn-margin-bottom">
					<text class="tn-icon-down-triangle tn-text-left">字体背景</text><text
						class="tn-margin-left-xs tn-text-xs">选择字体背景后一定要更换字体颜色</text>
					<view class="tn-flex tn-bg-gray--light tn-padding tn-radius tn-flex-row-between">
						<view class="tn-round tn-padding-xs tn-border-solid tn-bold-border"
							:class="statusObj.backgroundColor===item.val?'tn-border-bluepurple':'tn-border-white'"
							:style="'background-color:'+item.val" v-for="(item ,index) in backgroundColor"
							:key="item.id" @tap="editSubAction(item)">
						</view>
					</view>
				</view>
				<view class="tn-margin-bottom">
					<text class="tn-icon-down-triangle tn-text-left">字体颜色</text>
					<view class="tn-flex tn-bg-gray--light tn-padding tn-radius tn-flex-row-between">
						<view class="tn-round tn-padding-xs tn-border-solid tn-bold-border"
							:class="statusObj.color===item.val?'tn-border-bluepurple':'tn-border-white'"
							:style="'background-color:'+item.val" v-for="(item ,index) in color" :key="item.id"
							@tap="editSubAction(item)">
						</view>
					</view>
				</view>

			</view>
			<view v-show="moreAction === 2" class="tn-margin tn-flex tn-flex-direction-column">
				<text class="tn-icon-down-triangle tn-text-left">文字方向</text>
				<view class="tn-margin-bottom tn-flex tn-bg-gray--light tn-padding tn-radius tn-flex-row-between">
					<view class="tn-flex tn-flex-direction-column" v-for="(item, index) in align" :key="item.id"
						@tap="editSubAction(item)">
						<text :class="[item.icon, {'ch-color-primary': statusObj.align === item.val}]" class="tn-text-xl">
						</text>
						<text class="tn-text-sm">
							{{item.name}}
						</text>
					</view>
				</view>
			</view>
			<!-- 面板展开结束 -->
			<!-- 文章属性开始 -->
			<view class="tn-margin tn-margin-top-xl">
				<view class="tn-margin-bottom-xl tn-flex tn-flex-row-between tn-flex-col-center"
					@tap="showCategory = true">
					<view class="tn-flex tn-flex-col-center">
						<text class="tn-icon-circle-fill tn-margin-right-xs ch-color-primary"></text>
						<text>圈子板块</text>
					</view>
					<view class="tn-flex tn-flex-col-center">
						<text>{{categoryTitle}}</text> <!-- 点击出现Popup -->
						<text class="tn-icon-right-triangle">
						</text>
					</view>
				</view>
				<view class="tn-margin-bottom-xl tn-flex tn-flex-row-between tn-flex-col-center"
					@tap="showTitleModal = true">
					<view class="tn-flex tn-flex-col-center">
						<text class="tn-icon-circle-fill tn-margin-right-xs ch-color-primary"></text>
						<text>帖子标题</text>
					</view>
					<view class="tn-flex tn-flex-col-center">
						<text>{{articleTitle}}</text>
						<text class="tn-icon-right-triangle">
						</text>
					</view>
				</view>
				<view class="tn-margin-bottom-xl tn-flex tn-flex-row-between tn-flex-col-center" @tap="showTags = true">
					<view class="tn-flex tn-flex-col-center tn-flex-nowrap tn-text-ellipsis">
						<text class="tn-icon-circle-fill tn-margin-right-xs ch-color-primary"></text>
						<text>话题标签</text>
					</view>
					<view class="tn-flex tn-flex-col-center tn-flex-nowrap tn-text-ellipsis" style="overflow: hidden;">
						<text v-for="(item,index) in selectedTags" :key="index"
							class="tn-bg-gray--light ch-radius tn-margin-left-xs tn-color-grey tn-text-sm tn-padding-xs"
							@tap.stop="deleteTags(index)">
							{{item.name}}
						</text>
						<text class="tn-icon-right-triangle">
						</text>
					</view>
				</view>
				<view class="tn-margin-bottom-xl tn-flex tn-flex-row-between tn-flex-col-center"
					@tap="showCollect = true">
					<view class="tn-flex tn-flex-col-center tn-flex-nowrap tn-text-ellipsis">
						<text class="tn-icon-circle-fill tn-margin-right-xs ch-color-primary"></text>
						<text>文章合集</text>
					</view>
					<view class="tn-flex tn-flex-col-center tn-flex-nowrap tn-text-ellipsis">
						<text>
						</text>
						<text class="tn-icon-right-triangle">
						</text>
					</view>
				</view>
				<view class="tn-margin-bottom-xl tn-flex tn-flex-row-between tn-flex-col-center"
					@tap="showPermission = true">
					<view class="tn-flex tn-flex-col-center">
						<text class="tn-icon-circle-fill tn-margin-right-xs ch-color-primary"></text>
						<text>权限设置</text>
					</view>
					<view class="tn-flex tn-flex-col-center">
						<text>{{permission.auth}}</text> <!-- 点击出现Popup -->
						<text class="tn-icon-right-triangle">
						</text>
					</view>
				</view>
			</view>
			<!-- 文章属性结束 -->
			<!-- Popup组件开始 -->
			<!-- 圈子板块组件 -->
			<tn-popup mode="bottom" length="50%" v-model="showCategory" :borderRadius="20" :closeBtn="true">
				<z-paging-swiper>
					<template #top>
						<v-tabs v-model="cateTabsIndex" :tabs="categoryTabs" @change="changeTab" lineHeight="8rpx"
							lineColor="#29B7CB" :zIndex="2" activeColor="#29B7CB" :lineScale="0.2"></v-tabs>
					</template>
					<swiper class="swiper" :current="cateTabsIndex" @change="changeSwpier">
						<swiper-item v-for="(item, index) in categoryTabs" :key="index">
							<categoryList :tabsIndex="cateTabsIndex" @getCategoryInfo="getCategoryInfo"
								:selectedCategory="selectedCategory"></categoryList>
						</swiper-item>
					</swiper>

				</z-paging-swiper>
			</tn-popup>
			<!-- 标签tag组件 -->
			<tn-popup mode="bottom" length="50%" v-model="showTags" :borderRadius="20" :closeBtn="true">
				<z-paging-swiper>
					<template #top>
						<v-tabs v-model="tagsTabsIndex" :tabs="tagsTabs" @change="changeTagsTab" lineHeight="8rpx"
							lineColor="#29B7CB" :zIndex="2" activeColor="#29B7CB" :lineScale="0.2"></v-tabs>
					</template>
					<swiper class="swiper" :current="tagsTabsIndex" @change="changeTagsSwiper">
						<swiper-item v-for="(item,index) in tagsTabs" :key="index">
							<tagsList :tabsIndex="tagsTabsIndex" @getTagsInfo="getTagsInfo"
								:selectedTags="selectedTags"></tagsList>
						</swiper-item>
					</swiper>
				</z-paging-swiper>
			</tn-popup>
			<!-- 权限组件 -->
			<tn-popup mode="bottom" length="50%" v-model="showPermission" :borderRadius="20" :closeBtn="true">
				<view class="tn-margin tn-flex tn-flex-direction-column">
					<view class="tn-flex tn-flex-col-center  tn-margin-top-xl">
						<text class="tn-text-lg tn-text-bold">文章权限</text>
						<text class="tn-icon-down-triangle"></text>
					</view>
					<view class="tn-margin">
						<view v-for="(item,index) in permission" :key="index"
							class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-bottom-sm"
							@tap="permissionAction(index)">
							<text>{{item.name}}</text>
							<text class="tn-icon-success" v-if="item.active"></text>
						</view>
					</view>
					<view class="tn-flex tn-flex-col-center">
						<text class="tn-text-lg tn-text-bold">评论权限</text>
						<text class="tn-icon-down-triangle"></text>
					</view>
					<view class="tn-margin">
						<view class="tn-flex tn-flex-row-between tn-flex-col-center tn-margin-bottom-sm"
							@tap="opt.comments.allow = !opt.comments.allow">
							<text>允许评论</text>
							<text class="tn-icon-success" v-if="opt.comments.allow"></text>
						</view>
						<view class="tn-flex tn-flex-row-between tn-flex-col-center"
							@tap="opt.comments.show = !opt.comments.show">
							<text>评论可见</text>
							<text class="tn-icon-success" v-if="opt.comments.show"></text>
						</view>

					</view>
				</view>
			</tn-popup>
			<!-- 合集popup -->
			<tn-popup mode="bottom" length="50%" v-model="showCollect" :borderRadius="20" :closeBtn="true">
				<z-paging-swiper>
					<template #top>
						<v-tabs :tabs="['全部']" lineHeight="8rpx" lineColor="#29B7CB" :zIndex="2"
							activeColor="#29B7CB" :lineScale="0.2"></v-tabs>
					</template>
					<swiper class="swiper">
						<swiper-item>
							<collectList @getCollectInfo="getCollectInfo" :selectedCollect="selectedCollect">
							</collectList>
						</swiper-item>
					</swiper>

				</z-paging-swiper>
			</tn-popup>
			<!-- popup组件结束 -->
			<!-- modal开始 -->
			<tn-modal v-model="showTitleModal" :radius="10" :custom="true" width="90%">
				<view class="tn-flex tn-flex-direction-column">
					<text class="tn-text-bold tn-text-xl tn-margin-bottom-sm">标题</text>
					<view
						class="tn-bg-gray--light ch-radius tn-padding-left-sm tn-padding-right-sm tn-margin-bottom-sm">
						<tn-input :maxLength="20" v-model="articleTitle" placeholder="帖子标题不超过20字符" :clearable="false" />
					</view>
					<view class="tn-text-right">
						<tn-button :plain="true" size="sm" shape="round" @tap="showTitleModal = false">Get！</tn-button>
					</view>
				</view>
			</tn-modal>
		</you-touchbox>
	</view>
</template>

<script>
	import categoryList from './components/categoryList/categoryList.vue';
	import tagsList from './components/tagsList/tagsList.vue';
	import collectList from './components/collectList/collectList.vue';
	export default {
		components: {
			categoryList,
			tagsList,
			collectList,
		},
		data() {
			return {
				categoryTabs: ['全部', '关注'],
				collectTabs: ['全部'],
				cateTabsIndex: 0, //用来接收设置用
				categoryTitle: null,
				categoryId: null,
				tagsTabsIndex: 0,
				tagsTabs: ['全部', '关注'],
				content: null,
				edit: null,
				statusObj:{},
				editList: [{
						id: 0,
						name: '标题',
						icon: 'tn-icon-font'
					},
					{
						id: 1,
						name: '字号',
						icon: 'tn-icon-theme'
					},
					{
						id: 2,
						name: '对齐',
						icon: 'tn-icon-align'
					}

				],
				title: [{
						id: 2,
						format: 'header',
						val: 'H2'
					},
					{
						id: 3,
						format: 'header',
						val: 'H3'
					},
					{
						id: 4,
						format: 'header',
						val: 'H4'
					},
					{
						id: 5,
						format: 'header',

						val: 'H5'
					},
					{
						id: 6,
						format: 'header',
						val: 'H6'
					}
				],
				color: [{
						format: 'color',
						val: '#ed5a65'
					},
					{
						format: 'color',
						val: '#813c85'
					},
					{
						format: 'color',
						val: '#2177b8'
					},
					{
						format: 'color',
						val: '#1ba784'
					},
					{
						format: 'color',
						val: '#fcc307'
					},
					{
						format: 'color',
						val: '#1772b4'
					},
					{
						format: 'color',
						val: '#ffffff'
					}
				],
				align: [{
						id: 0,
						name: '左对齐',
						format: 'align',
						val: 'left',
						icon: 'tn-icon-align-left'
					},
					{
						id: 1,
						name: '居中',
						format: 'align',
						val: 'center',
						icon: 'tn-icon-align-center'
					},
					{
						id: 2,
						name: '右对齐',
						format: 'align',
						val: 'right',
						icon: 'tn-icon-align-right'
					}
				],
				fontSize: [{
						id: 0,
						name: '默认',
						format: 'fontSize',
						val: ''
					},
					{
						id: 1,
						name: '小',
						format: 'fontSize',
						val: '14px'
					},
					{
						id: 2,
						name: '中',
						format: 'fontSize',
						val: '18px'
					},
					{
						id: 3,
						name: '大',
						format: 'fontSize',
						val: '28px'
					}
				],
				backgroundColor: [{
						id: 0,
						format: 'backgroundColor',
						val: '#f1939c'
					},
					{
						id: 1,
						format: 'backgroundColor',
						val: '#fbda41'
					},
					{
						id: 2,
						format: 'backgroundColor',
						val: '#66a9c9'
					},
					{
						id: 3,
						format: 'backgroundColor',
						val: '#1ba784'
					},
					{
						id: 4,
						format: 'backgroundColor',
						val: '#fcc307'
					},
					{
						id: 5,
						format: 'backgroundColor',
						val: '#57c3c2'
					},
					{
						id: 6,
						format: 'backgroundColor',
						val: 'rbga(255,255,255,0)'
					}
				],
				fontStyle: [{
						id: 0,
						name: '粗体',
						format: 'bold',
						active:false
					},
					{
						id: 1,
						name: '斜体',
						format: 'italic',
						active:false
					},
					{
						id: 2,
						name: '下划线',
						format: 'underline',
						active:false
					}
				],
				moreAction: null,
				articleTitle: null,
				alignMoreAction: null,
				showCategory: false,
				showTags: false,
				showTitleModal: false,
				selectedTags: [],
				selectedCategory: {},
				selectedCollect: [],
				showPermission: false,
				opt: {
					password: "",
					auth: "anyone",
					comments: {
						show: true,
						allow: true,
					}
				},
				permission: [{
						name: '公开可见',
						permission: 'anyone',
						active: true
					},
					{
						name: '自己可见',
						permission: 'private',
						active: false
					},

				],
				showCollect: false,
				collectId: null,

			}
		},
		onLoad() {
			// console.log(uni.getStorageSync('token'))
		},
		onBackPress(e) {
			console.log(e)
		},
		
		methods: {
			editReady(edit) {
				// 将富文本对象存放到当前页面，便于后续直接操作
				this.edit = edit;
				// 演示----监听光标进入
				this.edit.$on('edit:focus', (e) => {
					// console.log('监听光标进入',e);

				});
				// 演示----监听输入
				this.edit.$on('edit:input', (e) => {

					// console.log('监听输入', e);
				});
				// 演示----监听光标指向不同样式时回调
				this.edit.$on('edit:statuschange', this.statuschange)
			},
			statuschange(e){
				this.statusObj = e.detail
				console.log(this.statusObj)
			},
			fontStyleChange(index){
				this.statusObj.bold = this.fontStyle[index].active
				this.statusObj.underline = this.fontStyle[index].active
				this.statusObj.italic = this.fontStyle[index].active
			},
			async save() {
				// 获取插入的图片列表
				let imgs = await this.edit.getImages()
				// 判断是否允许提交
				if (!this.edit.textCount && !imgs.length) {
					uni.showToast({
						icon: 'none',
						title: '啊哦~你好像还没说什么？'
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
			// async getContent(){
			// 	let data = await this.edit.getContents()
			// 	console.log(data)
			// },
			addArtiCle(res) {
				const selectedTagIds = this.selectedTags.map(tag => tag.id).join(",");
				this.$http.post('/article/save', {
					title: this.articleTitle === null ? res.text.substring(0, 10) : this.articleTitle, //标题为空时从简介获取
					content: res.html, //帖子内容 如果要更新文章的话不能这么写得定义一个变量来存储
					description: res.text, //简介 如果要更新文章的话不能这么写得定义一个变量来存储
					sort_id: this.categoryId, //分类ID 
					collections_id: this.selectedCollect[0].id, //合集id
					tag_id: selectedTagIds, //标签id 如果要更新文章的话不能这么写得定义一个变量来存储
					opt: JSON.stringify(this.opt), //权限设置
				}).then(res => {
					if (res.data.code === 200) {
						uni.showToast({
							icon: 'none',
							title: '发布' + res.data.msg
						})
						setTimeout(() => {
							this.back()
						}, 1000)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			updateArticle() {

			},
			editAction(item) {
				if (this.moreAction === item.id) {
					this.moreAction = null;
				} else {
					this.moreAction = item.id;
				}
			},
			editSubAction(item) {

			    this.edit.format(item.format, item.val); // 设置样式
			},
			addImage() {
				this.edit.addImage()

			},
			changeTab(index) {
				this.cateTabsIndex = index
			},
			changeTagsTab(index) {
				this.tagsTabsIndex = index
			},
			changeSwpier(event) {
				this.cateTabsIndex = event.detail.current
			},
			changeTagsSwiper(event) {
				this.tagsTabsIndex = event.detail.current
			},
			getCategoryInfo(data) {
				this.categoryTitle = data.name;
				this.categoryId = data.id;
				this.selectedCategory = data
				//获取到板块信息后关闭弹出层
				setTimeout(() => {
					this.showCategory = false
				}, 100)
			},
			deleteTags(index) {
				this.selectedTags.splice(index, 1);
			},
			//从自定义组件的emit事件监听中获取到TAG的信息
			getTagsInfo(data) {
				const index = this.selectedTags.findIndex(tag => tag.id === data.id);
				if (index !== -1) {
					// 如果数据已经存在，从数组中删除
					this.selectedTags.splice(index, 1);
				} else {
					// 如果数据不存在，将其添加到数组中
					this.selectedTags.push(data);
				}
				console.log(this.selectedTags);
			},
			getCollectInfo(data) {
				if (this.selectedCollect.length > 0) {
					// Remove any existing item from the array
					this.selectedCollect.splice(0, 1);
				}

				// Add the new item to the array
				this.selectedCollect.push(data);
				console.log(this.selectedCollect);
			},
			permissionAction(index) {
				for (let i = 0; i < this.permission.length; i++) {
					if (i !== index) {
						this.permission[i].active = false; // 关闭其他项
					} else {
						this.permission[i].active = true; // 打开当前项
						this.opt.auth = this.permission[i].permission; // 设置opt的auth值
					}
				}
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
	page {
		background-color: #f8f7f8;
	}

	.swiper {
		height: 100%;
	}

	.ch-color-primary {
		color: $ch-color-primary;
	}
</style>