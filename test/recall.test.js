var app = require('../server/server.js');
var should = require('should');
var supertest = require('supertest');

describe('Test Recalls Endpoint', function(){
	 describe('Test REST API - getRecallDetails', function(){
	 	it('Results exists', function(done){
	 		supertest(app).get('/api/recalls?q="ADVIL"&skip=0&limit=5&typ=brand').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		var responseOBJ = res.body;	
		 		console.log('responseOBJ:::'+JSON.stringify(responseOBJ));
		 		responseOBJ.response.recalls[0].recall_number.should.match('D-1166-2014');
		 		done();
	 		});	
	 	});

	 	it("Results doesn't exist", function(done){
	 		supertest(app).get('/api/recalls?q="XXXYYYZZZ"&skip=0&limit=5&typ=brand').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		var responseOBJ = res.body;	
		 		should.not.exist(responseOBJ.recalls);
		 		done();
	 		});	
	 	});

	 });

});