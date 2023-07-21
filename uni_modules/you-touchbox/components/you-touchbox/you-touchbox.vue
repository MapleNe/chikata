<template>
  <view class="you-touchbox" :class="{touchend:isTouchEnd}" @touchstart="onTouchStart"
    @touchmove.stop.prevent="onTouchmove" @touchend="onTouchend"
    :style="{top: top + distance + 'px',zIndex,height:windowHeight+'px'}">
    <view class="you-touchbox-content" :style="customStyle" @click.stop.prevent>
      <view class="touch-line-box">
        <view class="touch-line"></view>
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
  /**
   * @author youbolin @2022-3-2 18:29
   */
  export default {
    name: "you-touchbox",
    props: {
      // 禁用滑动
      disable: {
        type: Boolean,
        default: false
      },
      zIndex: {
        type: [Number, String],
        default: 100
      },
      // 自定义样式
      customStyle: [String, Object],
      // 自定义安全区域
      customSafeArea: {
        type: Object,
        default () {
          return {
            h5Top: null,
            wxTop: null,
            bottom: null
          }
        }
      },
      // 最高top
      maxTop: {
        type: [Number, String],
        default: 1
      },
      // 最低top
      minTop: {
        type: [Number, String],
        default: 0.5
      },
      // 初始top
      initTop: {
        type: [Number, String],
        default: 'min'
      },
      // 自动复位
      auto: {
        type: Boolean,
        default: true
      },
      // 最高最低限制
      limit: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        windowHeight: null, // 可使用区域高度
        windowTop: null,
        touchStartY: null, // 开始滑动时的Y轴坐标
        top: null, // 上拉框top
        max: null, // maxTop
        min: null, // minTop
        distance: 0, // 滑动距离
        isTouchEnd: false, // 是否滑动结束Flag
        boundary: null, // 规定盒子复位为最大或最小状态的分界线，默认为最大最小状态的中间
        startTime: null, // 开始滑动时间
      };
    },
    mounted() {
      let {
        windowHeight, // 可使用窗口高度
        windowTop // 可使用窗口的顶部位置
      } = uni.getSystemInfoSync()
      this.windowHeight = windowHeight
      this.windowTop = windowTop
      let {
        h5Top,
        wxTop,
        bottom
      } = this.customSafeArea
      // H5自定义安全区域
      // #ifndef MP
      if (h5Top) {
        this.windowHeight -= h5Top
        windowTop += h5Top
      }
      // #endif
      if (bottom) this.windowHeight -= bottom
      // 上拉框最大高度top
      if (this.maxTop <= 1) this.max = this.windowHeight * (1 - +this.maxTop)
      else this.max = +this.maxTop
      // 上拉框最小高度top
      if (this.minTop <= 1) this.min = this.windowHeight * (1 - +this.minTop)
      else this.min = this.windowHeight - (+this.minTop)
      // 初始的上拉框top
      if (['min', 'max'].includes(this.initTop)) this.top = this.initTop === 'min' ? this.min : this.max
      else if (this.initTop <= 1) this.top = this.windowHeight * (1 - +this.initTop)
      else this.top = +this.initTop
      // 微信自定义安全区域
      // #ifdef MP
      if (wxTop) {
        this.max += wxTop === 'menuBtn' ? uni.getMenuButtonBoundingClientRect().bottom + 10 : wxTop
        this.top += wxTop
      }
      // #endif
      // H5自定义安全区域
      // #ifndef MP
      this.max += windowTop
      this.min += windowTop
      this.top += windowTop
      // #endif
      this.boundary = (this.max + this.min) / 2 // 规定盒子复位为最大或最小状态的分界线，默认为最大最小状态的中间
    },
    methods: {
      setBottom(value) {
        if (this.auto) this.isTouchEnd = true
        if (value <= 1) this.top = this.windowHeight * (1 - +value)
        else this.top = (this.windowHeight - +value)
        // #ifndef MP
        this.top += this.windowTop
        // #endif
      },
      onTouchStart(e) {
        if (this.disable) return
        this.isTouchEnd = false // 关闭滑动结束Flag，作用为是否开启上拉框的过渡效果
        // #ifndef APP-NVUE
        this.top = e.currentTarget.offsetTop // 手指触碰到上拉框时，将上拉框top设置为上拉框当前的top
        // #endif
        // #ifdef APP-NVUE
        this.touchStartY = e.touches[0].screenY // 此次滑动开始时的Y轴坐标
        // #endif
        // #ifndef APP-NVUE
        this.touchStartY = e.touches[0].clientY // 此次滑动开始时的Y轴坐标
        // #endif
        this.startTime = Date.now() // 设置滑动开始时间
      },
      onTouchmove(e) {
        if (this.disable) return
        // #ifdef APP-NVUE
        let distance = e.touches[0].screenY - this.touchStartY // 滑动的距离 
        // #endif
        // #ifndef APP-NVUE
        let distance = e.touches[0].clientY - this.touchStartY // 滑动的距离 
        // #endif
        if (this.limit) { // 是否开启高度限制
          let nowTop = this.top + distance // 此次滑动的上拉框top值
          if (nowTop < this.max || nowTop > this.min) {
            // 如果滑动时上拉框top小于最大高度top就让上拉框top等于最大高度top
            // 如果滑动时上拉框top大于最小高度top就让上拉框top等于最小高度top
            this.top = nowTop < this.max ? this.max : this.min
            this.distance = 0 // 滑动距离归零
            // #ifdef APP-NVUE
            this.touchStartY = e.touches[0].screenY // 此次滑动开始时的Y轴坐标
            // #endif
            // #ifndef APP-NVUE
            this.touchStartY = e.touches[0].clientY // 此次滑动开始时的Y轴坐标
            // #endif
            return
          }
        }
        this.distance = distance // 更新滑动距离
      },
      onTouchend(e) {
        if (this.disable) return
        this.top = this.top + this.distance // 更新上拉框top
        if (this.auto) { // 是否开启自动复位
          this.isTouchEnd = true // 开启滑动结束Flag
          let time = (Date.now() - this.startTime) / 1000 // 滑动时间为 滑动结束时间 - 滑动开始时间
          let speed = Math.abs(this.distance) / time // 滑动速度为 滑动距离/滑动时间
          if (speed > 800) { // 如果速度大于800px/秒
            this.top = this.distance > 0 ? this.min : this.max // 根据滑动方向设置top的值
            // return this.distance = 0 // 滑动距离归零
          } else {

            if (this.top < this.boundary) this.top = this.max // 如果上拉框top小于分界线就让上拉框top等于最大高度top
            else this.top = this.min // 如果上拉框top大于分界线就让上拉框top等于最小高度top
          }
        }
        // 滑动结束时top信息
        this.$emit('get-end-detail', {
          minTop: this.min,
          maxTop: this.max,
          curTop: this.top
        })
        this.distance = 0 // 滑动距离归零
      }
    }
  }
</script>

<style lang="scss" scoped>
  .you-touchbox {
    position: fixed;
    left: 0;
    right: 0;
  }

  .touchend {
    transition-property: top;
    transition-duration: .6s;
  }

  .you-touchbox-content {
    /* #ifdef APP-NVUE */
    flex: 1;
    /* #endif */
    /* #ifndef APP-NVUE */
    height: 100%;
    /* #endif */
    background-color: #fff;
  }


  .touch-line-box {
    padding: 5px 0 10px;
    /* #ifdef APP-NVUE */
    align-items: center;
    /* #endif */
  }

  .touch-line {
    /* #ifndef APP-NVUE */
    margin: 0 auto;
    /* #endif */
    width: 45px;
    height: 5px;
    border-radius: 25px;
    background: rgba(51, 51, 51, 0.2);
  }
</style>
