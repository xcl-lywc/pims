<template>
  <!--登录 -->
  <div>
    <div class="background-wrap">
      <div class="login-background">
        <!-- <vue-particles
          color="#fff"
          :particleOpacity="0.7"
          :particlesNumber="80"
          shapeType="circle"
          :particleSize="4"
          linesColor="#fff"
          :linesWidth="1"
          :lineLinked="true"
          :lineOpacity="0.4"
          :linesDistance="150"
          :moveSpeed="3"
          :hoverEffect="true"
          hoverMode="grab"
          :clickEffect="true"
          clickMode="push">
        </vue-particles> -->
      </div>
    </div>
    <div>
      <img id="title-img" src="../assets/img/login-max.png" alt="1">
      <div id="title-text">
        <p class="main-title">国家机关事务管理局</p>
        <p class="sub-title">National Government Offices Administration</p>
        <p class="min-title">内审信息平台</p>
      </div>
    </div>
      <div class="login-box">
        <div class="box-title">
          欢迎登录
        </div>
        <div class="box-form">
          <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0">
            <el-form-item prop="username">
              <el-input type="text" v-model="ruleForm.username" auto-complete="off" palcehoder="请输入用户名">
                <i slot="prefix" class="el-input__icon fa fa-user"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="ruleForm.password" auto-complete="off" palcehoder="请输入密码">
                <i slot="prefix" class="el-input__icon fa fa-lock"></i>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="checked" class="fl" @change="rememberClick"><span class="text-dark-blue">记住密码</span></el-checkbox>
              <el-button type="text" class="text-dark-blue fr">忘记密码</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :loading="buttonLoading" @click="submitForm('ruleForm')" class="fill-width" type="primary">
              {{buttonLoading ? '登录中' : '登录'}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button :disabled="buttonLoading" @click="resetForm('ruleForm')" class="fill-width">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
  </div>
</template>

<script>
  import qs    from "qs"; //需要传表单时, 引用此包
  import { request } from '../plugins/request.js'
  import VueParticles from 'vue-particles/src/vue-particles/vue-particles.vue'
  export default {
    data() {
      var validatepassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      var validateusername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      return {
        checked: false,
        buttonLoading: false,
        ruleForm: {
          password: '',
          username: '',
        },
        rules: {
          password: [
            { validator: validatepassword, trigger: 'blur' }
          ],
          username: [
            { validator: validateusername, trigger: 'blur' }
          ],
        },
      };
    },
    components: {
      "vue-particles": VueParticles
    },
    created () {
      let self = this
      self.common.startInterval = false
    },
    mounted () {
      var self = this;
      //self.initCanvas()
      self._remember();
      //按下回车键登录
			document.onkeydown = function(event){ 
				if(event.keyCode === 13){
						self.login();
				}
			};
    },
    methods: {
      initCanvas () {
        var canvas = document.getElementById('canvas');

        var ctx = canvas.getContext("2d");
        ctx.fillStyle="#FF0000";
        ctx.fillRect(0,0,150,75);
      },
      //登录按钮
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //alert('submit!');
            this.login();
          } else {
            //alert('您还未填写账号或密码!!!');
            this.$message.warning('您还未填写账号或密码!!!', 20);
            return false;
          }
        });
      },
      //登录
      login: function() {
        var self = this;
        self.buttonLoading = true;
        self.axios.post(self.common.basePath + '/login/in', qs.stringify(this.ruleForm)).then(function (response){
            let responseData = response.data;
            if(responseData.meta.code === 0){
                //登录成功存储用户数据
                //sessionStorage.setItem('userData',JSON.stringify(self._screenData(responseData.data)));
                //登录成功储存token
                self.axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
                //session中存储获取用户信息
                sessionStorage.setItem('userData',JSON.stringify(response.data.data));
                //session中存储用于图片和文件上传
                sessionStorage.setItem('token',JSON.stringify(response.data.data.token));
                //session存储assignee
                sessionStorage.setItem("assignee",response.data.data.id)
                //self.$message.success(responseData.meta.message, 20);
                // self.$message.success({message: '登录成功...正在跳转!!!',duration: 1000});
                setTimeout(function(){
                    
                    self.goToPage(responseData.data)
                },1010);

                // 获取字典数据，并session存储dictionary
                self._getDictionary().then( (response) => {
                  response.data.data ? sessionStorage.setItem('controlTable', JSON.stringify(response.data.data.rows)) : '';
                }).catch((error) => {
                  self.$message.error('查询字典失败!!!');
                })
            }else{
              self.buttonLoading = false;
              self.$message.error(responseData.meta.message);
            }
        }).catch(function (error) {
            self.$message.error('登录失败!!!');
            self.buttonLoading = false;
        });
      },
      goToPage (data) {
        let self  = this
        let targetRole = data.roleIds[0] || null
        if(targetRole == 6 || targetRole == 5) {
          switch(targetRole) {
            case 5: //网信办
              self.$router.push({name: 'Dashboard'});
              break;
            case 6: //公安局
              self.$router.push({name: 'Dashboard'});
              break
          }
        } else {
          self.$router.push({name: 'Dashboard'});
        }
        
      },
      /*
       * 查询字典数据
       */
      _getDictionary(){
        return new Promise( (resolve, reject) => {
          this.axios.get(this.common.basePath + '/contrast/choice/list', '').then(function (response){
            resolve(response)
          }).catch(function (error) {
            reject(error)
          });
        });
      },
      //重置按钮
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      //点击按钮记住账号密码
      rememberClick() {
        console.log(this.checked)
        this.checked? localStorage.setItem("remember",'true') : localStorage.setItem("remember",'false')
        localStorage.setItem("username", this.ruleForm.username);
        localStorage.setItem("password", this.ruleForm.password);
      },
      //记住账号密码
      _remember: function() {
          if(localStorage.getItem("remember") === "true") { 
              if(localStorage.getItem("username") && localStorage.getItem("password")) {
                  this.ruleForm.username = localStorage.getItem("username");
                  this.ruleForm.password = localStorage.getItem("password");
                  this.checked = true;
              }
          }
      },
      //跳转注册页面
      skipReg(){
        this.$router.push({path: '/reg'});
      },
    },
  }
</script>

<style scoped lang="less">
  @darkBlue: #114275;
  @keyframes scaleBackground {
    0% {transform:scale(1, 1);background-image: url("../assets/img/1.jpg");}
    50% {transform:scale(1.08, 1.08);background-image: url("../assets/img/2.jpg");}
    100% {transform:scale(1, 1);background-image: url("../assets/img/1.jpg");}
  }
  .background-wrap {
    overflow: hidden;
    .login-background {
      width: 100vw;
      height: 100vh;
      background-position: center;
      background-size:cover;
      animation: scaleBackground 15s infinite;
      transition-timing-function: ease-in-out;
    }
  }
  #title-img {
    position: absolute;
    // width: 28vw;
    width:115px;
    left: 10vw;
    top: 50%;
    margin-top: -158px;
  }
  #title-text {
    position: absolute;
    width: 28vw;
    left: calc(10vw + 135px);
    top: calc(50% + 2px);
    margin-top: -158px;
    color:#fff;
    .main-title{
      font-weight:900;
      font-size:36px;
    }
    .sub-title{
      margin-top:5px;
      color:#cbc8c8;
      font-size:15px;
    }
    .min-title{
      margin-top:5px;
      width:320px;
      text-align:right;
      font-size:18px;
      font-weight:900;
    }
  }
  .text-dark-blue {
    color: @darkBlue;
  }
  .login-box {
    position: absolute;
    top: 50%;
    right: 15vw;
    width: 500px;
    overflow: hidden;
    margin: -243px auto 0 auto;
    padding: 41px 62px;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: 0 0 10px #ebeef5;
    color: #333;
    opacity: 0.9;
    -webkit-box-sizing: border-box;
    background-color: #d4d4d496;
    border-radius: 10px;
    box-shadow: 5px 5px 10px #171717b8;
    .box-title{
      color: @darkBlue;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      padding-bottom: 20px;
      margin-bottom: 20px;
      border-bottom: 1px solid @darkBlue;
    }
    .box-form{
      padding: 0 15px;
      .head-img{
        margin-left: 35%;
        border-radius: 50%;
        width: 80px;
      }
    }
    .box-footer{
      cursor: pointer;
      color: royalblue;
      text-align: center;
      font-size: 14px;
    }
  }
</style>
<style lang="less">
  #particles-js{
    width: 100vw;
    height: 99.5vh;
    position: absolute;
    top: 0;
  }
  #canvas {
    position: absolute;
    width: 100vw;
    height: 100vh;
  }
  .login-box {
    .el-form-item__content {
      padding-left: 0;
    }
  }
</style>