import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DataState } from './interfaces/data-state';
import { Observable, filter, map } from 'rxjs';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

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

      auth: AuthenticationState;
    }>
  ) {}
  ngOnInit(): void {
   
  }
}
