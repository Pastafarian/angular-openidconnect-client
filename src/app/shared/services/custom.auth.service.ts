import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';
import { OpenIdConfiguration } from '../config/openid.configuration';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';



@Injectable()
export class CustomAuthService {

    private openIdConfiguration: OpenIdConfiguration;
 
    constructor(private httpService: HttpService, private storageService: StorageService) {

    }

    loggedIn(): boolean {

        var token = this.storageService.getItem<string>('tokenExpiry');
        console.log('tokenExpiry ' + token);

        var d = new Date(token);

        console.log('tokenExpiry - dated' + d);
        console.log(d);
        var now = new Date();
        console.log('now - dated' + now);

        if(d < now)
        {
                console.log('Not logged in - expired');
        }else
            {
                console.log('Logged in');
            }

        return false;
    }

    public GetToken(): string {
        return this.storageService.getItem<string>('token');
    }

    signinRedirect() {
        var authorizationUrl = environment.authority + '/connect/authorize';
        var redirect_uri = environment.redirect_uri;
        var client_id = environment.client_id;
        var response_type = environment.response_type;
        var scope = environment.scope;
        var nonce = "N" + Math.random() + "" + Date.now();
        var state = Date.now() + "" + Math.random();
        this.storageService.setItem("authStateControl", state);
        this.storageService.setItem("authNonce", nonce);

        var url =
            authorizationUrl + "?" +
            "response_type=" + encodeURI(response_type) + "&" +
            "client_id=" + encodeURI(client_id) + "&" +
            "redirect_uri=" + encodeURI(redirect_uri) + "&" +
            "scope=" + encodeURI(scope) + "&" +
            "nonce=" + encodeURI(nonce) + "&" +
            "state=" + encodeURI(state);

        window.location.href = url;
    }

    loadDiscoveryDocument(): Observable<OpenIdConfiguration> {
        var url = environment.authority + '/.well-known/openid-configuration';

        return this.httpService.get<OpenIdConfiguration>(url).map(x => {
            this.openIdConfiguration = x;
            return x;
        });
    }

    signinRedirectCallback() : Observable<boolean> {

        this.resetAuthorizationData();

        var hash = window.location.hash.substr(1);

        var result: any = hash.split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        var token = "";
        var id_token = "";
        var expires_in = 0;
        var authResponseIsValid = false;

        if (result) {

            if (result.state !== this.storageService.getItem("authStateControl")) {
                console.log("AuthorizedCallback incorrect state");
                return Observable.of(false);
            } else {
                token = result.access_token;
                id_token = result.id_token;
                expires_in = result.expires_in;

                this.storageService.setItem("tokenExpirySecs", expires_in);

                var d = new Date();
                console.log('Date now ' + d)
                d = new Date(d.getTime() + (expires_in * 1000));

                console.log('Exp date ' + d)
                this.storageService.setItem("tokenExpiry", d);
                
                console.log('expires in ' + expires_in * expires_in);

                var dataIdToken: any = this.getDataFromToken(id_token);
  
                if (dataIdToken.nonce !== this.storageService.getItem("authNonce")) {
                    console.log("AuthorizedCallback incorrect nonce");
                } else {
                    this.storageService.setItem("authNonce", "");
                    this.storageService.setItem("authStateControl", "");
                    authResponseIsValid = true;
                }
            }
        }

        if (authResponseIsValid) {
            this.setAuthorizationData(token, id_token, expires_in);
            console.log("authorizationData", this.storageService.getItem("token"));
            return Observable.of(true);
        }
        else {
            this.resetAuthorizationData();
            return Observable.of(false);
        }
    }


    private setAuthorizationData(token: any, id_token: any, expires_in: number) {
        this.storageService.setItem('authorizationData', '');
        this.storageService.setItem("token", token);
        this.storageService.setItem("authorizationDataIdToken", id_token);
        var expires = new Date();
        expires.setSeconds(expires.getSeconds() + expires_in);
        this.storageService.setItem("expires", expires.getSeconds());
        this.storageService.setItem("IsAuthorized", true);

        console.log("Token", token);

        /*
        var data: any = this.getDataFromToken(token);
        
        for (var i = 0; i < data.role.length; i++) {
            if (data.role[i] === "dataEventRecords.admin") {
                this.HasAdminRole = true;
                this.store("HasAdminRole", true)
            }
        }*/
    }


    private resetAuthorizationData() {
        this.storageService.setItem('token', '');
        this.storageService.setItem('authorizationDataIdToken', '');
    }

    private getDataFromToken(token) {
        var data = {};

        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        return data;
    }

    private urlBase64Decode(str) {
        var output = (str + "").replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }   
        return window.atob(output);
    }
    /*
        public AuthorizedCallback() {
        console.log("BEGIN AuthorizedCallback, no auth data");
        this.ResetAuthorizationData();

        var hash = window.location.hash.substr(1);

        var result: any = hash.split('&').reduce(function (result, item) {
            var parts = item.split('=');
            result[parts[0]] = parts[1];
            return result;
        }, {});

        console.log(result);
        console.log("AuthorizedCallback created, begin token validation");

        var token = "";
        var id_token = "";
        var expires_in = 0;
        var authResponseIsValid = false;
        if (!result.error) {

            if (result.state !== this.retrieve("authStateControl")) {
                console.log("AuthorizedCallback incorrect state");
            } else {

                token = result.access_token;
                id_token = result.id_token;
                expires_in = result.expires_in;

                var dataIdToken: any = this.getDataFromToken(id_token);
                console.log(dataIdToken);

                // validate nonce
                if (dataIdToken.nonce !== this.retrieve("authNonce")) {
                    console.log("AuthorizedCallback incorrect nonce");
                } else {
                    this.store("authNonce", "");
                    this.store("authStateControl", "");

                    authResponseIsValid = true;
                    console.log("AuthorizedCallback state and nonce validated, returning access token");
                }
            }
        }

        if (authResponseIsValid) {
            this.SetAuthorizationData(token, id_token, expires_in);
            console.log("authorizationData", this.retrieve("authorizationData"));

            this.router.navigate(['Orders/Dashboard']);
        }
        else {
            this.ResetAuthorizationData();
            this.router.navigate(['unauthorized']);
        }
    }
    */
    // Current
    //http://localhost:44362/connect/authorize?client_id=js&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth.html&response_type=id_token%20token&scope=openid%20profile%20api1&state=%20b54u3txzonalqna0ptr3ba8st7xonbyu&nonse=%204zoi8plrb3r59o217kkrewfbnadi0egr7
    //    works
    //http://localhost:44362/connect/authorize?client_id=js&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth.html&response_type=id_token%20token&scope=openid%20profile%20api1&state=f0b5757ad22b4d919c6a3a160ab5cc11&nonce=4a3623bb21714359bd416de21a63306c
    /*
  this.httpService.get<Car>('car').subscribe(x=>{
      this.car =x;
    });
        loadDiscoveryDocument(fullUrl: string = null): Promise<any> {

        return new Promise((resolve, reject) => {

            if (!fullUrl) {
                fullUrl = this.issuer + '/.well-known/openid-configuration';
            }

            this.http.get(fullUrl).map(r => r.json()).subscribe(
                (doc) => {

                    this.loginUrl = doc.authorization_endpoint;
                    this.logoutUrl = doc.end_session_endpoint;
                    this.grantTypesSupported = doc.grant_types_supported;
                    this.issuer = doc.issuer;
                    // this.jwks_uri = this.jwks_uri;
                    this.tokenEndpoint = doc.token_endpoint;
                    this.userinfoEndpoint = doc.userinfo_endpoint;

                    this.discoveryDocumentLoaded = true;
                    this.discoveryDocumentLoadedSender.next(doc);
                    resolve(doc);
                },
                (err) => {
                    console.error('error loading dicovery document', err);
                    reject(err);
                }
            );
        });

    }

    export const environment = {
  production: false,
  authority: "http://localhost:44362",
  client_id: "js",
  redirect_uri: "http://localhost:4200/auth.html",
  response_type: "id_token token",
  scope: "openid profile api1",
  post_logout_redirect_uri: "http://localhost:4200/index.html",
  silent_redirect_uri: 'http://localhost:4200/silent-renew.html',
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true,
  testApiUrl:'http://localhost:5001/'
};
    */
}
/*
        this.ResetAuthorizationData();

        console.log("BEGIN Authorize, no auth data");

        var authorizationUrl = environment.stradaWheelsLoginUrl + '/connect/authorize';
        var redirect_uri = environment.stradaWheelsAppUrl;

        var client_id = 'buildOrderClient';
        var response_type = "id_token token";
        var scope = "buildordersscope buildOrders profile email openid";
        var nonce = "N" + Math.random() + "" + Date.now();
        var state = Date.now() + "" + Math.random();

        this.store("authStateControl", state);
        this.store("authNonce", nonce);
        console.log("AuthorizedController created. adding myautostate: " + this.retrieve("authStateControl"));

        var url =
            authorizationUrl + "?" +
            "response_type=" + encodeURI(response_type) + "&" +
            "client_id=" + encodeURI(client_id) + "&" +
            "redirect_uri=" + encodeURI(redirect_uri) + "&" +
            "scope=" + encodeURI(scope) + "&" +
            "nonce=" + encodeURI(nonce) + "&" +
            "state=" + encodeURI(state);

        window.location.href = url;
*/
/*
https://github.com/manfredsteyer/angular-oauth2-oidc
*/
