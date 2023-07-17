<template>
	<view id="search">
		<view class="container-fluid">
			<view class="content-page">
				<view class="content">
					<view class="row">
						<view class="col-12">
							<!--  text-white bg-primary -->
							<view class="card mb-0">
								<view class="card-body">
									<h5 class="card-title">搜索</h5>
									<text class="card-text font-15">擅用搜索，事半功倍！</text>
									<view class="input-group mt-2">
										<input v-model="value" type="text" class="form-control" placeholder="搜索一下">
										<image src="@/static/svg/search.svg" class="search-svg"></image>
									</view>
								</view>
							</view>
						</view>
					</view>
					<view class="row">
						<view class="col-12">
							<view class="card-body pl-1">
								<h5 class="align-center mb-0">
									<image src="@/static/svg/hot.svg" class="h-3em w-3em"></image>
									<text class="ml-2">{{title || '热门文章'}}</text>
								</h5>
							</view>
						</view>
					</view>
					<view v-for="(item,index) in article.data" :key="item.id" class="row">
						<navigator open-type="navigate" :url="'../article/article?id=' + item.id" class="col-12">
							<view class="card mb-2">
								<view class="card-body p-2">
									<view class="row">
										<view class="col-4">
											<image :src="item.expand.img_src" mode="widthFix" class="card-img-left"></image>
										</view>
										<view class="col-8">
											<h6>
												<text v-if="item.is_top == 1" class="badge badge-danger mr-1">置顶</text>
												{{item.title || ""}}
											</h6>
											<view>
												<text class="absolute left-13px font-13 text-muted">
													{{item.expand.author.nickname || ''}}
												</text>
												<text class="absolute right-13px font-13 text-muted">
													<text class="ml-1">{{item.create_time || ''}}</text>
												</text>
											</view>
										</view>
									</view>
								</view>
							</view>
						</navigator>
					</view>
					<view v-show="article.count == 0" class="row">
						<view class="col-12 flex-center">
							<text>找不到您搜索的内容</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: "热门文章", // 标题
				value: "",		  // 搜索值
				article: [],	  // 搜索结果
			}
		},
		onLoad() {
			this.getHotArticle()
		},
		methods: {
			// 获取热门文章
			getHotArticle(){
				this.$http.get('/article',{
					params: {
						limit: 8,
						order: 'views desc'
					}
				}).then(res => {
					if (res.data.code == 200) {
						let data = res.data.data
						data.data.forEach(item=>{
							item.views = this.$inisHelper.format.number(item.views)
						})
						this.article = data
					}
				})
			},
			// 执行搜索
			search(){
				this.$http.get('/article',{
					params: {
						limit: 9999,
						search: this.value
					}
				}).then(res => {
					if (res.data.code == 200) {
						let data = res.data.data
						data.data.forEach(item=>{
							item.views = this.$inisHelper.format.number(item.views)
						})
						this.article = data
					}
				})
			},
		},
		watch:{
			value: {
				handler(newValue, oldValue) {
					this.search()
					if (this.$inisHelper.is.empty(this.value)) this.title = "热门文章"
					else this.title = "搜索结果"
				},
			}
		}
	}
</script>

<style scoped>
.uni-input-input, .uni-input-placeholder {
    font-size: 13px;
}
.absolute{
	position: absolute;
	bottom: 0;
}
.left-13px{
	left: 13px;
}
.right-13px{
	right: 13px;
}
</style>
