var Categorias = require('../models/Categorias');

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    return res.status(404).send("no session login");
}

module.exports = {
	getCategories : function(req,res,next){
		Categorias.find({}, function(err,categorias){
			if(err)
				res.send(400, 'Error al obtener la lista de Categorias');
			if(!categorias) 
				res.send(400, 'Sin documentos');
			else{
				res.send(JSON.parse(JSON.stringify(categorias)));
				console.log("Lista de Categorias "+categorias);
			}
		});

	
	},

	findByID : function(req,res,next){
		console.log(req);
		Categorias.findOne({'categoryNumber' : req.body.numero }, function(err,categoria){
			if(err)
				res.send(400, 'Error al obtener la Categoria');
			if(!categoria){
				console.log(categoria);
				res.send(400, 'Sin documentos');
			}
			else{
				res.send(categoria.toJSON());
				console.log("Lista de Categorias "+categoria);
			}
		});

	
	},

	addCategory : function(req,res){
		console.log("POST");
		console.log(req.body);

		var category = new Categorias({
			categoryname : req.body.categoria,
			categoryNumber : req.body.numero
		});

		category.save(function(err){
			if(!err) console.log('Categoria guardada');
			else{
				console.log('Hubo un error al guardar el registro: '+category+" "+err);
				res.send('Hubo un error al guardar el registro: ');
			} 
		});

	   res.send(category);
	},

	updateCategory : function(req, res){
		console.log("UPDATE")
		Categorias.findById(req.params.id, function(err,categoria){
			categoria.category_name = req.body.nombreCategoria
		});

		Categorias.save(function(err){
			if(!err) console.log("Categoría Guardada");
			else	console.log("Hubo un error al actualizar el registro "+err);
		});
	},

	deleteCategory : function(req,res){
		console.log("DELETE");
		Categorias.findById(req.params.id, function(err,categoria){
			categoria.remove(function(err){
				if(!err) console.log("Categoría eliminada.");
				else console.log("Hubo un error al eliminar la categoría. ");
			});
		});	
	}
};