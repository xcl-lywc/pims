 <!--
  项目申报表单
  -->
<template>
  <div>
    <h2 class="page-title">项目申报</h2>
    <div class="block-wrap">
      <h4 class="block-title">项目申报表单</h4>
      <div class="block-body">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm base-info" size="middle" enctype="multipart/form-data">
					<el-row :gutter="20">
						<el-col :span="12">
							<div class="grid-content bg-gray">
								<h4 class="base-title">
									<img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
									<span class="fl">基本信息</span>
								</h4>
								<el-form-item label="项目名称："  prop="name">
									<el-input v-model="ruleForm.name" placeholder="请输入项目名称"></el-input>
								</el-form-item>
								<el-form-item label="申报单位：" prop="company">
									<span>{{ ruleForm.company.name }}</span>
								</el-form-item>
								<el-form-item label="项目负责人："  prop="people">
									<el-input v-model="ruleForm.people" placeholder="请输入项目负责人"></el-input>
								</el-form-item>
								<el-form-item label="项目联系人：" prop="contacts">
									<el-input v-model="ruleForm.contacts" placeholder="请输入项目联系人"></el-input>
								</el-form-item>
								<el-form-item label="联系手机："  prop="tel">
									<el-input v-model="ruleForm.tel" placeholder="请输入联系手机"></el-input>
								</el-form-item>
								<el-form-item label="联系固话："  prop="phone">
									<el-input v-model="ruleForm.phone" placeholder="请输入联系固话"></el-input>
								</el-form-item>
								<el-form-item label="邮箱："  prop="mail">
									<el-input v-model="ruleForm.mail" placeholder="请输入邮箱"></el-input>
								</el-form-item>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="grid-content bg-gray">
								<h4 class="base-title">
									<img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
									<span class="fl">项目预算</span>
								</h4>
								<el-form-item label="预算金额："  prop="budgetMoney">
									<el-input v-model="ruleForm.budgetMoney" placeholder="请输入预算金额">
										<template slot="append">万元</template>
									</el-input>
								</el-form-item>
								<el-form-item label="预算来源：" prop="type">
									<el-checkbox-group v-model="ruleForm.type">
										<el-checkbox  
											v-for="typeItem in type" 
											:label="typeItem.id"   
											:key="typeItem.id">
											{{typeItem.name}}
										</el-checkbox>
										<el-checkbox  
											v-for="typeItem in elsetype" 
											:label="typeItem.id"   
											:key="typeItem.id"
											@change="elseCheckboxBoolean">
											{{typeItem.name}}
										</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<el-form-item v-if="elseCheckbox" label="其他资金来源备注：" prop="budgetRemarks" id='mark'>
									<el-input type="textarea" :placeholder="'请输入来源备注'" v-model="ruleForm.budgetRemarks"></el-input>
								</el-form-item>
								<el-form-item label="资金落实情况：" prop="resource">
									<el-radio-group v-model="ruleForm.resource">
										<el-radio label="已落实"></el-radio>
										<el-radio label="未落实"></el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item v-if="ruleForm.resource" label="情况说明：" prop="resourceRemarks">
									<el-input type="textarea"  v-model="ruleForm.resourceRemarks" :placeholder="ruleForm.resource == '已落实' ? '请填写落实请款会议名称或领导签字意见' : '请填写请款过程中或尚未请款，并简要说明'"></el-input>
								</el-form-item>
								<el-form-item v-if="ruleForm.resource" label="落实情况附件材料：" class="is-required" prop="situationFlie">
									<el-upload
										class="upload-demo"
										ref="uploadSituationFlie"
										:action="`${common.basePath}/file/-1/uplode`"
										:headers="myHeaders"
										:auto-upload="true"
										multiple
										:on-success="uploadSuccessSituationFlie"
										:on-error="uploadErrorSituationFlie">
										<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
										<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">允许上传多个文件</span>
									</el-upload>
								</el-form-item>
							</div>
						</el-col>
					</el-row>
					<div class="grid-content bg-gray grid-content_">
						<h4 class="base-title">
							<img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
							<span class="fl">项目情况</span>
						</h4>
						<el-form-item label="项目类型：" prop="projectType">
							<el-checkbox-group v-model="ruleForm.projectType">
								<el-checkbox label="自建项目" @change='self_'></el-checkbox>
								<el-checkbox label="督察督办项目" @change='supervise_'></el-checkbox>
								<el-checkbox label="民心工程项目" @change='heart_'></el-checkbox>
								<el-checkbox label="绩效考核项目" @change='achievements_'></el-checkbox>
								<el-checkbox label="其他项目" @change='else_'></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="自建项目立项依据：" prop="projectSelfBasis" v-if="selfBasis">
							<el-input type="textarea" :placeholder="'请填写备注'" v-model="ruleForm.projectSelfBasis"></el-input>
						</el-form-item>
						<el-form-item label="督察督办项目立项依据：" prop="projectSuperviseBasis" v-if="superviseBasis">
							<el-input type="textarea" :placeholder="'请填写备注'" v-model="ruleForm.projectSuperviseBasis"></el-input>
						</el-form-item>
						<el-form-item label="民心工程项目立项依据：" prop="projectHeartBasis" v-if="heartBasis">
							<el-input type="textarea" :placeholder="'请填写文件依据文号'" v-model="ruleForm.projectHeartBasis"></el-input>
						</el-form-item>
						<el-form-item label="绩效考核项目立项依据：" prop="projectAchievementsBasis" v-if="achievementsBasis">
							<el-input type="textarea" :placeholder="'请填写文件依据文号'" v-model="ruleForm.projectAchievementsBasis"></el-input>
						</el-form-item>
						<el-form-item label="其他项目立项依据：" prop="projectElseBasis" v-if="elseBasis">
							<el-input type="textarea" :placeholder="'请填写文件依据文号'" v-model="ruleForm.projectElseBasis"></el-input>
						</el-form-item>
						<el-form-item label="'三重一大'会议纪要：" class="is-required" prop="file1">
							<el-upload
								class="upload-demo"
								:file-list="ruleForm.file1"
								:before-upload="beforeUpload"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:on-success="uploadSuccessFile1"
								:on-error="uploadErrorFile1">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">请上传关于本项目“三重一大”会议纪要节选(加盖公章, 仅限.jpg/.png格式),允许上传多个文件</span>
							</el-upload>
						</el-form-item>
						<el-form-item label="项目方案：" class="is-required"  prop="file3">
							<el-upload
								class="upload-demo"
								ref="uploadFlie3"
								:before-upload="beforeUploadWord"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="1"
								:on-success="uploadSuccessFile3"
								:on-error="uploadErrorFile3">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">请上传项目建设方案详版(.word格式)</span>
							</el-upload>
						</el-form-item>
						<!-- <el-form-item label="项目方案(简版)：" class="middle is-required" prop="file4">
							<el-upload
								class="upload-demo"
								ref="uploadFlie4"
								:before-upload="beforeUploadWord"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="1"
								:on-success="uploadSuccessFile4"
								:on-error="uploadErrorFile4">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;"></span>
							</el-upload>
						</el-form-item> -->
						<el-form-item label="附件材料：" prop="file6">
							<el-upload
								class="upload-demo"
								ref="uploadFlie6"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:on-success="uploadSuccessFile6"
								:on-error="uploadErrorFile6">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">允许上传多个文件</span>
							</el-upload>
						</el-form-item>
					</div>
					<div class="text-center">
						<el-button type="primary" @click="submitForm('ruleForm')">提交申报</el-button>
						<el-button @click="resetForm('ruleForm')">重填</el-button>
					</div>
        </el-form>
      </div>
    </div>
		<!-- 
		 关于拟报区委网信办专家论证项目须知
		 -->
		<el-dialog
			:visible.sync="msgDialogVisible"
			center
			:close-on-click-modal="false"
			:close-on-press-escape="false"
			:show-close="false">
			<span slot="title" class="dialog-footer">和平区信息化项目建设管理办法<i class="el-icon-close close-button" @click="buttonClicked(false)"></i></span>
			<!-- <iframe :src="`${common.basePath}/project/pdf`" frameborder="0" seamless="seamless" style="min-height: 60vh;width: 100%;"></iframe> -->
			<div class="manage-law-wrap">
				<img src="@/assets/img/manage_law.jpg" alt="和平区信息化项目建设管理办法">
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click.stop="buttonClicked(true)" :disabled="restTime > 0"><span v-show="restTime > 0">({{ restTime }}s)</span>已阅知</el-button>
			</span>
		</el-dialog>
	</div>

</template>

<style scoped lang="less">
	.close-button {
		float: right;
	}
	.close-button:hover {
		cursor: pointer;
	}
	.manage-law-wrap {
		height: 60vh;
		overflow-y: auto;
		img {
			width: 100%;
		}
	}
</style>

<script>
  export default {
    data:function() {
			/**
			* 手机号码校验
			*/
			var phoneNumber = (rule, value, callback) => {
				if (value && (!(/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/).test(value) || !(/^[1-9]\d*$/).test(value) || value.length !== 11)) {
					callback(new Error('手机号码不符合规范'))
				} else {
					callback()
				}
			};
      return {
				heartBasis:false,
				achievementsBasis:false,
				elseBasis:false,
				selfBasis:false,
				superviseBasis:false,
				myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
				msgDialogVisible: true,
				restTime: 20, //计时时长(s)
				uploadForm: {},   // 一个formdata
				type:[
					{
						name:'国家专项资金',
						id:1,
					},
					{
						name:'市财政资金',
						id:2,
					},
					{
						name:'区财政资金',
						id:3,
					},
				],
				elsetype:[
					{
						name:'其他资金',
						id:4,
					},
				],
        ruleForm: {
          name: null,
          company: {
        		id:  JSON.parse(sessionStorage.getItem('userData')).id,
        		name:JSON.parse(sessionStorage.getItem('userData')).name
        	},
          people:null,
					contacts:null,
					tel:null,
					phone:null,
					mail:null,
					budgetMoney:null,
					type: [],
					resource: null,
					resourceRemarks: null,
					budgetRemarks:null,
					projectType:[],
					projectSelfBasis:null,
					projectSuperviseBasis:null,
					projectHeartBasis:null,
					projectAchievementsBasis:null,
					projectElseBasis:null,
					flie1:null,
					file3:null,
					file4:null,
					file6:null,
					situationFlie:null,
        },
        rules: {
          name: [
            { required: true, message: '请输入项目名称', trigger: 'blur' },
          ],
          company: [
            {required: true, message: '请选择申报单位', trigger: 'change' }
          ],
          people: [
          	{ required: true, message: '请选择项目负责人', trigger: 'blur' }
          ],
					contacts: [
						{ required: true, message: '请输入项目联系人', trigger: 'blur' }
					],
					tel: [
						{ required: true, message: '请输入手机号', trigger: 'blur' },
						{validator: phoneNumber, trigger: 'blur'}
					],
					phone: [
						{ required: true, message: '请输入固话', trigger: 'blur' },
					],
					mail: [
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
					],
					budgetMoney:[
						{ required: true, message: '请输入预算金额', trigger: 'blur' },
					],
					type: [
						{ type: 'array', required: true, message: '请至少选择一个预算来源', trigger: 'change' }
					],
					budgetRemarks: [
						{ required: true, message: '请输入内容', trigger: 'blur' }
					],
          resource: [
            { required: true, message: '请选择资金落实情况', trigger: 'change' }
          ],
          resourceRemarks: [
          	{ required: true, message: '请填写情况说明', trigger: 'blur' }
          ],
					projectType: [
            { required: true, message: '请选择至少一个项目类型', trigger: 'change' }
          ],
					projectSelfBasis:[
            { required: true, message: '请输入内容', trigger: 'change' }
          ],
					projectSuperviseBasis:[
						{ required: true, message: '请输入内容', trigger: 'change' }
					],
					projectHeartBasis:[
            { required: true, message: '请输入内容', trigger: 'change' }
          ],
					projectAchievementsBasis:[
            { required: true, message: '请输入内容', trigger: 'change' }
          ],
					projectElseBasis:[
            { required: true, message: '请输入内容', trigger: 'change' }
          ],
        },
        elseCheckbox: false,
      };
    },
    mounted () {
			let self = this
			//开始计时
				window.df = this
			setInterval(() => {
				if(self.restTime > 0) {
					self.restTime -= 1
				} else {
					clearInterval()
				}
			}, 1000)
    },
    watch: {
    	'ruleForm.resource': {
    		handler (newV, oldV) {
    			console.log(newV)
    			this.ruleForm.resourceRemarks = null
    			this.$refs.ruleForm.clearValidate("resourceRemarks")
    		},
    		deep: true
    	}
    },
    methods: {
			
			/* 
				其他资金来源输入框
			*/
			elseCheckboxBoolean(val){
				//设置必填样式
				if(val === true){
					this.elseCheckbox = true
					this.$nextTick(() => {
						document.getElementById('mark').setAttribute('class','is-required el-form-item el-form-item--small');
						sessionStorage.setItem('mark','1')
					})
				}else{
					this.elseCheckbox = false
					this.ruleForm.budgetRemarks = null
					document.getElementById('mark').setAttribute('class','el-form-item el-form-item--small')
					sessionStorage.setItem('mark','2')
				}
				
			},
			
			/* 
			立项依据输入框的显示 
			*/
			self_(val){
				this.selfBasis = val;
				if(val == false){
					this.ruleForm.projectSelfBasis = null;
				}
			},
			supervise_(val){
				this.superviseBasis = val;
				if(val == false){
					this.ruleForm.projectSuperviseBasis = null;
				}
			},
			achievements_(val){
				this.achievementsBasis = val;
				if(val == false){
					this.ruleForm.projectAchievementsBasis = null;
				}
			},
			else_(val){
				this.elseBasis = val;
				if(val == false){
					this.ruleForm.projectElseBasis = null;
				}
			},
			heart_(val){
				this.heartBasis = val;
				if(val == false){
					this.ruleForm.projectHeartBasis = null;
				}
			},
			
			/* 
			提交申报按钮 
			*/ 
      submitForm(formName) {
        //验证
        this.$refs[formName].validate((valid) => {
          if (valid) {
						this.uploadForm.name = this.ruleForm.name
						this.uploadForm.company = this.ruleForm.company.id
						this.uploadForm.companyName = this.ruleForm.company.name
						this.uploadForm.people = this.ruleForm.people
						
						this.uploadForm.contacts = this.ruleForm.contacts
						this.uploadForm.tel = this.ruleForm.tel
						this.uploadForm.phone = this.ruleForm.phone
						
						this.uploadForm.mail = this.ruleForm.mail
						this.uploadForm.budgetMoney = this.ruleForm.budgetMoney
						this.uploadForm.type = this.ruleForm.type
						this.uploadForm.resource = this.ruleForm.resource
						this.uploadForm.resourceRemarks = this.ruleForm.resourceRemarks
						this.uploadForm.projectType = this.ruleForm.projectType
						
						this.uploadForm.projectSelfBasis = this.ruleForm.projectSelfBasis || null
						this.uploadForm.projectSuperviseBasis = this.ruleForm.projectSuperviseBasis || null
						this.uploadForm.projectHeartBasis = this.ruleForm.projectHeartBasis || null
						this.uploadForm.projectAchievementsBasis = this.ruleForm.projectAchievementsBasis || null
						this.uploadForm.projectElseBasis = this.ruleForm.projectElseBasis || null
						this.uploadForm.budgetRemarks = this.ruleForm.budgetRemarks
						this.uploadForm.assignee = sessionStorage.getItem("assignee").toString()
						this.uploadForm.curStatus = 1;
						
						this.uploadForm.file2 = null;
						this.uploadForm.file5 = null;
						
						this.$confirm('请再次确认申报内容，是否申报该项目？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.declare();
						}).catch(() => {        
						});
          } else {
						this.$message.error('申报信息不完整 或 填写错误', 60);
            return false;
          }
        });
      },
			
			/* 
				重置申报信息按钮
			 */ 
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },			
			/* 
				项目须知 ---确定 
			*/
			buttonClicked(type){
				if (type) {
					this.msgDialogVisible = false
				} else {
					this.$router.push({path: '/project_set_up/declare'});
				}
			},
			/* 
			 提交项目申报信息表单
			 */
			declare(){
				// if(sessionStorage.getItem("mark")==='1'){
				// 	if(this.uploadForm.budgetRemarks == ''){
				// 		this.$message.error('预算的 其他来源备注 缺失!!!', 60);
				// 		sessionStorage.removeItem("mark")
				// 		return;
				// 	}
				// }
				if(this.uploadForm.file1 === undefined||this.uploadForm.file3 === undefined||this.uploadForm.situationFlie === undefined){
					if(this.uploadForm.file1 === undefined){
						this.$message.error('上传的 “三重一大”会议纪要 缺失!!!', 60);
						return;
					}
					if(this.uploadForm.file3 === undefined){
						this.$message.error('上传的 项目方案 缺失!!!', 60);
						return;
					}
					if(this.uploadForm.situationFlie === undefined){
						this.$message.error('上传的 落实情况附件材料 缺失!!!', 60);
						return;
					}
					// if(this.uploadForm.file4 === undefined){
					// 	this.$message.error('上传的 项目方案(简版) 缺失!!!', 60);
					// 	return;
					// }
				}
				this.axios.post(`${this.common.basePath}/activiti/start`,this.uploadForm).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success("提交成功", 20);
						this.$router.push({path: '/project_set_up/declare'});
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error,20);            
				});
			},
    
			/* 
				上传文件 ---限制用户上传的图片格式
			 */
			beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';

        if (!isJPG&&!isPNG) {
          this.$message.error('上传文件只能是 JPG/PNG 格式!');
        }
        return isJPG || isPNG;
      },
			beforeUploadWord(file) {
				const isDOC = file.name.substring(file.name.lastIndexOf('.')+1) === 'doc';
				const isDOCX = file.name.substring(file.name.lastIndexOf('.')+1) === 'docx';

				if (!isDOC&&!isDOCX) {
					this.$message.error('上传文件只能是 doc/docx 格式!');
				}else{
					console.log("15151")
				}
				return isDOC || isDOCX;
			},
						
			
			/* 
				上传文件 ---文件上传成功时
			*/
			uploadSuccessFile1(res,file,fileList) {
				// this.uploadForm.file1 = [{name:res.data.name,url:res.data.path}];
				this.uploadForm.file1 = fileList;
			},
			uploadSuccessFile3(res) {
				this.uploadForm.file3 = [{name:res.data.name,url:res.data.path}];
			},
			uploadSuccessFile4(res) {
				this.uploadForm.file4 = [{name:res.data.name,url:res.data.path}];
			},
			uploadSuccessFile6(res,file,fileList) {
				this.uploadForm.file6 = fileList;
			},
			uploadSuccessSituationFlie(res,file,fileList) {
				this.uploadForm.situationFlie = fileList;
			},
			
			/* 
				上传文件 ---文件上传失败时
			*/
			uploadErrorFile1(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.uploadForm.file1 = null
			},
			uploadErrorFile3(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.uploadForm.file3 = null
			},
			uploadErrorFile4(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.uploadForm.file4 = null
			},
			uploadErrorFile6(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.uploadForm.file6 = null
			},
			uploadErrorSituationFlie(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.uploadForm.situationFlie = null
			},
			
			/* 
				获取申报单位
			*/
			getDeclareUnit(){
				var formData = {
					id:6,
				}
				// this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
				this.axios.post(`${this.common.basePath}/hr_users/user/list`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						var declareUnitList = response.data.data;
						sessionStorage.setItem("unitArr",JSON.stringify(declareUnitList))
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error,20);            
				});
			},
		},
  }
</script>

<style lang="less">
	.upload-demo {
		width: 100%;
	}
</style>
