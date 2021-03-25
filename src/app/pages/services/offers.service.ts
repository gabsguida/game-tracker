import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const cheapSharkUrl = 'https://www.cheapshark.com/api/1.0';

@Injectable({
  providedIn: 'root'
})

export class OffersService {
  constructor(private http: HttpClient) { }

  getOffers(params?: any): Observable<any> {
    const { pageNumber, pageSize, onSale, AAA, storeID = 1 } = params;
    return this.http.get(`${cheapSharkUrl}/deals?pageNumber=${pageNumber}&pageSize=${pageSize}&storeID=${storeID}&onSale=${onSale}&AAA=${AAA}`);
  }

}
