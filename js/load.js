var app = angular.module("loadingApp",[]);

app.factory("loadParams",function(){
	return {
		dataURI: "data.json"
	}
});

app.config(function($routeProvider) {
    $routeProvider
    .when('/', 
    {
      controller:"StartCtrl", 
      templateUrl:'partials/start.html'
    })
    .when('/complete', 
    {
      controller:"LoadedCtrl", 
      templateUrl:'partials/complete.html',
      resolve:{
      	LoadData: LoadedCtrl.loadingData
      }
    }).
    otherwise({redirectTo:'/'});
});

//Loading Start
app.controller("StartCtrl",function($scope,$location){
	$scope.buttonMes = "Start Loading";
	$scope.loadMes = "Loading Data...";
	
	$scope.startLoading = function(){	
		$location.path("/complete");		
	};
});

//Loading Complete
var LoadedCtrl = app.controller("LoadedCtrl",function($scope,$location,LoadData){
	$scope.message = "JSON Loading Complete";
	
	$scope.problems = LoadData;
	
});

//Error Handling
app.directive("error",function($rootScope){
	return {
		restrict:"E",
		template:"<div style='color:red' ng-show='isErr'>Error During Loading!!</div>",
		link:function(scope){
			$rootScope.$on("$routeChangeError", function(){
				scope.isErr = true;
			});
		}
	};
});

//Load JSON Data Function
LoadedCtrl.loadingData = function($q,$http,$timeout,loadParams){
	var deferred = $q.defer();

	$timeout(function(){
	
		$http({method: "GET",url: loadParams.dataURI}).
			success(function(data){
				deferred.resolve(data);
			}).
			error(function(error){
				deferred.reject();
			});
			
	},1000);
	
	return deferred.promise;	
};
