/*
 * Transactions
 */
 var version = '3';

 var FEE = 10;

 var OWNER_ADDR = 'X-JA6XmBq36MCy97Xi8kYBGbvu1B8Nhruxb';
 var OWNER_KEY = '27v9G1abBD39z5S8P1A2oQHKMK5ND7JxfzKg2nHi7yxJv3rQ82';
 var OWNER_NAME = 'user1';
 var OWNER_PASSWORD = 'jsdkbCJKEDleoi';

 var NODE = 'http://satoshi.snu.ac.kr:9650/ext/bc/X';

/*
 * 유저가 자전거를 하나 빌린다
 * 유저가 기본 렌트비를 지불
 * bike token은 그쪽에서 저절로 해주는거 아닌거면 내가 여기서 해야되는건가
 */
function rentBike(fromname, password, stationID, time) {
  //var querydata = '{"from": "' + from + '", "inputs": {"stationID": "' + stationID + '", "rentTime": "' + time + '"}}'
  var querydata = '{"jsonrpc": "2.0", "id": 3, "method": "avm.send", "params": {"assetID": "AVA", "amount" :' + FEE + ', "to": "' + OWNER_ADDR + '", "username": "' + fromname + '", "password": "' + password + '"}}';
  console.log("Rent Bike", querydata);
  return $.ajax({
      url: NODE,
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      data: querydata,
      success: function (data) {
        console.log(JSON.stringify(data));
        alert("결제가 완료되었습니다.");
        document.getElementById("modal-example").style.display = "none";
      },
      error: function(code) {
        console.log(code);
        alert("FAIL");
      }
  });
}

/*
 * 유저가 자전거를 반납한다
 * bikeNums[stationID]++
 * returnInfo[userAddress] = [stationID, bikeNumAfterReturn, 이용시간]   (int list)
 * 유저가 추가 렌트비만큼 토큰을 전송함
 * 인센티브 계산을 위해 requestInference()를 콜함 (아래에서 이어짐)
 */
function returnBike(from, stationID, time) {
  var querydata = '{"from": "' + from + '", "inputs": {"stationID": "' + stationID + '", "returnTime": "' + time + '"}}'
  console.log("Return Bike", querydata);
  return $.ajax({
      url: "https://api.luniverse.net/tx/v1.0/transactions/returnBike" + version,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer SfnBZUboFmWwav6CkYJrkyEQGp77qLJzhQ4hcmumhd8CYbp7z9hiRDex7jDaLgvr');
      },
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      data: querydata,
      success: function (data) {
        console.log(JSON.stringify(data));
        alert("반납에 성공했습니다.");
      },
      error: function(code) {
        console.log(code);
        alert("FAIL");
      }
  });
}

/*
 * 잔고 확인
 */
function balanceOf(from, owner) {
  var querydata = '{"from": "' + from + '", "inputs": {"owner": "' + owner + '"}}';
  console.log("balanceOf", querydata);
  return $.ajax({
      url: "https://api.luniverse.net/tx/v1.0/transactions/balanceOf",
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer SfnBZUboFmWwav6CkYJrkyEQGp77qLJzhQ4hcmumhd8CYbp7z9hiRDex7jDaLgvr');
      },
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      data: querydata,
      success: function (data) {
        console.log(JSON.stringify(data));
        //alert("SUCCESS");
        return data;
      },
      error: function(code) {
        console.log(code);
        alert("FAIL");
      }
  });
}

/*
 * 활동 내역 확인
 * 0 - 5원 렌트비 at 10초
 * 1 - 10원 추가 렌트비 at 20초
 * 2 - 15원 인센티브 at 100초
 */
function getRecord(from, addr) {
  var querydata = '{"from": "' + from + '", "inputs": {"addr": "' + addr + '"}}'
  console.log("getRecord", querydata);
  return $.ajax({
      url: "https://api.luniverse.net/tx/v1.0/transactions/getRecord" + version,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer SfnBZUboFmWwav6CkYJrkyEQGp77qLJzhQ4hcmumhd8CYbp7z9hiRDex7jDaLgvr');
      },
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      data: querydata,
      success: function (data) {
        //console.log(JSON.stringify(data));
        //alert("SUCCESS");
      },
      error: function(code) {
        console.log(code);
        alert("FAIL");
      }
  });
}

/*
 * 대여 시간 확인
 * 0 - 대여X
 * Else - 대여시간
 */
function rentTime(from, addr) {
  var querydata = '{"from": "' + from + '", "inputs": {"": "' + addr + '"}}'
  console.log("getRecord", querydata);
  return $.ajax({
      url: "https://api.luniverse.net/tx/v1.0/transactions/rentTimes" + version,
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Bearer SfnBZUboFmWwav6CkYJrkyEQGp77qLJzhQ4hcmumhd8CYbp7z9hiRDex7jDaLgvr');
      },
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      data: querydata,
      success: function (data) {
        //console.log(JSON.stringify(data));
        //alert("SUCCESS");
      },
      error: function(code) {
        console.log(code);
        alert("FAIL");
      }
  });
}
