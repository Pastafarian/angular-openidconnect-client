import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';
import { OpenIdConfiguration } from '../config/openid.configuration';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';



@Injectable()
export class CustomAuthService {

    public tokenExpiry: Date;
    private openIdConfiguration: OpenIdConfiguration;
    constructor(private httpService: HttpService, private storageService: StorageService) {

    }

    loggedIn(): boolean {

        const token = this.storageService.getTokenExpirySecs();
        console.log('tokenExpiry ' + token);

        const d = new Date(token);

        console.log('tokenExpiry - dated' + d);
        console.log(d);
        const now = new Date();
        console.log('now - dated' + now);

        if (d < now) {
            console.log('Not logged in - expired');
        } else {
            console.log('Logged in');
        }

        return false;
    }

    public GetToken(): string {
        return this.storageService.getToken();
    }

    public signIn() {
        this.setStateAndNonse();
        window.location.href = this.getSignUrl(this.storageService.getState(), this.storageService.getNonse());

    }
    public setStateAndNonse() {
        const nonce = 'N' + Math.random() + '' + Date.now();
        const state = Date.now() + '' + Math.random();

        this.storageService.setState(state);
        this.storageService.setNonse(nonce);
    }

    public getSignUrl(state: string, nonce: string) {
        return environment.authority + '/connect/authorize' + '?' +
            'response_type=' + encodeURI(environment.response_type) + '&' +
            'client_id=' + encodeURI(environment.client_id) + '&' +
            'redirect_uri=' + encodeURI(environment.redirect_uri) + '&' +
            'scope=' + encodeURI(environment.scope) + '&' +
            'nonce=' + encodeURI(nonce) + '&' +
            'state=' + encodeURI(state);
    }

    loadDiscoveryDocument(): Observable<OpenIdConfiguration> {
        return this.httpService.get<OpenIdConfiguration>(environment.authority + '/.well-known/openid-configuration').map(x => {
            this.openIdConfiguration = x;
            return x;
        });
    }

    signinRedirectCallback(): Observable<boolean> {

        this.resetAuthorizationData();

        const hash = window.location.hash.substr(1);

        const result: any = hash.split('&').reduce(function (accumulator, item) {
            const parts = item.split('=');
            accumulator[parts[0]] = parts[1];
            return accumulator;
        }, {});

        const token = result.access_token;
        const id_token = result.id_token;
        const expires_in = result.expires_in;
        const dataIdToken: any = this.getDataFromToken(id_token);

        if (result.state !== this.storageService.getState() && dataIdToken.nonce !== this.storageService.getNonse()) {
            console.log('AuthorizedCallback incorrect state');
            this.resetAuthorizationData();
            return Observable.of(false);
        }

        this.setAuthorizationData(token, id_token, expires_in);
        return Observable.of(true);
    }


    private setAuthorizationData(token: any, id_token: any, expires_in: number) {

        this.storageService.setToken(token);
        this.storageService.setIdToken(id_token);
        this.storageService.setTokenExpirySecs(expires_in);

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
        this.storageService.setToken('');
        this.storageService.setIdToken('');
        this.storageService.setTokenExpirySecs(0);
    }

    private getDataFromToken(token) {
        let data = {};

        if (typeof token !== 'undefined') {
            const encoded = token.split('.')[1];
            data = JSON.parse(this.urlBase64Decode(encoded));
        }

        return data;
    }

    private urlBase64Decode(str) {
        let output = (str + '').replace('-', '+').replace('_', '/');
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
                throw new Error('Illegal base64url string!');
        }
        return window.atob(output);
    }
}

export class StateAndNonse {
    public State: string;
    public Nonse: string;

    constructor(state: string, nonse: string) {
        this.State = state;
        this.Nonse = nonse;
    }
}
