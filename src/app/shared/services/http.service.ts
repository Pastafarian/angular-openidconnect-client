import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { HttpClientModule, HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class HttpService {

    constructor(private httpClient: HttpClient) {
    }

    get<T>(url: string, token: string): Observable<T> {
        return this.httpClient.get<T>(environment.testApiUrl + url).catch(err => this.handleError(err));
    }

    put<T>(url: string, obj: T): Observable<Response> {
        return this.httpClient.put(environment.testApiUrl + url, JSON.stringify(obj)).catch(err => this.handleError(err));
    }

    post<T>(url: string, obj: T): Observable<Response> {
        return this.httpClient.post(environment.testApiUrl + url, JSON.stringify(obj)).catch(err => this.handleError(err));
    }

    delete<T>(url: string): Observable<Response> {
        return this.httpClient.delete(environment.testApiUrl + url).catch(err => this.handleError(err));
    }

    private handleError(resp: HttpErrorResponse) {
        let message = `Error status code ${resp.status} at ${resp.url}`;
        return Observable.throw(message);
    }
}
