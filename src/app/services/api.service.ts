import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { sendToken } from '../stores/authentication/authentication.actions';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8',
  });
  constructor(private _httpClient: HttpClient, private _store: Store) {}
  authenticate(data: {
    username: string;
    password: string;
  }): Observable<{ token: string }> {
    return this._httpClient.post<{ token: string }>(
      `${environment.ifox}/general/Auth/login`,
      data
    );
  }
  sendToken(token: string) {
    this._store.dispatch(sendToken({ token }));
  }
  sendData(data: { [k: string]: any } | { [k: string]: any }[]) {
    return this._httpClient.post(
      `${environment.nodeRed}/data`,
      { machines: data },
      {
        headers: this.headers,
      }
    );
  }
}
