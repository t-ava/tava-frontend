/*
 * Mapbox token
 */
mapboxgl.accessToken = 'pk.eyJ1IjoicmljZWdvZCIsImEiOiJja2FkaDl4MzAyNWViMnNteDNzdzdqbHUxIn0.0eLBipR8sNJ87SU2xJGSOA';
var map;

/*
 * User for test
 */
const USER_ADDR = 'X-PW2Bkxj4Hyc52o1AugXfP4FtLkyqM6qc7';
const USER_KEY = 'trUedHL6UDGLgv93yo6EcJ2UZiWhbiHjMCDU2ffJs9PcXvv3h';
const USER_NAME = 'user1';
const USER_PASSWORD = 'KDFNEobasfdkav-042!05';

const DEFAULT_INCENTIVE = 5; // standard

const DNN_SERVER = 'http://satoshi.snu.ac.kr:8327/post';

/*
 * Query weather & date infos
 */
var infos = [];
queryInfos();

/*
 * Read station data
 * Retrieved from http://jsfiddle.net/e6220t92/2/
 */
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
  // arr : ["id", "name", "latitude", "longitude"]
  const ID = 0, NAME = 1, LAT = 2, LONG = 3, INCENTIVE = 4;
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
              if (arr[i][NAME].match(textCountry)) {
                  addValue(arr[i][NAME], arr[i][NAME], idx);
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
          input[idx].value = $(this).text();
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
     rentBike(USER_ADDR, USER_NAME, USER_PASSWORD, departure[ID], Math.round((new Date()).getTime()/1000));
   });

   // return button listener
   document.getElementById("return").addEventListener("click", function(e) {
     // [TODO] No rent handling ("No rental history!") using rentTime (0, else)
     var returnTime = Math.round((new Date()).getTime()/1000);
     var returnStationID = prompt("Please input the arrival station id", "");
     var returnStation = [ returnStationID ];
     if (returnStationID) {
       // [TODO] time을 통해 추가요금을, requestIncentive 를 통해 incentive를 구하기
       // requestIncentive(userAddr, returnTime, returnStation, 0, infos);
       requestPredict(returnStation, 0).done(function(msg) {
    		console.log("request result : ", msg);
		var incentive = DEFAULT_INCENTIVE - msg["res"][0];
	        var additionalFee = 5;
	        returnBike(USER_ADDR, USER_NAME, USER_PASSWORD, returnStationID, additionalFee, incentive)
	        refresh(USER_ADDR);
       });
     }
   });

   // refresh button listener
   document.getElementById("refresh").addEventListener("click", function(e) {
     refresh(USER_ADDR);
   });

  // userProfileButton listener
   document.getElementById("userProfileButton").addEventListener("click", function(e) {
     refresh(USER_ADDR);
   });

  // < Get departure & arrival & targets >
  var departure, arrival, targets;

  function getTargets(callback) {
    console.log("2. Get targets (top 10 closest stations)");
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][NAME] == input[0].value) {
            departure = arr[i];
        }
        if (arr[i][NAME] == input[1].value) {
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
      targetIDs.push(targets[i][ID]);
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
    callback(targetIDs, travelTimes);
  }

  // Send expected arrival time & target id by Tx
  function sendPredictTx(targetIDs, travelTimes) {
    console.log("5. Send predict tx with timestamp [todo]");
    //var reqTime = Math.round((new Date()).getTime()/1000);
    // [TODO] AVA 미구현이므로 result 대충 다 999로 푸시하고 renderMap 해보기
    /*
    for (var i = 0; i < targets.length; i++) {
      targets[i].push(999);
    }
    renderMap();
    */
    console.log("targets:", targets)
    console.log("trael times:", travelTimes)
    requestPredict(targetIDs, travelTimes[0]).done(function(msg) {
    	console.log("request result : ", msg);
	result = msg["res"]; // negative : high incentive , positive : low incentive
    	for (var i = 0; i < targets.length; i++) {
		targets[i].push(DEFAULT_INCENTIVE - result[i]);
    	}
	renderMap(); // updateMap here
    });
  }

  var firstMarker;

  // Update map
  function updateMap() {
    // 마커 추가
    for (var i=0;i<targets.length;i++) {
	    // 위도. 경도 순서가 반대넹
	    var marker = new mapboxgl.Marker()
		    .setLngLat([targets[i][LONG], targets[i][LAT]])
		    .setPopup(new mapboxgl.Popup().setHTML('<span style="text-align:center;">' + targets[i][ID] + '. ' + targets[i][NAME] + '</span>'
		                            + '<br/><span class\="uk-label\" style=\"background-color:#ffd250;color:#000; text-align:center;\"><span uk-icon=\"bolt\"></span>'+targets[i][INCENTIVE]+'</span>'))
		    .addTo(map);
	    if (i==0) firstMarker = marker;
    }
    firstMarker.togglePopup();
    console.log("7. update map");
    // 여기에서 Targets 정류장을 지도에 표시
    // targets[0]~targets[9] 까지 있음 (목적지 + 목적지와 가까운 정류장 9개)
    // targets[i][6] : 위도, targets[i][7] : 경도
    // 자세한 정보는 이 부분에서 console 에 프린트 되는 targets element 참고
    console.log("Departure : ", departure)
    console.log("Targets : ", targets)

    // Set departure info
    document.getElementById("departure").innerHTML =
    "<B>[" + departure[ID] + ". " + departure[NAME] + "]</B>";
  }

  // Get N closest stations from arr_index
  function getCloseStations(index, n) {
    var target = arr[index]; // arrival station
    var distances = [];
    for (var i = 1; i < arr.length; i++) {
      if (i == index) {
	      continue;
      }
      // get distance [km]
      distances.push([computeDistance(arr[i],target),i])
    }
    distances.sort(function(left, right) {
      return left[0] < right[0] ? -1 : 1;
    });

    targets = [];
    targets.push(arr[index]); // destination
    for (var i = 0; i < n-1; i++) {
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
    let lat_center = parseFloat(targets[0][LAT]);
    let long_center = parseFloat(targets[0][LONG]);                                                                       
    mapboxgl.accessToken = 'pk.eyJ1IjoicmljZWdvZCIsImEiOiJja2FkaDl4MzAyNWViMnNteDNzdzdqbHUxIn0.0eLBipR8sNJ87SU2xJGSOA';
    map = new mapboxgl.Map({
        container: 'mapid',
        style: 'mapbox://styles/mapbox/streets-v11',
	center: [long_center, lat_center],
	zoom: 14
    });
    updateMap()
  }

  function requestPredict(targetIDs, travelTime) {
    // 희망 도착지 기준으로 request
    var now = new Date();
    var day = now.getDay()-1
    if (day == -1) day = 6
    var month = now.getMonth() + 1
    var hour = now.getHours() + travelTime
    if (hour >= 24) {
        day = (day + hour / 24) % 7
	hour = hour % 24
    }
    var querydata = '{"month": ' + month + ', "weekday": ' + day + ', "hour": ' + hour + ', "ids": [' + targetIDs + '], "adj":' + 1 + '}';
    console.log("querydata = ", querydata)

    return $.ajax({
	url: DNN_SERVER,
        type: 'POST',
        contentType: 'application/json',
	processData: false,
        data: querydata
    });
  }
}
