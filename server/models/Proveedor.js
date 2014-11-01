
var mongoose = require('mongoose')
, autoIncrement	= require('mongoose-auto-increment');

var Producto = require('./Producto');

autoIncrement.initialize(mongoose.connection);

var providerSchema = mongoose.Schema({
	_id				 	  : { type: Number},
	provider_name	 	  : { type: String, required: true},
	provider_address	  : { type: String, required: true},
	provider_telephone 	  : { type: Number, trim : true},
	provider_rfc  	  	  : { type: String, trim : true},
	provider_notes	 	  : { type: String, default: "Sin notas"},
	product_id			  : [{ type: Number, ref : 'Producto' }]
},{
	collection: 'proveedores'
});

providerSchema.plugin(autoIncrement.plugin, {
	model: 'Proveedor',
	field: '_id',
	startAt: 10000,
	incrementBy: 1
});

module.exports = mongoose.model('Proveedor', providerSchema);