/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */

describe( 'Detail Summary - ', function() {
  beforeEach( module( 'app') );
  beforeEach( module( 'ngMockE2E') );
  
  // Global Vars
  var scope;
  var DetailsEventsController;
  var detailsData = {"drug":{"brand_name":["ADVIL PM"],"purpose":["Purpose Pain reliever/fever reducer"],"generic_name":["IBUPROFEN"],"count":["2"]}};
  var stateparams;

  // Inject providers and initialize controller
  beforeEach( inject( function( $controller, _$location_, $rootScope,_$httpBackend_ ) {
      scope = $rootScope.$new();
      scope.currentPage = 1;
      scope.maxPerPage = 5;
      $httpBackend = _$httpBackend_;
      stateparams = { name: "ADVIL PM", typ : "brand"};
      DetailsSummaryController = $controller( 'DetailsSummaryController', { $scope: scope, $stateParams:stateparams, detailsData: detailsData, eventsData:{"response":{}}, recallsData:{"response":{}},referenceData:{"response":{}}, eventReactionChartData:{"result":[{"label":"Under 10","value":420}]},eventOutcomesChartData:{"results":[{"label":"Under 10","value":420}]},eventCountData:{"results":{}},recallCountData:{"results":{}},ageCountData:{"results":[{"label":"Under 10","value":420}]},genderCountData:{"results":[{"label":"Male","value":420}]} });
   }));

  it( 'should return events details', inject( function() {


    $httpBackend.expect('GET', '/api/events/reactions?limit=5&q=ADVIL+PM&skip=0&typ=brand')
        .respond('{"result":[{"label":"DRUG INEFFECTIVE","value":493},{"label":"SOMNOLENCE","value":112},{"label":"INSOMNIA","value":93},{"label":"OVERDOSE","value":86},{"label":"FEELING ABNORMAL","value":86}]}');

    $httpBackend.expect('GET', '/api/events/reactionOutComes?limit=5&q=ADVIL+PM&skip=0&typ=brand')
        .respond('{"results":[{"label":"Unknown","value":501},{"label":"Not recovered/not resolved","value":64},{"label":"Recovered/resolved","value":50},{"label":"Recovering/resolving","value":14},{"label":"Fatal","value":3},{"label":"Recovered/resolved with sequelae","value":2}]}');

    $httpBackend.expect('GET', '/api/recalls/countByDate?limit=5&q=ADVIL+PM&skip=0&typ=brand').respond('{}');
    $httpBackend.expect('GET', '/api/events/countByDate?limit=5&q=ADVIL+PM&skip=0&typ=brand').respond('{}');
    $httpBackend.expect('GET', '/api/events/countByAge?limit=5&q=ADVIL+PM&skip=0&typ=brand').respond('{}');
    $httpBackend.expect('GET', '/api/events/countByGender?limit=5&q=ADVIL+PM&skip=0&typ=brand').respond('{}');


    // This is the mock for the back end call
    $httpBackend.expect('GET', '/api/events?limit=5&q=ADVIL+PM&skip=0&typ=brand')
        .respond('{"response":{"count":1624,"skip":0,"limit":5,"events":[{"safetyreportid":"10009511","receivedate":"2014-03-12","serious":["This was a serious event.","This event has an unknown level of seriousness."],"patient":{"reaction":"Anaemia","age":66,"gender":"Female","drugSubstance":["SERTRALINE HYDROCHLORIDE"]}},{"safetyreportid":"10012533","receivedate":"2014-03-12","serious":["This was a non-serious event."],"patient":{"reaction":"Poor quality drug administered,Thyroid function test abnormal,Blood cholesterol abnormal,Blood glucose increased,Product packaging quantity issue","age":41,"gender":"Male","drugSubstance":["METFORMIN HYDROCHLORIDE"]}},{"safetyreportid":"10014673","receivedate":"2014-03-17","serious":["This was a non-serious event."],"patient":{"reaction":"Application site discolouration,Pruritus,Erythema,Drug effect decreased,Product packaging issue","gender":"Female","drugSubstance":["SOTALOL HYDROCHLORIDE"]}},{"safetyreportid":"10021409","receivedate":"2014-03-18","serious":["This was a serious event.","This event has an unknown level of seriousness."],"patient":{"reaction":"Drug ineffective,Vision blurred,Insomnia","age":55,"gender":"Male"}},{"safetyreportid":"10021517","receivedate":"2014-03-19","serious":["This was a non-serious event."],"patient":{"reaction":"Drug ineffective,Psychomotor hyperactivity,Limb discomfort","age":67,"gender":"Female"}}]}}');


  
    // Call the controller function and see if the returned recalls are in the correct format
    scope.updateEvents().then(function() {
       expect(scope.events.response.count).toEqual(1624);
       expect(scope.events.response.events[0].safetyreportid).toEqual("10009511");
       expect(scope.charts.events.reactions[0].label).toEqual("DRUG INEFFECTIVE");
       expect(scope.charts.events.outcomes[0].value).toEqual(501);
    });

    // Perform the async ajax call
    $httpBackend.flush();    
  }));
});

