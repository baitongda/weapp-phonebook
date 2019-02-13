//index.js
const db = wx.cloud.database({
  env: 'group-415945'
})
const category = db.collection('category')
const user = db.collection('user')
const call_record = db.collection('call-record')
const _ = db.command
var app = getApp()
Page({
  data: {
    users:[],
    categories: [],
    activeCategoryId: 0,
    selectCurrent: 0,
    searchInput: '',
  },
  onLoad: function () {
    var that = this;

    // 获取所有类别
    category.get().then(res => {
      var categories = [{
        _id: '',
        categoryId: 0,
        name: "全部"
      }];
      for (var i = 0; i < res.data.length; i++) {
        categories.push(res.data[i]);
      }
      that.setData({
        categories: categories,
        activeCategoryId: 0,
      })
    })
      //获取全部用户
    this.getGoodsList(0);
  },
  tabClick: function (e) {
    this.setData({
      activeCategoryId: e.currentTarget.id,
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  getGoodsList: function (categoryId) {
    if (categoryId == 0){
      if(this.data.searchInput!=''){
        //获取全部用户,模糊查询
        user.where({
          name: db.RegExp({
            regexp: this.data.searchInput,
            options: 'i',
          })
        })
          .get({
            success(res) {
              let users = [];
              for (var i = 0; i < res.data.length; i++) {
                users.push(res.data[i]);
              }
              that.setData({
                users: users
              })
            }
          })
      }else{
        //获取全部用户
      wx.cloud.callFunction({
        name: 'getuserlist',
        data: {
          categoryId: 0
        },
        success(res) {
          that.setData({
            users: res.result.data
          })
        }
      })
        //获取全部用户，逆序
        // user.orderBy('_id','desc')
        //   .get({
        //     success(res) {
        //       let users = [];
        //       for (var i = 0; i < res.data.length; i++) {
        //         users.push(res.data[i]);
        //       }
        //       that.setData({
        //         users: users
        //       })
        //     }
        //   })
      }
    }else{
      if (this.data.searchInput == '') {
        wx.cloud.callFunction({
          // 要调用的云函数名称
          name: 'getuserlist',
          // 传递给云函数的参数
          data: {
            categoryId: categoryId
          },
          success(res) {
            that.setData({
              users: res.result.data
            })
          }
        })

        // 获取指定类别用户
        // user.where({
        //   categoryId: categoryId
        // })
        //   .get({
        //     success(res) {
        //       let users = [];
        //       for (var i = 0; i < res.data.length; i++) {
        //         users.push(res.data[i]);
        //       }
        //       that.setData({
        //         users: users
        //       })
        //     }
        //   })
      } else {
        // 获取指定类别用户、模糊查询
        user.where({
          categoryId: categoryId,
          name: db.RegExp({
            regexp: this.data.searchInput,
            options: 'i',
          })
        })
          .get({
            success(res) {
              let users = [];
              for (var i = 0; i < res.data.length; i++) {
                users.push(res.data[i]);
              }
              that.setData({
                users: users
              })
            }
          })
      }
    }
    var that = this;
  },

  listenerSearchInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })

  },
  toSearch: function () {
    this.getGoodsList(this.data.activeCategoryId);
  },
  onReachBottom: function () {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(this.data.activeCategoryId, true)
  },
  onPullDownRefresh: function () {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId)
  },
  callphone: function (event) {
    call_record.add({
      data: {
        phone: event.currentTarget.dataset.phone,
        name: event.currentTarget.dataset.name,
      },
      success(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    }),
    wx.makePhoneCall({
      phoneNumber: String(event.currentTarget.dataset.phone)
    })
  },
  onShareAppMessage: function (options) {
    　　var that = this;
    　　// 设置菜单中的转发按钮触发转发事件时的转发内容
    　　var shareObj = {
      　　　　title: "城东商业圈",        // 默认是小程序的名称(可以写slogan等)
      　　　　path: '/pages/index/index',        // 默认是当前页面，必须是以‘/’开头的完整路径
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
})