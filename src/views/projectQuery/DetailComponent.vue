<template>
	<div v-if="detail">
    <p>项目名称：{}</p>
    <el-radio-group v-model="tabPosition" size="small" style="margin-bottom: 30px; text-align: right;">
      <el-radio-button v-for="(item, index) in common.projectStatusData()" :label="item.id">{{item.name}}</el-radio-button>
    </el-radio-group>
    <el-tabs type="border-card" class="block-wrap">
      <el-tab-pane label="基础信息"></el-tab-pane>
      <el-tab-pane label="申报历史"></el-tab-pane>
      <el-tab-pane label="进度汇报"></el-tab-pane>
    </el-tabs>
    <!-- <div class="block-body">
      <h4 class="block-depart-title"> 基本信息 </h4>
      <p class="mar10">项目名称：{{detail.name}} </p>
      <p class="mar10">创建时间：{{common._convertDate(detail.create_time, 'yyyy年MM月dd日')}} </p>
      <p class="mar10">创建者：{{detail.creator}} </p>
      <p class="mar10">申报单位：{{detail.org_id}} </p>
      <p class="mar10">项目负责人：{{detail.liability_user}} </p>
      <p class="mar10">项目联系人：{{detail.linkman}} </p>
      <p class="mar10">固定电话：{{detail.phone}} </p>
      <p class="mar10">联系手机：{{detail.tel}}</p>
      <p class="mar10">邮箱：{{detail.mail}}</p>
      <h4 class="block-depart-title"> 项目预算 </h4>
      <p class="mar10">预算科目：{{detail.budget_type}}</p>
      <p class="mar10">资金落实情况：{{detail.financial_situation}}</p>
      <h4 class="block-depart-title"> 项目情况 </h4>
      <p class="mar10">三重一大'会议纪要： 
        <el-button size="mini" @click="common.downloadFileByUrl(detail.meeting_summary.path)">
        {{detail.meeting_summary.name}}
        </el-button> 
      </p>
      <p class="mar10">立项政策文件： 
        <el-button size="mini" @click="common.downloadFileByUrl(detail.policy_document.path)">
        {{detail.policy_document.name}}
        </el-button> 
      </p>
      <p class="mar10">项目方案： 
        <el-button size="mini" @click="common.downloadFileByUrl(detail.project_plan.path)">
        {{detail.project_plan.name}}
        </el-button> 
      </p>
      <p class="mar10">项目方案(简版)： 
        <el-button size="mini" @click="common.downloadFileByUrl(detail.project_plan_simple.path)">
        {{detail.project_plan_simple.name}}
        </el-button> 
      </p>
      <p class="mar10">预算依据： 
        <el-button size="mini" @click="common.downloadFileByUrl(detail.budget_basis.path )">
        {{detail.budget_basis.name}}
        </el-button> 
      </p>
      <h4 class="block-depart-title"> 备注说明 </h4>
      <p class="mar10">备注说明：{{detail.remarks}} </p>
      <p class="mar10 padb10">备注附件：  
        <el-button size="mini" @click="common.downloadFileByUrl(detail.remarks_file.path)">
        {{detail.remarks_file.name}}
        </el-button> 
      </p>
    </div> -->
  </div>
</template>
<script>
  export default {
  	props: {
  		detail: {
  			default: null,
  			required: true,
  		}
  	},
    methods: {
    },
    mounted() { 
    },
    data() {
      return {
         tabPosition: 1,
      }
    }
  }
</script> 