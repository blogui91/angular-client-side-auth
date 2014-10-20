'use strict';

angular.module('angular-client-side-auth')
.factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

    $cookieStore.remove('user');

    function changeUser(user) {
        angular.extend(currentUser, user);
    }

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined) {
                role = currentUser.role;
            }

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined) {
                user = currentUser;
            }
            return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});

angular.module('angular-client-side-auth')
.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/getusers').success(success).error(error);
        }
    };
});


angular.module('angular-client-side-auth')
.factory('Categories', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/getcategorias').success(success).error(error);
        },
        findID: function(category, success, error){
            $http.post('/findCategoria', category).success(success).error(error);
        },
        create: function(category, success, error){
            $http.post('/addCategoria', category).success(success).error(error);
        }
    };
});

angular.module('angular-client-side-auth')
.factory('Providers', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/getProveedores').success(success).error(error);
        },
        findID: function(provider, success, error){
            $http.post('/findProveedores', provider).success(success).error(error);
        },
        create: function(provider, success, error){
            $http.post('/addProveedores', provider).success(success).error(error);
        },
        deleteID: function(provider, success, error){
            $http.post('/deleteProveedores', provider).success(success).error(error);
        }
    };
});