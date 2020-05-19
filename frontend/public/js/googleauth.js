/* 
 * Google Login
 */

document.getElementById("userProfileButton").style.visibility = "hidden";
document.getElementById("signInButton").style.visibility = "visible";
var signedInFlag = false;
function onSignIn(googleUser) {
  // Useful data for your client-side scripts:
  var profile = googleUser.getBasicProfile();
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.disconnect();

  var myUserEntity = {};
  signedInFlag = true;
  myUserEntity.Name = profile.getName();
  myUserEntity.Email = profile.getEmail();
  sessionStorage.setItem('myUserEntity',JSON.stringify(myUserEntity));


  document.getElementById("userProfileButton").src=profile.getImageUrl();
  document.getElementById("userProfileButton").style.visibility = "visible";
  document.getElementById("signInButton").style.display = "none";
  document.getElementById("userName").innerHTML=myUserEntity.Name;
};

function checkIfSignedIn(){
  if(sessionStorage.getItem('myUserEntity') == null){
    alert("Please sign-in.");
    return false;
  } else {
    return true;
  }
}

function signOut() {
  var auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log('User signed out.');
  });
  sessionStorage.clear();
  signedInFlag = false;

  document.getElementById("userProfileButton").style.visibility = "hidden";
  document.getElementById("signInButton").style.display = "";
  document.getElementById("offcanvas-flip").style.display = "none";
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
