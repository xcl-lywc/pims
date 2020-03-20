<!-- 
  项目申报详情
 -->
<template>
  <div class="project-detail">
    <h2 class="page-title">项目申报</h2>
    <!-- <el-button class="back-button" type="primary" icon="el-icon-back" size="middle"  @click=" $router.go(-1) ">返回</el-button> -->
    <div class="block-wrap wrap-box-position" v-if="detailData">
			<div v-bind:class="{'top-fixed_v':isVclass,'top-fixed_h':isHclass,'top-fixed':true}">
				<div class="gray-line"></div>
				<h4 class="block-title"> 
					<el-breadcrumb separator-class="el-icon-arrow-right" class="bread-style">
						<el-breadcrumb-item :to="{ path: '-1' }"><span @click="back">{{stageNameArr[tabPosition]}}</span></el-breadcrumb-item>
						<el-breadcrumb-item>列表</el-breadcrumb-item>
						<el-breadcrumb-item>详情</el-breadcrumb-item>
					</el-breadcrumb>
				</h4>
				<div class="block-step">
					<p class="name-title">{{'项目名称：'+detailData.name}}</p>
					<el-steps :active="stepNow" finish-status="success" align-center>
						<el-step v-for="(item, index) in stepsHistory" :title="item.taskName" :key="`${item.taskName}${index}`">
							<template slot="title">
								<el-popover
									v-if="item.childrens && item.childrens.length > 0"
									placement="bottom"
									trigger="hover"
									popper-class="popper-opcity">
									<p v-for="(itemInner, indexInner) in item.childrens">
										<el-button class="step-popover-item" type="text" @click="taskBindFun(itemInner)">
											{{ common._convertDate(itemInner.endTime , 'yyyy-MM-dd') == '无' ? '' : common._convertDate(itemInner.endTime , 'yyyy-MM-dd') }}
											{{ itemInner.taskLocalVariables.cur_status == 15 ? itemInner.taskLocalVariables.pointName : itemInner.taskName }}
											<!-- {{itemInner.taskLocalVariables.cur_status}} - {{itemInner.taskLocalVariables.read_status}} -->
											<i v-if="!(itemInner.taskLocalVariables.cur_status == 1 || (itemInner.taskLocalVariables.cur_status == 2 && itemInner.taskLocalVariables.read_status == 1) || itemInner.taskLocalVariables.cur_status == 3 || itemInner.taskLocalVariables.cur_status == 5 || itemInner.taskLocalVariables.cur_status == 15 || (itemInner.taskLocalVariables.cur_status == 12 && itemInner.taskLocalVariables.read_status == 1) || itemInner.taskLocalVariables.cur_status == 18)" class="fa fa-info-circle"></i>
										</el-button>
									</p>
									<label slot="reference" class="popover-reference">
										{{item.taskName}}
										<span>{{item.isReject ? "(已关闭)" : ""}}</span>
									</label>
								</el-popover>
								<span v-else>{{item.taskName}}</span>
							</template>
						</el-step>
					</el-steps>
				</div>
			</div>
      <div class="block-body mrt-b">
        <div class="body-content">
          <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
            <el-tab-pane label="基础信息" name="base">
              <base-info :projectId="projectId"></base-info>
            </el-tab-pane>
            <el-tab-pane label="申报历史" name="history">
              <!-- <h4 class="block-depart-title">申报流程</h4>
              <img src="../../../assets/img/demo2.jpg" alt="" class="fill-width"> -->

              <h4 class="block-depart-title">历史记录
								<el-button type="primary" icon="fa fa-print" size="small" class="fr" @click="print"> 打 印</el-button>
							</h4>
							<div class="clear"></div>
							<!-- 打印模版 window.screen.width-->
							<div id="myDivId" style="width: calc(100%);">
								<p class="name-title">{{'项目名称：'+detailData.name}}</p>
								<ul v-loading="isLoading" class="time-line_ pic">
									<!--开始-->
									<div>
										<el-button type="" size="middle" class="clear tl-title" round>开&nbsp;&nbsp;始</el-button>
									</div>
									<!--各个阶段-->
									<div> 
										<ul class="tl-item" v-for="(item,index) in history">
											<li class="tl-item-left fl">
												{{item.taskName}}
											</li>
											<li class="tl-item-right fl b-c-e">
												<!-- 有流程任务Id能查看详情 -->
												<i v-if="item.processTaskId" class="tl-item-right-rount huise-rount" @click="taskBindFun(item)"></i>
											
												<i v-else class="tl-item-right-rount"></i>
											
												<div class="content-child-scorll">
													<div class="content-child">
														<!-- 没有子节点是就显示时间 -->
														<span v-if="!item.childrens" class="child-item-span">
															{{item.processTaskId ? common._convertDate(item.createTime , 'yyyy-MM-dd') : ''}}
														</span>
														
														<!-- 显示子节点 -->
														<ul v-if="item.childrens" class="tr-item fl" :class="{'tr-item-last': (indexChild +1) == item.childrens.length}" v-for="(itemChild,indexChild) in item.childrens">
															<li class="tr-item-top">
																{{common._convertDate(itemChild.endTime , 'yyyy-MM-dd') }}
															</li>
															<li class="tr-item-bottom">
																<i class="tr-item-bottom-rount huise-rount" @click="taskBindFun(itemChild)"></i>
																<div class="content_">
																	<span class="arrow-top fl"></span>
																	<div class="content-title fl">
																		{{ itemChild.taskLocalVariables.cur_status == 15 ? itemChild.taskLocalVariables.pointName : `${itemChild.taskName}`}}
																	</div> 
																</div>
															</li>
														</ul>
													</div>
												</div>
												<!--  -->
											</li>
										</ul>
									</div>
									<!--现在-->
									<div>
										<el-button type="" size="middle" class="clear tl-title tl-title-color">
											{{detailData.stage == 9 ? '已完结' : '未完结'}}
										</el-button>
									</div>
								</ul>
							</div>
              

              <!-- <h4 class="block-depart-title">调整后的效果</h4>
              <img src="../../../assets/img/demo.jpg" alt=""> -->
            </el-tab-pane>
            <el-tab-pane label="进度汇报" name="schedule">
              <progress-report :projectId="projectId" @addPointEmit="addPointEmitClick"></progress-report>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div> 
    <!-- 弹出文件图片 -->
    <el-dialog
      title="文件图片"
      :visible.sync="fileDialogVisible"
      width="50%"
      :show-close="false"
      >
      <img :src="common.picsBasePath + fileUrl" alt="" style="width: 100%;">
    </el-dialog>
    <el-dialog
      v-if="false"
      v-show="itemTask.taskLocalVariables"
      class="time-line_"
      :title="itemTask.taskName"
      width="50%">
      <div class="content_"> 
        <!-- 当读取状态为0，显示特定的字段  -->
        <div v-if="itemTask.taskLocalVariables.read_status == 0 || itemTask.taskLocalVariables.read_status == 2">
          <div class="clear">
            驳回意见：{{itemTask.taskLocalVariables.rejectReason ? itemTask.taskLocalVariables.rejectReason : '无'}}
            <!-- 暂时隐藏不能删除 -->
            <!-- <el-input type="textarea" v-model="itemTask.taskLocalVariables.rejectReason"></el-input>
                <el-button class="mart10" size="middle" type="primary" @click="saveMettingMsg(itemTask,'rejectReason')">保存</el-button> -->
          </div>

        </div>
        <div v-else> 
          <!-- 显示附件 -->
          <div v-if="itemTask.taskLocalVariables.cur_status == 8 || itemTask.taskLocalVariables.cur_status == 11">
            <!-- 上会材料 -->
            <div v-if="itemTask.taskLocalVariables.cur_status == 8"  v-show="itemTask.taskLocalVariables.metingFile ? itemTask.taskLocalVariables.metingFile.length : false" class=" clear">
              上会材料：
              <p v-for="(itemTaskMetting, indexMetting) in itemTask.taskLocalVariables.metingFile"
                 :key="indexMetting">
                 <el-tag class="mart10" size="middle" :closable="true" @close="mettingHandleRemove(indexMetting, itemTask)">
                   <a target="view_window" :href="`/pics/${itemTaskMetting.url}`">
                    {{itemTaskMetting.name}}
                  </a>
                 </el-tag>
              </p>
              <!-- 暂时隐藏不能删除 -->
              <!-- <el-upload
                class="upload-demo mart10"
                :action="`${common.basePath}/file/-1/uplode`"
                :headers="myHeaders"
                :show-file-list="false"
                :on-success="((res) => {successMettingHandlePreview(res,itemTask)})"  >
                <el-button size="middle" type="primary">新增</el-button>
              </el-upload> -->
            </div>
            <!-- 项目建设方案(终审稿)  -->
            <div v-if="itemTask.taskLocalVariables.cur_status == 11"  
                v-show="itemTask.taskLocalVariables.file2 ? itemTask.taskLocalVariables.file2.length : false" 
                class=" clear">
              项目建设方案(终审稿)：
              <p v-for="(itemTaskMetting, indexMetting) in itemTask.taskLocalVariables.file2"
                 :key="indexMetting">
                 <el-tag class="mart10" size="middle" :closable="true" @close="mettingHandleRemove(indexMetting, itemTask)">
                   <a target="view_window" :href="`/pics/${itemTaskMetting.url}`">
                    {{itemTaskMetting.name}}
                  </a>
                 </el-tag>
              </p>
              <!-- 暂时隐藏不能删除 -->
              <!-- <el-upload
                class="upload-demo mart10"
                :action="`${common.basePath}/file/-1/uplode`"
                :headers="myHeaders"
                :show-file-list="false"
                :on-success="((res) => {successMettingHandlePreview(res,itemTask)})"  >
                <el-button size="middle" type="primary">新增</el-button>
              </el-upload> -->
            </div>
            <!-- 项目预算(终审稿)   -->
            <div v-if="itemTask.taskLocalVariables.cur_status == 11"  
                v-show="itemTask.taskLocalVariables.file5 ? itemTask.taskLocalVariables.file5.length : false" 
                class=" clear">
              项目预算(终审稿)：
              <p v-for="(itemTaskMetting, indexMetting) in itemTask.taskLocalVariables.file5"
                 :key="indexMetting">
                 <el-tag class="mart10" size="middle" :closable="true" @close="mettingHandleRemove(indexMetting, itemTask)">
                   <a target="view_window" :href="`/pics/${itemTaskMetting.url}`">
                    {{itemTaskMetting.name}}
                  </a>
                 </el-tag>
              </p>
              <!-- 暂时隐藏不能删除 -->
              <!-- <el-upload
                class="upload-demo mart10"
                :action="`${common.basePath}/file/-1/uplode`"
                :headers="myHeaders"
                :show-file-list="false"
                :on-success="((res) => {successMettingHandlePreview(res,itemTask)})"  >
                <el-button size="middle" type="primary">新增</el-button>
              </el-upload> -->
            </div>
            <!-- 项目方案简报 -->
            <div v-if="itemTask.taskLocalVariables.cur_status == 11"  
                v-show="itemTask.taskLocalVariables.file99 ? itemTask.taskLocalVariables.file99.length : false" 
                class=" clear">
              项目方案简报：
              <p v-for="(itemTaskMetting, indexMetting) in itemTask.taskLocalVariables.file99"
                 :key="indexMetting">
                 <el-tag class="mart10" size="middle" :closable="true" @close="mettingHandleRemove(indexMetting, itemTask)">
                   <a target="view_window" :href="`/pics/${itemTaskMetting.url}`">
                    {{itemTaskMetting.name}}
                  </a>
                 </el-tag>
              </p>
              <!-- 暂时隐藏不能删除 -->
              <!-- <el-upload
                class="upload-demo mart10"
                :action="`${common.basePath}/file/-1/uplode`"
                :headers="myHeaders"
                :show-file-list="false"
                :on-success="((res) => {successMettingHandlePreview(res,itemTask)})"  >
                <el-button size="middle" type="primary">新增</el-button>
              </el-upload> -->
            </div>
          </div>
          <!-- 显示意见 -->
          <div v-if="itemTask.taskLocalVariables.cur_status == 9 || itemTask.taskLocalVariables.cur_status == 12">
            <div v-if="itemTask.taskLocalVariables.leaderOpinion" class="clear">
              <p>
                意见：
                {{itemTask.taskLocalVariables.leaderOpinion ? itemTask.taskLocalVariables.leaderOpinion : '无'}}
                <!-- 暂时隐藏不能删除 -->
                <!-- <el-input type="textarea" v-model="itemTask.taskLocalVariables.leaderOpinion"></el-input>
                <el-button class="mart10" size="middle" type="primary" @click="saveMettingMsg(itemTask,'leaderOpinion')">保存</el-button> -->
              </p>
            </div>
          </div>
        </div>

        <!-- 显示专家头像信息 -->
        <div v-if="itemTask.taskLocalVariables.cur_status == 4 || itemTask.taskLocalVariables.cur_status == 7"> 
          <div class=" clear" :class="{'pd0': !itemTask.opinionArr.length}">     
            {{itemTask.taskLocalVariables.cur_status == 4 ? itemTask.taskLocalVariables.pretrialOpinion : itemTask.taskLocalVariables.formalOpinion}}
          </div>
          <ul class="content-list">
            <li class="fl item-img" v-for="val in itemTask.opinionArr">
              <a href="#">
                <img :class="{'active-img': (itemTask.headimgindex == val.id) }" :src="val.picture" alt="" :onerror="headimg" @click="clickHeadImg(val,)"><i class="spot"></i>
              </a> 
            </li>
            <li class="fl item-img">
              <a href="#" class="add-btn">
                +{{itemTask.opinionArr.length}}名
              </a>
            </li>
            <li class="fl item-img item-text">
              {{ !itemTask.opinionArr.length ? '未审批' : '已审批' }}
            </li>
          </ul> 
          <div class="content-opinion mart16" v-for="val in itemTask.opinionArr" v-show="itemTask.headimgindex == val.id">
            <a  target="view_window" :href="val.comment ? common.picsBasePath  + JSON.parse(val.comment).path : ''">{{val.comment ? JSON.parse(val.comment).name : ''}}</a>
            <el-upload
              ref="commentUpload"
              class="upload-demo"
              :action="`${common.basePath}/file/-1/uplode`"
            :headers="myHeaders" 
              :on-success="((res)=>{handleRemoveComment(res, val, 'commentUpload')})" 
              :show-file-list="false"
              multiple
              :limit="1"  >
              <el-button class="mart10" size="middle" type="primary">{{val.comment ? '编辑' : '新增'}}</el-button>
            </el-upload> 
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 新的点击框 -->
    <el-dialog
      v-if="JSON.stringify(currentTask) != '{}'"
      :title="currentTask.taskName"
      :visible.sync="taskDialogVisible"
      width="60%">
      <el-form>

        <!-- 文本区域 -->
        <el-form-item v-if="(currentTask.taskLocalVariables.cur_status == 2 || currentTask.taskLocalVariables.cur_status == 4 || currentTask.taskLocalVariables.cur_status == 7 || currentTask.taskLocalVariables.cur_status == 12 ) && currentTask.taskLocalVariables.read_status != 1" label="返回原因: ">
          <span>{{ currentTask.taskLocalVariables.rejectReason }}</span>
        </el-form-item>
        <el-form-item v-if="currentTask.taskLocalVariables.cur_status == 9" label="审批意见: ">
          <span>{{ currentTask.taskLocalVariables.leaderOpinion }}</span>
        </el-form-item>

        <!-- 附件区域, 根据不同状态显示不同的 文件/附件 列表 -->
        <el-form-item v-if="currentTask.taskLocalVariables.cur_status == 8" label="上会材料: ">
          <file-list :fileList="currentTask.taskLocalVariables.metingFile || []"></file-list>
        </el-form-item>
        <el-form-item v-if="currentTask.taskLocalVariables.cur_status == 9" label="附件: ">
          <file-list :fileList="currentTask.taskLocalVariables.meetingAttachment"></file-list>
        </el-form-item>
        <el-form-item v-if="currentTask.taskLocalVariables.cur_status == 11 || currentTask.taskLocalVariables.cur_status == 16" label="财政专家评审意见: ">
          <file-list :fileList="currentTask.taskLocalVariables.file5"></file-list>
        </el-form-item>
        <el-form-item v-if="currentTask.taskLocalVariables.cur_status == 11 || currentTask.taskLocalVariables.cur_status == 16" label="项目建设方案(终审稿): ">
          <file-list :fileList="currentTask.taskLocalVariables.file2"></file-list>
        </el-form-item>
        <el-form-item v-if="currentTask.taskLocalVariables.cur_status == 13" label="预审方案: ">
					</br>
          <span>预审方案（一稿）：</span><file-list :fileList="currentTask.taskLocalVariables.budgetMPlan"></file-list>
					</br>
					<span v-if="currentTask.taskLocalVariables.budgetMMPlan">预审方案（二稿）：</span><file-list :fileList="currentTask.taskLocalVariables.budgetMMPlan"></file-list>
        </el-form-item>
        <el-form-item v-if="currentTask.taskLocalVariables.cur_status == 14" label="评审方案: ">
					</br>
          <span>评审方案（一稿）：</span><file-list :fileList="currentTask.taskLocalVariables.expertMPlan"></file-list>
					</br>
					<span v-if="currentTask.taskLocalVariables.expertMMPlan">评审方案（二稿）：</span><file-list :fileList="currentTask.taskLocalVariables.expertMMPlan"></file-list>
        </el-form-item>
        <el-form-item v-if="currentTask.taskLocalVariables.cur_status == 17" label="项目方案(简版): ">
          <file-list :fileList="currentTask.taskLocalVariables.file4"></file-list>
        </el-form-item>
        <el-form-item v-if="currentTask.taskLocalVariables.cur_status == 17" label="申报单位汇报稿: ">
          <file-list :fileList="currentTask.taskLocalVariables.leaderReport"></file-list>
        </el-form-item>

        <!-- 专家区域 cur_status == 4 || cur_status == 7 -->
        <div v-if="(currentTask.taskLocalVariables.cur_status == 4 || currentTask.taskLocalVariables.cur_status == 7) && currentExpertList.length > 0" label="上会材料: ">
          <el-button-group v-if="currentExpertList.length > 0">
            <img class="expert-head-img" v-for="(item, index) in currentExpertList" :key="`${item.assExpertName}${index}`" src="../../../assets/img/a1.jpg" @click="currentExpertIndex = index"></img>
          </el-button-group>
          <span v-if="currentExpertList.length > 0" type="text" disabled>共 {{currentExpertList.length}} 名专家</span>
          
          <!-- 已上传的专家意见 -->
          <div v-if="!!currentExpertList[currentExpertIndex].comment">
            <a :href="`${common.picsBasePath}${JSON.parse(currentExpertList[currentExpertIndex].comment).path}`" target="blank">
            {{ JSON.parse(currentExpertList[currentExpertIndex].comment).name }}</a>
          </div>
          <!-- 未上传意见时展示 -->
          <div v-else>
            <el-upload
              :action="`${common.basePath}/file/-1/uplode`"
              :headers="myHeaders"
              :show-file-list="false"
              :on-success="((res)=>{ uploadSuccess(res, 'commentUpload') })">
              <el-button size="middle" type="primary">选择文件</el-button>
            </el-upload>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div> 
</template>

<style lang="css">
  /* 时间轴的样式 */
  /* @import "../../../assets/style/time_line.css" */
	/* .el-popper[x-placement^="bottom"].popper-opcity{
		background-color: #172954 !important;
		box-shadow: 0 2px 12px 0 rgba(23, 41, 84, 0.1);
	}
	.el-popper[x-placement^="bottom"].popper-opcity .popper__arrow::after{
		border-bottom-color: #172954 !important;
	} */
</style>

<script>
  import {formatDate} from '../../../plugins/data.js';
  import  progressReport from './ProgressReport.vue';
  import  fileList from '@/components/FileList.vue';
  import  baseInfo from './BaseInfo.vue';
  export default {
    components: {
      'progress-report': progressReport,
      'base-info': baseInfo,
      'file-list': fileList
    },
    /* 
      转化时间戳
    */
    filters: {
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      }
    },
    computed: {
      returnObject (string) {
        return JSON.parse(string)
      }
    },
    data(){
      return{
				isVclass:sessionStorage.getItem("navMode")=="vertical"||!sessionStorage.getItem("navMode")?true:false,
				isHclass:sessionStorage.getItem("navMode")=="horizontal"?true:false,
        chnNumChar: ['一','二','三','四','五','六','七','八','九','十','十一','十二','十三','十四','十五','十六','十七','十八','十九','二十'],
        fileDialogVisible: false,
        taskDialogVisible: false,
        fileUrl: null,
        isShowBaseInfo: null,
        isShowForm: null,
        stageNameArr:['','项目申报','项目受理','项目预审','专家评审','网信会议','财政意见','项目归档','进度汇报','进度汇报','','','','','','','','','','进度汇报'],
        isLoading: true,
        userData: JSON.parse(sessionStorage.getItem('userData')),
        //详情
        projectId:this.$route.params.id,
        detailData:null,
				
				isShowPrintTemplate:false,
        
        activeName: 'base',
        tabPosition:'',
        
        isShowAddPoint:false,
        pointDetail:'',
        point:'',
        token:{ "Authorization": `Bearer ${JSON.parse(sessionStorage.getItem("token"))}`},
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        formSchedule:{
          pointDate: '',
          attachment: '',
          payMoney:'',
          schedule:'',
          remark:'',
          pointName:'',
        },
        pointDate: '',
        attachment: '',
        payMoney:'',
        schedule:'',
        point_desc:'',
        point_name:'',
        isShowSchedulePoint:true,
        isShowScheduleText:false,
        
        history:[],
        stepsHistory: [],
        currentTask: {}, //当前点击的节点对象 包含全部信息
        currentExpertList: [], //当前点击的节点对应的专家数组
        currentExpertIndex: 0, //当前专家index, 用于切换显示
        processTaskIdArr:[],
        opinionArr:[],
        headimg: 'this.src="' + require('../../../assets/img/a8.jpg') + '"',//默认头像
        opinionContent:'',
        headimgindex:'',
        placeholder:'请填写你的宝贵审核意见...',
        myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
        itemTask: null, //单个任务数据
      };
    },
    methods: {
			/* 
			 打印历史
			 */
			print(){
				if(document.getElementById("myDivId")){
					var newstr = document.getElementById("myDivId").innerHTML;//得到需要打印的元素HTML
					
					var oldstr = document.body.innerHTML;//保存当前页面的HTML
					
					document.body.innerHTML = newstr;
					
					document.getElementsByClassName("pic")[0].style.width = "1800px";

					window.print();

					// document.body.innerHTML = oldstr;
					location.reload();//js失效，需重新加载
				}
			},
      /* 
       返回上一级
       */
      back(){
        this.$router.back(-1);
      },
      
      /*
       * 验证项目进度
       */
      validatorProgress(rule, value, callback){
        let regex = /^\d+$/;
        if(regex.test(value)){
          if(value > 100){
            callback(new Error('只能填写小于一百的正整数'));
          }else{
            callback();
          }
        }else{
          callback(new Error('只能填写小于一百的正整数'));
        }
        
      },
      
      /*
      * 获取详情
      */
      getDetail(){
        this.isLoading = true;
        this.axios.get(`${this.common.basePath}/project/detail/${this.projectId}`,this._detailParams()).then( (response) => {
            this.detailData = response.data.data; 
            this.tabPosition = response.data.data.stage;
            this.isLoading = false;
            this.processHistory();
        }).catch( (error) => {
          this.$message.error(error);
          this.isLoading = false;
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
      * 获取节点详情
      */
      getPointDetail(){
        this.axios.get(`${this.common.basePath}/checkpoint/point/${this.projectId}`,this._pointDetailParams()).then( (response) => {
          // this.$message.success(response.data.meta.message, 20);
          this.pointDetail = response.data.data;
          this.point = response.data.data.checkPoint;
          if(response.data.data.stage == 8){
            this.isShowSchedulePoint = false;
            this.isShowScheduleText = true;
          } 
          
        }).catch( (error) => {
          this.$message.error(error); 
        });
      },
      _pointDetailParams(){
        return {
          params: {
            projectId:this.projectId,
          }
        }
      },
      addPointEmitClick(){
        this.getDetail();
      },
      
      /* 
        流程历史
      */
      processHistory(){
        this.isLoading = true;
        var formData = {
          instanceId:this.detailData.instanceId,
        }
        this.axios.post(`${this.common.basePath}/activiti/history`,formData).then( (response) => {
          this.stepsHistory = JSON.parse(JSON.stringify(response.data.data))
          this._forEachHistory(response.data.data).then( (responseData) => {
            this.history = responseData;
            this.isLoading = false;
          });
        }).catch( (error) => {
          this.$message.error(error,20);  
          this.isLoading = false;          
        });
      },
      /*
       * 遍历历史记录
       */
      _forEachHistory(data){
        return new Promise ((resolve, reject) => {
          data.forEach((item) => {
            item.opinionArr = [];
            if(item.childrens){
              item.childrens.forEach((itemChild) => {
                this._itemHistory(itemChild)
              })
            }else{
              this._itemHistory(item);
            }
          })  
          resolve(data)
        })
      },
      _itemHistory(item){
        if(item.taskLocalVariables){
          if(item.taskLocalVariables.cur_status == 4 || item.taskLocalVariables.cur_status == 7){
            this._opinionArr(item.processTaskId).then((responseOption) => { 
              item.opinionArr = responseOption.data.data;  
              item.headimgindex = responseOption.data.data.length ? responseOption.data.data[0].id : null;
            }).catch((errorOption) => {
              this.$message.error(errorOption)
            })
          }
        }
        
      },
      /*
       * 获取每个历史节点数据，用promise反比避免不能同步的问题
       */
      _opinionArr(processTaskId) {
        return new Promise((resolve, reject) => {
          //获取专家意见
          this.axios.get(`${this.common.basePath}/assessment_expert/list`,{params: {taskId: processTaskId}}).then( (response) => {
            resolve(response)
          }).catch( (error) => {
            reject(error)
          });
        });
      },
      
      /* 
        发表意见
      */
      publishOpinion(files, item){
        var formData = {
          comment: JSON.stringify(files),
          id: item.id,
        }
        this.axios.post(`${this.common.basePath}/assessment_expert/expert/opinion`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            this.$message.success("发表"+response.data.meta.message, 20);
            this.opinionContent = ''
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
        }).catch( (error) => {
          this.$message.error(error,20);            
        });
      },
      
      /* 
       * 点击专家输入专家意见
       * @params {id} 被选中的专家Id
       * @params {name} 被选中的专家姓名
       * @params {item} 被选中的专家父级数据
       */
      clickHeadImg(val){
        this.itemTask.headimgindex = val.id 
        this.itemTask = Object.assign({}, this.itemTask, this.itemTask);
        this.placeholder = '请 '+ val.assExpertName +' 专家填写宝贵审核意见...';
      },
      
      
      /* 
        提交添加的节点
      */
      postAdd(){ 
        this.$refs.formSchedule.validate((valid) => {
          if (valid) {
            let formScheduleNew = JSON.parse(JSON.stringify(this.formSchedule));
            formScheduleNew.beginTime = formScheduleNew.pointDate[0];
            formScheduleNew.endTime = formScheduleNew.pointDate[1];
            formScheduleNew.schedule = formScheduleNew.schedule/100;
            formScheduleNew.projectId = this.projectId;
            this.axios.post(`${this.common.basePath}/checkpoint/point`,formScheduleNew).then( (response) => {
              if(response.data.meta.code === 0){ 
                this.isShowAddPoint = false;
                this.$refs.formSchedule.resetFields();
                this.getPointDetail();//刷新节点详情
                this.getDetail();
              }else{
                this.$message.error(response.data.meta.message, 20);   
              }
            }).catch( (error) => {
              this.$message.error(error,20);            
            });
          } else { 
            return false;
          }
        });
        
      },
      /*
       * 上传意见附件成功后
       * @params {object} item 当前被编辑的对象
       * @params {object} res 上传成功后的对象 
       */
      
      handleRemoveComment(res, item, uploadName){
        if(res.meta.code == 0) {
          this.publishOpinion(res.data, item);
          item.comment = JSON.stringify(res.data);
          this.$refs[uploadName][0].clearFiles();
        }
      },
      
      /* 
        上传增加节点附件的url
      */
      UploadUrl(){
        return this.common.basePath+"/file/"+ this.projectId +"/uplode";       
      },
      
      /* 
        上传增加节点附件 ---文件上传成功时
      */
      uploadSuccessFile(res) {
        this.formSchedule.attachment = JSON.stringify(res.data);
      },
      
      /* 
        上传增加节点附件 ---文件上传失败时
      */
      uploadErrorFile(err, file, fileList) {
        this.$message.error('上传失败!!', 20);
        this.attachment = []
      },
      
      /* 
       点击是否展示增加节点框
       */
      clickIsShowAddPoint(){
        this.isShowAddPoint = !this.isShowAddPoint;
      },
      
      /* 
      保存增加的节点
      */
      savePoint(){
        this.postAdd();
      },
      
      /* 
        tab切换
       */
      handleClick(tab) {
        if(tab.index == "0"){
          /* 
          详情
          */
          this.getDetail();
        };
        if(tab.index == "1"){
          /* 
          历史详情
          */
         this.processHistory();
        };
        if(tab.index == "2"){
          /* 
          节点详情
          */
          // this.getPointDetail()
        };
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
        文件上传成功后，点击查看文件
       */
      handlePreview(file){
        this.fileUrl = file.url;
        this.fileDialogVisible = true;
      },
      /*
       * 增加附件
       * @params {object} resfiles 后台返回的数据
       * @params {object} item 整个需要操作的对象
       */
      successMettingHandlePreview(resfiles,item){
        let params = {
          taskId: item.processTaskId,
          metingFile: JSON.parse(JSON.stringify(item.taskLocalVariables.metingFile))
        }
        if(resfiles.meta.code == 0){
          params.metingFile.push({
            name: resfiles.data.name,
            url:  resfiles.data.path,
          })
          this._updateMsg(0,params,item);
        }
      },
      /*
       * 删除附件
       * @params {string/number} fileIndex 删除附件下标
       * @params {object} item 整个需要操作的对象
       */
      mettingHandleRemove(fileIndex, item){
        let params = {
          taskId: item.processTaskId,
          metingFile: JSON.parse(JSON.stringify(item.taskLocalVariables.metingFile))
        }
        params.metingFile.splice(fileIndex, 1);
        this._updateMsg(0,params, item);
      },
      /*
       * 保存意见文本
       */
      saveMettingMsg(item,textKeyName){
        let params = {
          taskId: item.processTaskId, 
        }
        params[textKeyName] = item.taskLocalVariables[textKeyName]
        this._updateMsg(1,params, item);
      },
      /*
       * 修改意见或者附件
       * @params {string/number} type 0附件，1文本
       * @params {object} params 参数
       * @params {object} item 整个需要操作的对象
       */
      _updateMsg(type, params, item){
        this.axios.post(`${this.common.basePath}/activiti/update/msg`,params).then((response) => {
          if(type == 0){
            item.metingFile = params.metingFile;
          }
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      /*
       * 查看单个任务详情
       */
      taskBindFun(itemInner){
        // 在以下状态下点击无任何反应
        if(!(itemInner.taskLocalVariables.cur_status == 1 || (itemInner.taskLocalVariables.cur_status == 2 && itemInner.taskLocalVariables.read_status == 1) || itemInner.taskLocalVariables.cur_status == 3 || itemInner.taskLocalVariables.cur_status == 5 || itemInner.taskLocalVariables.cur_status == 15 || (itemInner.taskLocalVariables.cur_status == 12 && itemInner.taskLocalVariables.read_status == 1) || itemInner.taskLocalVariables.cur_status == 18)) {
          this.currentTask = itemInner
					console.log(this.currentTask)
          this.taskDialogVisible = true;
        }
        // 4 / 7状态下查询专家列表
        if(itemInner.taskLocalVariables.cur_status == 4 || itemInner.taskLocalVariables.cur_status == 7) {
          this.getExpertList(itemInner.processTaskId).then((data) => {
            this.currentExpertList = data
            this.taskDialogVisible = true;
          })
        }
      },
      /**
       * 根据taskId查询对应的专家信息
       * @return {[type]} [description]
       */
      getExpertList(id) {
        let p = new Promise((resolve, reject) => {
          this.axios.get(`${this.common.basePath}/assessment_expert/list`,{params: {taskId: id}}).then((response) => {
            resolve(response.data.data)
          }).catch((error) => {
            reject(error)
          });
        })
        return p
      },
      /**
       * 文件上传成功
       * @return {[type]} [description]
       */
      uploadSuccess(res, item, uploadName) {
        this.publishOpinion(res.data, this.currentExpertList[this.currentExpertIndex]);
        this.getExpertList(this.currentExpertList[this.currentExpertIndex].id).then((data) => {
            this.currentExpertList = data;
          }) //重新查询
      },
    },
    computed: {
      stepNow () { //返回当前处于哪个状态节点
        let self = this
        let indexNum = self.stepsHistory.length
        if(self.stepsHistory.length > 0) {
          self.stepsHistory.forEach((item, index) => {
            if(item.isSelect || item.isReject){
              indexNum = index
            }
          })
        }
        return indexNum
      }
    },
    mounted() { 
			
    },
    created(){
      
      /* 
      详情
      */
      this.getDetail();
      
    },
  }
</script>



<style lang="less">  
  .project-detail .el-radio-button__orig-radio:disabled + .el-radio-button__inner {
    border-color: #1e90f0;
    color: #000;
  }
  .project-detail .el-radio-button__orig-radio:disabled:checked + .el-radio-button__inner {
    background-color: #1e90f0;
    color: #fff;
  } 
  /*.time-line .tl-item .tl-item-right .content_{
    min-height: 20px;
    max-width: 600px;
    height: auto;
  }*/
  .active-img{
    border: 1px solid red;
  }
  /*.time-line .tl-item .tl-item-left{
    width: 380px;
  }*/
  .bread-style{
    padding-top: 22px;
    font-size: 16px !important;
    display: inline-block;
  }
  .el-steps {
    padding: 40px 0 20px 0;
  }
  .step-popover-item {
    
  }
  .popover-reference {
    cursor: pointer;
  }
  .expert-head-img {
    width: 30px;
    height: 30px;
    border-radius: 15px;
  }
	
	.popper-opcity{
		opacity: 0.8;
	}
	.wrap-box-position{
		// position: relative;
	}
	.top-fixed{
		margin-top: -250px;
    position: fixed;
    background-color: #FFFFFF;
    z-index: 999;
    width: calc(100% - 268px);
		display: block;
	}
	.top-fixed_v{
		margin-top: -250px;
		position: fixed;
		background-color: #FFFFFF;
		z-index: 999;
		width: calc(100% - 268px);
		display: block;
	}
	.top-fixed_h{
		margin-top: -250px;
		position: fixed;
		background-color: #FFFFFF;
		z-index: 999;
		width: calc(100% - 28px);
		display: block;
	}
	.mrt-b{
		margin-top: 250px;
		border-top-left-radius: 0;
		border-top-right-radius: 0;
	}
	.gray-line{
		width: 100%;
		height: 10px;
		background: #eff1f4;
	}
</style>