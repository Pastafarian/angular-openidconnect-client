import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.currentUser.access_token;
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

    return next.handle(req).do(x => {}, (err: any) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
          this.authService.mgr.signinRedirect();
      }
    });
  }
}

