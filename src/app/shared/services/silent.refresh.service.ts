import { Injectable } from '@angular/core';
import "rxjs/add/observable/interval";
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';


@Injectable()
export class SilentRefreshService {

  private sessionIframe: any;

  constructor() {

  }

  public init() {
    this.sessionIframe = window.document.createElement('iframe');
    this.sessionIframe.style.display = 'none';
    window.document.body.appendChild(this.sessionIframe);
  }


  private runTokenValidatation() {
    
    let source = Observable.timer(3000, 3000)
        .timeInterval()
        .pluck('interval')
        .take(10000);
 
    let subscription = source.subscribe(() => {
        if (this._isAuthorized) {
            if (this.oidcSecurityValidation.IsTokenExpired(this.retrieve('authorizationDataIdToken'))) {
                console.log('IsAuthorized: isTokenExpired');
 
                if (this._configuration.silent_renew) {
                    this.RefreshSession();
                } else {
                    this.ResetAuthorizationData();
                }
            }
        }
    },
    function (err: any) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });
}
}