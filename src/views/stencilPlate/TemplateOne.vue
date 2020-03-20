 <!--
		模版一
	-->
<template>
  <div>
    <h2 class="page-title">模版一</h2>
    <div class="block-wrap">
			<h4 class="block-title">表格标题</h4>
      <div class="block-body">
				<div class="body-operation">
					<el-row>
						<el-col :span="24">
							<el-form :inline="true" :model="formInline" class="demo-form-inline">
								<el-form-item label="审批人">
									<el-input v-model="formInline.user" placeholder="审批人" size="small"></el-input>
								</el-form-item>
								<el-form-item label="活动区域">
									<el-select v-model="formInline.region" placeholder="活动区域" size="small">
										<el-option label="区域一" value="shanghai"></el-option>
										<el-option label="区域二" value="beijing"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="活动区域">
									<el-select v-model="formInline.region" placeholder="活动区域" size="small">
										<el-option label="区域一" value="shanghai"></el-option>
										<el-option label="区域二" value="beijing"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="活动区域">
									<el-select v-model="formInline.region" placeholder="活动区域" size="small">
										<el-option label="区域一" value="shanghai"></el-option>
										<el-option label="区域二" value="beijing"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item>
									<el-button type="" @click="onSubmit" size="small">筛选</el-button>
								</el-form-item>
							</el-form>
						</el-col>
					</el-row>
					<el-row class="fr">
							<el-button type="" icon="el-icon-view" size="small">查询</el-button>
							<el-button type="" icon="el-icon-circle-plus" size="small">添加</el-button>
							<el-button type="" icon="fa fa-upload" size="small"> 导出</el-button>
							<el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
					</el-row>
					<div style="clear: both;"></div>
				</div>
				<div class="body-content">
					<el-row>
						<el-col :span="24">
							<el-table :data="tableData" stripe border style="width: 100%">
								<el-table-column fixed type="selection" width="50"></el-table-column>
								<el-table-column type="index" :index="indexMethod"></el-table-column>
								<el-table-column prop="date" label="日期" width="180"></el-table-column>
								<el-table-column prop="name" label="姓名" width="180"></el-table-column>
								<el-table-column prop="address" label="地址"></el-table-column>
								<el-table-column label="操作" width="300">
									<template slot-scope="scope">
											<el-button type="" icon="el-icon-edit" size="mini" @click="handleClick(scope.$index,scope.row)">编辑</el-button>
											<el-button type="" icon="el-icon-circle-plus" size="mini">添加</el-button>
											<el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</el-col>
					</el-row>
				</div>
			</div>
			<div class="block-bottom">
				<el-col :span="12" :offset="0">
					<div>
						<el-select v-model="value" placeholder="请选择" size="small">
							<el-option
								v-for="item in options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
							</el-option>
						</el-select>
						<el-button type="" icon="el-icon-check" size="small">确定</el-button>
					</div>
				</el-col>
				<el-col :span="8" :offset="4">
					<div class="block">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
							:current-page="currentPage"
							:page-sizes="[100, 200, 300, 400]"
							:page-size="100"
							background
							small
							layout="total, sizes, prev, pager, next, jumper"
							:total="400">
						</el-pagination>
					</div>
				</el-col>
			</div>
    </div>
  </div>
  
</template>

<script>
  export default {
    data() {
      return {
        options: [{
        	value: '选项1',
        	label: '选中所有'
        }, {
        	value: '选项2',
        	label: '删除选中'
        }, {
        	value: '选项3',
        	label: '批量编辑'
        }, {
        	value: '选项4',
        	label: '导出所选'
        },],
        value: '',
				currentPage: 4,
				tableData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '天津和平区'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '天津和平区'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '天津和平区'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '天津和平区'
				}],
				formInline: {
          user: '',
          region: ''
        },
      }
    },
		methods: {
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
			handleClick(index,row) {
				console.log(index,row);
			},
			indexMethod(index) {
				return index * 1;
			},
			onSubmit() {
        console.log('submit!');
      }
		},
  }
</script>

<style>
	
</style>