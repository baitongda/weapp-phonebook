const db = wx.cloud.database({
  env: 'group-415945'
})
const user = db.collection('user')
Page({
    data: {
      categoryId: '',
      name: '',
      phone:'',
      introduce:'',
      radioItems: [
        { name: '餐饮', value: '1'},
        { name: '商超', value: '2' },
        { name: '家居建材', value: '3' },
        { name: '手机电脑', value: '4' },
        { name: '便民服务', value: '5' },
        { name: '汽车服务', value: '6' },
        { name: '母婴健康', value: '7' },
        { name: '美容美发', value: '8' }
      ],
      textLen:0,
      maxTextLen:50,
    },
    getWords(e) {
      let page = this;
      // 设置最大字符串长度(为-1时,则不限制)
      let maxTextLen = page.data.maxTextLen;
      // 文本长度
      let textLen = e.detail.value.length;

      page.setData({
        maxTextLen: maxTextLen,
        textLen: textLen,
        introduce:e.detail.value,
      });
    },
    bindPhoneInput: function (e) {
        this.setData({
          phone: e.detail.value,
        });
    },
    bindNameInput: function (e) {
    this.setData({
      name: e.detail.value,
    });
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value);

    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == e.detail.value;
    }

    this.setData({
      radioItems: radioItems,
      categoryId: e.detail.value
    });
  },
  ok: function (event) {
    var that = this;
    if (that.data.name == '') {
      wx.showModal({
        title: '提示!',
        content: '名字为空',
      })
    } else if (that.data.phone == '') {
      wx.showModal({
        title: '提示!',
        content: '联系方式为空',
      })
    } else if (that.data.introduce == '') {
      wx.showModal({
        title: '提示!',
        content: '商家介绍为空',
      })
    } else if (that.data.phone.length != 11 && that.data.phone.length != 8 && that.data.phone.length != 12 && that.data.phone.length != 13) {
      wx.showModal({
        title: '提示!',
        content: '请确认手机/电话号码位数是否正确',
      })
    } else if (that.data.categoryId == '') {
      wx.showModal({
        title: '提示!',
        content: '请选择类别',
      })
    } else {
      wx.showLoading({
        title: '创建中...',
      })
      user.add({
        data:{
          categoryId: that.data.categoryId,
          phone: that.data.phone,
          name: that.data.name,
          introduce:that.data.introduce,
        },
        success(res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
          console.log(res)
          wx.hideLoading();
          wx.navigateTo({
            url: 'msg_success'
          })
        }
      })
    }
  },
  onShareAppMessage: function (options) {
    var that = this;
    // 设置菜单中的转发按钮触发转发事件时的转发内容
    var shareObj = {
      title: "城东商业圈",        // 默认是小程序的名称(可以写slogan等)
      path: '/pages/input/input',        // 默认是当前页面，必须是以‘/’开头的完整路径
      imgUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
    };
    　　// 返回shareObj
    　　return shareObj;
  }
});