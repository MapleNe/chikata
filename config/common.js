export function appShare(scene, provider, title, link, imageUrl, summary) {
	uni.share({
		provider: provider,
		title: title,
		type: 0,
		href: link
		imageUrl: imageUrl,
		summary: summary,
		success: (res => {
			uni.showToast({
				icon: 'none',
				title: '分享成功！',
			})
		})
	})
}