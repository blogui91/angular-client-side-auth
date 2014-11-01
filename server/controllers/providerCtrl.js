var Provider = require('../models/Proveedor.js');
var Product = require('../models/Producto.js');

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    return res.status(404).send("no session login");
}
module.exports = {
	getProviders : function(req,res,next){
		Provider.find()
			.populate('product_id')
			.exec(
				 function(err,pro){
					if(err) res.send(400, 'Error al obtener la lista de proveedores');
					if(pro) {
						res.send(200, JSON.parse(JSON.stringify(pro)));
						console.log("Lista de proveedores "+pro);
					}
					else{
						res.send(400, 'Sin documentos');
					}

			});
	},
	findById : function(req,res,next){
		
		Provider.findOne({'providerNumber' : req.body.id }, function(err,proveedor){
			if(err)
				res.send(400, 'Error al obtener el proveedor');
			if(!proveedor){
				console.log(proveedor);
				res.send(400, 'Sin documentos');
			}
			else{
				res.send(proveedor.toJSON());
				console.log("Lista de proveedores "+proveedor);
			}
		});
	},
	addProvider : function(req,res,next){
		console.log("POST");
		console.log(req.body);

		var provider = new Provider({
			provider_name 	   : req.body.nombre,
			provider_address   : req.body.direccion,
			provider_telephone : req.body.telefono,
			provider_rfc  	   : req.body.rfc,
			provider_notes 	   : req.body.notas
		});

		provider.save(function(err){
			if(!err){
				console.log('Categoria guardada');
				res.send(200, {'success': 'Realizado con éxito'});
			}
			else{
				console.log('Hubo un error al guardar el registro: '+provider+" "+err);
				res.send(400,{'error' : 'Hubo un error al guardar el registro: '});
			} 
		});

	   
	},
	deleteProvider : function(req, res, next){
		console.log(req.body);
		var value = '';

		for(var index in req.body.list){
			for(var i in req.body.list[index].product_id){
				console.log(req.body.list[index].product_id[i]._id);
				console.log('product_id');
				
				Product.findOne({'_id' : req.body.list[index].product_id[i]._id},function(err,doc){
					doc.provider_id.pull(req.body.list[index]._id);
					doc.save();
					console.log('unlinked');
				});
			}
		}
		
		for(var index in req.body.list){
			value =  req.body.list[index]._id;
					
			Provider.remove({ _id : value},function(err,pro){
				if(pro){


					console.log('Se eliminaron correctamente los archivos ad');
					res.send(200, {'success' : 'Se realizó la eliminación con éxito'});
				} 
				else{
					console.log('Hubo un error al eliminar el registro '+pro);	
					res.send(400, {'error' : 'No se pudo eliminar el registro :('} );
				}
			});
		}




	},
	editProvider : function(req, res, next){
		console.log(req.body);
		var value = '';
		var newProductVar = false;
		var productToDeleteVar = false;
		var query = {
			'_id' :req.body.fields._id
		};

		console.log(req.body.newProducts.length);
		if(req.body.newProducts.length > 0){
			newProductVar = true;
			console.log('newProductVar = True');
		}
		if(req.body.productsToDelete.length > 0){
			productToDeleteVar = true;
			console.log('productToDeleteVar = True');
		}
		
			Provider.findOne({ _id : req.body.fields._id },function(err,pro){
				if(pro){
					pro.provider_name = req.body.fields.provider_name;
					pro.provider_address = req.body.fields.provider_address;
					pro.provider_telephone = req.body.fields.provider_telephone;
					pro.provider_rfc = req.body.fields.provider_rfc;
					//pro.save();
					if(newProductVar){
						console.log('Productos nuevos a agregar');
						console.log(req.body.newProducts)
						for(var i in req.body.newProducts){
							pro.product_id.push(req.body.newProducts[i]._id)
							//doc.subdocs.pull({ _id: 4815162342 })
						}
					}

					if(productToDeleteVar){
						for(var i in req.body.productsToDelete){
							pro.product_id.pull(req.body.productsToDelete[i]._id)
						}
					}
					pro.save();

					for(var index in req.body.newProducts){
						Product.findOne({'_id': req.body.newProducts[index]._id },function(err,doc){
							doc.provider_id.push(req.body.fields._id);
							console.log('Linked');
							doc.save();
						});
					}

					for(var index in req.body.productsToDelete){
						Product.findOne({'_id': req.body.productsToDelete[index]._id },function(err,doc){
							doc.provider_id.pull(req.body.fields._id);
							console.log('Linked');
							doc.save();
						});	
					}


					console.log('Se modificó correctamente ');
					res.send(200, {'success' : 'Se realizó la MODIFICACIÓN con éxito'});
				} 
				else{
					console.log('Hubo un error '+err);	
					res.send(400, {'error' : 'No se pudo modificar el registro :('} );
				}
			});
		
	}
};