var mongoose = require('mongoose')
, autoIncrement	= require('mongoose-auto-increment');

var Producto = require('./Producto');

autoIncrement.initialize(mongoose.connection);

var exitSchema = mongoose.Schema({
	_id		  	 	  : { type : Number},
	product_id	 	  : { type: Number, ref : 'Producto' },
	exit_pieces	  	  : { type: Number, required: true, min : 1, max : 200},
	exit_dateExit     : { type: Date, default: Date.now },
	exit_notes	 	  : { type: String, default: "Sin notas "}
},{
	collection: 'salidas'
});

exitSchema.plugin(autoIncrement.plugin, {
	model: 'Salidas',
	field: '_id',
	startAt: 1000,
	incrementBy: 1
});

module.exports = mongoose.model('Salidas', exitSchema);