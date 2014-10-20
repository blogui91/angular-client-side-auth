var Provider = require('../models/Proveedor.js');

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    return res.status(404).send("no session login");
}
module.exports = {
	getProviders : function(req,res,next){
		Provider.find({}, function(err,pro){
			if(err) res.send(400, 'Error al obtener la lista de proveedores');
			if(!pro) res.send(400, 'Sin documentosw');
			else{
				res.send(JSON.parse(JSON.stringify(pro)));
				console.log("Lista de proveedores "+pro);
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
		console.log(req);

		var provider = new Provider({
			providerNumber 	  : req.body.id,
			provider_name 	  : req.body.nombre,
			provider_address  : req.body.direccion,
			telephone	  	  : req.body.telefono,
			provider_rfc  	  : req.body.rfc,
			notes	 	  	  : req.body.notas
		});

		provider.save(function(err){
			if(!err) console.log('Categoria guardada');
			else{
				console.log('Hubo un error al guardar el registro: '+provider+" "+err);
				res.send('Hubo un error al guardar el registro: ');
			} 
		});

	   res.send(provider);
	},
	deleteProvider : function(req, res, next){
		console.log(req.body.name[0].providerNumber);
		for(var index in req.body.name){
			var value =  req.body.name[index].providerNumber;
			Provider.remove({providerNumber : value},function(succ,err){
				if(err) console.log('Se eliminaron correctamente los archivos ');
				if(succ){
					console.log('Hubo un error al eliminar el registro '+succ);	
				}
			});
		}
		res.json(200, {'success' : 'El registro se eliminó correctamente'}); 
	}
};