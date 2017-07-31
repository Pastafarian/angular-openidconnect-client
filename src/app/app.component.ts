import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './shared/services/auth.service';
import { CustomAuthService } from './shared/services/custom.auth.service';
import { HttpService } from './shared/services/http.service';
import { StorageService } from './shared/services/storage.service';
import { OpenIdConfiguration } from './shared/config/openid.configuration';
import {NgModule} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService,  HttpService, CustomAuthService, StorageService]
})
export class AppComponent {
  user: any;
  car: Car;
  token: string;
  tokenExpiry: string;
  authTime: string;

  constructor(private authService: AuthService, private httpService: HttpService, private customAuthService: CustomAuthService) {

    // Need to add check here 

    this.customAuthService.signinRedirectCallback().subscribe((x)=>{
          console.log('Sign in redirect ' + x);
    });

    /*
    this.customAuthService.signinRedirectCallback().subscribe(x =>{

      console.log('Sign in redirect '+ x);
    });*/
/*
    this.authService.mgr.getUser().then((user) => {
      if (!user) {
        this.authService.mgr.signinRedirect();
      } else {
        this.user = authService.currentUser;
        this.tokenExpiry = new Date(user.expires_at * 1000).toLocaleString();
        this.authTime = new Date(user.profile.auth_time * 1000).toLocaleString();
        this.token = user.access_token;
      }
    });*/
    
  }

  loadDiscoveryDocument() {
    this.customAuthService.loadDiscoveryDocument().subscribe(x => {
      console.log(x);

         this.customAuthService.signinRedirect();
    });
     
  }

  signIn(){
    this.customAuthService.signinRedirect();
  }

  signout() {
    this.authService.mgr.signoutRedirect();
  };

  callApi() {
    this.httpService.get<Car>('car').subscribe(x=>{
      this.car =x;
    });
  };
}


export class Car
{
  public Name : string;
  public Wheels: number;
}
