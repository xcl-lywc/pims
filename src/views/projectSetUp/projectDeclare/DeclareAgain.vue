 <!--
  继续项目申报表单(包含编辑功能)
  -->
<template>
  <div>
    <h2 class="page-title">项目申报</h2>
    <div class="block-wrap">
      <h4 class="block-title">补充申报材料表单</h4>
      <div class="block-body">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm base-info" size="middle" enctype="multipart/form-data" v-if='detailData'>
					
					<div v-if="typeName == 'edit'||typeName == 'acceptance'">
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
									<el-form-item label="申报单位：">
										<span> {{ ruleForm.orgName }} </span>
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
									<el-form-item label="预算来源：" prop="budgetType">
										<el-checkbox-group v-model="ruleForm.budgetType">
											<el-checkbox  
												v-for="typeItem in type_" 
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
									<el-form-item label="资金落实情况：" prop="financialSituation">
										<el-radio-group v-model="ruleForm.financialSituation">
											<el-radio label="已落实"></el-radio>
											<el-radio label="未落实"></el-radio>
										</el-radio-group>
									</el-form-item>
									<el-form-item v-if="ruleForm.financialSituation" label="情况说明：" prop="resourceRemarks">
										<el-input type="textarea"  v-model="ruleForm.resourceRemarks" :placeholder="ruleForm.financialSituation == '已落实' ? '请填写落实请款会议名称或领导签字意见' : '请填写请款过程中或尚未请款，并简要说明'"></el-input>
									</el-form-item>
									<el-form-item v-if="ruleForm.financialSituation" label="落实情况附件材料：" class="middle is-required" prop="situationFlie">
										<el-upload
											class="upload-demo"
											ref="uploadSituationFlie"
											:file-list="ruleForm.situationFlie?ruleForm.situationFlie:[]"
											:on-preview="handlePreview"
											:before-remove="beforeRemoveSituationFlie"
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
							<el-form-item label="'三重一大'会议纪要：" class="middle is-required" prop="file1">
								<el-upload
									class="upload-demo"
									ref="uploadFlie1"
									:file-list="ruleForm.file1"
									:on-preview="handlePreview"
									:before-remove="beforeRemove1"
									:before-upload="beforeUploadImage"
									:action="`${common.basePath}/file/-1/uplode`"
									:headers="myHeaders"
									:auto-upload="true"
									multiple
									:on-success="uploadSuccessFile1"
									:on-error="uploadErrorFile1">
									<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
									<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">请上传关于本项目“三重一大”会议纪要节选(加盖公章, .jpg .png格式),允许上传多个文件</span>
								</el-upload>
							</el-form-item>
							<el-form-item label="项目方案：" class="middle is-required"  prop="file3">
								<el-upload
									class="upload-demo"
									ref="uploadFlie3"
									:file-list="ruleForm.file3"
									:on-preview="handlePreview"
									:before-upload="beforeUploadWord"
									:before-remove="beforeRemove3"
									:action="`${common.basePath}/file/-1/uplode`"
									:headers="myHeaders"
									:auto-upload="true"
									multiple
									:limit="1"
									:on-success="uploadSuccessFile3"
									:on-error="uploadErrorFile3">
									<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
									<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">请上传项目建设方案详版(word格式)</span>
								</el-upload>
							</el-form-item>
							<el-form-item v-if="ruleForm.file4 && detailData.curStatus >= 8&&detailData.curStatus!=18" label="项目方案(简版)：" class="middle is-required" prop="file4">
								<el-upload
									class="upload-demo"
									ref="uploadFlie4"
									:file-list="ruleForm.file4"
									:on-preview="handlePreview"
									:before-upload="beforeUploadWord"
									:before-remove="beforeRemove4"
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
								<div class="file-position"><a :href="`${common.basePath}/project/template`" target="view_window">点击下载项目方案模版</a></div>
							</el-form-item>
							<el-form-item label="附件材料：" class="middle" prop="file6">
								<el-upload
									class="upload-demo"
									ref="uploadFlie6"
									:file-list="ruleForm.file6?(ruleForm.file6=='[]'?[]:ruleForm.file6):[]"
									:on-preview="handlePreview"
									:before-remove="beforeRemove6"
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
					</div>
					
					<div class="grid-content bg-gray grid-content_" v-if="(detailData.financeDudget || detailData.financePlan) || typeName == 16">
						<h4 class="base-title">
							<img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
							<span class="fl">录入财政评审相关意见：</span>
						</h4>
						<el-form :model="ruleForm" ref="ruleForm" label-width="200px" size="small" enctype="multipart/form-data">
							<el-form-item label="财政意见-调整预算金额：" prop="budgetFinance" v-if="ruleForm.budgetFinance">
								<el-input v-model="ruleForm.budgetFinance" placeholder="请输入预算金额">
									<template slot="append">万元</template>
								</el-input>
							</el-form-item>
							<el-form-item label="财政专家评审意见：" class="is-required" prop="file5">
									<el-upload
										class="upload-demo"
											ref="uploadFlie5"
											:file-list = 'ruleForm.file5'
											:before-upload="beforeUpload5"
											:action="`${common.basePath}/file/-1/uplode`"
											:headers="myHeaders"
											:auto-upload="true"
											multiple
											:limit="99"
											:on-success="uploadSuccessFile5"
											:on-error="uploadErrorFile5"
											:before-remove="beforeRemove5">
											<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
											<span slot="tip" class="el-upload__tip"> 若有二次评审请都要上传(.jpg .png .pdf格式)</span>
									</el-upload>
							</el-form-item>
							<el-form-item label="项目建设方案(终审稿)：" class="is-required" prop="file2">
								<el-upload
									class="upload-demo"
									ref="uploadFlie2"
									:file-list = 'ruleForm.file2'
									:before-remove="beforeRemove2"
									:action="`${common.basePath}/file/-1/uplode`"
									:headers="myHeaders"
									:auto-upload="true"
									multiple
									:limit="1"
									:on-success="uploadSuccessFile2"
									:on-error="uploadErrorFile2">
									<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								</el-upload>
							</el-form-item>
						</el-form>
					</div>

					<div class="grid-content bg-gray grid-content_" v-if="(typeName == 'edit' && (detailData.budgetMPlan || detailData.expertMPlan || detailData.leaderMPlan)) || typeName == 6 || typeName == 13 || typeName == 14">
						<h4 class="base-title">
							<img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
							<span class="fl">阶段方案：</span>
						</h4>
						<el-form-item label="预审方案(一稿)：" class="middle is-required" prop="budgetMPlan" v-if='(detailData.curStatus==13 || (typeName == "edit" && detailData.budgetMPlan))&&budgetRotation==1'>
							<el-upload
								class="upload-demo"
								ref="uploadFlieBudget"
								:file-list="ruleForm.budgetMPlan?ruleForm.budgetMPlan:[]"
								:on-preview="handlePreview"
								:before-upload="beforeUploadWord"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="1"
								:on-success="uploadSuccessFileBudget"
								:on-error="uploadErrorFileBudget">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">请上传预审改进方案(word格式)</span>
							</el-upload>
						</el-form-item>
						<el-form-item label="预审方案(二稿)：" class="middle is-required" prop="budgetMMPlan" v-if='(detailData.curStatus==13 || (typeName == "edit" && detailData.budgetMMPlan))&&budgetRotation==2'>
							<el-upload
								class="upload-demo"
								ref="uploadFlieBudget_"
								:file-list="ruleForm.budgetMMPlan?ruleForm.budgetMMPlan:[]"
								:on-preview="handlePreview"
								:before-upload="beforeUploadWord"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="1"
								:on-success="uploadSuccessFileBudget_"
								:on-error="uploadErrorFileBudget_">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">请上传预审改进方案(word格式)</span>
							</el-upload>
						</el-form-item>
						<el-form-item label="评审方案(一稿)：" class="middle is-required" prop="expertMPlan" v-if='(detailData.curStatus==14 || (typeName == "edit" && detailData.expertMPlan))&&expertRotation==1'>
							<el-upload
								class="upload-demo"
								ref="uploadFlieExpert"
								:file-list="ruleForm.expertMPlan?ruleForm.expertMPlan:[]"
								:on-preview="handlePreview"
								:before-upload="beforeUploadWord"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="1"
								:on-success="uploadSuccessFileExpert"
								:on-error="uploadErrorFileExpert">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">请上传专家评审改进方案(word格式)</span>
							</el-upload>
						</el-form-item>
						<el-form-item label="评审方案(二稿)：" class="middle is-required" prop="expertMMPlan" v-if='(detailData.curStatus==14 || (typeName == "edit" && detailData.expertMMPlan))&&expertRotation==2'>
							<el-upload
								class="upload-demo"
								ref="uploadFlieExpert_"
								:file-list="ruleForm.expertMMPlan?ruleForm.expertMMPlan:[]"
								:on-preview="handlePreview"
								:before-upload="beforeUploadWord"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="1"
								:on-success="uploadSuccessFileExpert_"
								:on-error="uploadErrorFileExpert_">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">请上传专家评审改进方案(word格式)</span>
							</el-upload>
						</el-form-item>
						<!-- <el-form-item label="领导评审改进方案：" class="middle is-required" prop="leaderMPlan" v-if='detailData.curStatus==6 || (typeName == "edit" && detailData.leaderMPlan)'>
							<el-upload
								class="upload-demo"
								ref="uploadFlieLeader"
								:file-list="ruleForm.leaderMPlan"
								:on-preview="handlePreview"
								:before-upload="beforeUploadWord"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="1"
								:on-success="uploadSuccessFileLeader"
								:on-error="uploadErrorFileLeader">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">请上传领导评审改进方案(word格式)</span>
							</el-upload>
						</el-form-item> -->
						<div v-if="typeName == 6 || typeName == 13 || typeName == 14">
							<h4 class="base-title">
								<img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
								<span class="fl">返回原因：</span>
							</h4>
							<el-form-item label="专家意见：" prop="expertOpinion">
								<div v-if="expertOpinion" v-for="(item,index) in expertOpinion" class="expert">
									<span class="fl">{{"专家"+(index+1)+"："}}</span>
									<p class="advice">
										<span class="fl">一审意见：</span>
										<a class="fl" v-if="item.childrens[0].comment?true:false" :href="item.childrens[0].comment ? '/pics'+JSON.parse(item.childrens[0].comment).path : ''" target="view_window">
											{{JSON.parse(item.childrens[0].comment).name}}
										</a>
										<span v-else class="fl">未上传意见</span>
									</p>
									<p class="advice advice-two" v-if="item.childrens.length==2">
										<span class="fl">&nbsp;&nbsp;&nbsp;&nbsp;二审意见：</span>
										<a class="fl" v-if="item.childrens[1].comment?true:false" :href="item.childrens[1].comment ? '/pics'+JSON.parse(item.childrens[1].comment).path : ''" target="view_window">
											{{JSON.parse(item.childrens[1].comment).name}}
										</a>
										<span v-else class="fl">未上传意见</span>
									</p>
								</div>
							</el-form-item>
							<el-form-item label="原因描述：" prop="rejectReason">
								<span v-if="detailData.rejectReason">{{detailData.rejectReason}}</span>
								<span v-else>未填写</span>
							</el-form-item>
						</div>
					</div>

					<div v-if="typeName == 17" class="grid-content bg-gray grid-content_">
						<h4 class="base-title">
							<img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
							<span class="fl">网信会议材料：</span>
						</h4>
						<el-form-item label="项目方案（简版）：" class="middle is-required" prop="file4">
							<el-upload
								ref="uploadFliePlan"
								:file-list="ruleForm.file4?ruleForm.file4:[]"
								:before-upload="beforeUploadWord"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="1"
								:on-success="uploadSuccessFile4"
								:on-error="uploadErrorFile4">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">项目方案(word格式)</span>
							</el-upload>
							<div class="file-position"><a :href="`${common.basePath}/project/template`" target="view_window">点击下载项目方案模版</a></div>
						</el-form-item>
						<el-form-item label="申报单位汇报稿：" class="middle is-required" prop="leaderReport">
							<el-upload
								ref="leaderReport"
								:file-list="ruleForm.leaderReport?JSON.parse(ruleForm.leaderReport):[]"
								:before-upload="beforeUploadWordPpt"
								:action="`${common.basePath}/file/-1/uplode`"
								:headers="myHeaders"
								:auto-upload="true"
								multiple
								:limit="99"
								:before-remove="beforeRemoveLeader"
								:on-success="uploadSuccessLeaderReport"
								:on-error="uploadErrorLeaderReport">
								<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
								<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">申报单位汇报稿(请上传word格式和ppt格式的两份文件)</span>
							</el-upload>
						</el-form-item>
					</div>
					
					<div class="text-center">
						<el-button v-if="this.typeName == 'acceptance'" type="primary" @click="submitForm('ruleForm', 'acceptance')">提交审批</el-button>
						<el-button v-if="this.typeName == 'edit'" type="primary" @click="submitForm('ruleForm', 'edit')">保存编辑</el-button>
						<el-button v-if="this.typeName != 'edit'&&this.typeName != 'acceptance'" type="primary" @click="submitForm('ruleForm', 'form')">提交审批</el-button>
						<el-button v-if="this.typeName != 'edit'" @click="stopDeclare">停止申报</el-button>
						<el-button @click="backFromDeclareAgain()">返回</el-button>
					</div>
       
				</el-form>
      </div>
    </div>
	</div>

</template>

<style scoped>
  .expert{
		overflow: hidden;
	}
	.advice{
		overflow: hidden;
	}
	.advice.advice-two{
		padding-left: 34px;
	}
</style>

<script>
  export default {
    data() {
			/*
				手机号码校验
			*/
			var phoneNumber = (rule, value, callback) => {
				if (value && (!(/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/).test(value) || !(/^[1-9]\d*$/).test(value) || value.length !== 11)) {
					callback(new Error('手机号码不符合规范'))
				} else {
					callback()
				}
			};
      return {
				projectId: this.$route.params.id,
				typeName:  this.$route.params.type,
				budgetRotation:this.$route.params.budgetRotation,
				expertRotation:this.$route.params.expertRotation,

				detailData:null,
				expertOpinion:null,//专家意见
				heartBasis:false,
				achievementsBasis:false,
				elseBasis:false,
				selfBasis:false,
				superviseBasis:false,
				isShowBasisBox1:true,
				isShowBasisBox2:false,
				myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
				instanceId:JSON.parse(sessionStorage.getItem("rowDeclareInfo")).processVariables.instanceId,
				assignee:JSON.parse(sessionStorage.getItem("rowDeclareInfo")).processVariables.assignee,
				uploadForm : {
					file1: null,
					file3: null,
					file4: null,
					file6: null,
					situationFlie:null,
					file2: null,
					file5: null,
					leaderMPlan:null,
					budgetMPlan:null,
					expertMMPlan:null,
					budgetMMPlan:null,
					expertMPlan:null,
					financePlan:null,
					financeDudget:null,
				},   // 一个formdata
				company:null,
				type_:[
					{
						name:'国家专项资金',
						id:1,
						checked:false
					},
					{
						name:'市财政资金',
						id:2,
						checked:false
					},
					{
						name:'区财政资金',
						id:3,
						checked:false
					},
				],
				elsetype:[
					{
						name:'其他资金',
						id:4,
						checked:false
					},
				],
        ruleForm: {
        	name: null,
        	company: null,
        	people:null,
        	contacts:null,
        	tel:null,
        	phone:null,
        	mail:null,
        	type: [],
        	resource: null,
					financialSituation:null,
					resourceRemarks:null,
					budgetMoney:null,
					budgetRemarks:null,
					projectType:[],
					projectSelfBasis:null,
					projectSuperviseBasis:null,
					projectHeartBasis:null,
					projectAchievementsBasis:null,
					projectElseBasis:null,
        	file1: null,
					file3: null,
					file4: null,
					file6: null,
					situationFlie:null,
					file2: null,
					file5: null,
					leaderMPlan:null,
					budgetMPlan:null,
					expertMMPlan:null,
					budgetMMPlan:null,
					expertMPlan:null,
					leaderReport: null,
					budgetFinance:null,
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
						{ required: true, message: '请输入固话', trigger: 'blur' }
					],
					mail: [
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
					],
					budgetType: [
						{ type: 'array', required: true, message: '请至少选择一个预算来源', trigger: 'change' }
					],
          financialSituation: [
            { required: true, message: '请选择资金落实情况', trigger: 'change' }
          ],
					resourceRemarks: [
						{ required: true, message: '请填写情况说明', trigger: 'blur' }
					],
					budgetMoney:[
						{ required: true, message: '请输入预算金额', trigger: 'blur' },
					],
					budgetRemarks:[
						{ required: true, message: '请输入内容', trigger: 'blur' },
					],
					projectType: [
						{ required: true, message: '请选择项目类型', trigger: 'change' }
					],
					projectSelfBasis: [
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
					budgetFinance:[
						{ required: true, message: '请输入预算金额', trigger: 'blur' },
					],
        },
				curStatus:null,
				projectId:JSON.parse(sessionStorage.getItem("rowDeclareInfo")).processVariables.projectId,
				elseCheckbox: false,
      };
    },
    mounted () {
			/* 
			展示专家意见
			*/
			this.showExpertOpinion();
			
			/* 
			 申报单位
			 */
			this.getDeclareUnit();
			
			/* 
			 getCurStatus
			 */
			// this.getCurStatus();
			
			/* 
			 获取详情
			 */
			this.getDetail();
    },
		watch: {
			/* 'detailData.financialSituation': {
				handler (newV, oldV) {
					console.log(newV)
					this.ruleForm.resourceRemarks = ""
					this.$refs.ruleForm.clearValidate("resourceRemarks")
				},
				deep: true
			} */
		},
		created(){
			window.da = this
			/* if(this.ruleForm.budgetType.lastIndexOf(4)!=-1){
				console.log(this.ruleForm.budgetType.lastIndexOf(4))
				sessionStorage.setItem('mark','1')
			}else{
				console.log(this.ruleForm.budgetType.lastIndexOf(4))
				sessionStorage.setItem('mark','2')
			} */
		},
		computed: {
			/* companyName () {
				let self = this
				this.ruleForm.company
				let name = null
				this.company.forEach((item, index) => {
					if (this.ruleForm.company == item.id) {
						name = item.name
					}
				})
				return name
			} */
		},
    methods: {
			/* 
			 展示专家意见
			 */
			showExpertOpinion(){
				let self = this
				self.axios.get(`${self.common.basePath}/assessment_expert/all/${self.projectId}`,self._expertOpinionParams()).then( (response) => {
					if(response.data.meta.code === 0){
						self.expertOpinion = response.data.data;
					}else{
						self.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					self.$message.error(error);
				});
			},
			_expertOpinionParams(){
				return {
					params: {
						type: this.$route.params.type==13 ? 1 : 2,
					}
				}
			},
			
			/*
			* 获取详情
			*/
			getDetail(){
				let self = this
				self.axios.get(`${self.common.basePath}/project/detail/${self.projectId}`,self._detailParams()).then( (response) => {
					if(response.data.meta.code === 0){
						//curStatus
						self.curStatus = response.data.data.curStatus;
						//ruleForm
						self.ruleForm = response.data.data;
						self.ruleForm.people = response.data.data.linkman;
						self.ruleForm.contacts = response.data.data.liabilityUser;
						self.ruleForm.budgetType = response.data.data.budgetType;
						self.ruleForm.financialSituation = response.data.data.financialSituation;
						self.ruleForm.projectType = JSON.parse(response.data.data.projectType);
						self.ruleForm.file1 = JSON.parse(response.data.data.meetingSummary);
						self.ruleForm.file2 = JSON.parse(response.data.data.financePlan);
						self.ruleForm.file3 = JSON.parse(response.data.data.projectPlan);
						self.ruleForm.file4 = JSON.parse(response.data.data.projectPlanSimple);
						self.ruleForm.file5 = JSON.parse(response.data.data.financeDudget);
						self.ruleForm.file6 = JSON.parse(response.data.data.remarksFile);
						self.ruleForm.situationFlie = response.data.data.situationFlie?JSON.parse(response.data.data.situationFlie):null;
						self.ruleForm.expertMPlan = JSON.parse(response.data.data.expertMPlan);
						self.ruleForm.budgetMPlan = JSON.parse(response.data.data.budgetMPlan);
						self.ruleForm.expertMMPlan = response.data.data.expertMMPlan?JSON.parse(response.data.data.expertMMPlan):null;
						self.ruleForm.budgetMMPlan = response.data.data.budgetMMPlan?JSON.parse(response.data.data.budgetMMPlan):null;
						
						//uploadForm
						self.uploadForm = response.data.data;
						//detailData
						self.detailData = response.data.data;
						response.data.data.budgetRemarks         ? self.elseCheckbox = true : self.elseCheckbox = false
						response.data.data.projectSelfBasis         ? self.selfBasis = true : self.selfBasis = false,
						response.data.data.projectSuperviseBasis         ? self.superviseBasis = true : self.superviseBasis = false
						response.data.data.projectHeartBasis        ? self.heartBasis = true : self.heartBasis = false
						response.data.data.projectAchievementsBasis ? self.achievementsBasis = true : self.achievementsBasis = false
						response.data.data.projectElseBasis         ? self.elseBasis = true : self.elseBasis = false
					}else{
						self.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					self.$message.error(error);
				});
			},
			_detailParams(){
				return {
					params: {
						id:this.projectId,
					}
				}
			},
			
			
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
				console.log(val)
				this.selfBasis = val;
				if(!val) {
					this.ruleForm.projectSelfBasis = null
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
				if(!val) {
					this.ruleForm.projectAchievementsBasis = null
				}
			},
			else_(val){
				this.elseBasis = val;if(!val) {
					this.ruleForm.projectElseBasis = null
				}
			},
			heart_(val){
				this.heartBasis = val;
				if(!val) {
					this.ruleForm.projectHeartBasis = null
				}
			},
			
			/* 
			提交申报按钮 
			*/ 
      submitForm(formName, type) {
        //console.log(this.$refs[formName])
        this.$refs[formName].validate((valid) => {
          if (valid) {
						
						this.uploadForm.assignee = JSON.parse(sessionStorage.getItem("rowDeclareInfo")).processVariables.assignee
						this.uploadForm.instanceId = JSON.parse(sessionStorage.getItem("rowDeclareInfo")).processVariables.instanceId
						this.uploadForm.curStatus = this.curStatus
						
						if(type == 'edit'||type == 'acceptance'){
							this.uploadForm.name = this.ruleForm.name
							this.uploadForm.company = this.ruleForm.orgId
							this.uploadForm.people = this.ruleForm.people
							this.uploadForm.contacts = this.ruleForm.contacts
							this.uploadForm.tel = this.ruleForm.tel
							this.uploadForm.phone = this.ruleForm.phone
							this.uploadForm.mail = this.ruleForm.mail
							
							this.uploadForm.budgetMoney = this.ruleForm.budgetMoney
							this.uploadForm.type = this.ruleForm.budgetType
							this.uploadForm.budgetRemarks = this.ruleForm.budgetRemarks
							this.uploadForm.resource = this.ruleForm.financialSituation
							this.uploadForm.resourceRemarks = this.ruleForm.resourceRemarks
							this.uploadForm.situationFlie = this.ruleForm.situationFlie || null
							
							this.uploadForm.projectType = this.ruleForm.projectType
							this.uploadForm.projectSelfBasis = this.ruleForm.projectSelfBasis
							this.uploadForm.projectSuperviseBasis = this.ruleForm.projectSuperviseBasis
							this.uploadForm.projectHeartBasis = this.ruleForm.projectHeartBasis
							this.uploadForm.projectAchievementsBasis = this.ruleForm.projectAchievementsBasis
							this.uploadForm.projectElseBasis = this.ruleForm.projectElseBasis
							this.uploadForm.file1 = this.ruleForm.file1 || null
							this.uploadForm.file3 = this.ruleForm.file3 || null
							this.uploadForm.file4 = this.ruleForm.file4 || null
							this.uploadForm.file6 = this.ruleForm.file6 || null
						}
						
						if((this.detailData.financeDudget || this.detailData.financePlan) || type == 16){
							this.uploadForm.file2 = this.ruleForm.file2 || null
							this.uploadForm.file5 = this.ruleForm.file5 || null
							this.uploadForm.budgetFinance = this.ruleForm.budgetFinance
						}
						
						if((type == 'edit' && (this.detailData.budgetMPlan || this.detailData.expertMPlan || this.detailData.leaderMPlan)) || type == 6 || type == 13 || type == 14){
							this.uploadForm.leaderMPlan = this.ruleForm.leaderMPlan
							this.uploadForm.budgetMPlan = this.ruleForm.budgetMPlan
							this.uploadForm.budgetMMPlan = this.ruleForm.budgetMMPlan
							this.uploadForm.expertMMPlan = this.ruleForm.expertMMPlan
							this.uploadForm.expertMPlan = this.ruleForm.expertMPlan
						}
						
						if(type == 17){
							this.uploadForm.file4 = this.ruleForm.file4 || null
							this.uploadForm.leaderReport = this.ruleForm.leaderReport || null
						}
						
						var that = this;
						this.$confirm(type != "edit" ? '是否提交审批？' : '确认提交编辑?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning',
						}).then(() => {
							that.declare(type);
						}).catch((error) => {
						});
          } else {
						this.$message.error('请检查信息填写是否完整', 60);
            return false;
          }
        });
      },
			
			/*
			* 获取curStatus
			*/
			getCurStatus(){
				this.axios.get(`${this.common.basePath}/project/detail/${this.projectId}`,this._curStatusParams()).then( (response) => {
					if(response.data.meta.code === 0){
						this.curStatus = response.data.data.curStatus;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error);
				});
			},
			_curStatusParams(){
				return {
					params: {
						id:this.projectId,
					}
				}
			},
			
			/* 
			停止申报
			*/
			stopDeclare(){
				this.$prompt('请输入停止申报原因', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.void_(value);
        }).catch(() => {    
        });
			},
			
			/* 
				关闭
			*/ 
			void_(value){
				var formData = {
					rejectReason:value,
					instanceId:JSON.parse(sessionStorage.getItem("rowDeclareInfo")).processVariables.instanceId,
				}
				this.axios.post(`${this.common.basePath}/activiti/instance/delete`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						this.$message.success("该项目已关闭！", 20);
						this.tipsDialogVisible_ = false;
						this.$router.push({path: '/project_set_up/declare'});
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error,20);         
				});
			},
			
			/* 
			 提交项目申报信息表单
			 */
			declare(type){
				let self = this
				/* if(sessionStorage.getItem("mark")==='1'){
					if(this.uploadForm.budgetRemarks == ''||null){
						this.$message.error('预算的 其他来源备注 缺失!!!', 60);
						sessionStorage.removeItem("mark")
						return;
					}
				} */
				if(this.uploadForm.file1.length === 0){
					this.$message.error('上传的 “三重一大”会议纪要 缺失!!!', 60);
					return;
				}
				if(this.uploadForm.file3.length === 0){
					this.$message.error('上传的 项目方案 缺失!!!', 60);
					return;
				}
				if(this.uploadForm.situationFlie&&this.uploadForm.situationFlie.length === 0){
					this.$message.error('上传的 落实情况附件材料 缺失!!!', 60);
					return;
				}
				// 在(编辑情况下,curStatus > 8时) || (非编辑情况下 仅在curStatus == 17时)判断是否缺失简版
				if(((this.$route.params.type == 'edit' && this.detailData.curStatus > 8 ) || (this.$route.params.type != 'edit' && this.detailData.curStatus == 17)) && (this.uploadForm.file4 == null)){
					this.$message.error('上传的 项目方案(简版) 缺失!!!', 60);
					return;
				}
				if(((this.$route.params.type == 'edit' && this.detailData.curStatus > 8&&this.detailData.curStatus != 12 ) || (this.$route.params.type != 'edit' && this.detailData.curStatus == 17)) && (this.uploadForm.leaderReport== null)){
					this.$message.error('上传的 申报单位汇报稿 缺失!!!', 60);
					return;
				}
				

				if(this.uploadForm.expertMPlan == undefined&&this.detailData.curStatus == 14&&this.expertRotation == 1){
					this.$message.error('上传的 专家评审改进方案(初稿) 缺失!!!', 60);
					return;
				}
				if(this.uploadForm.expertMMPlan == undefined&&this.detailData.curStatus == 14&&this.expertRotation == 2){
					this.$message.error('上传的 专家评审改进方案(终稿) 缺失!!!', 60);
					return;
				}
				if(this.uploadForm.budgetMPlan == undefined&&this.detailData.curStatus == 13&&this.budgetRotation == 1){
					this.$message.error('上传的 预审改进方案(初稿) 缺失!!!', 60);
					return;
				}
				if(this.uploadForm.budgetMMPlan == undefined&&this.detailData.curStatus == 13&&this.budgetRotation == 2){
					this.$message.error('上传的 预审改进方案(终稿) 缺失!!!', 60);
					return;
				}
				if(this.uploadForm.financePlan&&this.uploadForm.financePlan.length==0&&this.detailData.curStatus == 16){
					this.$message.error('上传的 项目建设方案(终审稿) 缺失!!!', 60);
					return;
				}
				if(this.uploadForm.financeDudget&&this.uploadForm.financeDudget.length==0&&this.detailData.curStatus == 16){
					this.$message.error('上传的 财政专家评审意见 缺失!!!', 60);
					return;
				}
				// if(this.uploadForm.leaderMPlan == undefined&&this.detailData.curStatus == 6){
				// 	this.$message.error('上传的 领导评审改进方案 缺失!!!', 60);
				// 	return;
				// }
				if(type == 'acceptance'){
					this.axios.put(type == 'acceptance' ? `${this.common.basePath}/activiti/udpate` : null,this.uploadForm).then( (response) => {
						if(response.data.meta.code === 0){
							self.$router.push({path: '/project_set_up/declare'});
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error,20);            
					});
				}else{
					this.axios.post((type != 'edit') ? `${this.common.basePath}/activiti/complete` : `${this.common.basePath}/project/update/${this.detailData.instanceId}`,this.uploadForm).then( (response) => {
						if(response.data.meta.code === 0){
							if(type != 'edit') {
								self.$router.push({path: '/project_set_up/declare'});
							} else {
								this.$message.success(response.data.meta.message, 20); 
								//编辑成功后 返回之前的页面 由session记录 只在保存成功,点击返回 和 在列表中点击编辑时重写
								self.$router.push({path: sessionStorage.getItem('historyPath') || '/'})
								sessionStorage.removeItem('historyPath')
							}
							
						}else{
							this.$message.error(response.data.meta.message, 20);   
						}
					}).catch( (error) => {
						this.$message.error(error,20);            
					});
				}
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
						this.company = response.data.data;
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
			beforeUploadImage(file) {
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
			beforeUploadWordPpt(file) {
				const isDOC  = file.name.substring(file.name.lastIndexOf('.')+1) === 'doc';
				const isDOCX = file.name.substring(file.name.lastIndexOf('.')+1) === 'docx';
				const isPPT  = file.name.substring(file.name.lastIndexOf('.')+1) === 'ppt';
				const isPPTX  = file.name.substring(file.name.lastIndexOf('.')+1) === 'pptx';

				if (!isDOC&&!isDOCX&&!isPPT&&!isPPTX) {
					this.$message.error('上传文件只能是 doc/docx/ppt/pptx 格式!');
				}

				return isDOC || isDOCX || isPPT || isPPTX;
			},
			/* 
				文件上传成功后，点击查看文件
			 */
			handlePreview(file){
				
			},
			
			/* 
				上传文件 ---文件上传成功时
			*/
			uploadSuccessFile1(res, file, fileList) {
				// this.ruleForm.file1.push({name: res.data.name, url:res.data.path})
				this.ruleForm.file1 = fileList
			},
			uploadSuccessFile2(res) {
				this.ruleForm.file2 = [{name:res.data.name,url:res.data.path}];
				this.ruleForm.financePlan = [{name:res.data.name,url:res.data.path}];
			},
			uploadSuccessFile5(res, file, fileList) {
				this.ruleForm.file5 = fileList
				this.ruleForm.financeDudget = fileList
			},
			uploadSuccessFile3(res, file, fileList) {
				this.ruleForm.file3 = [{name:res.data.name,url:res.data.path}]
			},
			uploadSuccessFile4(res, file, fileList) {
				this.ruleForm.file4 = [{name:res.data.name,url:res.data.path}]
			},
			uploadSuccessFileLeader(res, file, fileList) {
				this.ruleForm.leaderMPlan = [{name:res.data.name,url:res.data.path}]
			},
			uploadSuccessFileExpert(res, file, fileList) {
				this.ruleForm.expertMPlan = [{name:res.data.name,url:res.data.path}]
			},
			uploadSuccessFileExpert_(res, file, fileList) {
				this.ruleForm.expertMMPlan = [{name:res.data.name,url:res.data.path}]
			},
			uploadSuccessFileBudget(res, file, fileList) {
				this.ruleForm.budgetMPlan = [{name:res.data.name,url:res.data.path}]
			},
			uploadSuccessFileBudget_(res, file, fileList) {
				this.ruleForm.budgetMMPlan = [{name:res.data.name,url:res.data.path}]
			},
			uploadSuccessFile6(res, file, fileList) {
				this.ruleForm.file6 = fileList
			},
			uploadSuccessSituationFlie(res, file, fileList) {
				this.ruleForm.situationFlie = fileList
			},
			uploadSuccessLeaderReport(res, file, fileList) {
				this.ruleForm.leaderReport = fileList
			},
			/* 
				上传文件 ---文件上传失败时
			*/
			uploadErrorFile1(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.file1 = null
			},
			uploadErrorFile2(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.file2 = null
			},
			uploadErrorFile5(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.file5 = null
			},
			uploadErrorFile3(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.file3 = null
			},
			uploadErrorFile4(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.file4 = null
			},
			uploadErrorFileLeader(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.leaderMPlan = null
			},
			uploadErrorFileExpert(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.expertMPlan = null
			},
			uploadErrorFileExpert_(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.expertMMPlan = null
			},
			uploadErrorFileBudget(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.budgetMPlan = null
			},
			uploadErrorFileBudget_(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.budgetMMPlan = null
			},
			uploadErrorFile6(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.file6 = null
			},
			uploadErrorSituationFlie(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.situationFlie = null
			},
			uploadErrorLeaderReport(res, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.ruleForm.leaderReport = null
			},
			/* 
			 文件上传---删除文件
			 */
			beforeRemove1(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					this.uploadForm.file1 = fileList;
					this.ruleForm.file1 = fileList;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					var fileArr = [];
					fileArr.push(file)
					this.uploadForm.file1 = fileArr;
					this.ruleForm.file1 = fileArr;
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
      },
			beforeRemove2(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					this.ruleForm.file2 = fileList;
					this.uploadForm.financePlan = fileList;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					var fileArr = [];
					fileArr.push(file)
					this.ruleForm.file2 = fileArr;
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			beforeUpload5(file, fileList) {
				const isJPG = file.type === 'image/jpeg';
				const isPNG = file.type === 'image/png';
				const isPDF = file.type === 'application/pdf';

				if (!isJPG&&!isPNG&&!isPDF) {
					this.$message.error('上传文件只能是 JPG/PNG/PDF 格式!');
				}
				return isJPG || isPNG || isPDF;
				// return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
				// 	confirmButtonText: '确定',
				// 	cancelButtonText: '取消',
				// 	type: ''
				// }).then(() => {
				// 	this.ruleForm.file5 = fileList;
				// 	this.$message({
				// 		type: 'success',
				// 		message: '删除成功!'
				// 	});
				// }).catch(() => {
				// 	var fileArr = [];
				// 	fileArr.push(file)
				// 	this.ruleForm.file5 = fileArr;
				// 	this.$message({
				// 		type: 'info',
				// 		message: '已取消删除'
				// 	});          
				// });
			},
			beforeRemove3(file, fileList) {
				console.log(file, fileList)
				console.log(this.uploadForm.file3)
				console.log(this.ruleForm.file3)
				return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					this.uploadForm.file3 = fileList;
					this.ruleForm.file3 = fileList;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					var fileArr = [];
					fileArr.push(file)
					this.uploadForm.file3 = fileArr;
					this.ruleForm.file3 = fileArr;
					this.$message({
						type: 'info',
						message: '已取消删除'
					});  
				});
			},
			beforeRemove4(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					this.uploadForm.file4 = fileList;
					this.ruleForm.file4 = fileList;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					var fileArr = [];
					fileArr.push(file)
					this.uploadForm.file4 = fileArr;
					this.ruleForm.file4 = fileArr;
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			beforeRemove5(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					this.uploadForm.file5 = fileList;
					this.uploadForm.financeDudget = fileList;
					this.ruleForm.file5 = fileList;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {     
				});
			},
			beforeRemove6(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					this.uploadForm.file6 = fileList;
					this.ruleForm.file6 = fileList;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					var fileArr = [];
					fileArr.push(file)
					this.uploadForm.file6 = fileArr;
					this.ruleForm.file6 = fileArr;      
				});
			},
			beforeRemoveSituationFlie(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					this.uploadForm.situationFlie = fileList;
					this.ruleForm.situationFlie = fileList;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {
					var fileArr = [];
					fileArr.push(file)
					this.uploadForm.situationFlie = fileArr;
					this.ruleForm.situationFlie = fileArr;      
				});
			},
			beforeRemoveLeader(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					this.uploadForm.leaderReport = fileList;
					this.ruleForm.leaderReport = fileList;
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
				}).catch(() => {     
				});
			},
			backFromDeclareAgain () {
				this.$router.push({path: sessionStorage.getItem('historyPath')})
				sessionStorage.removeItem('historyPath')
			},
		},
  }
</script>
