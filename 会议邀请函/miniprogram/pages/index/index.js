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
    guestPhoto:[],
    guestPhotos:[],
    activityPhoto:[],
    guestTemp:[],
    activityTemp:[],
    site:null,
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
    ]
  },

  onLoad: function() {
    that=this;
    },

  themeInput(e){
    that.setData({
      theme:e.detail.value
    })
  },
  contentInput(e){
    that.setData({
      activity:e.detail.value
    })
  },
  guestInput(e){
    if(e.currentTarget.dataset.id==0){
      that.setData({
      'guest[0].guestinfo' : e.detail.value      
    })
    }else if(e.currentTarget.dataset.id==1){
      that.setData({
        'guest[1].guestinfo' : e.detail.value      
      })
    }else if(e.currentTarget.dataset.id==2){
      that.setData({
        'guest[2].guestinfo' : e.detail.value      
      })
    }
    
  },
  siteInput(e){
    that.setData({
      'map.site':e.detail.value
    })
  },
  chooseActivity(e){
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {    

        that.setData({
          activityPhoto:res.tempFilePaths
        }) 
        }
    })
  },
  chooseGuest(e){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {    
        that.setData({
          guestPhotos:that.data.guestPhotos.concat(res.tempFilePaths),
          guestPhoto:res.tempFilePaths,
          
         
        })        
      }
    }) 
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
  removingGuest(e){
    wx.showModal({
      title: '提示',
      content:'是否要删除图片',
      success(res){
        if (res.confirm) {
          let url=e.currentTarget.dataset.url;
          let urls=that.data.guestPhotos;
          urls.splice(urls.indexOf(url),1);
          that.setData({
            guestPhotos:urls
          })
          }
      }
    })
  },
  removingAct(e){
    wx.showModal({
      title: '提示',
      content:'是否要删除图片',
      success(res){
        if (res.confirm) {
          let url=e.currentTarget.dataset.url;
          let urls=that.data.activityPhoto;
          urls.splice(urls.indexOf(url),1);
          that.setData({
            activityPhoto:urls
          })
          }
      }
    })
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.detail.markerId)
  },
  controltap(e) {
    console.log(e.detail.controlId)
  },
  selectedClick: function() {
    // 设置权限
    wx.openSetting({
      success: function (res) {
        console.log(res);
 
        // 选择位置
        wx.chooseLocation({
          success: function (res) {
            console.log(res);
 
            // 打开位置
            wx.openLocation({
              latitude: res.latitude,
              longitude: res.longitude,
              name: res.name,
              address: res.address,
            }),
            that.setData({
              'markers.latitude':res.latitude,
              'markers.longitude':res.longitude,
              'map.longitude':res.longitude,
              'map.latitude':res.latitude
            })
            
          },
        })       
      }      
    })
       
  },
  async uploadimg(){
    let result=[];
    let result2=[];
    let fileres=await wx.cloud.uploadFile({
      cloudPath: `activituImage/${Math.floor(Math.random(0,1)*1000)}.png`, // 上传至云端的路径
      filePath: that.data.activityPhoto[0], // 小程序临时文件路径     
    })
    success:res=>{
      that.setData({
        guestTemp:that.data.guestTemp.concat(res.fileID),       
      })
      that.setData({
        guestPhotos:that.data.guestTemp
      })
    }
    
    result.push(fileres);
    let fileres2=null;
    for(let item of that.data.guestPhotos){
      fileres2=await wx.cloud.uploadFile({
        cloudPath: `guestImage/${Math.floor(Math.random(0,1)*1000)}.png`, // 上传至云端的路径
        filePath: item, // 小程序临时文件路径
      })
      success:res=>{
        that.setData({
          activityTemp:that.data.activityTemp.concat(res.fileID)
        })
        that.setData({
          activityPhoto:that.data.activityTemp
        })
      }
      result2.push(fileres2);
    }
    that.additem(result,result2);

    
  },
  additem(photo,photo2){
    const albumPhotos= photo.map(photo=>photo.fileID);
    const albumPhotos2= photo2.map(photo2=>photo2.fileID);
    console.log(albumPhotos)
    db.collection('Guest').add({
      data:{
        theme:that.data.theme,
        activity:that.data.activity,
        activityPhoto:albumPhotos,
        guest:that.data.guest,
        guestPhotos:albumPhotos2,
        map:that.data.map,
        date:new Date()
      },
      success(res){
        wx.showToast({
          title: 'success',
          icon:this.success
        })
        wx.navigateTo({
        url: '/pages/invitationList/invitationList',
      })
      }     
    })
  },
  done(e){
    that.uploadimg();
  }
})