<template>
	<z-paging ref="paging" refresher-only @onRefresh="onRefresh" @scroll="getScroll">
		<template #top>
			<tn-nav-bar backTitle="" :backgroundColor="background" :fontColor="!navAuthor?'tn-color-white':''">
				<view class="tn-padding" slot="right">
					<text class="tn-text-xxl tn-icon-share-triangle"></text>
				</view>
			</tn-nav-bar>
		</template>
		<view style="position: relative;" id="contentview">
			<!-- 分类头像 -->
			<view style="position: relative;height: 420rpx;">
				<image :src="categoryInfo.opt.head_img" mode="aspectFill" style="width: 100%;height: 100%;">
				</image>
				<view style="position: absolute;top: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.3);"></view>
			</view>
			<view style="position: absolute;top: 120rpx;" class="tn-margin tn-flex tn-flex-col-center">
				<tn-avatar size="xl" border borderColor="#fff" :borderSize="6"
					:src="categoryInfo.opt.head_img"></tn-avatar>
				<view class="tn-flex tn-margin-left-sm tn-flex-direction-column tn-color-white"
					v-if="categoryInfo&&categoryInfo.expand">
					<text class="tn-text-bold">{{categoryInfo.name}}</text>
					<view class="tn-margin-top tn-flex tn-flex-col-center tn-flex-basic-md tn-text-sm">
						<text>Lv.5</text>
						<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
						<text>1K成员</text>
						<text class="tn-margin-left-xs tn-margin-right-xs">·</text>
						<text>{{categoryInfo.expand.count}}篇帖子</text>
					</view>
				</view>
			</view>
			<!-- 分类公告 -->
			<!-- 圆弧 -->
			<view style="position: absolute;top: 364rpx;width: 100%; border-radius: 35rpx 35rpx 0 0;"
				class="tn-bg-white tn-padding"></view>
			<view class="tn-margin tn-no-margin-top" v-if="categoryPlacard.length">
				<view class="tn-bg-gray--light tn-padding-sm" style="border-radius: 10rpx;">
					<view class="">
						<text class="tn-text-bold tn-color-gray--dark">分区资讯</text>
					</view>
					<block v-for="(item,index) in categoryPlacard">
						<view class="tn-flex tn-flex-col-center tn-margin-top-sm" @tap.stop.prevent="goPlacard(item)">
							<view class="ch-bg-main tn-radius tn-margin-right-sm">
								<text
									class="tn-color-white tn-padding-left-xs tn-padding-right-xs tn-text-sm">{{type[item.type]}}</text>
							</view>
							<text class="tn-text-md">{{item.title}}</text>
						</view>
					</block>
				</view>
			</view>
		</view>

		<view :style="{'z-index': 100,'position': 'sticky','top' :vuex_custom_bar_height+'px'}">
			<z-tabs ref="tabs" :current="tabsIndex" active-color="#29b7cb" @change="changeTab" :list="tabs"
				:scrollCount="2"></z-tabs>
		</view>
		<swiper style="height: 150vh;" :current="tabsIndex" @transition="swiperTransition"
			@animationfinish="swiperAnimationfinish">
			<swiper-item style="overflow: auto;">
				<z-paging @query="getAticle" v-model="article" ref="article" :use-page-scroll="swiperAction"
					:auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false"
					:refresher-enabled="false">
					<block v-for="(item,index) in article" :key="index">
						<view class="tn-margin">
							<view class="tn-flex tn-flex-col-center tn-flex-row-between">
								<view class="tn-flex tn-flex-col-center" style="position: relative;">
									<tn-avatar :src="item.expand.author.head_img"
										@tap="type!=='user'?goUserProfile(index):''"></tn-avatar>
									<text v-if="item.expand.author.level==='admin'"
										class="tn-margin-left-xs tn-text-md tn-color-blue tn-icon-trusty-fill tn-bg-white tn-round"
										style="position: absolute;top: 58rpx;left: 30rpx; z-index: 9999; padding: 2rpx;"></text>
									<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
											<text class="level tn-margin-left-xs level-text"
												:class="['lv-'+item.expand.author.grade]"
												:style="{'color':level[item.expand.author.grade]}"></text>
										</view>
										<view class="tn-flex tn-flex-col-center tn-text-sm tn-color-gray--dark">
											<text>{{getDate(item.create_time)}}</text>
										</view>
									</view>
								</view>
								<view>
									<tn-button plain size="sm" :fontSize="30" padding="0 15rpx"
										backgroundColor="#29b7cb" fontColor="#29b7cb" v-if="!item.expand.focus"
										@click="followUser(index)">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-icon-add tn-margin-right-xs"></text>
											<text>关注</text>
										</view>
									</tn-button>
									<tn-button size="sm" :fontSize="30" padding="0 20rpx" plain
										backgroundColor="tn-bg-gray--light" fontColor="tn-color-gray"
										@click="followUser(index)" v-else>
										<text>已关注</text>
									</tn-button>
								</view>
							</view>
							<view @tap="goAticle(item)">
								<view class="tn-margin-top">
									<text class="tn-text-title">{{item.title}}</text>
								</view>
								<view class="tn-padding-sm tn-no-padding-left tn-color-gray--dark tn-padding-bottom-sm">
									<rich-text :nodes="item.description"></rich-text>
								</view>

								<!-- 单张图片 -->
								<view v-if="item.expand.images.length===1">
									<image v-for="(images,subIndex) in item.expand.images" :key="subIndex"
										:src="images.src" mode="aspectFill"
										style="height: 400rpx;width: 400rpx;border-radius:10rpx;"
										@tap.stop="previewImage(item.expand.images,subIndex)">
									</image>
								</view>
								<!-- 单张结束 -->
								<!-- 复数开始 -->
								<view v-if="item.expand.images.length===2 || item.expand.images.length===4">
									<tn-grid align="left" :col="item.expand.images.length" hoverClass="none">
										<block v-for="(images, subIndex) in item.expand.images" :key="subIndex">
											<!-- H5 -->
											<!-- #ifndef MP-WEIXIN -->
											<tn-grid-item
												style="height: 256rpx;width: 256rpx;margin-right: 6rpx;margin-bottom: 6rpx;">
												<image :src="images.src" mode="aspectFill"
													style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->

											<!-- 微信小程序 -->
											<!-- #ifdef MP-WEIXIN -->
											<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
												style="margin-right: 6rpx;margin-bottom: 6rpx;">
												<image :src="images.src" mode="aspectFill"
													style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->
										</block>
									</tn-grid>
								</view>
								<view v-if="item.expand.images.length===3|| item.expand.images.length>4">
									<tn-grid align="left" :col="3" hoverClass="none">
										<block v-for="(images, subIndex) in item.expand.images" :key="subIndex"
											v-if="subIndex<9">
											<!-- H5 -->
											<!-- #ifndef MP-WEIXIN -->
											<tn-grid-item
												style="height: 220rpx;width: 220rpx;margin-right: 6rpx;margin-bottom: 6rpx">
												<image :src="images.src" mode="aspectFill"
													style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->

											<!-- 微信小程序 -->
											<!-- #ifdef MP-WEIXIN -->
											<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
												style="margin-right: 6rpx;margin-bottom: 6rpx">
												<image :src="images.src" mode="aspectFill"
													style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->
										</block>
									</tn-grid>
								</view>
								<!-- 点赞控件 -->
								<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top">
									<!-- 只取第一个tag -->
									<view v-if="item.expand.tag.length>0">
										<view
											class="tn-bg-grey--light tn-text-sm tn-color-gray--dark tn-margin-right-sm tn-padding-xs"
											style="border-radius: 10rpx;">
											<text>{{item.expand.tag[0].name}}</text>
										</view>
									</view>
									<view
										class="tn-flex tn-text-sm tn-flex-col-center tn-color-grey--disabled tn-flex-basic-sm tn-flex-row-between"
										style="margin-left: auto;">
										<view class="tn-flex tn-flex-col-bottom">
											<text class="tn-text-xxl tn-icon-fire "></text>
											<text class="tn-margin-left-xs">{{item.views}}</text>
										</view>
										<view class="tn-flex tn-flex-col-bottom">
											<text class="tn-text-xxl tn-icon-comment"></text>
											<text class="tn-margin-left-xs">{{item.expand.comments.count}}</text>
										</view>
										<view class="tn-flex tn-flex-col-bottom" @tap.stop="likeAction(index)">
											<text class="tn-text-xxl"
												:class="item.expand.like.is_like?'ch-color-primary tn-icon-praise-fill':'tn-icon-praise'"></text>
											<text class="tn-margin-left-xs">{{item.expand.like.likes_count}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						</view>
						<!-- 间隔开始 -->
						<view class="tn-bg-gray--light tn-padding-xs"></view>
						<!-- 间隔结束 -->
					</block>
				</z-paging>
			</swiper-item>
			<swiper-item style="overflow: auto;">
				<z-paging @query="getAticle" v-model="articleHot" ref="articleHot" :use-page-scroll="swiperAction"
					:auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false"
					:refresher-enabled="false">
					<block v-for="(item,index) in articleHot" :key="index">
						<view class="tn-margin">
							<view class="tn-flex tn-flex-col-center tn-flex-row-between">
								<view class="tn-flex tn-flex-col-center" style="position: relative;">
									<tn-avatar :src="item.expand.author.head_img"
										@tap="type!=='user'?goUserProfile(index):''"></tn-avatar>
									<text v-if="item.expand.author.level==='admin'"
										class="tn-margin-left-xs tn-text-md tn-color-blue tn-icon-trusty-fill tn-bg-white tn-round"
										style="position: absolute;top: 58rpx;left: 30rpx; z-index: 9999; padding: 2rpx;"></text>
									<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
											<text class="level tn-margin-left-xs level-text"
												:class="['lv-'+item.expand.author.grade]"
												:style="{'color':level[item.expand.author.grade]}"></text>
										</view>
										<view class="tn-flex tn-flex-col-center tn-text-sm tn-color-gray--dark">
											<text>{{getDate(item.create_time)}}</text>
										</view>
									</view>
								</view>
								<view>
									<tn-button plain size="sm" :fontSize="30" padding="0 15rpx"
										backgroundColor="#29b7cb" fontColor="#29b7cb" v-if="!item.expand.focus"
										@click="followUser(index)">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-icon-add tn-margin-right-xs"></text>
											<text>关注</text>
										</view>
									</tn-button>
									<tn-button size="sm" :fontSize="30" padding="0 20rpx" plain
										backgroundColor="tn-bg-gray--light" fontColor="tn-color-gray"
										@click="followUser(index)" v-else>
										<text>已关注</text>
									</tn-button>
								</view>
							</view>
							<view @tap="goAticle(item)">
								<view class="tn-margin-top">
									<text class="tn-text-title">{{item.title}}</text>
								</view>
								<view class="tn-padding-sm tn-no-padding-left tn-color-gray--dark tn-padding-bottom-sm">
									<rich-text :nodes="item.description"></rich-text>
								</view>

								<!-- 单张图片 -->
								<view v-if="item.expand.images.length===1">
									<image v-for="(images,subIndex) in item.expand.images" :key="subIndex"
										:src="images.src" mode="aspectFill"
										style="height: 400rpx;width: 400rpx;border-radius:10rpx;"
										@tap.stop="previewImage(item.expand.images,subIndex)">
									</image>
								</view>
								<!-- 单张结束 -->
								<!-- 复数开始 -->
								<view v-if="item.expand.images.length===2 || item.expand.images.length===4">
									<tn-grid align="left" :col="item.expand.images.length" hoverClass="none">
										<block v-for="(images, subIndex) in item.expand.images" :key="subIndex">
											<!-- H5 -->
											<!-- #ifndef MP-WEIXIN -->
											<tn-grid-item
												style="height: 256rpx;width: 256rpx;margin-right: 6rpx;margin-bottom: 6rpx;">
												<image :src="images.src" mode="aspectFill"
													style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->

											<!-- 微信小程序 -->
											<!-- #ifdef MP-WEIXIN -->
											<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
												style="margin-right: 6rpx;margin-bottom: 6rpx;">
												<image :src="images.src" mode="aspectFill"
													style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->
										</block>
									</tn-grid>
								</view>
								<view v-if="item.expand.images.length===3|| item.expand.images.length>4">
									<tn-grid align="left" :col="3" hoverClass="none">
										<block v-for="(images, subIndex) in item.expand.images" :key="subIndex"
											v-if="subIndex<9">
											<!-- H5 -->
											<!-- #ifndef MP-WEIXIN -->
											<tn-grid-item
												style="height: 220rpx;width: 220rpx;margin-right: 6rpx;margin-bottom: 6rpx">
												<image :src="images.src" mode="aspectFill"
													style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->

											<!-- 微信小程序 -->
											<!-- #ifdef MP-WEIXIN -->
											<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
												style="margin-right: 6rpx;margin-bottom: 6rpx">
												<image :src="images.src" mode="aspectFill"
													style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->
										</block>
									</tn-grid>
								</view>
								<!-- 点赞控件 -->
								<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top">
									<!-- 只取第一个tag -->
									<view v-if="item.expand.tag.length>0">
										<view
											class="tn-bg-grey--light tn-text-sm tn-color-gray--dark tn-margin-right-sm tn-padding-xs"
											style="border-radius: 10rpx;">
											<text>{{item.expand.tag[0].name}}</text>
										</view>
									</view>
									<view
										class="tn-flex tn-text-sm tn-flex-col-center tn-color-grey--disabled tn-flex-basic-sm tn-flex-row-between"
										style="margin-left: auto;">
										<view class="tn-flex tn-flex-col-bottom">
											<text class="tn-text-xxl tn-icon-fire "></text>
											<text class="tn-margin-left-xs">{{item.views}}</text>
										</view>
										<view class="tn-flex tn-flex-col-bottom">
											<text class="tn-text-xxl tn-icon-comment"></text>
											<text class="tn-margin-left-xs">{{item.expand.comments.count}}</text>
										</view>
										<view class="tn-flex tn-flex-col-bottom" @tap.stop="likeAction(index)">
											<text class="tn-text-xxl"
												:class="item.expand.like.is_like?'ch-color-primary tn-icon-praise-fill':'tn-icon-praise'"></text>
											<text class="tn-margin-left-xs">{{item.expand.like.likes_count}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						</view>
						<!-- 间隔开始 -->
						<view class="tn-bg-gray--light tn-padding-xs"></view>
						<!-- 间隔结束 -->
					</block>
				</z-paging>
			</swiper-item>
			<swiper-item style="overflow: auto;">
				<z-paging @query="getAticle" v-model="articleNew" ref="articleNew" :use-page-scroll="swiperAction"
					:auto-clean-list-when-reload="false" :auto-scroll-to-top-when-reload="false"
					:refresher-enabled="false">
					<block v-for="(item,index) in articleNew" :key="index">
						<view class="tn-margin">
							<view class="tn-flex tn-flex-col-center tn-flex-row-between">
								<view class="tn-flex tn-flex-col-center" style="position: relative;">
									<tn-avatar :src="item.expand.author.head_img"
										@tap="type!=='user'?goUserProfile(index):''"></tn-avatar>
									<text v-if="item.expand.author.level==='admin'"
										class="tn-margin-left-xs tn-text-md tn-color-blue tn-icon-trusty-fill tn-bg-white tn-round"
										style="position: absolute;top: 58rpx;left: 30rpx; z-index: 9999; padding: 2rpx;"></text>
									<view class="tn-flex tn-flex-direction-column tn-margin-left-sm">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-text-bold">{{item.expand.author.nickname}}</text>
											<text class="level tn-margin-left-xs level-text"
												:class="['lv-'+item.expand.author.grade]"
												:style="{'color':level[item.expand.author.grade]}"></text>
										</view>
										<view class="tn-flex tn-flex-col-center tn-text-sm tn-color-gray--dark">
											<text>{{getDate(item.create_time)}}</text>
										</view>
									</view>
								</view>
								<view>
									<tn-button plain size="sm" :fontSize="30" padding="0 15rpx"
										backgroundColor="#29b7cb" fontColor="#29b7cb" v-if="!item.expand.focus"
										@click="followUser(index)">
										<view class="tn-flex tn-flex-col-center">
											<text class="tn-icon-add tn-margin-right-xs"></text>
											<text>关注</text>
										</view>
									</tn-button>
									<tn-button size="sm" :fontSize="30" padding="0 20rpx" plain
										backgroundColor="tn-bg-gray--light" fontColor="tn-color-gray"
										@click="followUser(index)" v-else>
										<text>已关注</text>
									</tn-button>
								</view>
							</view>
							<view @tap="goAticle(item)">
								<view class="tn-margin-top">
									<text class="tn-text-title">{{item.title}}</text>
								</view>
								<view class="tn-padding-sm tn-no-padding-left tn-color-gray--dark tn-padding-bottom-sm">
									<rich-text :nodes="item.description"></rich-text>
								</view>

								<!-- 单张图片 -->
								<view v-if="item.expand.images.length===1">
									<image v-for="(images,subIndex) in item.expand.images" :key="subIndex"
										:src="images.src" mode="aspectFill"
										style="height: 400rpx;width: 400rpx;border-radius:10rpx;"
										@tap.stop="previewImage(item.expand.images,subIndex)">
									</image>
								</view>
								<!-- 单张结束 -->
								<!-- 复数开始 -->
								<view v-if="item.expand.images.length===2 || item.expand.images.length===4">
									<tn-grid align="left" :col="item.expand.images.length" hoverClass="none">
										<block v-for="(images, subIndex) in item.expand.images" :key="subIndex">
											<!-- H5 -->
											<!-- #ifndef MP-WEIXIN -->
											<tn-grid-item
												style="height: 256rpx;width: 256rpx;margin-right: 6rpx;margin-bottom: 6rpx;">
												<image :src="images.src" mode="aspectFill"
													style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->

											<!-- 微信小程序 -->
											<!-- #ifdef MP-WEIXIN -->
											<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
												style="margin-right: 6rpx;margin-bottom: 6rpx;">
												<image :src="images.src" mode="aspectFill"
													style="height: 256rpx;width: 256rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->
										</block>
									</tn-grid>
								</view>
								<view v-if="item.expand.images.length===3|| item.expand.images.length>4">
									<tn-grid align="left" :col="3" hoverClass="none">
										<block v-for="(images, subIndex) in item.expand.images" :key="subIndex"
											v-if="subIndex<9">
											<!-- H5 -->
											<!-- #ifndef MP-WEIXIN -->
											<tn-grid-item
												style="height: 220rpx;width: 220rpx;margin-right: 6rpx;margin-bottom: 6rpx">
												<image :src="images.src" mode="aspectFill"
													style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->

											<!-- 微信小程序 -->
											<!-- #ifdef MP-WEIXIN -->
											<tn-grid-item :style="{width: gridItemWidth,height:gridItemWidth}"
												style="margin-right: 6rpx;margin-bottom: 6rpx">
												<image :src="images.src" mode="aspectFill"
													style="height: 220rpx;width: 220rpx;border-radius: 10rpx;"
													@tap.stop="previewImage(item.expand.images,subIndex)">
												</image>
											</tn-grid-item>
											<!-- #endif-->
										</block>
									</tn-grid>
								</view>
								<!-- 点赞控件 -->
								<view class="tn-flex tn-flex-col-center tn-flex-row-between tn-margin-top">
									<!-- 只取第一个tag -->
									<view v-if="item.expand.tag.length>0">
										<view
											class="tn-bg-grey--light tn-text-sm tn-color-gray--dark tn-margin-right-sm tn-padding-xs"
											style="border-radius: 10rpx;">
											<text>{{item.expand.tag[0].name}}</text>
										</view>
									</view>
									<view
										class="tn-flex tn-text-sm tn-flex-col-center tn-color-grey--disabled tn-flex-basic-sm tn-flex-row-between"
										style="margin-left: auto;">
										<view class="tn-flex tn-flex-col-bottom">
											<text class="tn-text-xxl tn-icon-fire "></text>
											<text class="tn-margin-left-xs">{{item.views}}</text>
										</view>
										<view class="tn-flex tn-flex-col-bottom">
											<text class="tn-text-xxl tn-icon-comment"></text>
											<text class="tn-margin-left-xs">{{item.expand.comments.count}}</text>
										</view>
										<view class="tn-flex tn-flex-col-bottom" @tap.stop="likeAction(index)">
											<text class="tn-text-xxl"
												:class="item.expand.like.is_like?'ch-color-primary tn-icon-praise-fill':'tn-icon-praise'"></text>
											<text class="tn-margin-left-xs ">{{item.expand.like.likes_count}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
						</view>
						<!-- 间隔开始 -->
						<view class="tn-bg-gray--light tn-padding-xs"></view>
						<!-- 间隔结束 -->
					</block>
				</z-paging>
			</swiper-item>
		</swiper>
	</z-paging>
</template>

<script>
	import ZPMixin from '@/uni_modules/z-paging/components/z-paging/js/z-paging-mixin';
	import articleMenu from '@/components/aticleMenu/aticleMenu.vue';
	export default {
		components: {
			articleMenu,
		},
		mixins: [ZPMixin],
		data() {
			return {
				article: [],
				articleHot: [],
				articleNew: [],
				tabs: ['推荐', '热门', '最新'],
				id: 0,
				commentId: null,
				showComments: false,
				swiperAction: true,
				categoryInfo: {
					opt: {
						head_img: null
					}
				},
				headerHeight: null,
				topHeader: null,
				maxScroll: 200,
				background: 'rgba(255,255,255,0)',
				showMenu: false,
				menuData: null,
				tabsIndex: 0,
				swiperIndex: 0,
				navAuthor: false,
				isloadedHot: false,
				isloadedNew: false,
				categoryPlacard: [],
				type: {
					'article': '帖子',
					'all': '全局',
					'home': '首页',
					'active': '活动'
				},
			}
		},

		onReachBottom() {
			this.$refs.paging.pageReachBottom();
		},
		onLoad(params) {
			this.id = Number(params.id)
			this.getcategoryInfo()
			this.getCategoryPlacard()
		},
		onReady() {
			uni.createSelectorQuery()
				.select('#contentview') // 使用选择器选择元素
				.boundingClientRect(data => {
					if (data) {
						this.headerHeight = data.height

					}
				})
				.exec();
		},
		methods: {
			getComments(id) {
				if (id) {
					this.commentId = id
					this.showComments = true
				}
			},
			getAticle(page, num) {
				this.$http.get('/article-sort/article', {
					params: {
						page: page,
						limit: num,
						id: this.id,
						order: this.tabsIndex == 0 ? 'create_time desc views asc' : this.tabsIndex == 1 ?
							'views desc create_time desc' : this.tabsInde == 2 ? 'create_time asc' : ''
					}
				}).then(res => {
					if (res.data.code === 200) {
						console.log(res)
						switch (this.tabsIndex) {
							case 0:
								this.$refs.article.complete(res.data.data.expand.data)
								break;
							case 1:
								this.$refs.articleHot.complete(res.data.data.expand.data)
								this.isloadedHot = true
								break;
							case 2:
								this.$refs.articleNew.complete(res.data.data.expand.data)
								this.isloadedNew = true
								break;
							default:
								break;
						}

					}
				})
			},
			onRefresh() {
				switch (this.tabsIndex) {
					case 0:
						this.$refs.article.reload()
						break;
					case 1:
						this.$refs.articleHot.reload()
						break;
					case 2:
						this.$refs.articleNew.reload()
						break;
					default:
						break;
				}

				// 告知z-paging下拉刷新结束，这样才可以开始下一次的下拉刷新
				setTimeout(() => {
					//0.5秒之后停止刷新动画
					this.$refs.paging.complete();
				}, 500)
			},
			getcategoryInfo() {
				this.$http.get('/article-sort/one', {
					params: {
						id: this.id
					}
				}).then(res => {
					this.categoryInfo = res.data.data

				})
			},
			getCategoryPlacard() {
				this.$http.get('/placard/sql', {
					params: {
						where: `sort = ${this.id}`
					}
				}).then(res => {
					console.log(res)
					if (res.data.code === 200) {
						this.categoryPlacard = res.data.data.data
					}
				})
			},
			changeTab(index) {
				this.tabsIndex = index
				this.loadAticle()
			},

			loadAticle() {
				switch (this.tabsIndex) {
					case 1:
						if (!this.isloadedHot) {
							this.$refs.articleHot.reload()
						}
						break;
					case 2:
						if (!this.isloadedNew) {
							this.$refs.articleNew.reload()
						}
						break;
					default:
						break;
				}
			},
			previewImage(images, index) {
				let data = [];
				for (let i = 0; i < images.length; i++) {
					data.push(images[i].src);
				}
				uni.previewImage({
					current: index,
					urls: data,
				});
			},
			goPlacard(item) {
				console.log(item)
				switch (item.type) {
					case 'article':
						this.$Router.push({
							path: '/pages/common/article/article',
							query: {
								id: item.opt.article_id,
								users_id: item.opt.users_id
							}
						})
						break;
					default:
						break;
				}
			},
			getDate(data) {
				// 传进来的data必须是日期格式，不能是时间戳
				//var str = data;
				//将字符串转换成时间格式
				var timePublish = new Date(data);
				var timeNow = new Date();
				var minute = 1000 * 60;
				var hour = minute * 60;
				var day = hour * 24;
				var month = day * 30;
				var result = "2";
				var diffValue = timeNow - timePublish;
				var diffMonth = diffValue / month;
				var diffWeek = diffValue / (7 * day);
				var diffDay = diffValue / day;
				var diffHour = diffValue / hour;
				var diffMinute = diffValue / minute;

				// console.log('diffValue：'+diffValue+' ' +'diffMonth：'+diffMonth+' ' +'diffWeek：'+diffWeek+' ' +'diffDay：'+diffDay+' ' +'diffHour：'+diffHour+' ' +'diffMinute：'+diffMinute);

				if (diffValue < 0) {} else if (diffMonth > 3) {
					result = timePublish.getFullYear() + "-";
					result += timePublish.getMonth() + "-";
					result += timePublish.getDate();

				} else if (diffMonth > 1) {
					result = parseInt(diffMonth) + "月前";
				} else if (diffWeek > 1) {
					result = parseInt(diffWeek) + "周前";
				} else if (diffDay > 1) {
					result = parseInt(diffDay) + "天前";
				} else if (diffHour > 1) {
					result = parseInt(diffHour) + "小时前";
				} else if (diffMinute > 1) {
					result = parseInt(diffMinute) + "分钟前";
				} else {
					result = "刚刚";
				}
				return result;
			},
			back() {
				// 通过判断当前页面的页面栈信息，是否有上一页进行返回，如果没有则跳转到首页
				const pages = getCurrentPages()
				if (pages && pages.length > 0) {
					const firstPage = pages[0]
					if (pages.length == 1 && (!firstPage.route || firstPage.route != 'pages/tabbar/index')) {
						this.$Router.replaceAll({
							path: '/pages/tabbar/index'
						})
					} else {
						this.$Router.back(1)
					}
				} else {
					this.$Router.replaceAll({
						path: '/pages/tabbar/index'
					})
				}
			},
			swiperTransition(e) {
				this.$refs.tabs.setDx(e.detail.dx);
			},
			//swiper滑动结束
			swiperAnimationfinish(e) {
				this.tabsIndex = e.detail.current;
				this.$refs.tabs.unlockDx();
				this.loadAticle()
			},
			getScroll(e) {
				const scrollTop = e.detail.scrollTop;
				if (scrollTop > 150) this.navAuthor = true
				else this.navAuthor = false
				if (scrollTop > this.headerHeight) {
					this.swiperAction = false
				} else {
					this.swiperAction = true
				}
				// 计算当前透明度
				const opacity = scrollTop <= 200 ? scrollTop / 200 : 1; // 根据透明度设置导航栏背景颜色
				this.background = `rgba(255, 255, 255, ${opacity})`;
			},
			likeAction(index) {
				this.$http.put('/Article-like/Record', {
					article_id: this[`${this.tabsIndex==0?'article':this.tabsIndex==1?'articleHot':'articleNew'}`][
						index
					].id
				}).then(res => {
					if (res.data.code === 200) {
						this[`${this.tabsIndex==0?'article':this.tabsIndex==1?'articleHot':'articleNew'}`][
							index
						].expand.like.is_like = !this[
							`${this.tabsIndex==0?'article':this.tabsIndex==1?'articleHot':'articleNew'}`][
							index
						].expand.like.is_like
						if (this[`${this.tabsIndex==0?'article':this.tabsIndex==1?'articleHot':'articleNew'}`][
								index
							].expand.like.is_like) {
							this[`${this.tabsIndex==0?'article':this.tabsIndex==1?'articleHot':'articleNew'}`][
								index
							].expand.like.likes_count++
						} else {
							this[`${this.tabsIndex==0?'article':this.tabsIndex==1?'articleHot':'articleNew'}`][
								index
							].expand.like.likes_count--
						}
						uni.showToast({
							icon: 'none',
							title: res.data.msg
						})
					} else {
						if (res.data.code === 403) {
							uni.showToast({
								icon: 'none',
								title: '令牌失效请重新登录'
							})
						}
					}
				}).catch(err => {

				})
			},
			goAticle(item) {
				this.$Router.push({
					path: '/pages/common/article/article',
					query: {
						id: item.id,
						users_id: item.users_id
					},
				})
			},
			followUser(index) {
				this.$http.put('/Focus/Record', {
					userId: this[`${this.tabsIndex==0?'article':this.tabsIndex==1?'articleHot':'articleNew'}`][
						index
					].users_id
				}).then(res => {
					switch (res.data.code) {
						case 200:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							this[`${this.tabsIndex==0?'article':this.tabsIndex==1?'articleHot':'articleNew'}`][
								index
							].expand.focus = !this[
								`${this.tabsIndex==0?'article':this.tabsIndex==1?'articleHot':'articleNew'}`][
								index
							].expand.focus
							break;
						case 400:
							uni.showToast({
								icon: 'none',
								title: res.data.msg
							});
							break;
						default:
							// 处理其他情况
							break;
					}
				});
			},
			goUserProfile(item) {
				this.$Router.push({
					path: '/pages/common/userProfile/userProfile',
					query: {
						id: item.users_id
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.swiper {
		height: 100%;
	}
</style>