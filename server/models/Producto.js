var mongoose = require('mongoose')
, autoIncrement	= require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var productSchema = mongoose.Schema({
	productNumber : Number,
	created		  : {type: Date, default: Date.now },
	stock_min	  : Number,
	stock_max	  : Number,
	category	  : { type: String, default: "Sin categoria " },
	provider 	  : { type: String, default: "Sin proveedor "}
},{
	collection: 'productos'
});

productSchema.plugin(autoIncrement.plugin, {
	model: 'Producto',
	field: 'productNumber',
	startAt: 1000,
	incrementBy: 1
});

module.exports = mongoose.model('Producto', productSchema);