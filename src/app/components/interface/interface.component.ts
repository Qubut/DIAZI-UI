import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, combineLatest, filter, first, last, map, tap } from 'rxjs';
import { AuthenticationState } from 'src/app/interfaces/authentication-state';
import { DataState } from 'src/app/interfaces/data-state';
import { SpinnerState } from 'src/app/interfaces/spinner-state';
import { TerminalService } from 'src/app/services/terminal.service';
import {
  trigger,
  style,
  animate,
  transition,
  sequence,
} from '@angular/animations';
@Component({
  selector: 'app-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        sequence([
          animate(
            '500ms ease-out',
            style({
              opacity: 0.5,
              transform: 'translateY(25px)',
            })
          ),
          animate(
            '500ms ease-out',
            style({
              opacity: 1,
              transform: 'translateY(0)',
            })
          ),
        ]),
      ]),

      transition(':leave', [
        animate(
          '1000ms ease-in',
          style({
            opacity: 0,
            transform: 'scale(0.5)',
          })
        ),
      ]),
    ]),
    trigger('rotateInOut', [
      transition(':enter', [
        style({ transform: 'rotate(180deg)' }),
        animate('500ms ease-out', style({ transform: 'rotate(0deg)' })),
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ transform: 'rotate(180deg)' })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit, AfterViewInit {
  isLoading$ = new Observable<boolean>();
  isAuthenticated$ = new Observable<boolean>();
  token$ = new Observable<string>();
  isTokenSent$ = new Observable<boolean>();
  machines$ = new Observable<{ [k: string]: any } | null>();
  errorOcurred$ = new Observable<any>();
  constructor(
    private _store: Store<{
      spinner: SpinnerState;
      auth: AuthenticationState;
      data: DataState;
    }>,
    private _terminalService: TerminalService
  ) {
    this.isLoading$ = this._store.pipe(map((state) => state.spinner.isLoading));
    this.isAuthenticated$ = this._store.pipe(
      map((state) => state.auth.isAuthenticated)
    );
    this.isTokenSent$ = this._store.pipe(map((state) => state.auth.tokenSent));
    this.token$ = this._store.pipe(map((state) => state.auth.token));
    this.machines$ = this._store.pipe(map((state) => state.data.machines));
    this.errorOcurred$ = this._store.pipe(map((s) => s.auth.error));
  }
  ngAfterViewInit(): void {
    this._terminalService.write('Bitte authentifizieren Sie sich!');
  }
  ngOnInit(): void {
    combineLatest([this.isAuthenticated$,this.errorOcurred$]).pipe(
      filter(([isAuthenticated])=>!isAuthenticated),
      // first(),
      tap(async ([_,e]) =>{
        console.log(`error`, e)
        this._terminalService.error(
          <string>(<{ [k: string]: any }>e)['message']
        )}
      )
    );
    combineLatest([this.isAuthenticated$, this.token$])
      .pipe(
        filter(([isAuthenticated]) => isAuthenticated),
        first(),
        tap(async ([_, token]) => {
          this._terminalService.terminal?.underlying!.reset();
          await this._terminalService.write('Token erhalten');
        })
      )
      .subscribe();

    combineLatest([this.isAuthenticated$, this.isTokenSent$])
      .pipe(
        filter(
          ([isAuthenticated, _]) => isAuthenticated
        ),
        last(),
        tap(async ([_,isTokenSent]) => {
          if(isTokenSent)
          await this._terminalService.write('Token an NodeRed gesendet');
          else
            await this._terminalService.error('Fehler beim Senden vom Token')
        })
      )
      .subscribe();
  }
}
