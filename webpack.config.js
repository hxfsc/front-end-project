var webpack = require('webpack');
var __srcPath = './src/';
var __buildPath = './build/';

var __dev = {
	src: {
		js: __srcPath + 'javascript/'
	},

	build: {
		js: __buildPath + '/public/javascript/'
	}

};

module.exports = {
	entry: __dev.src.js + 'main.js',
	output: {
		path: __dev.build.js,
		filename: 'main.js'
	},
	
	module: {
		loaders:[
			{
				test: /\.js$/, 
				exclude: /(node_modules|bower_components)/,
    		loader: 'babel-loader',
    		query: {
		      presets: ['es2015']
		    }
			}
		]
	},
	// resolve: {
 //    alias: {
 //      jquery: __dev.src.js + 'jquery'
 //    }
 //  },

	plugins: [

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    // 
    // 
    
    // new webpack.ProvidePlugin({
    //    $:"./jquery",
    //    jQuery:"./jquery",
    //    "window.jQuery":"./jquery"
    // })
    
    
  ]

}