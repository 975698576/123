//index.js
const app = getApp()
const db = wx.cloud.database();
var that=null;
Page({
  data: {
    markers: [{
      iconPath: "/img/坐标.png",
      id: 0,
      latitude: 43.832090,
      longitude: 87.593313,
      width: 30,
      height: 30
    }],
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color:"#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '/img/坐标.png',
      position: {
        left: 0,
        top: 300 - 50,
        width: 50,
        height: 50
      },
      clickable: true
    }],
    guestPhotos:[],
    activityPhoto:[],
    activity:'',
    bankName:'',
    guest:[
      {guestinfo:''},
      {guestinfo:''},
      {guestinfo:''},
    ],
    map:[
      {
        longitude:null,
        latitude:null,
        site:''
      }
    ],
    theme:"",

  },

  onLoad: function() {
    that=this;
    //console.log(app.globalData.item.type)

    
    },
    show(){
      db.collection('detail').get()
      .then(res => {    
        console.log(res.data[res.data.length-1].theme)
        that.setData({
          theme:res.data[res.data.length-1].theme,
          activity:res.data[res.data.length-1].activity,
          activityPhoto:res.data[res.data.length-1].activityPhoto,
          guest:res.data[res.data.length-1].guest,
          guestPhotos:res.data[res.data.length-1].guestPhotos,
          map:res.data[res.data.length-1].map,
          'markers.longitude':res.data[res.data.length-1].map.longitude,
          'markers.latitude':res.data[res.data.length-1].map.latitude
        })
      })
      console.log(that.data.theme)
    },
  onShow:function(){
    that.show();
  },
  previewingGuest(e){
    wx.previewImage({
      urls: that.data.guestPhotos,
      current:e.currentTarget.dataset.url
    })
  },
  previewingAct(e){
    wx.previewImage({
      urls: that.data.activityPhoto,
      current:e.currentTarget.dataset.url
    })
  },
  selectedClick: function(event) {
    
    var lat = Number(event.currentTarget.dataset.latitude);
    var lon = Number(event.currentTarget.dataset.longitude);
    var bankName = event.currentTarget.dataset.bankname;
    that.setData({
      bankName:bankName
    })
    wx.openLocation({
      type: 'gcj02',
      latitude: lat,
      longitude: lon,
      name: bankName,
      scale: 20
    })
       
  },
  onShareAppMessage:function(res){
    if(res.from=='menu'){
        console.log(res.target)
      }
      return {
        title: '火星计划论坛邀请函',
        path: '/pages/receive/receive'
      }
    },

})