/* ----------------------------------------------------------------------
>>> UTILITY FUNCTIONS
---------------------------------------------------------------------- */

var utils = {

/**
 * If the spreadsheet doesn't have the default locale, sets it
 * @param spreadsheet {Spreadsheet}
 */
  verifyLocale: function verifyLocale(spreadsheet){
    var locale = spreadsheet.getSpreadsheetLocale();
    if(locale != 'es_MX') spreadsheet.setSpreadsheetLocale('es_MX');
  }
  
/**
 * Trim values for safe match
 *
 * @param value {String}
 * @return {String}
 */
  ,safeTrim: function safeTrim(value){
    return (value) ? value.trim() : '';
  }
  
/**
 * Pad
 *
 * @param n {String}
 * @param width {Number}
 * @param z {String}
 * @return {String}
 */
  ,pad: function pad(n, width, z) {
    var z = z || '0';
    var n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

/**
 * Trim values for safe match
 *
 * @param value {String}
 * @return {String}
 */
  ,getInitials: function getInitials(names){
    var names = names.split(' ');
    var initials = '';
    for (var i = 0; i < names.length; i++) {
      initials += names[i].charAt(0).toUpperCase();
    }
    return initials;
  }
  
/**
 * Sorts Array of numbers in ascending or descending order
 */
  ,sortArrNum: function sortArrNum(arr, col, order){
   col = col || 0;
   arr.sort(sortFunc);
   function sortFunc(a, b){
     return (order) ? b[col] - a[col] : a[col] - b[col];
   }
   return arr;
  }
}



/**
* supplant() does variable substitution on the string. It scans through the string looking for 
* expressions enclosed in { } braces. If an expression is found, use it as a key on the object, 
* and if the key has a string value or number value, it is substituted for the bracket expression 
* and it repeats.
*
* Written by Douglas Crockford
* http://www.crockford.com/
*/
String.prototype.supplant = function (o) {
	return this.replace(
		/([^{}]*)/g, 
		function (a, b) {
			var r = o[b];
			return typeof r === 'string' || typeof r === 'number' ? r : a;
		}
	);
};
