import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    getItem<T>(key: string): T {
        var json = localStorage.getItem(key);
        if (json && json != null && json !== 'undefined') {
            return JSON.parse(json);
        }

        return null;
    }

    setItem<T>(key: string, obj: T) {
        localStorage.setItem(key, JSON.stringify(obj));
    }
}