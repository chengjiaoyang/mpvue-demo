<template>
  <div class="container">
    <div id="msg">这里放页面内容</div>
    <input type="text"
           v-model="msg">
    <input type="text">
  </div>
</template>
<script>
import { delayFunc } from '@/utils/tools'
// 页面记录
import { pagelogs } from '@/utils/logs'
export default {
  data () {
    return {
      msg: '这里是消息-demoBlock',
      pageConfig: {
        page: 1,
        size: 10
      },
      data: {},
      isSending: false
    }
  },
  // 使用的 vue 组件
  components: {},
  watch: {
    msg (val, oldVal) {
      console.log('watchmsg', val, oldVal)
    }
  },
  computed: {},
  // 页面中的方法
  methods: {
    // 获取页面信息
    getPageData: function () {
      let _this = this
      // 已经发送请求之后停止处理
      if (_this.isSending) {
        console.info('请求中')
        return
      }
      console.log(_this)
      // 标记发送
      _this.isSending = true

      // 延迟后恢复
      delayFunc(() => {
        _this.isSending = false
      })
    }
  },
  // VUE 钩子 常用
  // 页面初始化钩子 可以加载本地配置
  beforeCreate () {
    console.log('demopage-beforeCreate', this.msg)
  },
  // 页面创建时使用的钩子 可以开始处理页面中的异步请求数据
  created () {
    console.log('demopage-created', this.msg)
  },
  // 页面节点挂载之前 对请求数据进行处理
  beforeMount () {
    console.log('demopage-beforeMount', this.msg)
  },
  // 页面节点挂载
  mounted () {
    console.log('demopage-mounted', this.msg)
  },
  // 页面跟新 之前 数据变更预处理
  beforeUpdate () {
    console.log('demopage-beforeUpdate', this.msg)
  },
  // 页面数据更新之后  数据变更处理
  updated () {
    console.log('demopage-updated', this.msg)
  },
  // 原生钩子
  // 监听页面加载
  onLoad (options) {
    this.pageConfig = Object.assign({}, this.pageConfig, options)
    console.log('demopage-onLoad', this.msg)
  },
  // 监听页面显示
  onShow () {
    console.log('demopage-onShow', this.msg)
    // 一般默认获取
    this.getPageData()
    pagelogs()
  },
  // 监听页面初次渲染完成
  onReady () {
    console.log('demopage-onReady', this.msg)
  },
  // 监听页面隐藏
  onHide () {
    console.log('demopage-onHide', this.msg)
    pagelogs(true)
  },
  // 监听页面卸载
  onUnload () {
    console.log('demopage-onUnload', this.msg)
    pagelogs(true)
  },
  // 监听用户下拉动作
  onPullDownRefresh () {
    console.log('demopage-onPullDownRefresh', this.msg)
  },
  // 页面上拉触底事件的处理函数
  onReachBottom () {
    console.log('demopage-onReachBottom', this.msg)
  },
  // 用户点击右上角分享
  onShareAppMessage () {
    console.log('demopage-onShareAppMessage', this.msg)
  },
  // 页面滚动
  onPageScroll () {
    console.log('demopage-onPageScroll', this.msg)
  },
  // 当前是 tab 页时，点击 tab 时触发 （mpvue 0.0.16 支持）
  onTabItemTap () {
    console.log('demopage-onTabItemTap', this.msg)
  }
}
</script>


<style lang="scss">
</style>
