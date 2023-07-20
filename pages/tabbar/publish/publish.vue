<template>
	<view class="tn-bg-gray--light">
		<tn-nav-bar fiexd>
			编辑
			<view slot="right" class="tn-margin">
				<tn-button size="sm" shape="round" :plain="true" @tap="save">保存</tn-button>
			</view>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<lsj-edit ref="lsjEdit" placeholder="输入正文" @onReady="editReady" @input="getConetnt">
		</lsj-edit>
		<!-- 上拉组件 -->
		<you-touchbox :auto="false" :maxTop="0.85" :minTop="0.08" :initTop="0.5"
			customStyle="border-radius:20rpx 20rpx 0 0">
			<view class="tn-margin tn-flex tn-flex-row-between tn-text-xl">
				<text class="tn-icon-image" @tap="addImage"></text>
				<!-- 循环控件 -->
				<text class="" <view v-for="(item ,index) in editList" :key="item.id" @tap="editAction(item)">
					<text :class="[item.icon, {'tn-color-bluepurple': moreAction === item.id}]"></text>

			</view>
	</view>
	<view v-show="moreAction === 0" class="tn-margin">
		<view class="tn-margin-bottom">
			<text class="tn-icon-down-triangle">标题大小</text>
			<view class=" tn-flex tn-flex-row-between tn-bg-gray--light tn-radius">
				<view v-for="(item,index) in title" :key="item.id" class="tn-text-xl tn-padding"
					@tap="editSubAction(item)">
					<text :class="{'tn-color-bluepurple': subMoreAction === item.id}">{{item.val}}</text>
				</view>
			</view>
		</view>
		<view class="tn-margin-bottom">
			<text class="tn-icon-down-triangle">字体样式</text>
			<view class=" tn-flex tn-flex-row-between tn-bg-gray--light tn-radius">
				<view v-for="(item,index) in fontStyle" :key="item.id" class="tn-text-xl tn-padding"
					@tap="editSubAction(item)">
					<text :class="{'tn-color-bluepurple': fontStyleMoreAction === item.id}">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
	<view v-show="moreAction === 1" class="tn-margin tn-flex tn-flex-direction-column">
		<view class="tn-margin-bottom">
			<text class="tn-icon-down-triangle tn-text-left">字体大小</text>
			<view class="tn-flex tn-bg-gray--light tn-flex-row-between tn-padding tn-radius">
				<view v-for="(item,index) in fontSize" :key="item.id" @tap="editSubAction(item)">
					<text :class="{'tn-color-bluepurple': subMoreAction === item.id}">{{item.name}}</text>
				</view>
			</view>
		</view>
		<view class="tn-margin-bottom">
			<text class="tn-icon-down-triangle tn-text-left">字体背景</text><text
				class="tn-margin-left-xs tn-text-xs">选择字体背景后一定要更换字体颜色</text>
			<view class="tn-flex tn-bg-gray--light tn-padding tn-radius tn-flex-row-between">
				<view class="tn-round tn-padding-xs tn-border-solid tn-bold-border"
					:class="backgroundColorMoreAction===item.id?'tn-border-bluepurple':'tn-border-white'"
					:style="'background-color:'+item.val" v-for="(item ,index) in backgroundColor" :key="item.id"
					@tap="editSubAction(item)">
				</view>
			</view>
		</view>
		<view class="tn-margin-bottom">
			<text class="tn-icon-down-triangle tn-text-left">字体颜色</text><text
				class="tn-margin-left-xs tn-text-xs"></text>
			<view class="tn-flex tn-bg-gray--light tn-padding tn-radius tn-flex-row-between">
				<view class="tn-round tn-padding-xs tn-border-solid tn-bold-border"
					:class="colorMoreAction===item.id?'tn-border-bluepurple':'tn-border-white'"
					:style="'background-color:'+item.val" v-for="(item ,index) in color" :key="item.id"
					@tap="editSubAction(item)">
				</view>
			</view>
		</view>

	</view>
	<view v-show="moreAction === 2"
		class="tn-margin tn-flex tn-flex-row-between tn-text-xxl tn-bg-gray--light tn-padding tn-radius">
		<text v-for="(item ,index) in align" :key="item.id" @tap="editSubAction(item)" :class="item.icon">

		</text>
	</view>
	</you-touchbox>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabs: ['一成不变', '花里胡哨'],
				tabsIndex: 0,
				textareaHeight: null,
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
						name: '右',
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
				subMoreAction: null,
				colorMoreAction: null,
				backgroundColorMoreAction: null,
				fontStyleMoreAction: null,
				articleTitle: null,

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
					if (!this.edit.textCount) {
						this.subMoreAction = null;
						this.colorMoreAction = null;
						this.backgroundColorMoreAction = null;
						this.fontStyleMoreAction = null;
					}
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
					// 因为演示的时候没有服务器，所以直接换个网络图方便后续演示，
					// 实际项目应使用上方注释内容
					//替换掉data错误的反斜杠
					return data.data.replace(/\\/g, '/')

				}).then(res => {
					console.log('替换完成,最终内容为', JSON.stringify(res.text));
					this.addArtiCle(res)
				});

			},
			addArtiCle(res) {
				this.$http.post('/article/save', {
					title: this.articleTitle === null ? res.text.substring(0, 10) : this.articleTitle,
					content: res.html,
					description: res.text,

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
						if (this.fontStyleMoreAction === item.id) {
							this.fontStyleMoreAction = null;
						} else {
							this.fontStyleMoreAction = item.id;
						}
						break;
						// 添加更多的匹配条件
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
				this.tabsIndex = index
			},
		}
	}
</script>

<style>
	page {
		background-color: #f8f7f8;
	}
</style>