<template>
  <div>
    <!-- 文本信息 -->
    <div v-loading="isLoading" v-if="isShowBaseInfo">
      <el-form  :model="detailData" label-width="180px" size="middle" v-if="detailData" class='base-info'>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-gray">
              <h4 class="base-title">
                <img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
                <span class="fl">基本信息</span>
              </h4>
              <el-form-item label="项目名称：" prop="name">
                <span>{{ detailData.name }}</span>
              </el-form-item>
              <el-form-item label="申报单位：" prop="orgName">
                <span>{{ detailData.orgName }}</span>
              </el-form-item>
              <el-form-item label="项目负责人：" prop="linkman">
                <span>{{ detailData.linkman }}</span>
              </el-form-item>
              <el-form-item label="项目联系人：" prop="liabilityUser">
                <span>{{ detailData.liabilityUser }}</span>
              </el-form-item>
              <el-form-item label="联系手机：" prop="tel">
                <span>{{ detailData.tel }}</span>
              </el-form-item>
              <el-form-item label="联系固话：" prop="phone">
                <span>{{ detailData.phone }}</span>
              </el-form-item>
              <el-form-item label="邮箱：" prop="mail">
                <span>{{ detailData.mail }}</span>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-gray">
              <h4 class="base-title">
                <img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
                <span class="fl">项目预算</span>
              </h4>
              <el-form-item label="预算金额：" prop="budgetMoney">
                <span>{{ detailData.budgetMoney+'万元' }}</span>
              </el-form-item>
              <el-form-item label="预算来源：" prop="budgetType">
                <span v-for="typeItem in detailData.budgetType">{{budgetRoute[typeItem]}}&nbsp;&nbsp;&nbsp;</span>
              </el-form-item>
              <el-form-item label="其他资金来源备注：" prop="budgetRemarks" v-if="detailData.budgetRemarks">
                <span v-if="detailData.budgetRemarks!=''">{{detailData.budgetRemarks}}</span>
                <span v-else>无</span>
              </el-form-item>
              <el-form-item label="资金落实情况：" prop="financialSituation">
                <span>{{detailData.financialSituation}}</span>
              </el-form-item>
							<el-form-item label="资金落实情况说明：" prop="resourceRemarks" v-if="detailData.resourceRemarks">
								<span>{{detailData.resourceRemarks}}</span>
							</el-form-item>
							<el-form-item label="落实情况附件材料：" prop="situationFlie">
								<file-list v-if="detailData.situationFlie" :fileList="JSON.parse(detailData.situationFlie)"></file-list>
								<span v-else-if="detailData.situationFlie == '[]'">暂无</span>
								<span v-else>暂无</span>
							</el-form-item>
            </div>
          </el-col>
        </el-row>
				<el-row :gutter="20">
					<el-col :span="12">
						<div class="grid-content bg-gray grid-content_">
							<h4 class="base-title">
								<img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
								<span class="fl">项目情况</span>
							</h4>
							<el-form-item label="项目类型：" prop="projectType">
								<span v-if="detailData.projectType" v-for="item in JSON.parse(detailData.projectType)">{{item}}</span>
								<span v-else></span>
							</el-form-item>
							<el-form-item label="自建项目立项依据：" prop="projectSelfBasis" v-if="!!detailData.projectSelfBasis">
								<span>{{ detailData.projectSelfBasis }}</span>
							</el-form-item>
							<el-form-item label="督察督办项目立项依据：" prop="projectSuperviseBasis" v-if="!!detailData.projectSuperviseBasis">
								<span>{{ detailData.projectSuperviseBasis }}</span>
							</el-form-item>
							<el-form-item label="民心工程项目依据：" prop="projectHeartBasis" v-if="!!detailData.projectHeartBasis">
								<span>{{ detailData.projectHeartBasis }}</span>
							</el-form-item>
							<el-form-item label="绩效考核项目立项依据：" prop="projectAchievementsBasis" v-if="!!detailData.projectAchievementsBasis">
								<span>{{ detailData.projectAchievementsBasis }}</span>
							</el-form-item>
							<el-form-item label="其他项目立项依据：" prop="projectElseBasis" v-if="!!detailData.projectElseBasis">
								<span>{{ detailData.projectElseBasis }}</span>
							</el-form-item>
							<el-form-item label="'三重一大'会议纪要：" prop="meetingSummary">
								<!-- <a class="a-style" v-if="detailData.meetingSummary" :href="detailData.meetingSummary ? '/pics'+ JSON.parse(detailData.meetingSummary)[0].url : ''" target="view_window">
									{{JSON.parse(detailData.meetingSummary)[0].name}}
								</a>
								<span v-else>暂无</span> -->
								<file-list v-if="detailData.meetingSummary" :fileList="JSON.parse(detailData.meetingSummary)"></file-list>
								<span v-else>暂无</span>
							</el-form-item>
							<el-form-item label="项目方案：" prop="projectPlan">
								<a class="a-style" v-if="detailData.projectPlan" :href="detailData.projectPlan ? '/pics'+JSON.parse(detailData.projectPlan)[0].url : ''" target="view_window">
									{{JSON.parse(detailData.projectPlan)[0].name}}
								</a>
								<span v-else>暂无</span>
							</el-form-item>
							<el-form-item label="附件材料：" prop="remarksFile">
								<!-- <p>{{JSON.parse(detailData.remarksFile)}}</p> -->
								<file-list v-if="detailData.remarksFile" :fileList="JSON.parse(detailData.remarksFile)"></file-list>
								<span v-else-if="detailData.remarksFile == '[]'">暂无</span>
								<span v-else>暂无</span>
								<!--
								<span v-if="detailData.remarksFile==null||detailData.remarksFile == '[]'">暂无</span> -->
								<!-- <span v-else-if="">暂无</span> -->
								<!-- <span v-else>暂无</span> -->
							</el-form-item>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="grid-content bg-gray grid-content_">
							<h4 class="base-title">
								<img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
								<span class="fl">阶段方案</span>
							</h4>
							<el-form-item label="预审方案(一稿)：" prop="budgetMPlan">
								<a class="a-style" v-if="detailData.budgetMPlan" :href="detailData.budgetMPlan ? '/pics'+JSON.parse(detailData.budgetMPlan)[0].url : '' " target="view_window">
									{{JSON.parse(detailData.budgetMPlan)[0].name}}
								</a>
								<span v-else>暂无</span>
							</el-form-item>
							<el-form-item label="预审方案(二稿)：" prop="budgetMMPlan">
								<a class="a-style" v-if="detailData.budgetMMPlan" :href="detailData.budgetMMPlan ? '/pics'+JSON.parse(detailData.budgetMMPlan)[0].url : '' " target="view_window">
									{{JSON.parse(detailData.budgetMMPlan)[0].name}}
								</a>
								<span v-else>暂无</span>
							</el-form-item>
							<el-form-item label="评审方案(一稿)：" prop="expertMPlan">
								<a class="a-style" v-if="detailData.expertMPlan" :href="detailData.expertMPlan ? '/pics'+JSON.parse(detailData.expertMPlan)[0].url : '' " target="view_window">
									{{JSON.parse(detailData.expertMPlan)[0].name}}
								</a>
								<span v-else>暂无</span>
							</el-form-item>
							<el-form-item label="评审方案(二稿)：" prop="expertMMPlan">
								<a class="a-style" v-if="detailData.expertMMPlan" :href="detailData.expertMMPlan ? '/pics'+JSON.parse(detailData.expertMMPlan)[0].url : '' " target="view_window">
									{{JSON.parse(detailData.expertMMPlan)[0].name}}
								</a>
								<span v-else>暂无</span>
							</el-form-item>
							<!-- <el-form-item label="项目方案(简版)：" prop="projectPlanSimple">
								<a class="a-style" v-if="JSON.parse(detailData.projectPlanSimple).length!=0" :href="detailData.projectPlanSimple ? '/pics'+JSON.parse(detailData.projectPlanSimple)[0].url : '' " target="view_window">
									{{JSON.parse(detailData.projectPlanSimple)[0].name}}
								</a>
								<span v-else>暂无</span>
							</el-form-item> -->
							<!-- <el-form-item label="领导评审改进方案：" prop="leaderMPlan">
								<a class="a-style" v-if="detailData.leaderMPlan" :href="detailData.leaderMPlan ? '/pics'+JSON.parse(detailData.leaderMPlan)[0].url : '' " target="view_window">
									{{JSON.parse(detailData.leaderMPlan)[0].name}}
								</a>
								<span v-else>暂无</span>
							</el-form-item> -->
						</div>
					</el-col>
				</el-row>
        
        <el-row :gutter="24">
          <el-col :span="12">
            <div class="grid-content bg-gray grid-content__">
            	<h4 class="base-title">
            		<img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
            		<span class="fl">上会材料</span>
            	</h4>
							<el-form-item label="网信会议-调整预算金额：" prop="budgetApproval">
								<span v-if="detailData.budgetApproval">{{detailData.budgetApproval+'万元'}}</span>
								<span v-else>暂无</span>
							</el-form-item>
							<el-form-item label="网信办意见：" prop="">
								<file-list v-if="detailData.metingFile" :fileList="JSON.parse(detailData.metingFile)"></file-list>
								<span v-else>暂无</span>
							</el-form-item>
							<el-form-item label="项目方案(简版)：" prop="">
								<file-list v-if="detailData.projectPlanSimple" :fileList="JSON.parse(detailData.projectPlanSimple)"></file-list>
								<span v-else-if="detailData.projectPlanSimple == 'null'">未上传</span>
								<span v-else>暂无</span>
							</el-form-item>
							<el-form-item label="申报单位汇报稿：" prop="">
								<file-list v-if="detailData.leaderReport" :fileList="JSON.parse(detailData.leaderReport)"></file-list>
								<span v-else-if="detailData.leaderReport == 'null'">未上传</span>
								<span v-else>暂无</span>
							</el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-gray grid-content__">
              <h4 class="base-title">
                <img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
                <span class="fl">财政意见</span>
              </h4>
							<el-form-item label="财政意见-调整预算金额：" prop="budgetFinance">
								<span v-if="detailData.budgetFinance">{{detailData.budgetFinance+'万元'}}</span>
								<span v-else>暂无</span>
							</el-form-item>
							<el-form-item label="财政专家评审意见：" prop="financeDudget">
								<!-- <a v-if="detailData.financeDudget" class="fl a-style" :href="detailData.financeDudget ? '/pics'+JSON.parse(detailData.financeDudget)[0].url : ''" target="view_window">
									{{JSON.parse(detailData.financeDudget)[0].name }}
								</a> -->
								<file-list v-if="detailData.financeDudget" :fileList="JSON.parse(detailData.financeDudget)"></file-list>
								<span v-else>暂无</span>
							</el-form-item>
              <el-form-item label="项目建设方案(终审稿)：" prop="financePlan">
                <a class="a-style" v-if="detailData.financePlan" :href="detailData.financePlan ? '/pics'+JSON.parse(detailData.financePlan)[0].url : '' " target="view_window">
                  {{ JSON.parse(detailData.financePlan)[0].name }}
                </a>
                <span v-else>暂无</span>
              </el-form-item>
              <!-- <el-form-item label="项目方案简报：" prop="projectBriefing">
                <a v-if="detailData.projectBriefing" class="fl a-style" :href="detailData.projectBriefing ? '/pics'+JSON.parse(detailData.projectBriefing)[0].url : ''" target="view_window">
                  {{JSON.parse(detailData.projectBriefing)[0].name }}
                </a>
                <span v-else>暂无</span>
              </el-form-item> -->
            </div>
          </el-col>
        </el-row>
      </el-form>
      <!-- 编辑按钮 -->
      <!-- <div v-show="projectIsEdit == '0' ">
        <el-button class="edit-btn" size="small" type="primary" @click="editProject" icon="el-icon-edit">编辑</el-button>
      </div> -->
    </div>
    <!-- 表单信息 -->
    <div  v-if="isShowForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="180px" class="demo-ruleForm base-info" size="middle" enctype="multipart/form-data" v-if="detailData">
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="grid-content bg-gray">
              <h4 class="base-title">
                <img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
                <span class="fl">基本信息</span>
              </h4>
              <el-form-item label="项目名称：" prop="name" >
                <el-input v-model="ruleForm.name" placeholder="请输入项目名称"></el-input>
              </el-form-item>
              <el-form-item label="申报单位：" prop="company">
                <span> {{ companyName }} </span>
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
              <el-form-item label="来源备注：" prop="budgetRemarks" id='mark'>
                <el-input type="textarea" :placeholder="'请输入来源备注'" v-model="ruleForm.budgetRemarks"></el-input>
              </el-form-item>
              <el-form-item label="资金落实情况：" prop="resource">
                <el-radio-group v-model="ruleForm.resource">
                  <el-radio label="已落实"></el-radio>
                  <el-radio label="未落实"></el-radio>
                </el-radio-group>
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
              <el-checkbox label="民心工程项目" @change='heart_'></el-checkbox>
              <el-checkbox label="绩效考核项目" @change='achievements_'></el-checkbox>
              <el-checkbox label="其他项目" @change='else_'></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="自建项目立项依据：" prop="projectBasis" v-if="selfBasis">
            <el-input type="textarea" :placeholder="'请填写备注'" v-model="ruleForm.projectSelfBasis"></el-input>
          </el-form-item>
          <el-form-item label="民心工程项目立项依据：" prop="projectBasis" v-if="heartBasis">
            <el-input type="textarea" :placeholder="'请填写文件依据文号'" v-model="ruleForm.projectHeartBasis"></el-input>
          </el-form-item>
          <el-form-item label="绩效考核项目立项依据：" prop="projectBasis" v-if="achievementsBasis">
            <el-input type="textarea" :placeholder="'请填写文件依据文号'" v-model="ruleForm.projectAchievementsBasis"></el-input>
          </el-form-item>
          <el-form-item label="其他项目立项依据：" prop="projectBasis" v-if="elseBasis">
            <el-input type="textarea" :placeholder="'请填写文件依据文号'" v-model="ruleForm.projectElseBasis"></el-input>
          </el-form-item>
          <el-form-item label="'三重一大'会议纪要：" class="middle is-required" prop="file1">
            <el-upload
              class="upload-demo"
              ref="uploadFlie1"
              :file-list="ruleForm.file1"
              :on-preview="handlePreview"
              :before-remove="beforeRemove1"
              :before-upload="beforeUpload"
              :action="`${common.basePath}/file/-1/uplode`"
              :headers="myHeaders"
              :auto-upload="true"
              multiple
              :limit="1"
              :on-success="uploadSuccessFile1"
              :on-error="uploadErrorFile1">
              <el-button slot="trigger" size="small" type="primary">上传文件</el-button>
              <span slot="tip" class="el-upload__tip" style="margin-left: 10px;">请上传关于本项目“三重一大”会议纪要节选(加盖公章)</span>
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
            <div class="file-position"><a :href="`${common.picsBasePath}/public/project/-1/yaohy/1540299977546.doc`" target="view_window">项目方案模版</a></div>
          </el-form-item>
          <el-form-item label="项目方案(简版)：" class="middle is-required" prop="file4">
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
          </el-form-item>
          <el-form-item label="附件材料：" class="middle is-required" prop="file6">
            <el-upload
              class="upload-demo"
              ref="uploadFlie6"
              :file-list="ruleForm.file6"
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
        <!-- <div class="grid-content bg-gray grid-content_">
          <h4 class="base-title">
            <img src="../../../assets/img/系统管理_icon.png" alt="" class="fl">
            <span class="fl">改进方案</span>
          </h4>
          <el-form-item label="预审改进方案：" class="middle is-required" prop="budgetMPlan" v-if='detailData.curStatus==13'>
            <el-upload
              class="upload-demo"
              ref="uploadFlieBudget"
              :file-list="ruleForm.budgetMPlan"
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
          <el-form-item label="专家评审改进方案：" class="middle is-required" prop="expertMMPlan" v-if='detailData.curStatus==14'>
            <el-upload
              class="upload-demo"
              ref="uploadFlieExpert"
              :file-list="ruleForm.expertMMPlan"
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
          <el-form-item label="领导评审改进方案：" class="middle is-required" prop="leaderMPlan" v-if='detailData.curStatus==6'>
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
          </el-form-item>
        </div> -->
        
        <el-form-item class="text-center">
          <el-button type="primary" @click="submitForm('ruleForm')">提交审批</el-button>
          <el-button @click="stopDeclare">停止申报</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="css" scoped>
  .file-img{
    height: 30px;
    width: 40px;
    vertical-align: middle;
    margin-right: 20px;
  }
  .el-button--small{
    padding: 10px 40px !important;
  }
</style>

<script>
  import fileList from "@/components/FileList.vue"
  export default {
    props:{
      projectId: {
        required: true,
      }
    },
    components: {
      "file-list": fileList
    },
    computed: {
      companyName () {
        let self = this
        this.ruleForm.company
        let name = null
        this.company.forEach((item, index) => {
          if (this.ruleForm.company == item.id) {
            name = item.name
          }
        })
        return name
      }
    },
    data(){
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
      return{
        isLoading:true,
        detailData:null,
        budgetRoute:['','国家专项资金','市财政资金','区财政资金','其他资金'],
        
        isShowBaseInfo:true,
        projectIsEdit:sessionStorage.getItem('declareProjectIsEdit'), // 1为不可编辑，其他的都为可编辑
        isShowForm:false,
        
        isShowBasisBox1:true,
        isShowBasisBox2:false,
        heartBasis:false,
        achievementsBasis:false,
        elseBasis:false,
        selfBasis:false,
        instanceId:null,
        assignee:null,
        myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
        uploadForm: {
          file1: [],
          // file2: [],
          file3: [],
          file4: [],
          // file5: [],
          file6: [],
          /* leaderMPlan:[],
          budgetMPlan:[],
          expertMMPlan:[], */
        },   // 一个formdata
        company:[],
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
          name: '',
          company: '',
          companyId:'',
          people:'',
          contacts:'',
          tel:'',
          phone:'',
          mail:'',
          budgetMoney:'',
          type: '',
          resource: '',
          projectType:'',
          budgetRemarks:'',
          projectSelfBasis:'',
          projectHeartBasis:'',
          projectAchievementsBasis:'',
          projectElseBasis:'',
          file1: [],
          // file2: [],
          file3: [],
          file4: [],
          // file5: [],
          file6: [],
          /* leaderMPlan:[],
          budgetMPlan:[],
          expertMMPlan:[], */
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
          budgetMoney: [
            { required: true, message: '请输入项目金额', trigger: 'blur' },
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个预算来源', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择资金落实情况', trigger: 'change' }
          ],
          projectType: [
            { required: true, message: '请选择项目类型', trigger: 'change' }
          ],
          /* projectBasis: [
            { required: true, message: '请输入立项依据', trigger: 'blur' }
          ], */
        },
      };
    },
    methods:{
      /*
      * 获取详情
      */
      getDetail(){
        let self = this
        self.isLoading = true;
        self.axios.get(`${self.common.basePath}/project/detail/${self.projectId}`,self._detailParams()).then( (response) => {
          if(response.data.meta.code === 0){
            self.detailData = response.data.data;
						
            console.log(JSON.parse(response.data.data.remarksFile).slice(1))
            if(response.data.data.projectSelfBasis!=''){
              self.selfBasis = true;
            }
            if(response.data.data.projectSelfBasis==null){
              self.selfBasis = false;
            }
            if(response.data.data.projectHeartBasis!=''){
              self.heartBasis = true;
            }
            if(response.data.data.projectHeartBasis==null){
              self.heartBasis = false;
            }
            if(response.data.data.projectAchievementsBasis!=''){
              self.achievementsBasis = true;
            }
            if(response.data.data.projectAchievementsBasis==null){
              self.achievementsBasis = false;
            }
            if(response.data.data.projectElseBasis!=''){
              self.elseBasis = true;
            }
            if(response.data.data.projectElseBasis==null){
              self.elseBasis = false;
            }
            self.ruleForm.name = response.data.data.name;
            self.ruleForm.company = response.data.data.orgId;
            self.ruleForm.companyId = response.data.data.orgId;
            self.ruleForm.people = response.data.data.linkman;
            self.ruleForm.contacts = response.data.data.liabilityUser;
            self.ruleForm.tel = response.data.data.tel;
            self.ruleForm.phone = response.data.data.phone;
            self.ruleForm.mail = response.data.data.mail;
            
            self.ruleForm.budgetMoney = response.data.data.budgetMoney;
            self.ruleForm.type = response.data.data.budgetType;
            self.ruleForm.budgetRemarks = response.data.data.budgetRemarks;
            self.ruleForm.resource = response.data.data.financialSituation;
            self.ruleForm.projectType = JSON.parse(response.data.data.projectType);
            self.ruleForm.projectSelfBasis = response.data.data.projectSelfBasis;
            self.ruleForm.projectHeartBasis = response.data.data.projectHeartBasis;
            self.ruleForm.projectAchievementsBasis = response.data.data.projectAchievementsBasis;
            self.ruleForm.projectElseBasis = response.data.data.projectElseBasis;
            
            self.ruleForm.file1 = JSON.parse(response.data.data.meetingSummary);
            self.ruleForm.file3 = JSON.parse(response.data.data.projectPlan);
            self.ruleForm.file4 = JSON.parse(response.data.data.projectPlanSimple);
            self.ruleForm.file6 = JSON.parse(response.data.data.remarksFile)==null?[]:JSON.parse(response.data.data.remarksFile);
            // this.ruleForm.file2 = JSON.parse(response.data.data.financePlan);
            // this.ruleForm.file5 = JSON.parse(response.data.data.financeDudget);
            /* this.ruleForm.leaderMPlan = JSON.parse(response.data.data.leaderMPlan);
            this.ruleForm.budgetMPlan = JSON.parse(response.data.data.budgetMPlan);
            this.ruleForm.expertMMPlan = JSON.parse(response.data.data.expertMMPlan); */
            
            self.uploadForm.file1 = JSON.parse(response.data.data.meetingSummary);
            self.uploadForm.file3 = JSON.parse(response.data.data.projectPlan);
            self.uploadForm.file4 = JSON.parse(response.data.data.projectPlanSimple);
            self.uploadForm.file6 = JSON.parse(response.data.data.remarksFile);
            // this.uploadForm.file2 = JSON.parse(response.data.data.financePlan);
            // this.uploadForm.file5 = JSON.parse(response.data.data.financeDudget); 
            /* this.uploadForm.leaderMPlan = JSON.parse(response.data.data.leaderMPlan);
            this.uploadForm.budgetMPlan = JSON.parse(response.data.data.budgetMPlan);
            this.uploadForm.expertMMPlan = JSON.parse(response.data.data.expertMMPlan); */
            self.isLoading = false;

          }else{
            self.$message.error(response.data.meta.message, 20);
          }
        }).catch((error) => {
          self.$message.error(error);
          self.isLoading = false;
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
        获取申报单位
      */
      getDeclareUnit(){
        var formData = {
          id:6,
        }
        this.axios.post(`${this.common.basePath}/hr_users/user/list`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            this.company = response.data.data;
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
        }).catch( (error) => {
          this.$message.error(error,20);            
        });
      },
    
      
      
      /* 
      编辑
      */
      editProject(){
        this.detailData;
        this.elseCheckboxBoolean_();
        if(this.detailData.curStatus==20){
          this.again1();
        }else{
          this.isShowBaseInfo = false;
          this.isShowForm = true;
        }
      },
      
      /* 
        确认继续申报请求
      */ 
      again1(){
        var formData = {
          read_status:1,
          curStatus:20,
          instanceId:JSON.parse(sessionStorage.getItem("rowDeclareDetailInfo")).processVariables.instanceId,
          assignee:JSON.parse(sessionStorage.getItem("rowDeclareDetailInfo")).processVariables.assignee,
        }
        this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            //this.$message.success(response.data.meta.message, 20);
            this.isShowBaseInfo = false;
            this.isShowForm = true;
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
        }).catch( (error) => {
          this.$message.error(error,20);            
        });
      },
      
      
      
      /* 
      立项依据输入框的显示 
      */
      self_(val){
        this.selfBasis = val;
      },
      achievements_(val){
        this.achievementsBasis = val;
      },
      else_(val){
        this.elseBasis = val;
      },
      heart_(val){
        this.heartBasis = val;
      },
      
      /* 
        其他资金来源输入框
       */
      elseCheckboxBoolean(val){
        //设置必填样式
        if(val === true){
          document.getElementById('mark').setAttribute('class','is-required el-form-item el-form-item--small');
          sessionStorage.setItem('mark','1')
        }else{
          document.getElementById('mark').setAttribute('class','el-form-item el-form-item--small')
          sessionStorage.setItem('mark','2')
        }
        
      },
      elseCheckboxBoolean_(){
        //设置必填mark
        if(this.ruleForm.type.lastIndexOf(4)!=-1){
          sessionStorage.setItem('mark','1')
        }else{
          sessionStorage.setItem('mark','2')
        }
      },
      
      
      /* 
       停止申报
       */
      stopDeclare(){
        this.isShowBaseInfo = true;
        this.isShowForm = false;
        // this.isEdit = false;
        this.$prompt('请输关闭原因', '提示', {
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
          instanceId:JSON.parse(sessionStorage.getItem("rowDeclareDetailInfo")).processVariables.instanceId,
        }
        this.axios.post(`${this.common.basePath}/activiti/instance/delete`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            //this.$message.success(response.data.meta.message, 20);
            this.$router.push({path: '/project_set_up/declare'});
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
        }).catch( (error) => {
          this.$message.error(error,20);            
        });
      },
      
      /* 
      提交申报按钮 
      */ 
      submitForm(formName) {
        //console.log(this.$refs[formName])
        this.$refs[formName].validate((valid) => {
          if (valid) {
            
            this.uploadForm.name = this.ruleForm.name
            this.uploadForm.company = this.ruleForm.companyId
            this.uploadForm.people = this.ruleForm.people
            
            this.uploadForm.contacts = this.ruleForm.contacts
            this.uploadForm.tel = this.ruleForm.tel
            this.uploadForm.phone = this.ruleForm.phone
            
            this.uploadForm.mail = this.ruleForm.mail
            this.uploadForm.budgetMoney = this.ruleForm.budgetMoney
            this.uploadForm.type = this.ruleForm.type
            this.uploadForm.resource = this.ruleForm.resource
            this.uploadForm.projectType = this.ruleForm.projectType
            
            this.uploadForm.budgetRemarks = this.ruleForm.budgetRemarks
            this.uploadForm.projectSelfBasis = this.ruleForm.projectSelfBasis
            this.uploadForm.projectHeartBasis = this.ruleForm.projectHeartBasis
            this.uploadForm.projectAchievementsBasis = this.ruleForm.projectAchievementsBasis
            this.uploadForm.projectElseBasis = this.ruleForm.projectElseBasis
            this.uploadForm.assignee = JSON.parse(sessionStorage.getItem("rowDeclareDetailInfo")).processVariables.assignee
            this.uploadForm.instanceId = JSON.parse(sessionStorage.getItem("rowDeclareDetailInfo")).processVariables.instanceId
            
            this.uploadForm.file1 = this.ruleForm.file1
            this.uploadForm.file2 = ''
            this.uploadForm.file3 = this.ruleForm.file3
            this.uploadForm.file4 = this.ruleForm.file4
            this.uploadForm.file5 = ''
            this.uploadForm.file6 = this.ruleForm.file6
            /* this.uploadForm.leaderMPlan = this.ruleForm.leaderMPlan
            this.uploadForm.budgetMPlan = this.ruleForm.budgetMPlan
            this.uploadForm.expertMMPlan = this.ruleForm.expertMMPlan */
            
            this.uploadForm.curStatus = this.detailData.curStatus
            
            this.$confirm('是否申报该项目？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.declare();
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消申报'
              });          
            });
          } else {
            this.$message.warning('申报信息不完整或者填写错误!!!', 60);
            return false;
          }
        });
      },
      
      /* 
       提交项目申报信息表单
       */
      declare(){
        if(sessionStorage.getItem("mark")==='1'){
          if(this.uploadForm.budgetRemarks == null){
            this.$message.error('预算的 其他来源备注 缺失!!!', 60);
            sessionStorage.removeItem("mark")
            return;
          }
        }
        if(this.uploadForm.file1.length === 0){
          this.$message.error('上传的 “三重一大”会议纪要 缺失!!!', 60);
          return;
        }
        if(this.uploadForm.file3.length === 0){
          this.$message.error('上传的 项目方案 缺失!!!', 60);
          return;
        }
        if(this.uploadForm.file4.length === 0){
          this.$message.error('上传的 项目方案(简版) 缺失!!!', 60);
          return;
        }
        /* if(this.uploadForm.expertMMPlan == undefined&&this.detailData.curStatus == 14){
          this.$message.error('上传的 专家评审改进方案 缺失!!!', 60);
          return;
        }
        if(this.uploadForm.budgetMPlan == undefined&&this.detailData.curStatus == 13){
          this.$message.error('上传的 预审改进方案 缺失!!!', 60);
          return;
        }
        if(this.uploadForm.leaderMPlan == undefined&&this.detailData.curStatus == 6){
          this.$message.error('上传的 领导评审改进方案 缺失!!!', 60);
          return;
        } */
        this.axios.post(`${this.common.basePath}/activiti/complete`,this.uploadForm).then( (response) => {
          if(response.data.meta.code === 0){
            // this.$message.success(response.data.meta.message, 20);
            this.isShowBaseInfo = true;
            this.isShowForm = false;
            // this.isEdit = false;
            // this.getDetail();
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
        文件上传成功后，点击查看文件
       */
      handlePreview(file){
        
      },
      
      /* 
        上传文件 ---文件上传成功时
      */
      uploadSuccessFile1(res) {
        this.ruleForm.file1 = [{name:res.data.name,url:res.data.path}]
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
        this.ruleForm.expertMMPlan = [{name:res.data.name,url:res.data.path}]
      },
      uploadSuccessFileBudget(res, file, fileList) {
        this.ruleForm.budgetMPlan = [{name:res.data.name,url:res.data.path}]
      },
      uploadSuccessFile6(res, file, fileList) {
        this.ruleForm.file6 = fileList
      },
      
      /* 
        上传文件 ---文件上传失败时
      */
      uploadErrorFile1(err, file, fileList) {
        this.$message.error('上传失败!!', 20);
        this.ruleForm.file1 = []
      },
      uploadErrorFile3(err, file, fileList) {
        this.$message.error('上传失败!!', 20);
        this.ruleForm.file3 = []
      },
      uploadErrorFile4(err, file, fileList) {
        this.$message.error('上传失败!!', 20);
        this.ruleForm.file4 = []
      },
      uploadErrorFileLeader(err, file, fileList) {
        this.$message.error('上传失败!!', 20);
        this.ruleForm.leaderMPlan = []
      },
      uploadErrorFileExpert(err, file, fileList) {
        this.$message.error('上传失败!!', 20);
        this.ruleForm.expertMMPlan = []
      },
      uploadErrorFileBudget(err, file, fileList) {
        this.$message.error('上传失败!!', 20);
        this.ruleForm.budgetMPlan = []
      },
      uploadErrorFile6(err, file, fileList) {
        this.$message.error('上传失败!!', 20);
        this.ruleForm.file6 = []
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
      beforeRemove3(file, fileList) {
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
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
    },
    mounted() {
      /* 
      获取详情 
      */
      this.getDetail();
      
      /* 
      申报单位
      */
      this.getDeclareUnit();
    },
  }
</script>

<style lang="less">
  .base-info{
    .grid-content {
      border-radius: 4px;
      min-height: 550px;
      padding: 18px 24px;
      box-sizing: border-box;
      margin-bottom: 15px;
      .base-title{
        height: 39px;
        padding: 0 0 0 20px;
        margin: 0 0 18px 0;
        font-size: 16px;
        font-weight: normal;
        line-height: 39px;
        border-bottom: 1px solid #d8e1f6;
        img{
          width: 30px;
          height: 30px;
          vertical-align: middle;
          margin: 5px 5px 0 0;
        }
      }
      .el-form-item{
        .a-style{
          color: #147cf4;
          text-decoration: none;
        }
        .a-style:hover{
          color: #0000FF;
        }
      }
      .el-form-item__label{
        background: none;
        border-right:none;
      }
    }
    .grid-content_{
      min-height: 480px;
    }
    .grid-content__{
      min-height: 360px;
    }
    .bg-gray {
      background: #f6fbfe;
    }
  } 
</style>