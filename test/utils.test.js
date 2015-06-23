var app = require('../server/server.js');
var should = require('should');
var supertest = require('supertest');
var utils = require('../common/utils/utility.js')

describe('Test Utils Fucntions', function(){
	 describe('Test getSearchQuery', function(){
	 	it('should return TO string', function(done){
	 		var result = utils.getToString('Tyl');
	 	    result.should.match('Tym');

	 	    done();

	 	});
	 });

	 describe('Test getSearchQuery', function(){
	 	it('should return FDA REST API URL for search term', function(done){
	 		var result = utils.getSearchQuery('TYLENOL Regular Strengt');
	 	    result.should.match('https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=(openfda.brand_name:TYLENOL+AND+openfda.brand_name:Regular+AND+openfda.brand_name:[Strengt+TO+Strengu])+OR+(openfda.generic_name:TYLENOL+AND+openfda.generic_name:Regular+AND+openfda.generic_name:[Strengt+TO+Strengu])&limit=25');

	 	    done();

	 	});
	 });	 
});