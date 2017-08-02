import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './shared/services/auth.service';
import { CustomAuthService } from './shared/services/custom.auth.service';
import { HttpService } from './shared/services/http.service';
import { SilentRefreshService } from './shared/services/silent.refresh.service';
import { SignOutIdleUserService } from './shared/services/sign.out.idle.user.service';
import { StorageService } from './shared/services/storage.service';
import { OpenIdConfiguration } from './shared/config/openid.configuration';
import { NgModule } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService, HttpService, CustomAuthService, StorageService, SignOutIdleUserService, SilentRefreshService]
})
export class AppComponent {
  user: any;
  car: Car;
  token: string;
  tokenExpiry: string;
  authTime: string;
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(private authService: AuthService, private httpService: HttpService, private customAuthService: CustomAuthService,
    private signOutIdleUserService: SignOutIdleUserService, silentRefreshService: SilentRefreshService) {

    this.customAuthService.signinRedirectCallback().subscribe((success) => {

      if (success && environment.silentTokenRefresh) {

        const d = new Date();

        // replace
        silentRefreshService.init();
      }

    });

    signOutIdleUserService.init(5, 5);

    signOutIdleUserService.onTimeout.subscribe(x => {
      // this.customAuthService.signinRedirect();
      this.idleState = 'Timed out!';
    });

    signOutIdleUserService.onTimeoutWarning.subscribe(x => {
      this.idleState = `Idle - you will be signed out in ${x} seconds`;
    });

    signOutIdleUserService.onIdleStart.subscribe(x => {
      this.idleState = 'Idle start';
    });
  }

  loadDiscoveryDocument() {
    this.customAuthService.loadDiscoveryDocument().subscribe(x => {
      console.log(x);

      this.customAuthService.signIn();
    });

  }

  signIn() {
    this.customAuthService.signIn();
  }

  loggedIn() {
    this.customAuthService.loggedIn();
  }

  signout() {
    this.authService.mgr.signoutRedirect();
  }

  callApi() {
    this.httpService.get<Car>(environment.testApiUrl + 'car').subscribe(x => {
      this.car = x;
    });
  }
}


export class Car {
  public Name: string;
  public Wheels: number;
}
