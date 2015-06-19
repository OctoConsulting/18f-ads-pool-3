var app = require('../server/server.js');
var should = require('should');
var supertest = require('supertest');
var utils = require('../utils.js')

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
	 		var result = utils.getSearchQuery('Tyl');
	 	    result.should.match('https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=openfda.brand_name:[Tyl+TO+Tym]+OR+openfda.generic_name:[Tyl+TO+Tym]&limit=10');

	 	    done();

	 	});
	 });	 
});