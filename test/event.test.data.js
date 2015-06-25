module.exports = {
	dataset1: {
	  meta: {
	    results: {
	      skip: 10,
	      limit: 20,
	      total: 300
	    }
	  },
	  results: [
	  	{
	  		safetyreportid : '4322505-4',
	  		receivedate : '20150625',
	  		serious : '1',
	  		seriousnessdisabling : '1',
	  		seriousnessother : '1',
	  		seriousnesshospitalization : '1',
	  		seriousnesscongenitalanomali : '1',
	  		seriousnessdeath : '1',
			seriousnesslifethreatening : '1',
			patient: {
		  	 patientonsetage: '56',
		  	 reaction: [
		          {
		            reactionmeddrapt: 'ARTHRALGIA'
		          },
		          {
		            reactionmeddrapt: 'OEDEMA PERIPHERAL'
		          },
		          {
		            reactionmeddrapt: 'PURPURA'
		          }
		        ],
		     patientsex : '1',
		     drug: [
			     {
			     	 openfda: {
			     	 	 substance_name: [
			                'CEFTRIAXONE SODIUM'
			              ]
			     	 }
			     }
		 	  ]

		  	}
	  	}
	  ]
	},
	dataset2: {
	  meta: {
	    results: {
	      skip: 10,
	      limit: 20,
	      total: 300
	    }
	  },
	  results: [
	  	{
	  		safetyreportid : '4322505-4',
	  		receivedate : '20150625',
	  		serious : '1',
	  		seriousnessdisabling : '1',
	  		seriousnessother : '1',
	  		seriousnesshospitalization : '1',
	  		seriousnesscongenitalanomali : '1',
	  		seriousnessdeath : '1',
			seriousnesslifethreatening : '1',
			patient: {
		  	 patientonsetage: '56',
		  	 reaction: [
		          {
		            reactionmeddrapt: 'ARTHRALGIA'
		          },
		          {
		            reactionmeddrapt: 'OEDEMA PERIPHERAL'
		          },
		          {
		            reactionmeddrapt: 'PURPURA'
		          }
		        ],
		     patientsex : '1',
		     drug: [
			     {
			     	 openfda: {
			     	 	 substance_name: [
			                'CEFTRIAXONE SODIUM'
			              ]
			     	 }
			     }
		 	  ]

		  	}
	  	},
	  	{
	  		safetyreportid : '4322505-3',
	  		receivedate : '20150811',
	  		serious : '2',
	  		seriousnessdisabling : '1',
	  		seriousnessother : '1',
	  		seriousnesshospitalization : '1',
	  		seriousnesscongenitalanomali : '1',
	  		seriousnessdeath : '1',
			seriousnesslifethreatening : '1',
			patient: {
		  	 patientonsetage: '60.037',
		  	 reaction: [
		          {
		            reactionmeddrapt: 'ARTHRALGIA'
		          },
		          {
		            reactionmeddrapt: 'OEDEMA PERIPHERAL'
		          },
		          {
		            reactionmeddrapt: 'PURPURA'
		          }
		        ],
		     patientsex : '2',
		     drug: [
			     {
			     	 openfda: {
			     	 	 substance_name: [
			                'CEFTRIAXONE SODIUM'
			              ]
			     	 }
			     }
		 	  ]

		  	}
	  	}
	  ]
	}
};