var app = require('../server/server.js');
var should = require('should');
var supertest = require('supertest');
describe('Test Event Model', function(){
	 describe('Test REST API - fetchEvents', function(){

	 	it('Results exists with brand name search', function(done){
	 		supertest(app).get('/api/events?q="TYLENOL REGULAR STRENGTH"&typ=brand&skip=1&limit=1').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		var responseOBJ = res.body; 
		 		responseOBJ.response.skip.should.equal(1);
		 		responseOBJ.response.limit.should.equal(1);
		 		should.exists(responseOBJ.response.events);
		 		responseOBJ.response.events.length.should.equal(1);
		 		done();
	 		});	
	 	});

	 	it('Results exists with generic name search', function(done){
	 		supertest(app).get('/api/events?q="IBUPROFEN"&typ=generic&skip=1&limit=1').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		var responseOBJ = res.body; 
		 		responseOBJ.response.skip.should.equal(1);
		 		responseOBJ.response.limit.should.equal(1);
		 		should.exists(responseOBJ.response.events);
		 		responseOBJ.response.events.length.should.equal(1);
		 		done();
	 		});	
	 	});

	 	it("Results don't exists with brand name search", function(done){
	 		supertest(app).get('/api/events?q="XXYYY"&typ=brand&skip=1&limit=1').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		var responseOBJ = res.body; 
		 		should.not.exists(responseOBJ.response.events);
		 		done();
	 		});	
	 	});

	 	it("Results don't exists with generic name search", function(done){
	 		supertest(app).get('/api/events?q="XXYYY"&typ=generic&skip=1&limit=1').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		var responseOBJ = res.body; 
		 		should.not.exists(responseOBJ.response.events);
		 		done();
	 		});	
	 	});

	 });
});