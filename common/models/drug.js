var request = require('request');
var utils = require('../utils/utility');
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('drug');

module.exports = function(Drug) {

isDrugExist = function(drugArray, drugName){
  var result = false;
  for(var i in drugArray){
    if(drugName == drugArray[i].name){
      return true;
    }
  }
  return result;
}

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
      q = utils.capitalizeString(q);
      //Converting response bidy to JSON object
      var responseOBJ = JSON.parse(body);
      var results = responseOBJ.results;
      for(var i in results) {
        //Limitng the suggestions to 10
         if(drugSuggestions.length == 10){
            break;
         }
         var drugItem = results[i];
         if(drugItem.set_id){

            //Looping brandnames to find the matches
            if(drugItem.openfda.brand_name){
              var brandNames = drugItem.openfda.brand_name;
              for(var j in brandNames){
                 var brandName = utils.capitalizeString(brandNames[j]);
                  //logger.debug('brandName:::'+brandName);
                 if(brandName.indexOf(q) > -1 && !isDrugExist(drugSuggestions, brandName)){
                  var drugSuggestion = {};
                  drugSuggestion.name =  brandName;
                  drugSuggestion.indicator = "brand";
                  drugSuggestions.push(drugSuggestion);
                 }
              }
            }  

            //Looping generic names to find the matches
            if(drugItem.openfda.generic_name){
               var genericNames = drugItem.openfda.generic_name;
                for(var k in genericNames){
                 var genericName = utils.capitalizeString(genericNames[k]);
                 //logger.debug('genericName:::'+genericName);
                 if(genericName.indexOf(q) > -1 && !isDrugExist(drugSuggestions, genericName)){
                  var drugSuggestion = {};
                  drugSuggestion.name =  genericName;
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



Drug.getDrugDetails = function(q, typ, cb){
   var fdaLabelURL = 'https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=generic_name:"'+q+'"'; 
   if(typ == 'brand')
      fdaLabelURL = 'https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=brand_name:"'+q+'"';

   logger.debug('fdaLabelURL:: '+ fdaLabelURL);
   request(fdaLabelURL, function (error, response, body) {
    if(error){
      logger.debug('Error happened in retrieving the drug label information');
      error.message = 'Your search could not be made at this time.';
      return cb(error); 
    } else if (!error && response.statusCode == 200) {
       var responseOBJ = JSON.parse(body);
       var results = responseOBJ.results;
       var meta = responseOBJ.meta;
       if(results.length != 0){          
          var drugModel = {};
          drugModel.brand_name =  results[0].openfda.brand_name;
          drugModel.generic_name =  results[0].openfda.generic_name;
          drugModel.purpose =  ((results[0].description == null || results[0].description == '') ? results[0].purpose : results[0].description);
          drugModel.count = meta.results.total;

          return cb(null, drugModel);         
       }    
    }else{
      error = new Error();
      error.statusCode = 400;
      error.message = 'No results were found for your search.';
      return cb(error);
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
      accepts: [{arg: 'q', type: 'string', required: true},{arg: 'typ', type: 'string', required: true}],
      returns: {arg: 'drug', type: 'object'},
      http: {path: '/details', verb: 'get'}
    }
  );

};
