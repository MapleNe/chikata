import {
	isJSON
} from "@/utils/utils.js"

class WebSocketClass {
	constructor(url) {
		this.lockReconnect = false; // 是否开始重连
		this.wsUrl = ""; // ws 地址
		this.globalCallback = null; // 回调方法
		this.userClose = false; // 是否主动关闭
		//心跳检测
		this.timeout = 45000 //多少秒执行检测
		this.timeoutObj = null //检测服务器端是否还活着
		this.createWebSocket(url);


	}

	createWebSocket(url) {
		// #ifdef H5
		if (typeof(WebSocket) === 'undefined') {
			this.writeToScreen("您的浏览器不支持WebSocket，无法获取数据");
			return false
		}
		// #endif

		// #ifdef APP-PLUS
		if (typeof(uni.connectSocket) === 'undefined') {
			this.writeToScreen("您的浏览器不支持WebSocket，无法获取数据");
			return false
		}
		// #endif

		this.wsUrl = url;
		try {
			// 创建一个this.ws对象【发送、接收、关闭socket都由这个对象操作】
			this.ws = uni.connectSocket({
				url: this.wsUrl,
				success(data) {
					// console.log("websocket连接成功");
				},
			});
			this.initEventHandle();

		} catch (e) {
			this.reconnect(url);
		}
	}

	// 初始化
	initEventHandle() {
		/**
		 * 监听WebSocket连接打开成功
		 */
		// #ifdef H5
		this.ws.onopen = (event) => {
			// console.log("WebSocket连接打开H5"); //打开连接
			this.start()
		};
		// #endif

		// #ifdef APP-PLUS
		this.ws.onOpen(res => {
			// console.log('WebSocket连接打开APP'); //打开连接
			this.start()
		});
		// #endif


		/**
		 * 连接关闭后的回调函数
		 */

		// #ifdef H5
		this.ws.onclose = (event) => {
			if (!this.userClose) {
				this.reconnect(this.wsUrl); //重连
			}
		};
		// #endif

		// #ifdef APP-PLUS
		this.ws.onClose(() => {
			if (!this.userClose) {
				this.reconnect(this.wsUrl); //重连
			}
		});
		// #endif


		/**
		 * 报错时的回调函数
		 */

		// #ifdef H5
		this.ws.onerror = (event) => {
			if (!this.userClose) {
				this.reconnect(this.wsUrl); //重连
			}
		};
		// #endif

		// #ifdef APP-PLUS
		this.ws.onError(() => {
			if (!this.userClose) {
				this.reconnect(this.wsUrl); //重连
			}
		});
		// #endif
		/**
		 * 收到服务器数据后的回调函数
		 */
		this.ws.onMessage(event => {
			if (isJSON(event.data)) {
				const jsonobject = JSON.parse(event.data)

				this.globalCallback(jsonobject)
			} else {
				this.globalCallback(event.data)
			}
		});
	}

	// 关闭ws连接回调
	reconnect(url) {
		if (this.lockReconnect) return;
		this.ws.close();
		clearInterval(this.timeoutObj)
		this.lockReconnect = true; // 关闭重连，没连接上会一直重连，设置延迟避免请求过多
		setTimeout(() => {
			this.createWebSocket(url);
			this.lockReconnect = false;
		}, 1000);
	}

	// 发送信息方法
	// #ifdef APP-PLUS
	webSocketSendMsg(msg) {
		this.ws && this.ws.send({
			data: msg,
			success() {
				// console.log("消息发送成功");
			},
			fail(err) {
				// console.log("消息发送失败", err)
			}
		});
	}
	// #endif
	// #ifdef H5
	webSocketSendMsg(msg) {
		uni.sendSocketMessage({
			data: msg,
			success() {
				// console.log("消息发送成功");
			},
			fail(err) {
				// console.log("消息发送失败", err)
			}
		})
	}
	// #endif

	//心跳
	start() {
		this.timeoutObj = setInterval(() => {
			//这里发送一个心跳，后端收到后，返回一个心跳消息，
			//onmessage拿到返回的心跳就说明连接正常
			this.ws && this.ws.send({
				data: '{"type":"ping"}',
			});
		}, this.timeout)
	}

	// 获取ws返回的数据方法
	getWebSocketMsg(callback) {
		this.globalCallback = callback
	}

	// 关闭ws方法
	closeSocket() {
		if (this.ws) {
			this.userClose = true;
			clearInterval(this.timeoutObj)
			this.ws.close({
				success(res) {
					// console.log("关闭成功", res)
				},
				fail(err) {
					// console.log("关闭失败", err)
				}
			});
		}
	}

	writeToScreen(massage) {
		console.log(massage);
	}
}
export default WebSocketClass;