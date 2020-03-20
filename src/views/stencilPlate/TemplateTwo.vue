 <!--
		模版二
	-->
<template>
  <div>
    <h2 class="page-title">模版二</h2>
    <div class="block-wrap">
			<h4 class="block-title">表格标题</h4>
      <div class="block-body">
				<el-table 
					:data="tableData" 
					style="width: 100%" 
					stripe 
					border
					resizable
					max-height="500" 
					tooltip-effect="light" 
					ref="multipleTable" 
					@selection-change="handleSelectionChange"
					:default-sort = "{prop: 'date', order: 'descending'}"
					:row-class-name="tableRowClassName"
					:cell-class-name="tableCellClassName"
					:header-row-class-name="tableHeaderClassName">
					<el-table-column type="selection" fixed width="55"  header-align="center" align="center"></el-table-column>
					<el-table-column type="expand">
						<template slot-scope="props">
							<el-form label-position="left" inline class="demo-table-expand">
								<el-form-item label="申报时间">
									<span>{{ props.row.date }}</span>
								</el-form-item>
								<el-form-item label="项目名称">
									<span>{{ props.row.name }}</span>
								</el-form-item>
								<el-form-item label="申报单位">
									<span>{{ props.row.company }}</span>
								</el-form-item>
								<el-form-item label="项目金额">
									<span>{{ props.row.money }}</span>
								</el-form-item>
								<el-form-item label="当前状态">
									<span>{{ props.row.state }}</span>
								</el-form-item>
								<el-form-item label="意见描述">
									<span>{{ props.row.opinion }}</span>
								</el-form-item>
								<el-form-item label="项目进度">
									<span>{{ props.row.progress }}</span>
								</el-form-item>
								<el-form-item label="备注">
									<span>{{ props.row.remarks }}</span>
								</el-form-item>
							</el-form>
						</template>
					</el-table-column>
					<el-table-column type="index" width="50"  header-align="center" align="center"></el-table-column>
					<el-table-column 
						prop="date" 
						label="申报时间" 
						width="180" 
						sortable
						:filters="[{text: '2017-11-23', value: '2017-11-23'}, {text: '2016-05-02', value: '2016-05-02'}, {text: '2018-01-12', value: '2018-01-12'}, {text: '2018-01-03', value: '2018-01-03'}]"
						:filter-method="filterHandler"
						 header-align="center" align="center">
						<template slot-scope="scope">
							<i class="el-icon-time"></i>
							<span style="margin-left: 10px">{{ scope.row.date }}</span>
						</template>
					</el-table-column>
					<el-table-column 
						prop="name" 
						label="项目名称" 
						width="180" 
						label-class-name="title-center"
						header-align="center" 
						align="center">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>申报时间: {{ scope.row.date }}</p>
								<p>项目名称: {{ scope.row.name }}</p>
								<p>申报单位: {{ scope.row.company }}</p>
								<p>项目金额: {{ scope.row.money }}</p>
								<p>当前状态: {{ scope.row.state }}</p>
								<p>意见描述: {{ scope.row.opinion }}</p>
								<p>项目进度: {{ scope.row.progress }}</p>
								<p>备注: {{ scope.row.remarks }}</p>
								<div slot="reference" class="name-wrapper">
									<el-tag size="medium">{{ scope.row.name }}</el-tag>
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<el-table-column prop="company" label="申报单位" width="180" :formatter="formatter" header-align="center" align="center"></el-table-column>
					<el-table-column prop="money" label="项目金额(万元)" width="180"  header-align="center" align="center"></el-table-column>
					<el-table-column prop="state" label="当前状态" width="180"  header-align="center" align="center"></el-table-column>
					<el-table-column prop="opinion" label="意见描述" width="180" show-overflow-tooltip  header-align="center" align="center"></el-table-column>
					<el-table-column prop="progress" label="项目进度" width="180"  header-align="center" align="center"></el-table-column>
					<el-table-column
						prop="tag"
						label="标签"
						width="100"
						:filters="[{ text: '家', value: '家' }, { text: '公司', value: '公司' }]"
						:filter-method="filterTag"
						filter-placement="bottom-end"
						 header-align="center" align="center">
						<template slot-scope="scope">
							<el-tag
								:type="scope.row.tag === '家' ? 'primary' : 'success'"
								disable-transitions>{{scope.row.tag}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="remarks" label="备注" width=""  header-align="center" align="center"></el-table-column>
					<el-table-column fixed="right" label="操作" width="150" header-align="center" align="center">
						<template slot-scope="scope">
							<el-button @click="handleClickSee(scope.$index, scope.row, scope.column)" type="text" size="small">查看</el-button>
							<el-button @click="handleClickEdit(scope.$index, scope.row, scope.column)" type="text" size="small">编辑</el-button>
							<el-button @click.native.prevent="deleteRow(scope.$index, tableData)" type="text" size="small">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="block-bottom">
				<div>
					<el-button @click="toggleSelection([tableData[1], tableData[2]])">切换第二、第三行的选中状态</el-button>
					<el-button @click="toggleSelection()">取消选择</el-button>
				</div>
			</div>
    </div>
  </div>
  
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
	.el-table .warning-row {
    background: oldlace;
  }
	
  .el-table .success-row {
    background: #f0f9eb;
  }
	
	.el-table .red-cell {
		color: red;
	}
	
	.el-table .color-text {
		color: #222;
	}
</style>

<script>
  export default {
    methods: {
			//高亮显示第一行和第三行
			tableRowClassName({row, rowIndex}) {
        if (rowIndex === 0) {
          return 'warning-row';
        } else if (rowIndex === 2) {
          return 'success-row';
        }
        return '';
      },
			//高亮显示单元格内容
			tableCellClassName({row, column, rowIndex, columnIndex}) {
				if (rowIndex === 0&&columnIndex === 11) {
					return 'red-cell';
				} 
				return '';
			},
			//设置表头信息文本颜色
			tableHeaderClassName({row, rowIndex}) {
				if (rowIndex === 0) {
					return 'color-text';
				} 
				return '';
			},
			//查看
			handleClickSee(index, row, column) {
        console.log(index, row, column);
      },
			//编辑
			handleClickEdit(index, row, column) {
				console.log(index, row, column);
			},
			//删除
			deleteRow(index, rows) {
        rows.splice(index, 1);
      },
			//切换第二、第三行的选中状态
			toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },
			//取消选择
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
			//格式化指定列的值
			formatter(row, column) {
        return row.company;
      },
			//标签筛选
			filterTag(value, row) {
        return row.tag === value;
      },
			//时间筛选
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
			//可以使用sort-method或者sort-by使用自定义的排序规则。
			//如果需要后端排序，需将sortable设置为custom，同时在 Table 上监听sort-change事件，在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。
			
    },
    data() {
      return {
        tableData: [{
					date: '2016-05-02',
					name: '和平区工程项目管理平台',
					company:'网信办',
					money:'50.00',
					state:'已立项',
					opinion:'和平区工程项目....',
					progress:'10%',
					tag: '家',
					remarks: '好项目',
				}, {
					date: '2017-11-23',
					name: '人工智能在的工业应用',
					company:'天津智信科技有限公司',
					money:'300.00',
					state:'已启动',
					opinion:'人工智能（Artificial Intelligence），英文缩写为AI。它是研究、开发用于模拟、延伸和扩展人的智能的理论、方法、技术及应用系统的一门新的技术科学。',
					progress:'20%',
					tag: '公司',
					remarks: ''
				}, {
					date: '2018-01-12',
					name: '大数据在刑侦中的应用',
					company:'天津市公安局',
					money:'800.00',
					state:'招标中',
					opinion:'大数据在刑侦中....',
					progress:'0%',
					tag: '家',
					remarks: '重点建设项目'
				},{
					date: '2017-02-15',
					name: '市民公园建设',
					company:'和平区建设局',
					money:'1200.00',
					state:'专家评审中',
					opinion:'市民公园....',
					progress:'60%',
					tag: '公司',
					remarks: ''
				},{
					date: '2018-01-03',
					name: '地铁99号线建设',
					company:'天津地铁公司',
					money:'80000.00',
					state:'待受理',
					opinion:'地铁99号线建设....',
					progress:'50%',
					tag: '其他',
					remarks: '大型土建项目'
				}, {
					date: '2017-05-20',
					name: '防沙尘暴',
					company:'网信办',
					money:'50.00',
					state:'已归档',
					opinion:'和平区工程项目....',
					progress:'99%',
					tag: '公司',
					remarks: ''
				}]
      }
    }
  }
</script>

<style>
	
</style>