/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe( 'Home', function() {
  beforeEach( module( 'app') );
  beforeEach( module( 'ngMockE2E') );
  var scope;

  var HomeCtrl;
  beforeEach( inject( function( $controller, _$location_, $rootScope,_$httpBackend_ ) {
      $location = _$location_;
      scope = $rootScope.$new();
      $scope = scope;
      $httpBackend = _$httpBackend_;
      HomeCtrl = $controller( 'HomeController', { $location: $location, $scope: $scope });
   }));

 /* afterEach(inject(function(_$httpBackend_, $rootScope) {
    // Force all of the http requests to respond.
    $httpBackend = _$httpBackend_;
    $httpBackend.flush();
 
    // Force all of the promises to resolve.
    // VERY IMPORTANT: If we do not resolve promises, none of the dependent
    // expectations will be called, and the spec may pass inadvertantly.
    $rootScope.$digest();
 
    // Check that we don't have anything else hanging.
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  })); */

  it( 'should return drug names', inject( function() {
    // This will fail the spec if this http request does not happen.
    $httpBackend.expect('GET', '/api/drugs/suggestions?q=Tyl')
        .respond({response: {"id":"0027e3a2-862a-474d-8c33-dda1a2264b27","name":"Infants TYLENOL","indicator":"brand"}});
 
    scope.getSuggestions('Tyl').then(function(data) {
      $httpBackend.flush();	
      expect(data.id).toEqual("0027e3a2-862a-474d-8c33-dda1a2264b27");
      expect(data.name).toEqual("Infants TYLENOL"); 
    });
  }));

  it( 'should not match the id and name for given drug characters', inject( function() {
    // This will fail the spec if this http request does not happen.
    $httpBackend.expect('GET', '/api/drugs/suggestions?q=Tyl')
        .respond({response: {"id":"0027e3a2-862a-474d-8c33-dda1a2264b27","name":"Infants TYLENOL","indicator":"brand"}});
 
    scope.getSuggestions('Tyl').then(function(data) {
      $httpBackend.flush();	
      expect(data.id).not.toEqual("0027e3a2-862a-474d-8c33-dda1a2264b27");
      expect(data.name).not.toEqual("Infants TYLENOL");  
    });
  }));

});

