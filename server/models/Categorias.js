var mongoose = require('mongoose')
, autoIncrement	= require('mongoose-auto-increment');

autoIncrement.initialize(mongoose.connection);

var categorySchema = mongoose.Schema({
	categoryNumber 	  : Number,
	categoryname 	  : { type: String, required: true}
},{
	collection: 'categorias'
});

categorySchema.plugin(autoIncrement.plugin, {
	model: 'Categoria',
	field: 'categoryNumber',
	startAt: 1000,
	incrementBy: 1
});

module.exports = mongoose.model('Categoria', categorySchema);