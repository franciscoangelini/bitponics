var connect    = require('connect'),
	express    = require('express'),
	http       = require('http'),
	net        = require('net'),
	fs         = require('fs'),
	stylus     = require('stylus'),
	nib        = require('nib'),
	mongodb    = require('mongodb'),
	mongoose   = require('mongoose'),
	passport   = require('passport'),
	csv        = require('express-csv'),
	winston    = require('winston');

module.exports = function(app){
	
	/**
	 * Standard config. 
	 * Should go first so env-specific ones are simply adding on to it 
	 * & guaranteeing that their middleware executes after this is all set up
	 */
	app.configure(function(){
	  var stylusMiddleware = stylus.middleware({
	    src: __dirname + '/../stylus/', // .styl files are located in `/stylus`
	    dest: __dirname + '/../public/', // .styl resources are compiled `/stylesheets/*.css`
	    debug: true,
	    compile: function(str, path) { // optional, but recommended
	      return stylus(str)
	        //.define('url', stylus.url({ paths: [__dirname + '/public'] }))
	        .set('filename', path)
	        .set('warn', true)
	        .set('compress', true)
	        .use(nib());
	      }
	  });
	  app.use(stylusMiddleware);  
	  
	  app.set('view engine', 'jade');
	  
	  app.use(express.logger(':method :url :status'));

	  app.use (function(req, res, next) {
		if(req.headers['content-type'] == 'text/csv' || 
			(req.headers['authorization'] && req.headers['authorization'].indexOf('HMAC') === 0)){
		    var data='';
		    req.setEncoding('utf8');
		    req.on('data', function(chunk) { 
		       data += chunk;
		    });

		    req.on('end', function() {
		        req.rawBody = data;
		        next();
		    });
		} else{
			next();
		}
	  });

	  app.use(express.bodyParser());
	  app.use(express.methodOverride());
	  
	  app.use(express.static(__dirname + '/../public'));
	  
	  // cookieParser and session handling are needed for everyauth (inside mongooseAuth) to work  (https://github.com/bnoguchi/everyauth/issues/27)
	  app.use(express.cookieParser()); 
	  app.use(express.session({ secret: 'somethingrandom'}));
	  
	  mongoose.connect(app.config.mongoUrl);
	  app.use(passport.initialize());
 	  app.use(passport.session());

 	  // custom "verbose errors" setting
	  // which we can use in the templates
	  // via settings['verbose errors']
	  app.enable('verbose errors');
	});

	switch(app.settings.env){
	    case 'local':
	    case 'development':
	    case 'staging':
	    	app.set
	    	app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
	  
			// make the response markup pretty-printed
			app.locals({pretty: true });
	    case 'production':
	    	app.disable('verbose errors');
	    	// Ensure that this is an authenticated request.
	    	// If it doesn't already have a req.user, 
	    	// check whether it's attempting HMAC auth,
	    	// and finally fallback to checking Basic auth
	    	app.use(function(req, res, next){
	    		var authorization = req.headers.authorization;

	    		if (req.user){ 
	    			next();
	    		} else {
	    			if (authorization && authorization.split(' ')[0] == 'HMAC'){
	    				passport.authenticate('hmac', {session: false})(req, res, next);
	    			} else {
	    				connect.basicAuth('bitponics', '8bitpass')(req, res, next);
	    			}
				} 
	    	});
	      	break;
	}

	app.configure('local', function(){
	});

	app.configure('development', function(){
	});

	app.configure('staging', function(){
	});
	
	app.configure('production', function(){
	  app.use(express.errorHandler()); 
	});


	
};