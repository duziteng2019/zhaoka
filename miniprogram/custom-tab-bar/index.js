// custom-tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    selected: 0,
    color: "#2D3436",
    selectedColor: "#FF6B35",
    list: [
      {
        pagePath: "/pages/home/home",
        text: "首页",
        iconType: "home"
      },
      {
        pagePath: "/pages/history/history",
        text: "历史",
        iconType: "success"
      },
      {
        pagePath: "/pages/profile/profile",
        text: "我的",
        iconType: "person"
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset;
      const path = data.path;
      const index = data.index;
      
      // 更新选中状态
      this.setData({
        selected: index
      });
      
      // 执行页面跳转
      wx.switchTab({
        url: path
      });
    },
    
    // 更新选中状态
    updateSelectedIndex(index) {
      this.setData({
        selected: index
      });
    }
  },

  attached() {
    // 设置初始选中状态
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const currentPath = currentPage.route;
    const list = this.data.list;
    for (let i = 0; i < list.length; i++) {
      if (list[i].pagePath === `/${currentPath}`) {
        this.setData({
          selected: i
        });
        break;
      }
    }
  }
})
