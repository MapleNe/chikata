<template>
	<view>
		<tn-popup mode="bottom" length="30%" :borderRadius="20" v-model="isShow" @close="closePopup">
			<view class="tn-margin">
				<text>反馈</text>
				<view class="tn-flex tn-flex-wrap tn-flex-row-between">
					<view v-for="(item,index) in feedback" :key="index" style="width: 45%;"
						class="tn-text-center tn-margin-top-sm tn-padding-xs tn-bg-gray--light tn-radius">
						<text>{{item.name}}</text>
					</view>
				</view>
				<view class="tn-margin-top" v-show="data&&data.users_id !== userInfo.id">
					<text>不想看</text>
					<view class="tn-flex tn-flex-wrap tn-flex-row-between">
						<view v-for="(item,index) in dislike" :key="index" style="width: 45%;"
							class="tn-text-center tn-margin-top-sm tn-padding-xs tn-bg-gray--light tn-radius">
							<text>{{item.name}}</text>
						</view>
					</view>
				</view>
				<view class="tn-margin-top" v-show="data&&hasLogin&&userInfo.id === data.users_id">
					<text>管理</text>
					<view class="tn-flex tn-flex-wrap tn-flex-row-between">
						<view v-for="(item,index) in user" :key="index" style="width: 45%;"
							class="tn-text-center tn-margin-top-sm tn-padding-xs tn-bg-gray--light tn-radius"
							@tap.stop="manageAction(item)">
							<text>{{item.name}}</text>
						</view>
					</view>
				</view>

			</view>
		</tn-popup>
		<tn-popup mode="center" v-model="showDelete" length="80%" :borderRadius="6">
			<view class="tn-margin">
				<view class="tn-text-center">
					<text>要删除吗？真的会消失很久很久</text>
				</view>
				<view class="tn-flex tn-flex-row-right tn-margin-top">
					<view @tap.stop="showDelete = false">
						<tn-button>取消</tn-button>
					</view>
					<view @tap.stop="deleteArticle()">
						<tn-button fontColor="tn-color-purplered">删除</tn-button>
					</view>

				</view>
			</view>

		</tn-popup>
	</view>
</template>

<script>
	import {
		mapState,
	} from 'vuex';
	export default {
		props: {
			showMenu: {
				type: Boolean,
				default: false
			},
			data: {
				type: Object,
				default: null,
			}
		},
		name: "aticleMenu",
		data() {
			return {
				feedback: [{
						name: '色情低俗'
					},
					{
						name: '恐怖血腥'
					},
					{
						name: '图片不适'
					},
					{
						name: '内容诈骗'
					}
				],
				user: [{
						name: '编辑',
						type: 'edit'
					},
					{
						name: '删除',
						type: 'delete'
					}
				],
				dislike: [{
						name: '作者'
					},
					{
						name: '标签'
					}
				],
				isShow: false,
				showDelete: false
			};
		},
		watch: {
			showMenu(value) {
				this.isShow = value;
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo']), //从Store获取全局变量
		},
		methods: {
			closePopup() {
				this.isShow = false;
				this.$emit("update:showMenu", false);
			},
			manageAction(item) {
				switch (item.type) {
					case 'edit':
						uni.showToast({
							icon: 'none',
							title: '还没做'
						})
						break;
					case 'delete':
						this.showDelete = true
						this.closePopup()
						break;
					default:
						break;
				}
			},
			deleteArticle() {
				this.$http.delete('/article/remove', {
					id: this.data.id
				}).then(res => {
					if (res.data.code === 200) {
						uni.showToast({
							icon: 'none',
							title: '删除' + res.data.msg
						})
						uni.$emit('deleteArticleOk', true)
					}
					this.showDelete = false
					console.log(res)
				})
			},
		}
	}
</script>

<style lang="scss">

</style>