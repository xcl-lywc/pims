/*************************************
*  create by xieyuanyuan date 2018/09/06
*  查询树形下拉
**************************************/
<template>
  <el-checkbox-group class="my-tree-bar" v-model="checkedValue" @check-change="handleCheckChange">
    <tree-selected-loop :treeData="treeData" layer="1"></tree-selected-loop>
  </el-checkbox-group>
</template>
<script>
  import Tree_Selected_Loop  from './Tree_Selected_Loop.vue'
  export default {
    components: {
      'tree-selected-loop': Tree_Selected_Loop,
    },
    watch:{
    },
    data() {
      return { 
        treeData:      null, 
        countLayer:    0, //为第一层，默认显示， 
        checkedValue: [], //被选中人员数组
      }
    },
    created() {
      this.getQueryTree();
    },
    watch:{
    },
    destoryed() {

    },
    methods:{
      /*
       * 根据类别Id查询它的子节点
       */
      getQueryTree(){
        this.axios.get(`${this.common.basePath}/resources/tree`, this._queryTreeParams() ).then( (response) => {
           this.treeData = this._convertData(response.data.data);
           console.log(this.checkedValue);
        }).catch( (error) => {
          this.$message.error(error);
        });
      },
      _queryTreeParams(){
        return {
          params: {
            type:     1, // 1是前端栏目菜单，2是后台菜单
          }
        }
      },
      _convertData(data){
        this.countLayer++;
        data.forEach((item) => {
          this.countLayer == 1 ? item.isShow = true : item.isShow = true;
          if(item.childrens) this._convertData(item.childrens); 
          if(!item.childrens) {
            if(item.isSelect) this.checkedValue.push(item.id);
          }
        })
        return data;
      },
      handleCheckChange(data){
        this.$emit('checkedDataList', data);
      }
    }
  }
</script>
<style type="text/css">
.my-tree-bar.el-checkbox-group{
  font-size: 14px!important;
}
</style>