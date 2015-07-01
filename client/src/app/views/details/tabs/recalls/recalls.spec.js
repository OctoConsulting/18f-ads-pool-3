/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */

describe( 'Detail Recalls - ', function() {
  beforeEach( module( 'app') );
  beforeEach( module( 'ngMockE2E') );
  
  // Global Vars
  var scope;
  var DetailsRecallsController;
  var detailsData = {"drug":{"brand_name":["ADVIL PM"],"purpose":["Purpose Pain reliever/fever reducer"],"generic_name":["IBUPROFEN"],"count":["2"]}};
  var stateparams;

  // Inject providers and initialize controller
  beforeEach( inject( function( $controller, _$location_, $rootScope,_$httpBackend_ ) {
      scope = $rootScope.$new();
      scope.currentPage = 1;
      scope.maxPerPage = 5;
      $httpBackend = _$httpBackend_;
      stateparams = { name: "ADVIL PM", typ : "brand"};
      DetailsRecallsController = $controller( 'DetailsRecallsController', { $scope: scope, $stateParams:stateparams, detailsData: detailsData, eventsData:{"response":{}}, recallsData:{"response":{}},referenceData:{"response":{}} });
   }));

  it( 'should return recalls details', inject( function() {

    // This is the mock for the back end call
    $httpBackend.expect('GET', '/api/recalls?limit=5&q=ADVIL+PM&skip=0&typ=brand')
        .respond('{"response":{"count":1,"skip":0,"limit":5,"recalls":[{"recall_number":"D-1166-2014","recall_initiation_date":"2014-02-26","reason_for_recall":"Subpotent Drug: This lot is being recalled because of out-of-specification test results for Diphenhydramine citrate.","distribution_pattern":"Nationwide","recalling_firm":"Pfizer Us Pharmaceutical Group","product_description":"Advil PM Caplets, (Ibuprofen, 200 mg /Diphenhydramine citrate, 38 mg) 120 count bottle, OTC, Pfizer, Madison, NJ 07940 USA. NDC 0573-0164-43","product_quantity":"70,704 bottles"}]}}');
  
    // Call the controller function and see if the returned recalls are in the correct format
    scope.updateRecalls().then(function() {
       expect(scope.recalls.response.count).toEqual(1);
       expect(scope.recalls.response.recalls[0].recall_number).toEqual("D-1166-2014");
    });

    // Perform the async ajax call
    $httpBackend.flush();    
  }));
});

