var request = require('request');
var utils = require('../utils/utility');
var log4js = require('log4js');
log4js.configure('server/log4js_configuration.json', {});
var logger = log4js.getLogger('drug');
var constants = require('../../messages/referenceConstants');

module.exports = function(Reference) {

	/**
	Fetches the references for filters.
	
*/
Reference.fetchReferences = function(cb){
	var references = []; 
	var reference = {};
	reference.age = constants.ageReference ;	
	reference.gender = constants.gender;
	reference.seriousness =  constants.seriousness;	
	reference.timeline = constants.timeline;
	reference.reasons = constants.reasons;
	references.push(reference);

	return cb(null, references); 
};

	Reference.remoteMethod(
    'fetchReferences',
    {
      description: ['Fetch filter references for events and drugs.'],      
      returns: {arg: 'response', type: 'object'}, 
      http: {path: '/', verb: 'get'}
    }
  );
};
