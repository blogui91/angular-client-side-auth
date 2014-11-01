var Producto = require('../models/Producto.js');
var Proveedor = require('../models/Proveedor.js');



function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    return res.status(404).send("no session login");
}
module.exports = {
	getProductos : function(req,res,next){
		Producto.find()
		.populate('provider_id')
		.exec(
			function(err,pro){
			if(err) res.send(400, 'Error al obtener la lista de producto');
			if(pro){
				res.send(200,JSON.parse(JSON.stringify(pro)));
				console.log("Lista de productoes "+pro);
			}
		 });
		 
	},
	findById : function(req,res,next){
		
		Producto.findOne({'ProductoNumber' : req.body.id }, function(err,producto){
			if(err)
				res.send(400, {'error' : 'Error al obtener el producto'});
			if(!producto){
				console.log(producto);
				res.send(400, 'Sin documentos');
			}
			else{
				res.send(200,producto.toJSON());
				console.log("Lista de productos "+producto);
			}
		});
	},
	addProducto : function(req,res,next){
		console.log("POST");
		console.log(req.body);
		console.log('----');


		var nProducto = new Producto({

			product_name 	  		: req.body.nombre,
			product_price  			: req.body.precio,
			product_type_content  	: req.body.tipo,
			product_stock_min  		: req.body.stock_min,
			product_stock_max  		: req.body.stock_max,
			product_units 	  		: req.body.unidades,
			provider_id				: req.body.provider
		});
		console.log(nProducto);
		
		nProducto.save(function(err){
			if(!err){
				Producto.findOne({},'_id')
						.sort('-_id')
						.exec(function(err,pro){
							Proveedor.update({ '_id' : nProducto.provider_id[0] }, 
										{$push : {'product_id' : pro } }
										,function(err,provider){
											if(err){ 
												console.log("hubo un error al guardar la informacion!!");
												res.send(400, {'error' : 'Hubo un error al guardar la información :('})
											}else{
												console.log('provider modificado: ')								
												console.log(provider);
												res.send(200, { 'doc' :Producto, 'success' : 'La inserción se realizó con éxito'});	
											}
						});

				});
			} 
			else{
				console.log('Hubo un error al guardar el registro: '+Producto+" "+err);
				res.send(400,{'error' : 'Hubo un error al guardar el registro: '});
			} 
		});


					
		 

	   
	},
	deleteProducto : function(req, res, next){
		console.log(req.body);
		var values = req.body.value;
		

		for(var index in values){
			valor = values[index]._id;
			console.log(valor);
			Producto.remove({_id : valor},function(err, succ){
				if(err){
					console.log('Hubo un error al eliminar el registro '+succ);	
					res.send(400, {'error' : 'Hubo un error al eliminar el registro'});
				} 
				if(succ){
					for(var c in values[index].provider_id){
						if(values[index].provider_id.length>0){
							Proveedor.findOne({'_id' : values[index].provider_id[c]._id },function(err,doc){
								doc.product_id.pull(values[index]._id);
								doc.save();
							});
						}
						
					}
					console.log('Se eliminaron correctamente los archivos ');
					res.send(200, {'success' : 'El registro se eliminó correctamente'}); 
				}
			});
		}
	},
	editProducto : function(req,res,next){
		console.log(req.body);
		Producto.findOne({ _id : req.body._id},function(err,doc){
			if(doc){	
				doc.product_name = req.body.product_name;
				doc.product_price = req.body.product_price;
				doc.product_type_content = req.body.product_type_content;
				doc.product_stock_min = req.body.product_stock_min;
				doc.product_stock_max = req.body.product_stock_max;
				doc.product_units = req.body.product_units;
				doc.save();
				res.send(200, {'success' : 'Se realizó la modificación :)'})
			}	
		})
	}

};