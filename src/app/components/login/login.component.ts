import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { NgTerminal } from 'ng-terminal';
import {
  Observable,
  Subscription,
  combineLatest,
  filter,
  first,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { AuthenticationState } from 'src/app/interfaces/authentication-state';
import { SpinnerState } from 'src/app/interfaces/spinner-state';
import { ApiService } from 'src/app/services/api.service';
import { TerminalService } from 'src/app/services/terminal.service';
import {
  selectAuthStatus,
  selectAuthToken,
} from 'src/app/stores/authentication/authentication.selector';
import { selectIsLoading } from 'src/app/stores/spinner/spinner.selector';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, AfterViewInit {
  isLoading$ = new Observable<boolean>();
  isAuthenticated$ = new Observable<boolean>();
  token$ = new Observable<string>();
  isTokenSent$ = new Observable<boolean>();
  @ViewChild('terminal', { static: false }) terminal!: NgTerminal;
  constructor(
    private _store: Store<{ spinner: SpinnerState; auth: AuthenticationState }>,
    private _terminalService: TerminalService
  ) {
    this.isLoading$ = this._store.pipe(map((state) => state.spinner.isLoading));
    this.isAuthenticated$ = this._store.pipe(
      map((state) => state.auth.isAuthenticated)
    );
    this.isTokenSent$ = this._store.pipe(map((state) => state.auth.tokenSent));
    this.token$ = this._store.pipe(map((state) => state.auth.token));
  }
  ngAfterViewInit(): void {
    this._terminalService.terminal = this.terminal;
    this._terminalService.underlying = this.terminal.underlying;
    this._terminalService.configure();
  }
  ngOnInit(): void {
    combineLatest([this.isAuthenticated$, this.token$])
      .pipe(
        filter(([isAuthenticated]) => isAuthenticated),
        first(),
        tap(async ([_, token]) => {
          this.terminal.underlying!.reset();
          await this._terminalService.write('Token received');
          await this._terminalService.write(token);
        })
      )
      .subscribe();

    combineLatest([this.isAuthenticated$, this.isTokenSent$])
      .pipe(
        filter(
          ([isAuthenticated, isTokenSent]) => isAuthenticated && isTokenSent
        ),
        first(),
        tap(async () => {
          await this._terminalService.write('Token sent to NodeRed');
        })
      )
      .subscribe();
  }
}
