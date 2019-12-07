import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Flight} from '../model/flight';

@Injectable({
  providedIn: 'root'
})
export class FlightService {
  static SERVER_URL = 'http://localhost:8080/';
  static API = 'v1/flight';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  static getRequest(api: string) {
    return {
      url: `${FlightService.SERVER_URL}${api}`,
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
  }

  getFlights(search: any): Observable<any> {
    const req = FlightService.getRequest(`${FlightService.API}/list`);
    return this.httpClient.post(req.url, search, {headers: req.headers});
  }

  saveFlights(flights: Array<Flight>): Observable<any> {
    const req = FlightService.getRequest(FlightService.API);
    return this.httpClient.post(req.url, flights, {headers: req.headers});
  }

  getDummyFlights(): Observable<any> {
    return this.httpClient.get('/assets/flight-data.json');
  }
}
