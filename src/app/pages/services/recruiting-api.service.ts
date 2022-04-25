import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { SearchService } from "src/app/shareds/models/api.interface";
import { Observable } from "rxjs";

@Injectable ({
    providedIn: 'root'
})

export class Recruiting_api {

    private _url = 'https://recruiting-api.newshore.es/api/flights/1';

    constructor ( private http: HttpClient) {
        console.log('Servicio activado')
    }

    getInfoAPI(): Observable<SearchService[]> {
        return this.http.get<SearchService[]>(this._url);
    }
}