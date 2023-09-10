const config = {
	// API接口，必须是HTTPS开头
	"api": "https://api.fantwo.cc/api",
	// WebSocket
	"wss": "wss://api.fantwo.cc:9501",
	// Token令牌，如果后端开启了，需要修改此项
	"token": "95fb9c89cba09c40010ac075438df212",
	// 版本号，禁止私自修改，后果自负
	"version": "1.0.0",
	// 首页分享处描述
	"description": "Chikata",
}

// 导出配置
module.exports = config