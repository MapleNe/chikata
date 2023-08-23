// router.js
import {
	RouterMount,
	createRouter
} from 'uni-simple-router';
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
	next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	console.log('跳转结束')
})

export {
	router,
	RouterMount
}