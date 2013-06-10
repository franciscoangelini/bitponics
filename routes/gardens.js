var ControlModel = require('../models/control').model,
GrowPlanModel = require('../models/growPlan').growPlan.model,
GrowPlanInstanceModel = require('../models/growPlanInstance').model,
SensorModel = require('../models/sensor').model,
SensorLogModel = require('../models/sensorLog').model,
ControlModel = require('../models/control').model,
Action = require('../models/action'),
ActionModel = Action.model,
DeviceModel = require('../models/device').model,
NotificationModel = require('../models/notification').model,
PhotoModel = require('../models/photo').model,
ModelUtils = require('../models/utils'),
routeUtils = require('./route-utils'),
winston = require('winston'),
async = require('async'); 

module.exports = function(app){
	
	/**
	 * List all public growPlanInstances
	 */
	app.get('/gardens', 
		routeUtils.middleware.ensureSecure,
		routeUtils.middleware.ensureLoggedIn,
		function (req, res, next) {
			var locals = {
				userGrowPlanInstances : [],
				communityGrowPlanInstances : [],
				className: "gardens app-page single-page",
    			pageType: "app-page"
			};

			GrowPlanInstanceModel
			.find({ 'users': req.user })
			.sort('-startDate')
			.exec(function(err, growPlanInstanceResults){
				if (err) { return next(err); }
				locals.userGrowPlanInstances = growPlanInstanceResults.map(function(gpi) { return gpi.toObject(); })
				res.render('gardens', locals);
			});
		}
	);

	
	
	/**
	 * Show a "dashboard" view of a growPlanInstance
	 * TODO : Hide/show elements in the dashboard.jade depending on
	 * whether the req.user is the owner/permissioned member or not
	 */
	app.get('/gardens/:growPlanInstanceId',
		routeUtils.middleware.ensureSecure,
		routeUtils.middleware.ensureLoggedIn,
		function (req, res, next) {
			var locals = {
				title : 'Bitponics - Dashboard',
				user : req.user,
				growPlanInstance : undefined,
				sensors : undefined,
				controls : undefined,
				sensorDisplayOrder : ['lux','hum','air','ph','ec','water','tds','sal','full','vis','ir'],
				className: "app-page dashboard",
				pageType: "app-page"
			};

			// First, verify that the user can see this
			GrowPlanInstanceModel.findById(req.params.growPlanInstanceId)
			.select('owner users visibility')
			.exec(function(err, growPlanInstanceResultToVerify){
				if (err) { return next(err); }
				if (!growPlanInstanceResultToVerify){ return next(new Error('Invalid grow plan instance id'));}

				if (!routeUtils.checkResourceReadAccess(growPlanInstanceResultToVerify, req.user)){
          return res.send(401, "This garden is private. You must be the owner to view it.");
      	}

      	locals.userCanModify = routeUtils.checkResourceModifyAccess(growPlanInstanceResultToVerify, req.user);

				async.parallel(
				[
					function getSensors(innerCallback){
						SensorModel.find({visible : true}).exec(innerCallback);
					},
					function getControls(innerCallback){
						ControlModel.find()
						.populate('onAction')
						.populate('offAction')
						.exec(innerCallback);
					},
					function getGpi(innerCallback){
						GrowPlanInstanceModel
						.findById(req.params.growPlanInstanceId)
						.exec(function(err, growPlanInstanceResult){
							if (err) { return innerCallback(err); }

							growPlanInstanceResult = growPlanInstanceResult.toObject();

							async.parallel(
							[
								function getDevice(innerInnerCallback){
									if (!growPlanInstanceResult.device){
										return innerInnerCallback();
									}

									DeviceModel.findById(growPlanInstanceResult.device)
									.populate('status.actions')
									.populate('status.activeActions')
									.exec(function(err, deviceResult){
										if (err) { return innerInnerCallback(err); }
										growPlanInstanceResult.device = deviceResult.toObject();
										return innerInnerCallback();
									})
								},
								function getGrowPlan(innerInnerCallback){
									ModelUtils.getFullyPopulatedGrowPlan({ _id: growPlanInstanceResult.growPlan }, function(err, growPlanResult){
										if (err) { return innerCallback(err); }
										
										growPlanInstanceResult.growPlan = growPlanResult[0];
										return innerInnerCallback();
									});		
								}
							],
							function gpiParallelFinal(err){
								return innerCallback(err, growPlanInstanceResult);
							});
						});
					},
					function getNotifications(innerCallback){
						NotificationModel.find({
		          gpi : req.params.growPlanInstanceId,
		          tts : { $ne : null }
		        })
		        .limit(10)
		        .exec(innerCallback);
		      },
		      function getPhotos(innerCallback){
		      	PhotoModel.find({
		      		gpi : req.params.growPlanInstancesId,
		      	})
		      	.limit(10)
		      	.exec(innerCallback);
		      }
				],
				function(err, results){
					if (err) { return next(err); }

					var sortedSensors = [];
					results[0].forEach(function(sensor){
						sortedSensors[locals.sensorDisplayOrder.indexOf(sensor.code)] = sensor;
					});
					sortedSensors = sortedSensors.filter(function(sensor){ return sensor;});

					locals.sensors = sortedSensors;
					locals.controls = results[1];
					locals.growPlanInstance = results[2];
					locals.notifications = results[3] || [];
					locals.photos = results[4] || [];

					res.render('gardens/dashboard', locals);
				});
			});
		}
	);


	/**
	 * 
	 */
	app.get('/gardens/:growPlanInstanceId/sensor-logs', 
		routeUtils.middleware.ensureSecure,
		routeUtils.middleware.ensureLoggedIn,
		function (req, res, next) {
			var locals = {
	    	title: "Bitponics | ",
	    	className: "garden-sensor-logs"
	    };
		  
	    async.parallel(
				[
					function parallel1(innerCallback){
						SensorModel.find({visible : true}).exec(innerCallback);
					},
					function parallel2(innerCallback){
						ControlModel.find().exec(innerCallback);
					},
					function parallel3(innerCallback){
						GrowPlanInstanceModel
						.findById(req.params.growPlanInstanceId)
						.populate('growPlan')
						.exec(innerCallback);
					},
					function parallel4(innerCallback){
						SensorLogModel
						.find({ gpi : req.params.growPlanInstanceId})
						.select('ts l')
						.exec(innerCallback);
					}
				],
				function(err, results){
					if (err) { return next(err); }
					locals.sensors = results[0];
					locals.controls = results[1];
					locals.growPlanInstance = results[2];
					locals.sensorLogs = results[3];

					res.render('gardens/sensor-logs', locals);
				}
	    );

		  
		}
	);
};