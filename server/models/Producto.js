var mongoose = require('mongoose')
, autoIncrement	= require('mongoose-auto-increment');
var Proveedor = require('./Proveedor');


autoIncrement.initialize(mongoose.connection);

var productSchema = mongoose.Schema({
	_id 		  	  	  : { type : Number },
	product_name	  	  : { type : String, required: true  },
	product_created		  : { type : Date, default: Date.now },
	product_price		  : { type : Number, required : true }, 
	product_type_content  : { type : String, enum :['unidades', 'peso']},
	product_stock_min	  : { type : Number, min : 1 ,required: true, trim : true },
	product_stock_max	  : { type : Number, min : 1 ,required: true, trim : true },
	product_units		  : {type: Number, min : 1, trim : true },
	provider_id 	  	  : [{type : Number, ref : 'Proveedor'}]
},{
	collection: 'productos'
});

productSchema.plugin(autoIncrement.plugin, {
	model: 'Producto',
	field: '_id',
	startAt: 10000,
	incrementBy: 1
});

module.exports = mongoose.model('Producto', productSchema);