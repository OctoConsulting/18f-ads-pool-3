/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */
describe( 'Home', function() {
  beforeEach( module( 'app' ) );

  beforeEach( inject( function( $controller, _$location_, $rootScope ) {
      $location = _$location_;
      $scope = $rootScope.$new();
      HomeCtrl = $controller( 'HomeController', { $location: $location, $scope: $scope });
   }));

  afterEach(inject(function($httpBackend, $rootScope) {
    // Force all of the http requests to respond.
    $httpBackend.flush();
 
    // Force all of the promises to resolve.
    // VERY IMPORTANT: If we do not resolve promises, none of the dependent
    // expectations will be called, and the spec may pass inadvertantly.
    $rootScope.$digest();
 
    // Check that we don't have anything else hanging.
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  }));

  it( 'should return drug names', inject( function() {
    // This will fail the spec if this http request does not happen.
    $httpBackend.expect('GET', baseUrl + '/api/drugs/suggestions?q=Tyl')
        .respond({response: {"id":"0027e3a2-862a-474d-8c33-dda1a2264b27","name":"Infants TYLENOL","indicator":"brand"});
 
    HomeCtrl.create(article).then(function(data) {
      expect(data.id).toBeGreatherThan(0);
      expect(data.title).toEqual(article.title);
    });
  }));
});

