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
['$rootScope', '$scope', 'Users', 'Auth','Providers', function($rootScope, $scope, Users, Auth, Providers) {
    

    

    $scope.getProviders = function(){
        Providers.getAll(function(providers){
            $scope.providerList = providers;
            console.log(providers);
            $scope.removeObjectsSelectedToDelete();
            
        }, function(err){
           
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
            $rootScope.error = "Proveedor agregado :)";
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
            Providers.deleteID(
            { 
            'name' : $scope.listToDelete
            },
            function(success){
                $scope.listToDelete = [];
                $rootScope.error = success.success;
            },function(){

            });   
        }
   };



    //Elimina los valores de la lista de proveedores que se encuentran en la lista a eliminar.
    $scope.removeObjectsSelectedToDelete = function(){
        for(var index in $scope.listToDelete){
            for(var i in $scope.providerList){
                if($scope.listToDelete[index].providerNumber === $scope.providerList[i].providerNumber){
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
            if($scope.listToDelete[index].providerNumber === element){
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
            if($scope.providerList[index].providerNumber === element){
                exists = true;
                console.log(exists);
            }
        }
        return exists;
    };

    $scope.listToDelete = [];

    //Elimina un elemento y verifica si este ya se encuentra en los elementos a eliminar
    $scope.removeElement = function(index){
        var elemento = $scope.providerList[index].providerNumber;
        if(!$scope.existElementDeleted(elemento)){
            $scope.listToDelete.push($scope.providerList[index]);
           
            console.log('Eliminado: ');
        }
        $scope.providerList.splice(index,1);
    };


    //Restaura el elemento a eliminar y lo regresa a la lista de elementos proveedores.
    // así como tambien verificar que este no se encuentre ya en la lista de elementos proveedores.
    $scope.restoreElement = function(index){
        var elemento = $scope.listToDelete[index].providerNumber;
        if(!$scope.existElement(elemento)){
            $scope.providerList.push($scope.listToDelete[index]);
        }
        $scope.listToDelete.splice(index,1);
        $scope.getProviders();
    };        
    
   




}]);
