 <!--
		其他查询
	-->
<template>
  <div>
    <h2 class="page-title">其他查询</h2>
    <div class="block-wrap">
			<h4 class="block-title">查询表</h4>
			<div class="block-body">
				<el-row :gutter="20"  justify="center">
					 <el-col :span="24">
					<el-form :inline="true" :model="formInline" class="demo-form-inline">
						<el-form-item label="项目编号">
							<el-input v-model="formInline.user" placeholder="输入项目编号"></el-input>
						</el-form-item>
						<el-form-item label="项目名称 ">
							<el-input v-model="formInline.user" placeholder="输入项目名称 "></el-input>
						</el-form-item>
						<el-form-item label="预算科目">
							<el-select v-model="formInline.region" placeholder="选择预算科目">
								<el-option label="区域一" value="shanghai"></el-option>
								<el-option label="区域二" value="beijing"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="" @click="onSubmit">查询</el-button>
						</el-form-item>
					</el-form>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-table :data="tableData" border style="width: 100%">
							<el-table-column fixed prop="num" label="编号" width="150"></el-table-column>
							<el-table-column prop="date" label="填报日期" width="180"></el-table-column>
							<el-table-column prop="name" label="项目名称" width="180"></el-table-column>
							<el-table-column prop="state" label="处理状态"></el-table-column>
							<el-table-column fixed="right" label="操作" width="200">
								<template slot-scope="scope">
									<el-button @click="handleClick(scope.row)" type="" icon="el-icon-view" size="mini">查看</el-button>
									<el-button type="" icon="el-icon-edit" size="mini">编辑</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-col>
				</el-row>
			</div>
			<div class="block-bottom">
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
			</div>
    </div>
  </div>
</template>

<script>
  export default {
    methods: {
      handleClick(row) {
      	console.log(row);
      },
			onSubmit() {
        console.log('submit!');
      },
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			},
    },
    data() {
      return {
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
				tableData: [{
					date: '2016-05-03',
					name: '王小虎',
					state: '完成',
					num: 200333
				}, {
					date: '2016-05-03',
					name: '王小虎',
					state: '完成',
					num: 200333
				}, {
					date: '2016-05-03',
					name: '王小虎',
					state: '完成',
					num: 200333
				}, {
					date: '2016-05-03',
					name: '王小虎',
					state: '完成',
					num: 200333
				}],
				formInline: {
          user: '',
          region: ''
        },
				currentPage: 4,
      }
    }
  }
</script>

<style>
	
</style>