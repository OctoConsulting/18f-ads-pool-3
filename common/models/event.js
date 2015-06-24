module.exports = function(Event) {
var request = require('request');
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('event');
var constants = require('../../messages/constants');
var messages = require('../../messages/event-messages');

/**
	This method process the response from fetchEvents FDA Rest API

	@param error
	@param response
	@param body 
	@param cb 
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
          		eventModel.serious.push(messages.MSG_SERIOUS);
          	}else{
          		eventModel.serious.push(messages.MSG_NON_SERIOUS);
          	}
          }
          if(results[i].seriousnessdisabling && results[i].seriousnessdisabling == '1'){
          	eventModel.serious.push(messages.MSG_SERIOUSNESSDISABLING);
          }
          if(results[i].seriousnessother && results[i].seriousnessother == '1'){
          	eventModel.serious.push(messages.MSG_SERIOUSNESSOTHER);
          }
          if(results[i].seriousnesshospitalization && results[i].seriousnesshospitalization == '1'){
          	eventModel.serious.push(messages.MSG_SERIOUSNESSHOSPITALIZATION);
          }
          if(results[i].seriousnesscongenitalanomali && results[i].seriousnesscongenitalanomali == '1'){
          	eventModel.serious.push(messages.MSG_SERIOUSNESSCONGENITALANOMALI);
          }
          if(results[i].seriousnessdeath && results[i].seriousnessdeath == '1'){
          	eventModel.serious.push(messages.MSG_SERIOUSNESSDEATH);
          }
          if(results[i].seriousnesslifethreatening && results[i].seriousnesslifethreatening == '1'){
          	eventModel.serious.push(messages.MSG_SERIOUSNESSLIFETHREATENING);
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
	          		eventModel.patient.gender = constants.MALE;
	          	}else if(results[i].patient.patientsex == '2'){
	          		eventModel.patient.gender = constants.FEMALE;
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
  This method validates the data.

  @param {string} q The drung name for which the adverse events are requested for. 
  @param {string} typ Drug type. It should be either brand or geenric.
  @param {number} skip Docs from FDA API : Skip this number of records that match the search parameter, 
              then return the matching records that follow. Use in combination with limit to paginate results.
  @param {number} limit Docs from FDA API : Return up to this number of records that match the search parameter. 
          Large numbers (above 100) could take a very long time, or crash your browser. 
  @param {number} minAge Filter the events by patent age that is greater than this age.
  @param {number} maxAge Filter the events by patent age that is less than this age.
  @param {number} gender Filter the events by patent gender. Valid Value are : 0 = unknown, 1 = male , 2= Female
  @param {string} seriousness Filter the events by patent gender. Valid Value are : 
                          seriousnessdisabling, seriousnessother, 
                          seriousnesshospitalization, seriousnesscongenitalanomali, 
                          seriousnessdeath, seriousnesslifethreatening
  @param {string} fromDate Filter the events by event received date that is greater than this date. 
                              Valid format is yyyymmdd or yyyy-mm-dd
  @param {string} toDate Filter the events by event received date that is greater than this date. 
                              Valid format is yyyymmdd or yyyy-mm-dd 
*/
validateFetchEventsParams = function(q, typ, skip, limit, minAge, maxAge, gender, seriousness, fromDate, toDate, cb){
   if(typ != 'brand' && typ != 'generic'){    
      error = new Error();
      error.statusCode = 400;
      error.message = messages.ERROR_TYP_VALIDATION;
      return cb(error); 
   }
    //FDA API cannot support limit more than 100. Please try again with limit less than or equal to 100.
   if(limit > 100){
      error = new Error();
      error.statusCode = 400;
      error.message = messages.ERROR_LIMIT_VALIDATION;
      return cb(error);
   }
   //FDA API cannot support skip more than 5000. Please try again with skip less than or equal to 5000.
   if(skip > 5000){
      error = new Error();
      error.statusCode = 400;
      error.message = messages.ERROR_SKIP_VALIDATION;
      return cb(error);
   }
};

/**
  This method construct the FDA Rest Api to fetch events.

  @param {string} q The drung name for which the adverse events are requested for. 
  @param {string} typ Drug type. It should be either brand or geenric.
  @param {number} skip Docs from FDA API : Skip this number of records that match the search parameter, 
              then return the matching records that follow. Use in combination with limit to paginate results.
  @param {number} limit Docs from FDA API : Return up to this number of records that match the search parameter. 
          Large numbers (above 100) could take a very long time, or crash your browser. 
  @param {number} minAge Filter the events by patent age that is greater than this age.
  @param {number} maxAge Filter the events by patent age that is less than this age.
  @param {number} gender Filter the events by patent gender. Valid Value are : 0 = unknown, 1 = male , 2= Female
  @param {string} seriousness Filter the events by patent gender. Valid Value are : 
                          seriousnessdisabling, seriousnessother, 
                          seriousnesshospitalization, seriousnesscongenitalanomali, 
                          seriousnessdeath, seriousnesslifethreatening
  @param {string} fromDate Filter the events by event received date that is greater than this date. 
                              Valid format is yyyymmdd or yyyy-mm-dd
  @param {string} toDate Filter the events by event received date that is greater than this date. 
                              Valid format is yyyymmdd or yyyy-mm-dd 
*/
constructfetchEventsRestUri = function(q, typ, skip, limit, minAge, maxAge, gender, seriousness, fromDate, toDate){
   //Constructing the URL to fetch adverse events
   var fdaEventURL = Event.app.get("fdaDrugEventApi");
   var apiKey = Event.app.get("fdaApiKey");
   fdaEventURL = fdaEventURL + 'api_key='+ apiKey; 
   //Drung band names and generica name are all uppercase in adverse events dataset. So converting the case to Uppercase always.
   q = q.toUpperCase();
   if(typ == 'brand'){    
        fdaEventURL = fdaEventURL + '&search=patient.drug.openfda.brand_name.exact:"'+ q +'"'; 
   }else if(typ == 'generic'){
      fdaEventURL = fdaEventURL + '&search=patient.drug.openfda.generic_name.exact:"'+ q +'"'; 
   }
   //Adding filter for age
   if(minAge && maxAge){
    fdaEventURL = fdaEventURL + '+AND+(patient.patientonsetage:['+minAge+'+TO+'+ maxAge+'])';
   }else if(minAge){
    fdaEventURL = fdaEventURL + '+AND+(patient.patientonsetage:>=' + minAge+')';
   }else if(maxAge){    
    fdaEventURL = fdaEventURL + '+AND+(patient.patientonsetage:<=' + maxAge+')';
   }
   //Adding filter for gender
   if(gender){
    fdaEventURL = fdaEventURL + '+AND+(patient.patientsex:' + gender + ')';
   }
   //Adding filter for seriousness
   if(seriousness){
    fdaEventURL = fdaEventURL + '+AND+(_exists_:' + seriousness + ')';
   }

   //Replacing the date
   if(fromDate){
     fromDate = fromDate.replace(/-/g,"");
   }
   if(toDate){
     toDate = toDate.replace(/-/g,"");
   }

   //Adding filter for received dates
   if(fromDate && toDate){
     fdaEventURL = fdaEventURL + '+AND+(receivedate:['+fromDate+'+TO+'+ toDate+'])';    
   }else if(fromDate){
     fdaEventURL = fdaEventURL + '+AND+(receivedate:>=' + fromDate+')';
   }else if(toDate){
     fdaEventURL = fdaEventURL + '+AND+(receivedate:<=' + toDate+')';
   }
   //Adding filter for limit
   if(limit){
      fdaEventURL = fdaEventURL + '&limit=' + limit
   }
   //Adding filter for skip
   if(skip){
      fdaEventURL = fdaEventURL + '&skip=' + skip;
   }
   return fdaEventURL;
};

/**
	Fetches the adverse events for the given drug. This method also supports pagination.

	@param {string} q The drung name for which the adverse events are requested for. 
	@param {string} typ Drug type. It should be either brand or geenric.
	@param {number} skip Docs from FDA API : Skip this number of records that match the search parameter, 
							then return the matching records that follow. Use in combination with limit to paginate results.
	@param {number} limit Docs from FDA API : Return up to this number of records that match the search parameter. 
					Large numbers (above 100) could take a very long time, or crash your browser. 
  @param {number} minAge Filter the events by patent age that is greater than this age.
  @param {number} maxAge Filter the events by patent age that is less than this age.
  @param {number} gender Filter the events by patent gender. Valid Value are : 0 = unknown, 1 = male , 2= Female
  @param {string} seriousness Filter the events by patent gender. Valid Value are : 
                          seriousnessdisabling, seriousnessother, 
                          seriousnesshospitalization, seriousnesscongenitalanomali, 
                          seriousnessdeath, seriousnesslifethreatening
  @param {string} fromDate Filter the events by event received date that is greater than this date. 
                              Valid format is yyyymmdd or yyyy-mm-dd
  @param {string} toDate Filter the events by event received date that is greater than this date. 
                              Valid format is yyyymmdd or yyyy-mm-dd 
*/
Event.fetchEvents = function(q, typ, skip, limit, minAge, maxAge, gender, seriousness, fromDate, toDate, cb){
  //Validating the params
  validateFetchEventsParams(q, typ, skip, limit, minAge, maxAge, gender, seriousness, fromDate, toDate, cb);
   //Constructing the URL to fetch adverse events
   var fdaEventURL = constructfetchEventsRestUri(q, typ, skip, limit, minAge, maxAge, gender, seriousness, fromDate, toDate);
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
      												'FDA API does not support Limit more than 100. So Limit cannot be more than 100.']},
            {arg: 'minAge', type: 'number', description: [
                              'Filter the events by patent age that is greater than this age.']},
            {arg: 'maxAge', type: 'number', description: [
                              'Filter the events by patent age that is less than this age.']},
            {arg: 'gender', type: 'number', description: [
                              'Filter the events by patent gender.',                             
                              'Valid values are : 0 = unknown, 1 = male , 2= Female']},
            {arg: 'seriousness', type: 'string', description: [
                              'Filter the events by patent gender.',                             
                              'Valid values are : seriousnessdisabling, seriousnessother, seriousnesshospitalization,', 
                               'seriousnesscongenitalanomali, seriousnessdeath, seriousnesslifethreatening']},
            {arg: 'fromDate', type: 'string', description: [
                              'Filter the events by event received date that is greater than this date.',                             
                              'Valid format is yyyymmdd or yyyy-mm-dd']},
            {arg: 'toDate', type: 'string', description: [
                              'Filter the events by event received date that is greater than this date.',                             
                              'Valid format is yyyymmdd or yyyy-mm-dd']}
      			],
      returns: {arg: 'response', type: 'object'},
      http: {path: '/', verb: 'get'}
    }
  );
};
