/*************************************
*  create by xieyuanyuan date 2018/09/06
*  显示树形下拉
**************************************/
<template>
  <div class="my-tree">
      <ul>
       <li v-for="(item, index) in treeData" 
          :key="index" 
          :class="{'last-li' : !item.childrens.length, 'open': item.isShow}" 
          @click.stop="showChildren(item)">
        <el-checkbox v-if="!item.childrens.length" :label="item.id">{{item.name}}</el-checkbox>
        <span v-if="item.childrens.length">{{item.name}}</span>
        <items v-show="item.childrens && item.isShow" :treeData="item.childrens"></items>
       </li>
     </ul>
  </div>
</template>
<script>
  import items  from './Tree_Selected_Loop.vue'
  export default {
    name: 'items',
    props:{
      treeData:   null, //树结构数据
      layer:      null, //第几层
    },
    data() {
      return {  
        checkedCities: null,
      }
    },
    mounted() {
    },
    watch:{
    },
    destoryed() {

    },
    methods:{
      showChildren(item){
        item.isShow = !item.isShow;
      },
    }
  }
</script>
