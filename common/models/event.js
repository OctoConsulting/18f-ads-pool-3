module.exports = function(Event) {
var request = require('request');
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('18f-asd-prototype-dev');

/**
	Fetches the adverse events for the given drug. This method also supports pagination.

	@param {String} q The drung name for which the adverse events are requested for. 
	@param {String} typ Drug type. It should be either brand or geenric.
	@param {number} skip Docs from FDA API : Skip this number of records that match the search parameter, 
							then return the matching records that follow. Use in combination with limit to paginate results.
	@param {number} limit Docs from FDA API : Return up to this number of records that match the search parameter. 
					Large numbers (above 100) could take a very long time, or crash your browser. 
*/
Event.fetchEvents = function(q, typ, skip, limit, cb){
   //Constructing the URL to fetch adverse events
   var fdaEventRestAPI = "https://api.fda.gov/drug/event.json?";
   var apiKey = "yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi";
   var fdaEventURL = fdaEventRestAPI + 'api_key='+ apiKey; 
   if(typ == 'brand'){   	
      	fdaEventURL = fdaEventURL + '&search=brand_name:"'+ q +'"'; 
   }else if(typ == 'generic'){
   		fdaEventURL = fdaEventURL + '&search=generic_name:"'+ q +'"'; 
   }
   //Adding limit param
   if(limit){
   		fdaEventURL = fdaEventURL + '&limit=' + limit
   }
   //Adding skip param for pagination
   if(skip){
   		fdaEventURL = fdaEventURL + '&skip=' + skip;
   }
   logger.debug('fdaEventURL:: '+ fdaEventURL);
   //Make rest API to FDA to retrieve adverse events for the drung
   request(fdaEventURL, function (error, response, body) {
   		var responseObj = {};
	   	if(error){
	      logger.debug('Error happened in retrieving the drug event information');
	      return cb(error); 
	    }else if (!error && response.statusCode == 200) {
	    	var responseOBJ = JSON.parse(body);   	
	       	var meta = responseOBJ.meta;	       	
	       	//Setting the meta data
		    responseObj.count = meta.results.total;
		    responseObj.skip = meta.results.skip;
		    responseObj.limit = limit;
		    responseObj.events = [];
		    var results = responseOBJ.results;
	       	for(var i in results){          
	          var eventModel = {};
	          //Setting event information
	          eventModel.safetyreportid = results[i].safetyreportid;
	          eventModel.receivedate = results[i].receivedate;
	          //Event serious information
	          eventModel.serious = results[i].serious;
	          eventModel.seriousnessdisabling = results[i].seriousnessdisabling;
	          eventModel.seriousnessother = results[i].seriousnessother;
	          eventModel.seriousnesshospitalization = results[i].seriousnesshospitalization;
	          eventModel.seriousnesscongenitalanomali = results[i].seriousnesscongenitalanomali;
	          eventModel.seriousnessdeath = results[i].seriousnessdeath;
	          eventModel.seriousnesslifethreatening = results[i].seriousnesslifethreatening;
	          //Setting the patient information
	          if(results[i].patient){
	          	  eventModel.patient = {};
		          eventModel.patient.reaction = results[i].patient.reaction;
		          if(results[i].patient.patientonsetage && !isNaN(results[i].patient.patientonsetage)){
		          	eventModel.patient.age = parseInt(results[i].patient.patientonsetage);
		          }		          
		          if(results[i].patient.patientsex){
		          	if(results[i].patient.patientsex == '1'){
		          		eventModel.patient.gender = 'Male';
		          	}else if(results[i].patient.patientsex == '2'){
		          		eventModel.patient.gender = 'Female';
		          	}else{
		          		eventModel.patient.gender = 'Unknown';
		          	}
		          }		          
		          if(results[i].patient.drug 
		          		&& results[i].patient.drug.length > 2
		          		&& results[i].patient.drug[2].openfda){
		          	eventModel.patient.drugSubstance = results[i].patient.drug[2].openfda.substance_name;
		          }		          
	          }
	          responseObj.events.push(eventModel);
	       }
	    }
	   	return cb(null, responseObj); 
   });

};

Event.remoteMethod(
    'fetchEvents',
    {
      description: ['Fetch adverse events for the given drug.'],
      accepts: [{arg: 'q', type: 'string', required: true, description:'Drug Name'},
      			{arg: 'typ', type: 'string', required: true, description: ['Drug Type - ','Should be either brand or generic']},
      			{arg: 'skip', type: 'number', required: true, description: ['Docs from FDA API - ',
      												'Skip this number of records that match the search parameter, then return the matching records that follow.',
      												'Use in combination with limit to paginate results.',
      												'If Skip is not provide, it will be assumed zero']},
      			{arg: 'limit', type: 'number', required: true, description: ['Docs from FDA API - ',
      												'Return up to this number of records that match the search parameter.',
      												'Large numbers (above 100) could take a very long time, or crash your browser.', 
      												'If limit is not provided, it will be assumed one.']}
      			],
      returns: {arg: 'response', type: 'object'},
      http: {path: '/', verb: 'get'}
    }
  );
};
