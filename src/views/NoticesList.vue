 <!--
		相关通知列表
	-->
<template>
  <div class="notices">
		<h2 class="page-title">相关通知列表</h2>
		<NoticesList/>
	</div> 
</template>

<script>
  import NoticesList from '@/components/NoticesList.vue'
  export default {
    name: 'notices',
    components: {
      NoticesList
    },
    mounted () {

    },
  }
</script>

<style>
 
</style>