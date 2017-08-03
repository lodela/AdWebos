function open() {
    var infoUser = JSON.stringify(getInfUser());
    setUserPropertie('user', infoUser);
    
    //intersectionData();
}

function doGet() {
    return HtmlService
    .createTemplateFromFile('html_index_HAA')
    .evaluate();
}

function include(filename) {    
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

//****************************************************************************************************************
// Get HTML by filename
function getHtml(filename) {
  //return HtmlService.createHtmlOutputFromFile(filename).getContent();
  var InfoUser = getUserPropertie('user');
  var html = HtmlService.createTemplateFromFile(filename);
  html.info = {user: InfoUser};
  var content = html.evaluate().getContent();
  return content;
}

//****************************************************************************************************************
function getInfUser() {
    var correo = Session.getActiveUser().getEmail();
    var response = Plus.People.get('me');
    var urlImg = response.image.url;
    var info = {
        email: correo,
        img: urlImg
    };
    var user = conectSpread('spreadUsers','users','second');
    
    for(var i in user) {
        if(user[i][0] == correo) {
          info['name'] = user[i][1];
          info['equipo'] = user[i][3];
          info['usersTimeReport'] = user[i][4];
          break;
        }
    }
    return (info) ? info : null;
}

//****************************************************************************************************************
// Recupera los comentarios del index
function getComentarios() {
  var comentarios = conectSpread('spreadComentarios','comentarios','second');
  var data = '';
  
  for(var i in comentarios.reverse()) {
    var fecha = comentarios[i][0];
    var comentario = comentarios[i][1];
    
    data += '<div class="contPrincipal"><div class="cellDate"><span>'+fecha+'</span></div><div class="cellComent">'+comentario+'</div></div>';
  }
  
  return data;
}


//****************************************************************************************************************
// recupera todos los proyectos o uno en especifico
function getProyects(id) {
  var proyects = conectSpread('spreadProyectos','proyectos','second');
  var data ="";
  
  if(id == "" || id == null) {
    //Logger.log(proyects);
    for(var i in proyects) {
      data += "<div id='"+proyects[i][0]+"' class='col-md-3 col-centered contenedor'><div class='divContainer'><span class='spanText'>"+proyects[i][1]+"</span></div></div>"
    }
    return (data) ? data : null;
  } else {
    //Logger.log('es igual');
    for(var i in proyects) {
      if(proyects[i][0] == id) {
        return proyects[i];
      }
    }
  }
}

//****************************************************************************************************************
// Guarda el Id del proyecto y lo setea para redireccionar a la pagina.
function saveProyect(id) {
  var proyect = getProyects(id);
  setUserPropertie('proyect', proyect);
}

//****************************************************************************************************************
// Buscar archivos del Time Report

function searchFilesTime() {
  var folder = DriveApp.getFolderById(searchId('time_report')).getFiles();
  var htmlSelect = '';
  var saveId = {};
  var count = 1;
  
  while (folder.hasNext()) {
    var fileOut = folder.next();
    var changeName = change(fileOut.getName());
    htmlSelect += "<option value='"+count+"'>"+changeName+"</option>";
    saveId[count] = fileOut.getId();
    count++;
    //Logger.log(fileOut.getId());
  }
  
  setUserPropertie('idSpread', saveId);
  return htmlSelect;
}

function change(name) {
  var separar = name.split('_');
  var setText = 'Time Report del '+separar[0]+' de '+separar[2]+' al '+separar[1]+' de '+separar[2];
  //Logger.log(setText);
  
  return setText;
}

//****************************************************************************************************************
// Cambia el id publico de los files por el privado

function translateId(valueDocument,valueName) {
  valueDocument = 2;
  var ids = getUserPropertie('idSpread');
  
  if(valueName != 0 && valueName > 0) {
    //Logger.log(valueName);
    var getEmail = getUserPropertie('jefeFuncional');
    //Logger.log(getEmail[0]);
    valueName = getEmail[valueName].email;
    //Logger.log(valueName);
  }
  var data = intersectionData(ids[valueDocument],valueName);
  return data;
}

// Cruce de datos entre permisos y AyNC
function  intersectionData(idFile, valueName) {
  var user = JSON.parse(getUserPropertie('user'));
  var infoUser = conectSpread('spreadUsers','aync','second');
  var proyects = conectSpread('spreadProyectos','proyectos','second');
  
  var spreadsheet   = SpreadsheetApp.openById(idFile);
  var sheet = spreadsheet.getSheetByName('ci');
  var timeReport  = sheet.getDataRange().getDisplayValues();
  timeReport.shift();
  
  var data = [];
  var outEmail;

  if(valueName == null || valueName == '') {
    outEmail = user.email;
  } else {
    outEmail = valueName;
  }
  
  for(var i in infoUser) {
    var sheetMail = infoUser[i][1];
    if(sheetMail.toLowerCase() == outEmail) {
      var sheetName = infoUser[i][3];
      
      for(var j in infoUser) {
        var jefe = infoUser[j][21];
        if(jefe == sheetName) {
          var codeM = buscaTime(timeReport,infoUser[j][2]);
          var tempData = {'mail': infoUser[j][1], 'name': infoUser[j][3], 'xm': infoUser[j][2], 'proyecto': infoUser[j][18], 'cumplimiento': codeM};
          data.push(tempData);
        }
      }
      
      break;
    }
  }
  //Logger.log(data);
  setUserPropertie('valuesTable', data);
  return data;
}

function buscaTime(timeReport,codeM) {
  for(var i in timeReport) {
   if(timeReport[i][0] == codeM) {
     //Logger.log(timeReport[i][19]);
     return timeReport[i][19];
   }
  }
  return '-';
}

//****************************************************************************************************************
// Busca los archivos por carpte

function proyectFiles() {
  var proyectView = getUserPropertie('proyect');
  var folder = DriveApp.getFolderById(searchId(proyectView[0])).getFiles();
  var data = '';
  
  //Logger.log(proyectView[0]);
  
  while (folder.hasNext()) {
    var fileOut = folder.next();
    var name = fileOut.getName();
    var create = personalDate(fileOut.getDateCreated());
    var www = fileOut.getUrl();
    
    data += '<div class="col-md-4 paddContainer"><div class="newsFiles"><p class="paTitle">'+name+'</p><p><span>Creado el: </span><span class="spanDate">'+create+'</span></p><p><a href="'+www+'" target="_blank" class="paHref">Vista Previa</a></p></div></div>';
  }
  
  //Logger.log(data);
  return data;
}

// Formato personal de fecha
function personalDate(date) {
  var meses =['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  var fecha = new Date(date);
  var dia = fecha.getDate();
  var mes = meses[fecha.getMonth()];
  var anio = fecha.getFullYear();
  
  var personal = dia+'-'+mes+'-'+anio;
  //Logger.log(personal);
  return personal;
}

//****************************************************************************************************************
// Busca los nombres y codigos M de los jefes funcionales y los guarda en user properties.
function setJefeFuncional() {
  var infoUser = conectSpread('spreadUsers','aync','second');
  var saveJefe = {};
  var codigo = '';
  var count = 0;
  
  for(var i in infoUser) {
    var jefeFunional = infoUser[i][21];
    var nombre = infoUser[i][3];
    var codigoM = infoUser[i][2];
    var coincidencias = 0;
    
    for(var j in saveJefe) {
      if(saveJefe[j].nombre == jefeFunional) {
        coincidencias++;
      }
    }
    
    if(coincidencias <= 0) {
      count++;
      for(var k in infoUser) {
        if(jefeFunional == infoUser[k][3]) {
          saveJefe[count] = {email:infoUser[k][1], codigoM:infoUser[k][2], nombre:jefeFunional}
          break;
        }
      }  
      codigo += "<option value='"+count+"'>"+jefeFunional+"</option>";
    }
  }
  setUserPropertie('jefeFuncional', saveJefe);
  //Logger.log(saveJefe);
  return codigo;
}

//****************************************************************************************************************
// Crea el archivo y coloca los valores en el sheet
function download(nameFile,nameJefe) {
  deleteDownloadedFiles();
  var nombreOut = '';
  if(nameJefe == null || nameJefe == '') {
      nombreOut = nameFile;
  } else {
    nombreOut = nameJefe+'__'+nameFile;
  }
  
  var file = DriveApp.getFileById(searchId('plantilla'));
  var outFile = file.makeCopy(nombreOut).getId();
  var ss = SpreadsheetApp.openById(outFile);
  var sheet = ss.getSheets()[0];
  var data = getUserPropertie('valuesTable');

  for(var i in data){
    var divData = data[i];
    var setValue = [divData.mail, divData.name, divData.xm, divData.proyecto, divData.cumplimiento];
    sheet.appendRow(setValue);
  }
  //Logger.log(outFile);
  var urlFile = "https://docs.google.com/spreadsheets/u/0/d/"+outFile+"/export";
  return urlFile;
}

//****************************************************************************************************************
// Borra los archivos creados de la carpeta Plantilla
function deleteDownloadedFiles() {
  var filePlantilla = searchId('plantilla');

  var folder = DriveApp.getFolderById(searchId('folderPlantilla')).getFiles();

  while(folder.hasNext()){
    var eachFile = folder.next();
    var id2Dlt   = eachFile.getId();
    if(id2Dlt != filePlantilla) {
      Drive.Files.remove(id2Dlt);
    }
  }
}

//****************************************************************************************************************
function prueba() {
  var proyecto = getUserPropertie('proyect');
  Logger.log(proyecto[5]);
  var pro = new RegExp(proyecto[5]);
  var proyectUser = conectSpread('spreadUsers','aync','second');
  var data = [];
  
  for(var i in proyectUser) {
    var searchProyect = proyectUser[i][18];
    var result = pro.test(searchProyect);
    if(result) {
      var temp = proyectUser[i];
        data.push({estado:temp[0],correo:temp[1],usuario: temp[2],
                   nombre: temp[3],tio_empleado: temp[7],perfil: temp[8],
                   empresa: temp[9],horario: temp[12],piso: temp[13],
                   lugar: temp[14],cel: temp[15],ext: temp[16],
                   tipo_contrato: temp[17],proyecto: temp[18],
                   nombre_proyecto: temp[19],vigencia: temp[20]});
    }
  }
  //Logger.log(data);
  return data;
}



