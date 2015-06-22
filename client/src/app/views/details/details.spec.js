/**
 * Tests sit right alongside the file they are testing, which is more intuitive
 * and portable than separating `src` and `test` directories. Additionally, the
 * build process will exclude all `.spec.js` files from the build
 * automatically.
 */

describe( 'Home', function() {
  beforeEach( module( 'app') );
  beforeEach( module( 'ngMockE2E') );
  
  // Global Vars
  var scope;
  var DetailsCtrl;
  var detailsData = {"drug":{"substance_name":["ACETAMINOPHEN"],"brand_name":["Infants TYLENOL"],"recalled":"Yes","purpose":["Purpose Pain reliever/fever reducer"],"generic_name":["ACETAMINOPHEN"],"manufacturer_name":["McNeil Consumer Healthcare Div. McNeil-PPC, Inc"],"product_type":["HUMAN OTC DRUG"],"route":["ORAL"],"package_label_principal_display_panel":["PRINCIPAL DISPLAY PANEL See New Dosage & Directions NDC 50580-191-01 Infants' TYLENOL® For Children Acetaminophen Oral Suspension Pain Reliever-Fever Reducer INFANTS NEW! Dosage & Directions Ibuprofen Free Alcohol Free Aspirin Free Use Only Enclosed Syringe SimpleMeasure™ See side panel for more information Grape FLAVOR 1 fl oz (30 ml) 160 mg per 5 ml PRINCIPAL DISPLAY PANEL"],"active_ingredient":["Active ingredient (in each 5 mL) Acetaminophen 160 mg"],"inactive_ingredient":["Inactive ingredients anhydrous citric acid, butylparaben, D&C red no. 33, FD&C blue no. 1, flavors, glycerin, high fructose corn syrup, microcrystalline cellulose and carboxymethylcellulose sodium, propylene glycol, purified water, sodium benzoate, sorbitol solution, sucralose, xanthan gum"],"overdosage":["Overdose warning In case of overdose, get medical help or contact a Poison Control Center right away. (1-800-222-1222) Quick medical attention is critical for adults as well as for children even if you do not notice any signs or symptoms."],"dosage_and_administration":["Directions this product does not contain directions or complete warnings for adult use. do not give more than directed (see overdose warning) shake well before using mL = milliliter find right dose on chart. If possible, use weight to dose; otherwise, use age. push air out of syringe. Insert syringe tip into bottle opening flip bottle upside down. Pull yellow part of syringe to correct dose dispense liquid slowly into child's mouth, toward inner cheek repeat dose every 4 hours while symptoms last do not give more than 5 times in 24 hours replace cap tightly to maintain child resistance Dosing Chart Weight (lb) Age (yr) Dose (mL)or as directed by a doctor under 24 under 2 years ask a doctor 24-35 2-3 years 5 mL Attention: use only enclosed syringe specifically designed for use with this product. Do not use any other dosing device."],"warnings":["Warnings Liver warning This product contains acetaminophen. Severe liver damage may occur if your child takes more than 5 doses in 24 hours, which is the maximum daily amount with other drugs containing acetaminophen Sore throat warning if sore throat is severe, persists for more than 2 days, is accompanied or followed by fever, headache, rash, nausea, or vomiting, consult a doctor promptly. Do not use with any other drug containing acetaminophen (prescription or nonprescription). If you are not sure whether a drug contains acetaminophen, ask a doctor or pharmacist. if your child is allergic to acetaminophen or any of the inactive ingredients in this product Ask a doctor before use if your child has liver disease Ask a doctor or pharmacist before use if your child is taking the blood thinning drug warfarin When using this product do not exceed recommended dose (see overdose warning) Stop use and ask a doctor if pain gets worse or lasts more than 5 days fever gets worse or lasts more than 3 days new symptoms occur redness or swelling is present These could be signs of a serious condition. Keep out of reach of children. Overdose warning In case of overdose, get medical help or contact a Poison Control Center right away. (1-800-222-1222) Quick medical attention is critical for adults as well as for children even if you do not notice any signs or symptoms."],"stop_use":["Stop use and ask a doctor if pain gets worse or lasts more than 5 days fever gets worse or lasts more than 3 days new symptoms occur redness or swelling is present These could be signs of a serious condition."],"keep_out_of_reach_of_children":["Keep out of reach of children."],"ask_doctor":["Ask a doctor before use if your child has liver disease"],"questions":["Questions or comments? call 1-877-895-3665 (toll-free) or 215-273-8755 (collect)"]}};

  // Inject providers and initialize controller
  beforeEach( inject( function( $controller, _$location_, $rootScope,_$httpBackend_ ) {
      scope = $rootScope.$new();
      $httpBackend = _$httpBackend_;
      DetailsCtrl = $controller( 'DetailsController', { $scope: scope, detailsData: detailsData });
   }));

  it( 'should return drug details', inject( function() {
   
    // Check if the details is in the correct format
     expect(scope.details.drug.substance_name[0]).toEqual("ACETAMINOPHEN"); 
   

  }));

   it( 'should not equal the drug name', inject( function() {
   
    // Check if the details is in the correct format
     expect(scope.details.drug.substance_name[0]).not.toEqual("ACETAMI"); 
   

  }));

});

