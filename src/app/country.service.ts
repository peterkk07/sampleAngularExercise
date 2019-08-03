import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { global } from './shared/constants';

@Injectable({ providedIn: 'root' })
export class CountryService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

   fetchCountries() {
    return this.http
    .get(global.countries)
    .pipe(
      map(responseData => {
        const postsArray = [];
        for (const key in responseData) {
          if(responseData.hasOwnProperty(key)){
            postsArray.push(responseData[key].name);
          }
        }
        return postsArray;
      }
      ),
      catchError(errorRes => {
        console.log(errorRes);
        return throwError(errorRes);
      })
    );
  }
}