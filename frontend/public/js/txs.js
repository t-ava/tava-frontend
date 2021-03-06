/*
 * Transactions
 */
 const FEE = 10;
 const WAIT_TIME = 2000;

 const OWNER_ADDR = 'X-MQPjxgthpTkXS8c3RAEJWtbTSZciULC8N';
 const OWNER_KEY = '2eEqN4Zsn5z3Qy13RjdAuxUoa8J2dXD6Zo9vS2osY68DLT6Y8E';
 const OWNER_NAME = 'host';
 const OWNER_PASSWORD = 'KDFNEobckav';
 const BIKE_TOKEN_ID = 'pePewnxEaP82Yd7cgnWbGUYgoBjvUwurvhzCLJpqusievGsUN';

 const STATION_ADDR = ['X-A9e3iJbYC4tRdhGV56QPjHNuWyE7Ao7jG', 'X-FC1R55muJFHuTHtMGbvENkNGLCqks1fVZ', 'X-8qozToj6mrGWuGMqD2gy9xySvj68nsBnZ', 'X-3gemEc753hjpWDe4TWFg65xx8xc6MzwvE', 'X-AkpWeXduP5Xkio1ouu1bytH6ksMiNue7D', 'X-BBZpBYNqdWiFmv3PB1fZSBawCDKByhisv', 'X-KvojiLf6QvQPsikFY3WEKbKFED7eA6MAQ', 'X-HRbnGVZEzN774JeSkbRzLQtYRz7wkkUNQ', 'X-9TH3dun9M71g1ymXX4pCJJxpkvMemrMGS', 'X-gRUq2JVEyTmUbxg7zkBzLwqfoshVao5r', 'X-LZCgKuqqRB9s5zHH1nbJc4TCiKcMm9ZKk', 'X-N5APzZUVyitRdQGtLm6cUhfW9K6vRb2KZ', 'X-Ji7DGdcjX9muM1W6hrbexQe4AKDzGU9ua', 'X-AQfdthXkvhA4ohL6rBGSEcwVXyc61YAHS', 'X-81TkjECnMzh8GXNs9WgDT7nG8rcswVtav', 'X-MrdJVdqgE8N7ta3taan9hmv8wDjBGmGGY', 'X-P3Km8LoMKGYZEA2Y789SofjL7oJtp4XVU', 'X-8C9cbgFGckdZnwfA9kufYanrfao6svKfY', 'X-8TwxXH8SUM6xQjqQVx9dQFnoMcNHxZufQ', 'X-4ZcBs4D9fEw5kSBmpSn1toWfec1RHPYva'];

 const NODE = 'http://satoshi.snu.ac.kr:9650/ext/bc/X';

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

function sendAssetFrom(amount, assetID, to, username, password, from) {
  var querydata = '{"jsonrpc": "2.0", "id": 3, "method": "avm.send", "params": {"assetID": "' + assetID + '", "amount" :' + amount + ', "to": "' + to + '", "username": "' + username + '", "password": "' + password + '", "froms": ["' + from + '"]}}';
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
 * 잔고 확인
 * 이거 잘 되나 테스트해보기. 일단 이 3가지 함수면 기본적 api구현은 끝남
 */
function getBalance(address, assetID) {
  var querydata = '{"jsonrpc": "2.0", "id": 2, "method": "avm.getBalance", "params": {"address": "' + address + '", "assetID": "' + assetID + '"}}';
  console.log("Get Balance", querydata);
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
	    // [TODO] 지금은 그냥 20개 station addr 밖에 없으니 modular를 통해 보내고 받는다
	    stationAddr = STATION_ADDR[stationID % STATION_ADDR.length];
	    console.log("rent stationID = ", stationID, ", index = ", stationID % STATION_ADDR.length, ", station addr = ", stationAddr)
            sendAssetFrom(1, BIKE_TOKEN_ID, useraddr, OWNER_NAME, OWNER_PASSWORD, stationAddr)
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
		      // [TODO] DB에 기록 요청
		      setHistory(useraddr, 'rent', FEE, Math.round((new Date()).getTime()/1000));
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
	    setHistory(useraddr, 'return', additional_fee, Math.round((new Date()).getTime()/1000));
            // 잘 처리되었으므로, 이제 bike token을 반환
	    // [TODO] 지금은 그냥 20개 station addr 밖에 없으니 modular를 통해 보내고 받는다
	    stationAddr = STATION_ADDR[stationID % STATION_ADDR.length];
	    console.log("return stationID = ", stationID, ", index = ", stationID % STATION_ADDR.length, ", station addr = ", stationAddr)
            sendAsset(1, BIKE_TOKEN_ID, stationAddr, username, password)
              .done(function (data) {
                if (data["result"] === undefined) {
                  alert("FAIL!\nERROR CODE: returnBike-2");
	          return;
                }
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
		                setHistory(useraddr, 'incentive', incentive, Math.round((new Date()).getTime()/1000));
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
 * 활동 내역 확인/설정
 * type : (-)'rent', (-)'return', (+)'incentive'
 */
function setHistory(addr, type, amount, timestamp) {
  console.log("set History!");
  return $.ajax({
    url: '/setHistory',
    type: 'POST',
    contentType: 'application/json',
    processData: false,
    data: '{"addr": "' + addr + '", "type": "' + type + '", "amount": "' + amount + '", "timestamp": "' + timestamp + '"}'
  });
}

function getHistory(addr) {
  console.log("get History!");
  return $.ajax({
    url: '/getHistory',
    type: 'POST',
    contentType: 'application/json',
    processData: false,
    data: '{"addr": "' + addr + '"}'
  });
}
