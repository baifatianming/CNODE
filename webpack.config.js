var path = require('path');
var webpack = require('webpack');
// 显示打包进度
var ProgressBarPlugin = require('progress-bar-webpack-plugin');
// css样式从js文件中分离出来,需要通过命令行安装:
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry:[//唯一入口文件
		'webpack/hot/only-dev-server',//热替换
		'./src/main.js'
	],
	output:{//输出目录
		path:path.resolve(__dirname,'./dist'),//打包后的js文件存放的地方
		filename:'bundle.js',//打包后输出的js的文件名
		publicPath:'/dist/'
	},
	module:{
		loaders:[{
			test: /\.(js|jsx)$/, //一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
			exclude: /node_modules/, //屏蔽不需要处理的文件（文件夹）（可选）
			loader: "babel-loader"//loader的名称（必须）
		},{
			test: /\.css$/,
			exclude: /node_modules/,
			loader: 'style-loader!css-loader?sourceMap',
			// loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader'})
		}, {
			//cnpm install vue-loader vue-template-compiler
			test: /\.vue$/,
			loader: "vue-loader"
		}, {
			//cnpm install sass-loader node-sass
			test: /\.scss$/,
			loader: "sass-loader"
		},{
			//cnpm install less-loader less
			test: /\.less$/,
			loader: "less-loader"
		}, {
			//cnpm install less-loader less
			test: /\.(jpg|png|gif|jpeg)$/,
			loader: "url-loader"
		}, {
			//cnpm install file-loader
			test: /\.(ttf|svg|woff|eot)$/,
			loader: "file-loader"
		},{
		  test: /\.html$/,
		  exclude: /node_modules/,
		  loader: 'raw-loader'
		}, {
			//cnpm install html-loader
			test: /\.html$/,
			loader: "html-loader"
		} ]
	},
	//配置服务器
	devServer:{
		inline:true,//实时更新
		stats: 'errors-only' //打包过程只显示错误信息
	},
	resolve: {
	    alias: {
	      	vue: 'vue/dist/vue.js', //默认import的是vue.js,不加上的话默认import的是vue.common.js
	       
	    }
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin(),
		new ProgressBarPlugin(),
		new ExtractTextPlugin("style.css"), //提取出来的样式放在style.css文件中
		//new webpack.optimize.UglifyJsPlugin() //代码压缩
	]
}