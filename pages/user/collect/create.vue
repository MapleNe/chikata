<template>
	<view>
		<tn-nav-bar backTitle="">
			{{update?'更新合集':'创建合集'}}
			<view class="tn-padding" slot="right">
				<text class="ch-color-primary tn-text-md" @tap.stop.prevent="save()">{{update?'更新':'创建'}}</text>
			</view>
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"> </view>
		<view class="tn-margin tn-no-margin-top">
			<view class="tn-border-solid-bottom tn-flex tn-flex-col-center">
				<tn-input v-model="title" :maxLength="titleLength" :clearable="false" placeholder="请输入合集名称" />
				<text class="tn-color-gray--dark tn-text-sm">{{title.length}}/{{titleLength}}</text>
			</view>
			<view class="tn-margin-top-sm tn-border-solid-bottom tn-flex tn-flex-direction-column">
				<tn-input type="textarea" v-model="description" placeholder="请输入合集简介" :clearable="false"
					:height="280" />
				<view class="tn-text-right tn-color-gray--dark tn-text-sm tn-margin-bottom-sm">
					<text>{{description&&description.length}}/{{description&&descriptionLength}}</text>
				</view>
			</view>
			<view class="tn-margin-top-xl">
				<view
					class="tn-bg-gray--light tn-radius tn-flex tn-flex-col-center tn-flex-row-center tn-flex-direction-column"
					style="height: 200rpx;width: 200rpx;position: relative;" @tap.stop.prevent="imageChoose()">
					<view style="position: absolute;"
						class="tn-color-gray--dark tn-flex tn-flex-direction-column tn-flex-col-center"
						v-if="!head_img">
						<text class="tn-icon-camera tn-text-xl-xxl"></text>
						<text class="tn-text-md">添加图片</text>
					</view>
					<image :src="head_img" mode="aspectFill" class="tn-radius" style="width: 100%;" v-else></image>
				</view>
			</view>

		</view>
		<l-clipper v-if="showClipper" :image-url="imageUrl"
			@success="head_img = $event.url; upload(); showClipper = false" @cancel="showClipper = false"
			:max-width="700" :max-height="700" :is-limit-move="true"></l-clipper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: '',
				titleLength: 15,
				description: '',
				descriptionLength: 80,
				showClipper: false,
				head_img: '',
				id: 0,
				update: false,
			}
		},
		onLoad(params) {
			console.log(params)
			if (params.update) {
				this.update = params.update
				this.id = params.obj.id
				this.title = params.obj.name
				this.description = params.obj.descrip
				this.head_img = params.obj.image
			}
		},
		methods: {
			// 选择图片
			imageChoose() {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'], //从相册选择
					success: res => {
						this.imageUrl = res.tempFilePaths[0] //交给裁剪去处理
						this.showClipper = true
					}
				})
			},
			// 上传图片
			upload() {
				const filePath = this.$isBase64(this.head_img) ? this.head_img : 'file://' + plus.io
					.convertLocalFileSystemURL(this.head_img)
				this.$http.upload('/file/uploadImg', {
					filePath: filePath,
					name: 'file'
				}).then(res => {
					if (res.data.code === 200) {
						this.head_img = res.data.data
					}
				})
			},
			// 创建合集

			save() {
				if (this.title.length < 4) {
					uni.showToast({
						icon: 'none',
						title: '合集名称太短了'
					})
					return;
				}
				this.$http.post('/collections/save', {
					name: this.title,
					img: this.head_img,
					descrip: this.description,
					id: this.update ? this.id : ''
				}).then(res => {
					if (res.data.code == 200) {
						const message = this.update ? '更新' : '创建';
						uni.showToast({
							icon: 'none',
							title: `${message}${res.data.msg}`
						});
						uni.$emit('updateCollect', true)
						setTimeout(() => {
							this.$Router.back(2)
						}, 800)

					}
				}).catch(err => {
					console.log(err)
				})
			}
		}
	}
</script>

<style>

</style>