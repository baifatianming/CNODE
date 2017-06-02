<template>
	<div>
		<!-- 环形进度指示器 -->
		<div style="text-align:center;margin-top:70px" v-if="circle==true">
			
			<mu-circular-progress :size="40" />
		</div>

		<!-- 列表数据 -->
		<ul class="list" v-if="circle==false">
		    	<li v-for="(item,index) in datas" :key="index">
		    		<router-link :to="'/detail/'+item.id">
			    		<h3 class="top">
			    			<span :class="item.top==true?'topics':(item.good==true?'good':item.tab)" >
			    				{{item.top==true?"置顶":(item.tab=="ask"?"问答":(item.tab=="job"?"招聘":(item.good==true?"精华":"分享")))}}
			    			</span>
							{{item.title}}
			    		</h3>
			    		<div class="status">
			    			<img v-if="show==true" :src="item.author.avatar_url" class="avatar"/>
							<div class="detail">
								<div>
									<span>{{item.reply_count}}/{{item.visit_count}}</span>
									<span v-text="item.author.loginname"></span>
								</div>
								<div>
									<span v-text="item.last_reply_at.substr(0,10)"></span>
									<span v-text="item.create_at.substr(0,10)"></span>
								</div>
							</div>
			    		</div>
		    		</router-link>
		    	</li>
		    	<mu-infinite-scroll :scroller="scroller" :loading="loading" @load="loadMore"/>
		</ul>  	

		<!-- 点击加载 -->
		<div v-if="circle==false" class="updata" @click="loadMore()">点击加载更多</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
		      open: false,
		      docked: true,
		      apiUrl:"https://cnodejs.org/api/v1/topics",
		      datas:[],
		      num: 10,  			//每一页加载的数量
		      loading: false,
		      scroller: null,
		      pages:1,
		      circle:true,
		    }
		},
		watch:{
			name(){
			var self = this;
			this.circle = true
			this.pages = 1;
			  	$.ajax({
			  		url:self.apiUrl,
			  		type:"GET",
			  		dataType: 'json',
			  		data:{
			  			page:self.pages,
			  			tab:self.name,
			  			limit:self.num
			  		},
			  		success:function(res){
			  			self.datas = res.data;
			  			// self.pages++;
			  			self.circle = false;
			  			console.log(self.pages)
			  			console.log(self.datas)
			  		}
			  	})
			}
		},
		created(){
			// status.$on('showPic',function(data){

				// console.log(666+data);
			// })
		},
		props:['name',"show"],
		methods:{
		    login(){
		    	console.log('denglu')

		    },
		    about(){

		    },
			loadMore () {
		      this.loading = true
		      this.pages++;
		      const self = this;
		      setTimeout(() => {
		        $.ajax({
		        	type:"GET",
		        	url:self.apiUrl,
		        	dataType:'json',
		        	data:{
		        		limit:self.num,
		        		page:self.pages,
		        		tab:self.name
		        	},
		        	success:function(res){
		        		var a = self.datas.concat(res.data);
		        		
		        		self.datas = a;
		        		console.log(self.pages);
		        		self.circle = false;
		        	},
		        	error:function(err){
		        		console.log(err)
		        	}
		        })
		        this.loading = false
		      }, 2000)
		    }
		},
		mounted(){
		  	var self = this;
		  	$.ajax({
		  		url:self.apiUrl,
		  		type:"GET",
		  		dataType: 'json',
		  		data:{
		  			page:self.pages,
		  			tab:self.name,
		  			limit:self.num
		  		},
		  		success:function(res){
		  			self.datas = res.data;
		  			// self.pages++;
		  			self.circle = false;
		  			console.log(self.datas)
		  		}
		  	})
		}
	}
</script>