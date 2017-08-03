import { Injectable } from '@angular/core';
import { CustomAuthService } from './custom.auth.service';
import { StorageService } from './storage.service';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import 'rxjs/add/observable/timer';

@Injectable()
export class SilentRefreshService {
    private silentRenewIFrameId = 'iFrameForSilentRenew';
    private sessionIframe: HTMLIFrameElement;

    constructor(private customAuthService: CustomAuthService, private storageService: StorageService) {

    }

    public init() {
        this.sessionIframe = <HTMLIFrameElement>window.document.getElementById(this.silentRenewIFrameId);

        if (!this.sessionIframe) {
            this.sessionIframe = window.document.createElement('iframe');
            this.sessionIframe.id = this.silentRenewIFrameId;
            this.sessionIframe.style.display = 'none';
        }

        window.document.body.appendChild(this.sessionIframe);
        const refreshTimeSecs = (this.storageService.getTokenExpirySecs() * 1000) - 10000;
        const refreshTimer = Observable
            .timer(refreshTimeSecs, refreshTimeSecs) 
            .subscribe( x => {
                this.customAuthService.setStateAndNonse();

                const url = this.customAuthService.getSignUrl(this.storageService.getState(), this.storageService.getNonse(),
                environment.silent_redirect_uri);
                console.log(url);
                this.sessionIframe.src = url;
            });
    }
}
