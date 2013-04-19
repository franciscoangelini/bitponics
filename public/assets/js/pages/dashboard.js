require([
    'angular',
    'domReady',
		'moment',
		'fe-be-utils',
		'view-models',
		'angularResource',
    'd3',
    
    'es5shim',
    'steps',
    'overlay'
    ],
function(angular, domReady, moment, feBeUtils, viewModels){
	'use strict';


	var dashboardApp = angular.module('bpn.apps.dashboard', ['ngResource']);

	
	dashboardApp.controller('bpn.controllers.dashboard.Main', 
		[
			'$scope', 
			'$filter',
			function($scope, $filter){
					// First, transform the data into viewModel-friendly formats
					bpn.pageData.controls.forEach(function(control){
						viewModels.initControlViewModel(control);
					});

					bpn.pageData.latestSensorLogs.forEach(function(sensorLog){
						sensorLog.logs.forEach(function(log){
							sensorLog[log.sCode] = log.val;
						});
					});
					
					// Set up functions and watchers
					$scope.refreshSensorsAndControls = function (){

					};

					$scope.$watch('activeDate.date', function(){
						// get the day's GrowPlan Phase
						// get the day's GrowPlanInstance.phase.daySummary
						// If not today, clear out the activeDate.latestSensorLogs property to make the sensor values blank out. not going to get past day's sensorLogs just yet


						// POST-MVP : get the day's sensorLogs
						// POST-MVP : get the device-controlled actions for the day's phase, bind those
						// POST-MVP : get the sensors for the day's phase (union of device sensors and Phase's IdealRanges.sCode)
					});

					// Finally, set the scope models
					$scope.controls = bpn.pageData.controls;
					$scope.sensors = bpn.pageData.sensors;
					$scope.growPlanInstance = bpn.pageData.growPlanInstance;
					$scope.activeDate = {
						date : new Date(),
						daySummary : {},
						latestSensorLogs : {}
					};
			}
		]
	);


	dashboardApp.controller('bpn.controllers.dashboard.DayOverview', 
		[
			'$scope', 
			'$filter',
			function($scope, $filter){
					
			}
		]
	);


	dashboardApp.controller('bpn.controllers.dashboard.PhasesGraph', 
		[
			'$scope', 
			'$filter',
			function($scope, $filter){
								
			}
		]
	);



	dashboardApp.controller('bpn.controllers.dashboard.Controls', 
		[
			'$scope', 
			'$filter',
			function($scope, $filter){
				
			}
		]
	);

	
	dashboardApp.controller('bpn.controllers.dashboard.Notifications', 
		[
			'$scope', 
			'$filter',
			function($scope, $filter){
				
			}
		]
	);


	// TODO : figure out how to communicate between controllers (passing activeDay from phase graph to DayOverview)

	domReady(function(){
		angular.bootstrap( document, ['bpn.apps.dashboard']);
	});

});