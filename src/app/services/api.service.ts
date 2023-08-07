import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private website = 'https://haw.ifox-systems.de/api/v1';
  private nodered = 'http://localhost:1880';
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  });
  constructor(private _httpClient: HttpClient) {}
  authenticate(data: {
    username: string;
    password: string;
  }): Observable<{ token: string }> {
    return this._httpClient.post<{ token: string }>(
      `${this.website}/general/Auth/login`,
      data
    );
  }
  sendToken(token: string) {
    return this._httpClient.post(`${this.nodered}/authentication`, {token}, {
      headers: this.headers,
    });
  }
}
