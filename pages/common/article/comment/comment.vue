<template>
	<z-paging ref="paging" @query="getComment">
		<template #top>
			<tn-nav-bar :fixed="false" backTitle="">
				评论详情
			</tn-nav-bar>
		</template>
	</z-paging>
</template>

<script>
	export default {
		data() {
			return {
				id: 0,
			};
		},
		onLoad(params) {
			this.id = params.id
		},
		methods: {
			getComment(page, num) {
				this.$http.get('/comments/one', {
					params: {
						page: page,
						limit: num,
						id: 264,
						tree: true,
					}
				}).then(res => {
					console.log(res)
				}).catch(err=>{
					console.log(err)
				})
			}
		}
	}
</script>

<style lang="scss">

</style>