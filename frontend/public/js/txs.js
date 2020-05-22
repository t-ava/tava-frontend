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
 * owner가 빌린 stationID에 대한 bike token을 지급(call giveBikeToken)
 */
function rentBike(fromaddr, fromname, password, stationID, time) {
  // 더이상 time은 필요가 없을 듯
  // stationID는 giveBikeToken에 사용
  var querydata = '{"jsonrpc": "2.0", "id": 3, "method": "avm.send", "params": {"assetID": "AVA", "amount" :' + FEE + ', "to": "' + OWNER_ADDR + '", "username": "' + fromname + '", "password": "' + password + '"}}';
  console.log("Rent Bike", querydata);
  return $.ajax({
      url: NODE,
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      data: querydata,
      success: function (data) {
        console.log('[rentBike return value]' + JSON.stringify(data));
	giveBikeToken(OWNER_NAME, OWNER_PASSWORD, fromaddr, stationID);
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
 * 1. owner가 빌린 stationID에 대한 bike token을 지급
 * 2. user가 반납하는 stationID에 대한 bike token을 돌려줌
 */
function giveBikeToken(fromname, password, toaddr, stationID) {
  var assetID = '2FDj1tDPT57bdfHPQv6y9GzjHEaejVxmniJvC2Vhubpe27TGTt'; // ST0 Token. [TODO] stationID 통해서 받아올 것
  var querydata = '{"jsonrpc": "2.0", "id": 3, "method": "avm.send", "params": {"assetID": "' + assetID + '", "amount" :' + 1 + ', "to": "' + toaddr + '", "username": "' + fromname + '", "password": "' + password + '"}}';
  console.log("Give Bike Token", querydata);
  return $.ajax({
      url: NODE,
      type: 'POST',
      contentType: 'application/json',
      processData: false,
      data: querydata,
      success: function (data) {
        console.log('[giveBikeToken return value]' + JSON.stringify(data));
        alert("payment is now complete. Please check the bike token you recieved.");
        document.getElementById("modal-example").style.display = "none";
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
