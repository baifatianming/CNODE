import Vue from 'vue';
import router from './router/';
// var status = new Vue({});

new Vue({
	el:'#app',
	router,
	template:`<router-view></router-view>`
})

