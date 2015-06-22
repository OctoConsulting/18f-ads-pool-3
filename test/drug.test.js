var app = require('../server/server.js');
var should = require('should');
var supertest = require('supertest');

describe('Test Drug Model', function(){
	describe('Test REST API - suggestions', function(){
	 	it('Results exists', function(done){
	 		supertest(app).get("/api/drugs/suggestions?q=Tyl").expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		var responseOBJ = res.body;	
		 		console.log('responseOBJ:::'+JSON.stringify(responseOBJ.result));
		 		responseOBJ.result.length.should.notEqual(0);
		 		done();
	 		});	
	 	});

	 	it("Results doesn't exist", function(done){
	 		supertest(app).get("/api/drugs/suggestions?q=XXXX").expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		var responseOBJ = res.body;	
		 		responseOBJ.result.length.should.equal(0);
		 		done();
	 		});	
	 	});

	 });

	/* describe('Test REST API - details', function(){
	 	it('Results exists', function(done){
	 		supertest(app).get("/api/drugs/details?q=0027e3a2-862a-474d-8c33-dda1a2264b27").expect(200).end(function(err,res){
		 		if(err) throw err
		 		res.status.should.equal(200);
		 		var responseOBJ = res.body;	
		 		console.log('responseOBJ:::'+ JSON.strigify(responseOBJ));
		 		//responseOBJ.result.length.should.notEqual(0);
		 		done();
	 		});	
	 	});*/

	 	/*it("Results doesn't exist", function(done){
	 		supertest(app).get("/api/drugs/suggestions?q=XXXX").expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200);
		 		var responseOBJ = res.body;	
		 		responseOBJ.result.length.should.equal(0);
		 		done();
	 		});	
	 	});

	 });	*/ 
});