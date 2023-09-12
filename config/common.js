export function appShare(scene, provider, title, link, imageUrl, summary) {
	uni.share({
		provider: provider,
		title: title,
		scene: scene,
		type: 0,
		href: link,
		imageUrl: imageUrl?imageUrl:'',
		summary: summary,
		success: (res => {
			uni.showToast({
				icon: 'none',
				title: '分享成功！',
			})
		}),
		fail: (fail) => {
			uni.showToast({
				icon:'none',
				title:'分享失败'
			})
		}
	})
}