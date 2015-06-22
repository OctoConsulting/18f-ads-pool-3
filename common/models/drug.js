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



Drug.getDrugDetails = function(q, typ, cb){
   var fdaLabelURL = 'https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=generic_name:'+q; 
   if(typ == 'brand')
      fdaLabelURL = 'https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=brand_name:'+q;

   logger.debug('fdaLabelURL:: '+ fdaLabelURL);
   request(fdaLabelURL, function (error, response, body) {
    if(error){
      logger.debug('Error happened in retrieving the drug label information');
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
      accepts: [{arg: 'q', type: 'string', required: true},{arg: 'typ', type: 'string', required: true}],
      returns: {arg: 'drug', type: 'object'},
      http: {path: '/details', verb: 'get'}
    }
  );

};
