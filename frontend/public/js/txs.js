/*
 * Transactions
 */
 var version = '3';

 const FEE = 10;
 const WAIT_TIME = 2000;

 const OWNER_ADDR = 'X-JA6XmBq36MCy97Xi8kYBGbvu1B8Nhruxb';
 const OWNER_KEY = '27v9G1abBD39z5S8P1A2oQHKMK5ND7JxfzKg2nHi7yxJv3rQ82';
 const OWNER_NAME = 'user1';
 const OWNER_PASSWORD = 'jsdkbCJKEDleoi';

 const NODE = 'http://satoshi.snu.ac.kr:9650/ext/bc/X';


/*
 * 딱 id = 1,2, 3,4 함수 구현한 다음에 
 * rentBike returnBike이런건 ajax.done() ajax.fail() 이걸로 구현하자
 */


/*
 * [sendAsset]
 * amount: int, // 얼마를 보낼건가
 * assetID: string, // 어떤 asset을 보낼건가
 * to: string, // 돈 받을 주소
 * username: string, // 돈 보낼 사람의 username, 얘가 들고 있는 주소에서 알아서 돈 뽑아감
 * password: string // 돈 보낼 사람의 password 
 * -> return : {txID: string} // // 돈 보내는 tx의 해시값 (나중에 get tx status에서 이 tx가 accept 됐나 확인할 때 사용 가능)
 */
function sendAsset(amount, assetID, to, username, password) {
  var querydata = '{"jsonrpc": "2.0", "id": 3, "method": "avm.send", "params": {"assetID": "' + assetID + '", "amount" :' + amount + ', "to": "' + to + '", "username": "' + username + '", "password": "' + password + '"}}';
  console.log("Send Asset", querydata);
  return $.ajax({
    url: NODE,
    type: 'POST',
    contentType: 'application/json',
    processData: false,
    data: querydata
  });
}

/*
 * [getTxStatus]
 * 해당 tx가 accept 됐나 안됐나 확인할 때 사용
 * Accepted: 처리 완료
 * Processing: 아직 처리 중
 * Rejected: 거절당함
 * Unknown: 나한텐 그런 id 가진 tx가 없음
 */
function getTxStatus(txID) {
  var querydata = '{"jsonrpc": "2.0", "id": 4, "method": "avm.getTxStatus", "params": {"txID": "' + txID + '"}}';
  console.log("Get Tx Status", querydata);
  return $.ajax({
    url: NODE,
    type: 'POST',
    contentType: 'application/json',
    processData: false,
    data: querydata
  });
}

/*
 * 유저가 자전거를 하나 빌린다
 * 유저가 기본 렌트비를 지불
 * owner가 빌린 stationID에 대한 bike token을 지급(call giveBikeToken)
 * [TODO] Time 같은건 내쪽 DB에서 갖고있는게 맞을거같다.. 여기서 리턴되는 txID 랑 함께 시간을 기록해놔야 히스토리탭도 만들고, 나중에 리턴할때 추가 렌트비도 청구할 수 있음
 */
function rentBike(useraddr, username, password, stationID, time) {
  var assetID = '2FDj1tDPT57bdfHPQv6y9GzjHEaejVxmniJvC2Vhubpe27TGTt'; // ST0 Token. [TODO] stationID 통해서 받아올 것
  // 유저가 기본 렌트비를 지불
  sendAsset(FEE, "AVA", OWNER_ADDR, username, password)
    .done(function(data) {
      if (data["result"] === undefined) {
        alert("FAIL!\nERROR CODE: rentBike-1");
	return;
      }
      var txID = data["result"]["txID"];
      setTimeout(function () {
        getTxStatus(txID).done(function(data) {
	  console.log("tx data: ", data)
          // WAIT_TIME 이후, 기본 렌트비 지불 트랜잭션이 잘 처리되었는지 확인
	  var txStatus = data["result"]["status"];
	  if (txStatus == "Accepted") {
            // 잘 처리되었으므로, 이제 owner가 bike token을 지급
            sendAsset(1, assetID, useraddr, OWNER_NAME, OWNER_PASSWORD)
              .done(function (data) {
                if (data["result"] === undefined) {
                  alert("FAIL!\nERROR CODE: rentBike-2");
	          return;
                }
                var txID = data["result"]["txID"];
                setTimeout(function () {
                  getTxStatus(txID).done(function(data) {
	            console.log("tx data: ", data)
                    // WAIT_TIME 이후, bike token 지급 트랜잭션이 잘 처리되었는지 확인
	            var txStatus = data["result"]["status"];
	            if (txStatus == "Accepted") {
		      // 잘 처리되었으므로, rent가 완료됨
                      alert("Payment is now completed!\nplease check the bike token you recieved.");
                      document.getElementById("modal-example").style.display = "none";
	            }
	          })}, WAIT_TIME);
              });
	  }
        })}, WAIT_TIME);
    })
}

/*
 * 유저가 자전거를 반납한다
 * 유저가 추가 렌트비와 bike coin을 보냄
 * 오너가 인센티브를 지급
 */
function returnBike(useraddr, username, password, stationID, additional_fee, incentive) {
  var assetID = '2LFqoMJHmGPL136DNPnmwCTzD96gp1CjRoEfSeZt2Xc5HnsCax'; // ST1 Token. [TODO] stationID 통해서 받아올 것
  // 유저가 추가 렌트비를 지불
  sendAsset(additional_fee, "AVA", OWNER_ADDR, username, password)
    .done(function(data) {
      if (data["result"] === undefined) {
        alert("FAIL!\nERROR CODE: returnBike-1");
	return;
      }
      var txID = data["result"]["txID"];
      setTimeout(function () {
        getTxStatus(txID).done(function(data) {
	  console.log("tx data: ", data)
          // WAIT_TIME 이후, 추가 렌트비 지불 트랜잭션이 잘 처리되었는지 확인
	  var txStatus = data["result"]["status"];
	  if (txStatus == "Accepted") {
            // 잘 처리되었으므로, 이제 bike token을 반환
            sendAsset(1, assetID, OWNER_ADDR, username, password)
              .done(function (data) {
                if (data["result"] === undefined) {
                  alert("FAIL!\nERROR CODE: returnBike-2");
	          return;
                }
		console.log("data!!!!!", data);
                var txID = data["result"]["txID"];
                setTimeout(function () {
                  getTxStatus(txID).done(function(data) {
	            console.log("tx data: ", data)
                    // WAIT_TIME 이후, bike token 반환 트랜잭션이 잘 처리되었는지 확인
	            var txStatus = data["result"]["status"];
	            if (txStatus == "Accepted") {
		      // 잘 처리되었으므로, 마지막으로 오너가 incentive를 지급
                      sendAsset(incentive, "AVA", useraddr, OWNER_NAME, OWNER_PASSWORD)
	                .done(function (data) {
                          if (data["result"] === undefined) {
                            alert("FAIL!\nERROR CODE: returnBike-3");
	                    return;
                          }
                          var txID = data["result"]["txID"];
                          setTimeout(function () {
                            getTxStatus(txID).done(function(data) {
	                      console.log("tx data: ", data)
                              // WAIT_TIME 이후, incentive 지급 트랜잭션이 잘 처리되었는지 확인
	                      var txStatus = data["result"]["status"];
	                      if (txStatus == "Accepted") {
		                // 잘 처리되었으므로, 성공 팝업 띄움
	                        alert("Successfully returned!\nPlease check the incentive you've got.")
			      }
	                  })}, WAIT_TIME);
			});
	            }
	          })}, WAIT_TIME);
              });
	  }
        })}, WAIT_TIME);
    })
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
