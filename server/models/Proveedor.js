
var mongoose = require('mongoose')
, autoIncrement	= require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var providerSchema = mongoose.Schema({
	providerNumber 	  : Number,
	provider_name 	  : { type: String, required: true},
	provider_address  : { type: String, required: true},
	telephone	  	  : Number,
	provider_rfc  : {type: String},
	notes	 	  	  : { type: String, default: "Sin notas "}
},{
	collection: 'proveedores'
});

providerSchema.plugin(autoIncrement.plugin, {
	model: 'Proveedor',
	field: 'providerNumber',
	startAt: 1000,
	incrementBy: 1
});

module.exports = mongoose.model('Proveedor', providerSchema);