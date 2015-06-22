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
    var drugNames = [];
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
        //Limitng the suggestions to 10
         if(drugNames.length == 10){
            break;
         }
         var drugItem = results[i];
         if(drugItem.set_id){

            //Looping brandnames to find the matches
            if(drugItem.openfda.brand_name){
              var brandNames = drugItem.openfda.brand_name;
              for(var j in brandNames){
                 var brandName = brandNames[j];
                  brandName = brandName.toUpperCase();
                  //logger.debug('brandName:::'+brandName);
                 if(brandName.indexOf(q) > -1 && drugNames.indexOf(brandNames[j]+'-brand') == -1){
                  var drugSuggestion = {};
                  drugSuggestion.name =  brandNames[j];
                  drugNames.push(drugSuggestion.name+'-brand');
                  drugSuggestion.indicator = "brand";
                  drugSuggestions.push(drugSuggestion);
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
                 if(genericName.indexOf(q) > -1 && drugNames.indexOf(brandNames[j]+'-generic') == -1){
                  var drugSuggestion = {};
                  drugSuggestion.name =  brandNames[j];
                  drugNames.push(drugSuggestion.name+'-generic');
                  drugSuggestion.indicator = "generic";
                  drugSuggestions.push(drugSuggestion);
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
   var fdaLabelURL = 'https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=set_id:'+q; 
   logger.debug('fdaLabelURL:: '+ fdaLabelURL);
   request(fdaLabelURL, function (error, response, body) {
    if(error){
      logger.debug('Error happened in retrieving the drug label information');
      return cb(error); 
    } else if (!error && response.statusCode == 200) {
       var responseOBJ = JSON.parse(body);
       var results = responseOBJ.results;
       if(results.length != 0){
          //logger.debug('Result is::::');
          //logger.debug(results[0]);
          var drugModel = {};
          drugModel.substance_name = results[0].openfda.substance_name;
          drugModel.brand_name =  results[0].openfda.brand_name;
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
          //Populating the recall indicator
          drugModel.recalled = 'No';
          if(results[0].openfda.product_ndc){
            var fdaEnforcementURL = 'https://api.fda.gov/drug/enforcement.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search='; 
            var product_ndc_string = '(openfda.product_ndc:';
            var product_ndc = results[0].openfda.product_ndc;
            for(var i in product_ndc){
              if(i>0){
                product_ndc_string = product_ndc_string+'+"'+product_ndc[i]+'"';
              }else{
                product_ndc_string = product_ndc_string+'"'+product_ndc[i]+'"';
              }        
            }
            product_ndc_string = product_ndc_string + ')';
            fdaEnforcementURL = fdaEnforcementURL + product_ndc_string;
            request(fdaEnforcementURL, function (error, response, body) {
              if(error){
                logger.debug('Error happened when connecting to FDA drug enforcement API'); 
              }else if (!error && response.statusCode == 200){
                var responseOBJ = JSON.parse(body);
                var results = responseOBJ.results;
                logger.debug('results.length:'+results.length); 
                if(results.length != 0){
                  drugModel.recalled = 'Yes';
                }
              }
              return cb(null, drugModel);
            });

          }else{
             return cb(null, drugModel);
           }         
       }    
    }else{
      return cb(null, {});
    }   
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
