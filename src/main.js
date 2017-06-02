import Vue from 'vue';
import router from './router/';
// var status = new Vue({});

	//状态管理
var store = new Vuex.Store({
	state: {
		exchange: "测试"
	},
	mutations: {
		setExchange(state, data) {
			state.exchange = data
		}
	},
	getters: {
		getExchange(state) {
			return state.exchange
		}
	}
});

new Vue({
	el:'#app',
	router,
	store,
	template:`<router-view></router-view>`,
	data: {
		name: "Pawn"
	},
})

