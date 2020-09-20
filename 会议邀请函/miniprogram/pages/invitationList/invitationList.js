// pages/invitationList/invitationList.js
const app = getApp();
const db=wx.cloud.database();
const _= db.command;
var that=null;
Page({

  data: {
    title:"会议主题",
    content:"会议内容"
  },

  onLoad(){
    that=this;
  },
  onShow(){
    that.init();  
  },
  toAdd(){
    wx.navigateTo({
      url: '../index/index',
    })
    },
  todetail(e){
  
    db.collection('detail').add({
      data: {
        theme:e.currentTarget.dataset.item.theme,
        activity:e.currentTarget.dataset.item.activity,
        activityPhoto:e.currentTarget.dataset.item.activityPhoto,
        guest:e.currentTarget.dataset.item.guest,
        guestPhotos:e.currentTarget.dataset.item.guestPhotos,
        map:e.currentTarget.dataset.item.map,
      },
      success: function(res) {
        console.log(res)
      }
    })

    wx.navigateTo({
      url: '../receive/receive',
    })
  },
  init(){
    db.collection('Guest').get()
    .then(result=>{
      
      let items = result.data.map(item =>{
        item.date=app.nowdate(item.date);
        return item;
      })
      
      that.setData({
        items:items
      })    
    })
    
    console.log(that.data.items)
  }

})