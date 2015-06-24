var request = require('request');
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('recall');

module.exports = function(Recall) {

//Implementation of Rest End Point for '/recalls' path, return Response with "response" JSON object with matadata and 
//an array of recall details given a brand or generic drug name
Recall.getRecallDetails = function(q, typ, limit, skip, cb){
   var fdaRecallURL = 'https://api.fda.gov/drug/enforcement.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=';
   if(typ === 'generic')
  	 fdaRecallURL = fdaRecallURL + 'openfda.generic_name.exact:"'+ q +'"' ;
   if(typ === 'brand')
     fdaRecallURL =  fdaRecallURL + 'openfda.brand_name.exact:"'+ q +'"' ;

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
      logger.debug('Error happened in retrieving the drug recall information');
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
    }else{
      return cb(null, {});
    }   
   });
};


Recall.remoteMethod(
    'getRecallDetails',
    {
      description: 'Fetch drug recall details for the given drug brand_name',
      accepts: [{arg: 'q', type: 'string', required: true},{arg: 'typ', type: 'string', required: true},{arg: 'limit', type: 'string', required: true},{arg: 'skip', type: 'string', required: true}],
      returns: {arg: 'response', type: 'object'},
      http: {path: '/', verb: 'get'}
    }
  );


};