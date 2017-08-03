/* ----------------------------------------------------------------------
>>> MAIN SERVICE
---------------------------------------------------------------------- */

// Centralize access to all methods
function service(namespace , method) {
  return this[namespace][method].apply(this,Array.prototype.slice.call(arguments,2));
}

/* ----------------------------------------------------------------------
>>> COMPONENT SERVICE
---------------------------------------------------------------------- */

var components = (function (){

  // Get a component by name and evaluate with active user
  function getComponent(name){
    var component = {};
    var template = getTemplate(name);
    // Get the active user from the users service
    template.activeUser = users.getActiveUser();
    var html = template.evaluate().getContent();
    component.name = name
    component.html = html
    return component;
  }
  
  // Get template by name
  function getTemplate(name){
    var template = HtmlService.createTemplateFromFile('html_'+name);
    return template;
  }
  
  // Get HTML by filename
  function getHtml(filename){
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
  }
  
  // Public pointers
  return {
    getComponent: getComponent,
    getTemplate: getTemplate,
    getHtml: getHtml
  }
})();

/* ----------------------------------------------------------------------
>>> SCRIPT PROPERTIES SERVICE
---------------------------------------------------------------------- */
var scriptProperties = (function (){
  
  // Gets a property store
  var properties = PropertiesService.getScriptProperties();
  
  // Gets a copy of all key-value pairs in the current Properties store
  function getProperty(key){
    return properties.getProperty(key);
  }
  
  // Public pointers
  return {
    getProperty: getProperty
  }
})();

/* ----------------------------------------------------------------------
>>> USER SERVICE
---------------------------------------------------------------------- */
var users = (function (){
  
  // Get email address of the person running the script
  var activeUserEmail = Session.getActiveUser().getEmail();
  
  // Spreadsheet values
  var SPREADSHEET_USERS = {
    PROPERTY: 'SS_USERS',
    TAB:  'USERS',
    RANGE : {
      ROW: 1,
      COLUMN: 1,
      NUM_COLUMNS: 3
    },
    COLUMNS: {
      EMAIL: 0,
      FULL_NAME: 1,
      PROFILE: 2
    }
  }

  // Profiles catalog
  var PROFILES = {
    "1" : "Administrador",
    "2" : "Administrador DyD",
    "3" : "DyD",
    "4" : "Ver DyD'",
    "5" : "Administrador ANS",
    "6" : "ANS",
    "7" : "Ver ANS"
   }

  // Get active user 
  function getActiveUser(){
    return getUserByEmail_(activeUserEmail);
  }
  
  function  getUserByEmail_(email){
    
    var user = {};
    var values = _getUsersRawValues();
    
    for (var i = 0; i < values.length; i++) {
      if(email.toUpperCase() == values[i][SPREADSHEET_USERS.COLUMNS.EMAIL].toUpperCase()){
        user.email = values[i][SPREADSHEET_USERS.COLUMNS.EMAIL];
        user.full_name = values[i][SPREADSHEET_USERS.COLUMNS.FULL_NAME];
        user.profile = values[i][SPREADSHEET_USERS.COLUMNS.PROFILE];
        user.profile_name = PROFILES[values[i][SPREADSHEET_USERS.COLUMNS.PROFILE]];
      }
    }
    return user;
  }
  
  // Return the name of the user by email
  function getUserNameByEmail(email){
    var values = _getUsersRawValues();
    
    for (var i = 0; i < values.length; i++) {
      if(email.toUpperCase() == values[i][SPREADSHEET_USERS.COLUMNS.EMAIL].toUpperCase()){
        return values[i][SPREADSHEET_USERS.COLUMNS.FULL_NAME];
      }
    }
    
  }
  
  // Get values of User's Spreadsheet
  function _getUsersRawValues(){
    
    // Get fileId from Script Properties
    var fileId = scriptProperties.getProperty(SPREADSHEET_USERS.PROPERTY);
    var spreadsheet = SpreadsheetApp.openById(fileId);
    var sheet = spreadsheet.getSheetByName(SPREADSHEET_USERS.TAB);
    var range = sheet.getRange(SPREADSHEET_USERS.RANGE.ROW,SPREADSHEET_USERS.RANGE.COLUMN,sheet.getLastRow(),SPREADSHEET_USERS.RANGE.NUM_COLUMNS);
    var values = range.getDisplayValues();
    
    return values;
  }
  
  // Public pointers
  return {
    getActiveUser: getActiveUser,
    getUserNameByEmail: getUserNameByEmail
  }
})();



/* ----------------------------------------------------------------------
>>> REQUESTS SERVICE
---------------------------------------------------------------------- */
var requests = (function (){
  
  // Always return the response object
  var response = {};
  
  // Spreadsheet values
  var SPREADSHEET_REQUESTS = {
    PROPERTY: 'SS_REQUESTS',
    TAB:  'REQUESTS',
    RANGE : {
      ROW: 2,
      COLUMN: 1,
      NUM_COLUMNS: 17
    },
    COLUMNS: {
      REQUEST_ID: 0,
      REQUEST_NAME: 1,
      RESPONSIBLE_DYD: 2,
      RESPONSIBLE_ANS: 3,
      DATE_REQUIRED: 4,
      STATUS: 5,
      DESCRIPTION: 6,
      APPROVAL_REQUIREMENTS: 7,
      COMPONENTS: 8,
      DEVELOPMENT_ENVIRONMENT: 9,
      REQUESTED_BY: 10,
      APPLICATION_DATE: 11,
      RECEIVED_BY: 12,
      RECEPTION_DATE: 13,
      AGREEMENTS: 14,
      REJECTION: 15
    }
  }
 
    var SPREADSHEET_HOST = {
    PROPERTY: 'SS_REQUESTS',
    TAB:  'HOST',
    RANGE : {
      ROW: 2,
      COLUMN: 1,
      NUM_COLUMNS: 17
    },
    COLUMNS: {
      REQUEST_ID: 0,
      REQUEST_NAME: 1,
      RESPONSIBLE_DYD: 2,
      RESPONSIBLE_ANS: 3,
      DATE_REQUIRED: 4,
      STATUS: 5,
      DESCRIPTION: 6,
      APPROVAL_REQUIREMENTS: 7,
      COMPONENTS: 8,
      DEVELOPMENT_ENVIRONMENT: 9,
      REQUESTED_BY: 10,
      APPLICATION_DATE: 11,
      RECEIVED_BY: 12,
      RECEPTION_DATE: 13,
      AGREEMENTS: 14,
      REJECTION: 15
    }
  }
  
  function getRequests(){
    try{
      
      var values = _getRequestsRawValues();
      var items = [];
      
      for (var i = 0; i < values.length; i++) {
        items.push([values[i][SPREADSHEET_REQUESTS.COLUMNS.REQUEST_ID],
                    values[i][SPREADSHEET_REQUESTS.COLUMNS.REQUEST_NAME],
                    users.getUserNameByEmail(values[i][SPREADSHEET_REQUESTS.COLUMNS.RESPONSIBLE_DYD]),
                    users.getUserNameByEmail(values[i][SPREADSHEET_REQUESTS.COLUMNS.RESPONSIBLE_ANS]),
                    values[i][SPREADSHEET_REQUESTS.COLUMNS.DATE_REQUIRED],
                    values[i][SPREADSHEET_REQUESTS.COLUMNS.STATUS]]);
      }

      response.data = {"items": items}
      return response;
    } catch (e) {
      response.error = {"message": e.message}
    }
  }
  
  // Get values of Requests Spreadsheet
  function _getRequestsRawValues(){
    
    // Get fileId from Script Properties
    var fileId = scriptProperties.getProperty(SPREADSHEET_REQUESTS.PROPERTY);
    var spreadsheet = SpreadsheetApp.openById(fileId);
    var sheet = spreadsheet.getSheetByName(SPREADSHEET_REQUESTS.TAB);
    var range = sheet.getRange(SPREADSHEET_REQUESTS.RANGE.ROW,SPREADSHEET_REQUESTS.RANGE.COLUMN,sheet.getLastRow() -1,SPREADSHEET_REQUESTS.RANGE.NUM_COLUMNS);
    var values = range.getDisplayValues();
    
    return values;
  }
  
  // Public pointers
  return {
    getRequests: getRequests
  }
})();