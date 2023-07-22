<template>
	<view class="tn-bg-gray--light">
		<tn-nav-bar fiexd>
			编辑
			<view slot="right" class="tn-margin">
				<tn-button size="sm" shape="round" :plain="true" @tap="save">保存</tn-button>
			</view>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>

		<lsj-edit ref="lsjEdit" placeholder="啊~灵感在迸发~" @onReady="editReady">
		</lsj-edit>

		<!-- 上拉组件 -->
		<you-touchbox :auto="false" :maxTop="0.85" :minTop="0.08" :initTop="0.5"
			customStyle="border-radius:20rpx 20rpx 0 0">
			<view class="tn-margin tn-flex tn-flex-row-between tn-text-xxl">
				<text class="tn-icon-image" @tap="addImage"></text>
				<!-- 循环控件 -->
				<view v-for="(item ,index) in editList" :key="item.id" @tap="editAction(item)">
					<text :class="[item.icon, {'ch-color-main': moreAction === item.id}]"></text>
				</view>
			</view>
			<!-- 展开面板 -->
			<view v-show="moreAction === 0" class="tn-margin">
				<view class="tn-margin-bottom">
					<text class="tn-icon-down-triangle">标题大小</text>
					<view class=" tn-flex tn-flex-row-between tn-bg-gray--light tn-radius">
						<view v-for="(item,index) in title" :key="item.id" class="tn-text-xl tn-padding"
							@tap="editSubAction(item)">
							<text :class="{'ch-color-main': titleMoreAction === item.id}">{{item.val}}</text>
						</view>
					</view>
				</view>
				<view class="tn-margin-bottom">
					<text class="tn-icon-down-triangle">字体样式</text>
					<view class=" tn-flex tn-flex-row-between tn-bg-gray--light tn-radius">
						<view v-for="(item,index) in fontStyle" :key="item.id" class="tn-text-xl tn-padding"
							@tap="editSubAction(item)">
							<text :class="{'ch-color-main': selectAction.includes(item.id)}">{{item.name}}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-show="moreAction === 1" class="tn-margin tn-flex tn-flex-direction-column">
				<view class="tn-margin-bottom">
					<text class="tn-icon-down-triangle tn-text-left">字体大小</text>
					<view class="tn-flex tn-bg-gray--light tn-flex-row-between tn-padding tn-radius">
						<view v-for="(item,index) in fontSize" :key="item.id" @tap="editSubAction(item)">
							<text :class="{'ch-color-main': fontSizeMoreAction === item.id}">{{item.name}}</text>
						</view>
					</view>
				</view>
				<view class="tn-margin-bottom">
					<text class="tn-icon-down-triangle tn-text-left">字体背景</text><text
						class="tn-margin-left-xs tn-text-xs">选择字体背景后一定要更换字体颜色</text>
					<view class="tn-flex tn-bg-gray--light tn-padding tn-radius tn-flex-row-between">
						<view class="tn-round tn-padding-xs tn-border-solid tn-bold-border"
							:class="backgroundColorMoreAction===item.id?'tn-border-bluepurple':'tn-border-white'"
							:style="'background-color:'+item.val" v-for="(item ,index) in backgroundColor"
							:key="item.id" @tap="editSubAction(item)">
						</view>
					</view>
				</view>
				<view class="tn-margin-bottom">
					<text class="tn-icon-down-triangle tn-text-left">字体颜色</text>
					<view class="tn-flex tn-bg-gray--light tn-padding tn-radius tn-flex-row-between">
						<view class="tn-round tn-padding-xs tn-border-solid tn-bold-border"
							:class="colorMoreAction===item.id?'tn-border-bluepurple':'tn-border-white'"
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
						<text :class="[item.icon, {'ch-color-main': alignMoreAction === item.id}]" class="tn-text-xl">
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
						<text class="tn-icon-circle-fill tn-margin-right-xs ch-color-main"></text>
						<text>圈子板块</text>
					</view>
					<view class="tn-flex tn-flex-col-center">
						<text>{{categoryTitle}}</text> <!-- 点击出现Popup -->
						<text class="tn-icon-right-triangle">
						</text>
					</view>
				</view>
				<view class="tn-margin-bottom-xl tn-flex tn-flex-row-between tn-flex-col-center">
					<view class="tn-flex tn-flex-col-center">
						<text class="tn-icon-circle-fill tn-margin-right-xs ch-color-main"></text>
						<text>帖子标题</text>
					</view>
					<view class="tn-flex tn-flex-col-center">
						<text>为空时自动获取</text> <!-- 点击出现Popup -->
						<text class="tn-icon-right-triangle">
						</text>
					</view>
				</view>
				<view class="tn-margin-bottom-xl tn-flex tn-flex-row-between tn-flex-col-center" @tap="tagsAction">
					<view class="tn-flex tn-flex-col-center">
						<text class="tn-icon-circle-fill tn-margin-right-xs ch-color-main"></text>
						<text>话题标签</text>
					</view>
					<view class="tn-flex tn-flex-col-center">
						<text>名称占位</text> <!-- 点击出现Popup -->
						<text class="tn-icon-right-triangle">
						</text>
					</view>

				</view>
				<view class="tn-margin-bottom-xl tn-flex tn-flex-row-between tn-flex-col-center"
					@tap="permissionAction">
					<view class="tn-flex tn-flex-col-center">
						<text class="tn-icon-circle-fill tn-margin-right-xs ch-color-main"></text>
						<text>谁人可见</text>
					</view>
					<view class="tn-flex tn-flex-col-center">
						<text>名称占位</text> <!-- 点击出现Popup -->
						<text class="tn-icon-right-triangle">
						</text>
					</view>
				</view>
			</view>
			<!-- 文章属性结束 -->
			<!-- Popup组件开始 -->
			<tn-popup mode="bottom" length="50%" v-model="showCategory" :borderRadius="20" :closeBtn="true">
				<z-paging-swiper>
					<template #top>
						<v-tabs v-model="cateTabsIndex" :tabs="categoryTabs" @change="changeTab" lineHeight="8rpx"
							lineColor="#29B7CB" :zIndex="2" activeColor="#29B7CB"></v-tabs>
					</template>
					<swiper class="swiper" :current="cateTabsIndex" @change="changeSwpier">
						<swiper-item v-for="(item, index) in categoryTabs" :key="index">
							<categoryList :tabsIndex="cateTabsIndex" @getCategoryInfo="getCategoryInfo"></categoryList>
						</swiper-item>
					</swiper>

				</z-paging-swiper>


			</tn-popup>
		</you-touchbox>
	</view>
</template>

<script>
	import categoryList from '@/pages/tabbar/publish/components/categoryList/categoryList.vue';
	export default {
		components: {
			categoryList
		},
		data() {
			return {
				categoryTabs: ['全部', '关注'],
				cateTabsIndex: 0,
				categoryTitle: null,
				categoryId: null,
				content: null,
				edit: null,
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
						id: 0,
						format: 'header',
						val: 'H2'
					},
					{
						id: 1,
						format: 'header',
						val: 'H3'
					},
					{
						id: 2,
						format: 'header',
						val: 'H4'
					},
					{
						id: 3,
						format: 'header',

						val: 'H5'
					},
					{
						id: 4,
						format: 'header',
						val: 'H6'
					}
				],
				color: [{
						id: 0,
						format: 'color',
						val: '#ed5a65'
					},
					{
						id: 1,
						format: 'color',
						val: '#813c85'
					},
					{
						id: 2,
						format: 'color',
						val: '#2177b8'
					},
					{
						id: 3,
						format: 'color',
						val: '#1ba784'
					},
					{
						id: 4,
						format: 'color',
						val: '#fcc307'
					},
					{
						id: 5,
						format: 'color',
						val: '#1772b4'
					},
					{
						id: 6,
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
						val: '#ed5a65'
					},
					{
						id: 1,
						format: 'backgroundColor',
						val: '#813c85'
					},
					{
						id: 2,
						format: 'backgroundColor',
						val: '#2177b8'
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
						val: '#1772b4'
					},
					{
						id: 6,
						format: 'backgroundColor',
						val: '#ffffff'
					}
				],
				fontStyle: [{
						id: 0,
						name: '粗体',
						format: 'bold',
						val: ''
					},
					{
						id: 1,
						name: '斜体',
						format: 'italic',
						val: ''
					},
					{
						id: 2,
						name: '下划线',
						format: 'underline',
						val: ''
					}
				],
				moreAction: null,
				titleMoreAction: null,
				fontSizeMoreAction: null,
				colorMoreAction: null,
				backgroundColorMoreAction: null,
				fontStyleMoreAction: null,
				articleTitle: null,
				alignMoreAction: null,
				selectAction: [],
				showCategory: false,


			}
		},
		onLoad() {
			// console.log(uni.getStorageSync('token'))
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
				this.edit.$on('edit:statuschange', (e) => {
					// console.log('监听光标当前位置样式变化',JSON.stringify(e));
				})
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
						header: {
							'Authorization': uni.getStorageSync('token')
						}
					})
					
					console.log(data.data)
					return data.data


				}).then(res => {
					console.log('替换完成,最终内容为', JSON.stringify(res.html));
					
					this.addArtiCle(res)
				});
			},
			// async getContent(){
			// 	let data = await this.edit.getContents()
			// 	console.log(data)
			// },
			addArtiCle(res) {
				this.$http.post('/article/save', {
					title: this.articleTitle === null ? res.text.substring(0, 10) : this.articleTitle,
					content: res.html,
					description: res.text,
					sort_id: this.categoryId,

				}, {
					header: {
						'Authorization': uni.getStorageSync('token')
					}
				}).then(res => {
					console.log(res)
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
				switch (item.format) {
					case 'color':
						if (this.colorMoreAction === item.id) {
							this.colorMoreAction = null;
						} else {
							this.colorMoreAction = item.id;
						}
						break;
					case 'backgroundColor':
						if (this.backgroundColorMoreAction === item.id) {
							this.backgroundColorMoreAction = null;
						} else {
							this.backgroundColorMoreAction = item.id;
						}
						break;
					case 'bold':
					case 'italic':
					case 'underline':
						if (this.selectAction.includes(item.id)) {
							this.selectAction.splice(this.selectAction.indexOf(item.id), 1);
						} else {
							this.selectAction.push(item.id);
						}
						break;
					case 'header':
						if (this.titleMoreAction === item.id) {
							this.titleMoreAction = null;
						} else {
							this.titleMoreAction = item.id
						}
						break;
					case 'fontSize':
						if (this.fontSizeMoreAction === item.id) {
							this.fontSizeMoreAction = null;
						} else {
							this.fontSizeMoreAction = item.id
						}
						break;
					case 'align':
						if (this.alignMoreAction === item.id) {
							this.alignMoreAction = null;
						} else {
							this.alignMoreAction = item.id
						}
						break;
					default:
						// 默认情况下，不做任何操作
						break;
				}
				if (this.subMoreAction === item.id) {
					this.subMoreAction = null;
					this.edit.format(item.format, ''); // 清除样式
				} else {
					this.subMoreAction = item.id;
					this.edit.format(item.format, item.val); // 设置样式
				}
			},
			addImage() {
				this.edit.addImage()

			},
			changeTab(index) {
				this.cateTabsIndex = index
			},
			changeSwpier(event) {
				this.cateTabsIndex = event.detail.current
			},
			getCategoryInfo(data) {
				this.categoryTitle = data.name;
				this.categoryId = data.id;
				//获取到板块信息后关闭弹出层
				setTimeout(() => {
					this.showCategory = false
				}, 100)
			},
			permissionAction() {
				uni.showToast({
					icon: 'none',
					title: '还没做欸嘿'
				})
			},
			tagsAction() {
				uni.showToast({
					icon: 'none',
					title: '还没做欸嘿'
				})
			}
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

	.ch-color-main {
		color: $ch-color-main;
	}
</style>