<template>
	<div>
		<mu-appbar title="detail">
		    <mu-icon-button icon="close" slot="left" @click="revert"/>
		    <mu-icon-menu icon="more_vert" slot="right">
		     	<mu-menu-item title="关于" class="menuItem2" @click="link"/>
		    </mu-icon-menu>
	  	</mu-appbar>
	  	<div style="text-align:center;margin-top:60px" v-if="circle==true">
			<mu-circular-progress :size="40" />
		</div>
		<div v-else="circle">
			
			<h2 class="topic-title" v-text="datas.title"></h2>
			<div class="section">
				<div class="status">
	    			<img :src="datas.author.avatar_url" class="avatar"/>
					<div class="detail">
						<div>
							<span :class="datas.top==true?'topics':datas.tab" >
			    				{{datas.top==true?"置顶":(datas.tab=="ask"?"问答":(datas.tab=="job"?"招聘":(datas.tab=="share"?"精华":"分享")))}}
			    			</span>
							<span>{{datas.author.loginname}}</span>
						</div>
						<div>
							<span>{{datas.visit_count?datas.visit_count:''}}次浏览</span>
							<span>发布于:{{datas.create_at.substr(0,10)}}</span>
						</div>
					</div>
	    		</div>
			</div>
			<div class='markdown-body'>
				<div v-html="datas.content"></div>
			</div>
			<h3 class="subtitle">
				<strong v-text='datas.replies.length'></strong>
				个回复
			</h3>
			<section class="reply-list">
				<div class="reply-box" v-for="(item,index) in datas.replies" :key="index">
					<div class="status">
						<img :src="item.author.avatar_url" class="avatar">
						<i class='icon-repost'>
							<span></span>
						</i>
						<i class="icon-like">
							<span></span>
							{{item.ups.length}}
						</i>
						<div class="detail">
							<div v-text="item.author.loginname"></div> 
							<div v-text="item.create_at.substr(0,10)"></div>
						</div>
					</div>
					<hr>
					<div v-html="item.content"></div>
				</div>
			</section>
			<div class="myReply">
				<input v-model="message" type="text" placeholder="回复内容">
				<button @click="send()">回复</button>
			</div>
			<a href="javascript:scroll(0,0)" class="totop">
				<img src="../images/jiantou.png" alt="">
			</a>
		</div>
		<div class="isSuccess" style="display: none;">请登录</div>
	</div>
</template>
<script>
import './css/detailComponent.css'
import './css/common.css'
	export default{
		data(){
			return {
				apiUrl:"https://cnodejs.org/api/v1/topic/",
				datas:[],
				circle:true,
				message:''
			}
		},
		created(){
			
		},
		computed:{
			
		},
		methods:{
		    handleTabChange (val) {
		      	this.activeTab = val
		    },
		    toggle (flag) {  //弹出左边框
		    	console.log('111')
		      	this.open = !this.open
		      	this.docked = !flag
		    },
		    getdata(){
		    
				var self = this;
				// console.log(this.apiUrl);
				$.ajax({
					url:self.apiUrl,
					type:"GET",
					dataType:'json',
					success:function(res){
						self.datas = res.data;
						console.log(self.datas);
						self.circle = false;
						
					},
					error:function(err){
						console.log(err)
					}
				})
		    },
		    link(){
		    	window.location.href='#/about/'
		    },
		    revert(){
		    	window.location.href='#/'
		    },
		    send(){//发送消息
		    	const self = this;
		    	if(document.cookie){
		 			const cookies = document.cookie.split('; ');
		 			for(let i=0;i<cookies.length;i++){
		              let arr = cookies[i].split('=');
		              if(arr[0] === 'name'){
		                var acto = arr[1];
		              }else if(arr[0] === 'id'){
		                var replyId = arr[1]
		              }
		            }
		    		if(self.message!=""){
		    			// console.log()
		    			$.ajax({
		    				url:"https://cnodejs.org/api/v1/topic/"+self.$route.params.id + "/replies/",
		    				type:"POST",
		    				data:{
		    					accesstoken:acto,
		    					content:self.message,
		    				},
		    				success:function(res){
		    					console.log(res)
		    					self.message = '';
		    					self.getdata();
		    				},
		    				error:function(err){
		    					console.log(err)
		    				}
		    			})
		    		}
		    		
		    	}else {
		    		$('.isSuccess').css("display","block");
		    		setTimeout(function(){
		    			$('.isSuccess').css("display","none");
		    		},1000)
		    	}
		    	
		    }
		},
		mounted(){
			console.log(this.$route.params.id)
			//获取id,并赋值
			this.apiUrl += location.hash.split('/')[2];
			this.getdata();
			console.log(document.cookie);
		}
	}
</script>