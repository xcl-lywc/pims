 <!--
		项目跟踪图
	-->
<template>
  <div>
    <h2 class="page-title">项目跟踪图</h2>
    <div class="block-wrap">
      <div class="block-body">
				
				<div class="wrapper">
					<ul class="time-line">
						
						<!--从现在到以后-->
						<div>
							<el-button type="" size="small" class="clear tl-title tl-title-color">现在</el-button>
						</div>
						
						<!--从审批到 现在-->
						<div>
							<ul class="tl-item">
								<li class="tl-item-left fl">2018-06-25</li>
								<li class="tl-item-right fl">
									<div class="content">
										<span class="arrow-left"></span>
										财政审核通过
									</div>
								</li>
							</ul>
							<ul class="tl-item">
								<li class="tl-item-left fl">2018-06-20</li>
								<li class="tl-item-right fl b-c-c">
									<div class="content">
										<span class="arrow-left"></span>
										财政审批
									</div>
								</li>
							</ul>
							<ul class="tl-item">
								<li class="tl-item-left fl">2018-06-10</li>
								<li class="tl-item-right fl b-c-g">
									<div class="content content-bg">
										<span class="arrow-left arrow-left-bg"></span>
										审批通过
									</div>
								</li>
							</ul>
							<ul class="tl-item">
								<li class="tl-item-left fl">2018-06-01</li>
								<li class="tl-item-right fl b-c-j">
									<div class="content content-h1">
										<span class="arrow-left fl"></span>
										<div class="content-title fl">技术审批</div>
										<div class="content-desc clear">
											<div class="content-left fl">
												<el-button type="text" size="mini">@专家组 </el-button>
												<hr>
												<el-button-group>
													<el-button type="primary" icon="fa fa-eye"  size="mini"></el-button>
													<el-button type="primary"  size="mini"> 确定参加</el-button>
												</el-button-group>
											</div>
											<div class="content-right fl">
												<a class="avatar"><img src="../../../assets/img/b3.jpg" alt="管理员"><i class="spot"></i></a>
											</div>
										</div>
									</div>
								</li>
							</ul>
							<ul class="tl-item">
								<li class="tl-item-left fl">2018-05-04</li>
								<li class="tl-item-right fl b-c-e">
									<div class="content content-h2">
										<span class="arrow-left fl"></span>
										<div class="content-title fl">专家审批</div>
										<div class="content-desc clear">这是有个非常棒的好项目，请您提出您的宝贵意见，以便我们最终审核。</div>
										<ul class="content-list">
											<li class="fl item-img">
												<a href="#">
													<img src="../../../assets/img/b7.jpg" alt="专家甲"><i class="spot"></i>
												</a>
											</li>
											<li class="fl item-img">
												<a href="#">
													<img src="../../../assets/img/b14.jpg" alt="专家乙"><i class="spot"></i>
												</a>
											</li>
											<li class="fl item-img">
												<a href="#">
													<img src="../../../assets/img/b20.jpg" alt="专家丙"><i class="spot"></i>
												</a>
											</li>
											<li class="fl item-img">
												<a href="#">
													<img src="../../../assets/img/b0.jpg" alt="专家丁"><i class="spot"></i>
												</a>
											</li>
											<li class="fl item-img">
												<a href="#" class="add-btn">
													+20名
												</a>
											</li>
											<li class="fl item-img item-text">专家已预审</li>
										</ul>
										<div class="content-opinion">
											<span class="arrow-up"></span>
											<textarea placeholder="请填写你的宝贵审核意见..."></textarea>
											<p class="opinion-publish">
												<a href="#" class="fl camera"><i class="fa fa-camera"></i></a>
												<a href="#" class="fl"><i class="fa fa-video-camera"></i></a>
												<a href="#" class="fr submit-btn"><button>提交审核意见</button></a>
											</p>
										</div>
									</div>
								</li>
							</ul>
							<el-button type="" size="small" class="clear tl-title" round>审批</el-button>
						</div>
						
						<!--从twitter到 审批-->
						<div>
							<ul class="tl-item">
								<li class="tl-item-left fl">2018-03-06</li>
								<li class="tl-item-right fl b-c-t">
									<div class="content">
										<span class="arrow-left"></span>
										项目受理
									</div>
								</li>
							</ul>
							<el-button type="" size="small" class="clear tl-title-icon" circle><i class="fa fa-twitter"></i></el-button>
						</div>
						
						 <!--从开始到 twitter-->
						<div>
							<ul class="tl-item">
								<li class="tl-item-left fl">2018-03-05</li>
								<li class="tl-item-right fl b-c-s">
									<div class="content">
										<span class="arrow-left"></span>
										立项申请
									</div>
								</li>
							</ul>
							<el-button type="" size="small" class="clear tl-title" round>开始</el-button>
						</div>
						
					</ul>
				</div>
				
			</div>
    </div>
  </div>
  
</template>

<script>
  export default {
    methods: {
      /* 
				流程历史
      */
      processHistory(){
      	var formData = {
      		instanceId:JSON.parse(sessionStorage.getItem("historyId")),
      	}
      	this.axios.post(`${this.common.basePath}/activiti/history`,formData).then( (response) => {
      		if(response.data.meta.code === 0){
      			this.$message.success(response.data.meta.message, 20);
						this.history = response.data.data;
      		}else{
      			this.$message.error(response.data.meta.message, 20);   
      		}
      	}).catch( (error) => {
      		this.$message.error(error,20);            
      	});
      },
    },
		mounted(){
			this.processHistory()
		},
    data() {
      return {
        history:[],
      }
    }
  }
</script>

<style>
	ul,li,p{
		padding: 0;
		margin: 0;
	}
	
	ul,li{
		list-style: none;
	}
	
	.b-c-s{
		border-left-color: #1d1f26 !important;
	}
	
	.b-c-s:before{
		border-color: #1d1f26 !important;
	}
	
	.b-c-s:hover:before{
		background: #1d1f26 !important;
	}
	
	.b-c-t{
		border-left-color: #dee5e7 !important;
	}
	
	.b-c-t:before{
		border-color: #dee5e7 !important;
	}
	
	.b-c-t:hover:before{
		background: #dee5e7 !important;
	}
	
	.b-c-e{
		border-left-color: #7266ba !important;
	}
	
	.b-c-e:before{
		border-color: #7266ba !important;
	}
	
	.b-c-e:hover:before{
		background: #7266ba !important;
	}
	
	.b-c-j{
		border-left-color: blue !important;
	}
	
	.b-c-j:before{
		border-color: blue !important;
	}
	
	.b-c-j:hover:before{
		background: blue !important;
	}
	
	.b-c-g{
		border-left-color: #27c24c !important;
	}
	
	.b-c-g:before{
		border-color: #27c24c !important;
	}
	
	.b-c-g:hover:before{
		background: #27c24c !important;
	}
	
	.b-c-c{
		border-left-color: gray !important;
	}
	
	.b-c-c:before{
		border-color: gray !important;
	}
	
	.b-c-c:hover:before{
		background: gray !important;
	}
	
	.clear{
		clear: both;
	}
	
	.wrapper{
		overflow: hidden;
	}
	
	.time-line{
		margin-bottom: 50px;
		margin-top: 20px;
	}
	
	.time-line .tl-item{
		overflow: hidden;
	}
	
	.time-line .tl-title{
		margin-left: 125px;
	}
	
	.time-line .tl-title-icon{
		margin-left: 345px;
	}
	
	.time-line .tl-title-color{
		background-color: #23b7e5;
		color:#fff;
		font-weight: 500;
	}
	
	.time-line .tl-item .tl-item-right{
		border-left-width: 3px;
		border-left-color: #23b7e5;
		border-left-style: solid;
		box-sizing: border-box;
		padding:20px;
	}
	
	.time-line .tl-item .tl-item-right:before{
		position: relative;
		top: 14px;
		float: left;
		width: 8px;
		height: 8px;
		margin-left: -27px;
		background: #edf1f2;
		border-color: #23b7e5;
		border-style: solid;
		border-width: 2px;
		border-radius: 50%;
		content: "";
		box-shadow: 0 0 0 4px #f0f3f4;
	}
	
	.time-line .tl-item .tl-item-right:hover:before{
		background: #23b7e5;
		border-color: #edf1f2;
	}
	
	.time-line .tl-item .tl-item-right .content{
		border: 1px solid #edf1f2;
		height: 20px;
    padding: 10px 20px 10px 10px;
		background-color: #fff;
		color: #222;
		font-size: 15px;
	}
	.time-line .tl-item .tl-item-right .content-bg{
		background-color: #27c24c;
		color: #fff;
		
	}
	
	.time-line .tl-item .tl-item-right .content .arrow-left{
		display: inline-block;
    width: 10px;
    height: 10px;
    border: 1px solid #edf1f2;
    background-color: #fff;
    border-right-color: transparent;
    border-bottom-color: transparent;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    position: relative;
    left: -16px;
    top: -2px;
	}
	
	.time-line .tl-item .tl-item-right .content .arrow-left-bg{
		background-color: #27c24c;
	}

	.content-h2{
		height: 240px !important;
	}
	
	.content-h1{
		height: 120px !important;
	}
	
	.content .content-title{
		height: 35px;
	}
	
	.content .content-desc{
		border-top: 1px solid #ddd;
    padding: 10px;
	}
	
	.content .content-desc .content-left{
		overflow: hidden;
	}
	
	.content .content-desc .content-left hr{
	  margin: 0;
		border: none;
		margin-bottom: 8px;
	}
	
	.content .content-desc .content-right{
		margin-left: 50px;
    margin-top: 10px;
	}
	
	.content .content-desc .content-right .avatar{
		cursor: pointer;
	}
	
	.content .content-desc .content-right .avatar img{
		width: 50px;
		border-radius: 50%;
	}
	
	.content .content-desc .content-right .avatar .spot{
		display: inline-block;
		width: 8px;
		height: 8px;
		background-color: red;
		border-radius: 50%;
		position: relative;
		left: -10px;
		z-index: 10;
	}
	
	.content .content-list{
		overflow: hidden;
		padding: 10px 10px 0 10px;
	}
	
	.content .content-list .item-img{
		margin-right: 8px;
	}
	
	.content .content-list .item-text{
		line-height: 32px;
	}
	
	.content .content-list .item-img .add-btn{
		display: inline-block;
    color: #fff;
    text-decoration: none;
    background-color: #27c24c;
    height: 32px;
    line-height: 32px;
    padding: 0px 10px;
    border-radius: 16px;
	}
	
	.content .content-list .item-img a img{
		width: 32px;
		border-radius: 50%;
	}
	
	.content .content-list .item-img a .spot{
		display: inline-block;
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    position: relative;
    left: -10px;
    z-index: 10;
	}
	
	.content .content-opinion{
		overflow: hidden;
	}
	
	.content .content-opinion textarea{
		width: 100%;
		height: 50px;
		border-color: #eee;
		box-sizing: border-box;
		padding: 10px;
	}
	
	.content .content-opinion .arrow-up{
		display: inline-block;
    width: 10px;
    height: 10px;
    border: 1px solid #edf1f2;
    background-color: #fff;
    border-right-color: transparent;
    border-bottom-color: transparent;
    -webkit-transform: rotate(-315deg);
    transform: rotate(-315deg);
    position: relative;
    left: 15px;
    top: 10px;
	}
	
	.content .content-opinion .opinion-publish{
		overflow: hidden;
    background-color: #edf1f2;
    margin-top: -4px;
    padding: 10px;
	}
	
	.content .content-opinion .opinion-publish .camera{
		margin-right: 10px;
		margin-left: 10px;
	}
	
	.content .content-opinion .opinion-publish .submit-btn{
		margin-right: 10px;
	}
	
	.content .content-opinion .opinion-publish .submit-btn button{
		background-color: #23b7e5;
    color: #fff;
    outline: none;
    padding: 0;
    border: none;
    padding: 4px 8px;
	}
	
	.time-line .tl-item .tl-item-left{
		width: 150px;
		text-align: right;
		overflow: hidden;
		box-sizing: border-box;
		padding:30px 20px 20px 20px;
		font-size: 14px;
		color: #333;
	}
	
	
</style>