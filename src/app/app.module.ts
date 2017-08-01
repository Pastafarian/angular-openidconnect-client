import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpModule } from '@angular/http';
import { AuthService } from './shared/services/auth.service';
import { HttpService } from './shared/services/http.service';
import { StorageService } from './shared/services/storage.service';
import { CustomAuthService } from './shared/services/custom.auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { NgIdleModule } from '@ng-idle/core'; 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    NgIdleModule.forRoot()
  ],
  providers: [
    AuthService, 
    CustomAuthService,
    StorageService,
    HttpService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }