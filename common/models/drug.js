var request = require('request');
var utils = require('../utils/utility');
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('18f-asd-prototype-dev');

module.exports = function(Drug) {

Drug.findSuggestions = function(q, cb){
	logger.debug('Enterd findSuggestions method');
  //Fetching the search API
  var fdaAPI = utils.getSearchQuery(q);
  logger.debug('fdaAPI:: '+ fdaAPI);
  //Making the API call
  request(fdaAPI, 
          function (error, response, body) {
    var drugSuggestions = [];  
    //if error returning error object  
    if(error){
      logger.debug('Error happened');
      return cb(error); 
    } else if (!error && response.statusCode == 200) {
      q = q.toUpperCase();
      //Converting response bidy to JSON object
      var responseOBJ = JSON.parse(body);
      var results = responseOBJ.results;
      for(var i in results) {
         var drugItem = results[i];
         if(drugItem.set_id){

            //Looping brandnames to find the matches
            if(drugItem.openfda.brand_name){
              var brandNames = drugItem.openfda.brand_name;
              for(var j in brandNames){
                 var brandName = brandNames[j];
                  brandName = brandName.toUpperCase();
                  //logger.debug('brandName:::'+brandName);
                 if(brandName.indexOf(q) > -1){
                  drugSuggestions.push({
                      "id": drugItem.set_id,
                      "name": brandNames[j],
                      "indicator": "brand"
                   });
                 }
              }
            }  

            //Looping generic names to find the matches
            if(drugItem.openfda.generic_name){
               var genericNames = drugItem.openfda.generic_name;
                for(var k in genericNames){
                 var genericName = genericNames[k];
                genericName = genericName.toUpperCase();
                 //logger.debug('genericName:::'+genericName);
                 if(genericName.indexOf(q) > -1){
                  drugSuggestions.push({
                      "id": drugItem.set_id,
                      "name": genericNames[k],
                      "indicator": "generic"
                   });
                 }
              }
            } 

         }         
      }      
    }
    return cb(null, drugSuggestions);
  });
};

Drug.getDrugDetails = function(q, cb){
   var url = 'https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=set_id:'+q; 
   logger.debug('url:: '+ url);
   request(url, function (error, response, body) {

    if(error){
      logger.debug('Error happened');
      return cb(error); 
    } else if (!error && response.statusCode == 200) {
      var responseOBJ = JSON.parse(body);
       var results = responseOBJ.results;
       if(results.length != 0){
          logger.debug('Result is :: ' + results[0]);
          logger.debug('results[0].openfda.substance_name :: ' + results[0].openfda.substance_name);
          var drugModel = {};
          drugModel.substance_name = results[0].openfda.substance_name;
          drugModel.brand_name =  results[0].openfda.brand_name;
          drugModel.recalled =  'Yes';
          drugModel.purpose =  results[0].purpose;
          drugModel.generic_name =  results[0].openfda.generic_name;
          drugModel.manufacturer_name =  results[0].openfda.manufacturer_name;
          drugModel.product_type =  results[0].openfda.product_type;
          drugModel.route =  results[0].openfda.route;
          drugModel.package_label_principal_display_panel =  results[0].package_label_principal_display_panel;
          drugModel.active_ingredient =  results[0].active_ingredient;
          drugModel.inactive_ingredient =  results[0].inactive_ingredient;
          drugModel.overdosage =  results[0].overdosage;
          drugModel.dosage_and_administration =  results[0].dosage_and_administration;
          drugModel.adverse_reactions =  results[0].adverse_reactions;
          drugModel.warnings =  results[0].warnings;
          drugModel.stop_use =  results[0].stop_use;
          drugModel.keep_out_of_reach_of_children =  results[0].keep_out_of_reach_of_children;
          drugModel.ask_doctor =  results[0].ask_doctor;
          drugModel.questions =  results[0].questions;
          logger.debug('drugModel is :: ' + drugModel);
          return cb(null, drugModel);
       }     
    }
    return cb(null, {});
    
   });
};

Drug.remoteMethod(
    'findSuggestions',
    {
      description: 'Fetch suggestions for the given drug name',
      accepts: {arg: 'q', type: 'string', required: true},
      returns: {arg: 'result', type: 'array'},
      http: {path: '/suggestions', verb: 'get'}
    }
  );

Drug.remoteMethod(
    'getDrugDetails',
    {
      description: 'Fetch drug details for the given drug set_id',
      accepts: {arg: 'q', type: 'string', required: true},
      returns: {arg: 'drug', type: 'object'},
      http: {path: '/details', verb: 'get'}
    }
  );

};
