# you-touchbox

对nvue做了些兼容处理，但还不成熟，nvue下transition失效的问题无法解决，请大佬指点（现阶段不建议在nvue中使用本插件，问题多多，nvue中遇到问题可以反馈，我尽力实现需求）

***所有像素值参数都不要传单位**

***一切计算以`可使用窗口高度`为基准**，即`uni.getSystemInfoSync().windowHeight`

***上拉框盒子高度默认为`可使用窗口高度`**，可以通过`customStyle`属性设置

**属性**

| 参数           | 说明                     | 类型                               | 默认值                                                       |
| -------------- | :----------------------- | ---------------------------------- | ------------------------------------------------------------ |
| customStyle    | 自定义样式               | String\|Object                     | -<br />border-radius若要兼容nvue请使用<br />border-top-left-radius，border-top-right-radius分开写 |
| initTop        | 初始top值                | Number\|String\|<br />'min'\|'max' | 默认值为'min'，<br />initTop为首次加载时，上拉框显示的高度，<br />所以一般设置为与maxTop或minTop一致，<br />参数可传百分比，像素值，字符串'min''max'<br />max为与maxTop一致，<br />min为与minTop一致<br />0~1为百分比，大于1为像素值，<br />百分比以可使用窗口高度计算，<br />像素值为可使用窗口的顶部位置往下偏移 |
| maxTop         | 最高top值                | Numbe\|String                      | 默认为可使用窗口的顶部位置，<br />参数可传百分比和像素值，<br />0~1为百分比，大于1为像素值，<br />百分比以可使用窗口高度计算，<br />像素值为可使用窗口的顶部位置往下偏移 |
| minTop         | 最低top值                | Number\|String                     | 默认为可用区域50%，<br />参数可传百分比和像素值，<br />0~1为百分比，大于1为像素值，<br />百分比以可使用窗口高度计算，<br />像素值为可使用窗口的底部位置往上的偏移 |
| auto           | 是否开启自动复位         | Boolean                            | true，开启时松手会自动复位到最高最低状态                     |
| limit          | 是否开启滑动范围限制     | Boolean                            | true，开启时滑动范围不可超过maxTop和minTop                   |
| customSafeArea | 自定义navbar、tabbar高度 | Object                             | 如果使用了自定义navbar和tabbar，可以手动设置安全区域         |
| h5Top          | customSafeArea的属性     | Number                             | -<br />H5的自定义navbar高度                                  |
| mpTop          | customSafeArea的属性     | Number\|'menuBtn'                  | -<br />小程序的自定义navbar高度<br />特殊值字符串menuBtn的效果为微信小程序原生navbar的高度<br /> |
| bottom         | customSafeArea的属性     | Number                             | -<br />自定义tabbar高度<br />因为H5和小程序的navbar高度不一致才需要分开配置，而tabbar一般是一致的，所以不区分 |
| zIndex         | 上拉框z-index            | Number\|String                     | 100                                                          |
| disable        | 禁用滑动                 | Boolean                            | false                                                        |

**事件**

| 事件名         | 说明                                                         | 参数                             |
| -------------- | ------------------------------------------------------------ | -------------------------------- |
| get-end-detail | 获取滑动结束时top信息对象<br />maxTop：最大高度top<br />minTop：最小高度top<br />curTop：当前高度top | Function({maxTop,minTop,curTop}) |

**方法**

此方法要通过ref手动改调用

| 方法名    | 说明                                                         | 参数              |
| --------- | ------------------------------------------------------------ | ----------------- |
| setBottom | 手动设置上拉框高度，参数值传百分比和像素值（不带单位），<br />百分比以可使用窗口高度计算，<br />像素值为可使用窗口的底部位置往上的偏移 | Function（value） |

