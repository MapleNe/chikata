const config = {
	// API接口，必须是HTTPS开头
	"api": "https://api.guan.asia/api",
	// webSite 网页地址
	"web": "https://h5.xboundless.com/",
	// WebSocket
	"wss": "wss://api.guan.asia:9501",
	// Token令牌，如果后端开启了，需要修改此项
	"token": "da6e55afa24d2738e2fca4409c696ef0",
	// 版本号，禁止私自修改，后果自负
	"version": "1.0.0",
	// 首页分享处描述
	"description": "Chikata",
}

// 导出配置
module.exports = config