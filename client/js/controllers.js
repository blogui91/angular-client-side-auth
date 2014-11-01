'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);

angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = true;
    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);

angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('angular-client-side-auth')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Users', 'Auth', function($rootScope, $scope, Users, Auth) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

}]);

angular.module('angular-client-side-auth')
.controller('CategoryCtrl',
['$rootScope', '$scope', 'Users', 'Auth','Categories', function($rootScope, $scope, Users, Auth, Categories) {
    $scope.categoryList = [];
    
    $scope.getCategories = function(){
        Categories.getAll(function(categorias){
        $scope.categoryList = categorias;
        console.log($scope.categoryList);
        },function(err){
            $rootScope.error = "Error al obtener lista de categorías";
        
        });
    };
    $scope.getCategories();

    $scope.addCategoria = function(){
        console.log('Agregando categoria '+$scope.inputIDCategoria+" "+$scope.inputNombreCategoria);
        Categories.create({'numero' : $scope.inputIDCategoria, 'categoria' : $scope.inputNombreCategoria },
         function(cat){
            console.log(cat);
            $scope.getCategories();
            $scope.inputIDCategoria = '';
            $scope.inputNombreCategoria = '';

         },function(error){
            $rootScope.error = 'lo siento :(';
         });

    };

    $scope.findCategorias = function(){
        console.log('Ejecutando funcion '+$scope.seleccionCategoria);
        Categories.findID({'numero' : $scope.seleccionCategoria },
            function(cat){
                $scope.getCategories();
                console.log(cat);
            },function(err){
                $rootScope.error = err;
        });
    };



}]);

angular.module('angular-client-side-auth')
.controller('ProveedorCtrl',
['$rootScope', '$scope', 'Users', 'Auth','Providers','$modal', function($rootScope, $scope, Users, Auth, Providers,$modal) {
    

   

    $scope.getProviders = function(){
        Providers.getAll(function(providers){
            $scope.providerList = providers;
            console.log(providers);
            $scope.removeObjectsSelectedToDelete();
            
        }, function(){
           
        });
    };
    $scope.getProviders();


    $scope.addProvider = function(){
        Providers.create({
            'id' : $scope.inputIDProveedor,
            'nombre' : $scope.inputNombreProveedor,
            'direccion' : $scope.inputDireccionProveedor,
            'telefono' : $scope.inputTelefonoProveedor,
            'rfc' : $scope.inputRFCProveedor,
            'notas' : $scope.inputNotasProveedor
        },function(provider){
            console.log(provider);
            $scope.getProviders();
            $scope.inputIDProveedor = '';
            $scope.inputNombreProveedor = '';
            $scope.inputDireccionProveedor = '';
            $scope.inputTelefonoProveedor = '';
            $scope.inputRFCProveedor = '';
            $scope.inputNotasProveedor = '';
            console.log("Proveedor agregado :)");
            $rootScope.error = provider.success;
        },function(){

        });

    };

   
    // Elimina definitivamente los valores que se seleccionaron para ser removidos
   $scope.removeElements = function(){
        console.log($scope.listToDelete);
        if($scope.listToDelete.length < 1){
            alert("Elige al menos un registro a eliminar");
        }
        else{
            Providers.deleteID({
                'list' : $scope.listToDelete
            },function(success){
                $rootScope.error = success.success;
                $scope.listToDelete = [];
            },function(){

            });   
        }
   };



    //Elimina los valores de la lista de proveedores que se encuentran en la lista a eliminar.
    $scope.removeObjectsSelectedToDelete = function(){
        for(var index in $scope.listToDelete){
            for(var i in $scope.providerList){
                if($scope.listToDelete[index]._id === $scope.providerList[i]._id){
                  $scope.providerList.splice(i,1);
                  console.log('Elemento eliminado ');
                } 
            }
        }
    };


    $scope.existElementDeleted = function(element){
        console.log(element)
        var exists = false;
        
        for(var index in $scope.listToDelete){
            if($scope.listToDelete[index]._id === element){
                exists = true;
                console.log(exists);
            }
        }
        return exists;
    };


    $scope.existElement = function(element){
        console.log(element)
        var exists = false;
        for(var index in $scope.providerList){
            if($scope.providerList[index]._id === element){
                exists = true;
                console.log(exists);
            }
        }
        return exists;
    };

    $scope.listToDelete = [];

    //Elimina un elemento y verifica si este ya se encuentra en los elementos a eliminar
    $scope.removeElement = function(index){
        var elemento = $scope.providerList[index]._id;
        if(!$scope.existElementDeleted(elemento)){
            $scope.listToDelete.push($scope.providerList[index]);
            console.log('listToDelete:');
            console.log($scope.listToDelete);
            console.log('Eliminado: ');
        }
        $scope.providerList.splice(index,1);
    };


    //Restaura el elemento a eliminar y lo regresa a la lista de elementos proveedores.
    // así como tambien verificar que este no se encuentre ya en la lista de elementos proveedores.
    $scope.restoreElement = function(index){
        var elemento = $scope.listToDelete[index]._id;
        if(!$scope.existElement(elemento)){
            $scope.providerList.push($scope.listToDelete[index]);
        }
        $scope.listToDelete.splice(index,1);
        $scope.getProviders();
    };        
    
   // Modals
   
   $scope.open = function(id){
        $scope.elemento = [];
        $scope.elemento = $scope.providerList[id];
        console.log($scope.elemento);
      var modalInstance = $modal.open({
        templateUrl : 'private/modals/editar-registro',
        controller : 'ModalInstanceCtrl',
        backdrop: false,
        size : 'lg',
        resolve :{
            items: function(){
                return $scope.elemento;
            }
        }
      }); 

      modalInstance.result.then(function(obj){
                console.log('valores obtenidos');
                console.log(obj);
                Providers.edit(obj,function(success){
                $rootScope.success = success.success;
                $scope.getProviders();
                },function(){

                });
                
                $scope.getProviders();
      }, function(){
             $scope.getProviders();
      });

   };




}]);

angular.module('angular-client-side-auth')
.controller('ModalInstanceCtrl',
['$rootScope', '$scope', '$modalInstance','items', 'Products' , function($rootScope, $scope, $modalInstance, items, Products) {
    $scope.item = items;
    $scope.originalSelectedItemData = items;
    $scope.listToDelete = [];
    
    


     //Elimina un elemento y verifica si este ya se encuentra en los elementos a eliminar
    $scope.removeProductElement = function(index){
        var elemento = $scope.item.product_id[index]._id;
        $scope.originalSelectedItemData = $scope.item;
        console.log('$scope.originalSelectedItemData: '+$scope.originalSelectedItemData);
        console.log(elemento);
        if(!$scope.existElementDeleted(elemento)){
            $scope.listToDelete.push($scope.item.product_id[index]);
           
            console.log('Eliminado: ');
        }
        $scope.item.product_id.splice(index,1);
         console.log($scope.listToDelete);
    };

    $scope.existElementDeleted = function(element){
        console.log(element)
        var exists = false;
        
        for(var index in $scope.listToDelete){
            if($scope.listToDelete[index]._id === element){
                exists = true;
                console.log(exists);
            }
        }
        return exists;
    };

    $scope.existElement = function(element){
        console.log(element)
        var exists = false;
        for(var index in $scope.item.product_id){
            if($scope.item.product_id[index]._id === element){
                exists = true;
                console.log(exists);
            }
        }
        return exists;
    };

    //$scope.productList = [];
    // VARIABLES PARA AGREGAR NUEVOS PRODUCTOS A UN PROVEEDOR
    $scope.getproductList = function(){
        Products.getAll(function(pro){
            $scope.productList = pro;
            // $scope.removeDuplicate();
            console.log(pro);
           
            }, function(){
               
        });
    }
    $scope.getproductList();

    $scope.newProductsList = [];

    $scope.addNewProduct = function(id){
        
        var newProduct = $scope.getProductObj(id);
        if(!$scope.doubleEntry(newProduct)){
            console.log(newProduct);
            if(!$scope.alreadyExists(newProduct)){
                $scope.newProductsList.push(newProduct);
            }

        }
    };

    $scope.doubleEntry = function(id){
    console.log('Verificando si ya existe');
        var flag = false;
        
        //console.log($scope.newProductsList[index].id+'--'+id._id)
        for(var index in $scope.newProductsList){
            if($scope.newProductsList[index]._id === id._id){
                flag = true;
               
                break;
            }
            
        }
        console.log(flag);
        return flag;
    };

    //Verifica que el elemento a agregar no se encuentra en la lista de elementos ya agregados
    $scope.alreadyExists = function(id){
        console.log('Verificando si ya pertenecese al proveedor');
        console.log(id._id);
        var flag = false;
        for(var index in  $scope.item.product_id){
            if($scope.item.product_id[index]._id === id._id){
                flag = true;
                break;
            }
        }
        return flag;
    }

     $scope.restoreProductElement = function(index){
        var elemento = $scope.listToDelete[index]._id;
        console.log(elemento);
        if(!$scope.existElement(elemento)){
            $scope.item.product_id.push($scope.listToDelete[index]);
        }
        $scope.listToDelete.splice(index,1);
        //$scope.getProviders();
    };        
    
    $scope.productObj = [];
    $scope.getProductObj = function (id){
        $scope.productName = id;
        for(var index in $scope.productList){
            if($scope.productList[index].product_name === id ){
                $scope.productObj = $scope.productList[index];
            }
        }
        console.log("Objeto"+$scope.productObj);
        return $scope.productObj;
    };

    


    $scope.cancelAdding = function(index){
        var elemento = $scope.newProductsList[index];
        console.log(elemento);
        $scope.newProductsList.splice(index,1);
    };

    //Elimina los productos que ya pertenecen al proveedor para no ser duplicados
    
    

   

    $scope.ok = function(){
        $modalInstance.close({
            'fields'  : $scope.item,
            'newProducts' : $scope.newProductsList,
            'productsToDelete' : $scope.listToDelete
        });
        //console.log('------R E S U L T A D O S------');
        //console.log('Proveedor editado');
        //console.log($scope.item);
        //console.log('Lista de productos');
        //console.log($scope.productList);
        //console.log('Lista de productos a eliminar');
        //console.log($scope.listToDelete);
       
    };

    $scope.cancel = function(){
        $scope.item = $scope.originalSelectedItemData;
        $modalInstance.dismiss();
    };
   
}]);




angular.module('angular-client-side-auth')
.controller('ProductoCtrl',['$rootScope', '$scope', 'Users', 'Auth','Products','Providers','$modal', 
    function($rootScope, $scope, Users, Auth, Products, Providers, $modal) {
    $scope.providerList = [];
    $scope.productList = [];
    $scope.sku = '_id';
    $scope.listaEliminadosVacia = true;
    $scope.tipo = [
     {   'name' : 'unidades' },
     {   'name' : 'peso'}
    ];

    $scope.verValor = function(){
        console.log($scope.type_content)

    };

    $scope.getProducts = function(){
        Products.getAll(function(productos){
        console.log(productos);
           $scope.productList = productos;
           $scope.removeObjectsSelectedToDelete();
        },function(err){

        });

    };

    $scope.getProducts();

    $scope.getProviders = function(){
       Providers.getAll(function(providers){
            $scope.providerList = providers;
            console.log(providers);
            
            
        }, function(err){
           
        });
    };

    $scope.getProviders();
    
    $scope.getIDProvider = function (id){
        $scope.providerId = id;
        console.log("ID "+id);
        for (var i in $scope.providerList){
            if($scope.providerList[i].provider_name === $scope.providerId){
                console.log($scope.providerList[i].provider_name+" === "+id)
                $scope.providerIdValue = $scope.providerList[i]._id;
                console.log("value "+$scope.providerIdValue);
                break;
            }

        }

        console.log("nombre "+$scope.providerId+" ID "+$scope.providerIdValue);
    };
    
    $scope.listToDelete = [];
    $scope.removeElement = function(element){
        var elemento = $scope.productList[element]._id;
        if(!$scope.existElementDeleted(elemento)){
            $scope.listToDelete.push($scope.productList[element]);
            console.log('listToDelete:');
            console.log($scope.listToDelete);
            console.log('Eliminado: ');
        }
        $scope.productList.splice(element,1);
        $scope.listaEliminadosVacia = false;
    };
    

     $scope.existElementDeleted = function(element){
        console.log(element)
        var exists = false;
        
        for(var index in $scope.listToDelete){
            if($scope.listToDelete[index]._id === element){
                exists = true;
                console.log(exists);
            }
        }
        return exists;
    };

    

    $scope.restoreElement = function(index){
        var elemento = $scope.listToDelete[index]._id;
        if(!$scope.existElement(elemento)){
            $scope.productList.push($scope.listToDelete[index]);
        }
        $scope.listToDelete.splice(index,1);
        $scope.getProducts();
        if($scope.listToDelete.length === 0){
         $scope.listaEliminadosVacia = true;
        }
    };    

    $scope.existElement = function(element){
        console.log(element)
        var exists = false;
        for(var index in $scope.productList){
            if($scope.productList[index]._id === element){
                exists = true;
                console.log(exists);
            }
        }
        return exists;
    };
    
    $scope.removeObjectsSelectedToDelete = function(){
        for(var index in $scope.listToDelete){
            for(var i in $scope.productList){
                if($scope.listToDelete[index]._id === $scope.productList[i]._id){
                  $scope.productList.splice(i,1);
                  console.log('Elemento eliminado ');
                } 
            }
        }
    };

    $scope.addProduct = function(){
        
        Products.create({
            'nombre'    : $scope.inputNombre,
            'precio'    : $scope.inputPrecio,
            'stock_min' : $scope.inputStockMin,
            'stock_max' : $scope.inputStockMax,
            'tipo'      : $scope.type_content,
            'unidades'  : $scope.inputExistencias,
            'provider'  : $scope.providerIdValue
    },function(producto){
            console.log("Producto agregado :)");
            $scope.inputNombre = '';
            $scope.inputPrecio = '';
            $scope.inputStockMin = '';
            $scope.inputStockMax = '';
            $scope.type_content = $scope.type_content[0];
            $scope.inputExistencias = '';
            $scope.providerIdValue = '';
            $scope.getProducts();
            $rootScope.success = producto.success;
        },function(error){
            $rootScope.error = error.error+ '\n Asegurate de que has rellenado los campos correctamente';
        });

    };

    // Modals
   
    $scope.confirm = function(){
      var modalInstance = $modal.open({
        templateUrl : 'private/modals/confirm',
        controller : 'ModalConfirmDeleteCtrl',
        backdrop: true,
        resolve :{
            values: function(){
                return $scope.listToDelete;
            }
        }
      }); 

      modalInstance.result.then(function(obj){
                console.log('valores obtenidos');
                console.log(obj);
                Products.deleteID(obj,function(success){
                $rootScope.success = success.success;
                $scope.getProducts();
                $scope.listToDelete = [];
                },function(){

                });
                
      }, function(){
             
      });

   };

    $scope.editProduct = function(id){

    $scope.productToEdit = $scope.productList[id];
    console.log($scope.productToEdit);
      var modalInstanceProd = $modal.open({
        templateUrl : 'private/modals/editar-producto',
        controller : 'ModalEditProductCtrl',
        backdrop: false,
        resolve :{
            editProduct: function(){
                return $scope.productToEdit;
            }
        }
      }); 
    
      modalInstanceProd.result.then(function(obj){
                console.log('valores obtenidos');
                console.log(obj);
                Products.edit(obj,function(success){
                $rootScope.success = success.success;
                $scope.getProducts();
               
                },function(){

                });
                
      }, function(){
             
      });

   };




}]);


angular.module('angular-client-side-auth')
.controller('ModalEditProductCtrl',
['$rootScope', '$scope', '$modalInstance','editProduct', 'Products' , function($rootScope, $scope, $modalInstance, editProduct, Products) {
    $scope.tipo = [
     {   'name' : 'unidades' },
     {   'name' : 'peso'}
    ];
    $scope.productElement = editProduct;
    console.log($scope.productElement);
    $scope.ok = function(){
        $modalInstance.close($scope.productElement);
        
    };

    $scope.cancel = function(){
       $modalInstance.dismiss();
    };
   
}]);



angular.module('angular-client-side-auth')
.controller('ModalConfirmDeleteCtrl',
['$rootScope', '$scope', '$modalInstance','values', 'Products' , function($rootScope, $scope, $modalInstance, values, Products) {
    
    $scope.typeAccion = 'Eliminar';
    $scope.deletedObjectList = values;
    $scope.empty = false;
    if($scope.deletedObjectList.length === 0){
        $scope.empty = true;
    }
    console.log($scope.deletedObjectList);
    $scope.ok = function(){
        if($scope.deletedObjectList != null){
            $modalInstance.close({value : $scope.deletedObjectList});
            console.log('True');
        }
        else{
            console.log('False');
        }
    };

    $scope.cancel = function(){
       $modalInstance.dismiss();
    };
   
}]);


