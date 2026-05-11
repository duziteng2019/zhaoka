// pages/cropEdit/cropEdit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    previewUrl: '',
    containerWidth: 0,
    containerHeight: 0,
    cropWidth: 300,
    cropHeight: 400,
    cropLeft: 100,
    cropTop: 100,
    scale: 1,
    rotation: 0,
    selectedSpec: null,
    croppedImageId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const editMode = options.editMode === 'true';
    
    if (editMode) {
      // 编辑模式：从历史记录获取数据
      const editHistory = wx.getStorageSync('editHistory');
      if (!editHistory) {
        wx.navigateBack();
        return;
      }
      
      // 保存历史记录ID
      this.setData({
        previewUrl: editHistory.originalImageId,
        selectedSpec: {
          name: editHistory.specName,
          width: editHistory.specWidth,
          height: editHistory.specHeight
        },
        editHistoryId: editHistory._id
      });
    } else {
      // 正常模式：从上传和规格选择获取数据
      const uploadedImage = wx.getStorageSync('uploadedImage');
      if (!uploadedImage) {
        wx.navigateTo({
          url: '/pages/upload/upload'
        });
        return;
      }

      const selectedSpec = wx.getStorageSync('selectedSpec');
      if (!selectedSpec) {
        wx.navigateTo({
          url: '/pages/sizeSelect/sizeSelect'
        });
        return;
      }

      this.setData({
        previewUrl: uploadedImage.previewUrl,
        selectedSpec: selectedSpec
      });
    }

    // 根据规格计算裁剪框尺寸
    this.calculateCropSize(this.data.selectedSpec);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // 获取屏幕尺寸，初始化容器大小
    const systemInfo = wx.getSystemInfoSync();
    const containerWidth = systemInfo.windowWidth - 40;
    const containerHeight = 600;

    this.setData({
      containerWidth: containerWidth,
      containerHeight: containerHeight,
      cropLeft: (containerWidth - this.data.cropWidth) / 2,
      cropTop: (containerHeight - this.data.cropHeight) / 2
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '证件照制作',
      path: '/pages/home/home'
    }
  },

  /**
   * 根据规格计算裁剪框尺寸
   */
  calculateCropSize(spec) {
    // 根据规格的像素尺寸计算裁剪框大小
    // 这里使用一个比例系数，确保裁剪框在容器内合适显示
    const ratio = 0.8;
    const containerWidth = wx.getSystemInfoSync().windowWidth - 40;
    const aspectRatio = spec.pixel_width / spec.pixel_height;
    
    let cropWidth, cropHeight;
    if (aspectRatio > 1) {
      // 横版
      cropWidth = containerWidth * ratio;
      cropHeight = cropWidth / aspectRatio;
    } else {
      // 竖版
      cropHeight = 400;
      cropWidth = cropHeight * aspectRatio;
    }

    this.setData({
      cropWidth: Math.round(cropWidth),
      cropHeight: Math.round(cropHeight)
    });
  },

  /**
   * 旋转图片
   */
  rotateImage() {
    this.setData({
      rotation: (this.data.rotation + 90) % 360
    });
  },

  /**
   * 设置当前工具
   */
  setTool(e) {
    const tool = e.currentTarget.dataset.tool;
    this.setData({ currentTool: tool });
    
    if (tool === 'auto') {
      this.autoCrop();
    }
  },

  /**
   * 重置编辑
   */
  resetEdit() {
    this.setData({
      scale: 1,
      rotation: 0,
      currentTool: 'auto'
    });
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 下一步 - 执行裁剪并跳转
   */
  goNext() {
    this.executeCrop();
  },

  /**
   * 放大图片
   */
  zoomIn() {
    this.setData({
      scale: this.data.scale + 0.1
    });
  },

  /**
   * 缩小图片
   */
  zoomOut() {
    if (this.data.scale > 0.5) {
      this.setData({
        scale: this.data.scale - 0.1
      });
    }
  },

  /**
   * AI自动裁剪
   */
  autoCrop() {
    wx.showLoading({
      title: 'AI裁剪中...'
    });

    // 调用faceDetect云函数进行人脸检测
    wx.cloud.callFunction({
      name: 'faceDetect',
      data: {
        imageUrl: this.data.previewUrl
      },
      success: res => {
        console.log('人脸检测成功', res);
        // 根据人脸位置自动调整裁剪框
        this.autoAdjustCropBox(res.result.data.faceRect);
        wx.hideLoading();
      },
      fail: err => {
        console.error('人脸检测失败', err);
        wx.hideLoading();
        wx.showToast({
          title: 'AI裁剪失败，请手动调整',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 根据人脸位置自动调整裁剪框
   */
  autoAdjustCropBox(faceRect) {
    if (!faceRect) {
      return;
    }

    // 这里可以根据人脸位置和大小自动调整裁剪框位置
    // 简单实现：将人脸居中
    const centerX = faceRect.x + faceRect.width / 2;
    const centerY = faceRect.y + faceRect.height / 2;
    
    const cropLeft = centerX - this.data.cropWidth / 2;
    const cropTop = centerY - this.data.cropHeight / 2;

    this.setData({
      cropLeft: cropLeft,
      cropTop: cropTop
    });
  },

  /**
   * 执行裁剪
   */
  executeCrop() {
    wx.showLoading({
      title: '裁剪中...'
    });

    // 获取上传的图片信息
    const uploadedImage = wx.getStorageSync('uploadedImage');
    if (!uploadedImage) {
      wx.hideLoading();
      wx.showToast({
        title: '图片信息丢失，请重新上传',
        icon: 'none'
      });
      return;
    }

    // 调用cropImage云函数进行裁剪
    wx.cloud.callFunction({
      name: 'cropImage',
      data: {
        imageUrl: uploadedImage.previewUrl,
        cropParams: {
          x: this.data.cropLeft,
          y: this.data.cropTop,
          width: this.data.cropWidth,
          height: this.data.cropHeight,
          scale: this.data.scale,
          rotation: this.data.rotation
        },
        specId: this.data.selectedSpec.id
      },
      success: res => {
        console.log('裁剪成功', res);
        this.setData({
          croppedImageId: res.result.data.croppedImageId
        });
        wx.hideLoading();
        this.goToBackgroundReplace();
      },
      fail: err => {
        console.error('裁剪失败', err);
        wx.hideLoading();
        wx.showToast({
          title: '裁剪失败，请重试',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 跳转到背景替换页面
   */
  goToBackgroundReplace() {
    // 保存裁剪后的图片信息
    wx.setStorageSync('croppedImage', {
      previewUrl: this.data.previewUrl,
      croppedImageId: this.data.croppedImageId,
      cropParams: {
        x: this.data.cropLeft,
        y: this.data.cropTop,
        width: this.data.cropWidth,
        height: this.data.cropHeight,
        scale: this.data.scale,
        rotation: this.data.rotation
      }
    });

    // 跳转到背景替换页面
    wx.navigateTo({
      url: '/pages/backgroundReplace/backgroundReplace'
    });
  }
})