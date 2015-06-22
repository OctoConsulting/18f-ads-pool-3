var toString = module.exports.getToString = function (str) {
    if(!str) return null;
    var lastChar = str.charCodeAt(str.length-1);

    var nextChar = String.fromCharCode(lastChar+1);
    var newString = str.slice(0,str.length-1) + nextChar;    
    
    return newString;
};


module.exports.getSearchQuery = function (str) {
   var result = 'https://api.fda.gov/drug/label.json?api_key=yiv5ZoikJg3kSSZ5edvsiqnJa9yvHoxrm6EWT8yi&search=openfda.brand_name:';
   var range = '[' + str + '+TO+' + toString(str) + ']';
   result = result + range + '+OR+openfda.generic_name:' + range +'&limit=25';

   return result;
};