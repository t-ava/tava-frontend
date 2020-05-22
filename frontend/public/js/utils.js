/*
 * Util functions
 */

// arr : ["id", "name", "latitude", "longitude"]
const LAT = 2, LONG = 3;

// ref: https://m.blog.naver.com/javaking75/220342410214
function computeDistance(startCoords, destCoords) {
    var startLatRads = degreesToRadians(startCoords[LAT]);
    var startLongRads = degreesToRadians(startCoords[LONG]);
    var destLatRads = degreesToRadians(destCoords[LAT]);
    var destLongRads = degreesToRadians(destCoords[LONG]);

    var Radius = 6371; //지구의 반경(km)
    var distance = Math.acos(Math.sin(startLatRads) * Math.sin(destLatRads) +
                    Math.cos(startLatRads) * Math.cos(destLatRads) *
                    Math.cos(startLongRads - destLongRads)) * Radius;
    return distance;
}

function degreesToRadians(degrees) {
    radians = (degrees * Math.PI)/180;
    return radians;
}

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
            ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
    }

    // Return the parsed data.
    return( arrData );
}

// < Close the loading status and scroll to next page >
function closeSpinnerAndBody() {
  console.log("8. Close spinner/body1 (after scroll)");
  document.getElementById("spinner").style.display="none";
  document.getElementById("go").style.display="";
  document.getElementById("body1").style.display="none";
  document.getElementById("emptydiv").style.display="none";
}

function up() {
  if (document.getElementById("body2").style.display == "") {
    // go body2->body1
    document.getElementById("body1").style.display="";
    document.getElementById("emptydiv").style.display="";
    window.scrollTo(0,document.body.scrollHeight);
  } else if (document.getElementById("body1").style.display == "") {
    // go body1->body0
    document.getElementById("body0").style.display="";
    document.getElementById("emptydiv0").style.display="";
    window.scrollTo(0,document.body.scrollHeight);
  } else {
    // body0->body0
  }
}

function choose() {
  document.getElementById("body1").style.display="";
  document.getElementById("emptydiv0").style.display="";
}

function showbody2() {
  document.getElementById("emptydiv").style.display="";
  document.getElementById("body2").style.display="";
}

function updateBalance(userAddr) {
  getBalance(userAddr, "AVA").done(function(data){
      console.log(data);
      document.getElementById("balance").textContent = data["result"]["balance"];
    });
}

// Refresh
function refresh(userAddr) {
  getHistory(userAddr).done(function(msg) {
    console.log("history msg : ", msg);
    updateHistory(msg);
  });
  updateBalance(userAddr);
}

// Update mypage history
function updateHistory(data) {
  var historyDiv = document.getElementById("history");
  // Remove previous child
  while (historyDiv.firstChild) {
    historyDiv.removeChild(historyDiv.firstChild);
  }

  var N = data.length;
  var listnum = N;
  if (N > 7) {
    listnum = 7;
  }

  // Create & update new child
  for (var i = 0; i < listnum; i++) {
    var createList = document.createElement('li');
    historyDiv.appendChild(createList);

    var icon = '';
    var label = '';
    var type = data[i]["type"];
    var amount = data[i]["amount"];
    var time = data[i]["timestamp"];

    // Check log type and set icon
    if (type == "incentive") {
      icon = '<span uk-icon="plus-circle" style="margin-right:5px;"></span>';
      label = '<span class="uk-label" style="background-color:#ffd250;color:#000;font-size: 0.8rem;">보상 ' + amount +'</span>'
    } else if (type == "return") {
      icon = '<span uk-icon="minus-circle" style="margin-right:5px;"></span>';
      label = '<span class="uk-label" style="background-color:#0c7037;color:#fff;font-size: 0.8rem;">사용료 ' + amount +'</span>'
    } else if (type == "rent") {
      icon = '<span uk-icon="minus-circle" style="margin-right:5px;"></span>';
      label = '<span class="uk-label" style="background-color:#ff1500;color:#fff;font-size: 0.8rem;">대여료 ' + amount +'</span>'
    }

    // Print icon - amount - time
    createList.innerHTML= icon + label + " " + timeStampToTime(time);
  }
}

function queryInfos() {
  var weather = [];
  const weatherFileUrl = '../src/weather.csv' // provide file location
  var d = new Date();
  var datestring =
    (d.getFullYear()-1) + "-" + // use last year's data
    ("0"+(d.getMonth()+1)).slice(-2) + "-" +
    ("0" + d.getDate()).slice(-2) + " " +
    ("0" + d.getHours()).slice(-2) + ":" +
    ("00");

  fetch(weatherFileUrl)
   .then( _response => _response.text() )
   .then( _text => CSVToArray(_text) )
   .then( _array => {
    for (var i=0; i<_array.length; i++){
      if (_array[i][1] == datestring){
        console.log("weather matched to year 2018");
        weather = _array[i].slice(2,7);
      }
    }
    if (weather == []){
      console.log("weather set to default");
      weather = _array[1].slice(2,7);
    }
    infos = [d.getMonth()+1, Math.round(weather[0]), Math.round(weather[1]), Math.round(weather[2]), Math.round(weather[3]), Math.round(weather[4]), new Date(datestring).getDay()];
    console.log("infos", infos)
   });
}

function timeStampToTime(timestamp) {
  var date = new Date(parseInt(timestamp)*1000);
  var year = date.getFullYear();
  var month = ("0"+(date.getMonth()+1)).slice(-2);
  var day = ("0"+date.getDate()).slice(-2);
  var hours = date.getHours();
  var minutes = "0" + date.getMinutes();
  var seconds = "0" + date.getSeconds();
  result = year + "." + month + "." + day + " " + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
  return result;
}
