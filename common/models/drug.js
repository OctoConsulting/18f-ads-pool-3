var request = require('request');

var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('18f-asd-prototype-dev');

module.exports = function(Drug) {

Drug.findSuggestions = function(q, cb){
	logger.debug('Enterd findSuggestions method');

  request('https://api.fda.gov/drug/label.json?search=openfda.brand_name:[Tyl+TO+Tym]+OR+openfda.generic_name:[Tyl+TO+Tym]&limit=10', 
          function (error, response, body) {
    var drugSuggestions = [];
    if (!error && response.statusCode == 200) {
      return cb(null, body);
    }
  });
};

Drug.remoteMethod(
    'findSuggestions',
    {
      description: 'Fetch suggestions for the given drug name',
      accepts: {arg: 'q', type: 'string', required: true},
      returns: {arg: 'result', type: 'object'},
      http: {path: '/suggestions', verb: 'get'}
    }
  );

};
