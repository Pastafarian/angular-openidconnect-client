import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { UserManager, Log, MetadataService, User } from 'oidc-client';
import { environment } from '../../../environments/environment';


//TODO: Use env service instead
const settings: any = {
  authority: "http://localhost:44362",
  client_id: "js",
  redirect_uri: "http://localhost:4200/auth.html",
  response_type: "id_token token",
  scope: "openid profile api1",
  post_logout_redirect_uri: "http://localhost:4200/index.html",
  silent_redirect_uri: 'http://localhost:4200/silent-renew.html',
  automaticSilentRenew: true,
  // silentRequestTimeout:10000,
  filterProtocolClaims: true,
  loadUserInfo: true
};

@Injectable()
export class AuthService {
  mgr: UserManager = new UserManager(settings);
  currentUser: User;

  constructor() {

    this.mgr.getUser().then((user) => {
        if (user) {
          this.currentUser = user;
        }
    });
  }
}
