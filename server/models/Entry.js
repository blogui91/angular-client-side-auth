var mongoose = require('mongoose')
, autoIncrement	= require('mongoose-auto-increment');

var Producto = require('./Producto');

autoIncrement.initialize(mongoose.connection);

var entrySchema = mongoose.Schema({
	_id				  : { type: Number},
	product_id	 	  : { type : Number, ref : 'Producto'},
	entry_pieces	  : { type: Number, required: true, min : 1  max : 200 },
	entry_dateEntry   : { type: Date, default: Date.now },
	entry_caducidad	  : { type: Date},
	entry_notes	 	  : { type: String, default: "Sin notas" }
},{
	collection: 'entradas'
});

entrySchema.plugin(autoIncrement.plugin, {
	model: 'Entradas',
	field: '_id',
	startAt: 1000,
	incrementBy: 1
});

module.exports = mongoose.model('Entradas', entrySchema);