/*********************导航组件***********************/
  Author: Mingzhang.Zhao
  Date:   2018-04-22
/************************************************/
<template>
  <el-menu
    id="nav"
    :class="{'vertical-nav': showType == 'vertical'}"
    :default-active="getActiveIndex()"
    :mode="showType"
    background-color="rgba(255,255,255,0.6)"
		popper-class="popper-class"
    text-color="#1f3140"
    active-text-color="#1e90f0"
    @select="navClicked"
		unique-opened
		collapse-transition
		style="">
    <el-submenu v-for="item in navArray" :key="item.path" :index="item.path" :show-timeout="10" :hide-timeout="10">
      <template slot="title"><i class="nav-icon" :class="item.navIcon"></i>{{ item.navName }}</template>
      <el-menu-item v-for="itemInner in item.children" :key="item.path + '/' +itemInner.path" :index="item.path + '/' +itemInner.path">
        {{ itemInner.navName }}
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
  import lunar from "../plugins/lunar.js";
  export default {
    data () {
      return {
        navArray:      [],
        activeNav:     null,
        lunarDateText: null,
        noOrg:         window.noOrg,
      }
    },
    props: {
      showType: { // 显示的type类型
        required: true,
        type: String,
        default: "vertical"
      },
      resource: { // 触发刷新的资源
        required: true,
        default: "vertical"
      }
    },
    watch: {
      resource: {
        handler (newV, oldV) {
          this.initNavBar()
        },
        deep: true
      }
    },
    created () {
      this.initNavBar()
      this.lunarDateText = lunar //显示农历日期
    },
    mounted () {
    },
    methods: {
      initNavBar () {
        if(sessionStorage.getItem("userData")) {
          this.buildNavArray()
        } else {
          this.$message.error("当前用户未登录, 请登录")
          this.$router.push({name: "LoginIndex"})
        }
      },
      /**
       * 递归获取资源权限list
       * @return {[type]} [description]
       */
      // traverseTree (node) {
      //   if (!node) {
      //     return;
      //   }

      //   this.resourceList.push(node);

      //   if (node.childrens && node.childrens.length > 0) {
      //       var i = 0;
      //       for (i = 0; i < node.childrens.length; i++) {
      //           this.traverseTree(node.childrens[i]);
      //       }
      //   }
      // },
      /**
       * 根据path处理:index ,用于标记选中
       * @return {String} 当前激活的导航path
       */
      getActiveIndex () {
        // if(this.$route.path.indexOf("article_audit") != -1) {
        //   return "/home/article_audit"
        // } else if (this.$route.path.indexOf("upload_article") != -1) {
        //   return  "/home/upload_article/:id"
        // } else if (this.$route.path == "/home") {
        //   return "/home/"
        // } else {
        //   return this.$route.path
        // }
        return this.$route.path
      },
      /**
       * 点击导航内容回调
       * @param  {String} path      导航路径
       * @param  {Array}  pathArray 导航层级路径path数组
       * @return none
       */
      navClicked (path, pathArray) {
        let target = this
        this.$router.push(path)
        this.activeNav = path
      },
      /**
       * 根据router构造导航数组(最多检测到两级子导航)
       * @return none
       */
      buildNavArray () {
				
        
        let self = this
        let routerArray = JSON.parse(JSON.stringify(this.$router.options.routes))

        self.navArray = []
 
        routerArray.forEach((item, index) => {
          if(item.path != "/" && item.path != "/login" && item.path != "/reg"&& item.path != "/notices") { //过滤登录和首页
            let childrenArray = []
						
            item.children.forEach((itemInner, indexInner) => { //仅添加需要显示在导航中的组件页面
              if(self.checkResource(itemInner)) { // 逐个检查子菜单是否有权限
                childrenArray.push(itemInner)
              }
            })
            item.children = childrenArray
            if(childrenArray.length > 0) { //子菜单添加完成后 再添加父级 子级为空 父级不添加
              self.navArray.push(item)
            }
          }
        })
      },
      checkResource(navItem) {
        let self = this
        let result = false
        self.resource.forEach((item, index) => {
          if((navItem.navName == item.name) && item.isSelect) {
            result =  true
          }
        })
        return result
      },
      handleScroll (target) {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      },
    }
  }
</script>
