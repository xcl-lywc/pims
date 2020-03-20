<template>
  <div id="wapper">
    <div class="header-wrap">
      <img class="header-img" alt="天津市和平区" src="../assets/img/org-logo.png" @click="$router.push({name: 'Dashboard'})">
      <!--  -->
      <h1 class="header-title"><span class="fl main-title">国家机关事务管理局</span><span class="fl sub-title">内审信息平台</span></h1>
      <!--用户管理 -->
      <div class="user-management">
        <!--下拉菜单 -->
        <el-dropdown class="fl" trigger="click"  @command="handleCommand">
          <span class="el-dropdown-link username-style">
            {{userData.name}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  command="personal">个人资料</el-dropdown-item>
            <el-dropdown-item  command="avatar">修改头像</el-dropdown-item>
            <!-- <el-dropdown-item  command="help">帮助</el-dropdown-item> -->
            <el-dropdown-item  command="exchange">切换导航</el-dropdown-item>
            <el-dropdown-item  command="resetPass">重置密码</el-dropdown-item>
            <el-dropdown-item divided  command="signOutLogin">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--用户头像 -->
        <!-- <img :src="'/pics'+picture" alt="头像" class="head-image fl" @click="modifyAvatar" :onerror="headimg"/> -->
        <!-- <img src="../assets/img/a8.jpg" alt="" class="head-image fl" @click="modifyAvatar"/> -->
      </div>
      <!-- 按钮组-->
      <div class="button-group">
        <!-- <el-tooltip effect="light" content="按住'Ctrl键' 同时滑动 '鼠标滚轮' 可缩放页面至合适的比例" class="zoom-wrap">
          <i class="fa fa-arrows zoom-icon"></i>
        </el-tooltip> -->
        <el-tooltip effect="light" content="搜索" placement="top-end">
          <el-badge :value="null">
            <i class="fa fa-search nav-icon-button no-badge" @click="goToProjectQuery"></i>
          </el-badge>
        </el-tooltip>
        <el-tooltip effect="light" content="未读消息" placement="top-end">
          <el-badge :value="$store.state.noticeNum">
            <i class="fa fa-bell nav-icon-button" @click="skipNoticesList"></i>
          </el-badge>
        </el-tooltip>
        <!-- <el-tooltip effect="light" content="搜索" placement="top-start" class="btn-spacing">
          <el-button icon="fa fa-search" circle></el-button>
        </el-tooltip> -->
        <!-- <el-tooltip effect="light" content="" placement="" class="btn-spacing lh10">
          <el-badge :value="null" class="item badge-item">
            <i class="change-icon" @click="changeMode"></i>
          </el-badge>
        </el-tooltip> -->
        <!-- <el-tooltip effect="light" content="" placement="" class="btn-spacing">
          <v-fullscreen></v-fullscreen>
        </el-tooltip> -->
      </div>
<!--       <el-slider
        class="slider"
        :min="80"
        :max="120"
        v-model="sliderValue"
        :step="5"
        @change="changeView">
      </el-slider> -->
    </div>
    <!-- 和平区信息化项目管理办法 -->
    <el-dialog
      title="和平区信息化项目管理办法"
      :visible.sync="methodDialogVisible"
      width="60%"
      center>
      <div style="height: 500px;">和平区信息化项目管理办法的内容......</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="methodDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="methodDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 个人资料弹框 -->
    <el-dialog
      title="个人资料"
      :visible.sync="personalDialogVisible"
      width="40%"
      center>
      <!-- <ul class="contents-personal">
        <li><span class="fl item">账户：</span><span class="fl">{{userAccount}}</span></li>
        <li><span class="fl item">用户名：</span><span class="fl">{{userName}}</span></li>
        <li><span class="fl item">用户权限：</span></li>
        <li v-for="item in resourceDtos" class="marl80"><span class="fl item"></span><span class="fl">{{item.name}}</span></li>
      </ul> -->
      <el-row>
        <el-col :span="6">
          <img v-if="userData.picture" width="120" height="120" :src="`/pics/${userData.picture}`" :onerror="headimg"/>
          <img v-if="!userData.picture" width="120" height="120" src="../assets/img/a8.jpg"/>
        </el-col>
        <el-col :span="18">
          <p class="mar10">账号：{{userData.account}}</p>
          <p class="mar10">姓名：{{userData.name}}</p>
          <p class="mar10">手机：{{userData.phoneNum}}</p>
          <p class="mar10">邮箱：{{userData.email}}</p>
        </el-col>
        <el-col :span="24">
          <p class="mar10">角色列表：<span v-for="(item, index) in rolesList">{{item.name}}，</span></p>
        </el-col>
        <el-col :span="24">
          <h4 class="block-title"></h4>
          <p class="fr mar10">
            <!-- <el-button type="" icon="fa fa-unlock-alt" @click="resetPassClick()"> 重置密码</el-button> -->
          </p>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog
      title="修改密码"
      :visible.sync="resetPassDialogVisible"
      :close-on-click-modal="false"
      width="500px">
      <div v-loading="loading">
        <el-form class="demo-ruleForm add-task-left" :rules="resetPasswordFormRules" ref="resetPasswordForm" :model="resetPasswordForm" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="旧密码：" prop="password">
              <el-input type="text" v-model="resetPasswordForm.password"></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPassword" >
              <el-input type="password" v-model="resetPasswordForm.newPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="confirmPassword" >
              <el-input type="password" v-model="resetPasswordForm.confirmPassword" autocomplete="off"></el-input>
            </el-form-item>
            </el-col> 
        </el-row> 
      </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="loading" @click="resetPassDialogVisible = false">取 消</el-button>
        <el-button :disabled="loading" type="primary" @click="resetPassword('resetPasswordForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 帮助弹框 -->
    <el-dialog
      title="帮助"
      :visible.sync="helpDialogVisible"
      width="20%">
      <div style="height: 300px;">帮助的内容......</div>
    </el-dialog>
    <!-- 修改头像 -->
    <el-dialog
      title="修改头像"
      :visible.sync="avaterDialogVisible"
      width="40%"
      center>
      <el-upload
        class="avatar-uploader"
        :action="`${common.basePath}/file/-1/uplode`"
        :headers="myHeaders"
        :show-file-list="false"
        :auto-upload="true"
        multiple
        :limit="1"
        :before-upload="beforeUpload"
        :on-success="uploadSuccessFileAvater"
        :on-error="uploadErrorFileAvater">
        <img v-if="imageUrl" :src="imageUrl_" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="avaterDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modify">修改头像</el-button>
      </span>
    </el-dialog>
    
    <el-row v-loading="loading" class="content-wrap-row">
      <!-- 水平方向导航 -->
      <transition name="el-zoom-in-center">
        <nav-bar v-if="navMode == 'horizontal'" :showType="navMode" :resource="resourceList"></nav-bar>
      </transition>
      <!-- 竖直方向导航 -->
      <el-col v-if="navMode == 'vertical'" :span="3" class="nav-bar-vertical nav-bg">
        <!-- 通过时间来触发刷新 -->
        <nav-bar :showType="navMode" :resource="resourceList"></nav-bar>
      </el-col>
      <!-- 页面主体 -->
      <el-col :span="navMode == 'vertical' ? 21 : 24" :class="{'content-vertical': navMode == 'vertical'}">
        <div class="content-wrap" :class="{'vertical-box': navMode == 'vertical', 'horizontal-box': navMode == 'horizontal'}">
          <router-view></router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import NavBar from "../components/NavBar.vue"
  import fullscreen from './FullScreen'
  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须是6位以上!'));
        } else {
          if (this.resetPasswordForm.confirmPassword !== '') {
            this.$refs.resetPasswordForm.validateField('confirmPassword');
          }
          callback();
        }
      };
      let validatePass2 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.resetPasswordForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else if (value.length < 6) {
          callback(new Error('密码长度必须是6位以上!'));
        } else {
          callback();
        }
      };
      return {
        resetPassDialogVisible: false,
        methodDialogVisible: false,
        personalDialogVisible:false,
        helpDialogVisible:false,
        avaterDialogVisible:false,
        loading:       false,
        navMode:       "vertical",
        activeIndex:   '1',
        activeIndex2:  '1',
        dialogVisible: false,
        resourceList:  [],
        rolesList: [], //所有角色列表
        noticesTotal:null,
        userData:JSON.parse(sessionStorage.getItem("userData")), 
        resourceDtos:JSON.parse(sessionStorage.getItem("userData")).resourceDtos,
        picture:JSON.parse(sessionStorage.getItem("userData")).picture,
        headimg: 'this.src="' + require('../assets/img/a8.jpg') + '"',//默认头像
        myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
        imageUrl:"",
        imageUrl_:"",
        aId:JSON.parse(sessionStorage.getItem("userData")).id,
        sliderValue: 100,
        resetPasswordForm: {
          confirmPassword:  null,
          oldPassword:      null,
          password:      null,
        },
        resetPasswordFormRules: {
          password: [
            { required: true, message: '请输入旧密码'}
          ],
          newPassword: [
            { required: true, message: '请输入新密码'},
            { validator: validatePass, trigger: 'blur' }
          ],
          confirmPassword: [
            { required: true, message: '请再次输入密码'},
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        timeInterval: null,
      };
    },
    components: {
      "nav-bar": NavBar,
      'v-fullscreen':fullscreen
    },
    watch: {
      "navMode": {
        handler (newV, oldV) {

        },
        deep: true,
      },
      // "$store.state.time": { //vuex中计数变化
      //   handler (newV, oldV) {
      //     if(newV == 0) { //计时结束 重新初始化webSocket, 并重设时间
      //       this.initWebSocket()
      //     }
      //   },
      //   deep: true,
      // }
    },
    created () {
      let trees = JSON.parse(sessionStorage.getItem("userData")).resourceDtos
      if(JSON.parse(sessionStorage.getItem("userData")).resourceDtos) {
        trees.forEach((item, index) => {
          this.traverseTree(trees[index]);
        })
      }
      this.disapperDialog();
    },
    mounted(){
      if(this.$route.path != "/login" && this.$store.state.interval) { // 在非登录页初始进行一次查询
        this.initWebSocket()
      }
      this.getNoticesTotal();
      this.getQueryRolesListByUserId();
    },
    methods: {
      /*
       * 根据用户Id查询角色列表
       */
      getQueryRolesListByUserId(userId){ 
        this.axios.get(`${this.common.basePath}/user_roles/roles`, { params: {'userId': this.userData.id} } ).then( (response) => {
            this.rolesList = response.data.data;
          }).catch( (error) => {
            reject(error);
          }); 
        
       },
      /*
       * 重置密码
       */
      resetPassword(formName){
        let self = this;
        self.$refs[formName].validate((valid) => {
          if (valid) {
            this.axios.post(`${this.common.basePath}/hr_users/pwd/update`, this.resetPasswordForm).then( (response) => {
               this.$message.success(response.data.meta.message);  
            }).catch( (error) => {
              this.$message.error(error);            
            });
            this.resetPassDialogVisible = false;
          } else {
            return false;
          }
        });
      },
      /*
       * 显示重置密码弹框
       */
      resetPassClick(){
        this.resetPassDialogVisible = true;
        this.resetPasswordForm.userId = this.userData.id;
        this.$refs.resetPasswordForm ? this.$refs.resetPasswordForm.resetFields() : '';
      },
      /* 
       修改头像
       */
      modifyAvatar(){
        this.avaterDialogVisible = true
      },
      modify(){
        var formData = {
          id:this.aId,
          picture:this.imageUrl,
        }
        this.axios.patch(`${this.common.basePath}/hr_users/user/update/${this.aId}`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            this.$message.success(response.data.meta.message, 20);
            this.avaterDialogVisible = false;
          }else{
            this.$message.error(response.data.meta.message, 20);
          }
        }).catch( (error) => {
          this.$message.error(error,20);
        });
      },
      /* 
        上传文件 ---限制用户上传的图片格式和大小
       */
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';

        if (!isJPG&&!isPNG) {
          this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
        }
        return isJPG || isPNG;
      },
      /* 
        上传文件 ---文件上传成功时
      */
      uploadSuccessFileAvater(res,file) {
        console.log(res)
        
        this.imageUrl = res.data.path;
        this.imageUrl_ = URL.createObjectURL(file.raw);
      },
      /* 
        上传文件 ---文件上传失败时
      */
      uploadErrorFileAvater(err, file, fileList) {
        this.$message.error('上传失败!!', 20);
        // this.uploadForm.file1 = []
      },
      
      /* 
       如果从通知列表返回首页，则不出现该弹框
       */
      disapperDialog(){
        if(sessionStorage.getItem("noticeIds")=="1"){
          this.methodDialogVisible = false;
          sessionStorage.removeItem("noticeIds")
        }
      },
      
      /**
       * 递归获取资源权限list
       * @return {[type]} [description]
       */
      traverseTree (node) {
        if (!node) {
          return;
        }
        this.resourceList.push(node);

        if (node.childrens && node.childrens.length > 0) {
          var i = 0;
          for (i = 0; i < node.childrens.length; i++) {
            this.traverseTree(node.childrens[i]);
          }
        }
      },
      changeMode () {
        this.loading = true
        if(this.navMode == "horizontal") {
          this.navMode = "vertical"
					this.loading = false
					sessionStorage.setItem("navMode","vertical")
					if(document.getElementsByClassName("top-fixed")){
						document.getElementsByClassName("top-fixed")[0].style.width = "calc(100% - 268px)";
					}
        } else {
          this.navMode = "horizontal"
					this.loading = false
					sessionStorage.setItem("navMode","horizontal")
					if(document.getElementsByClassName("top-fixed")){
						document.getElementsByClassName("top-fixed")[0].style.width = "calc(100% - 28px)";
					}
        }
        // this.$message.success(this.navMode == "horizontal" ? "切换为横向导航" : "已切换为纵向导航")
        setTimeout (() => {
          this.loading = false
        }, 500)
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      },
      
      /* 
        设置 个人资料 帮助 退出登录
       */
      handleCommand(command) {
        if(command == 'setUp'){ //跳转设置页面
          this.$router.push({path: '/system_management/dictionary'});
        }else if(command == 'signOutLogin'){ //退出登录
          this.loginOut();
        }
        else if(command == 'personal'){ //个人资料
          this.personalDialogVisible = true;
        }
        else if(command == 'help'){ //帮助
          this.helpDialogVisible = true;
        }else if(command == 'resetPass'){ //重置密码
          this.resetPassClick();
        } else if (command == 'avatar') {
          this.modifyAvatar()
        } else if (command == 'exchange') {
          this.changeMode()
        }
      },
      
      /* 
       退出登录请求
       */
      loginOut(){
        let self = this
        var formData = JSON.parse(sessionStorage.getItem("token"));
        self.axios.post(`${self.common.basePath}/login/out`,formData)
        self.common.startInterval = false
        sessionStorage.removeItem("userData")
        sessionStorage.removeItem("token")
				sessionStorage.removeItem("navMode")
        self.$router.push({name: 'loginIndex'});
        self.$store.state.ws.close() //关闭webSocket
      },
      /* 
       进入相关通知列表
       */
      skipNoticesList() {
        this.$router.push({path: '/notices'});
      },
      goToProjectQuery () {
        let routerName = "ProjectReporting"
        this.resourceDtos.forEach((item, index) => {
          if(item.id == 29) {
            item.childrens.forEach((itemInner, indexInner) => {
              if(itemInner.id == 33 && itemInner.isSelect) {
                routerName = 'ProjectDirector'
              }
            })
          }
        })
        this.$router.push({name: routerName});
      },
      /* 
       获取相关通知的total
       */
      getNoticesTotal(){
        let self = this
        window.nl = this
        //初始化ws, 注册方法
        if(JSON.parse(sessionStorage.getItem('userData')).token) {
          self.timeInterval = setInterval(() => {
            if(self.$route.path != "/login" && self.$store.state.interval) { // 在非登录页反复调用
              self.initWebSocket()
            }
          }, 59000)
        } else {
          Vue.$message.error("获取未读信息失败")
        }
      },
      /**
       * 初始化ws, 注册方法
       * @return {[type]} [description]
       */
      initWebSocket () {
        let self = this
        console.log(self.$store.state.interval)
        if(JSON.parse(sessionStorage.getItem('userData'))) {
        let url = `ws://${self.common.webSocketSever}/userNotice/${JSON.parse(sessionStorage.getItem('userData')).token}`
          self.$store.state.ws = new WebSocket(url)
          self.$store.state.ws.onopen = function(evt) {
            console.log(evt)
            // self.$store.commit("changeInterval", true) // 连接成功, 开启反复刷新
            // self.$store.commit("change", (evt.data == "0" ? null : evt.data))
          };
          self.$store.state.ws.onmessage = function(evt) {
            self.$store.commit("changeInterval", true) // 连接成功, 开启反复刷新
            self.$store.commit("change", (evt.data == "0" ? null : evt.data))
            console.log(evt.data);
          };
          self.$store.state.ws.onclose = function(evt) { //被关闭时, 延迟重连, 关闭反复刷新
            self.$store.commit("changeInterval", false)
            clearInterval(self.timeInterval) // 清空已有的计时
            setTimeout(() => {
              self.initWebSocket()
            }, 59000)
          }
          self.$store.state.ws.onerror = function(evt) {
            if(self.$route.path != "/login" && self.$store.state.interval) {
              self.$message.error("与服务器断开连接, 刷新页面重试")
              console.log(evt);
            }
          }
        } else {
           console.log("当前用户并未登录")
        }
      },
      _noticesParams(){
        return {
          params: {
            
          }
        }
      },
      /**
       * 修改屏幕缩放比例
       * @return {[type]} [description]
       */
      changeView (value) {
        //this.$message.success(value.toString())
        //console.log(value)
        var myDiv = document.getElementsByTagName("html")[0];

        myDiv.style.zoom = `${ value / 100 }`;
        // var myDiv = document.getElementsByClassName("content-wrap-row")[0]
        myDiv.style.height = `${ 100 * (value / 100) }%`;
      },
    },
    
  }
</script>

<style scoped lang="less">
  #wapper {
    background-color: rgb(255,255,255);
    background-size: 800px;
    background-position: -200px;
  }
  .header-wrap {
    z-index: 99;
    position: relative;
    height: 60px;
    background: rgba(30,144,240,1);
		background-image: url(../assets/img/bg-img/a1.jpg);
		background-attachment: fixed;
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center bottom;
    box-shadow: 0 -2px 10px #e4e4e4;
    .slider {
      width: 200px;
      float: right;
      margin-top: 12px;
    }
    .header-img, .header-title{
      display: inline-block;
      margin: 0;
      height: 60px;
      vertical-align: middle;
      line-height: 60px;
      .main-title{
        color: rgb(255,255,255);
        font-size: 24px;
        font-weight: normal;
      }
      .sub-title{
        margin-left: 8px;
        color: rgb(255,255,255);
        font-size: 16px;
        line-height: 70px;
        font-weight: normal;
      }
    }
    .header-img {
      height: 46px;
      margin: 0 0 0 15px
    }
    .header-img:hover {
      cursor: pointer;
    }
    .button-group {
      display: inline-block;
      float: right;
      margin-top: 18px;
      margin-right: 18px;
      .nav-icon-button {
        color: #fff!important;
        font-size: 26px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
    .user-management {
      float: right;
      height: 60px;
      margin-right: 10px;
      line-height: 60px;
      .username-style{
        color: #fff;
        font-size: 16px;
        font-weight: 400;
      }
      .username-style:before{
        content:"|";
        margin-right: 8px;
      }
      .icon-button {
        padding: 5px;
        color: #fff;
        background: #555;
        border-color: #555!important;
      }
      .el-dropdown {
        margin-right: 10px;
        cursor: pointer;
        height: 30px;
      }
      .head-image{
        width: 40px;
        height: 40px;
        box-sizing: border-box;
        border-radius: 50%;
        border: 2px solid #fff;
        margin-top: 10px;
      }
    }
    /*.zoom-icon {
      position: relative;
      top: -5px;
      margin-right: 5px;
      font-size: 28px;
      color: #fff;
    }*/
  }
  .el-popper[x-placement^="bottom"]{
    top: 60px !important;
    margin-top: 12px;
  }
  .content-wrap {
    width: 100%;
    overflow-y: auto;
    background: #eff1f4;
  }
  .nav-bar-vertical {
    width: 240px!important;
  }
	.nav-bg{
		background: url(../assets/img/bg-img/a2.jpg);
		background-position: center center;
		background-repeat: no-repeat;
		// background-size: 100% 100%;
		background-size: cover;
	}
  .content-vertical {
    width: calc( 100% - 240px )!important;
  }
  .content-wrap.vertical-box {
    height: calc( 100vh - 60px );
  }
  .content-wrap.horizontal-box {
    height: calc( 100vh - 128px );
  }
  .badge-item {
    vertical-align: inherit;
  }
  .notice-icon {
    display: inline-block;
    height: 32px;
    width: 32px;
    background: url("../assets/img/nav_消息icon.png")
  }
  .change-icon {
    display: inline-block;
    height: 32px;
    width: 32px;
    background: url("../assets/img/nav_切换icon.png")
  }

  /*按钮组之间的间距*/
  .btn-spacing{
    margin: 0 10px;
  }
  .lh0{
    line-height: 0;
  }
  /* 上传头像样式 */
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
/*  .el-dropdown-menu.el-popper {
    top: 60px!important;
  }*/
  /* 个人资料的style */
  .contents-personal{
    overflow: hidden;
  }
  .contents-personal li{
    height: 30px;
    line-height: 30px;
  }
  .contents-personal li .item{
    width: 66px;
    text-align: right;
  }
</style>
