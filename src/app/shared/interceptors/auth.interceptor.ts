import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.authService.currentUser.access_token;
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

    return next.handle(req)
      .map((event: HttpEvent<any>) => {

        if (event instanceof HttpResponse && event.status === 401) {
          window.location.href = environment.authority;
        }

        return event;
      });
  }
}

