// Ionic Starter App
var url = "http://localhost:9000/";
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
app = angular.module('starter', ['ionic','ngCordova','ngStorage']);

app.run(function($ionicPlatform,$rootScope,$localStorage,$state,$ionicHistory) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.authStatus = false;
  //stateChange event
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
    $rootScope.authStatus = toState.authStatus;
    if($rootScope.authStatus){
        if($localStorage.session=={} || $localStorage.session.loggin_state==""){
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
          $state.go("welcome");
        }
    }
  });

});

app.directive('activePageHighlight', ['$rootScope', '$state', function($rootScope, $state){

  return function ($scope, $element, $attr) {

    function checkUISref(){
      if ($state.is($attr['uiSref'])){
        $element.addClass('active-page-highlight');
      } else {
        $element.removeClass('active-page-highlight');
      }
    }

    checkUISref();

    $rootScope.$on('$stateChangeSuccess', function(){
      checkUISref();
    })
  };

}]);

app.config(function($stateProvider,$urlRouterProvider){

  $stateProvider.state("welcome",{
    url:"/welcome",
    templateUrl:"templates/welcome.html",
    authStatus: false
  });

  $stateProvider.state("login",{
    url:"/login",
    templateUrl:"templates/login.html",
    controller:"loginCtrl",
    authStatus: false
  });

  $stateProvider.state("signup",{
    url:"/signup",
    templateUrl:"templates/signup.html",
    controller:"loginCtrl",
    authStatus: false
  });

  $stateProvider.state("menu",{
    url:"/menu",
    abstract:true,
    templateUrl:"templates/menu.html",
    controller:"menuCtrl",
    authStatus: true
  })

  $stateProvider.state("menu.batchs",{
    url:"/batchs",
    views:{
      'menuContent':{
        templateUrl:"templates/batchs.html",
        controller : "batchsCtrl"
      }
    },
    authStatus: true

  });


  $stateProvider.state("menu.mybatchs",{
    url:"/mybatchs",
    views:{
      'menuContent':{
        templateUrl:"templates/mybatchs.html",
        controller : "mybatchsCtrl"
      }
    },
    authStatus: true

  });

  $stateProvider.state("menu.infoBatch",{
    url:"/infoBatch/:nameBatch",
    views:{
      'menuContent':{
    templateUrl:"templates/infoBatch.html",
    controller : "infoBatchCtrl"
      }
    },
    authStatus: true
  });

  $stateProvider.state("menu.resultatsBatch",{
    url:"/resultatsBatch/:nameBatch",
    views:{
      'menuContent':{
    templateUrl:"templates/resultatsBatch.html",
    controller : "resultatsBatchCtrl"
      }
    },
    authStatus: true
  });

  $stateProvider.state("menu.configFichierBatch",{
    url:"/configFichierBatch/:nameBatch",
    views:{
      'menuContent':{
    templateUrl:"templates/configFichierBatch.html",
    controller : "configFichierBatchCtrl"
      }
    },
    authStatus: true
  });

  $stateProvider.state("menu.configDonneBatch",{
    url:"/configDonne/:nameBatch",
    views:{
      'menuContent':{
    templateUrl:"templates/configDonne.html",
    controller : "configDonneBatchCtrl"
      }
    },
    authStatus: true
  });

  $stateProvider.state("menu.reportBatch",{
    url:"/reportBatch/:nameBatch",
    views:{
      'menuContent':{
    templateUrl:"templates/reportBatch.html",
    controller:"reportBatchCtrl"
      }
    },
    authStatus: true
  });

  $stateProvider.state("menu.info",{
    url:"/info",
    views:{
      'menuContent':{
    templateUrl:"templates/info.html",
    controller : "infoCtrl"
      }
    },
    authStatus: true
  });

  $stateProvider.state("menu.profile",{
    url:"/profile",
    views:{
      'menuContent':{
    templateUrl:"templates/profile.html",
    controller :"profileCtrl"
      }
    },
    authStatus: true
  });

  $urlRouterProvider.otherwise("welcome");

});


app.factory("StorageService",function ($localStorage) {
  $localStorage = $localStorage.$default({
    user : {}
  });
  return {
    saveUser : function (user) {
      $localStorage.user = user;
    },
    getUser :function () {
      return $localStorage.user;
    },
    logout : function () {
      $localStorage.$reset();
    },
    setSession:function (session) {
      $localStorage.session = session;
    },
  }
});

app.controller('loginCtrl', function($scope,$ionicPopup,$state,$http,StorageService,$location) {
  $scope.data = {};

  $scope.showAlert = function(msg) {
    var alertPopup = $ionicPopup.alert({
      title: 'Warning Message',
      subTitle: 'Veuillez reéssayer !',
      template: msg
    });
  };

  $scope.inscription = function(){
    var data = 'nom='+$scope.data.firstName+'&prenom='+$scope.data.lastName+'&email='+$scope.data.email+'&password='+$scope.data.password+'&password1='+$scope.data.password1;

    var config = {
      headers : {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
      }
    };

    $http.post(url+'registerMobile', data, config)
      .success(function (data, status, headers, config) {
        console.log(data);
        if(data == "Password not the same") {
          $scope.showAlert(data);
        }else{
          if(data=="false"){
            $scope.showAlert("Email Dejà existant !");
          }else{
            $scope.showAlert("Nouveau utilisateur créer avec succès");
            StorageService.logout();
            StorageService.saveUser(data);
            var session = {"loggin_state":"true"};
            StorageService.setSession(session);
            $state.go('menu.batchs');
          }
        }

      })
      .error(function (data, status, header, config) {
        $scope.ResponseDetails = "Data: " + data +
          "<hr />status: " + status +
          "<hr />headers: " + header +
          "<hr />config: " + config;

        console.log("err " + data);
      });
  };


  $scope.loginEmail = function() {
    //console.log("LOGIN user: " + $scope.data.username + " - PW: " + $scope.data.password);
    // $state.go('tab.dash');}).error(function(data) {var alertPopup = $ionicPopup.alert({title: 'Login failed!',template: 'Please check your credentials!

      // use $.param jQuery function to serialize data from JSON
      var data = 'email='+$scope.data.username+'&password='+$scope.data.password;
      //var data1 = $httpParamSerializer(data);

      var config = {
        headers : {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
        }
      };

      $http.post(url+'login2', data, config)
        .success(function (data, status, headers, config) {
          if(data.email != null){
            StorageService.saveUser(data);
            var session = {"loggin_state":"true"};
            StorageService.setSession(session);
            $state.go('menu.batchs');
          }else{
            $scope.showAlert("Invalid username or password !");
            var session = {"loggin_state":""};
            StorageService.setSession(session);
            StorageService.logout();
          }
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

});


app.controller("batchsCtrl",function ($http,$scope,$state) {

  $scope.mySplit = function(string,sep) {

    if(sep!=null){
      $scope.array = string.split(sep);
      return $scope.result = $scope.array[$scope.array.length - 1];
    }
    $scope.array = string.split('/');
    if($scope.array.length >1) {
      return $scope.result = $scope.array[$scope.array.length - 1];
    }else{
      $scope.array1 = string.split('\\');
      return $scope.result1 = $scope.array1[$scope.array1.length - 1];
    }
  }

  $scope.batchs = [];

  $http.get(url+"readers")
    .success(function (data) {
      $scope.batchs = data;
    })
    .error(function (err) {
      console.log(err);
    });

  $scope.chargerInfoBatch = function (nameBatch) {
    $state.go("menu.infoBatch",{

      nameBatch : nameBatch

    });
  }


});


app.controller("mybatchsCtrl",function ($http,$scope,$state,$ionicLoading) {

  $scope.mySplit = function(string,sep) {

    if(sep!=null){
      $scope.array = string.split(sep);
      return $scope.result = $scope.array[$scope.array.length - 1];
    }
    $scope.array = string.split('/');
    if($scope.array.length >1) {
      console.log("here");
      return $scope.result = $scope.array[$scope.array.length - 1];
    }else{
      console.log("lol");
      $scope.array1 = string.split('\\');
      return $scope.result1 = $scope.array1[$scope.array1.length - 1];
    }
  }

  $scope.batchs = [];

  $ionicLoading.show({
    template : "Chargement en cours"
  });


  $http.get(url+"allMyJobCompleted")
    .success(function (data) {
      console.log("data"+data);
      $scope.batchs.completed = data;
    })
    .error(function (err) {
      console.log(err);
    });

  $http.get(url+"allMyJobFailed")
    .success(function (data) {
      console.log("data"+data);
      $scope.batchs.failed = data;
      $ionicLoading.hide();
    })
    .error(function (err) {
      console.log(err);
      $ionicLoading.hide();
    });

  $scope.chargerInfoBatch = function (nameBatch) {
    $state.go("menu.infoBatch",{

      nameBatch : nameBatch

    });
  }


});


app.controller("menuCtrl",function ($scope,StorageService,$state,$ionicLoading,$timeout,$ionicHistory,$localStorage) {

  $scope.user = StorageService.getUser();

  $scope.logout1 = function () {
    StorageService.logout();
    $ionicLoading.show({template:'Logging out....'});
    $timeout(function () {
      $ionicLoading.hide();
      $localStorage.session={"loggin_state":""};
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
      $state.go('welcome');
    }, 30);

  }

  });

app.controller("infoBatchCtrl",function ($scope,$state,$stateParams) {

 var nameTable = $stateParams.nameBatch;
  $scope.nameBatch = nameTable;

  $scope.chargerResultatsBatch = function () {
    $state.go("menu.resultatsBatch",{
      nameBatch : nameTable
    });
  };

  $scope.chargerConfigFichierBatch = function () {
    $state.go("menu.configFichierBatch",{
      nameBatch : nameTable
    });
  };

  $scope.chargerConfigDonneBatch = function () {
    $state.go("menu.configDonneBatch",{
      nameBatch : nameTable
    });
  };

  $scope.chargerReportBatchBatch = function () {
    $state.go("menu.reportBatch",{
      nameBatch : nameTable
    });
  };

});

app.controller("reportBatchCtrl",function ($http,$scope,$stateParams,$ionicLoading) {
  $scope.nameBatch  = $stateParams.nameBatch;
  $scope.informationBatch = [];

  $ionicLoading.show({
    template : "Chargement en cours"
  });

  $http.get(url+"resume/"+$scope.nameBatch)
    .success(function (data) {
      $scope.informationBatch = data;
      $ionicLoading.hide();
    })
    .error(function (err) {
      console.log(err);
      $ionicLoading.hide();
    });
});


app.controller("resultatsBatchCtrl",function ($http,$scope,$stateParams,$ionicLoading) {
  $scope.nameBatch  = $stateParams.nameBatch;
  $scope.informationBatch = [];

  $ionicLoading.show({
    template : "Chargement en cours"
  });

  $http.get(url+"resume/"+$scope.nameBatch)
    .success(function (data) {
      $scope.informationBatch = data;
      $ionicLoading.hide();
    })
    .error(function (err) {
      console.log(err);
      $ionicLoading.hide();
    });
});

app.controller("configFichierBatchCtrl",function ($http,$scope,$stateParams,$ionicLoading) {
  $scope.nameBatch  = $stateParams.nameBatch;
  $scope.informationBatch = [];

  $ionicLoading.show({
    template : "Chargement en cours"
  });

  $http.get(url+"resume/"+$scope.nameBatch)
    .success(function (data) {
      $scope.informationBatch = data;
      $ionicLoading.hide();
    })
    .error(function (err) {
      console.log(err);
      $ionicLoading.hide();
    });
});

app.controller("configDonneBatchCtrl",function ($http,$scope,$stateParams,$ionicLoading) {
  $scope.nameBatch  = $stateParams.nameBatch;
  $scope.informationBatch = [];

  $ionicLoading.show({
    template : "Chargement en cours"
  });

  $http.get(url+"resume/"+$scope.nameBatch)
    .success(function (data) {

      $scope.informationBatch = data;
      $ionicLoading.hide();
    })
    .error(function (err) {
      console.log(err);
      $ionicLoading.hide();
    });
});

app.controller("configFichierBatchCtrl",function ($http,$scope,$stateParams,$ionicLoading) {
  $scope.nameBatch  = $stateParams.nameBatch;
  $scope.informationBatch = [];

  $ionicLoading.show({
    template : "Chargement en cours"
  });


  $http.get(url+"resume/"+$scope.nameBatch)
    .success(function (data) {
      $scope.informationBatch = data;
      $ionicLoading.hide();
    })
    .error(function (err) {
      console.log(err);
      $ionicLoading.hide();
    });
});



app.controller("infoCtrl",function ($http,$scope) {

  $scope.options = {
    loop: false,
    effect: 'fade',
    speed: 500,
  }

  $scope.$on("$ionicSlides.sliderInitialized", function(event, data){
    // data.slider is the instance of Swiper
    $scope.slider = data.slider;
  });

  $scope.$on("$ionicSlides.slideChangeStart", function(event, data){
    console.log('Slide change is beginning');
  });

  $scope.$on("$ionicSlides.slideChangeEnd", function(event, data){
    // note: the indexes are 0-based
    $scope.activeIndex = data.activeIndex;
    $scope.previousIndex = data.previousIndex;
  });

  $scope.company = {
    name : "Itn (Societé du groupe GFI)",
    site : "www.itn.fr",
    tel :"+33 (0)1 44 91 81 00",
    adresse :"82, rue Saint-Lazare 75009 Paris",
    mail : "info@itn.fr",
    logo :"img/logo.png"
  }
});

app.controller("profileCtrl",function ($http,$scope,StorageService) {
    $scope.profile = StorageService.getUser();
});


