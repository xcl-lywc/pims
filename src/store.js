import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    noticeNum: null, //页面右上角提示信息数量
    timeInterval: null,
    time: 5, // webSocket等待刷新的时间(ms)
    interval: true, // 反复查询
  },
  mutations: {
    /**
     * 更新提醒消息数量
     * @param  {[type]} state [description]
     * @param  {number} data  荷载的参数 个数
     * @return {[type]}       [description]
     */
    change (state, data) { 
      state.noticeNum = data
    },
    changeInterval (state, data) { 
      state.inteval = data
    },
    /**
     * 启用时间自减
     * @param  {[type]} state [description]
     * @return {[type]}       [description]
     */
    increaseTime (state) {
      if(!state.timeInterval) {
        state.timeInterval = setInterval(() => {
          if(state.time > 0) {
            state.time--
          } else {
            clearInterval(state.timeInterval);
          }
          console.log(state.time)
        }, 1000)
      } else {
        console.log("已有正在开启的计时器")
      }
    },
    /**
     * 重设时间, 同时停止时间自减
     * @param  {[type]} state [description]
     * @param  {number} data  荷载的参数 时间(s)
     * @return {[type]}       [description]
     */
    resetTime (state, data) {
      clearInterval(state.timeInterval);
      state.timeInterval = null
      state.time = data || 5
    }
  },
  actions: {

  }
})
