<template>
  <el-row class="panel-group" :gutter="40" v-loading="cardsLoading">
    <!-- <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class='card-panel' @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">待受理项目</div>
					<div class="card-panel-num">{{declareTotal}}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">未读消息</div>
					<div class="card-panel-num">{{noticesTotal}}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">已评审项目</div>
					<div class="card-panel-num">{{reviewTotal}}</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shoppingCard">
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">项目总数</div>
					<div class="card-panel-num">{{total}}</div>
        </div>
      </div>
    </el-col> -->
    <div v-for="(item, index) in resourceAdmin" :key="`${item.id}`">
      <el-col :xs="12" :sm="8" :lg="6" class="card-panel-col" v-if="item.isSelect">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper background" :class="totalColor(totalNumber(item))"></div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ item.name.split("-")[1] }}</div>
            <count :state="totalNumber(item)" :userId="null" @finish="cardsLoading = false"></count> 
          </div>
          <div class="background-pop-up"></div>
        </div>
      </el-col>
    </div>
    <div v-for="(item, index) in resourceUser" :key="`${item.id}`" >
      <el-col :xs="12" :sm="8" :lg="6" class="card-panel-col" v-if="item.isSelect">
        <div class="card-panel">
          <div class="card-panel-icon-wrapper background" :class="totalColor(totalNumber(item))"><i class="fa fa-user fl"></i></div>
          <div class="card-panel-description">
            <div class="card-panel-text">{{ item.name.split("-")[1] }}</div>
            <count :state="totalNumber(item)" :userId="userId" @finish="cardsLoading = false"></count> 
          </div>
          <div class="background-pop-up"></div>
        </div>
      </el-col>
    </div>
  </el-row>
</template>

<script>
import count from './Count.vue'
// import Vue from "../../../router";
// Vue.component('svg-icon', SvgIcon)
export default {
	data() {
		return {
      userId: JSON.parse(sessionStorage.getItem('userData')).id,
      cardsLoading: false,
			reviewTotal:'',
			total:'',
			declareTotal:'',
			noticesTotal:'',
      statesList: [
        { type: "projects_finished", name: "系统已完结项目-已完结", status: 9 },
        { type: "project-review", name: "需要专家评审的项目-专家评审", status: 4 },
        { type: "project-pretrial", name: "需要专家预审的项目-专家预审", status: 3 },
        { type: "project-leader", name: "需要领导会议审议的项目-网信会议", status: 5 },
        { type: "project-inhand", name: "实施中项目-实施中", status: 8 },
        { type: "project-finance", name: "待申报单位录入财政意见-财政意见", status: 6 },
        { type: "project-file", name: "待归档项目-待归档", status: 7 },
        { type: "project-apply", name: "待申报单位申报项目-待申报项目", status: 1 },
        { type: "project-all", name: "系统中项目数-项目", status: null },
        { type: "project-accept", name: "需要我受理的项目-项目受理", status: 2 },
        { type: "mine_projects_finished", name: "我的已完成项目-已完结", status: 9 },
        { type: "mine-projects", name: "我的项目数-项目", status: null },
        { type: "mine-project-review", name: "我的待评审项目-专家评审", status: 4 },
        { type: "mine-project-pretrial", name: "我的待预审项目-专家预审", status: 3 },
        { type: "mine-project-leader", name: "我的待领导审批项目-网信会议", status: 5 },
        { type: "mine-project-inhand", name: "我的实施中项目-实施中", status: 8 },
        { type: "mine-project-finance", name: "待我录入财政意见项目-财政意见", status: 6 },
        { type: "mine-project-file", name: "我的待归档项目-待归档", status: 7 },
        { type: "mine-project-apply", name: "驳回给我的项目-被驳回项目", status: 1 },
        { type: "mine-project-accept", name: "我的待受理项目-项目受理", status: 2 }
      ],
      // states: [
      //   {id: 1, name: '被驳回'},
      //   {id: 2, name: '待受理'},
      //   {id: 3, name: '待预审'},
      //   {id: 4, name: '待审批'},
      //   {id: 5, name: '待上会'},
      //   {id: 6, name: '待财政审批'},
      //   {id: 7, name: '待归档'},
      //   {id: 8, name: '实施中'},
      //   {id: 9, name: '已完结'},
      // ],
      resourceAdmin: [],
      resourceUser : [],
		}
	},
  components: {
    "count": count,
  },
  computed: {
    //根据对应的url来返回 状态status (不使用文本name对比)
    totalNumber (blockItem) {
      let self = this
      return (blockItem) => {
        let state
        self.statesList.forEach((item, index) => {
          if(blockItem.url == item.type) {
            state = item.type
          }
        })
        return state
      }
    },
    //返回模块颜色
    totalColor (blockItem) {
      let self = this
      return (blockItem) => {
        return self.common.showStatusText(blockItem).stageColor
      }
    }
  },
	mounted(){
		// this.getReviewTotal();
		// this.getDeclareTotal();
		// this.getTotal();
		// this.getNoticesTotal();
    this.getActiveResource()
	},
  methods: {
    /**
   * 遍历树(递归遍历), 删除空白的childrens
   * @param  {object}   node         根节点(单个对象, 多个树需要重复调用)
   * @return none
   */
    traverseTree (node) {
      let self = this
      if (!node) {
        return;
      }
      if (node.childrens && node.childrens.length > 0) {
        var i = 0;
        for (i = 0; i < node.childrens.length; i++) {
          this.traverseTree(node.childrens[i]);
          if(node.childrens[i].id == 88) {
            self.resourceUser = node.childrens[i].childrens
          }
          if(node.childrens[i].id == 89) {
            self.resourceAdmin = node.childrens[i].childrens
						console.log(self.resourceAdmin)
          }
        }
      }
    },
    /**
     * 获取当前可用的资源, 决定blockList的展示
     * @return {[type]} [description]
     */
    getActiveResource () {
      let self = this
      

      JSON.parse(sessionStorage.getItem("userData")).resourceDtos.forEach((item, index) => {
        self.traverseTree(item)
      })
    },


    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    
    /*
    * 获取已评审项目总数
    */
    getReviewTotal(){
      //this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
      this.axios.get(`${this.common.basePath}/project/page`,this._reviewParams()).then( (response) => {
        if(response.data.meta.code === 0){
          // this.$message.success(response.data.meta.message, 20);
          this.reviewTotal = response.data.data.total;
        }else{
          this.$message.error(response.data.meta.message, 20);   
        }
        
      }).catch( (error) => {
        this.$message.error(error);
      });
    },
    _reviewParams(){
      return {
        params: {
          status:6,
        }
      }
    },
    
    /* 
    获取未读消息的total
    */
    getNoticesTotal(){
      this.axios.get(`${this.common.basePath}/notices`,this._noticesParams()).then( (response) => {
        if(response.data.meta.code === 0){
          // this.$message.success(response.data.meta.message, 20);
          this.noticesTotal = response.data.data.total;
        }else{
          this.$message.error(response.data.meta.message, 20);   
        }
        
      }).catch( (error) => {
        this.$message.error(error);
      });
    },
    _noticesParams(){
      return {
        params: {
          cur_status:1,
          recipients:sessionStorage.getItem("assignee").toString(),
        }
      }
    },
    
    /*
    * 获取项目总数
    */
    getTotal(){
      //this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
      this.axios.get(`${this.common.basePath}/project/his/page`,this._allParams()).then( (response) => {
        if(response.data.meta.code === 0){
          // this.$message.success(response.data.meta.message, 20);
          this.total = response.data.data.total;
        }else{
          this.$message.error(response.data.meta.message, 20);   
        }
        
      }).catch( (error) => {
        this.$message.error(error);
      });
    },
    _allParams(){
      return {
        params: {
          status:"",
        }
      }
    },
    
    /*
    * 获取待受理项目总数
    */
    getDeclareTotal(){
      //this.axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(sessionStorage.getItem('token'))}`;
      this.axios.get(`${this.common.basePath}/project/page`,this._declareParams()).then( (response) => {
        if(response.data.meta.code === 0){
          // this.$message.success(response.data.meta.message, 20);
          this.declareTotal = response.data.data.total;
        }else{
          this.$message.error(response.data.meta.message, 20);   
        }
        
      }).catch( (error) => {
        this.$message.error(error);
      });
    },
    _declareParams(){
      return {
        params: {
          status:2,
        }
      }
    },
  },
}
</script>

<style rel="stylesheet/scss" lang="less" scoped>
  @keyframes cardsHover
  {
    0% {transform:scale(0.98, 0.98);background-color:#fff;box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);border-radius: 0;}
    30% {transform:scale(1, 1);background-color:#ececec;}
    60% {transform:scale(1.02, 1.02);background-color:#fff;}
    100% {transform:scale(1, 1); background-color:#fff; box-shadow: 0 0 20px rgba(0, 0, 0, .35);border-radius: 10px;}
  }

.panel-group {
  margin-top: 18px;
	// background: url(../../../assets/img/bg-img/1.jpg);
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #222;
		border-radius: 5px;
		background-color: rgba(255, 255, 255, 0.7);
		opacity: 1;
    // background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
		// background: url(../../../assets/img/bg-img/thumbs/1.jpg);
    transition: all 0.4s ease-out;
    .card-panel-icon-wrapper {
      position: relative;
      i {
        position: absolute;
        right: 11px;
        bottom: 11px;
      }
    }
    .background-pop-up {
      position: absolute;
      top: 15.55555px;
      right: -100px;
      width: 56.36756px;
      height: 56.36756px;
      transition: all 0.4s ease-out;
      border: 10px solid #e5f5ff;
      background-color: #ffffff;
      transform: rotate(45deg);
    }
    &:hover {
      transform: scale(1.1, 1.1);
      border-radius: 10px;
      box-shadow: 0 0 20px rgba(0, 0, 0, .25);
      .background-pop-up {
        right: -40px;
      }
      i {
        color: #fff;
      }
      .stageColor1.background {
        background-color: #ff5740;
      }
      .stageColor2.background {
        background-color: #e2920b;
      }
      .stageColor3.background {
        background-color: #55b77a;
      }
      .stageColor4.background {
        background-color: #409eff;
      }
      .stageColor5.background {
        background-color: #6e63b5;
      }
      .stageColor6.background {
        background-color: #a2a252;
      }
      .stageColor7.background {
        background-color: #379e9c;
      }
      .stageColor8.background {
        background-color: #409eff;
      }
      .stageColor9.background {
        background-color: #85dbff;
      }
      .stageColor19.background {
        background-color: #ff4000;
      }
      .stageColor-none.background {
        background-color: #333333;
      }
    }
    .card-panel-icon-wrapper {
      position: absolute;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      position: absolute;
      right: 0;
      font-weight: bold;
      z-index: 50;
      margin: 15px 15px 15px 25px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
        float: right;
      }
    }

  }
}
</style>
