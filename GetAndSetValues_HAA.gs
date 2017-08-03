//****************************************************************************************************************
/* Properties User
- user
- proyect
- tableInfo
- valuesTable
- jefeFuncional
*/

//****************************************************************************************************************
// set User properties
function setUserPropertie(namePropertie, value) {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty(namePropertie, JSON.stringify(value));
}

// get User properties
function getUserPropertie(namePropertie) {
    //namePropertie = 'infoSolicitud';
    var usertProperties = PropertiesService.getUserProperties();
    return JSON.parse(usertProperties.getProperty(namePropertie));
}

// get all User properties
function allUserProperties() {
    var userProperties = PropertiesService.getUserProperties();
    var getInfo = userProperties.getProperties();
    Logger.log(getInfo);
}

//****************************************************************************************************************
// construye la function que se conecta con la spreadSheet
function conectSpread(spread,sheet,range) {
  var infoRange = new Object();
  infoRange = {
    id: {
      spreadUsers: "1NEqbgeFnB8aa28ESxY9p3je7IT1l_lKl0q_daX2MqCE",
      spreadProyectos : "1Z3T9kZYSqYuHT86sVAz-KYyZ-z9jOPTVDyiSXbu3aKA",
      //spreadTimeReport : "1ahbanVe4BAn4lavy1nqRDJizc0kq5vr1uu0CR4MmLOE",
      spreadComentarios : "1SlFYg1eqQFI0iFHGwEzfHHTOcZOEipKz4TU2ak2A-kE"
    },
        
    tab: {
      users : "Users",
      proyectos : "proyectos",
      p_user : "personal_proyecto",
      aync : "AyNC",
      ci : "CI",
      comentarios : "comentarios"
    }
  };
      
  var idSpread = infoRange.id[spread];
  var name  = infoRange.tab[sheet];
      
  var spreadsheet   = SpreadsheetApp.openById(idSpread);
  var sheet = spreadsheet.getSheetByName(name);
  var data  = sheet.getDataRange().getDisplayValues();

  // first: con enccabezado, 
  if(range == 'first'){
      return data;
  } else if(range == 'second'){
      data.shift();
      return data;
  } else if(range == 'none'){
      return sheet;
  }
};

//****************************************************************************************************************
// Busca el Id de las carpetas que hay en el site
// Los que tienen un numero como key es el id del proyecto.

function searchId(id) {
  var idFolder = new Object();
  idFolder = {
    'time_report': '0B9cDr6ElHC4ZTG1QSUV1akhrZFE',
    1: '0B9cDr6ElHC4ZLW8wRmRYajJMam8',
    2: '0B9cDr6ElHC4ZRFlPNjRFb180SFU',
    3: '0B9cDr6ElHC4Zek94VV9oMVNsNjQ',
    4: '0B9cDr6ElHC4ZRzh4NmoySi1EXzg',
    5: '0B9cDr6ElHC4ZMkY5VDhlMDlnd1k',
    6: '0B9cDr6ElHC4ZbUtNb25iUllFMW8',
    7: '0B9cDr6ElHC4ZNU8teXhKU0RyS0k',
    8: '0B9cDr6ElHC4ZY3NhY3VzUk1McTQ',
    9: '0B9cDr6ElHC4Zekt2ZGJ6T3RnNUU',
    'folderPlantilla': '0B9cDr6ElHC4ZRERtMVA2UXlXREk',
    'plantilla': '1fNe1dfSMYd0B9HHX2eg9MjWapOiFT4MWk3pvWM7FQRU' 
  };
  
  var setId = idFolder[id];
  return setId
}