import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthService } from './shared/services/auth.service';
import { HttpService } from './shared/services/http.service';
import {NgModule} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService,  HttpService]
})
export class AppComponent {
  user: any;
  car: Car;
  token: string;
  tokenExpiry: string;
  authTime: string;

  constructor(private authService: AuthService, private httpService: HttpService) {

    this.authService.mgr.getUser().then((user) => {
      if (!user) {
        this.authService.mgr.signinRedirect();
      } else {
        this.user = authService.currentUser;
        this.tokenExpiry = new Date(user.expires_at * 1000).toLocaleString();
        this.authTime = new Date(user.profile.auth_time * 1000).toLocaleString();
        this.token = user.access_token;
      }
    });
  }

  signout() {
    this.authService.mgr.signoutRedirect();
  };

  callApi() {
    this.httpService.get<Car>('car', this.token).subscribe(x=>{
      this.car =x;
    });
  };
}



export class Car
{
  public Name : string;
  public Wheels: number;
}
