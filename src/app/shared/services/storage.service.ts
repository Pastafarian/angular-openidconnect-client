import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    get<T>(key: string): T {
        const json = localStorage.getItem(key);
        if (json && json != null && json !== 'undefined') {
            return JSON.parse(json);
        }

        return null;
    }

    set<T>(key: string, obj: T) {
        localStorage.setItem(key, JSON.stringify(obj));
    }

    getToken(): string {
        return this.get<string>('token');
    }

    setToken(token: string) {
        this.set<string>('token', token);
    }

    getIdToken(): string {
        return this.get<string>('idToken');
    }

    setIdToken(token: string) {
        this.set<string>('idToken', token);
    }

    getNonse(): string {
        return this.get<string>('nonse');
    }

    setNonse(nonse: string) {
        this.set<string>('nonse', nonse);
    }

    getState(): string {
        return this.get<string>('state');
    }

    setState(state: string) {
        this.set<string>('state', state);
    }

    getTokenExpirySecs(): number {
        return this.get<number>('getTokenExpirySecs');
    }

    setTokenExpirySecs(tokenExpiry: number) {
        this.set<number>('getTokenExpirySecs', tokenExpiry);
    }
}
