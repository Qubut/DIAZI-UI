import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { login, loginSuccess, loginFailure, sendToken, sendTokenSuccess, sendTokenFailure } from './authentication.actions';
import { ApiService } from 'src/app/services/api.service';

@Injectable()
export class AuthenticationEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      switchMap(({ username, password }) =>
        this.apiService.authenticate({ username, password }).pipe(
          mergeMap((response) => [
            loginSuccess({ token: response.token }),
            sendToken({ token: response.token }),
          ]),
          catchError((error) => of(loginFailure({ error })))
        )
      )
    )
  );

  sendToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(sendToken),
      switchMap(({ token }) =>
        this.apiService.sendToken(token).pipe(
          map(() => sendTokenSuccess()),
          catchError((error) => of(sendTokenFailure({ error })))
        )
      )
    )
  );

  constructor(private actions$: Actions, private apiService: ApiService) {}
}
