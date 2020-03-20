 <!--
    项目申报列表
  -->
<template>
  <div>
    <h2 class="page-title">项目申报</h2>
    <div class="block-wrap">
      <h4 class="block-title">项目申报列表</h4>
      <div class="block-body">
        <!-- <div class="body-operation">
          <el-row :gutter="20">
            <el-col :span="12">
                <el-button type="" icon="el-icon-plus" size="small" @click="addProject">申报项目</el-button>
            </el-col>
            <el-col :span="12" :offset="0"></el-col>
          </el-row>
        </div> -->
        <div class="body-content">
          <el-row>
            <el-col :span="24">
              <el-table :data="tableData.rows" stripe style="width: 100%">
                <!-- <el-table-column  type="selection" width="50"></el-table-column> -->
                <el-table-column type="index" width="60" label="序号" :index="indexMethod" fixed class-name="border-index"></el-table-column>
                <el-table-column prop="processVariables.projectNum" label="项目编号" width="120"></el-table-column>
                <el-table-column prop="processVariables.name" label="项目名称" width="240" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span @click="openDetails(scope.row)" class="name-style">
                      {{scope.row.processVariables.name}}
                    </span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="processVariables.name" label="轮次" width="50">
                  <template slot-scope="scope">
                    <span  class="name-style">
                      {{scope.row.processVariables.rotation}}
                    </span>
                  </template>
                </el-table-column> -->
                <el-table-column prop="processVariables.company" label="申报单位" width="240">
                  <template slot-scope="scope">
                    <span>
                      {{scope.row.processVariables.company | convertToText}}
                      <!-- {{scope.row.processVariables.companyName}} -->
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="processVariables.applyTime" label="申报时间" width="180">
                  <template slot-scope="scope">
                    <span>
                      {{scope.row.processVariables.applyTime | formatDate}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="processVariables.budgetMoney" label="项目金额" width="180">
                  <template slot-scope="scope">
                    <span>
                      {{scope.row.processVariables.budgetMoney+'万元'}}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="processVariables.cur_status" label="当前状态" width="">
                  <template slot-scope="scope">
                    <span v-if="scope.row.processVariables.cur_status == 6||scope.row.processVariables.cur_status == 13||scope.row.processVariables.cur_status == 14">待修改</span>
                    <span v-if="scope.row.processVariables.cur_status == 20">被驳回</span>
                    <span v-if="scope.row.processVariables.cur_status == 1">再次申报失败</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="300" fixed="right" header-align="center" align="center">
                  <template slot-scope="scope">
										<el-button ref='btn' class="btn" type="warning" icon="" size="small" @click.stop="showInfo(scope.row)" v-if="scope.row.processVariables.cur_status == 18">申报审核意见</el-button>
										<el-button ref='btn0' class="btn" type="warning" icon="" size="small" @click.stop="showInfo(scope.row)" v-if="scope.row.processVariables.cur_status == 16">财政意见</el-button>
										<el-button ref='btn1' class="btn" type="warning" icon="" size="small" @click.stop="showInfo(scope.row)" v-if="scope.row.processVariables.cur_status == 6">领导意见</el-button>
										<el-button ref='btn2' class="btn" type="warning" icon="" size="small" @click.stop="showInfo(scope.row)" v-if="scope.row.processVariables.cur_status == 13">专家预审意见</el-button>
										<el-button ref='btn3' class="btn" type="warning" icon="" size="small" @click.stop="showInfo(scope.row)" v-if="scope.row.processVariables.cur_status == 14">专家评审意见</el-button>
                    <!-- <el-button type="success" size="small" @click.stop="openDetails(scope.row)">查看</el-button> -->
                    <el-button type="primary" icon="" size="small" @click.stop="resetDeclare(scope.row)" 
                      v-if="scope.row.processVariables.cur_status== 20">继续申报
                    </el-button>
                    <!-- <el-button type="primary" icon="" size="small" @click.stop="modify(scope.row)">编辑
                    </el-button> -->
										
										<el-button type="primary" icon="" size="small" @click.stop="modify(scope.row,'acceptance')"
											v-if="scope.row.processVariables.cur_status == 18"
											>
											提交改进方案
										</el-button>
										
										<el-button type="primary" icon="" size="small" @click.stop="modify(scope.row,'financial')"
											v-if="scope.row.processVariables.cur_status == 16"
											>
											修改财政意见
										</el-button>
                    
                    <el-button type="primary" icon="" size="small" @click.stop="modify(scope.row, 'plan')" 
                      v-if="scope.row.processVariables.cur_status == 17">提交项目方案(简版)
                    </el-button>
                    <el-button type="primary" icon="" size="small" @click.stop="modify(scope.row, 'improve')" 
                      v-if="scope.row.processVariables.cur_status == 6 || scope.row.processVariables.cur_status == 13 || scope.row.processVariables.cur_status == 14">提交改进方案
                    </el-button>
                    <el-button type="primary" icon="" size="small" @click.stop="onceMore(scope.row)" 
                      v-if="scope.row.processVariables.cur_status == 1">再次申报
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="block-bottom">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="elementPageData.pageNum"
          :page-sizes="elementPageData.defaultData.pageSizes"
          :page-size="elementPageData.defaultData.pageSizeDefault"
          background
          small
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableData.total">
        </el-pagination>
      </div>
    </div>
		<el-dialog
			title="查看意见"
			:visible.sync="infoDialogVisible"
			width="30%"
			center>
			<el-form v-if="detail">
				<el-form-item label="返回原因：" label-width="120px">{{detail.rejectReason}}</el-form-item>
				<el-form-item label="预审专家意见：" label-width="120px" v-if="detail.curStatus==13">
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
				<el-form-item label="评审专家意见：" label-width="120px" v-if="detail.curStatus==14">
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
			</el-form>
		</el-dialog>
  </div> 
</template>

<script>
  import {formatDate} from '../../../plugins/data.js';
  import {convertToText} from '../../../plugins/convertToText.js';
  export default {
    data() {
      return {
				infoDialogVisible:false,
        elementPageData: {               
          //分页需要的数据
          defaultData:  this.common.elementPagination,
          pageNum:      this.common.elementPagination.pageNumDefault,
          pageSize:     this.common.elementPagination.pageSizeDefault,
        },
        tableData: {rows: [], total: 0},
        currentPage: 1,
				detail:null,
				expertOpinion:null,
				el:null,
      }
    },
    filters: {
      /* 
        转化时间戳
      */
      formatDate(time) {
        var date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd');
      },
      /* 
      转化申报单位 id=>文本
      */
      convertToText(idValue){
        return convertToText(idValue,JSON.parse(sessionStorage.getItem("unitArr")));
      }
    },
    methods: {
			
			/* 
			 展示信息
			 */
			showInfo(row){
				console.log(this.$refs.btn)
				// this.$refs.btn.style.animationPlayState = 'paused';
				// this.$refs.btn.style.boxShadow = 'none';
				this.infoDialogVisible= true;
				this.axios.get(`${this.common.basePath}/project/detail/${row.processVariables.projectId}`,{params: {id:row.processVariables.projectId,}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.detail = response.data.data;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error);
				});
				
				this.axios.get(`${this.common.basePath}/assessment_expert/all/${row.processVariables.projectId}`,{params: {type:row.processVariables.cur_status==13 ? 1 : 2,}}).then( (response) => {
					if(response.data.meta.code === 0){
						this.expertOpinion = response.data.data;
					}else{
						this.$message.error(response.data.meta.message, 20);   
					}
				}).catch( (error) => {
					this.$message.error(error);
				});
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
      
      /* 
        继续申报
       */
      resetDeclare(row){
        sessionStorage.setItem("rowDeclareInfo",JSON.stringify(row))
        this.$confirm('是否继续申报该项目？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '删除',
          type: 'warning',
          showClose:false,
        }).then(() => {
          this.again1(row);
        }).catch(() => {
          this.again0();
        });
      },
      
      /* 
        再次申报
      */
      onceMore(row){
        sessionStorage.setItem("rowDeclareInfo",JSON.stringify(row))
        this.$router.push({
          name:'DeclareAgain',
          params:{
            id:row.processVariables.projectId,
          }
        })
      },
      
      /* 
        修改项目/ 提交改进方案
      */
      modify(row, type){
        sessionStorage.setItem("rowDeclareInfo",JSON.stringify(row))
        this.$router.push({
          name:'DeclareAgain',
          params:{
            id:row.processVariables.projectId,
            type: type ? (type=='acceptance'?"acceptance":row.processVariables.cur_status) : "edit",
						budgetRotation:row.processVariables.budgetRotation,
						expertRotation:row.processVariables.expertRotation,
          }
        })
      },
      
      /* 
       取消继续申报请求
       */
      again0(){
        var formData = {
          read_status:0,
          curStatus:20,
          instanceId:JSON.parse(sessionStorage.getItem("rowDeclareInfo")).processVariables.instanceId,
          assignee:JSON.parse(sessionStorage.getItem("rowDeclareInfo")).processVariables.assignee,
        }
        this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            this.$message({
              type: 'info',
              message: '已删除该项目啦@！！'
            }); 
            this.getList();
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
        }).catch( (error) => {
          this.$message.error(error,20);            
        });
      },
      
      /* 
        确认继续申报请求
      */ 
      again1(row){
        var formData = {
          read_status:1,
          curStatus:20,
          instanceId:JSON.parse(sessionStorage.getItem("rowDeclareInfo")).processVariables.instanceId,
          assignee:JSON.parse(sessionStorage.getItem("rowDeclareInfo")).processVariables.assignee,
        }
        this.axios.post(`${this.common.basePath}/activiti/complete`,formData).then( (response) => {
          if(response.data.meta.code === 0){
            //this.$message.success(response.data.meta.message, 20);
            this.againDialogVisible = false
            this.$router.push({
              name:'DeclareAgain',
              params:{
                id:row.processVariables.projectId,
              }
            })
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
        }).catch( (error) => {
          this.$message.error(error,20);            
        });
      },
      
      
      /* 
        项目详情 row, event, column
      */
      openDetails(row) {
        sessionStorage.setItem("rowDeclareDetailInfo",JSON.stringify(row))
        sessionStorage.setItem("declareProjectIsEdit",0) //此属性查看是否需要编辑按钮 0为需要，1位不需要
        // sessionStorage.setItem("declareProjectId",row.processVariables.projectId)
        this.$router.push({
         name:'DeclareDetail',
          params:{
            id:row.processVariables.projectId,
          }
        })
      },
      
      /* 
        申报项目 
      */
      addProject(){
        this.$router.push({path: '/project_set_up/declare/form'});
      },
      
      /* 
        项目序号
       */
      indexMethod(index) {
        return (index+1) * 1;
      },
      
      /*
      * 改变当前页码触发此事件
      * @param {number} val 当前页码
      */
      handleCurrentChange(val){
        this.elementPageData.pageNum = val;
        this.getList();
      },
      
      /*
      * 改变每页条数触发此事件
      * @param {number} val 当前数据
      */
      handleSizeChange(val){
        this.elementPageData.pageSize = val;
        this.getList();
      },
      
      /*
      * 获取列表
      */
      getList(){
        //this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
        this.axios.get(`${this.common.basePath}/project/page`,this._acceptanceListParams()).then( (response) => {
          if(response.data.meta.code === 0){
            // this.$message.success(response.data.meta.message, 20);
            this.tableData = response.data.data;
          }else{
            this.$message.error(response.data.meta.message, 20);   
          }
          
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      _acceptanceListParams(){
        return {
          params: {
            status:1,
            pageSize: this.elementPageData.pageSize,
            pageNum:  this.elementPageData.pageNum,
            company: JSON.parse(sessionStorage.getItem("userData")).id
          }
        }
      },
      
    },
    mounted() {
      /* 
       列表展示
       */
      this.getList();
      
      /* 
      申报单位
      */
      this.getDeclareUnit();
    },
    
  }
</script>

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
	.btn{
		background: #d45500;
		color: #FFFFFF;
		
		animation: myfirst 4s linear 0s infinite alternate;
		/* Firefox: */
		-moz-animation: myfirst 4s linear 0s infinite alternate;
		/* Safari 和 Chrome: */
		-webkit-animation: myfirst 4s linear 0s infinite alternate;
		/* Opera: */
		-o-animation: myfirst 4s linear 0s infinite alternate;
	}
	@keyframes myfirst
	{
		from { background-color: #d45500; -webkit-box-shadow: 0 0 9px #333; }
		50% { background-color: #ff5c00; -webkit-box-shadow: 0 0 36px #ff5c00; }
		to { background-color: #d45500; -webkit-box-shadow: 0 0 9px #333; }
	}

	@-moz-keyframes myfirst /* Firefox */
	{
		from { background-color: #d45500; -webkit-box-shadow: 0 0 9px #333; }
		50% { background-color: #ff5c00; -webkit-box-shadow: 0 0 36px #ff5c00; }
		to { background-color: #d45500; -webkit-box-shadow: 0 0 9px #333; }
	}

	@-webkit-keyframes myfirst /* Safari 和 Chrome */
	{
		from { background-color: #d45500; -webkit-box-shadow: 0 0 9px #333; }
		50% { background-color: #ff5c00; -webkit-box-shadow: 0 0 36px #ff5c00; }
		to { background-color: #d45500; -webkit-box-shadow: 0 0 9px #333; }
	}

	@-o-keyframes myfirst /* Opera */
	{
		from { background-color: #d45500; -webkit-box-shadow: 0 0 9px #333; }
		50% { background-color: #ff5c00; -webkit-box-shadow: 0 0 36px #ff5c00; }
		to { background-color: #d45500; -webkit-box-shadow: 0 0 9px #333; }
	}
</style>