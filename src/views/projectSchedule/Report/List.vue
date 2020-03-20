 <!--
		项目进度汇报列表
	-->
<template>
  <div>
    <h2 class="page-title">项目进度</h2>
    <div class="block-wrap">
			<h4 class="block-title">项目进度汇报列表</h4>
      <div class="block-body">
				<div class="body-operation">
					<el-row :gutter="20">
						<el-col :span="12">
								<!-- <el-button type="" icon="fa fa-upload" size="small"> 导出所选</el-button> -->
						</el-col>
						<el-col :span="12" :offset="0" class="fr">
								<el-button type="" icon="el-icon-search" size="small" class="fr">检索</el-button>
								<el-autocomplete
									v-model="state"
									:fetch-suggestions="querySearchAsync"
									placeholder="请输入项目名称"
									@select="handleSelect"
									size="small"
									class="fr w300"
									value-key="name"
									clearable
								></el-autocomplete>
						</el-col>
					</el-row>
				</div>
				<div class="body-content">
					<el-row>
						<el-col :span="24">
							<el-table :data="tableData.rows" stripe border style="width: 100%">
								<el-table-column fixed type="selection" width="50"></el-table-column>
								<el-table-column type="index" :index="indexMethod"></el-table-column>
								<el-table-column prop="createTime" label="日期" width="150">
									<template slot-scope="scope">
										<span>
											{{scope.row.createTime | formatDate}}
										</span>
									</template>
								</el-table-column>
								<el-table-column prop="name" label="项目名称" width="240"></el-table-column>
								<el-table-column prop="orgName" label="负责人" width="150"></el-table-column>
								<el-table-column prop="payMoney" label="项目集资(万元)" width="150"></el-table-column>
								<el-table-column label="进度(百分比)">
									<template slot-scope="scope">
										<el-progress :percentage="scope.row.schedule*100"></el-progress>
									</template>
								</el-table-column>
								<el-table-column label="操作" width="240" header-align="center" align="center">
									<template slot-scope="scope">
											<el-button type="" icon="el-icon-circle-plus" size="mini" @click="add(scope.row)">添加</el-button>
											<el-button type="" icon="el-icon-view" size="mini" @click="check(scope.row)">查看</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-col>
					</el-row>
				</div>
			</div>
			<div class="block-bottom">
				<el-col :span="12" :offset="0"></el-col>
				<el-col :span="8" :offset="4">
					<div class="block">
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
				</el-col>
			</div>
    </div>
		<!-- 
			添加节点弹框
		-->
		<el-dialog
			title="添加节点"
			:visible.sync="addDialogVisible"
			width="60%"
			center>
			<el-form :model="addForm" :rules="rules" ref="addForm">
				<el-form-item label="时间段" :label-width="formLabelWidth" prop="date">
					<el-date-picker
						v-model="addForm.date"
						type="datetimerange"
						:picker-options="pickerOptions"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						align="right">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="项目集资" :label-width="formLabelWidth" prop="payMoney">
					<el-input v-model="addForm.payMoney" auto-complete="off" placeholder="请输入金额">
						<template slot="append">万元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="评估进度" :label-width="formLabelWidth" prop="schedule">
					<el-input v-model="addForm.schedule" auto-complete="off"  placeholder="请输入进度值(0~1的小数)"></el-input>
				</el-form-item>
				<el-form-item label="附件" :label-width="formLabelWidth" class="is-required">
					<el-upload
						class="upload-demo"
						:before-upload="beforeUpload"
						:action="`${common.basePath}/file/-1/uplode`"
						:headers="myHeaders"
						:auto-upload="true"
						multiple
						:limit="1"
						:on-success="uploadSuccessFile"
						:on-error="uploadErrorFile">
						<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
						<span slot="tip" class="el-upload__tip" style="margin-left: 10px;">只能上传jpg/png文件</span>
					</el-upload>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="resetForm('addForm')">重置</el-button>
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="sure('addForm')">确 定</el-button>
			</span>
		</el-dialog>
  </div> 
</template>

<script>
	import {formatDate} from '../../../plugins/data.js';
  export default {
		/* 
			转化时间戳
		*/
		filters: {
			formatDate(time) {
				var date = new Date(time);
				return formatDate(date, 'yyyy-MM-dd');
			}
		},
    methods: {
			
			/* 
				上传文件url
			*/
			UploadUrl(){
					return this.common.basePath+"/file/"+ JSON.parse(sessionStorage.getItem("addPointId")) +"/uplode";     
			},
			
			/* 
			 添加按钮
			 */
    	add(row) {
				sessionStorage.setItem("addPointId",row.id)
				this.addDialogVisible=true;
    	},
			
			/* 
			 查看详情
			 */
			check(row){
				sessionStorage.setItem("addCheckPointId",row.id)
				this.$router.push({name: 'ReportDetail'});
			},
			
			/* 
			 确定添加节点
			 */
			sure(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.postAdd();
          } else {
            this.$message.warning("信息未填写完整！！！", 60); 
            return false;
          }
        });
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
				this.getKeyList();
    	},
    	
    	/*
    	* 改变每页条数触发此事件
    	* @param {number} val 当前数据
    	*/
    	handleSizeChange(val){
    		this.elementPageData.pageSize = val;
    		this.getList();
				this.getKeyList();
    	},
			
			/*
			* 根据关键字获取列表
			*/
			getKeyList(){
				this.axios.get(`${this.common.basePath}/checkpoint/point`,this._listKeyParams()).then( (response) => {
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
			_listKeyParams(){
				return {
					params: {
						projectId:"",
						keyWords:this.key,
						pageSize: this.elementPageData.pageSize,
						pageNum:  this.elementPageData.pageNum,
					}
				}
			},
    	
    	/*
    	* 获取列表
    	*/
    	getList(){
    		this.axios.get(`${this.common.basePath}/checkpoint/point`,this._listParams()).then( (response) => {
    			if(response.data.meta.code === 0){
    				// this.$message.success(response.data.meta.message, 20);
    				this.tableData = response.data.data;
						this.restaurants = response.data.data.rows;
    			}else{
    				this.$message.error(response.data.meta.message, 20);   
    			}
    			
    		}).catch( (error) => {
    			this.$message.error(error);
    		});
    	},
    	_listParams(){
    		return {
    			params: {
    				projectId:"",
    				pageSize: this.elementPageData.pageSize,
    				pageNum:  this.elementPageData.pageNum,
    			}
    		}
    	},

			/* 
			提交添加的节点
			 */
			postAdd(){
				var formData = {
					"attachment": JSON.stringify(this.addForm.attachment),
					"beginTime": this.addForm.date[0],
					"endTime": this.addForm.date[1],
					"payMoney": this.addForm.payMoney,
					"projectId": sessionStorage.getItem("addPointId"),
					"schedule": this.addForm.schedule
				}
				if(this.addForm.attachment == ""){
					this.$message.error('未上传附件!!!', 60);
					return;
				}
				this.axios.post(`${this.common.basePath}/checkpoint/point`,formData).then( (response) => {
					if(response.data.meta.code === 0){
						// this.$message.success(response.data.meta.message, 20);
						this.addDialogVisible=false;
						this.getList();//刷新列表
						this.getKeyList();//刷新列表｛关键字｝
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
					this.$message.error('上传头像图片只能是 JPG/PNG 格式!');
				}
				return isJPG || isPNG;
			},
			
			/* 
				上传文件 ---文件上传成功时
			*/
			uploadSuccessFile(res) {
				this.addForm.attachment =res.data;
			},
			
			/* 
				上传文件 ---文件上传失败时
			*/
			uploadErrorFile(err, file, fileList) {
				this.$message.error('上传失败!!', 20);
				this.addForm.attachment = []
			},
	
			/* 
				远程搜索
			 */
      querySearchAsync(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createStateFilter(queryString) {
        return (state) => {
          return (state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
				// console.log(item.name)
				this.key = item.name;
				this.getKeyList()
      },
		},
    mounted() {
    	/* 
    	列表展示
    	*/
    	this.getList();
    },
    data() {
      return {
				addDialogVisible:false,
				formLabelWidth: '120px',
				addForm:{
					attachment: '',
					payMoney: '',
					schedule: '',
					date:'',
				},
				rules: {
          payMoney: [
            { required: true, message: '请输入集资金额', trigger: 'blur' },
          ],
          date: [
            { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ],
          schedule: [
            { required: true, message: '请输入进度值', trigger: 'blur' }
          ]
        },
				myHeaders: {Authorization: 'Bearer ' + JSON.parse(sessionStorage.getItem("token"))},
				elementPageData: {               
					//分页需要的数据
					defaultData:  this.common.elementPagination,
					pageNum:      this.common.elementPagination.pageNumDefault,
					pageSize:     this.common.elementPagination.pageSizeDefault,
				},
        tableData: {rows: [], total: 0},
				currentPage: 1,
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
				/* 远程搜索 */
				state: '',
				timeout:  null,
				restaurants: [],
				key:"",
      }
    }
  }
</script>

<style>
	
</style>