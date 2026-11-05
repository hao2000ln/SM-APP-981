var JSON = system.library.JSON.json();
//-------------------- Utils functions ----------------------
/**
 * parse raw remoteJs request to arguments array
 * @param {String} argStr
 * @return {String[]}
 */
function parseArg(argStr){
  if (!argStr) return [];
  return argStr.split('^^^^^');
}

/**
 * Build a string by arguments
 * For example: formatString("name={0}, age={1}", "Falcon", 35) will return "name=Falcon, age=35"
 * @param {String} format
 * @return {String} formatted string
 */
function formatString(format) {
  var args = [];
  for (var i = 1; i < arguments.length; i++){
    args.push(arguments[i]);
  }
  var formatRe = /\{(\d+)\}/g;
  return format.replace(formatRe, function(m, i) {
    return args[i];
  });
}

/**
 * Parse a value to boolean.
 * Both "true" and 1 will be regarded as true
 * @param value
 * @return {boolean}
 */
function parseBoolean(value){
  return value === true || value === 'true' || value === 1;
}

/**
 * Parse a value as json string to object.
 * @param {string} value
 * @return {object}
 */
function parseJsonObj(value){
  return JSON.parse(value);
}

function parseDate(dateStr){
  var year = dateStr.substring(0,4);
  var month = dateStr.substring(5,7) - 1;
  var date = dateStr.substring(8,10);
  var hour = dateStr.substring(11,13);
  var minute = dateStr.substring(14,16);
  var second = dateStr.substring(17,19);
  return new Date(year, month, date, hour, minute, second);
}

function toDateString(date){
  if (!(date instanceof Date)){
    date = new Date(date);
  }
  var r = [];
  r.push(date.getFullYear() + "-");
  r.push(buildNumString(date.getMonth() + 1, 2) + "-");
  r.push(buildNumString(date.getDate(), 2) + " ");
  r.push(buildNumString(date.getHours(), 2) + ":");
  r.push(buildNumString(date.getMinutes(), 2) + ":");
  r.push(buildNumString(date.getSeconds(), 2) + "");
  return r.join('');
}

function buildNumString(number, p){
  var n = Math.pow(10, p) + number + "";
  return n.substring(n.length - p, n.length);
}

//--------------------- add for ide -------------------------
system.library.CalendarUtil = {
  parseArg: parseArg,
  formatString: formatString,
  parseBoolean: parseBoolean,
  parseJsonObj: parseJsonObj,
  parseDate: parseDate,
  toDateString: toDateString
};