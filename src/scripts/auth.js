/*var settings = {
  authority: "http://localhost:44362",
  client_id: "js",
  redirect_uri: "http://localhost:4200/auth.html",
  response_type: "id_token token",
  scope: "openid profile api1",
  post_logout_redirect_uri: "http://localhost:4200/index.html",
  silent_redirect_uri: 'http://localhost:4200/silent-renew.html',
  automaticSilentRenew: true,
  silentRequestTimeout:10,
  accessTokenExpiringNotificationTime: 4,
  filterProtocolClaims: true,
  loadUserInfo: true
};*/

// TODO: Did not test
if ((Oidc && Oidc.Log && Oidc.Log.logger)) {
    Oidc.Log.logger = console;
}


new Oidc.UserManager().signinRedirectCallback().then(function (user) {
    if (user == null) {
        document.getElementById("waiting").style.display = "none";
        document.getElementById("error").innerText = "No sign-in request pending.";
    }
    else {
        window.location = "/";
    }
}).catch(function (er) {
    document.getElementById("waiting").style.display = "none";
    document.getElementById("error").innerText = er.message;
});