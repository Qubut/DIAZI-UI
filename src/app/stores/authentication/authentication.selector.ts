import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthenticationState } from 'src/app/interfaces/authentication-state';

export const selectAuthState = createFeatureSelector<AuthenticationState>('authentication');

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthenticationState) => state.token
);

export const selectAuthStatus = createSelector(
  selectAuthState,
  (state: AuthenticationState) => {state.isAuthenticated}
);
