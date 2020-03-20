import vue from 'vue';

import router from '.././router'
const Vue = new vue({router}); //注册router, 实例中调用

export default {
  basePath: `${window.location.origin}/api`,
  webSocketSever: `${window.location.host}/api/websocket`,
  ws: {}, //webSocket对象
  noticeNum: null, //提醒消息个数
  picsBasePath: `${window.location.origin}/pics`,
  elementPagination:{     //elementUi中的分页所需数据
      pageSizes: [10, 20, 30],
      pageSizeDefault: 10,   //初始条数
      pageNumDefault:1,      //初始页码
  },
  startInterval: false, //是否开始重复查询
  emailReg:  /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
  mobileReg: /^1[34578]\d{9}$/,
  /**
   * 遍历树(递归遍历), 删除空白的childrens
   * @param  {object}   node         根节点(单个对象, 多个树需要重复调用)
   * @return none
   */
  traverseTree (node) {
    if (!node) {
      return;
    }
    if (node.childrens && node.childrens.length > 0) {
      var i = 0;
      for (i = 0; i < node.childrens.length; i++) {
        this.traverseTree(node.childrens[i]); 
      }
    } else {
      delete node.childrens
    }
  },
  /**
   * 获取字典
   * @param  {number} name   字典表id
   * @return {array}  查询返回的树结构
   */
  getDictionaryData (id) {
    let self = this
    let cofig = {
      method: "get",
      url:    `${this.basePath}/contrast/all/tree`,
      params: {
        typeId: id
      }
    }

    let promise = new Promise ((resolve, reject) => {
      Vue.axios(cofig)
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        Vue.$message.error(error)
        reject([])
      })
    })
    
    return promise
  },
  /**
  * 将时间戳转换为某年某月某日 00：00：00
  * @params {string/number} timeSetback 时间戳
  * @params {string} format 时间格式
  */
  _convertDate(timeSetback, format){
    return timeSetback ? new Date(timeSetback).Format(format) : '无';
  },
  /*
   * 根据状态码显示项目当前状态
   */
  showStatusText(status){
    switch(status){
      case 1:
        return {name: '补充材料阶段', stageColor: 'stageColor1'};
        break;
      case 2:
        return {name: '项目受理阶段', stageColor: 'stageColor2'};
        break;
      case 3:
        return {name: '专家预审阶段', stageColor: 'stageColor3'};
        break;
      case 4:
        return {name: '专家评审阶段', stageColor: 'stageColor4'};
        break;
      case 5:
        return {name: '网信会议阶段', stageColor: 'stageColor5'};
        break;
      case 6:
        return {name: '提交财政意见阶段', stageColor: 'stageColor6'};
        break;
      case 7:
        return {name: '审核财政意见阶段', stageColor: 'stageColor7'};
        break;
      case 8:
        return {name: '项目实施阶段', stageColor: 'stageColor8'};
        break;
      case 9:
        return {name: '已完结', stageColor: 'stageColor9'};
      case 19:
        return {name: '已关闭', stageColor: 'stageColor19'};
        break;
      default:
        return {name: '全部', stageColor: 'stageColor-none'};
        break;
    };
  },
  /*
   * 项目状态数据
   */
  projectStatusData(){
    return [
      {id: 1, name: '补充材料阶段'},
      {id: 2, name: '项目受理阶段'},
      {id: 3, name: '专家预审阶段'},
      {id: 4, name: '专家评审阶段'},
      {id: 5, name: '网信会议阶段'},
      {id: 6, name: '提交财政意见阶段'},
      {id: 7, name: '审核财政意见阶段'},
      {id: 8, name: '项目实施阶段'},
      {id: 9, name: '已完结'},
      {id: 19, name: '已关闭'}
    ]
  },
  /*
   * 根据附件地址下载附件
   */
  downloadFileByUrl(fileUrl){
    window.open(fileUrl);
  },
  /*
   * 根据Id来显示对应的中文（对照表）
   */
  _controlTable(id){
    let data = JSON.parse(sessionStorage.getItem('controlTable')), name ;
    if(!data) return '无';
    
    data.forEach( (item) => {
      if(id == item.id){
        name = item.name
      } 
    });
    return name ? name : '无';
  },
  /**
   * 通用方法用于返回之前浏览的页面, 当path丢失时返回首页
   * @return {[type]} [description]
   */
  backForward () {
    let path = sessionStorage.getItem("historyPath") || "/"
    Vue.$router.push({path: path})
  },
}

/*
*   格式化日期格式
*/
Date.prototype.Format = function (fmt) {
  var o = {
      "M+": this.getMonth() + 1, //月份 
      "d+": this.getDate(), //日 
      "h+": this.getHours(), //小时 
      "m+": this.getMinutes(), //分 
      "s+": this.getSeconds(), //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}