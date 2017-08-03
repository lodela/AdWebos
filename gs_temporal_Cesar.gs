function getVal() {
    var dataOut = {};
    var spreadsheet   = SpreadsheetApp.openById('1U64gpVtA1nBfk4jc4Dwmmkd8y-BRSWUg5haEBT4GhQ0');
    var tabSheet = ['Trazabilidad','Proyecto','Reportes','Reportes - Catalogo'];
    
    for(var i in tabSheet) {
        var sheet = spreadsheet.getSheetByName(tabSheet[i]);
        var data  = sheet.getDataRange().getDisplayValues();
        data.shift();
        dataOut[tabSheet[i]] = data;
    }

    return dataOut;
}

function donutChart() {
    var data = getVal();
    var keys = Object.keys(data);
    
    for(var i in keys) {
        Logger.log(data[keys[i]]);
        Logger.log(' ');
    }
}