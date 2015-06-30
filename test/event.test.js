var app = require('../server/server.js');
var should = require('should');
var supertest = require('supertest');
var constants = require('../messages/constants');
var messages = require('../messages/event-messages');
var referenceData = require('../messages/referenceConstants');
var eventData = require('./event.test.data');

describe('Test Event Model', function(){
	 describe('Test REST API - fetchEvents', function(){

	 	it('Error Check - Typ is other than brand and generic', function(done){
	 		supertest(app).get('/api/events?q="ROCEPHIN"&typ=other&skip=1&limit=1').expect(400).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(400);
		 		var responseOBJ = res.body; 
		 		responseOBJ.message.should.equal(messages.ERROR_TYP_VALIDATION);
		 		done();
	 		});	
	 	});

	 	it('Error Check - Limit cannot be more than 100.', function(done){
	 		supertest(app).get('/api/events?q="ROCEPHIN"&typ=brand&skip=1&limit=101').expect(400).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(400);
		 		var responseOBJ = res.body; 
		 		responseOBJ.message.should.equal(messages.ERROR_LIMIT_VALIDATION);
		 		done();
	 		});	
	 	});

	 	it('Error Check - Skip cannot be more than 5000.', function(done){
	 		supertest(app).get('/api/events?q="ROCEPHIN"&typ=brand&skip=5001&limit=100').expect(400).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(400);
		 		var responseOBJ = res.body; 
		 		responseOBJ.message.should.equal(messages.ERROR_SKIP_VALIDATION);
		 		done();
	 		});	
	 	});


	 	it('Successful End-To-End Test - Search by brand', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events?limit=5&q=TYLENOL+REGULAR+STRENGTH&skip=0&typ=brand').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

	 	it('Successful End-To-End Test - Search by generic', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events?limit=5&q=TYLENOL+REGULAR+STRENGTH&skip=0&typ=generic').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

	 });

	describe('Test - processFetchEventsResponse', function(){

		it('Response - Error', function(done){
			error = new Error();
			error.status = 500;
			error.message = "Test Error";
			processFetchEventsResponse(error, {}, {}, function(error, result){
				error.status.should.equal(500);
				done();
			});
		});

		it('Response - No results found', function(done){
			var response = {};
			response.statusCode = 400;
			processFetchEventsResponse(null, response, {}, function(error, result){
				result.should.be.an.instanceOf(Object).and.not.have.property('count');
				result.should.be.an.instanceOf(Object).and.not.have.property('skip');
				result.should.be.an.instanceOf(Object).and.not.have.property('limit');
				result.should.be.an.instanceOf(Object).and.not.have.property('events');
				done();
			});
		});

		it('Response - Results found 1', function(done){
			var response = {};
			response.statusCode = 200;
			//console.log(eventData.dataset1);
			var body = eventData.dataset1;			
			processFetchEventsResponse(null, response, JSON.stringify(body), function(error, result){
				result.count.should.equal(300);
				result.skip.should.equal(10);
				result.limit.should.equal(20);
				result.events.length.should.equal(1);
				result.events[0].safetyreportid.should.equal('4322505-4');
				result.events[0].receivedate.should.equal('2015-06-25');
				result.events[0].serious.length.should.equal(7);
				result.events[0].serious.indexOf(messages.MSG_SERIOUS).should.not.equal(-1);				
				result.events[0].serious.indexOf(messages.MSG_SERIOUSNESSDISABLING).should.not.equal(-1);
				result.events[0].serious.indexOf(messages.MSG_SERIOUSNESSOTHER).should.not.equal(-1);
				result.events[0].serious.indexOf(messages.MSG_SERIOUSNESSHOSPITALIZATION).should.not.equal(-1);
				result.events[0].serious.indexOf(messages.MSG_SERIOUSNESSCONGENITALANOMALI).should.not.equal(-1);
				result.events[0].serious.indexOf(messages.MSG_SERIOUSNESSDEATH).should.not.equal(-1);
				result.events[0].serious.indexOf(messages.MSG_SERIOUSNESSLIFETHREATENING).should.not.equal(-1);
				result.events[0].patient.age.should.equal(56);
				result.events[0].patient.gender.should.equal(constants.MALE);
				result.events[0].patient.drugSubstance.length.should.equal(1);
				result.events[0].patient.drugSubstance[0].should.equal('CEFTRIAXONE SODIUM');
				done();
			});
		});

		it('Response - Results found 2', function(done){
			var response = {};
			response.statusCode = 200;
			//console.log(eventData.dataset2);
			var body = eventData.dataset2;			
			processFetchEventsResponse(null, response, JSON.stringify(body), function(error, result){
				result.count.should.equal(300);
				result.skip.should.equal(10);
				result.limit.should.equal(20);
				result.events.length.should.equal(2);
				result.events[1].safetyreportid.should.equal('4322505-3');
				result.events[1].receivedate.should.equal('2015-08-11');
				result.events[1].serious.length.should.equal(7);
				result.events[1].serious.indexOf(messages.MSG_NON_SERIOUS).should.not.equal(-1);				
				result.events[1].serious.indexOf(messages.MSG_SERIOUSNESSDISABLING).should.not.equal(-1);
				result.events[1].serious.indexOf(messages.MSG_SERIOUSNESSOTHER).should.not.equal(-1);
				result.events[1].serious.indexOf(messages.MSG_SERIOUSNESSHOSPITALIZATION).should.not.equal(-1);
				result.events[1].serious.indexOf(messages.MSG_SERIOUSNESSCONGENITALANOMALI).should.not.equal(-1);
				result.events[1].serious.indexOf(messages.MSG_SERIOUSNESSDEATH).should.not.equal(-1);
				result.events[1].serious.indexOf(messages.MSG_SERIOUSNESSLIFETHREATENING).should.not.equal(-1);
				result.events[1].patient.age.should.equal(60);
				result.events[1].patient.gender.should.equal(constants.FEMALE);
				result.events[1].patient.drugSubstance.length.should.equal(1);
				result.events[1].patient.drugSubstance[0].should.equal('CEFTRIAXONE SODIUM');
				done();
			});
		});


	});
	

	describe('Test - reactions', function(){

	 	it('Successful End-To-End Test - Search by brand', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events/reactions?q=IBUPROFEN&typ=brand').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

	 	it('Successful End-To-End Test - Search by generic', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events/reactions?q=IBUPROFEN&typ=generic').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

		it('Error Check - Typ is other than brand and generic', function(done){
	 		supertest(app).get('/api/events/reactions?q="ROCEPHIN"&typ=other').expect(400).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(400);
		 		var responseOBJ = res.body; 
		 		responseOBJ.message.should.equal(messages.ERROR_TYP_VALIDATION);
		 		done();
	 		});	
	 	});

	});	

	describe('Test - reactionOutComes', function(){

	 	it('Successful End-To-End Test - Search by brand', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events/reactionOutComes?q=IBUPROFEN&typ=brand').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

	 	it('Successful End-To-End Test - Search by generic', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events/reactionOutComes?q=IBUPROFEN&typ=generic').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

	 	it('Error Check - Typ is other than brand and generic', function(done){
	 		supertest(app).get('/api/events/reactionOutComes?q="ROCEPHIN"&typ=other').expect(400).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(400);
		 		var responseOBJ = res.body; 
		 		responseOBJ.message.should.equal(messages.ERROR_TYP_VALIDATION);
		 		done();
	 		});	
	 	});
	 	
	});	
	
	describe('Test - countByDate', function(){

	 	it('Successful End-To-End Test - Search by brand', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events/countByDate?q=IBUPROFEN&typ=brand').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

	 	it('Successful End-To-End Test - Search by generic', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events/countByDate?q=IBUPROFEN&typ=generic').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

		it('Error Check - Typ is other than brand and generic', function(done){
	 		supertest(app).get('/api/events/countByDate?q="ROCEPHIN"&typ=other').expect(400).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(400);
		 		var responseOBJ = res.body; 
		 		responseOBJ.message.should.equal(messages.ERROR_TYP_VALIDATION);
		 		done();
	 		});	
	 	});

	});	

	describe('Test - countByAge', function(){

		it('Test - getTotalCountMatchesAgeRange', function(done){
			var results = [];
			results.push({term:5, count:10});
			results.push({term:50, count:20});
			results.push({term:11, count:30});
			results.push({term:10, count:40});
			results.push({term:16, count:50});
			results.push({term:26, count:60});
			results.push({term:17, count:70});
			results.push({term:17.345, count:80});
			results.push({term:14, count:90});
			results.push({term:16, count:100});
			var ageRange = {minAge:10, maxAge:20};
			var count = getTotalCountMatchesAgeRange(results, ageRange);
			count.should.equal(460);
			done();
	 	});

	 	it('Successful End-To-End Test - Search by brand', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events/countByAge?q=IBUPROFEN&typ=brand').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

	 	it('Successful End-To-End Test - Search by generic', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events/countByAge?q=IBUPROFEN&typ=generic').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

		it('Error Check - Typ is other than brand and generic', function(done){
	 		supertest(app).get('/api/events/countByAge?q="ROCEPHIN"&typ=other').expect(400).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(400);
		 		var responseOBJ = res.body; 
		 		responseOBJ.message.should.equal(messages.ERROR_TYP_VALIDATION);
		 		done();
	 		});	
	 	});

	});

	describe('Test - countByGender', function(){

	 	it('Successful End-To-End Test - Search by brand', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events/countByGender?q=IBUPROFEN&typ=brand').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

	 	it('Successful End-To-End Test - Search by generic', function(done){
	 		this.timeout(30000);
	 		supertest(app).get('/api/events/countByGender?q=IBUPROFEN&typ=generic').expect(200).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(200)
		 		done();
	 		});	
	 	});

		it('Error Check - Typ is other than brand and generic', function(done){
	 		supertest(app).get('/api/events/countByGender?q="ROCEPHIN"&typ=other').expect(400).end(function(err,res){
		 		if(err) throw err;
		 		res.status.should.equal(400);
		 		var responseOBJ = res.body; 
		 		responseOBJ.message.should.equal(messages.ERROR_TYP_VALIDATION);
		 		done();
	 		});	
	 	});

	});
});