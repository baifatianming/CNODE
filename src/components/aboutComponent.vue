<template>
	<div>
		<mu-appbar title="关于">
		    <mu-icon-button icon="close" slot="left" @click="revert"/>
		    <mu-icon-menu icon="more_vert" slot="right">
		     	<mu-menu-item title="关于" class="menuItem2"/>
		    </mu-icon-menu>
	  	</mu-appbar>
	</div>
</template>
<script>
import './css/common.css'
	export default{
		data(){
			return {

			}
		},
		methods:{
		    revert(){
		    	// window.location.href='#/'
		    }
		}

	}
</script>