<template>
	<view>
		<Parser class="parse" :tag-style="tagStyle" :html="inputHTML" show-with-animation>
			<view class="loading">
				<view class="loading_wrap">
					<text>加载中...</text>
				</view>
			</view>
		</Parser>
	</view>
</template>

<script>
	import marked from './assets/marked.min.js';
	import Parser from "./parser/parser.vue";
	
	export default {
		props:{
			resource:{
				type:String,
				default:"**请输入markdown内容**"
			}
		},
		components:{
			Parser
		},
		data() {
			return {
				tagStyle: {
				    // 代码块
				    pre: 'overflow: auto;background: #f5f5f5;padding: 1em;white-space: pre;margin:1em;',
				},
			}
		},
		computed:{
			inputHTML(){
				return marked(this.resource);
			}
		},
		created(){
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	@import url('./assets/default.css');
</style>
