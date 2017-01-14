Vue.component('vue-item', {
  props: ['jsondata'],
  template: '#item-template'
})

Vue.component('vue-outer', {
  props: ['jsondata', 'isend'],
  template: '#outer-template'
})

Vue.component('vue-expand', {
  props: [],
  template: '#expand-template'
})

Vue.component('vue-val', {
  props: ['field', 'val', 'isend'],
  template: '#val-template'
})


Vue.use({
  install: function (Vue, options) {
    
    // 判断数据类型
    Vue.prototype.getTyp = function (val) {
      return toString.call(val).split(']')[0].split(' ')[1]
    }

    // 判断是否是对象或者数组，以对下级进行渲染
    Vue.prototype.isObjectArr = function (val) {
      return ['Object', 'Array'].indexOf(this.getTyp(val)) > -1
    }

    // 折叠
    Vue.prototype.fold = function ($event) {
      var target = Vue.prototype.expandTarget($event)
      target.siblings('svg').show()
      target.hide().parent().siblings('.expand-view').hide()
      target.parent().siblings('.fold-view').show()
      
    }
     // 展开
    Vue.prototype.expand = function ($event) {
      var target = Vue.prototype.expandTarget($event)
      target.siblings('svg').show()
      target.hide().parent().siblings('.expand-view').show()
      target.parent().siblings('.fold-view').hide()
    }

    //获取展开折叠的target
    Vue.prototype.expandTarget = function ($event) {
      switch($event.target.tagName.toLowerCase()) {
        case 'use':
          return $($event.target).parent()
        case 'label':
          return $($event.target).closest('.fold-view').siblings('.expand-wraper').find('.icon-square-plus').first()
        default:
          return $($event.target)
      }
    }

    // 格式化值
    Vue.prototype.formatVal = function (val) { 
      switch(Vue.prototype.getTyp(val)) {
        case 'String':
          return '"' + val + '"'
          break

        case 'Null': 
          return 'null'
          break

        default:
          return val

      }
    }

    // 判断值是否是链接
    Vue.prototype.isaLink = function (val) {
      return /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(val)
    }

    // 计算对象的长度
    Vue.prototype.objLength = function (obj) { 
      return Object.keys(obj).length
    }
  }
})


var initJson =  '{\n\
    "name": "Json on",\n\
    "description": "一个简洁的在线 JSON 查看器",\n\
    "open source": {\n\
      "是否开源": true,\n\
      "GitHub": "https://github.com/bimohxh/avjson"\n\
    }\n\
}'


var App = new Vue({
  el: '#app',
  data: {
    view: 'code',
    jsoncon: initJson,
    jsonhtml: JSON.parse(initJson),
    error: {}
  },
  methods: {

    // 全部展开
    expandAll: function () {
      $('.icon-square-min').show()
      $('.icon-square-plus').hide()
      $('.expand-view').show()
      $('.fold-view').hide()
    },

    // 全部折叠
    collapseAll: function () {
      $('.icon-square-min').hide()
      $('.icon-square-plus').show()
      $('.expand-view').hide()
      $('.fold-view').show()
    },

    // 压缩
    compress: function () {
     App.view = 'compress'
     App.jsonhtml = Parse.compress(App.jsoncon)
    }
  },
  watch: {
    jsoncon: function () {
      App.view = 'code'
      try {
        App.jsonhtml = jsonlint.parse(this.jsoncon)
      } catch (ex) {
        App.view = 'error'
        App.error = {
          msg: ex.message
        }
      }
    }
  }
})