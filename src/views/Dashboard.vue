<template>
  <div class="dashboard">
    <h2 class="page-title">项目统计</h2>
    <DashBoard/>
  </div>
</template>
<script>
  import qs    from "qs"; //需要传表单时, 引用此包
  import DashBoard from '@/components/dashboard/DashBoard.vue'
  export default {
    name: 'dashboard',
    components: {
      DashBoard
    },
    mounted () {
      // let config = {
      //   method: "post",
      //   url:    `${this.common.basePath}/login/in`,
      //   data:   qs.stringify({
      //     username: "pim-admin",
      //     password: "123"
      //   })
      // }
      // this.axios(config).then((response) => {
      //   //登录成功储存token
      //   this.axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;
      //   //session中存储用于图片和文件上传
      //   sessionStorage.setItem('token',JSON.stringify(response.data.data.token));

      // }).catch((error) => {
      // })

    },
  }
</script>
