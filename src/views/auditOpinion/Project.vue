 <!--
		项目审核意见
	-->
<template>
  <div>
    <h2 class="page-title">项目审核意见</h2>
    <div class="block-wrap">
			<h4 class="block-title">审核意见</h4>
      <div class="block-body">
				<el-row :gutter="20">
					<el-col :span="6">
							<el-button type="" icon="el-icon-circle-plus" size="small">添加</el-button>
							<el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
					</el-col>
					<el-col :span="6" :offset="12">
							<el-button type="" icon="el-icon-search" size="small" class="fr">检索</el-button>
							<el-select
								v-model="value9"
								filterable remote reserve-keyword 
								placeholder="请输入关键词"
								:remote-method="remoteMethod"
								size="small"
								:loading="loading"
								class="fr">
								<el-option
									v-for="item in options4"
									:key="item.value"
									:label="item.label"
									:value="item.value">
								</el-option>
							</el-select>
					</el-col>
				</el-row>
				<el-row>
					<div style="height: 10px;"></div>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-table :data="tableData" stripe border style="width: 100%">
							<el-table-column fixed type="selection" width="50"></el-table-column>
							<el-table-column type="index" :index="indexMethod"></el-table-column>
							<el-table-column prop="num" label="编号" width="180"></el-table-column>
							<el-table-column prop="name" label="项目名称" width="180"></el-table-column>
							<el-table-column prop="type" label="意见类型" width="180"></el-table-column>
							<el-table-column prop="state" label="状态" width="180"></el-table-column>
							<el-table-column prop="opinion" label="意见描述"></el-table-column>
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
    methods: {
    	handleClick(index,row) {
    		console.log(index,row);
    	},
    	indexMethod(index) {
    		return index * 1;
    	},
    	handleSizeChange(val) {
    		console.log(`每页 ${val} 条`);
    	},
    	handleCurrentChange(val) {
    		console.log(`当前页: ${val}`);
    	},
    	remoteMethod(query) {
    		if (query !== '') {
    			this.loading = true;
    			setTimeout(() => {
    				this.loading = false;
    				this.options4 = this.list.filter(item => {
    					return item.label.toLowerCase()
    						.indexOf(query.toLowerCase()) > -1;
    				});
    			}, 200);
    		} else {
    			this.options4 = [];
    		}
    	},
    },
    mounted() {
    	this.list = this.states.map(item => {
    		return { value: item, label: item };
    	});
    },
    data() {
      return {
        tableData: [{
					num:'01',
        	name: '王小虎',
					type:'赞成',
					state:'未完成',
        	opinion: '很好!'
        }, {
        	num:'01',
        	name: '王小虎',
        	type:'赞成',
        	state:'未完成',
        	opinion: '很好!'
        }, {
        	num:'01',
        	name: '王小虎',
        	type:'赞成',
        	state:'未完成',
        	opinion: '很好!'
        }, {
        	num:'01',
        	name: '王小虎',
        	type:'赞成',
        	state:'未完成',
        	opinion: '很好!'
        }],
        currentPage: 4,
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
        options4: [],
        value9: [],
        list: [],
        loading: false,
        states: ["Alabama", "Alaska", "Arizona",
        "Arkansas", "California", "Colorado",
        "Connecticut", "Delaware", "Florida",
        "Georgia", "Hawaii", "Idaho", "Illinois",
        "Indiana", "Iowa", "Kansas", "Kentucky",
        "Louisiana", "Maine", "Maryland",
        "Massachusetts", "Michigan", "Minnesota",
        "Mississippi", "Missouri", "Montana",
        "Nebraska", "Nevada", "New Hampshire",
        "New Jersey", "New Mexico", "New York",
        "North Carolina", "North Dakota", "Ohio",
        "Oklahoma", "Oregon", "Pennsylvania",
        "Rhode Island", "South Carolina",
        "South Dakota", "Tennessee", "Texas",
        "Utah", "Vermont", "Virginia",
        "Washington", "West Virginia", "Wisconsin",
        "Wyoming"],
      }
    }
  }
</script>

<style>
	
</style>