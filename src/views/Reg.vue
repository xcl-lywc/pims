<template>
  <!--注册 -->
  <div class="login-bg">
	  <div class="login-box">
		  <div class="box-title">
			  天津市和平区信息化项目监督管理平台
		  </div>
		  <div class="box-form">
			  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">
					<el-form-item label="用户名" prop="name" label-width="80px">
						<el-input type="text" v-model="ruleForm.name" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="账户" prop="account" label-width="80px">
						<el-input type="text" v-model="ruleForm.account" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="密码" prop="password" label-width="80px">
						<el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email" label-width="80px">
						<el-input type="text" v-model="ruleForm.email" auto-complete="off"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="" @click="submitForm('ruleForm')" class="fl btn-w">注册</el-button>
						<el-button type="" @click="resetForm('ruleForm')" class="fr btn-w">重置</el-button>
					</el-form-item>
			  </el-form>
		  </div>
		  <div class="box-footer" @click="skipLogin">
			  已有账号，直接登录<i class="el-icon-d-arrow-right"></i>
		  </div>
	  </div>
  </div>
</template>

<script>
	import qs    from "qs"; //需要传表单时, 引用此包
	import { request } from '../plugins/request.js'
  export default {
    data() {
      return {
				headImg:"../assets/img/a8.jpg",
				ruleForm: {
					"account":    null,
					"curStatus":  0,
					"email":      null,
					"name":       null,
					"password":   null,
					"picture":    null,
				},
				rules: {
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
					],
					email: [
						{ required: false, message: '请输入邮箱地址', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
					],
					name: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
					],
					account: [
						{ required: true, message: '请输入账户', trigger: 'blur' },
					],
				},
			};
		},
    methods: {
			//注册按钮
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.reg();
					} else {
						this.$message.warning('您的信息还未填写完整!!!', 20);
						return false;
					}
				});
			},
			//注册
			reg(){
				this.axios.post(`${this.common.basePath}/hr_users/register`,qs.parse(this.ruleForm)).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						this.$router.push({name: 'LoginIndex'});
					}else{
						this.$message.error(response.data.meta.message, 20);
						this.$router.push({path: '/reg'});
					}
				}).catch( (error) => {
					this.$message.error(error,20);
					this.$router.push({path: '/reg'});
				});
			},
			//重置按钮
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//跳转登录页面
			skipLogin(){
				this.$router.push({name: 'LoginIndex'});
			},
		},
		mounted () {
			var self = this;
			//按下回车键登录
			document.onkeydown = function(event){ 
				if(event.keyCode === 13){
						self.reg();
				}
			};
		},
	}
</script>

<style scoped lang="less">

</style>