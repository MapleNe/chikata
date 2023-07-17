<template>
	<view id="tool">
		<view class="container-fluid">
			<view class="content-page">
				<view class="content">
					
					<view v-show="weather.is_show" class="row">
						<view class="col-12">
							<view class="card mb-2">
								<view class="card-body">
									<h5 class="header-title mb-2">{{weather.province || ""}} {{weather.city || ""}} 天气</h5>
									<view class="bottom-solid font-15">
										温度：<text class="float-right">{{weather.temperature || "加载中..."}} ℃</text>
									</view>
									<view class="bottom-solid font-15">
										湿度：<text class="float-right">{{weather.humidity || "加载中..."}}</text>
									</view>
									<view class="bottom-solid font-15">
										天气：<text class="float-right">{{weather.weather || "加载中..."}}</text>
									</view>
									<view class="bottom-solid font-15">
										风向：<text class="float-right">{{weather.winddirection || "加载中..."}}</text>
									</view>
									<view class="bottom-solid font-15">
										风力：<text class="float-right">{{weather.windpower || "加载中..."}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
					
					<view class="row">
						<view class="col-12">
							<view class="card">
								<view class="card-body">
									<h5 class="header-title mb-2">系统信息</h5>
									<view v-show="system.is_show" class="bottom-solid font-15">
										设备型号：<text class="float-right">{{system.model || "加载中..."}}</text>
									</view>
									<view v-show="system.is_show" class="bottom-solid font-15">
										操作系统：<text class="float-right">{{system.system || "加载中..."}}</text>
									</view>
									<view v-show="system.is_show" class="bottom-solid font-15">
										引擎版本：<text class="float-right">{{system.version || "加载中..."}}</text>
									</view>
									<view v-show="system.is_show" class="bottom-solid font-15">
										语言模式：<text class="float-right">{{system.language || "加载中..."}}</text>
									</view>
									<view v-show="network.is_show" class="bottom-solid font-15">
										网络状态：<text class="float-right">{{network.type || "加载中..."}}</text>
									</view>
								</view>
							</view>
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
				system : [],	// 系统信息
				network: [],	// 网络信息
				weather: [],	// 天气信息
			}
		},
		onLoad() {
			this.getSystem()
			this.getWeather()
		},
		methods: {
			// 获取系统信息
			getSystem(){
				uni.getSystemInfo({
				    success: (res) => {
						this.system = res
						this.system.is_show = true
				    },
					fail: (err) => {
						this.system = {
							model	:"获取失败",
							system	:"获取失败",
							language:"获取失败",
							version	:"获取失败",
							is_show : false
						}
					}
				});
				uni.getNetworkType({
				    success: (res) => {
						this.network = {
							type: res.networkType,
							is_show: true
						}
				    },
					fail: (err) => {
						this.network = {
							type: "获取失败",
							is_show: false
						}
					}
				});
			},
			// 获取天气信息
			getWeather(){
				this.$http.get('/location/weather').then(res => {
					if (res.data.code == 200) {
						let data = res.data.data
						this.weather = data.lives[0]
						this.weather.is_show = true
					} else this.weather.is_show = false
				})
			}
		}
	}
</script>

<style>

</style>
