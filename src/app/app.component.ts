import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from './interfaces/data-state';
import { Observable, connect, filter, map, tap } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { MqttClientState } from './interfaces/mqtt-client-state';
import { initiateConnection } from './stores/mqtt-client/mqtt-client.actions';
import { AuthenticationState } from './interfaces/authentication-state';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('1000ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  title = 'DIAZI-UI';
  jsonFile$ = new Observable<{ [k: string]: any } | null>();
  constructor(
    private _store: Store<{
      data: DataState;
      mqtt: MqttClientState;
      auth: AuthenticationState
    }>
  ) {}
  ngOnInit(): void {
    this.jsonFile$ = this._store.pipe(map((state) => state.data.machines));
    this._store.dispatch(initiateConnection());
    this._store
      .pipe(
        map((s) => s),
        filter((d) => d.mqtt.isConnected),
        tap((d) => console.log(`is connected`, d))
      )
      .subscribe();
  }
}
