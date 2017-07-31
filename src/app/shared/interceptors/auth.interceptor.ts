import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { CustomAuthService } from '../services/custom.auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private storageService: StorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.storageService.getItem('token');
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

    return next.handle(req).do(x => {}, (err: any) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        
          console.log('Security exception sending request - need to sign in again');
          //this.authService.signinRedirect(); Need to handle in a different way due to cyclic dependency 
          //https://github.com/angular/angular/issues/18224
      } else{
        // Redirect to error page
      }
    });
  }
}

