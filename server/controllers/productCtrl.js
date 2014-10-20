var Producto = require('../models/Producto.js');

function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    return res.status(404).send("no session login");
}
module.exports = {
	getProducts : function(req,res,next){
		Producto.find({}, function(err,pro){
			if(err) res.send(400, 'Error al obtener la lista de productos');
			if(!pro) res.send(400, 'Sin documentos');
			else{
				res.send(JSON.parse(JSON.stringify(pro)));
				console.log("Lista de productos "+pro);
			}
		});
	}
}