<template>
	<view>
		<tn-nav-bar backTitle="">
			个人信息
		</tn-nav-bar>
		<view :style="{paddingTop: vuex_custom_bar_height + 'px'}"></view>
		<view class="tn-margin-bottom-lg tn-text-center tn-margin-top-xl" style="position: relative;">
			<tn-avatar size="xl" :src="head_img" @tap="imageChoose(0)"></tn-avatar>
			<view class="tn-round ch-bg-main"
				style="position: absolute;right: 41%;bottom: 5%; height: 30rpx;width: 30rpx;line-height: 30rpx;z-index: 4;">
				<text class="tn-icon-add tn-color-white"></text>
			</view>
		</view>


		<view class="tn-margin-xs">
			<tn-list-view :card="true" unlined="all">
				<tn-list-cell :unlined="true" :arrow="false">
					<view class="tn-flex tn-flex-row-between tn-flex-col-center">
						<text>UID</text>
						<text class="tn-margin-right">{{account}}</text>
					</view>
				</tn-list-cell>
				<tn-list-cell :unlined="true" :arrow="true" @tap="showNickname = true">
					<view class="tn-flex tn-flex-row-between tn-flex-col-center">
						<text>昵称</text>
						<text class="tn-margin-right">{{nickname}}</text>
					</view>
				</tn-list-cell>
				<tn-list-cell :unlined="true" :arrow="true" @tap="showDescription = true">
					<view class="tn-flex tn-flex-row-between tn-flex-col-center">
						<text>简介</text>
						<view class="tn-text-right" style="width: 300rpx; overflow: hidden; text-overflow: ellipsis;">
							<text class="tn-margin-right">{{description}}</text>
						</view>

					</view>
				</tn-list-cell>
				<tn-list-cell :unlined="true" :arrow="true" @tap="showSex = true">
					<view class="tn-flex tn-flex-row-between tn-flex-col-center">
						<text>性别</text>
						<text class="tn-margin-right">{{sex}}</text>
					</view>
				</tn-list-cell>
				<tn-list-cell :unlined="true" :arrow="true" @tap="showTime = true">
					<view class="tn-flex tn-flex-row-between tn-flex-col-center">
						<text>生日</text>
						<text class="tn-margin-right">{{longtext.birthday}}</text>
					</view>
				</tn-list-cell>
				<tn-list-cell :unlined="true" :arrow="false" @tap="imageChoose(1)">
					<view class="tn-flex tn-flex-row-between tn-flex-col-center">
						<text>背景</text>
					</view>
				</tn-list-cell>
				<view class="tn-margin-sm">
					<image :src="longtext.background_img" mode="aspectFill" style="height: 350rpx;width: 100%;"
						@tap="imageChoose(1)"></image>
				</view>


			</tn-list-view>
		</view>
		<!-- 模态框组件 -->
		<!-- 昵称 -->
		<tn-modal v-model="showNickname" :radius="10" :custom="true" padding="40rpx">
			<view class="tn-margin-bottom-sm ">
				<text class="tn-text-bold">输入昵称</text>
			</view>
			<view class="tn-bg-gray--light tn-margin-bottom-lg tn-padding-left-sm tn-padding-right-sm">
				<tn-input v-model="nickname" :maxLength="15" :clearable="false" />
			</view>
			<view class="tn-flex tn-flex-row-right">
				<view class="tn-margin-right-sm">
					<tn-button size="sm" :plain="true" @tap="showNickname=false">取消</tn-button>
				</view>
				<tn-button size="sm" backgroundColor="#29b7cb" fontColor="white"
					@tap="modifyProfile();showNickname=false">确定</tn-button>
			</view>
		</tn-modal>
		<!-- 简介 -->
		<tn-modal v-model="showDescription" :radius="10" :custom="true" padding="20rpx 40rpx">
			<view class="tn-flex tn-flex-row-center">
				<text>修改简介</text>
			</view>
			<view class="tn-bg-gray--light tn-padding-sm tn-margin-top-sm" style="overflow: hidden;">
				<tn-input type="textarea" v-model="description" :maxLength="80" :clearable="false"
					:autoHeight="false" />
			</view>
			<view class="tn-flex tn-flex-row-right tn-margin-top-sm">
				<view class="tn-margin-right-sm">
					<tn-button size="sm" :plain="true" @tap="showDescription=false">取消</tn-button>
				</view>
				<tn-button size="sm" backgroundColor="#29b7cb" fontColor="white"
					@tap="modifyProfile();showDescription=false">确定</tn-button>
			</view>
		</tn-modal>
		<!-- 性别 -->
		<tn-action-sheet v-model="showSex" :list="sexList" @click="sexChoose"></tn-action-sheet>
		<!-- 头像裁剪 -->
		<l-clipper v-if="showClipper" :image-url="imageUrl"
			@success="head_img = $event.url; upload(); showClipper = false" @cancel="showClipper = false"
			:max-width="700" :max-height="700" :is-limit-move="true"></l-clipper>
		<!-- 背景裁剪 -->
		<l-clipper v-if="showClipperBack" :image-url="imageUrl"
			@success="longtext.background_img = $event.url; uploadBackground(); showClipperBack = false"
			@cancel="showClipperBack = false" :min-width="720" :min-height="360" :max-width="1280" :max-height="720"
			:is-limit-move="true" :is-lock-ratio="false"></l-clipper>
		<!-- 时间选择 -->
		<tn-picker mode="time" v-model="showTime" @confirm="setBirthday"></tn-picker>
	</view>

</template>

<script>
	import {
		mapState,
	} from 'vuex';
	export default {
		computed: {
			...mapState(['hasLogin', 'userInfo']), //从Store获取全局变量
		},
		onLoad() {
			this.account = this.userInfo.account
			this.head_img = this.userInfo.head_img
			this.nickname = this.userInfo.nickname
			this.sex = this.userInfo.sex
			this.description = this.userInfo.description
			this.longtext = this.userInfo.longtext

		},
		data() {
			return {
				account: null,
				head_img: null,
				nickname: null,
				sex: null,
				description: null,
				longtext: {
					birthday: '1999-01-01',
					background_img: null,
				},
				//模态框配置.
				showClipper: false,
				showClipperBack: false,
				imageUrl: null,
				showNickname: false,
				showDescription: false,
				showSex: false,
				sexList: [{
						text: '男',
					},
					{
						text: '女',
					},
					{
						text: '直升机',
					},
					{
						text: '购物袋',
					},
					{
						text: '草履虫',
					},
				],
				showTime: false,
			}
		},
		methods: {
			modifyProfile() {
				this.$http.put('/users/save', {
					id: this.id,
					head_img: this.head_img,
					nickname: this.nickname,
					sex: this.sex,
					description: this.description,
					longtext: JSON.stringify(this.longtext),
				}).then(res => {
					if (res.data.code === 200) {
						//每次更新都需要获取最新用户数据否则无法实时更新
						this.getUserProfile()
						console.log(res.data.msg)
					}
				})
			},
			getUserProfile() {
				this.$http.get('/users/one', {
					params: {
						id: this.id
					}
				}).then(res => {
					if (res.data.code === 200) {
						this.$store.commit('setUserInfo', res.data.data)
						console.log('用户数据更新完成')
					}
				})
			},
			sexChoose(index) {
				this.sex = this.sexList[index].text
				this.modifyProfile()
			},
			imageChoose(index) {
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'], //从相册选择
					success: res => {
						this.imageUrl = res.tempFilePaths[0] //交给裁剪去处理
						if (index === 0) {
							this.showClipper = true
						} else {
							this.showClipperBack = true
						}
					}
				})
			},
			upload() {
				const filePath = this.$isBase64(this.head_img) ? this.head_img : 'file://' + plus.io
					.convertLocalFileSystemURL(this.head_img)
				this.$http.upload('/file/upload', {
					filePath: filePath,
					name: 'file'
				}).then(res => {
					if (res.data.code === 200) {
						this.head_img = res.data.data
						this.modifyProfile()
					}
				})
			},
			uploadBackground() {
				const filePath = this.$isBase64(this.longtext.background_img) ? this.longtext.background_img : 'file://' +
					plus.io.convertLocalFileSystemURL(this.longtext.background_img)
				this.$http.upload('/file/upload', {
					filePath: filePath,
					name: 'file'
				}).then(res => {
					if (res.data.code === 200) {
						this.longtext.background_img = res.data.data
						this.modifyProfile()
					}
				})
			},
			setBirthday(e) {
				this.longtext.birthday = e.year + '-' + e.month + '-' + e.day
				this.modifyProfile()
			}
		}
	}
</script>

<style>

</style>