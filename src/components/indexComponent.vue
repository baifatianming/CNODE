<template>
	<div>
		
		<mu-appbar >
        <mu-icon-button icon="menu" slot="left" @click="toggle()"/>

    	  <mu-drawer :open="open" :docked="docked" @close="toggle()">
          <mu-list @itemClick="docked ? '' : toggle()">
            <mu-appbar title="Title">
    		  
          		<mu-icon-button icon="close" v-if="docked" @click.native="open = false"  />
    	  		<mu-flat-button label="CNode" />
    		  </mu-appbar>
            
            <div style="margin-top:60px">
            	
            	<i data-v-43f57338="" class="logo"></i>
            </div>
            <div>
          		<mu-list-item title="未登录" disabled>
    			    <mu-avatar slot="left" backgroundColor="#fff" src="./src/images/denglu.png"/>
    		 	</mu-list-item>
            </div>
           	<div style="margin-left:20px">
           		省流量
             	<mu-switch style="margin-left:100px" class="demo-switch" @input="add"/>
           	</div>
          </mu-list>
        </mu-drawer>

        <mu-tabs :value="activeTab" @change="handleTabChange">
            <mu-tab value="tab1" title="全部"/>
    		    <mu-tab value="tab2" title="精华"/>
    		    <mu-tab value="tab3" title="分享"/>
    		    <mu-tab value="tab4" title="问答"/>
    		    <mu-tab value="tab5" title="招聘"/>
        </mu-tabs>

        <mu-icon-menu icon="more_vert" slot="right">
          <mu-menu-item title="登陆"class="menuItem1" @click="login()"/>
          <mu-menu-item title="关于"class="menuItem2" @click="about()"/>
     		</mu-icon-menu>

	 	</mu-appbar>
    <!-- 遮罩层 -->
    <div class="alert-matte" v-if="mask" @click="mk"></div>
    
    <!-- 登陆成功与否 -->
    <div class="isSuccess" style="display: none;"></div>

    <!-- 登陆窗口 -->
    <div class="login-dialog alert" style="display:none;">
      <input v-model="inputText" type="text" placeholder="AccessToken" class="count">
      <button class="lbtn lbtn1" @click="loginCnode">登 陆</button>
      <button class="lbtn lbtn2" @click="delCookie" style="display:none;">退 出 登 陆</button>
    </div>  
    
	  <div v-if="activeTab === 'tab1'">
        <listBest :show="showPic"></listBest>
	  </div>
	  
	  <div v-if="activeTab === 'tab2'" >
	    	<listBest name="good" :show="showPic"></listBest>
	  </div>
	  <div v-if="activeTab === 'tab3'">
	    <listBest name="share" :show="showPic"></listBest>
	  </div>
	  <div v-if="activeTab === 'tab4'">
	    <listBest name="ask" :show="showPic"></listBest>
	  </div>
	  <div v-if="activeTab === 'tab5'">
	    <listBest name="job" :show="showPic"></listBest>
	  </div>
	</div>
</template>
<script>
import "./css/indexComponent.css"
import list from "./listComponent.vue"
import Vue from 'vue';
var status = new Vue();
export default {
  data () {
    return {
      activeTab: 'tab1',
      open: false,
      docked: true,
      mask:false,
      showPic:true,
      inputText:""
    }
  },
  methods: {
    handleTabChange (val) {
      this.activeTab = val
    },
    toggle (flag) {  //弹出左边框
      this.open = !this.open
      this.docked = !flag
    },
    login(){ // 弹出登陆窗口和遮罩层
    	// console.log('denglu');
      this.mask = true;
      $('.alert').css("display","block");
      // console.log(this.$el.querySelect('.alert-matte'))
    },
    about(){ // 跳转到about页面

    },
    add(){ // 省流量模式.
      this.showPic = !this.showPic;
    },
    mk(){ //遮罩层
      this.mask = !this.mask;
      $('.alert').css("display","none");
    },
    loginCnode(){//点击登录按钮
      // const inputText = $(event.target).prev().val();
      const self = this;
      $.ajax({
        url:'https://cnodejs.org/api/v1/accesstoken/',
        type:"POST",
        data:{
          accesstoken :self.inputText
        },
        success:function(res){
          if(res.success){
            $('.lbtn1').css("display",'none')
            $('.lbtn1').prev().css("display",'none');
            $('.lbtn2').css("display",'block')
            self.mask = false;
            $('.alert').css("display","none");
            $('.isSuccess').css('display','block');
            $('.isSuccess').html('登陆成功');
            
            document.cookie = "name="+self.inputText;
            document.cookie= "login="+res.loginname;
            document.cookie = "src="+res.avatar_url;
            document.cookie = "id="+res.id;
            console.log(document.cookie);
            $('.mu-avatar-inner img').attr('src',res.avatar_url);
            $('.mu-item-title').html(res.loginname);
            setTimeout(function(){
              $('.isSuccess').css('display','none');
            },1000)
          }
        },
        error:function(err){

          // console.log(err)
          self.mask = false;
            $('.alert').css("display","none");
            $('.isSuccess').css('display','block');
            $('.isSuccess').html('登陆失败')
            setTimeout(function(){
              $('.isSuccess').css('display','none');
            },1000)
        }
      })
    },
    delCookie(){
      if(document.cookie){
        var now = new Date();
        now.setDate(now.getDate()-7);
        document.cookie = "name="+''+";expires="+now;
        document.cookie = "login="+''+";expires="+now;
        document.cookie = "src="+''+";expires="+now;
        document.cookie = "id="+''+";expires="+now;
        // console.log(document.cookie)
        this.mask = false;
        // console.log(document.cookie);
        $('.lbtn1').css("display",'block')
        $('.lbtn1').prev().css("display",'block');
        $('.lbtn2').css("display",'none')
        $('.alert').css("display","none");
        $('.mu-avatar-inner img').attr('src','./src/images/denglu.png');
        $('.mu-item-title').html("未登录");
      }
    }
  },
  mounted(){
    const self = this;
      if(document.cookie){
            $('.lbtn1').css("display",'none')
            $('.lbtn1').prev().css("display",'none');
            $('.lbtn2').css("display",'block');

            const cookies = document.cookie.split("; ");
            // console.log(cookies);
            for(let i=0;i<cookies.length;i++){
              let arr = cookies[i].split('=');
              if(arr[0] === 'login'){
                $('.mu-item-title').html(arr[1]);
              }else if(arr[0] === 'src'){
                $('.mu-avatar-inner img').attr('src',arr[1]);
              }
            }
            
            
      }
  },
  components:{
  	"listBest":list
  }
}
</script>