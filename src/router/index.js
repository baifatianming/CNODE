import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import MuseUI from 'muse-ui'
import '../css/muse-ui.css'
Vue.use(MuseUI)

window.$ = require("jquery");
import indexComponent from '../components/indexComponent.vue';
import listComponent from '../components/listComponent.vue';
import detailComponent from '../components/detailComponent.vue';
import userComponent from '../components/userComponent.vue';
import aboutComponent from '../components/aboutComponent.vue';

const router = new VueRouter({
	routes:[{
		path:'/',
		name:'index',
		component:indexComponent,
		children:[{
			path:'list/',
			component:listComponent
		}]
	},{
		path:'/detail/:id',
		name:'detail',
		component:detailComponent
	},{
		path:'/user/',
		name:'user',
		component:userComponent
	},{
		path:'/about/',
		name:'about',
		component:aboutComponent
	}]
})

export default router;