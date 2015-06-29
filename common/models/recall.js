var request = require('request');
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('recall');
var utils = require('../utils/utility');

module.exports = function(Recall) {

//Implementation of Rest End Point for '/recalls' path, return Response with "response" JSON object with metadata and 
//an array of recall details given a brand or generic drug  
Recall.getRecallDetails = function(q, typ, limit, skip, reason, fromDate, toDate, cb){
   var fdaRecallURL = Recall.app.get('fdaDrugEnforcementApi') + 'api_key=' + Recall.app.get('fdaApiKey') +  '&search=';
   q = utils.removeSpecialChars(q);
   if(typ === 'generic')
  	 fdaRecallURL = fdaRecallURL + 'openfda.generic_name.exact:"'+ q +'"' ;
   if(typ === 'brand')
     fdaRecallURL =  fdaRecallURL + 'openfda.brand_name.exact:"'+ q +'"' ;


     //Append additional filters
     var filters = utils.buildFilterUrlForRecall(reason, fromDate, toDate);
     if(filters != '') {
        fdaRecallURL = fdaRecallURL + filters;
     }

     var lim = parseInt(limit);
     if(!isNaN(lim)) { 
     	fdaRecallURL = fdaRecallURL + '&limit=' + lim;
     }

     var start = parseInt(skip);
     if(!isNaN(start)) { 
     	fdaRecallURL = fdaRecallURL + '&skip=' + start;
     }     

   logger.debug('fdaRecallURL:: '+ fdaRecallURL);
   request(fdaRecallURL, function (error, response, body) {
    if(error){
      logger.error('Error occured when retrieving the drug recall information');

      return cb(error); 
    } else if (!error && response.statusCode == 200) {
       var responseOBJ = JSON.parse(body);
       var results = responseOBJ.results;
       var meta = responseOBJ.meta;
       var recalls = [];
       var response = {};
       if(results.length != 0){          
          var recallObj = {};
          //Set results metadata
          response.count = meta.results.total;
          response.skip = meta.results.skip;
          response.limit = meta.results.limit;

          for(var i=0; i < results.length; i++) {
	          //Set Recall details
	          var recallDetails = {};
	          recallDetails.recall_number = results[i].recall_number;
            if(results[i].recall_initiation_date){
              var date = results[i].recall_initiation_date;
              recallDetails.recall_initiation_date = date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(6,8);
            }	          
	          recallDetails.reason_for_recall = results[i].reason_for_recall;
	          recallDetails.distribution_pattern = results[i].distribution_pattern;
	          recallDetails.recalling_firm = results[i].recalling_firm;
	          recallDetails.product_description = results[i].product_description;
	          recallDetails.product_quantity = results[i].product_quantity;

	          recalls.push(recallDetails);
	      }
	      response.recalls = recalls;
  
          return cb(null, response);         
       }    
    } 
    else{
      return cb(null, {});
    }   
   });
};

/**
  Fetches the reactions for the given drug. This method also supports pagination.

  @param q {string} The drung name for which the adverse recalls are requested for. 
  @param typ {string} Drug type. It should be either brand or geenric.
  @param fromDate {string} Filter the recalls by recall received date that is greater than this date. 
                              Valid format is yyyymmdd or yyyy-mm-dd
  @param toDate {string} Filter the recalls by recall received date that is greater than this date. 
                              Valid format is yyyymmdd or yyyy-mm-dd 
*/

Recall.getRecallCountByDate = function(q, typ, fromDate, toDate, cb){
  //Validating the params
  validateRecallCountByDateParams(q, typ, cb);
   //Constructing the URL to fetch adverse recalls
   var fdaRecallURL = constructRecallCountByDateURL(q, typ, fromDate, toDate);
   logger.debug('fdaRecallURL:: '+ fdaRecallURL);
   //Make rest API to FDA to retrieve adverse recalls for the drung
   request(fdaRecallURL, function (error, response, body) {
      processRecallCountByDateResponse(error, response, body, cb);
   });
};

/**
  This method validates the data for reactions API

  @param q {string}   Drug Name
  @param typ {string} Drug Type
  @param cb {Function} callback  
*/

validateRecallCountByDateParams = function(q, typ, cb){
   if(typ != 'brand' && typ != 'generic'){    
      error = new Error();
      error.statusCode = 400;
      error.message = messages.ERROR_TYP_VALIDATION;
      return cb(error); 
   }
};

/**
  This method construct the FDA Rest Api to fetch reactions.

  @param q {string} The drung name for which the adverse recalls are requested for. 
  @param typ {string}  Drug type. It should be either brand or geenric.
  @param fromDate {string} Filter the recalls by recall received date that is greater than this date. 
                              Valid format is yyyymmdd or yyyy-mm-dd
  @param toDate {string} Filter the recalls by recall received date that is greater than this date. 
                              Valid format is yyyymmdd or yyyy-mm-dd 
*/

constructRecallCountByDateURL = function(q, typ, fromDate, toDate) {
   //Constructing the URL to fetch adverse recalls
   var fdaRecallURL = Recall.app.get("fdaDrugEnforcementApi");
   var apiKey = Recall.app.get("fdaApiKey");
   fdaRecallURL = fdaRecallURL + 'api_key='+ apiKey; 
   //Drung band names and generica name are all uppercase in adverse recalls dataset. So converting the case to Uppercase always.
   q = utils.removeSpecialChars(q);
   q = q.toUpperCase();
   if(typ == 'brand'){    
        fdaRecallURL = fdaRecallURL + '&search=openfda.brand_name.exact:"'+ q +'"'; 
   }else if(typ == 'generic'){
      fdaRecallURL = fdaRecallURL + '&search=openfda.generic_name.exact:"'+ q +'"'; 
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
     fdaRecallURL = fdaRecallURL + '+AND+(recall_initiation_date:['+fromDate+'+TO+'+ toDate+'])';    
   }else if(fromDate){
     fdaRecallURL = fdaRecallURL + '+AND+(recall_initiation_date:>=' + fromDate+')';
   }else if(toDate){
     fdaRecallURL = fdaRecallURL + '+AND+(recall_initiation_date:<=' + toDate+')';
   }
   fdaRecallURL = fdaRecallURL + '&count=recall_initiation_date';
   return fdaRecallURL;
};

/**
  This method process the response from FDA API Response for reactions

  @param error {Error}
  @param response {Object}
  @param body {Object}
  @param cb  {Function} callback
*/

processRecallCountByDateResponse = function (error, response, body, cb) {
    var retResults = [];
    if(error){
      logger.error('Error happened in retrieving the drug reactions information');
      return cb(error); 
    }else if (!error && response.statusCode == 200) {
      var responseOBJ = JSON.parse(body);     
      var results = responseOBJ.results;
      var finalResults = [];
      for(var i in results){
        var obj = [];
        var year = parseInt(results[i].time.substring(0, 4));
        var month = parseInt(results[i].time.substring(4, 6));
        var day = parseInt(results[i].time.substring(6, 8));
        obj.push(Date.UTC(year, month, day));
        obj.push(results[i].count);
        finalResults.push(obj);
      }
    }
    return cb(null, finalResults); 
};

//REST Endpoint Configuration
Recall.remoteMethod(
    'getRecallDetails',
    {
      description: 'Fetch drug recall details for a given drug name, type and other filters',
      accepts: [{arg: 'q', type: 'string', required: true, description:'Drug Name'},
                {arg: 'typ', type: 'string', required: true, description:'Drug Type (valid values: generic or brand)'},
                {arg: 'limit', type: 'string', required: true, description:'Number of records to return (valid values: from 1 - 100)'},
                {arg: 'skip', type: 'string', required: true, description:'Number of records to skip (valid values: upto 0 - 5000)'},
                {arg: 'reason', type: 'string', description:['Recall Reason from valid values. valid values:',
                               '"Lack of Assurance of Sterility"',
                               '"Penicillin Cross Contamination"',
                               '"Labeling"',
                               '"adverse reactions"',
                               '"Subpotent Drug"',
                               '"Contamination"',
                               '"Presence of Particulate Matter"',
                               '"Tablet"']},
                {arg: 'fromDate', type: 'string', description: [
                              'Recall Reported From Date.',                             
                              'valid format is yyyymmdd or yyyy-mm-dd']},
                {arg: 'toDate', type: 'string', description: [
                              'Recall Reported To Date.',                             
                              'valid format is yyyymmdd or yyyy-mm-dd']}],
      returns: {arg: 'response', type: 'object', description:'Drug Name'},
      http: {path: '/', verb: 'get'}
    }
  );

Recall.remoteMethod(
    'getRecallCountByDate',
    {
      description: 'Fetch recall counts by date',
      accepts: [{arg: 'q', type: 'string', required: true, description:'Drug Name'},
                {arg: 'typ', type: 'string', required: true, description: ['Drug Type - ', 
                                                'Should be either brand or generic']},
                {arg: 'fromDate', type: 'string', description: [
                              'Filter the recalls by recall received date that is greater than this date.',                             
                              'Valid format is yyyymmdd or yyyy-mm-dd']},
                {arg: 'toDate', type: 'string', description: [
                              'Filter the recalls by recall received date that is greater than this date.',                             
                              'Valid format is yyyymmdd or yyyy-mm-dd']}
              ],
      returns: {arg: 'results', type: 'array'},
      http: {path: '/countByDate', verb: 'get'}
    }
  );

};