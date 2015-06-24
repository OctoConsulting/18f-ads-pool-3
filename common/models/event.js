module.exports = function(Event) {
var request = require('request');
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('event');
var constants = require('../../messages/constants');

/**
	This method process the response returned by fetchEvents FDA Rest API

	@param error Error Object 
	@param response Response object
	@param body skip Docs from FDA API : Skip this number of records that match the search parameter, 
							then return the matching records that follow. Use in combination with limit to paginate results.
	@param cb limit Docs from FDA API : Return up to this number of records that match the search parameter. 
					Large numbers (above 100) could take a very long time, or crash your browser. 
*/

processFetchEventsResponse = function (error, response, body, cb) {
	var responseObj = {};
   	if(error){
      logger.error('Error happened in retrieving the drug event information');
      return cb(error); 
    }else if (!error && response.statusCode == 200) {
    	var responseOBJ = JSON.parse(body);   	
       	var meta = responseOBJ.meta;	       	
       	//Setting the meta data
	    responseObj.count = meta.results.total;
	    responseObj.skip = meta.results.skip;
	    responseObj.limit = meta.results.limit;
	    responseObj.events = [];
	    var results = responseOBJ.results;
       	for(var i in results){          
          var eventModel = {};
          //Setting event information
          eventModel.safetyreportid = results[i].safetyreportid;
          if(results[i].receivedate){
          	var date = results[i].receivedate;
          	eventModel.receivedate = date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8);
          }
          //Event serious information
          eventModel.serious = [];

          if(results[i].serious){
          	if(results[i].serious == '1'){
          		eventModel.serious.push('This was a serous event.');
          	}else{
          		eventModel.serious.push('This was a non-serous event.');
          	}
          }
          if(results[i].seriousnessdisabling && results[i].seriousnessdisabling == '1'){
          	eventModel.serious.push('This event caused the disability of a patient.');
          }
          if(results[i].seriousnessother && results[i].seriousnessother == '1'){
          	eventModel.serious.push('This event has an unknown level of seriousness.');
          }
          if(results[i].seriousnesshospitalization && results[i].seriousnesshospitalization == '1'){
          	eventModel.serious.push('This event caused patient hospitalization.');
          }
          if(results[i].seriousnesscongenitalanomali && results[i].seriousnesscongenitalanomali == '1'){
          	eventModel.serious.push('This event caused a congenital defect to the patient.');
          }
          if(results[i].seriousnessdeath && results[i].seriousnessdeath == '1'){
          	eventModel.serious.push('This event ended in the death of a patient.');
          }
          if(results[i].seriousnesslifethreatening && results[i].seriousnesslifethreatening == '1'){
          	eventModel.serious.push('This event was life threatening to the patient.');
          }
          //Setting the patient information
          if(results[i].patient){
          	  eventModel.patient = {};
	          //Constructing reaction string
	          if(results[i].patient.reaction){
	          	var reactionString = '';
	          	for(var j in results[i].patient.reaction){
	          		if(results[i].patient.reaction[j].reactionmeddrapt){
	          			if( j == 0){
	          				reactionString = results[i].patient.reaction[j].reactionmeddrapt;
	          			}else{
	          				reactionString = reactionString + ',' + results[i].patient.reaction[j].reactionmeddrapt;
	          			}		          			
	          		}			          			          		
	          	}
	          	eventModel.patient.reaction = reactionString;
	          }
	          if(results[i].patient.patientonsetage && !isNaN(results[i].patient.patientonsetage)){
	          	eventModel.patient.age = parseInt(results[i].patient.patientonsetage);
	          }		          
	          if(results[i].patient.patientsex){
	          	if(results[i].patient.patientsex == '1'){
	          		eventModel.patient.gender = constants.male;
	          	}else if(results[i].patient.patientsex == '2'){
	          		eventModel.patient.gender = constants.female;
	          	}else{
	          		eventModel.patient.gender = constants.unknown;
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
};

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
   var fdaEventRestAPI = Event.app.get("fdaDrugEventApi");
   var apiKey = Event.app.get("fdaApiKey");;
   var fdaEventURL = fdaEventRestAPI + 'api_key='+ apiKey; 
   //Drung band names and generica name are all uppercase in adverse events dataset. So converting the case to Uppercase always.
   q = q.toUpperCase();
   if(typ == 'brand'){   	
      	fdaEventURL = fdaEventURL + '&search=patient.drug.openfda.brand_name.exact:"'+ q +'"'; 
   }else if(typ == 'generic'){
   		fdaEventURL = fdaEventURL + '&search=patient.drug.openfda.generic_name.exact:"'+ q +'"'; 
   }else{
      error = new Error();
      error.statusCode = 400;
      error.message = 'Typ must be either brand or generic.';
      return cb(error);	
   }
   //Adding limit param
   if(limit){
   		fdaEventURL = fdaEventURL + '&limit=' + limit
   }
   //Adding skip param for pagination
   if(skip){
   		fdaEventURL = fdaEventURL + '&skip=' + skip;
   }
   //FDA API cannot support limit more than 100. Please try again with limit less than or equal to 100.
   if(limit > 100){
   	  error = new Error();
      error.statusCode = 400;
      error.message = 'Limit cannot be more than 100.';
      return cb(error);
   }
   //FDA API cannot support skip more than 5000. Please try again with skip less than or equal to 5000.
   if(skip > 5000){
   	  error = new Error();
      error.statusCode = 400;
      error.message = 'Skip cannot be more than 5000.';
      return cb(error);
   }
   logger.debug('fdaEventURL:: '+ fdaEventURL);
   //Make rest API to FDA to retrieve adverse events for the drung
   request(fdaEventURL, function (error, response, body) {
   		processFetchEventsResponse(error, response, body, cb);
   });

};

Event.remoteMethod(
    'fetchEvents',
    {
      description: ['Fetch adverse events for the given drug.'],
      accepts: [{arg: 'q', type: 'string', required: true, description:'Drug Name'},
      			{arg: 'typ', type: 'string', required: true, description: ['Drug Type - ','Should be either brand or generic']},
      			{arg: 'skip', type: 'number', required: true, description: [
      												'Skip this number of records that match the search parameter, then return the matching records that follow.',
      												'Use in combination with limit to paginate results.',      												
      												'FDA API does not support Skip more than 5000. So Skip cannot be more than 5000.']},
      			{arg: 'limit', type: 'number', required: true, description: [
      												'Return up to this number of records that match the search parameter.',      												
      												'FDA API does not support Limit more than 100. So Limit cannot be more than 100.']}
      			],
      returns: {arg: 'response', type: 'object'},
      http: {path: '/', verb: 'get'}
    }
  );
};
