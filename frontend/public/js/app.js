/*
 * REOA Addresses for test
 */
var userAddr = '0x408306bca6f0b15da485d8009cb0e12dfe0ef28c';
var ownerAddr = '0x128a8b8c9507aec53d949c53d5be57c4d98f9256';
var contractAddr = '0xaa7De5581188449339058e5908fC0B06e61db3f9';
var version = '3';

/*
 * Query weather & date infos
 */
var infos = [];
queryInfos();

/*
 * Read station data
 * Retrieved from http://jsfiddle.net/e6220t92/2/
 */
var mymap = L.map('mapid');
const fileUrl = '../src/citibike_stations.csv' // provide file location
fetch(fileUrl)
   .then( r => r.text() )
   .then( t => CSVToArray(t) )
   .then( arr => autocomplete(arr) )

/*
 * Start autocomplete logic
 * Add Go() button event listener here
 */
function autocomplete(arr) {
  var input = document.getElementsByClassName("autocomplete-input")
  var optionsVal = document.getElementsByClassName("autocomplete-list")

  input[0].addEventListener('keyup', function(){
      show(0);
  });
  optionsVal[0].onclick = function () {
      setVal(this, 0);
  };

  input[1].addEventListener('keyup', function(){
      show(1);
  });
  optionsVal[1].onclick = function () {
      setVal(this, 1);
  };

  //Use this function to replace potential characters that could break the regex
  RegExp.escape = function (s) {
      return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  //shows the list
  function show(idx) {
      var dropdown = document.getElementsByClassName("autocomplete-dropdown")[idx]
      dropdown.style.display = 'none';

      optionsVal[idx].options.length = 1;

      if (input[idx].value) {
          dropdown.style.display = '';
          optionsVal[idx].size = 3;
          var textCountry = input[idx].value;

          for (var i = 1; i < arr.length; i++) {
              //var testableRegExp = new RegExp(RegExp.escape(textCountry), "i");
              if (arr[i][3].match(textCountry)) {
                  addValue(arr[i][3], arr[i][3], idx);
              }
          }
      }

      var x, i, j, selElmnt, a, b, c;
      /* Look for any elements with the class "custom-select": */
      x = document.getElementsByClassName("custom-select");
        while (x[idx].childElementCount > 1) {
          x[idx].removeChild(x[idx].lastChild);
        }
        selElmnt = x[idx].getElementsByTagName("select")[0];
        /* For each element, create a new DIV that will act as the selected item: */
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        //a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[idx].appendChild(a);
        /* For each element, create a new DIV that will contain the option list: */
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items");
        for (j = 1; j < selElmnt.length; j++) {
          /* For each option in the original select element,
          create a new DIV that will act as an option item: */
          c = document.createElement("DIV");
          c.innerHTML = selElmnt.options[j].innerHTML;
          c.addEventListener("click", function(e) {
              /* When an item is clicked, update the original select box,
              and the selected item: */
              var y, i, k, s, h;
              s = this.parentNode.parentNode.getElementsByTagName("select")[0];
              h = this.parentNode.previousSibling;
              for (var i = 0; i < s.length; i++) {
                if (s.options[i].innerHTML == this.innerHTML) {
                  s.selectedIndex = i;
                  h.innerHTML = this.innerHTML;
                  y = this.parentNode.getElementsByClassName("same-as-selected");
                  for (k = 0; k < y.length; k++) {
                    y[k].removeAttribute("class");
                  }
                  this.setAttribute("class", "same-as-selected");
                  break;
                }
              }
              h.click();
          });
          b.appendChild(c);
        }
        x[idx].appendChild(b);
        a.addEventListener("click", function(e) {
          /* When the select box is clicked, close any other select boxes,
          and open/close the current select box: */
          e.stopPropagation();
          closeAllSelect(this);
          this.nextSibling.classList.toggle("select-hide");
          this.classList.toggle("select-arrow-active");
          input[idx].value = this.innerHTML;
        });

      function closeAllSelect(elmnt) {
        /* A function that will close all select boxes in the document,
        except the current select box: */
        var x, y, i, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        for (i = 0; i < y.length; i++) {
          if (elmnt == y[i]) {
            arrNo.push(i)
          } else {
            y[i].classList.remove("select-arrow-active");
          }
        }
        for (i = 0; i < x.length; i++) {
          if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
          }
        }
      }

      // Set height
      var options = b.children;
      if (options.length > 0)
      {
         var defaultSize = 40;
         if (options.length < 5) {
            defaultSize *= options.length;
         } else {
            defaultSize *= 5;
         }
         b.style.height = defaultSize + "px";
      }

      /* If the user clicks anywhere outside the select box,
      then close all select boxes: */
      document.addEventListener("click", closeAllSelect);
  }

  function addValue(text, val, idx) {
      var createOptions = document.createElement('option');
      optionsVal[idx].appendChild(createOptions);
      createOptions.text = text;
      createOptions.value = val;
  }

  //Settin the value in the box by firing the click event
  function setVal(selectedVal, idx) {
      input[idx].value = selectedVal.value;
      document.getElementsByClassName("autocomplete-dropdown")[idx].style.display = 'none';
  }


  /*
   * Logo & Go() button event listener
   * Send & Receive transactions here
   */

   // after choice
   UIkit.util.on('#choice', 'scrolled', function () {
     document.getElementById("body0").style.display="none";
     document.getElementById("emptydiv0").style.display="none";
   });

   // after logo
   UIkit.util.on('#logo', 'scrolled', function () {
     if (document.getElementById("body2").style.display == "") {
       // go body2->body1
       document.getElementById("body2").style.display="none";
       document.getElementById("emptydiv").style.display="none";
     } else if (document.getElementById("body1").style.display == "") {
       // go body1->body0
       document.getElementById("body1").style.display="none";
       document.getElementById("emptydiv0").style.display="none";
     } else {
       // body0->body0
     }
   });

   // before go
   UIkit.util.on('#go', 'beforescroll', function () {
     console.log("1. Click go button");
     try {
       getTargets(getArrivalTime);
     }
     catch (error) {
       UIkit.notification({message: 'Please check your station name.', status: 'danger', pos: 'bottom-center'});
       event.preventDefault();
       document.getElementById("body2").style.display="none";
       document.getElementById("emptydiv").style.display="none";
     }
   });

   // after go
   UIkit.util.on('#go', 'scrolled', function () {
     closeSpinnerAndBody();
   });

   // rent button listener
   document.getElementById("rent").addEventListener("click", function(e) {
     rentbutton = this;
     rentbutton.innerHTML = '<div id="spinner" uk-spinner></div>';
     approve(userAddr, 100000000000000, contractAddr).done(function(msg){
       console.log(msg);
       setTimeout(function() {
         allowance(userAddr, userAddr, contractAddr).done(function(msg){
           console.log(msg);
           rentBike(userAddr, departure[2], Math.round((new Date()).getTime()/1000));
           rentbutton.innerHTML = "Pay";
         });
       }, 3000);
     });
   });

   // return button listener
   document.getElementById("return").addEventListener("click", function(e) {
     rentTime(userAddr, userAddr).done(function(msg){
       // No rent
       if (msg.data.res[0] == 0) {
         alert("No rental history!")
       } else {
         // rent => return
         var returnTime = Math.round((new Date()).getTime()/1000);
         var returnStation = prompt("Please input the arrival station id", "");
         console.log(returnStation);
         returnBike(userAddr, returnStation, returnTime).done(function(msg){
	   // [TODO] AVA 에서 미구현
           //requestIncentive(userAddr, returnTime, returnStation, 0, infos);
         });
         alert("Return to #" + returnStation + " station.");
         refresh();
       }
     })
   });

   // refresh button listener
   document.getElementById("refresh").addEventListener("click", function(e) {
     refresh();
   });

  // < Get departure & arrival & targets >
  var departure, arrival, targets;

  function getTargets(callback) {
    console.log("2. Get targets (top 10 closest stations)");
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][3] == input[0].value) {
            departure = arr[i];
        }
        if (arr[i][3] == input[1].value) {
            arrival = arr[i];
            targets = getCloseStations(i, 10) // Get top 10 close stations from here
        }
    }
    callback(openSpinner);
  }

  // < Make all txs from departure to targets >
  // Get time (departure <-> targets)
  function getArrivalTime(callback) {
    console.log("3. Get target station id & travel time (hr)");
    var targetIDs = [];
    var travelTimes = [];
    for (var i = 0; i < targets.length; i++) {
      targetIDs.push(targets[i][2]);
      travelTimes.push(getTravelTimeHour(departure, targets[i]));
    }
    console.log(targetIDs, travelTimes);
    callback(targetIDs, travelTimes, sendPredictTx);
  }

  // < Open loading status >
  function openSpinner(targetIDs, travelTimes, callback) {
    console.log("4. Open spinner (loading status)");
    document.getElementById("spinner").style.display="";
    document.getElementById("go").style.display="none";
    callback(targetIDs, travelTimes, getPredictResult);
  }

  // Send expected arrival time & target id by Tx
  function sendPredictTx(targetIDs, travelTimes, callback) {
    console.log("5. Send predict tx with timestamp [todo]");
    var reqTime = Math.round((new Date()).getTime()/1000);
    // [TODO] AVA 미구현이므로 result 대충 다 1로 푸시하고 renderMap 해보기
    for (var i = 0; i < targets.length; i++) {
      targets[i].push(1);
    }
    renderMap();
    console.log("targets:", targets)
    //requestPredict(userAddr, reqTime, targetIDs, travelTimes, infos, callback);
  }

  // < Get reply tx and update map>
  // Get (target station id, incentive)
  function getPredictResult(data, callback) {
    console.log("6. Get predict result");
    for (var i = 0; i < targets.length; i++) {
      targets[i].push(data.data.res[2][i]);
    }
    // 이 콜백이 updateMap() 임
    callback();
  }

  var firstMarker;
  var markersLayer = new L.LayerGroup();

  // Update map
  function updateMap() {

    mymap.spin(false);
    // 마커 추가
    for (var i=0;i<targets.length;i++) {
      var marker = L.marker(targets[i].slice(6,8));
      marker.bindPopup(targets[i][2] + '. ' + targets[i][3] + '\n'
                        + '<span class\="uk-label\" style=\"background-color:#ffd250;color:#000;\"><span uk-icon=\"bolt\"></span>'+targets[i][8]+'</span>');
      if (i==0) firstMarker = marker;
      markersLayer.addLayer(marker);
    }
    markersLayer.addTo(mymap);
    firstMarker.openPopup();

    console.log("7. update map");
    // 여기에서 Targets 정류장을 지도에 표시
    // targets[0]~targets[9] 까지 있음 (목적지 + 목적지와 가까운 정류장 9개)
    // targets[i][6] : 위도, targets[i][7] : 경도
    // 자세한 정보는 이 부분에서 console 에 프린트 되는 targets element 참고
    console.log("Departure : ", departure)
    console.log("Targets : ", targets)

    // Set departure info
    document.getElementById("departure").innerHTML =
    "<B>[" + departure[2] + ". " + departure[3] + "]</B>" + "<br />" + departure[4];
  }

  // Get N closest stations from arr_index
  function getCloseStations(index, n) {
    var target = arr[index]; // arrival station
    // only iterate 100
    var searchStart = ((index-50) > 0) ? index-50 : 1;
    var searchEnd = ((index+50) <= arr.length-1) ? index+50 : arr.length-1;
    var distances = [];
    for (var i = searchStart; i <= searchEnd; i++) {
      // get distance [km]
      distances.push([computeDistance(arr[i],target),i])
    }
    distances.sort(function(left, right) {
      return left[0] < right[0] ? -1 : 1;
    });

    targets = [];
    for (var i = 0; i < n; i++) {
      targets.push(arr[distances[i][1]]);
    }
    return targets;
  }

  // Get travel time
  function getTravelTimeHour(departure, arrival) {
    dist = computeDistance(departure,arrival); // km
    time = dist / 10; // hour (10km/h)
    return Math.round(time);
  }

  /*
   * Send transactions
   */
  function requestIncentive(from, reqTime, targetIDs, travelTimes, infos) {
    var querydata = '{"from": "' + from + '","inputs": {"_reqTime": "'
          + reqTime + '","_stations": [' + targetIDs + '],"_arriveTimes": [' + travelTimes + '],"_infos": [' + infos + ']}}';

    return $.ajax({
        url: "https://api.luniverse.net/tx/v1.0/transactions/requestInference" + version,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer SfnBZUboFmWwav6CkYJrkyEQGp77qLJzhQ4hcmumhd8CYbp7z9hiRDex7jDaLgvr');
        },
        type: 'POST',
        contentType: 'application/json',
        processData: false,
        data: querydata,
        success: function (data) {
          console.log(JSON.stringify(data));
        },
        error: function(){
          console.log("Cannot get data");
        }
    });
  }

  // 일단 ajax없이 지도 렌더해보기 위함 
  function renderMap() {
    let lat_center = parseFloat(targets[0][6]);                 
    let long_center = parseFloat(targets[0][7]);                                                                       
    // 지도 중심 이동                           
    mymap.setView([lat_center,long_center], 14);     
    // Render
    mapboxgl.accessToken = 'pk.eyJ1IjoicmljZWdvZCIsImEiOiJja2FkaDl4MzAyNWViMnNteDNzdzdqbHUxIn0.0eLBipR8sNJ87SU2xJGSOA';
    var map = new mapboxgl.Map({
        container: 'mapid',
	// 이 style 부분에서 이전에 id, z, x, y 설정했던것처럼 설정해주는 것 같기도 하고 모르겠땅
        style: 'mapbox://styles/mapbox/streets-v11'
    });
    markersLayer.clearLayers();
    //mymap.spin(true);
    updateMap()
  }

  function requestPredict(from, reqTime, targetIDs, travelTimes, infos, callback) {
    var querydata = '{"from": "' + from + '","inputs": {"_reqTime": "'
          + reqTime + '","_stations": [' + targetIDs + '],"_arriveTimes": [' + travelTimes + '],"_infos": [' + infos + ']}}';

    return $.ajax({
        url: "https://api.luniverse.net/tx/v1.0/transactions/requestInference" + version,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer SfnBZUboFmWwav6CkYJrkyEQGp77qLJzhQ4hcmumhd8CYbp7z9hiRDex7jDaLgvr');
        },
        type: 'POST',
        contentType: 'application/json',
        processData: false,
        data: querydata,
        success: function (data) {
          //console.log(JSON.stringify(data));
          // [for test] insert response
          // insertResponse(ownerAddr, reqTime, targetIDs, callback);
          // get Response
          // 지도 초기화
          // 지도 중심 계산
          let lat_center = parseFloat(targets[0][6]);
          let long_center = parseFloat(targets[0][7]);
          // 지도 중심 이동
          mymap.setView([lat_center,long_center], 14);
          L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets',
            // 용환 mapbox public accesToken (이대로 두면 됨)
	    // 2020.05.19 yeonjae
            accessToken: 'pk.eyJ1IjoicmljZWdvZCIsImEiOiJja2FkaDl4MzAyNWViMnNteDNzdzdqbHUxIn0.0eLBipR8sNJ87SU2xJGSOA'
          }).addTo(mymap);
          markersLayer.clearLayers();
          mymap.spin(true);

          setTimeout(function () {getResponse(userAddr, reqTime, callback)}, 3000);
        },
        error: function(){
          console.log("Cannot get data");
        }
    });
  }

  function getResponse(from, reqTime, callback) {
    var querydata = '{"from": "' + from + '", "inputs": {"requestID": "' + from + reqTime + '"}}'
    console.log("getresponse",querydata);
    return $.ajax({
        url: "https://api.luniverse.net/tx/v1.0/transactions/getResponse" + version,
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Bearer SfnBZUboFmWwav6CkYJrkyEQGp77qLJzhQ4hcmumhd8CYbp7z9hiRDex7jDaLgvr');
        },
        type: 'POST',
        contentType: 'application/json',
        processData: false,
        data: querydata,
        success: function (data) {
          console.log("Predict result", JSON.stringify(data));
          callback(data, updateMap);
        },
        error: function(code) {
          setTimeout(function () {getResponse(from, reqTime, callback)}, 1000);
        }
    });
  }
}
