// router.js
import {
	RouterMount,
	createRouter
} from 'uni-simple-router';
import store from '../store';
let num = 1;
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	routes: [...ROUTES],
	routerErrorEach: ({
		type,
		level,
		...args
	}) => {
		console.log({
			type,
			level,
			...args
		})
		// #ifdef APP-PLUS
		if (type === 3) {
			router.$lockStatus = false;
			// #ifdef APP-PLUS
			if (num > 1) {
				plus.runtime.quit();
			} else {
				num += 1;
				plus.nativeUI.toast("再按一次退出应用");
			}
			setTimeout(function() {
				num = 1;
			}, 1500);
			// #endif
		}
		// #endif
	},

});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	//为某些需要登录的页面做统一路由拦截
	if (to.meta.login && !store.state.hasLogin && !uni.getStorageSync('token')) {
		next({
			path: '/pages/user/login',
			animation: {
				animationType: 'slide-in-bottom',
				animationDuration: 350
			},
			NAVTYPE: 'push'
		});
	} else {
		next();

	}

});
// 全局路由后置守卫
router.afterEach((to, from) => {
	// console.log('跳转结束')
})

export {
	router,
	RouterMount
}