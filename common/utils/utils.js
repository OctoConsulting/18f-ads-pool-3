module.exports = function getToString(str) {
    if(!str) return null;
    var lastChar = str.charCodeAt(str.length-1);

    var nextChar = String.fromCharCode(lastChar+1);
    var newString = str.slice(0,str.length-1) + nextChar;    
    
    return newString;
};


module.exports = function getSearchQuery(str) {
   var result = 'https://api.fda.gov/drug/label.json?search=openfda.brand_name:';
   var range = '[' + str + '+TO+' + getToString(str) + ']';
   result = result + range + '+OR+openfda.generic_name:' + range +'&limit=10';

   return result;
};